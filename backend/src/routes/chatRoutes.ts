import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { aiService } from "../services/aiService.js";
import { chatSchema, chatService } from "../services/chatService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const chatRoutes = Router();
chatRoutes.use(requireAuth);

chatRoutes.get(
  "/history",
  asyncHandler(async (req, res) => {
    res.json(await chatService.history(req.user!.id));
  })
);

chatRoutes.post(
  "/",
  asyncHandler(async (req, res) => {
    res.json(await chatService.answer(req.user!.id, chatSchema.parse(req.body)));
  })
);

chatRoutes.post(
  "/stream",
  asyncHandler(async (req, res) => {
    const input = chatSchema.parse(req.body);
    const { conversation, context } = await chatService.prepare(req.user!.id, input.message, input.mode, input.conversationId);
    res.writeHead(200, {
      "content-type": "text/event-stream",
      "cache-control": "no-cache",
      connection: "keep-alive"
    });

    let content = "";
    for await (const token of aiService.stream(input.mode, input.message, context)) {
      content += token;
      res.write(`data: ${JSON.stringify({ token, conversationId: conversation.id })}\n\n`);
    }
    await chatService.saveAssistantMessage(conversation.id, content, context);
    res.write(`data: ${JSON.stringify({ done: true, sources: context })}\n\n`);
    res.end();
  })
);
