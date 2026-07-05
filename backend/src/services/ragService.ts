import { prisma } from "../config/prisma.js";
import type { RetrievedChunk } from "../types.js";
import { cosineSimilarity, embeddingService } from "./embeddingService.js";

export const ragService = {
  async retrieve(userId: string, query: string, limit = 6): Promise<RetrievedChunk[]> {
    const queryEmbedding = await embeddingService.embed(query);
    const chunks = await prisma.chunk.findMany({
      where: { document: { userId } },
      include: { document: { select: { title: true, source: true } } },
      take: 300,
      orderBy: { createdAt: "desc" }
    });

    return chunks
      .map((chunk) => ({
        id: chunk.id,
        content: chunk.content,
        score: cosineSimilarity(queryEmbedding, chunk.embedding as number[]),
        title: chunk.document.title,
        source: chunk.document.source
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
};
