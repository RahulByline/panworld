import axios from "axios";

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
