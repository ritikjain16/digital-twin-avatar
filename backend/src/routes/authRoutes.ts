import { Router } from "express";
import { authService, loginSchema, registerSchema } from "../services/authService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authRoutes = Router();

authRoutes.post(
  "/register",
  asyncHandler(async (req, res) => {
    res.status(201).json(await authService.register(registerSchema.parse(req.body)));
  })
);

authRoutes.post(
  "/login",
  asyncHandler(async (req, res) => {
    res.json(await authService.login(loginSchema.parse(req.body)));
  })
);
