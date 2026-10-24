import projectRepository = require("../repositories/projectRepository");
import type { CreateProjectInput, Project } from "../models/project";

class ProjectValidationError extends Error {
  readonly statusCode = 400;
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

function listProjects(): Promise<Project[]> {
  return projectRepository.listProjects();
}

export = { ProjectValidationError, createProject, listProjects };
