import {
  createBug,
  deleteBug,
  getBugs,
  getProject,
  updateBug,
  updateProject,
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

function createProjectEditDialog(
  projectId: number,
  currentName: string,
  onSaved: () => Promise<void>,
): HTMLDialogElement {
  const dialog = element("dialog", "project-edit-dialog");
  const titleId = `project-edit-title-${projectId}`;
  dialog.setAttribute("aria-labelledby", titleId);
  const heading = setText(element("h2"), "Edit project");
  heading.id = titleId;

  const form = element("form", "project-edit-form");
  const label = element("label", "edit-field");
  label.append(setText(element("span"), "Project name"));
  const input = element("input");
  input.type = "text";
  input.value = currentName;
  input.required = true;
  input.maxLength = 120;
  label.append(input);

  const errorMessage = element("p", "form-error");
  errorMessage.setAttribute("role", "alert");
  errorMessage.hidden = true;
  const actions = element("div", "edit-actions");
  const cancelButton = element("button", "secondary-button");
  cancelButton.type = "button";
  cancelButton.textContent = "Cancel";
  cancelButton.addEventListener("click", () => dialog.close());
  const saveButton = element("button", "primary-button");
  saveButton.type = "submit";
  saveButton.textContent = "Save changes";
  actions.append(cancelButton, saveButton);

  form.append(label, errorMessage, actions);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = input.value.trim();
    if (!name) {
      errorMessage.textContent = "Project name is required.";
      errorMessage.hidden = false;
      input.focus();
      return;
    }

    saveButton.disabled = true;
    cancelButton.disabled = true;
    errorMessage.hidden = true;
    try {
      await updateProject(projectId, name);
      dialog.close();
      await onSaved();
    } catch (error) {
      errorMessage.textContent =
        error instanceof Error ? error.message : "Unable to update project.";
      errorMessage.hidden = false;
      saveButton.disabled = false;
      cancelButton.disabled = false;
    }
  });

  dialog.append(heading, form);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  return dialog;
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

function createBugDetailsDialog(bug: Bug): HTMLDialogElement {
  const dialog = element("dialog", "bug-details-dialog");
  const titleId = `bug-details-title-${bug.id}`;
  dialog.setAttribute("aria-labelledby", titleId);

  const heading = setText(element("h2"), bug.title);
  heading.id = titleId;
  const description = setText(
    element("p", "bug-description"),
    bug.description ?? "No description provided.",
  );
  const details = element("dl", "bug-details-list");
  for (const { label, value } of [
    { label: "Priority", value: bug.priority },
    { label: "Status", value: statusLabel(bug.status) },
    { label: "Created", value: formatDate(bug.createdAt) },
    { label: "Updated", value: formatDate(bug.updatedAt) },
  ]) {
    details.append(
      setText(element("dt"), label),
      setText(element("dd"), value),
    );
  }

  const closeButton = element("button", "secondary-button");
  closeButton.type = "button";
  closeButton.textContent = "Close";
  closeButton.addEventListener("click", () => dialog.close());
  dialog.append(heading, description, details, closeButton);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  return dialog;
}

function createBugRow(
  bug: Bug,
  onUpdated: () => Promise<void>,
  onEdit: () => void,
  onDeleted: () => Promise<void>,
): HTMLTableRowElement {
  const row = element("tr");
  const titleCell = element("td");
  const titleButton = element("button", "bug-title-button");
  titleButton.type = "button";
  titleButton.textContent = bug.title;
  titleButton.setAttribute("aria-label", `View details for ${bug.title}`);
  const detailsDialog = createBugDetailsDialog(bug);
  titleButton.addEventListener("click", () => detailsDialog.showModal());
  titleCell.append(titleButton, detailsDialog);
  row.append(titleCell);
  row.append(withChildren(element("td"), createPriorityBadge(bug.priority)));
  row.append(
    withChildren(element("td"), createStatusSelect(bug, onUpdated)),
  );
  row.append(setText(element("td", "date-cell"), formatDate(bug.createdAt)));
  const actionCell = element("td", "bug-actions");
  const editButton = element("button", "secondary-button table-action");
  editButton.type = "button";
  editButton.textContent = "Edit";
  editButton.setAttribute("aria-label", `Edit ${bug.title}`);
  editButton.addEventListener("click", onEdit);
  const deleteButton = element("button", "delete-button");
  deleteButton.type = "button";
  deleteButton.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 21h8a2 2 0 0 0 2-2V7H6v12a2 2 0 0 0 2 2Zm7-11h1v9a1 1 0 0 1-1 1v-10ZM8 10h1v10H8V10Zm4 0h1v10h-1V10ZM15.5 4l-1-1h-5l-1 1H5v2h14V4h-3.5Z"/></svg>';
  deleteButton.title = "Delete bug";
  deleteButton.setAttribute("aria-label", `Delete ${bug.title}`);
  deleteButton.addEventListener("click", async () => {
    if (!window.confirm(`Delete “${bug.title}”? This cannot be undone.`)) {
      return;
    }

    editButton.disabled = true;
    deleteButton.disabled = true;
    try {
      await deleteBug(bug.id);
      await onDeleted();
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "Unable to delete bug.",
      );
      editButton.disabled = false;
      deleteButton.disabled = false;
    }
  });
  actionCell.append(editButton, deleteButton);
  row.append(actionCell);
  return row;
}

function createBugEditRow(
  bug: Bug,
  onSaved: () => Promise<void>,
  onCancel: () => void,
): HTMLTableRowElement {
  const row = element("tr", "bug-edit-row");
  const cell = element("td");
  cell.colSpan = 5;
  const form = element("form", "bug-edit-form");

  const titleLabel = element("label", "edit-field");
  titleLabel.append(setText(element("span"), "Title"));
  const titleInput = element("input");
  titleInput.type = "text";
  titleInput.value = bug.title;
  titleInput.required = true;
  titleInput.maxLength = 200;
  titleLabel.append(titleInput);

  const descriptionLabel = element("label", "edit-field");
  descriptionLabel.append(setText(element("span"), "Description"));
  const descriptionInput = element("textarea");
  descriptionInput.value = bug.description ?? "";
  descriptionInput.rows = 3;
  descriptionLabel.append(descriptionInput);

  const priorityLabel = element("label", "edit-field");
  priorityLabel.append(setText(element("span"), "Priority"));
  const prioritySelect = element("select");
  for (const priority of priorityOrder) {
    const option = element("option");
    option.value = priority;
    option.textContent = priority.charAt(0).toUpperCase() + priority.slice(1);
    option.selected = priority === bug.priority;
    prioritySelect.append(option);
  }
  priorityLabel.append(prioritySelect);

  const statusField = element("label", "edit-field");
  statusField.append(setText(element("span"), "Status"));
  const statusSelect = element("select");
  for (const status of [
    "incomplete",
    "in-progress",
    "completed",
  ] as BugStatus[]) {
    const option = element("option");
    option.value = status;
    option.textContent = statusLabel(status);
    option.selected = status === bug.status;
    statusSelect.append(option);
  }
  statusField.append(statusSelect);

  const actions = element("div", "edit-actions");
  const cancelButton = element("button", "secondary-button");
  cancelButton.type = "button";
  cancelButton.textContent = "Cancel";
  cancelButton.addEventListener("click", onCancel);
  const saveButton = element("button", "primary-button");
  saveButton.type = "submit";
  saveButton.textContent = "Save changes";
  actions.append(cancelButton, saveButton);

  const errorMessage = element("p", "form-error");
  errorMessage.setAttribute("role", "alert");
  errorMessage.hidden = true;
  form.append(
    titleLabel,
    descriptionLabel,
    priorityLabel,
    statusField,
    actions,
    errorMessage,
  );
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const title = titleInput.value.trim();
    if (!title) {
      errorMessage.textContent = "Bug title is required.";
      errorMessage.hidden = false;
      titleInput.focus();
      return;
    }

    saveButton.disabled = true;
    cancelButton.disabled = true;
    errorMessage.hidden = true;
    try {
      await updateBug(bug.id, {
        title,
        description: descriptionInput.value.trim() || null,
        priority: prioritySelect.value as BugPriority,
        status: statusSelect.value as BugStatus,
      });
      await onSaved();
    } catch (error) {
      errorMessage.textContent =
        error instanceof Error ? error.message : "Unable to update bug.";
      errorMessage.hidden = false;
      saveButton.disabled = false;
      cancelButton.disabled = false;
    }
  });

  cell.append(form);
  row.append(cell);
  titleInput.focus();
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
    const pageHeader = main.querySelector<HTMLElement>(".page-header");
    const editProjectButton = element("button", "secondary-button");
    editProjectButton.type = "button";
    editProjectButton.textContent = "Edit project";
    const editProjectDialog = createProjectEditDialog(
      project.id,
      project.name,
      async () => renderProject(root, projectId),
    );
    editProjectButton.addEventListener("click", () => {
      editProjectDialog.showModal();
      editProjectDialog.querySelector<HTMLInputElement>("input")?.focus();
    });
    pageHeader?.querySelector(".header-actions")?.append(editProjectButton);
    main.append(editProjectDialog);

    const form = element("form", "quick-add");
    const titleInput = element("input");
    titleInput.type = "text";
    titleInput.placeholder = "Add a bug and press Enter…";
    titleInput.setAttribute("aria-label", "Bug title");
    titleInput.required = true;
    const descriptionInput = element("textarea", "quick-add-description");
    descriptionInput.placeholder = "Description (optional)";
    descriptionInput.setAttribute("aria-label", "Bug description");
    descriptionInput.rows = 1;
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
    form.append(titleInput, descriptionInput, prioritySelect, addButton);
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      addButton.disabled = true;
      try {
        await createBug(
          projectId,
          titleInput.value.trim(),
          prioritySelect.value as BugPriority,
          descriptionInput.value.trim() || null,
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
      for (const heading of [
        "Title",
        "Priority",
        "Status",
        "Logged",
        "Actions",
      ]) {
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
          let editing = false;
          let editRow: HTMLTableRowElement | undefined;
          const enterEditMode = (): void => {
            if (editing) return;
            editing = true;
            editRow = createBugEditRow(bug, refresh, () => {
              editRow?.replaceWith(row);
              editing = false;
            });
            row.replaceWith(editRow);
          };
          const row = createBugRow(bug, refresh, enterEditMode, refresh);
          body.append(row);
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
