import OpenAI from "openai";
import { env } from "../config/env.js";

const openai = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : undefined;

const localEmbedding = (text: string) => {
  const vector = new Array<number>(384).fill(0);
  for (let i = 0; i < text.length; i += 1) {
    vector[i % vector.length] += text.charCodeAt(i) / 255;
  }
  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
  return vector.map((value) => value / magnitude);
};

export const cosineSimilarity = (a: number[], b: number[]) => {
  const length = Math.min(a.length, b.length);
  let dot = 0;
  let ma = 0;
  let mb = 0;
  for (let i = 0; i < length; i += 1) {
    dot += a[i] * b[i];
    ma += a[i] * a[i];
    mb += b[i] * b[i];
  }
  return dot / ((Math.sqrt(ma) || 1) * (Math.sqrt(mb) || 1));
};

export const embeddingService = {
  async embed(text: string) {
    if (!openai) return localEmbedding(text);
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text.slice(0, 8000)
    });
    return response.data[0].embedding;
  }
};
