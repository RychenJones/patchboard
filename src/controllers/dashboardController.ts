import type { NextFunction, Request, Response } from "express";
import dashboardService = require("../services/dashboardService");

async function getDashboard(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const dashboard = await dashboardService.getDashboard();
    response.status(200).json(dashboard);
  } catch (error) {
    next(error);
  }
}

export = { getDashboard };
