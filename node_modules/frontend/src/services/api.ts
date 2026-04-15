import axios, { AxiosHeaders, type AxiosError, type InternalAxiosRequestConfig } from "axios";

/**
 * Axios merges `baseURL` + `url` like `new URL(url, baseURL)`.
 * If `url` starts with `/` (e.g. `/admin/schools`), it is treated as absolute on the host
 * and the `/api` segment of the base is dropped → 404 on the real API.
 * We keep `baseURL` ending with `/api/` and strip a leading `/` from paths so requests
 * hit `http://host:port/api/...` correctly.
 *
 * **Vite note:** `VITE_API_URL` is inlined at `npm run build` time. Editing `.env` after a
 * deploy does nothing until you rebuild and redeploy. If unset in production builds, we use
 * same-origin `/api/` so the SPA calls `https://your-host/api/...` (reverse-proxy to Node).
 */
function normalizeApiRoot(raw?: string): string {
  const trimmed = raw?.trim();
  if (trimmed) {
    let base = trimmed.replace(/\/+$/, "");
    if (!base.endsWith("/api")) base = `${base}/api`;
    return `${base}/`;
  }
  // Production bundle: never embed localhost — use API behind the same host (nginx / ingress).
  if (import.meta.env.PROD) {
    return "/api/";
  }
  return "http://localhost:4000/api/";
}

export const api = axios.create({
  baseURL: normalizeApiRoot(import.meta.env.VITE_API_URL),
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof config.url === "string" && config.url.startsWith("/")) {
    config.url = config.url.slice(1);
  }
  return config;
});

export function setAccessToken(token: string | null) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}

type RequestWithRetry = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshInFlight: Promise<boolean> | null = null;

function tryRefreshAccessToken(): Promise<boolean> {
  if (!refreshInFlight) {
    const base = api.defaults.baseURL ?? "";
    refreshInFlight = (async () => {
      try {
        const res = await axios.post<{ ok?: boolean; data?: { accessToken?: string } }>(
          `${base}auth/refresh`,
          {},
          { withCredentials: true },
        );
        const token = res.data?.data?.accessToken;
        if (token) {
          setAccessToken(token);
          return true;
        }
        return false;
      } catch {
        return false;
      } finally {
        refreshInFlight = null;
      }
    })();
  }
  return refreshInFlight;
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as RequestWithRetry | undefined;
    if (status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    const rel = String(originalRequest.url ?? "");
    if (rel.includes("auth/login")) {
      return Promise.reject(error);
    }
    /** Initial bootstrap refresh without a session — do not force logout redirect. */
    if (rel.includes("auth/refresh")) {
      return Promise.reject(error);
    }
    if (originalRequest._retry) {
      const { sessionExpired } = await import("../store/auth.store");
      sessionExpired();
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    const ok = await tryRefreshAccessToken();
    if (!ok) {
      const { sessionExpired } = await import("../store/auth.store");
      sessionExpired();
      return Promise.reject(error);
    }

    const auth = api.defaults.headers.common.Authorization;
    if (typeof auth === "string") {
      const headers = AxiosHeaders.from(originalRequest.headers ?? {});
      headers.set("Authorization", auth);
      originalRequest.headers = headers;
    }
    return api(originalRequest);
  },
);
