const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const crypto = require("crypto");
const { verifyAccessToken } = require("../jwtUtil");
const { unauthorized, forbidden } = require("../errors");
const env = require("../env");
const adminSchoolsController = require("../controllers/adminSchoolsController");
const adminCatalogueController = require("../controllers/adminCatalogueController");

const router = express.Router();

function authRequired(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) throw unauthorized();
    const token = header.slice("Bearer ".length);
    const claims = verifyAccessToken(token);
    if (claims.typ !== "access") throw unauthorized();
    req.user = {
      id: claims.id,
      role: claims.role,
      schoolId: claims.schoolId ?? null,
      publisherId: claims.publisherId ?? null,
      impersonatedById: claims.impersonatedById ?? null,
    };
    next();
  } catch {
    next(unauthorized());
  }
}

function requirePanworldAdmin(req, res, next) {
  if (!req.user || req.user.role !== "PANWORLD_ADMIN") {
    next(forbidden());
    return;
  }
  next();
}

const logoDir = path.join(path.resolve(env.UPLOAD_DIR), "school-logos");
function ensureLogoDir() {
  fs.mkdirSync(logoDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    ensureLogoDir();
    cb(null, logoDir);
  },
  filename(_req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const safe = [".png", ".jpg", ".jpeg", ".webp", ".gif"].includes(ext) ? ext : ".png";
    cb(null, `${crypto.randomUUID()}${safe}`);
  },
});

const uploadSchoolLogo = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    const ok = /^image\/(jpeg|png|webp|gif)$/i.test(file.mimetype);
    cb(null, ok);
  },
});

function maybeSchoolLogoUpload(req, res, next) {
  if (req.is("multipart/form-data")) {
    return uploadSchoolLogo.single("logo")(req, res, next);
  }
  return next();
}

const catalogueUploadRoot = path.join(path.resolve(env.UPLOAD_DIR), "catalogue");
const catalogueCoverDir = path.join(catalogueUploadRoot, "covers");
const catalogueMaterialDir = path.join(catalogueUploadRoot, "materials");
function ensureCatalogueDirs() {
  fs.mkdirSync(catalogueCoverDir, { recursive: true });
  fs.mkdirSync(catalogueMaterialDir, { recursive: true });
}

const catalogueStorage = multer.diskStorage({
  destination(_req, file, cb) {
    ensureCatalogueDirs();
    if (file.fieldname === "coverImage") cb(null, catalogueCoverDir);
    else cb(null, catalogueMaterialDir);
  },
  filename(_req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomUUID()}${ext || ""}`);
  },
});

const uploadCatalogueItemAssets = multer({
  storage: catalogueStorage,
  limits: { fileSize: 500 * 1024 * 1024 }, // increased from 20MB to 500MB
});

function maybeCatalogueItemAssetsUpload(req, res, next) {
  if (req.is("multipart/form-data")) {
    return uploadCatalogueItemAssets.fields([
      { name: "coverImage", maxCount: 1 },
      { name: "materialFile", maxCount: 1 },
    ])(req, res, next);
  }
  return next();
}

router.use(authRequired, requirePanworldAdmin);

router.get("/countries", (req, res, next) => adminSchoolsController.listCountries(req, res, next));
router.post("/countries", (req, res, next) => adminSchoolsController.createCountry(req, res, next));

router.get("/curricula", (req, res, next) => adminSchoolsController.listCurricula(req, res, next));
router.post("/curricula", (req, res, next) => adminSchoolsController.createCurriculum(req, res, next));
router.get("/school-groups", (req, res, next) => adminSchoolsController.listSchoolGroups(req, res, next));
router.post("/school-groups", (req, res, next) => adminSchoolsController.createSchoolGroup(req, res, next));

router.get("/schools", (req, res, next) => adminSchoolsController.list(req, res, next));
router.get("/schools/:id/users", (req, res, next) => adminSchoolsController.listSchoolUsers(req, res, next));
router.post("/schools/:id/users", (req, res, next) => adminSchoolsController.createSchoolUser(req, res, next));
router.patch("/schools/:id/users/:userId", (req, res, next) =>
  adminSchoolsController.updateSchoolUser(req, res, next),
);
router.get("/schools/:id", (req, res, next) => adminSchoolsController.getOne(req, res, next));
router.patch("/schools/:id", maybeSchoolLogoUpload, (req, res, next) =>
  adminSchoolsController.update(req, res, next),
);
router.delete("/schools/:id", (req, res, next) => adminSchoolsController.delete(req, res, next));
router.post("/schools", maybeSchoolLogoUpload, (req, res, next) =>
  adminSchoolsController.create(req, res, next),
);

router.get("/catalogue/series", (req, res, next) => adminCatalogueController.listSeries(req, res, next));
router.get("/catalogue/series/:id", (req, res, next) => adminCatalogueController.getSeriesDetail(req, res, next));
router.post("/catalogue/series", (req, res, next) => adminCatalogueController.createSeries(req, res, next));
router.post("/catalogue/series/:id/items", maybeCatalogueItemAssetsUpload, (req, res, next) =>
  adminCatalogueController.createSeriesItem(req, res, next),
);
router.patch("/catalogue/series/:id/status", (req, res, next) =>
  adminCatalogueController.updateSeriesStatus(req, res, next),
);
router.post("/catalogue/series/:id/marketing-elements", (req, res, next) =>
  adminCatalogueController.createMarketingElement(req, res, next),
);

module.exports = router;
