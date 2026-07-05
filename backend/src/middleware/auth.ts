import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { AuthUser } from "../types.js";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.header("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  try {
    req.user = jwt.verify(token, env.JWT_SECRET) as AuthUser;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
