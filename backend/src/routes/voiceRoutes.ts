import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { voiceService } from "../services/voiceService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const voiceRoutes = Router();
voiceRoutes.use(requireAuth);

voiceRoutes.post(
  "/tts",
  asyncHandler(async (req, res) => {
    const { text } = z.object({ text: z.string().min(1).max(3000) }).parse(req.body);
    const audio = await voiceService.synthesize(text);
    res.setHeader("content-type", audio.contentType);
    res.send(audio.body);
  })
);
