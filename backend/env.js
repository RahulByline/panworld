const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const port = Number(process.env.PORT || 4001);
const webOrigin = process.env.CLIENT_URL || process.env.WEB_ORIGIN || "http://localhost:5173";
const corsOrigins = webOrigin
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

/** MySQL pool options (no connection URL — use DB_* env vars). */
function getDbConfig() {
  return {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME || "panworld_portal",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 60000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  };
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: port,
  getDbConfig,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "",
  /** Default 3 hours; override with JWT_ACCESS_TTL_SECONDS in .env */
  JWT_ACCESS_TTL_SECONDS: Number(process.env.JWT_ACCESS_TTL_SECONDS || 60 * 60 * 3),
  JWT_REFRESH_TTL_SECONDS: Number(process.env.JWT_REFRESH_TTL_SECONDS || 60 * 60 * 24 * 30),
  CORS_ORIGINS: corsOrigins,
  FILE_PUBLIC_BASE: (process.env.FILE_PUBLIC_BASE_URL || `http://localhost:${port}`).replace(/\/+$/, ""),
  UPLOAD_DIR: process.env.UPLOAD_DIR || "./uploads",
};
