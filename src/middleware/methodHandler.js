const createError = require("http-errors");

const methodNotAllowed = (req, res, next) => {
  next(createError(405, `${req.method} not allowed on ${req.originalUrl}`));
};

module.exports = methodNotAllowed;
