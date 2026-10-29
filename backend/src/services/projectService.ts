import AppError = require("../errors/appError");
import projectRepository = require("../repositories/projectRepository");
import type {
  CreateProjectInput,
  Project,
  UpdateProjectInput,
} from "../models/project";

class ProjectValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = "ProjectValidationError";
  }
}

class ProjectNotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
    this.name = "ProjectNotFoundError";
  }
}

function parseProjectId(projectId: unknown): number {
  if (typeof projectId !== "string" || !/^\d+$/.test(projectId)) {
    throw new ProjectValidationError("Project ID must be a positive integer.");
  }

  const parsedProjectId = Number(projectId);
  if (!Number.isSafeInteger(parsedProjectId) || parsedProjectId <= 0) {
    throw new ProjectValidationError("Project ID must be a positive integer.");
  }

  return parsedProjectId;
}

function validateProjectName(name: unknown): string {
  if (typeof name !== "string" || name.trim().length === 0) {
    throw new ProjectValidationError("Project name is required.");
  }

  return name.trim();
}

function createProject(input: Partial<CreateProjectInput>): Promise<Project> {
  const name = validateProjectName(input.name);
  return projectRepository.createProject(name);
}

function validateUpdateInput(input: unknown): UpdateProjectInput {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new ProjectValidationError("Project update must be a JSON object.");
  }

  const update = input as Record<string, unknown>;
  if (!Object.prototype.hasOwnProperty.call(update, "name")) {
    throw new ProjectValidationError(
      "Project name is required for an update.",
    );
  }

  return { name: validateProjectName(update.name) };
}

function listProjects(): Promise<Project[]> {
  return projectRepository.listProjects();
}

async function updateProject(
  projectIdInput: unknown,
  input: unknown,
): Promise<Project> {
  const projectId = parseProjectId(projectIdInput);
  const updates = validateUpdateInput(input);
  const project = await projectRepository.updateProject(projectId, updates);

  if (!project) {
    throw new ProjectNotFoundError("Project not found.");
  }

  return project;
}

async function getProject(projectIdInput: unknown): Promise<Project> {
  const projectId = parseProjectId(projectIdInput);
  const project = await projectRepository.getProject(projectId);

  if (!project) {
    throw new ProjectNotFoundError("Project not found.");
  }

  return project;
}

async function deleteProject(projectIdInput: unknown): Promise<void> {
  const projectId = parseProjectId(projectIdInput);
  const deleted = await projectRepository.deleteProject(projectId);

  if (!deleted) {
    throw new ProjectNotFoundError("Project not found.");
  }
}

export = {
  ProjectValidationError,
  ProjectNotFoundError,
  createProject,
  listProjects,
  updateProject,
  getProject,
  deleteProject,
};
