const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { pool } = require("../db");
const env = require("../env");
const { badRequest, notFound } = require("../errors");

const DEFAULT_MODULES = {
  phase1: true,
  phase2: false,
  phase3: false,
  assessment: false,
  kodeitAcademy: true,
};

const PURCHASE = new Set(["REGISTERED_NO_ORDERS", "FIRST_ORDER_CONFIRMED", "ACTIVE_REPEAT"]);
const LANGS = new Set(["en", "ar"]);
/** First user created with a new school is always SCHOOL_ADMIN (portal operator). */
const ONBOARDING_ADMIN_ROLE = "SCHOOL_ADMIN";
const SCHOOL_TEAM_ROLES = new Set(["TEACHER", "HOD", "MANAGEMENT", "CEO", "PROCUREMENT", "SCHOOL_ADMIN"]);

const BRAND_PRIMARY = "#0f172a";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** School WhatsApp: digits, +, spaces, common separators (8–32 chars after trim). */
const WHATSAPP_RE = /^[\d+()[\]\s\-]{8,40}$/;

function t(v) {
  if (v === undefined || v === null) return "";
  return String(v).trim();
}

/** School profile fields only (create + update). */
function parseSchoolProfileInput(raw) {
  const issues = [];
  const name = t(raw.name);
  if (!name || name.length > 191) issues.push("name");

  const country = t(raw.country);
  if (!country || country.length > 32) issues.push("country");

  const curriculumType = t(raw.curriculumType);
  if (!curriculumType || curriculumType.length > 191) issues.push("curriculumType");

  const purchaseStatus = "REGISTERED_NO_ORDERS";

  let preferredLang = t(raw.preferredLang) || "en";
  if (!LANGS.has(preferredLang)) issues.push("preferredLang");

  const vatRate = Number(raw.vatRate);
  if (Number.isNaN(vatRate) || vatRate < 0 || vatRate > 100) issues.push("vatRate");

  let groupId = t(raw.groupId);
  if (groupId === "") groupId = undefined;
  if (groupId && (groupId.length < 1 || groupId.length > 32)) issues.push("groupId");

  const schoolEmail = t(raw.schoolEmail).toLowerCase();
  if (!schoolEmail || !EMAIL_RE.test(schoolEmail)) issues.push("schoolEmail");

  const whatsapp = t(raw.whatsapp);
  if (!whatsapp || !WHATSAPP_RE.test(whatsapp)) issues.push("whatsapp");

  let logoUrl = t(raw.logoUrl);
  if (logoUrl === "") logoUrl = null;

  let enabledModules = DEFAULT_MODULES;
  if (raw.enabledModules != null && raw.enabledModules !== "") {
    try {
      const parsed =
        typeof raw.enabledModules === "string" ? JSON.parse(raw.enabledModules) : raw.enabledModules;
      if (parsed && typeof parsed === "object") enabledModules = { ...DEFAULT_MODULES, ...parsed };
    } catch {
      issues.push("enabledModules");
    }
  }

  if (issues.length) {
    return { ok: false, message: `Invalid or missing fields: ${issues.join(", ")}` };
  }

  return {
    ok: true,
    data: {
      name,
      country,
      curriculumType,
      purchaseStatus,
      preferredLang,
      vatRate,
      groupId: groupId || null,
      addressLine1: t(raw.addressLine1) || null,
      addressLine2: t(raw.addressLine2) || null,
      city: t(raw.city) || null,
      region: t(raw.region) || null,
      postalCode: t(raw.postalCode) || null,
      phone: t(raw.phone) || null,
      schoolEmail,
      whatsapp,
      website: t(raw.website) || null,
      logoUrl,
      primaryColor: BRAND_PRIMARY,
      enabledModules,
    },
  };
}

function parseCreateSchoolBody(raw) {
  const prof = parseSchoolProfileInput(raw);
  if (!prof.ok) return prof;

  const issues = [];
  const adminEmail = t(raw.adminEmail).toLowerCase();
  if (!adminEmail || !EMAIL_RE.test(adminEmail)) issues.push("adminEmail");

  const adminPassword = String(raw.adminPassword || "");
  if (adminPassword.length < 8 || adminPassword.length > 128) issues.push("adminPassword");

  const adminFirstName = t(raw.adminFirstName);
  const adminLastName = t(raw.adminLastName);
  if (!adminFirstName || adminFirstName.length > 191) issues.push("adminFirstName");
  if (!adminLastName || adminLastName.length > 191) issues.push("adminLastName");

  let adminUsername = t(raw.adminUsername);
  if (adminUsername === "") adminUsername = null;
  else if (adminUsername && (adminUsername.length < 2 || adminUsername.length > 191)) issues.push("adminUsername");

  const adminRole = ONBOARDING_ADMIN_ROLE;

  if (issues.length) {
    return { ok: false, message: `Invalid or missing fields: ${issues.join(", ")}` };
  }

  return {
    ok: true,
    data: {
      ...prof.data,
      adminEmail,
      adminPassword,
      adminFirstName,
      adminLastName,
      adminUsername,
      adminRole,
    },
  };
}

function mapSchoolRowToApi(row) {
  let logoFromBranding = null;
  if (row.branding) {
    try {
      const b = typeof row.branding === "string" ? JSON.parse(row.branding) : row.branding;
      if (b?.logoUrl) {
        // Fix old logo URLs that are missing the /api prefix
        logoFromBranding = b.logoUrl.includes('/files/school-logos/') && !b.logoUrl.includes('/api/files/school-logos/')
          ? b.logoUrl.replace('/files/school-logos/', '/api/files/school-logos/')
          : b.logoUrl;
      }
    } catch {
      /* ignore */
    }
  }
  let logoUrl = row.logoUrl || logoFromBranding;
  // Fix old logo URLs that are missing the /api prefix
  if (logoUrl && logoUrl.includes('/files/school-logos/') && !logoUrl.includes('/api/files/school-logos/')) {
    logoUrl = logoUrl.replace('/files/school-logos/', '/api/files/school-logos/');
  }

  let enabledModules = DEFAULT_MODULES;
  if (row.enabledModules != null) {
    try {
      const em =
        typeof row.enabledModules === "string" ? JSON.parse(row.enabledModules) : row.enabledModules;
      if (em && typeof em === "object") enabledModules = { ...DEFAULT_MODULES, ...em };
    } catch {
      /* ignore */
    }
  }

  return {
    id: row.id,
    name: row.name,
    country: row.country,
    curriculumType: row.curriculumType,
    purchaseStatus: row.purchaseStatus,
    preferredLang: row.preferredLang,
    vatRate: Number(row.vatRate),
    groupId: row.groupId,
    addressLine1: row.addressLine1,
    addressLine2: row.addressLine2,
    city: row.city,
    region: row.region,
    postalCode: row.postalCode,
    phone: row.phone,
    schoolEmail: row.schoolEmail,
    whatsapp: row.whatsapp ?? null,
    website: row.website,
    logoUrl,
    enabledModules,
    createdAt: row.createdAt,
  };
}

function newSchoolId() {
  return `sch_${crypto.randomBytes(6).toString("hex")}`;
}
function newUserId() {
  return `usr_${crypto.randomBytes(6).toString("hex")}`;
}

exports.list = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, country, curriculum_type AS curriculumType, preferred_lang AS preferredLang,
              purchase_status AS purchaseStatus, created_at AS createdAt
       FROM schools ORDER BY created_at DESC`,
    );
    res.json({ ok: true, data: { schools: rows } });
  } catch (e) {
    next(e);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const id = t(req.params.id);
    if (!id) throw badRequest("School id required");
    const [rows] = await pool.query(
      `SELECT id, name, country, curriculum_type AS curriculumType, purchase_status AS purchaseStatus,
              preferred_lang AS preferredLang, enabled_modules AS enabledModules, vat_rate AS vatRate,
              group_id AS groupId, address_line1 AS addressLine1, address_line2 AS addressLine2,
              city, region, postal_code AS postalCode, phone, school_email AS schoolEmail, whatsapp, website,
              logo_url AS logoUrl, branding, created_at AS createdAt
       FROM schools WHERE id = ? LIMIT 1`,
      [id],
    );
    if (!rows.length) throw notFound("School not found");
    res.json({ ok: true, data: { school: mapSchoolRowToApi(rows[0]) } });
  } catch (e) {
    next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const id = t(req.params.id);
    if (!id) throw badRequest("School id required");
    const raw = { ...req.body };
    if (req.file) {
      raw.logoUrl = `${env.FILE_PUBLIC_BASE}/api/files/school-logos/${req.file.filename}`;
    }
    for (const k of Object.keys(raw)) {
      if (raw[k] === "") delete raw[k];
    }

    const parsed = parseSchoolProfileInput(raw);
    if (!parsed.ok) throw badRequest(parsed.message);
    const input = parsed.data;

    const [curRow] = await pool.query(`SELECT id FROM curricula WHERE name = ? LIMIT 1`, [input.curriculumType]);
    if (!curRow.length) throw badRequest("Unknown curriculum — pick one from the list or add a new curriculum.");

    const [countryRow] = await pool.query(`SELECT vat_rate FROM countries WHERE code = ? LIMIT 1`, [input.country]);
    if (!countryRow.length) throw badRequest("Unknown country — pick one from the list or add a new country.");
    input.vatRate = Number(countryRow[0].vat_rate);

    const [existingRows] = await pool.query(`SELECT id, purchase_status FROM schools WHERE id = ? LIMIT 1`, [id]);
    if (!existingRows.length) throw notFound("School not found");
    const purchaseStatus = existingRows[0]?.purchase_status || "REGISTERED_NO_ORDERS";

    if (input.groupId) {
      const [g] = await pool.query(`SELECT id FROM school_groups WHERE id = ? LIMIT 1`, [input.groupId]);
      if (!g.length) throw badRequest("School group not found");
    }

    const branding = JSON.stringify({
      logoUrl: input.logoUrl ?? null,
      primaryColor: BRAND_PRIMARY,
    });

    await pool.query(
      `UPDATE schools SET
        name=?, country=?, curriculum_type=?, purchase_status=?, preferred_lang=?,
        enabled_modules=?, branding=?, vat_rate=?, group_id=?,
        address_line1=?, address_line2=?, city=?, region=?, postal_code=?,
        phone=?, school_email=?, whatsapp=?, website=?, logo_url=?
       WHERE id=?`,
      [
        input.name,
        input.country,
        input.curriculumType,
        purchaseStatus,
        input.preferredLang,
        JSON.stringify(input.enabledModules),
        branding,
        input.vatRate,
        input.groupId,
        input.addressLine1,
        input.addressLine2,
        input.city,
        input.region,
        input.postalCode,
        input.phone,
        input.schoolEmail,
        input.whatsapp,
        input.website,
        input.logoUrl,
        id,
      ],
    );

    res.json({ ok: true, data: { school: { id } } });
  } catch (e) {
    next(e);
  }
};

exports.create = async (req, res, next) => {
  try {
    const raw = { ...req.body };
    if (req.file) {
      raw.logoUrl = `${env.FILE_PUBLIC_BASE}/api/files/school-logos/${req.file.filename}`;
    }
    for (const k of Object.keys(raw)) {
      if (raw[k] === "") delete raw[k];
    }

    const parsed = parseCreateSchoolBody(raw);
    if (!parsed.ok) throw badRequest(parsed.message);

    const input = parsed.data;
    const createdByUserId = req.user.id;

    const [curRow] = await pool.query(`SELECT id FROM curricula WHERE name = ? LIMIT 1`, [input.curriculumType]);
    if (!curRow.length) throw badRequest("Unknown curriculum — pick one from the list or add a new curriculum.");

    const [countryRow] = await pool.query(`SELECT vat_rate FROM countries WHERE code = ? LIMIT 1`, [input.country]);
    if (!countryRow.length) throw badRequest("Unknown country — pick one from the list or add a new country.");
    input.vatRate = Number(countryRow[0].vat_rate);

    const [dup] = await pool.query(`SELECT id FROM users WHERE email = ? LIMIT 1`, [input.adminEmail]);
    if (dup.length) throw badRequest("That email is already registered");

    if (input.groupId) {
      const [g] = await pool.query(`SELECT id FROM school_groups WHERE id = ? LIMIT 1`, [input.groupId]);
      if (!g.length) throw badRequest("School group not found");
    }

    const schoolId = newSchoolId();
    const userId = newUserId();
    const branding = JSON.stringify({
      logoUrl: input.logoUrl ?? null,
      primaryColor: BRAND_PRIMARY,
    });

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query(
        `INSERT INTO schools (
          id, name, country, curriculum_type, purchase_status, preferred_lang,
          enabled_modules, branding, vat_rate, group_id,
          address_line1, address_line2, city, region, postal_code,
          phone, school_email, whatsapp, website, logo_url, created_by_user_id
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          schoolId,
          input.name,
          input.country,
          input.curriculumType,
          input.purchaseStatus,
          input.preferredLang,
          JSON.stringify(input.enabledModules),
          branding,
          input.vatRate,
          input.groupId,
          input.addressLine1,
          input.addressLine2,
          input.city,
          input.region,
          input.postalCode,
          input.phone,
          input.schoolEmail,
          input.whatsapp,
          input.website,
          input.logoUrl,
          createdByUserId,
        ],
      );

      const passwordHash = await bcrypt.hash(input.adminPassword, 10);
      await conn.query(
        `INSERT INTO users (
          id, email, password_hash, first_name, last_name, role,
          department, active, preferred_lang, school_id, publisher_id, username
        ) VALUES (?,?,?,?,?,?,NULL,1,?,?,NULL,?)`,
        [
          userId,
          input.adminEmail,
          passwordHash,
          input.adminFirstName,
          input.adminLastName,
          input.adminRole,
          input.preferredLang,
          schoolId,
          input.adminUsername,
        ],
      );

      await conn.commit();

      res.status(201).json({
        ok: true,
        data: {
          school: {
            id: schoolId,
            name: input.name,
            country: input.country,
            curriculumType: input.curriculumType,
            purchaseStatus: input.purchaseStatus,
            preferredLang: input.preferredLang,
          },
          schoolAdmin: {
            id: userId,
            email: input.adminEmail,
            firstName: input.adminFirstName,
            lastName: input.adminLastName,
            role: input.adminRole,
            schoolId,
            username: input.adminUsername,
          },
        },
      });
    } catch (e) {
      await conn.rollback();
      const err = e;
      if (err.code === "ER_BAD_FIELD_ERROR" || err.errno === 1054) {
        throw badRequest(
          "Database is missing extended columns. Run sql migrations (e.g. panworld_portal_migration_20260410_school_profile_and_roles.sql and panworld_portal_migration_20260411_curricula_whatsapp.sql — includes curricula, whatsapp, countries).",
        );
      }
      if (err.code === "ER_DUP_ENTRY" || err.errno === 1062) {
        throw badRequest("Duplicate value violates a unique constraint.");
      }
      if (err.code === "ER_NO_REFERENCED_ROW_2" || err.errno === 1452) {
        throw badRequest("Invalid reference (e.g. school group).");
      }
      if (
        err.code === "WARN_DATA_TRUNCATED" ||
        err.errno === 1265 ||
        err.code === "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD" ||
        err.errno === 1366
      ) {
        throw badRequest("Invalid role or enum. Ensure DB migration includes chosen role (e.g. SCHOOL_ADMIN).");
      }
      throw e;
    } finally {
      conn.release();
    }
  } catch (e) {
    next(e);
  }
};

function parseAddSchoolUserBody(raw) {
  const issues = [];
  const email = t(raw.email).toLowerCase();
  if (!email || !EMAIL_RE.test(email)) issues.push("email");
  const password = String(raw.password || "");
  if (password.length < 8 || password.length > 128) issues.push("password");
  const firstName = t(raw.firstName);
  const lastName = t(raw.lastName);
  if (!firstName || firstName.length > 191) issues.push("firstName");
  if (!lastName || lastName.length > 191) issues.push("lastName");
  const role = t(raw.role) || "TEACHER";
  if (!SCHOOL_TEAM_ROLES.has(role)) issues.push("role");
  if (issues.length) {
    return { ok: false, message: `Invalid or missing fields: ${issues.join(", ")}` };
  }
  return { ok: true, data: { email, password, firstName, lastName, role } };
}

function newCurriculumId() {
  return `cur_${crypto.randomBytes(6).toString("hex")}`;
}
function newGroupId() {
  return `grp_${crypto.randomBytes(6).toString("hex")}`;
}

exports.listCountries = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT code, label, vat_rate AS vatRate FROM countries ORDER BY sort_order ASC, label ASC`,
    );
    res.json({ ok: true, data: { countries: rows } });
  } catch (e) {
    next(e);
  }
};

exports.createCountry = async (req, res, next) => {
  try {
    const code = t(req.body.code)
      .toUpperCase()
      .replace(/\s+/g, "");
    const label = t(req.body.label);
    const vatRate = Number(req.body.vatRate);
    if (!code || code.length < 2 || code.length > 32) throw badRequest("Country code required (2–32 characters)");
    if (!/^[A-Z0-9_]+$/.test(code)) throw badRequest("Country code: use letters, digits, underscore only");
    if (!label || label.length > 191) throw badRequest("Country name required");
    if (Number.isNaN(vatRate) || vatRate < 0 || vatRate > 100) throw badRequest("VAT rate must be 0–100");

    await pool.query(`INSERT INTO countries (code, label, vat_rate, sort_order) VALUES (?, ?, ?, 100)`, [
      code,
      label,
      vatRate,
    ]);
    res.status(201).json({ ok: true, data: { country: { code, label, vatRate } } });
  } catch (e) {
    if (e.code === "ER_DUP_ENTRY" || e.errno === 1062) {
      next(badRequest("A country with this code already exists"));
      return;
    }
    next(e);
  }
};

exports.listCurricula = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`SELECT id, name FROM curricula ORDER BY sort_order ASC, name ASC`);
    res.json({ ok: true, data: { curricula: rows } });
  } catch (e) {
    next(e);
  }
};

exports.createCurriculum = async (req, res, next) => {
  try {
    const name = t(req.body.name);
    if (!name || name.length > 191) throw badRequest("Curriculum name required");
    const id = newCurriculumId();
    await pool.query(`INSERT INTO curricula (id, name) VALUES (?, ?)`, [id, name]);
    res.status(201).json({ ok: true, data: { curriculum: { id, name } } });
  } catch (e) {
    if (e.code === "ER_DUP_ENTRY" || e.errno === 1062) {
      next(badRequest("A curriculum with this name already exists"));
      return;
    }
    next(e);
  }
};

exports.listSchoolGroups = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`SELECT id, name FROM school_groups ORDER BY name ASC`);
    res.json({ ok: true, data: { groups: rows } });
  } catch (e) {
    next(e);
  }
};

exports.createSchoolGroup = async (req, res, next) => {
  try {
    const name = t(req.body.name);
    if (!name || name.length > 191) throw badRequest("Group name required");
    const [exist] = await pool.query(`SELECT id FROM school_groups WHERE name = ? LIMIT 1`, [name]);
    if (exist.length) throw badRequest("A group with this name already exists");
    const id = newGroupId();
    await pool.query(`INSERT INTO school_groups (id, name) VALUES (?, ?)`, [id, name]);
    res.status(201).json({ ok: true, data: { group: { id, name } } });
  } catch (e) {
    next(e);
  }
};

exports.listSchoolUsers = async (req, res, next) => {
  try {
    const schoolId = t(req.params.id);
    const [school] = await pool.query(`SELECT id FROM schools WHERE id = ? LIMIT 1`, [schoolId]);
    if (!school.length) throw notFound("School not found");
    const [rows] = await pool.query(
      `SELECT id, email, first_name AS firstName, last_name AS lastName, role, active, username
       FROM users WHERE school_id = ? ORDER BY email ASC`,
      [schoolId],
    );
    res.json({ ok: true, data: { users: rows } });
  } catch (e) {
    next(e);
  }
};

exports.createSchoolUser = async (req, res, next) => {
  try {
    const schoolId = t(req.params.id);
    const [school] = await pool.query(`SELECT id, preferred_lang FROM schools WHERE id = ? LIMIT 1`, [schoolId]);
    if (!school.length) throw notFound("School not found");
    const parsed = parseAddSchoolUserBody(req.body);
    if (!parsed.ok) throw badRequest(parsed.message);
    const { email, password, firstName, lastName, role } = parsed.data;

    const [dup] = await pool.query(`SELECT id FROM users WHERE email = ? LIMIT 1`, [email]);
    if (dup.length) throw badRequest("That email is already registered");

    const userId = newUserId();
    const passwordHash = await bcrypt.hash(password, 10);
    const preferredLang = school[0].preferred_lang || "en";

    await pool.query(
      `INSERT INTO users (
        id, email, password_hash, first_name, last_name, role,
        department, active, preferred_lang, school_id, publisher_id, username
      ) VALUES (?,?,?,?,?,?,NULL,1,?,?,NULL,NULL)`,
      [userId, email, passwordHash, firstName, lastName, role, preferredLang, schoolId],
    );

    res.status(201).json({
      ok: true,
      data: {
        user: { id: userId, email, firstName, lastName, role, schoolId, active: 1 },
      },
    });
  } catch (e) {
    next(e);
  }
};

exports.updateSchoolUser = async (req, res, next) => {
  try {
    const schoolId = t(req.params.id);
    const userId = t(req.params.userId);
    const [rows] = await pool.query(`SELECT id FROM users WHERE id = ? AND school_id = ? LIMIT 1`, [userId, schoolId]);
    if (!rows.length) throw notFound("User not found");

    const raw = req.body || {};
    const updates = [];
    const vals = [];

    if (raw.firstName !== undefined) {
      const firstName = t(raw.firstName);
      if (!firstName || firstName.length > 191) throw badRequest("Invalid firstName");
      updates.push("first_name = ?");
      vals.push(firstName);
    }
    if (raw.lastName !== undefined) {
      const lastName = t(raw.lastName);
      if (!lastName || lastName.length > 191) throw badRequest("Invalid lastName");
      updates.push("last_name = ?");
      vals.push(lastName);
    }
    if (raw.role !== undefined) {
      const role = t(raw.role);
      if (!SCHOOL_TEAM_ROLES.has(role)) throw badRequest("Invalid role");
      updates.push("role = ?");
      vals.push(role);
    }
    if (raw.active !== undefined) {
      const active =
        raw.active === true || raw.active === "true" || raw.active === 1 || raw.active === "1" ? 1 : 0;
      updates.push("active = ?");
      vals.push(active);
    }
    if (raw.password !== undefined && String(raw.password).length > 0) {
      const password = String(raw.password);
      if (password.length < 8 || password.length > 128) throw badRequest("Invalid password");
      updates.push("password_hash = ?");
      vals.push(await bcrypt.hash(password, 10));
    }

    if (!updates.length) throw badRequest("Nothing to update");

    vals.push(userId);
    await pool.query(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`, vals);

    res.json({ ok: true, data: { user: { id: userId } } });
  } catch (e) {
    next(e);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const id = t(req.params.id);
    if (!id) throw badRequest("School id required");

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Delete school users
      await conn.query(`DELETE FROM users WHERE school_id = ?`, [id]);

      // Delete school
      const [result] = await conn.query(`DELETE FROM schools WHERE id = ?`, [id]);
      if (result.affectedRows === 0) throw notFound("School not found");

      await conn.commit();
      res.json({ ok: true, data: { id } });
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  } catch (e) {
    next(e);
  }
};
