import {
  createBug,
  createProject,
  getBugs,
  getDashboard,
  getProject,
  updateBug,
} from "./api";
import type {
  Bug,
  BugPriority,
  BugStatus,
  DashboardProject,
} from "./types";
import "./styles.css";

const appRoot = document.querySelector<HTMLDivElement>("#app");

if (!appRoot) {
  throw new Error("The application root was not found.");
}

const app = appRoot;

const priorityOrder: BugPriority[] = ["high", "medium", "low"];

function element<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  className?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tagName);
  if (className) {
    node.className = className;
  }
  return node;
}

function setText<T extends HTMLElement>(node: T, text: string): T {
  node.textContent = text;
  return node;
}

function withChildren<T extends HTMLElement>(node: T, ...children: Node[]): T {
  node.append(...children);
  return node;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function statusLabel(status: BugStatus): string {
  const labels: Record<BugStatus, string> = {
    incomplete: "Open",
    "in-progress": "In progress",
    completed: "Fixed",
  };
  return labels[status];
}

function showMessage(message: string, kind: "loading" | "error" | "empty"): void {
  app.replaceChildren(
    withChildren(element("main", `page-state ${kind}`),
      setText(element("p"), message),
    ),
  );
}

function createHeader(title: string, subtitle: string): HTMLElement {
  const header = element("header", "page-header");
  const copy = element("div");
  copy.append(setText(element("h1"), title));
  copy.append(setText(element("p", "page-subtitle"), subtitle));
  header.append(copy);
  return header;
}

function createPriorityBar(project: DashboardProject): HTMLElement {
  const bar = element("div", "priority-bar");
  const total = project.openBugCount;

  for (const priority of priorityOrder) {
    const segment = element("span", `priority-segment ${priority}`);
    const count = project.priorityCounts[priority];
    segment.style.width = total === 0 ? "0%" : `${(count / total) * 100}%`;
    segment.setAttribute("aria-label", `${count} ${priority} bugs`);
    bar.append(segment);
  }

  if (total === 0) {
    bar.classList.add("empty");
  }

  return bar;
}

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
  card.append(count);
  card.append(createPriorityBar(project));

  const summary = priorityOrder
    .filter((priority) => project.priorityCounts[priority] > 0)
    .map((priority) => `${project.priorityCounts[priority]} ${priority}`)
    .join(" · ");
  card.append(setText(element("p", "priority-summary"), summary || "No open bugs"));

  const nextUp = element("div", "next-up");
  nextUp.append(setText(element("span", "eyebrow"), "Next up"));
  nextUp.append(
    setText(element("span"), project.nextUp?.title ?? "All clear"),
  );
  card.append(nextUp);

  return card;
}

async function renderDashboard(): Promise<void> {
  showMessage("Loading projects…", "loading");

  try {
    const dashboard = await getDashboard();
    const main = element("main", "page-shell");
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
        await renderDashboard();
      } catch (error) {
        window.alert(error instanceof Error ? error.message : "Unable to create project.");
      }
    });
    header.append(newProjectButton);
    main.append(header);

    if (dashboard.projects.length === 0) {
      main.append(
        withChildren(element("section", "empty-panel"),
          setText(element("p"), "No projects yet. Create your first project to get started."),
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

    app.replaceChildren(main);
  } catch (error) {
    showMessage(
      error instanceof Error ? error.message : "Unable to load projects.",
      "error",
    );
  }
}

function createPriorityBadge(priority: BugPriority): HTMLElement {
  return setText(element("span", `priority-badge ${priority}`), priority);
}

function createStatusSelect(bug: Bug, onUpdated: () => Promise<void>): HTMLSelectElement {
  const select = element("select", "status-select");
  const statuses: BugStatus[] = ["incomplete", "in-progress", "completed"];
  for (const status of statuses) {
    const option = element("option");
    option.value = status;
    option.textContent = statusLabel(status);
    option.selected = bug.status === status;
    select.append(option);
  }

  select.addEventListener("change", async () => {
    select.disabled = true;
    try {
      await updateBug(bug.id, { status: select.value as BugStatus });
      await onUpdated();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Unable to update bug.");
      select.disabled = false;
    }
  });
  return select;
}

function createBugRow(bug: Bug, onUpdated: () => Promise<void>): HTMLTableRowElement {
  const row = element("tr");
  row.append(setText(element("td"), bug.title));
  row.append(withChildren(element("td"), createPriorityBadge(bug.priority)));
  row.append(withChildren(element("td"), createStatusSelect(bug, onUpdated)));
  row.append(setText(element("td", "date-cell"), formatDate(bug.createdAt)));
  return row;
}

async function renderProject(projectId: number): Promise<void> {
  showMessage("Loading project…", "loading");

  try {
    const [project, bugs] = await Promise.all([
      getProject(projectId),
      getBugs(projectId),
    ]);
    const openBugs = bugs.filter((bug) => bug.status !== "completed").length;
    const fixedBugs = bugs.length - openBugs;
    const main = element("main", "page-shell");

    const backLink = element("a", "back-link");
    backLink.href = "#/";
    backLink.textContent = "← All projects";
    main.append(backLink);

    const header = createHeader(
      project.name,
      `${openBugs} open · ${fixedBugs} fixed`,
    );
    main.append(header);

    const form = element("form", "quick-add");
    const titleInput = element("input");
    titleInput.type = "text";
    titleInput.placeholder = "Add a bug and press Enter…";
    titleInput.setAttribute("aria-label", "Bug title");
    titleInput.required = true;
    const prioritySelect = element("select");
    prioritySelect.setAttribute("aria-label", "Bug priority");
    for (const priority of priorityOrder.slice().reverse()) {
      const option = element("option");
      option.value = priority;
      option.textContent = priority.charAt(0).toUpperCase() + priority.slice(1);
      option.selected = priority === "medium";
      prioritySelect.append(option);
    }
    const addButton = element("button", "primary-button");
    addButton.type = "submit";
    addButton.textContent = "Add";
    form.append(titleInput, prioritySelect, addButton);
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      addButton.disabled = true;
      try {
        await createBug(
          projectId,
          titleInput.value.trim(),
          prioritySelect.value as BugPriority,
        );
        await renderProject(projectId);
      } catch (error) {
        window.alert(error instanceof Error ? error.message : "Unable to add bug.");
        addButton.disabled = false;
      }
    });
    main.append(form);

    if (bugs.length === 0) {
      main.append(
        withChildren(element("section", "empty-panel"),
          setText(element("p"), "No bugs logged for this project."),
        ),
      );
    } else {
      const tableWrapper = element("div", "table-wrapper");
      const table = element("table");
      const head = element("thead");
      const headerRow = element("tr");
      for (const heading of ["Title", "Priority", "Status", "Logged"]) {
        headerRow.append(setText(element("th"), heading));
      }
      head.append(headerRow);
      const body = element("tbody");
      const refresh = () => renderProject(projectId);
      for (const bug of bugs) {
        body.append(createBugRow(bug, refresh));
      }
      table.append(head, body);
      tableWrapper.append(table);
      main.append(tableWrapper);
    }

    app.replaceChildren(main);
  } catch (error) {
    showMessage(
      error instanceof Error ? error.message : "Unable to load project.",
      "error",
    );
  }
}

function renderRoute(): void {
  const match = window.location.hash.match(/^#\/projects\/(\d+)$/);
  if (match?.[1]) {
    void renderProject(Number(match[1]));
    return;
  }

  void renderDashboard();
}

window.addEventListener("hashchange", renderRoute);
renderRoute();
