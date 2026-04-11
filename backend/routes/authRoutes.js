const express = require("express");
const { verifyAccessToken } = require("../jwtUtil");
const { unauthorized } = require("../errors");
const authController = require("../controllers/authController");

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

router.post("/login", (req, res, next) => authController.login(req, res, next));
router.post("/refresh", (req, res, next) => authController.refresh(req, res, next));
router.post("/logout", (req, res, next) => authController.logout(req, res, next));
router.get("/me", authRequired, (req, res, next) => authController.me(req, res, next));
router.post("/forgot-password", (req, res, next) => authController.forgotPassword(req, res, next));
router.post("/reset-password", (req, res, next) => authController.resetPassword(req, res, next));

module.exports = router;
