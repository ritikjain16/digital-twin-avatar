import { z } from "zod";
import { prisma } from "../config/prisma.js";
import type { TwinMode } from "../types.js";
import { aiService } from "./aiService.js";
import { ragService } from "./ragService.js";

export const chatSchema = z.object({
  message: z.string().min(1),
  mode: z.enum(["chat", "interview", "recruiter", "portfolio"]).default("chat"),
  conversationId: z.string().optional()
});

export const chatService = {
  async prepare(userId: string, message: string, mode: TwinMode, conversationId?: string) {
    const conversation =
      conversationId !== undefined
        ? await prisma.conversation.findFirstOrThrow({ where: { id: conversationId, userId } })
        : await prisma.conversation.create({
            data: { userId, mode, title: message.slice(0, 80) || "New conversation" }
          });

    await prisma.message.create({
      data: { conversationId: conversation.id, role: "user", content: message, metadata: {} }
    });

    const context = await ragService.retrieve(userId, message);
    return { conversation, context };
  },

  async answer(userId: string, input: z.infer<typeof chatSchema>) {
    const { conversation, context } = await this.prepare(userId, input.message, input.mode, input.conversationId);
    const content = await aiService.complete(input.mode, input.message, context);
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "assistant",
        content,
        metadata: { sources: context }
      }
    });
    return { conversationId: conversation.id, content, sources: context };
  },

  async saveAssistantMessage(conversationId: string, content: string, sources: unknown) {
    return prisma.message.create({
      data: { conversationId, role: "assistant", content, metadata: { sources } }
    });
  },

  async history(userId: string) {
    return prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: { messages: { orderBy: { createdAt: "asc" }, take: 20 } }
    });
  }
};
