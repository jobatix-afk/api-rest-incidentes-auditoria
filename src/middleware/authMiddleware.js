const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/constants');
const { sendResponse } = require('../utils/response');

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendResponse(res, 401, {
      success: false,
      message: 'Token JWT requerido en Authorization: Bearer <token>.',
      errors: ['AUTH_TOKEN_REQUIRED']
    });
  }

  const token = authHeader.substring(7).trim();

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    return sendResponse(res, 401, {
      success: false,
      message: 'Token inválido o expirado.',
      errors: ['AUTH_TOKEN_INVALID']
    });
  }
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.rol)) {
      return sendResponse(res, 403, {
        success: false,
        message: 'No tiene permisos para realizar esta acción.',
        errors: ['FORBIDDEN']
      });
    }
    next();
  };
}

module.exports = { authenticateJWT, authorizeRoles };
