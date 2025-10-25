import { create } from "zustand";
import type { User } from "../types/entity.types";

interface AuthStore {
  token: string | null;
  user: User | null;
  signedOut: boolean;
  signin: (token: string, user: User) => void;
  signout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  user: null,
  signedOut: false,
  signin: (token, user) => set({ token, user, signedOut: false }),
  signout: () => set({ token: null, user: null, signedOut: true }),
}));
