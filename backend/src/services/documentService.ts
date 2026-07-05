import fs from "node:fs/promises";
import path from "node:path";
import * as cheerio from "cheerio";
import pdf from "pdf-parse";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { embeddingService } from "./embeddingService.js";

export const urlIngestSchema = z.object({
  url: z.string().url(),
  kind: z.enum(["portfolio", "linkedin", "github"])
});

const chunkText = (text: string, size = 1200, overlap = 180) => {
  const clean = text.replace(/\s+/g, " ").trim();
  const chunks: string[] = [];
  for (let start = 0; start < clean.length; start += size - overlap) {
    const chunk = clean.slice(start, start + size).trim();
    if (chunk.length > 80) chunks.push(chunk);
  }
  return chunks;
};

const extractMetadata = (text: string) => {
  const skillMatches = text.match(/\b(TypeScript|React|Node\.js|Python|AWS|Docker|PostgreSQL|Prisma|LangChain|OpenAI|Java|C\+\+|Kubernetes)\b/gi) ?? [];
  const projectMatches = text.match(/(?:project|built|developed|created)\s+([A-Z][A-Za-z0-9 -]{2,60})/g) ?? [];
  return {
    skills: [...new Set(skillMatches.map((skill) => skill.toLowerCase()))],
    projects: projectMatches.slice(0, 12),
    wordCount: text.split(/\s+/).filter(Boolean).length
  };
};

const readUploadText = async (file: Express.Multer.File) => {
  const buffer = await fs.readFile(file.path);
  const extension = path.extname(file.originalname).toLowerCase();
  if (extension === ".pdf") {
    const parsed = await pdf(buffer);
    return parsed.text;
  }
  return buffer.toString("utf8");
};

const persistDocument = async (userId: string, title: string, source: string, kind: string, text: string) => {
  const metadata = extractMetadata(text);
  const chunks = chunkText(text);
  const document = await prisma.document.create({
    data: { userId, title, source, kind, text, metadata }
  });

  for (const [index, content] of chunks.entries()) {
    const embedding = await embeddingService.embed(content);
    await prisma.chunk.create({
      data: {
        documentId: document.id,
        content,
        embedding,
        metadata: { index, source, title, kind }
      }
    });
  }

  return { document, chunks: chunks.length, metadata };
};

export const documentService = {
  async ingestUpload(userId: string, file: Express.Multer.File, kind = "document") {
    const text = await readUploadText(file);
    return persistDocument(userId, file.originalname, file.originalname, kind, text);
  },

  async ingestUrl(userId: string, input: z.infer<typeof urlIngestSchema>) {
    const response = await fetch(input.url);
    if (!response.ok) throw new Error(`Unable to fetch ${input.url}`);
    const html = await response.text();
    const $ = cheerio.load(html);
    $("script, style, nav, footer").remove();
    const title = $("title").text().trim() || input.url;
    const text = $("body").text();
    return persistDocument(userId, title, input.url, input.kind, text);
  },

  async list(userId: string) {
    return prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, source: true, kind: true, metadata: true, createdAt: true }
    });
  }
};
