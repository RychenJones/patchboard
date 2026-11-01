import { createProject, getApiErrorMessage, getDashboard } from "../api";
import type { DashboardProject } from "../types";
import {
  element,
  setText,
  showInlineError,
  showMessage,
  withChildren,
} from "../utils/dom";
import { createBrandHeader } from "../utils/brand";
import { createThemeToggle } from "../utils/theme";
import { priorityLabel } from "../utils/formatting";
import type { BugPriority } from "../types";
const sharedPriorityModule = (await import("../../../shared/bugPriorities")).default;
const { BUG_PRIORITY_OPTIONS } = sharedPriorityModule;

const priorityOrder: BugPriority[] = [...BUG_PRIORITY_OPTIONS]
  .reverse()
  .map(([value]) => value);

// Build the page heading, subtitle, and theme controls.
function createHeader(title: string, subtitle: string): HTMLElement {
  const header = element("header", "page-header");
  const copy = element("div");
  copy.append(setText(element("h1"), title));
  copy.append(setText(element("p", "page-subtitle"), subtitle));
  const actions = element("div", "header-actions");
  actions.append(createThemeToggle());
  header.append(copy, actions);
  return header;
}

// Visualize the project's open bugs by priority.
function createPriorityBar(project: DashboardProject): HTMLElement {
  const bar = element("div", "priority-bar");
  const total = project.openBugCount;

  for (const priority of priorityOrder) {
    const segment = element("span", `priority-segment ${priority}`);
    const count = project.priorityCounts[priority];
    segment.style.width = total === 0 ? "0%" : `${(count / total) * 100}%`;
    segment.setAttribute("aria-label", `${count} ${priorityLabel(priority)} bugs`);
    bar.append(segment);
  }

  if (total === 0) {
    bar.classList.add("empty");
  }

  return bar;
}

// Build a clickable summary card for one project.
function createProjectCard(project: DashboardProject): HTMLElement {
  const card = element("button", "project-card");
  card.type = "button";
  card.addEventListener("click", () => {
    window.location.hash = `#/projects/${project.id}`;
  });

  card.append(setText(element("h2"), project.name));

  const count = element("p", "open-count");
  count.append(setText(element("strong"), String(project.openBugCount)));
  count.append(setText(element("span"), " open"));
  card.append(count, createPriorityBar(project));

  const summary = priorityOrder
    .filter((priority) => project.priorityCounts[priority] > 0)
    .map((priority) => `${project.priorityCounts[priority]} ${priorityLabel(priority)}`)
    .join(" · ");
  card.append(
    setText(element("p", "priority-summary"), summary || "No open bugs"),
  );

  const nextUp = element("div", "next-up");
  nextUp.append(setText(element("span", "eyebrow"), "Next up"));
  nextUp.append(
    setText(element("span"), project.nextUp?.title ?? "All clear"),
  );
  card.append(nextUp);

  return card;
}

// Load dashboard data and render the project overview.
export async function renderDashboard(root: HTMLDivElement): Promise<void> {
  // Show immediate feedback while the dashboard request is pending.
  showMessage(root, "Loading projects…", "loading");

  try {
    // Build the page from the returned project summaries.
    const dashboard = await getDashboard();
    const main = element("main", "page-shell");
    main.append(createBrandHeader());
    const header = createHeader(
      "Your projects",
      `${dashboard.totalOpenBugs} open bugs across ${dashboard.totalProjects} projects`,
    );
    const newProjectButton = element("button", "primary-button");
    newProjectButton.type = "button";
    setText(newProjectButton, "+ New project");
    newProjectButton.addEventListener("click", async () => {
      const name = window.prompt("Project name");
      if (!name?.trim()) return;
      try {
        await createProject(name.trim());
        await renderDashboard(root);
      } catch (error) {
        showInlineError(
          main,
          getApiErrorMessage(error, "Unable to create project."),
        );
      }
    });
    header.querySelector<HTMLDivElement>(".header-actions")?.append(
      newProjectButton,
    );
    main.append(header);

    if (dashboard.projects.length === 0) {
      main.append(
        withChildren(
          element("section", "empty-panel"),
          setText(
            element("p"),
            "No projects yet. Create your first project to get started.",
          ),
        ),
      );
    } else {
      const grid = element("section", "project-grid");
      grid.setAttribute("aria-label", "Projects");
      for (const project of dashboard.projects) {
        grid.append(createProjectCard(project));
      }
      main.append(grid);
    }

    root.replaceChildren(main);
  } catch (error) {
    showMessage(
      root,
      getApiErrorMessage(error, "Unable to load projects."),
      "error",
      { label: "Retry loading projects", onClick: () => void renderDashboard(root) },
    );
  }
}
