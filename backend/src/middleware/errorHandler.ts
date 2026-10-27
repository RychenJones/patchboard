import type { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  if (response.headersSent) {
    next(error);
    return;
  }

  const statusCode =
    typeof error?.statusCode === "number" && error.statusCode >= 400
      ? error.statusCode
      : 500;
  const message = statusCode === 500 ? "Internal server error." : error.message;

  response.status(statusCode).json({ error: message });
};

export = errorHandler;
