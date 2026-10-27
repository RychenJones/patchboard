import bugRepository = require("../repositories/bugRepository");
import type {
  Bug,
  BugStatus,
  CreateBugInput,
  UpdateBugInput,
} from "../models/bug";

class BugValidationError extends Error {
  readonly statusCode = 400;
}

class ProjectNotFoundError extends Error {
  readonly statusCode = 404;
}

class BugNotFoundError extends Error {
  readonly statusCode = 404;
}

function parseId(value: unknown, label: string): number {
  if (typeof value !== "string" || !/^\d+$/.test(value)) {
    throw new BugValidationError(`${label} must be a positive integer.`);
  }

  const parsedId = Number(value);
  if (!Number.isSafeInteger(parsedId) || parsedId <= 0) {
    throw new BugValidationError(`${label} must be a positive integer.`);
  }

  return parsedId;
}

function validateTitle(title: unknown): string {
  if (typeof title !== "string" || title.trim().length === 0) {
    throw new BugValidationError("Bug title is required.");
  }

  return title.trim();
}

function validateDescription(description: unknown): string | null {
  if (description === undefined || description === null) {
    return null;
  }

  if (typeof description !== "string") {
    throw new BugValidationError("Bug description must be a string.");
  }

  return description.trim() || null;
}

function validateStatus(status: unknown): BugStatus {
  if (
    status !== undefined &&
    status !== "incomplete" &&
    status !== "in-progress" &&
    status !== "completed"
  ) {
    throw new BugValidationError(
      "Bug status must be incomplete, in-progress, or completed.",
    );
  }

  return status ?? "incomplete";
}

function validateUpdateInput(input: unknown): UpdateBugInput {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new BugValidationError("Bug update must be a JSON object.");
  }

  const update = input as Record<string, unknown>;
  const hasTitle = Object.prototype.hasOwnProperty.call(update, "title");
  const hasDescription = Object.prototype.hasOwnProperty.call(
    update,
    "description",
  );
  const hasStatus = Object.prototype.hasOwnProperty.call(update, "status");

  if (!hasTitle && !hasDescription && !hasStatus) {
    throw new BugValidationError(
      "At least one of title, description, or status is required.",
    );
  }

  const validatedUpdate: UpdateBugInput = {};

  if (hasTitle) {
    validatedUpdate.title = validateTitle(update.title);
  }

  if (hasDescription) {
    validatedUpdate.description = validateDescription(update.description);
  }

  if (hasStatus) {
    validatedUpdate.status = validateStatus(update.status);
  }

  return validatedUpdate;
}

async function ensureProjectExists(projectId: number): Promise<void> {
  if (!(await bugRepository.projectExists(projectId))) {
    throw new ProjectNotFoundError("Project not found.");
  }
}

async function createBug(
  projectIdInput: unknown,
  input: Partial<CreateBugInput>,
): Promise<Bug> {
  const projectId = parseId(projectIdInput, "Project ID");
  await ensureProjectExists(projectId);

  const title = validateTitle(input.title);
  const description = validateDescription(input.description);
  const status = validateStatus(input.status);

  return bugRepository.createBug(projectId, title, description, status);
}

async function listBugs(projectIdInput: unknown): Promise<Bug[]> {
  const projectId = parseId(projectIdInput, "Project ID");
  await ensureProjectExists(projectId);
  return bugRepository.listBugs(projectId);
}

async function updateBug(
  bugIdInput: unknown,
  input: unknown,
): Promise<Bug> {
  const bugId = parseId(bugIdInput, "Bug ID");
  const updates = validateUpdateInput(input);
  const bug = await bugRepository.updateBug(bugId, updates);

  if (!bug) {
    throw new BugNotFoundError("Bug not found.");
  }

  return bug;
}

async function deleteBug(bugIdInput: unknown): Promise<void> {
  const bugId = parseId(bugIdInput, "Bug ID");
  const deleted = await bugRepository.deleteBug(bugId);

  if (!deleted) {
    throw new BugNotFoundError("Bug not found.");
  }
}

export = {
  BugValidationError,
  ProjectNotFoundError,
  BugNotFoundError,
  createBug,
  listBugs,
  updateBug,
  deleteBug,
};
