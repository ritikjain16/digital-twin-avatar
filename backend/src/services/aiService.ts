import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { env } from "../config/env.js";
import type { RetrievedChunk, TwinMode } from "../types.js";

const openai = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : undefined;
const gemini = env.GEMINI_API_KEY ? new GoogleGenerativeAI(env.GEMINI_API_KEY) : undefined;

const modeInstruction: Record<TwinMode, string> = {
  chat: "Answer as the user's digital twin. Be natural, specific, and grounded in memory.",
  interview: "Act as an interview coach. Ask sharp follow-up questions and evaluate answers with evidence.",
  recruiter: "Answer as the user's representative. Only use uploaded evidence and say when evidence is missing.",
  portfolio: "Explain projects, architecture, technical decisions, tradeoffs, challenges, and outcomes clearly."
};

const composePrompt = (mode: TwinMode, message: string, context: RetrievedChunk[]) => `
${modeInstruction[mode]}

Retrieved memory:
${context.map((chunk, index) => `[${index + 1}] ${chunk.title}: ${chunk.content}`).join("\n\n")}

User message:
${message}

Return a helpful answer with concise source notes when context was used.
`;

const localAnswer = (mode: TwinMode, message: string, context: RetrievedChunk[]) => {
  const evidence = context.slice(0, 3).map((chunk) => `- ${chunk.title}: ${chunk.content.slice(0, 220)}`).join("\n");
  const prefix =
    mode === "recruiter"
      ? "Based on the uploaded profile evidence, "
      : mode === "interview"
        ? "Here is a focused interview response and coaching note. "
        : mode === "portfolio"
          ? "Here is the project-focused explanation. "
          : "Here is what I know from your digital twin memory. ";

  return `${prefix}${message.trim() ? `You asked: "${message.trim()}".` : "Ask me anything about the profile."}

${evidence || "No uploaded evidence is available yet. Upload a resume, portfolio, or repository to ground the twin."}`;
};

export const aiService = {
  async complete(mode: TwinMode, message: string, context: RetrievedChunk[]) {
    const prompt = composePrompt(mode, message, context);

    if (openai) {
      const response = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.45
      });
      return response.choices[0].message.content ?? "";
    }

    if (gemini) {
      const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
      const response = await model.generateContent(prompt);
      return response.response.text();
    }

    return localAnswer(mode, message, context);
  },

  async *stream(mode: TwinMode, message: string, context: RetrievedChunk[]) {
    const answer = await this.complete(mode, message, context);
    const tokens = answer.match(/\S+\s*/g) ?? [];
    for (const token of tokens) {
      yield token;
    }
  }
};
