const jwt = require("jsonwebtoken");
const env = require("./env");

function signAccessToken(user) {
  const payload = {
    id: user.id,
    role: user.role,
    schoolId: user.schoolId,
    publisherId: user.publisherId,
    impersonatedById: user.impersonatedById,
    typ: "access",
  };
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_TTL_SECONDS });
}

function signRefreshToken(userId) {
  return jwt.sign({ uid: userId, typ: "refresh" }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_TTL_SECONDS,
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
