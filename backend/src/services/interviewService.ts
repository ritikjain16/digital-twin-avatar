import { z } from "zod";
import { ragService } from "./ragService.js";

export const interviewSchema = z.object({
  role: z.string().min(2),
  answer: z.string().min(1),
  question: z.string().min(1)
});

export const interviewService = {
  async evaluate(userId: string, input: z.infer<typeof interviewSchema>) {
    const context = await ragService.retrieve(userId, `${input.role} ${input.question} ${input.answer}`, 4);
    const keywordHits = context.reduce((count, chunk) => count + (input.answer.toLowerCase().includes(chunk.title.toLowerCase()) ? 1 : 0), 0);
    const technicalScore = Math.min(98, 58 + context.length * 7 + keywordHits * 5);
    const communicationScore = Math.min(96, 50 + Math.round(input.answer.split(/\s+/).length / 4));
    const confidenceScore = Math.round((technicalScore + communicationScore) / 2);

    return {
      technicalScore,
      communicationScore,
      confidenceScore,
      feedback: [
        "Anchor the answer in a concrete project outcome.",
        "Name the technical tradeoff and why it was appropriate.",
        "Close with measurable impact or what you learned."
      ],
      nextQuestion: `Tell me about a difficult ${input.role} problem where you had to balance speed, quality, and long-term maintainability.`,
      sources: context
    };
  }
};
