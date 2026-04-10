import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { AuthUser } from "../types/auth.js";

export type AccessTokenClaims = AuthUser & { typ: "access" };
export type RefreshTokenClaims = { uid: string; typ: "refresh" };

export function signAccessToken(user: AuthUser) {
  const payload: AccessTokenClaims = { ...user, typ: "access" };
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_TTL_SECONDS });
}

export function signRefreshToken(userId: string) {
  const payload: RefreshTokenClaims = { uid: userId, typ: "refresh" };
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_TTL_SECONDS });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenClaims;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenClaims;
}

