import type { NextFunction, Request, Response } from "express";
import projectService = require("../services/projectService");

async function createProject(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const project = await projectService.createProject(request.body ?? {});
    response.status(201).json(project);
  } catch (error) {
    next(error);
  }
}

async function listProjects(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const projects = await projectService.listProjects();
    response.status(200).json(projects);
  } catch (error) {
    next(error);
  }
}

export = { createProject, listProjects };
