import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

type AuthState = {
  user?: AuthUser;
  token?: string;
  setSession: (user: AuthUser, token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      setSession: (user, token) => set({ user, token }),
      logout: () => set({ user: undefined, token: undefined })
    }),
    { name: "digital-twin-session" }
  )
);
