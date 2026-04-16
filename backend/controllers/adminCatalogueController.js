const crypto = require("crypto");
const { pool } = require("../db");
const { badRequest, notFound } = require("../errors");
const env = require("../env");

const CATEGORIES = new Set(["textbooks", "library", "kits"]);
const SERIES_STATUS = new Set(["Published", "Draft", "Archived"]);
const ITEM_STATUS = new Set(["Published", "Draft", "Archived"]);
const MARKETING_STAGE = new Set(["PRE_SALES", "POST_SALES", "BOTH"]);
const RESOURCE_TYPES = new Set([
  "TEXTBOOK",
  "LIBRARY_BOOK",
  "TEACHER_GUIDE",
  "PRACTICE_BOOK",
  "KIT",
  "DIGITAL_LICENSE",
  "ASSESSMENT",
  "BROCHURE",
  "OTHER",
]);

function t(v) {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

function parseJsonArray(v) {
  if (Array.isArray(v)) return v.map((x) => t(x)).filter(Boolean);
  if (!v) return [];
  try {
    const parsed = typeof v === "string" ? JSON.parse(v) : v;
    return Array.isArray(parsed) ? parsed.map((x) => t(x)).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function id(prefix) {
  return `${prefix}_${crypto.randomBytes(6).toString("hex")}`;
}

function parseCreateSeries(body) {
  const category = t(body.category).toLowerCase();
  if (!CATEGORIES.has(category)) throw badRequest("category must be textbooks, library, or kits");

  const name = t(body.name);
  const publisher = t(body.publisher);
  const format = t(body.format) || "Print";
  const curriculum = t(body.curriculum);
  const subject = t(body.subject);
  const gradeFrom = t(body.gradeFrom);
  const gradeTo = t(body.gradeTo);
  const description = t(body.description);
  const detailLine = t(body.detailLine);
  const status = t(body.status) || "Draft";

  if (!name) throw badRequest("name is required");
  if (!publisher) throw badRequest("publisher is required");
  if (!curriculum) throw badRequest("curriculum is required");
  if (!subject) throw badRequest("subject is required");
  if (!gradeFrom || !gradeTo) throw badRequest("gradeFrom and gradeTo are required");
  if (!SERIES_STATUS.has(status)) throw badRequest("status must be Published, Draft, or Archived");

  return {
    category,
    name,
    publisher,
    format,
    curriculum,
    subject,
    gradeFrom,
    gradeTo,
    description: description || null,
    detailLine: detailLine || null,
    status,
    badges: parseJsonArray(body.badges),
    territories: parseJsonArray(body.territories),
    folderImageUrl: t(body.folderImageUrl) || null,
  };
}

function parseCreateItem(body) {
  const title = t(body.title);
  const gradeLabel = t(body.gradeLabel);
  const price = Number(body.price);
  const currencyCode = t(body.currencyCode || body.currency || "AED").toUpperCase();
  const priceUnit = t(body.priceUnit) || "/ student";
  const status = t(body.status) || "Draft";
  const subject = t(body.subject) || null;
  const resourceType = t(body.resourceType || "TEXTBOOK").toUpperCase();

  if (!title) throw badRequest("title is required");
  if (!gradeLabel) throw badRequest("gradeLabel is required");
  if (Number.isNaN(price) || price < 0) throw badRequest("price must be a positive number");
  if (!ITEM_STATUS.has(status)) throw badRequest("status must be Published, Draft, or Archived");
  if (!RESOURCE_TYPES.has(resourceType)) throw badRequest("Invalid resourceType");

  return {
    resourceType,
    title,
    subject,
    gradeLabel,
    internalSku: t(body.internalSku) || null,
    isbn: t(body.isbn) || null,
    format: t(body.format) || "Print",
    price,
    currencyCode,
    priceUnit,
    status,
    coverImageUrl: t(body.coverImageUrl) || null,
    materialLinkUrl: t(body.materialLinkUrl) || null,
    materialFileUrl: t(body.materialFileUrl) || null,
    inventoryNote: t(body.inventoryNote) || null,
  };
}

exports.listSeries = async (req, res, next) => {
  try {
    const category = t(req.query.category || "textbooks").toLowerCase();
    if (!CATEGORIES.has(category)) throw badRequest("Invalid category");

    const [rows] = await pool.query(
      `SELECT
         s.id, s.category, s.name, s.publisher, s.format, s.curriculum_type AS curriculumType,
         s.subject, s.grade_from AS gradeFrom, s.grade_to AS gradeTo, s.description,
         s.detail_line AS detailLine, s.status, s.badges, s.folder_image_url AS folderImageUrl,
         COUNT(i.id) AS itemCount,
         MIN(i.list_price) AS minPrice
       FROM catalogue_series s
       LEFT JOIN catalogue_series_items i ON i.series_id = s.id
       WHERE s.category = ?
       GROUP BY s.id
       ORDER BY s.created_at DESC`,
      [category],
    );

    const series = rows.map((r) => ({
      ...r,
      badges: parseJsonArray(r.badges),
      minPrice: r.minPrice == null ? null : Number(r.minPrice),
      itemCount: Number(r.itemCount || 0),
    }));

    res.json({ ok: true, data: { series } });
  } catch (e) {
    next(e);
  }
};

exports.getSeriesDetail = async (req, res, next) => {
  try {
    const seriesId = t(req.params.id);
    if (!seriesId) throw badRequest("Series id required");

    const [seriesRows] = await pool.query(
      `SELECT
         id, category, name, publisher, format, curriculum_type AS curriculumType, subject,
         grade_from AS gradeFrom, grade_to AS gradeTo, description, detail_line AS detailLine,
         status, badges, territories, folder_image_url AS folderImageUrl
       FROM catalogue_series
       WHERE id = ? LIMIT 1`,
      [seriesId],
    );
    if (!seriesRows.length) throw notFound("Series not found");

    const [itemRows] = await pool.query(
      `SELECT
         id, resource_type AS resourceType, title, subject, grade_label AS gradeLabel, internal_sku AS internalSku, isbn, format,
         list_price AS listPrice, currency_code AS currencyCode, price_unit AS priceUnit, status,
         cover_image_url AS coverImageUrl, material_link_url AS materialLinkUrl,
         material_file_url AS materialFileUrl, inventory_note AS inventoryNote
       FROM catalogue_series_items
       WHERE series_id = ?
       ORDER BY sort_order ASC, created_at ASC`,
      [seriesId],
    );

    const [marketingRows] = await pool.query(
      `SELECT
         id, asset_type AS assetType, title, description, asset_url AS assetUrl,
         asset_file_url AS assetFileUrl, audience_stage AS audienceStage, status
       FROM catalogue_series_marketing_assets
       WHERE series_id = ?
       ORDER BY sort_order ASC, created_at ASC`,
      [seriesId],
    );

    const series = seriesRows[0];
    series.badges = parseJsonArray(series.badges);
    series.territories = parseJsonArray(series.territories);

    res.json({ ok: true, data: { series, items: itemRows, marketingElements: marketingRows } });
  } catch (e) {
    next(e);
  }
};

exports.createSeries = async (req, res, next) => {
  try {
    const input = parseCreateSeries(req.body || {});
    const seriesId = id("ser");
    await pool.query(
      `INSERT INTO catalogue_series (
         id, category, name, publisher, format, curriculum_type, subject, grade_from, grade_to,
         description, detail_line, status, badges, territories, folder_image_url, created_by_user_id, updated_by_user_id
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        seriesId,
        input.category,
        input.name,
        input.publisher,
        input.format,
        input.curriculum,
        input.subject,
        input.gradeFrom,
        input.gradeTo,
        input.description,
        input.detailLine,
        input.status,
        JSON.stringify(input.badges),
        JSON.stringify(input.territories),
        input.folderImageUrl,
        req.user.id,
        req.user.id,
      ],
    );

    res.status(201).json({ ok: true, data: { series: { id: seriesId } } });
  } catch (e) {
    next(e);
  }
};

exports.createSeriesItem = async (req, res, next) => {
  try {
    const seriesId = t(req.params.id);
    if (!seriesId) throw badRequest("Series id required");
    const [seriesRows] = await pool.query(`SELECT id FROM catalogue_series WHERE id = ? LIMIT 1`, [seriesId]);
    if (!seriesRows.length) throw notFound("Series not found");

    const body = { ...(req.body || {}) };
    const files = req.files || {};
    const coverFile = Array.isArray(files.coverImage) ? files.coverImage[0] : null;
    const materialFile = Array.isArray(files.materialFile) ? files.materialFile[0] : null;
    if (coverFile) body.coverImageUrl = `${env.FILE_PUBLIC_BASE}/api/files/catalogue/covers/${coverFile.filename}`;
    if (materialFile) body.materialFileUrl = `${env.FILE_PUBLIC_BASE}/api/files/catalogue/materials/${materialFile.filename}`;

    const input = parseCreateItem(body);
    const itemId = id("itm");
    await pool.query(
      `INSERT INTO catalogue_series_items (
         id, series_id, resource_type, title, subject, grade_label, internal_sku, isbn, format, list_price, currency_code,
         price_unit, status, cover_image_url, material_link_url, material_file_url, inventory_note
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        itemId,
        seriesId,
        input.resourceType,
        input.title,
        input.subject,
        input.gradeLabel,
        input.internalSku,
        input.isbn,
        input.format,
        input.price,
        input.currencyCode,
        input.priceUnit,
        input.status,
        input.coverImageUrl,
        input.materialLinkUrl,
        input.materialFileUrl,
        input.inventoryNote,
      ],
    );

    res.status(201).json({ ok: true, data: { item: { id: itemId } } });
  } catch (e) {
    next(e);
  }
};

exports.createMarketingElement = async (req, res, next) => {
  try {
    const seriesId = t(req.params.id);
    if (!seriesId) throw badRequest("Series id required");
    const [seriesRows] = await pool.query(`SELECT id FROM catalogue_series WHERE id = ? LIMIT 1`, [seriesId]);
    if (!seriesRows.length) throw notFound("Series not found");

    const assetType = t(req.body.assetType);
    const title = t(req.body.title);
    const audienceStage = t(req.body.audienceStage || "BOTH");
    const status = t(req.body.status || "Published");
    if (!assetType) throw badRequest("assetType is required");
    if (!title) throw badRequest("title is required");
    if (!MARKETING_STAGE.has(audienceStage)) throw badRequest("audienceStage must be PRE_SALES, POST_SALES, or BOTH");
    if (!SERIES_STATUS.has(status)) throw badRequest("status must be Published, Draft, or Archived");

    const assetId = id("mkt");
    await pool.query(
      `INSERT INTO catalogue_series_marketing_assets (
         id, series_id, asset_type, title, description, asset_url, asset_file_url, audience_stage, status
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        assetId,
        seriesId,
        assetType,
        title,
        t(req.body.description) || null,
        t(req.body.assetUrl) || null,
        t(req.body.assetFileUrl) || null,
        audienceStage,
        status,
      ],
    );

    res.status(201).json({ ok: true, data: { marketingElement: { id: assetId } } });
  } catch (e) {
    next(e);
  }
};
