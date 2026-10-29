import {
  createBug,
  getBugs,
  getProject,
  updateBug,
} from "../api";
import type { Bug, BugPriority, BugStatus } from "../types";
import { element, setText, showMessage, withChildren } from "../utils/dom";
import { formatDate, statusLabel } from "../utils/formatting";
import { createThemeToggle } from "../utils/theme";

const priorityOrder: BugPriority[] = ["high", "medium", "low"];

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

function createPriorityBadge(priority: BugPriority): HTMLElement {
  return setText(element("span", `priority-badge ${priority}`), priority);
}

function createStatusSelect(
  bug: Bug,
  onUpdated: () => Promise<void>,
): HTMLSelectElement {
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
      window.alert(
        error instanceof Error ? error.message : "Unable to update bug.",
      );
      select.disabled = false;
    }
  });
  return select;
}

function createBugRow(
  bug: Bug,
  onUpdated: () => Promise<void>,
): HTMLTableRowElement {
  const row = element("tr");
  row.append(setText(element("td"), bug.title));
  row.append(withChildren(element("td"), createPriorityBadge(bug.priority)));
  row.append(
    withChildren(element("td"), createStatusSelect(bug, onUpdated)),
  );
  row.append(setText(element("td", "date-cell"), formatDate(bug.createdAt)));
  return row;
}

export async function renderProject(
  root: HTMLDivElement,
  projectId: number,
): Promise<void> {
  showMessage(root, "Loading project…", "loading");

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

    main.append(
      createHeader(project.name, `${openBugs} open · ${fixedBugs} fixed`),
    );

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
        await renderProject(root, projectId);
      } catch (error) {
        window.alert(
          error instanceof Error ? error.message : "Unable to add bug.",
        );
        addButton.disabled = false;
      }
    });
    main.append(form);

    if (bugs.length === 0) {
      main.append(
        withChildren(
          element("section", "empty-panel"),
          setText(element("p"), "No bugs logged for this project."),
        ),
      );
    } else {
      const searchLabel = element("label", "search-field");
      searchLabel.append(setText(element("span"), "Search bugs by title"));
      const searchInput = element("input");
      searchInput.type = "search";
      searchInput.placeholder = "Search bugs…";
      searchInput.setAttribute("aria-label", "Search bugs by title");
      searchLabel.append(searchInput);
      main.append(searchLabel);

      const filters = element("fieldset", "bug-filters");
      filters.append(setText(element("legend"), "Filter bugs"));

      const statusFilterLabel = element("label", "filter-field");
      statusFilterLabel.append(setText(element("span"), "Status"));
      const statusFilter = element("select");
      statusFilter.setAttribute("aria-label", "Filter bugs by status");
      for (const [value, label] of [
        ["all", "All statuses"],
        ["incomplete", "Incomplete"],
        ["in-progress", "In progress"],
        ["completed", "Completed"],
      ] as const) {
        const option = element("option");
        option.value = value;
        option.textContent = label;
        statusFilter.append(option);
      }
      statusFilterLabel.append(statusFilter);

      const priorityFilterLabel = element("label", "filter-field");
      priorityFilterLabel.append(setText(element("span"), "Priority"));
      const priorityFilter = element("select");
      priorityFilter.setAttribute("aria-label", "Filter bugs by priority");
      for (const [value, label] of [
        ["all", "All priorities"],
        ["high", "High"],
        ["medium", "Medium"],
        ["low", "Low"],
      ] as const) {
        const option = element("option");
        option.value = value;
        option.textContent = label;
        priorityFilter.append(option);
      }
      priorityFilterLabel.append(priorityFilter);

      const completionFilterLabel = element("label", "filter-field");
      completionFilterLabel.append(setText(element("span"), "Completion"));
      const completionFilter = element("select");
      completionFilter.setAttribute(
        "aria-label",
        "Filter bugs by completion",
      );
      for (const [value, label] of [
        ["all", "Open and completed"],
        ["open", "Open bugs"],
        ["completed", "Completed bugs"],
      ] as const) {
        const option = element("option");
        option.value = value;
        option.textContent = label;
        completionFilter.append(option);
      }
      completionFilterLabel.append(completionFilter);

      const clearFiltersButton = element("button", "secondary-button");
      clearFiltersButton.type = "button";
      clearFiltersButton.textContent = "Clear filters";
      clearFiltersButton.addEventListener("click", () => {
        searchInput.value = "";
        statusFilter.value = "all";
        priorityFilter.value = "all";
        completionFilter.value = "all";
        renderRows();
        searchInput.focus();
      });
      filters.append(
        statusFilterLabel,
        priorityFilterLabel,
        completionFilterLabel,
        clearFiltersButton,
      );
      main.append(filters);

      const tableWrapper = element("div", "table-wrapper");
      const table = element("table");
      const head = element("thead");
      const headerRow = element("tr");
      for (const heading of ["Title", "Priority", "Status", "Logged"]) {
        headerRow.append(setText(element("th"), heading));
      }
      head.append(headerRow);
      const body = element("tbody");
      const refresh = () => renderProject(root, projectId);

      const renderRows = (): void => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const matchingBugs = bugs.filter((bug) =>
          bug.title.toLowerCase().includes(searchTerm) &&
          (statusFilter.value === "all" || bug.status === statusFilter.value) &&
          (priorityFilter.value === "all" ||
            bug.priority === priorityFilter.value) &&
          (completionFilter.value === "all" ||
            (completionFilter.value === "completed"
              ? bug.status === "completed"
              : bug.status !== "completed")),
        );

        body.replaceChildren();
        if (matchingBugs.length === 0) {
          const emptyRow = element("tr", "search-empty-row");
          const emptyCell = setText(
            element("td"),
            "No bugs match your search and filters.",
          );
          emptyCell.colSpan = 4;
          emptyRow.append(emptyCell);
          body.append(emptyRow);
          return;
        }

        for (const bug of matchingBugs) {
          body.append(createBugRow(bug, refresh));
        }
      };

      searchInput.addEventListener("input", renderRows);
      statusFilter.addEventListener("change", renderRows);
      priorityFilter.addEventListener("change", renderRows);
      completionFilter.addEventListener("change", renderRows);
      renderRows();
      table.append(head, body);
      tableWrapper.append(table);
      main.append(tableWrapper);
    }

    root.replaceChildren(main);
  } catch (error) {
    showMessage(
      root,
      error instanceof Error ? error.message : "Unable to load project.",
      "error",
    );
  }
}
