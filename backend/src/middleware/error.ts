import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { logger } from "../config/logger.js";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({ message: "Validation failed", issues: error.issues });
    return;
  }

  if (typeof error?.status === "number") {
    res.status(error.status).json({ message: error.message });
    return;
  }

  logger.error(error);
  res.status(500).json({ message: "Unexpected server error" });
};
