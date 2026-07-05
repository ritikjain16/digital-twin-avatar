# Architecture

Digital Twin Avatar is split into a presentation client, an API service, PostgreSQL persistence, and a vector retrieval layer.

## Data Flow

1. A user authenticates and uploads documents or source URLs.
2. The API extracts raw text, structured profile facts, projects, skills, education, and achievements.
3. Text is chunked with overlap and embedded.
4. Embeddings are persisted to ChromaDB when configured and mirrored in PostgreSQL for auditability.
5. Chat, recruiter, portfolio, and interview requests retrieve relevant chunks and conversation memory.
6. Prompt templates constrain the answer to the selected mode.
7. The client streams tokens, drives avatar emotion, and optionally converts speech to and from audio.

## Reliability

- Provider clients fail closed to deterministic local responses when keys are missing.
- API inputs are validated with Zod.
- Auth routes issue short-lived JWTs.
- Upload processing is isolated in services so queue workers can be introduced without changing route contracts.
