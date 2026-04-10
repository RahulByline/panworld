import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import { routes } from "./routes/index.js";
export function createApp() {
    const app = express();
    app.use(cors({
        origin: env.CORS_ORIGINS,
        credentials: true,
    }));
    app.use(helmet());
    app.use(requestLogger);
    app.use(express.json({ limit: "2mb" }));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.get("/health", (_req, res) => res.json({ ok: true, service: "panworld-portal-api" }));
    app.use("/api", routes);
    app.use(errorHandler);
    return app;
}
