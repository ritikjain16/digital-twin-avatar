export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

export type TwinMode = "chat" | "interview" | "recruiter" | "portfolio";

export type RetrievedChunk = {
  id: string;
  content: string;
  score: number;
  source: string;
  title: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
