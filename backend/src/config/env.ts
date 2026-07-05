import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(8080),
  CLIENT_URL: z.string().url().default("http://localhost:5173"),
  DATABASE_URL: z.string().min(1).default("postgresql://postgres:postgres@localhost:5432/digital_twin"),
  JWT_SECRET: z.string().min(24).default("development-secret-value-change-me"),
  OPENAI_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  ELEVENLABS_API_KEY: z.string().optional(),
  ELEVENLABS_VOICE_ID: z.string().optional(),
  CHROMA_URL: z.string().url().default("http://localhost:8000")
});

export const env = envSchema.parse(process.env);
