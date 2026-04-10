import bcrypt from "bcryptjs";
import { badRequest, unauthorized } from "../../utils/httpErrors.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";
import { emailService } from "../../services/mock/email.service.js";
import { whatsappService } from "../../services/mock/whatsapp.service.js";
import { db } from "../../db/pool.js";
function hashToken(token) {
    // bcrypt is slow but acceptable for demo; keeps refresh tokens non-reversible at rest.
    return bcrypt.hash(token, 10);
}
async function compareToken(token, tokenHash) {
    return bcrypt.compare(token, tokenHash);
}
export const authService = {
    login: async (email, password, meta) => {
        const [rows] = await db.query(`
      SELECT
        u.id, u.email, u.password_hash, u.first_name, u.last_name, u.role, u.active,
        u.preferred_lang, u.school_id, u.publisher_id, u.impersonated_by_id,
        s.id AS s_id, s.name AS s_name, s.country AS s_country, s.curriculum_type AS s_curriculum_type,
        s.purchase_status AS s_purchase_status, s.preferred_lang AS s_preferred_lang,
        s.enabled_modules AS s_enabled_modules, s.vat_rate AS s_vat_rate,
        p.id AS p_id, p.name AS p_name
      FROM users u
      LEFT JOIN schools s ON s.id = u.school_id
      LEFT JOIN publishers p ON p.id = u.publisher_id
      WHERE u.email = ?
      LIMIT 1
      `, [email.toLowerCase()]);
        const user = rows[0] ?? null;
        if (!user || !user.active)
            throw unauthorized("Invalid credentials");
        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok)
            throw unauthorized("Invalid credentials");
        const accessToken = signAccessToken({
            id: user.id,
            role: user.role,
            schoolId: user.school_id ?? null,
            publisherId: user.publisher_id ?? null,
            impersonatedById: user.impersonated_by_id ?? null,
        });
        const refreshToken = signRefreshToken(user.id);
        const refreshId = `rt_${user.id}_${Date.now()}`;
        await db.query(`
      INSERT INTO refresh_tokens (id, token_hash, user_agent, ip_address, revoked_at, expires_at, user_id)
      VALUES (?, ?, ?, ?, NULL, ?, ?)
      `, [
            refreshId,
            await hashToken(refreshToken),
            meta.userAgent ?? null,
            meta.ip ?? null,
            new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
            user.id,
        ]);
        await db.query(`UPDATE users SET last_login_at = ? WHERE id = ?`, [new Date(), user.id]);
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role,
                schoolId: user.school_id,
                publisherId: user.publisher_id,
                preferredLang: user.preferred_lang,
            },
            school: user.s_id
                ? {
                    id: user.s_id,
                    name: user.s_name,
                    country: user.s_country,
                    curriculumType: user.s_curriculum_type,
                    purchaseStatus: user.s_purchase_status,
                    preferredLang: user.s_preferred_lang,
                    enabledModules: user.s_enabled_modules,
                    vatRate: user.s_vat_rate,
                }
                : null,
            publisher: user.p_id ? { id: user.p_id, name: user.p_name } : null,
        };
    },
    refresh: async (refreshToken) => {
        let claims;
        try {
            claims = verifyRefreshToken(refreshToken);
        }
        catch {
            throw unauthorized("Refresh token invalid");
        }
        if (claims.typ !== "refresh")
            throw unauthorized("Refresh token invalid");
        const [tokenRows] = await db.query(`
      SELECT id, token_hash
      FROM refresh_tokens
      WHERE user_id = ? AND revoked_at IS NULL AND expires_at > NOW()
      ORDER BY created_at DESC
      LIMIT 20
      `, [claims.uid]);
        const tokens = tokenRows;
        const match = await Promise.any(tokens.map(async (t) => ((await compareToken(refreshToken, t.token_hash)) ? t : null))).catch(() => null);
        if (!match)
            throw unauthorized("Refresh token invalid");
        const [userRows] = await db.query(`SELECT id, role, active, school_id, publisher_id, impersonated_by_id FROM users WHERE id = ? LIMIT 1`, [claims.uid]);
        const user = userRows[0] ?? null;
        if (!user || !user.active)
            throw unauthorized();
        const accessToken = signAccessToken({
            id: user.id,
            role: user.role,
            schoolId: user.school_id ?? null,
            publisherId: user.publisher_id ?? null,
            impersonatedById: user.impersonated_by_id ?? null,
        });
        return { accessToken };
    },
    logout: async (refreshToken) => {
        if (!refreshToken)
            return { ok: true };
        try {
            const claims = verifyRefreshToken(refreshToken);
            if (claims.typ !== "refresh")
                return { ok: true };
            const [tokenRows] = await db.query(`
        SELECT id, token_hash
        FROM refresh_tokens
        WHERE user_id = ? AND revoked_at IS NULL
        ORDER BY created_at DESC
        LIMIT 30
        `, [claims.uid]);
            const tokens = tokenRows;
            for (const t of tokens) {
                // best-effort match and revoke
                // eslint-disable-next-line no-await-in-loop
                if (await compareToken(refreshToken, t.token_hash)) {
                    // eslint-disable-next-line no-await-in-loop
                    await db.query(`UPDATE refresh_tokens SET revoked_at = ? WHERE id = ?`, [new Date(), t.id]);
                    break;
                }
            }
        }
        catch {
            // ignore invalid refresh token
        }
        return { ok: true };
    },
    forgotPassword: async (email) => {
        const [rows] = await db.query(`SELECT id, email FROM users WHERE email = ? LIMIT 1`, [email.toLowerCase()]);
        const user = rows[0] ?? null;
        if (!user)
            return { ok: true };
        const mockToken = `reset_${user.id.slice(0, 8)}_${Date.now()}`;
        await emailService.send({
            to: user.email,
            subject: "Panworld Portal - Password reset (mock)",
            template: "forgot_password",
            payload: { resetToken: mockToken },
        });
        await whatsappService.send(user.email, `Mock reset token: ${mockToken}`);
        return { ok: true, mockToken };
    },
    resetPassword: async (token, newPassword) => {
        const parts = token.split("_");
        if (parts.length < 3 || parts[0] !== "reset")
            throw badRequest("Invalid reset token");
        const userIdPrefix = parts[1];
        const [rows] = await db.query(`SELECT id FROM users WHERE id LIKE ? LIMIT 1`, [`${userIdPrefix}%`]);
        const user = rows[0] ?? null;
        if (!user)
            throw badRequest("Invalid reset token");
        const passwordHash = await bcrypt.hash(newPassword, 10);
        await db.query(`UPDATE users SET password_hash = ? WHERE id = ?`, [passwordHash, user.id]);
        return { ok: true };
    },
    me: async (userId) => {
        const [rows] = await db.query(`
      SELECT
        u.id, u.email, u.first_name, u.last_name, u.role, u.school_id, u.publisher_id,
        u.preferred_lang, u.impersonated_by_id,
        s.id AS s_id, s.name AS s_name, s.country AS s_country, s.curriculum_type AS s_curriculum_type,
        s.purchase_status AS s_purchase_status, s.preferred_lang AS s_preferred_lang,
        s.enabled_modules AS s_enabled_modules, s.vat_rate AS s_vat_rate,
        p.id AS p_id, p.name AS p_name
      FROM users u
      LEFT JOIN schools s ON s.id = u.school_id
      LEFT JOIN publishers p ON p.id = u.publisher_id
      WHERE u.id = ?
      LIMIT 1
      `, [userId]);
        const user = rows[0] ?? null;
        if (!user)
            throw unauthorized();
        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role,
                schoolId: user.school_id,
                publisherId: user.publisher_id,
                preferredLang: user.preferred_lang,
                impersonatedById: user.impersonated_by_id,
            },
            school: user.s_id
                ? {
                    id: user.s_id,
                    name: user.s_name,
                    country: user.s_country,
                    curriculumType: user.s_curriculum_type,
                    purchaseStatus: user.s_purchase_status,
                    preferredLang: user.s_preferred_lang,
                    enabledModules: user.s_enabled_modules,
                    vatRate: user.s_vat_rate,
                }
                : null,
            publisher: user.p_id ? { id: user.p_id, name: user.p_name } : null,
        };
    },
};
