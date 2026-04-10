import type { NextFunction, Request, Response } from "express";
import { unauthorized } from "../utils/httpErrors.js";
import { verifyAccessToken } from "../utils/jwt.js";

export function authRequired(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) throw unauthorized();
  const token = header.slice("Bearer ".length);

  try {
    const claims = verifyAccessToken(token);
    req.user = {
      id: claims.id,
      role: claims.role,
      schoolId: claims.schoolId ?? null,
      publisherId: claims.publisherId ?? null,
      impersonatedById: claims.impersonatedById ?? null,
    };
    return next();
  } catch {
    throw unauthorized();
  }
}

