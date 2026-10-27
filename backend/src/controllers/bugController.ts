import type { NextFunction, Request, Response } from "express";
import bugService = require("../services/bugService");

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
