import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/httpErrors.js";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      ok: false,
      error: { code: err.code, message: err.message, details: err.details ?? null },
    });
  }

  // eslint-disable-next-line no-console
  console.error(err);

  return res.status(500).json({
    ok: false,
    error: { code: "INTERNAL_SERVER_ERROR", message: "Something went wrong" },
  });
}

