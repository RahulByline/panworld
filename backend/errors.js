class HttpError extends Error {
  constructor(status, code, message, details = null) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function badRequest(message, details) {
  return new HttpError(400, "BAD_REQUEST", message, details);
}
function unauthorized(message = "Unauthorized") {
  return new HttpError(401, "UNAUTHORIZED", message);
}
function forbidden(message = "Forbidden") {
  return new HttpError(403, "FORBIDDEN", message);
}
function notFound(message = "Not found") {
  return new HttpError(404, "NOT_FOUND", message);
}

module.exports = { HttpError, badRequest, unauthorized, forbidden, notFound };
