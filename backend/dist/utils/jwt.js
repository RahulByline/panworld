import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
export function signAccessToken(user) {
    const payload = { ...user, typ: "access" };
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_TTL_SECONDS });
}
export function signRefreshToken(userId) {
    const payload = { uid: userId, typ: "refresh" };
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_TTL_SECONDS });
}
export function verifyAccessToken(token) {
    return jwt.verify(token, env.JWT_ACCESS_SECRET);
}
export function verifyRefreshToken(token) {
    return jwt.verify(token, env.JWT_REFRESH_SECRET);
}
