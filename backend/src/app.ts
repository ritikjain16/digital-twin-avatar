import cors from "cors";
import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { errorHandler } from "./middleware/error.js";
import { authRoutes } from "./routes/authRoutes.js";
import { chatRoutes } from "./routes/chatRoutes.js";
import { documentRoutes } from "./routes/documentRoutes.js";
import { interviewRoutes } from "./routes/interviewRoutes.js";
import { voiceRoutes } from "./routes/voiceRoutes.js";

export const createApp = () => {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
  app.use(express.json({ limit: "2mb" }));
  app.use(pinoHttp({ logger }));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "digital-twin-avatar" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/documents", documentRoutes);
  app.use("/api/chat", chatRoutes);
  app.use("/api/interview", interviewRoutes);
  app.use("/api/voice", voiceRoutes);
  app.use(errorHandler);
  return app;
};
