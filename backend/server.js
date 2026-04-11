const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const env = require("./env");
const { HttpError } = require("./errors");

function mysqlDevHint(err) {
  if (env.NODE_ENV === "production") return null;
  if (!err || typeof err.code !== "string") return null;
  if (err.code === "ER_ACCESS_DENIED_ERROR") {
    return "MySQL rejected the credentials in backend/.env — set DB_USER and DB_PASSWORD to match your MySQL account.";
  }
  if (err.code === "ER_BAD_DB_ERROR") {
    return "MySQL database is missing. Create DB_NAME and import backend/sql (see README_SQL_IMPORT.md).";
  }
  if (err.code === "ECONNREFUSED") {
    return "Cannot connect to MySQL — check DB_HOST / DB_PORT and that the server is running.";
  }
  return null;
}
const { testConnection } = require("./db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGINS,
    credentials: true,
  }),
);
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const uploadRoot = path.resolve(env.UPLOAD_DIR);
fs.mkdirSync(uploadRoot, { recursive: true });
app.use("/api/files", express.static(uploadRoot)); // we will use this for the files uploaded to be stored in the backend/uploads folder

app.get("/api/health", (_req, res) => { //this is for testing, to check if the backend server is running on the environment
  res.json({ message: "Backend is running" });
}); 

app.use("/api/auth", authRoutes); // this is for the authentication routes
app.use("/api/admin", adminRoutes); // this is for the admin routes, all the functions related to the admin panel will be here

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      ok: false,
      error: { code: err.code, message: err.message, details: err.details ?? null },
    });
    return;
  }
  console.error(err);
  const hint = mysqlDevHint(err);
  res.status(500).json({
    ok: false,
    error: {
      code: hint ? "DATABASE_ERROR" : "INTERNAL_SERVER_ERROR",
      message: hint || "Something went wrong",
    },
  });
});

app.listen(env.PORT, () => {
  console.log(`API http://localhost:${env.PORT}`);
  console.log("Routes: /api/auth/*, /api/admin/countries, /api/admin/curricula, /api/admin/school-groups, /api/admin/schools/*, static /files");
  console.log('Run: node server.js  (or npm run dev from repo root "workspace")');
  void testConnection();
});
