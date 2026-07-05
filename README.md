# Digital Twin Avatar

AI-powered digital twin platform that learns from resumes, LinkedIn profiles, portfolios, GitHub repositories, certificates, and uploaded documents. It provides grounded chat, interview practice, recruiter Q&A, portfolio explanations, voice input/output, and a realtime 3D digital human interface.

## Architecture

- `frontend`: React 19, Vite, TypeScript, TailwindCSS, React Router, Zustand, TanStack Query, Framer Motion, GSAP, Three.js, React Three Fiber, Drei, and Web Speech APIs.
- `backend`: Node.js, Express, TypeScript, Prisma, PostgreSQL, JWT auth, document ingestion, semantic retrieval, streaming chat, and provider integrations for OpenAI, Gemini, ChromaDB, and ElevenLabs.
- `docker`: production Dockerfiles for frontend and backend.
- `.github/workflows`: CI for lint, typecheck, test, and build.

## Features

- Email/JWT auth with OAuth-ready provider fields.
- Resume, certificate, portfolio, GitHub, LinkedIn, Markdown, TXT, DOCX, and PDF ingestion.
- Document chunking, metadata extraction, embeddings, vector search, memory, and conversation history.
- Streaming chat with Markdown-ready responses and grounded citations.
- Interview mode with technical, communication, and confidence scoring.
- Recruiter mode constrained to uploaded knowledge.
- Portfolio mode for project architecture and tradeoff explanations.
- Realtime avatar shell with idle motion, blinking, head tracking, emotion states, and speech hooks.
- Web Speech recognition, ElevenLabs TTS endpoint, and interruptible voice state on the client.

## Setup

```bash
cp .env.example .env
npm install
npm run build
npm run dev
```

Run supporting services:

```bash
docker compose up postgres chroma
```

Apply the database schema:

```bash
npm run prisma:migrate --workspace backend
```

## Deployment

- Frontend: Vercel, using `frontend` as the project root and `npm run build`.
- Backend: Render, using `backend` as the service root and `npm run start`.
- Database: Supabase PostgreSQL.
- Vector database: ChromaDB using `CHROMA_URL`.

## Screenshots

Screenshots are generated from the running app during release validation and should be added to `docs/screenshots`.

## Roadmap

- Ready Player Me account linking.
- Fine-grained source confidence visualization.
- Realtime phoneme-level lip sync from ElevenLabs timestamps.
- Organization workspaces and recruiter share links.
