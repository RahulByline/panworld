const bcrypt = require("bcryptjs");
const { pool } = require("../db");
const env = require("../env");
const { badRequest, unauthorized } = require("../errors");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../jwtUtil");

async function hashToken(token) {
  return bcrypt.hash(token, 10);
}

async function compareToken(token, tokenHash) {
  return bcrypt.compare(token, tokenHash);
}

function mapLoginUserRow(user) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    role: user.role,
    schoolId: user.school_id,
    publisherId: user.publisher_id,
    preferredLang: user.preferred_lang,
  };
}

function mapSchoolRow(user) {
  if (!user.s_id) return null;
  return {
    id: user.s_id,
    name: user.s_name,
    country: user.s_country,
    curriculumType: user.s_curriculum_type,
    purchaseStatus: user.s_purchase_status,
    preferredLang: user.s_preferred_lang,
    enabledModules: user.s_enabled_modules,
    vatRate: user.s_vat_rate,
  };
}

exports.login = async (req, res, next) => {
  try {
    const email = String(req.body?.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body?.password || "");
    if (!email || !password) throw badRequest("Email and password required");

    const [rows] = await pool.query(
      `SELECT
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
      LIMIT 1`,
      [email],
    );
    const user = rows[0];
    if (!user || !user.active) throw unauthorized("Invalid credentials");
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) throw unauthorized("Invalid credentials");

    const accessToken = signAccessToken({
      id: user.id,
      role: user.role,
      schoolId: user.school_id ?? null,
      publisherId: user.publisher_id ?? null,
      impersonatedById: user.impersonated_by_id ?? null,
    });
    const refreshToken = signRefreshToken(user.id);
    const refreshId = `rt_${user.id}_${Date.now()}`;
    await pool.query(
      `INSERT INTO refresh_tokens (id, token_hash, user_agent, ip_address, revoked_at, expires_at, user_id)
       VALUES (?, ?, ?, ?, NULL, ?, ?)`,
      [
        refreshId,
        await hashToken(refreshToken),
        req.get("user-agent") || null,
        req.ip || null,
        new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        user.id,
      ],
    );
    await pool.query(`UPDATE users SET last_login_at = ? WHERE id = ?`, [new Date(), user.id]);

    res.cookie("pw_refresh", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
      maxAge: env.JWT_REFRESH_TTL_SECONDS * 1000,
      path: "/api/auth",
    });

    res.json({
      ok: true,
      data: {
        accessToken,
        user: mapLoginUserRow(user),
        school: mapSchoolRow(user),
        publisher: user.p_id ? { id: user.p_id, name: user.p_name } : null,
      },
    });
  } catch (e) {
    next(e);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.pw_refresh;
    if (!refreshToken) throw unauthorized("Refresh token missing");

    let claims;
    try {
      claims = verifyRefreshToken(refreshToken);
    } catch {
      throw unauthorized("Refresh token invalid");
    }
    if (claims.typ !== "refresh") throw unauthorized("Refresh token invalid");

    const [tokenRows] = await pool.query(
      `SELECT id, token_hash FROM refresh_tokens
       WHERE user_id = ? AND revoked_at IS NULL AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 20`,
      [claims.uid],
    );

    let match = null;
    for (const t of tokenRows) {
      // eslint-disable-next-line no-await-in-loop
      if (await compareToken(refreshToken, t.token_hash)) {
        match = t;
        break;
      }
    }
    if (!match) throw unauthorized("Refresh token invalid");

    const [userRows] = await pool.query(
      `SELECT id, role, active, school_id, publisher_id, impersonated_by_id FROM users WHERE id = ? LIMIT 1`,
      [claims.uid],
    );
    const user = userRows[0];
    if (!user || !user.active) throw unauthorized();

    const accessToken = signAccessToken({
      id: user.id,
      role: user.role,
      schoolId: user.school_id ?? null,
      publisherId: user.publisher_id ?? null,
      impersonatedById: user.impersonated_by_id ?? null,
    });
    res.json({ ok: true, data: { accessToken } });
  } catch (e) {
    next(e);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.pw_refresh || null;
    if (refreshToken) {
      try {
        const claims = verifyRefreshToken(refreshToken);
        if (claims.typ === "refresh") {
          const [tokenRows] = await pool.query(
            `SELECT id, token_hash FROM refresh_tokens
             WHERE user_id = ? AND revoked_at IS NULL ORDER BY created_at DESC LIMIT 30`,
            [claims.uid],
          );
          for (const t of tokenRows) {
            // eslint-disable-next-line no-await-in-loop
            if (await compareToken(refreshToken, t.token_hash)) {
              // eslint-disable-next-line no-await-in-loop
              await pool.query(`UPDATE refresh_tokens SET revoked_at = ? WHERE id = ?`, [new Date(), t.id]);
              break;
            }
          }
        }
      } catch {
        /* ignore */
      }
    }
    res.clearCookie("pw_refresh", { path: "/api/auth" });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
};

exports.me = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      `SELECT
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
      LIMIT 1`,
      [userId],
    );
    const user = rows[0];
    if (!user) throw unauthorized();

    res.json({
      ok: true,
      data: {
        user: mapLoginUserRow(user),
        school: mapSchoolRow(user),
        publisher: user.p_id ? { id: user.p_id, name: user.p_name } : null,
      },
    });
  } catch (e) {
    next(e);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const email = String(req.body?.email || "")
      .trim()
      .toLowerCase();
    const [rows] = await pool.query(`SELECT id, email FROM users WHERE email = ? LIMIT 1`, [email]);
    const user = rows[0];
    if (user) {
      const mockToken = `reset_${user.id.slice(0, 8)}_${Date.now()}`;
      console.log(`[mock email] forgot password for ${user.email} token=${mockToken}`);
    }
    res.json({ ok: true, data: { ok: true } });
  } catch (e) {
    next(e);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const token = String(req.body?.token || "");
    const newPassword = String(req.body?.newPassword || "");
    if (!newPassword || newPassword.length < 8) throw badRequest("Password too short");
    const parts = token.split("_");
    if (parts.length < 3 || parts[0] !== "reset") throw badRequest("Invalid reset token");
    const userIdPrefix = parts[1];
    const [rows] = await pool.query(`SELECT id FROM users WHERE id LIKE ? LIMIT 1`, [`${userIdPrefix}%`]);
    const user = rows[0];
    if (!user) throw badRequest("Invalid reset token");
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await pool.query(`UPDATE users SET password_hash = ? WHERE id = ?`, [passwordHash, user.id]);
    res.json({ ok: true, data: { ok: true } });
  } catch (e) {
    next(e);
  }
};
