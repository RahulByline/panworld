import { create } from "zustand";
import axios from "axios";
import type { School, User } from "../types/domain";
import { api, setAccessToken } from "../services/api";

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

function mapUser(u: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: User["role"];
  schoolId: string | null;
  publisherId: string | null;
  preferredLang: "en" | "ar";
  impersonatedById?: string | null;
}): User {
  return {
    id: u.id,
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
    role: u.role,
    schoolId: u.schoolId ?? null,
    publisherId: u.publisherId ?? null,
    preferredLang: u.preferredLang,
    impersonatedById: u.impersonatedById ?? null,
  };
}

function mapSchool(s: {
  id: string;
  name: string;
  country: School["country"];
  curriculumType: string;
  purchaseStatus: School["purchaseStatus"];
  preferredLang: "en" | "ar";
  enabledModules: Record<string, unknown>;
  vatRate: string | number;
} | null): School | null {
  if (!s) return null;
  return {
    id: s.id,
    name: s.name,
    country: s.country,
    curriculumType: s.curriculumType,
    purchaseStatus: s.purchaseStatus,
    preferredLang: s.preferredLang,
    enabledModules:
      s.enabledModules && typeof s.enabledModules === "object" ? s.enabledModules : {},
    vatRate: s.vatRate,
  };
}

function apiErrorMessage(e: unknown, fallback: string) {
  if (axios.isAxiosError(e)) {
    const msg = (e.response?.data as { error?: { message?: string } })?.error?.message;
    if (msg) return msg;
  }
  if (e instanceof Error && e.message) return e.message;
  return fallback;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  school: null,
  publisher: null,
  bootstrapped: false,

  login: async (email, password) => {
    try {
      const res = await api.post<{
        ok: boolean;
        data: {
          accessToken: string;
          user: Parameters<typeof mapUser>[0];
          school: Parameters<typeof mapSchool>[0];
          publisher: { id: string; name: string } | null;
        };
      }>("/auth/login", { email, password });
      if (!res.data?.ok || !res.data.data?.accessToken) throw new Error("Login failed");
      const d = res.data.data;
      setAccessToken(d.accessToken);
      set({
        user: mapUser(d.user),
        school: mapSchool(d.school),
        publisher: d.publisher,
      });
    } catch (e) {
      throw new Error(apiErrorMessage(e, "Login failed"));
    }
  },

  bootstrap: async () => {
    try {
      const refreshRes = await api.post<{ ok: boolean; data: { accessToken: string } }>("/auth/refresh");
      if (refreshRes.data?.ok && refreshRes.data.data?.accessToken) {
        setAccessToken(refreshRes.data.data.accessToken);
        try {
          const meRes = await api.get<{
            ok: boolean;
            data: {
              user: Parameters<typeof mapUser>[0];
              school: Parameters<typeof mapSchool>[0];
              publisher: { id: string; name: string } | null;
            };
          }>("/auth/me");
          if (meRes.data?.ok && meRes.data.data?.user) {
            const d = meRes.data.data;
            set({
              user: mapUser(d.user),
              school: mapSchool(d.school),
              publisher: d.publisher,
              bootstrapped: true,
            });
            return;
          }
        } catch {
          setAccessToken(null);
        }
      }
    } catch {
      setAccessToken(null);
    }
    set({ user: null, school: null, publisher: null, bootstrapped: true });
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      /* ignore */
    }
    setAccessToken(null);
    set({ user: null, school: null, publisher: null });
  },

  setLanguage: (lng) => {
    const { user } = get();
    if (!user) return;
    set({ user: { ...user, preferredLang: lng } });
  },
}));
