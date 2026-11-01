import type { NextFunction, Request, Response } from "express";
import bugService = require("../services/bugService");

// Create a bug and return the new record to the client.
async function createBug(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const bug = await bugService.createBug(
      request.params.projectId,
      request.body ?? {},
    );
    response.status(201).json(bug);
  } catch (error) {
    next(error);
  }
}

// List all bugs that belong to the requested project.
async function listBugs(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const bugs = await bugService.listBugs(request.params.projectId);
    response.status(200).json(bugs);
  } catch (error) {
    next(error);
  }
}

// Apply requested changes to an existing bug.
async function updateBug(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const bug = await bugService.updateBug(
      request.params.bugId,
      request.body,
    );
    response.status(200).json(bug);
  } catch (error) {
    next(error);
  }
}

// Delete a bug and return an empty successful response.
async function deleteBug(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await bugService.deleteBug(request.params.bugId);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
}

export = { createBug, listBugs, updateBug, deleteBug };
