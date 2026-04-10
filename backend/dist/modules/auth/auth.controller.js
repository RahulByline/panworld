import { env } from "../../config/env.js";
import { authService } from "./auth.service.js";
import { ForgotPasswordSchema, LoginSchema, ResetPasswordSchema } from "./auth.schemas.js";
import { unauthorized } from "../../utils/httpErrors.js";
function getMeta(req) {
    return {
        userAgent: req.headers["user-agent"],
        ip: req.ip,
    };
}
const REFRESH_COOKIE = "pw_refresh";
export const authController = {
    login: async (req, res) => {
        const body = LoginSchema.parse(req.body);
        const result = await authService.login(body.email, body.password, getMeta(req));
        res.cookie(REFRESH_COOKIE, result.refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: env.NODE_ENV === "production",
            maxAge: env.JWT_REFRESH_TTL_SECONDS * 1000,
            path: "/api/auth",
        });
        return res.json({
            ok: true,
            data: {
                accessToken: result.accessToken,
                user: result.user,
                school: result.school,
                publisher: result.publisher,
            },
        });
    },
    refresh: async (req, res) => {
        const token = req.cookies?.[REFRESH_COOKIE] ?? null;
        if (!token)
            throw unauthorized("Refresh token missing");
        const out = await authService.refresh(token);
        return res.json({ ok: true, data: out });
    },
    logout: async (req, res) => {
        const token = req.cookies?.[REFRESH_COOKIE] ?? null;
        await authService.logout(token);
        res.clearCookie(REFRESH_COOKIE, { path: "/api/auth" });
        return res.json({ ok: true });
    },
    forgotPassword: async (req, res) => {
        const body = ForgotPasswordSchema.parse(req.body);
        const out = await authService.forgotPassword(body.email);
        return res.json({ ok: true, data: out });
    },
    resetPassword: async (req, res) => {
        const body = ResetPasswordSchema.parse(req.body);
        const out = await authService.resetPassword(body.token, body.newPassword);
        return res.json({ ok: true, data: out });
    },
    me: async (req, res) => {
        const out = await authService.me(req.user.id);
        return res.json({ ok: true, data: out });
    },
};
