import type { NextFunction, Request, Response } from "express";
import { forbidden, unauthorized } from "../utils/httpErrors.js";
import type { UserRole } from "../types/roles.js";

export function requireRole(roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) throw unauthorized();
    if (!roles.includes(user.role)) throw forbidden();
    return next();
  };
}

