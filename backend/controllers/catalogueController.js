const crypto = require("crypto");
const { executeQuery } = require("../db");

function generateId() {
  return crypto.randomBytes(16).toString("hex");
}

// Get all catalogues (products) for a tab type
async function getCatalogues(req, res, next) {
  try {
    const { type = "TEXTBOOK" } = req.query;
    const query = `
      SELECT 
        p.id, p.sku, p.name, p.series_name, p.grade_min, p.grade_max,
        p.subject, p.curriculum, p.format, p.edition, p.country_tags,
        p.ncc_approved, p.price, p.cover_image_url, p.metadata,
        p.publisher_id, pub.name as publisher_name,
        p.created_at, p.updated_at
      FROM products p
      LEFT JOIN publishers pub ON p.publisher_id = pub.id
      WHERE p.type = ?
      ORDER BY p.created_at DESC
    `;
    console.log("[catalogueController] Fetching catalogues with type:", type);
    const products = await executeQuery(query, [type]);
    console.log("[catalogueController] Found", products.length, "catalogues");
    res.json({ ok: true, data: products });
  } catch (err) {
    console.error("[catalogueController] Error in getCatalogues:", err.message, err.code);
    next(err);
  }
}

// Get single catalogue with line items
async function getCatalogueById(req, res, next) {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        p.id, p.sku, p.name, p.series_name, p.grade_min, p.grade_max,
        p.subject, p.curriculum, p.format, p.edition, p.country_tags,
        p.ncc_approved, p.price, p.cover_image_url, p.metadata,
        p.publisher_id, pub.name as publisher_name,
        p.created_at, p.updated_at
      FROM products p
      LEFT JOIN publishers pub ON p.publisher_id = pub.id
      WHERE p.id = ?
    `;
    const products = await executeQuery(query, [id]);
    if (products.length === 0) {
      res.status(404).json({ ok: false, error: "Catalogue not found" });
      return;
    }
    res.json({ ok: true, data: products[0] });
  } catch (err) {
    next(err);
  }
}

// Create new catalogue (product)
async function createCatalogue(req, res, next) {
  try {
    const {
      name,
      seriesName,
      type = "TEXTBOOK",
      gradeFrom,
      gradeTo,
      subject,
      curriculum,
      format,
      edition,
      publisherId,
      countryTags = ["UAE", "KSA"],
      nccApproved = false,
      price = 0,
      coverImageUrl,
      metadata,
      status = "Published",
    } = req.body;

    if (!name || !publisherId) {
      res.status(400).json({
        ok: false,
        error: "Missing required fields: name, publisherId",
      });
      return;
    }

    const id = generateId();
    const sku = `${type}-${Date.now()}`;

    const gradeMin = gradeFrom ? parseInt(gradeFrom.replace(/\D/g, ""), 10) : null;
    const gradeMax = gradeTo ? parseInt(gradeTo.replace(/\D/g, ""), 10) : null;

    const insertQuery = `
      INSERT INTO products (
        id, sku, name, series_name, type, grade_min, grade_max,
        subject, curriculum, format, edition, country_tags,
        ncc_approved, price, cover_image_url, metadata, publisher_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await executeQuery(insertQuery, [
      id,
      sku,
      name,
      seriesName || null,
      type,
      gradeMin,
      gradeMax,
      subject || null,
      curriculum || null,
      format || null,
      edition || null,
      JSON.stringify(countryTags),
      nccApproved ? 1 : 0,
      price,
      coverImageUrl || null,
      metadata ? JSON.stringify(metadata) : null,
      publisherId,
    ]);

    res.status(201).json({
      ok: true,
      data: { id, sku, name, seriesName, type, gradeMin, gradeMax, status },
    });
  } catch (err) {
    next(err);
  }
}

// Update catalogue
async function updateCatalogue(req, res, next) {
  try {
    const { id } = req.params;
    const {
      name,
      seriesName,
      gradeFrom,
      gradeTo,
      subject,
      curriculum,
      format,
      edition,
      countryTags,
      nccApproved,
      price,
      coverImageUrl,
      metadata,
    } = req.body;

    const gradeMin = gradeFrom ? parseInt(gradeFrom.replace(/\D/g, ""), 10) : null;
    const gradeMax = gradeTo ? parseInt(gradeTo.replace(/\D/g, ""), 10) : null;

    const updateQuery = `
      UPDATE products
      SET 
        name = COALESCE(?, name),
        series_name = COALESCE(?, series_name),
        grade_min = COALESCE(?, grade_min),
        grade_max = COALESCE(?, grade_max),
        subject = COALESCE(?, subject),
        curriculum = COALESCE(?, curriculum),
        format = COALESCE(?, format),
        edition = COALESCE(?, edition),
        country_tags = COALESCE(?, country_tags),
        ncc_approved = COALESCE(?, ncc_approved),
        price = COALESCE(?, price),
        cover_image_url = COALESCE(?, cover_image_url),
        metadata = COALESCE(?, metadata),
        updated_at = CURRENT_TIMESTAMP(3)
      WHERE id = ?
    `;

    await executeQuery(updateQuery, [
      name || null,
      seriesName || null,
      gradeMin || null,
      gradeMax || null,
      subject || null,
      curriculum || null,
      format || null,
      edition || null,
      countryTags ? JSON.stringify(countryTags) : null,
      nccApproved !== undefined ? (nccApproved ? 1 : 0) : null,
      price || null,
      coverImageUrl || null,
      metadata ? JSON.stringify(metadata) : null,
      id,
    ]);

    res.json({ ok: true, message: "Catalogue updated" });
  } catch (err) {
    next(err);
  }
}

// Delete catalogue
async function deleteCatalogue(req, res, next) {
  try {
    const { id } = req.params;
    const deleteQuery = "DELETE FROM products WHERE id = ?";
    await executeQuery(deleteQuery, [id]);
    res.json({ ok: true, message: "Catalogue deleted" });
  } catch (err) {
    next(err);
  }
}

// Get publishers list
async function getPublishers(req, res, next) {
  try {
    console.log("[catalogueController] Fetching publishers list");
    const query = "SELECT id, name FROM publishers ORDER BY name";
    const publishers = await executeQuery(query);
    console.log("[catalogueController] Found", publishers.length, "publishers");
    res.json({ ok: true, data: publishers });
  } catch (err) {
    console.error("[catalogueController] Error in getPublishers:", err.message, err.code);
    next(err);
  }
}

module.exports = {
  getCatalogues,
  getCatalogueById,
  createCatalogue,
  updateCatalogue,
  deleteCatalogue,
  getPublishers,
};
