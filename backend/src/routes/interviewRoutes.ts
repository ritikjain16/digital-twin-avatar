import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { interviewSchema, interviewService } from "../services/interviewService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const interviewRoutes = Router();
interviewRoutes.use(requireAuth);

interviewRoutes.post(
  "/evaluate",
  asyncHandler(async (req, res) => {
    res.json(await interviewService.evaluate(req.user!.id, interviewSchema.parse(req.body)));
  })
);
