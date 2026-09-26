const { validationResult } = require('express-validator');
const { sendResponse } = require('../utils/response');
const { sanitizeObject } = require('../utils/sanitize');

function sanitizeBody(req, _res, next) {
  req.body = sanitizeObject(req.body || {});
  next();
}

function validateRequest(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return sendResponse(res, 400, {
      success: false,
      message: 'Los datos enviados no son válidos.',
      errors: result.array().map((e) => ({ field: e.path, message: e.msg }))
    });
  }
  next();
}

module.exports = { sanitizeBody, validateRequest };
