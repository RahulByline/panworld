import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();
const EnvSchema = z.object({
    NODE_ENV: z.string().optional().default("development"),
    PORT: z.coerce.number().int().positive().default(4000),
    // DB (allow either DATABASE_URL or separate MYSQL_* vars)
    DATABASE_URL: z.string().optional(),
    MYSQL_HOST: z.string().optional().default("localhost"),
    MYSQL_PORT: z.coerce.number().int().positive().optional().default(3306),
    MYSQL_USER: z.string().optional(),
    MYSQL_PASSWORD: z.string().optional(),
    MYSQL_DATABASE: z.string().optional(),
    // Auth (support old TTL vars + new "15m/7d" style)
    JWT_ACCESS_SECRET: z.string().min(16),
    JWT_REFRESH_SECRET: z.string().min(16),
    JWT_ACCESS_TTL_SECONDS: z.coerce.number().int().positive().optional().default(900),
    JWT_REFRESH_TTL_SECONDS: z.coerce.number().int().positive().optional().default(60 * 60 * 24 * 30),
    JWT_ACCESS_EXPIRY: z.string().optional(), // e.g. 15m
    JWT_REFRESH_EXPIRY: z.string().optional(), // e.g. 7d
    // CORS
    WEB_ORIGIN: z.string().optional(), // legacy single origin
    CLIENT_URL: z.string().optional(), // comma-separated origins
    // Files
    UPLOAD_DIR: z.string().optional().default("./uploads"),
    EXPORT_DIR: z.string().optional().default("./exports"),
    // Rate limiting (optional)
    RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().optional(),
    RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().optional(),
});
function buildDatabaseUrl(e) {
    if (e.DATABASE_URL && e.DATABASE_URL.length > 0)
        return e.DATABASE_URL;
    const user = e.MYSQL_USER ?? "root";
    const pass = e.MYSQL_PASSWORD ?? "";
    const host = e.MYSQL_HOST ?? "localhost";
    const port = e.MYSQL_PORT ?? 3306;
    const db = e.MYSQL_DATABASE ?? "panworld_portal";
    const encPass = encodeURIComponent(pass);
    return `mysql://${user}:${encPass}@${host}:${port}/${db}`;
}
function parseExpiryToSeconds(exp) {
    const m = exp.trim().match(/^(\d+)\s*([smhd])$/i);
    if (!m)
        return null;
    const n = Number(m[1]);
    const u = m[2].toLowerCase();
    const mult = u === "s" ? 1 : u === "m" ? 60 : u === "h" ? 3600 : 86400;
    return n * mult;
}
const parsed = EnvSchema.parse(process.env);
const corsOriginsRaw = parsed.CLIENT_URL ?? parsed.WEB_ORIGIN ?? "http://localhost:5173";
const corsOrigins = corsOriginsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
const accessSeconds = parsed.JWT_ACCESS_EXPIRY ? parseExpiryToSeconds(parsed.JWT_ACCESS_EXPIRY) ?? parsed.JWT_ACCESS_TTL_SECONDS : parsed.JWT_ACCESS_TTL_SECONDS;
const refreshSeconds = parsed.JWT_REFRESH_EXPIRY ? parseExpiryToSeconds(parsed.JWT_REFRESH_EXPIRY) ?? parsed.JWT_REFRESH_TTL_SECONDS : parsed.JWT_REFRESH_TTL_SECONDS;
export const env = {
    ...parsed,
    DATABASE_URL: buildDatabaseUrl(parsed),
    CORS_ORIGINS: corsOrigins,
    JWT_ACCESS_TTL_SECONDS: accessSeconds,
    JWT_REFRESH_TTL_SECONDS: refreshSeconds,
};
