import { env } from "../config/env.js";

export const voiceService = {
  async synthesize(text: string) {
    if (!env.ELEVENLABS_API_KEY || !env.ELEVENLABS_VOICE_ID) {
      return {
        contentType: "application/json",
        body: Buffer.from(JSON.stringify({ message: "ElevenLabs is not configured", text }))
      };
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${env.ELEVENLABS_VOICE_ID}/stream`, {
      method: "POST",
      headers: {
        "xi-api-key": env.ELEVENLABS_API_KEY,
        "content-type": "application/json",
        accept: "audio/mpeg"
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.35 }
      })
    });

    if (!response.ok || !response.body) throw new Error("Unable to synthesize speech");
    const body = Buffer.from(await response.arrayBuffer());
    return { contentType: "audio/mpeg", body };
  }
};
