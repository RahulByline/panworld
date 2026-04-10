import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { School, User } from "../types/domain";
import { demoAccounts } from "../mock/accounts";

type AuthState = {
  user: User | null;
  school: School | null;
  publisher: { id: string; name: string } | null;
  bootstrapped: boolean;

  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  bootstrap: () => Promise<void>;
  setLanguage: (lng: "en" | "ar") => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      school: null,
      publisher: null,
      bootstrapped: false,

      login: async (email, password, rememberMe) => {
        void rememberMe;
        const acct = demoAccounts.find((a) => a.email.toLowerCase() === email.toLowerCase()) ?? null;
        if (!acct || acct.password !== password) throw new Error("Invalid credentials");
        set({ user: acct.user, school: acct.school, publisher: acct.publisher });
      },

      bootstrap: async () => {
        // Static demo: state is rehydrated from localStorage by zustand persist.
        // We just mark the app ready.
        set({ bootstrapped: true });
      },

      logout: async () => {
        set({ user: null, school: null, publisher: null });
      },

      setLanguage: (lng) => {
        const { user } = get();
        if (!user) return;
        set({ user: { ...user, preferredLang: lng } });
      },
    }),
    {
      name: "pw_auth",
      partialize: (s) => ({ user: s.user, school: s.school, publisher: s.publisher }),
    },
  ),
);

