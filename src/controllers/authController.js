const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readDb } = require('../services/storageService');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/constants');
const { sendResponse } = require('../utils/response');

async function login(req, res) {
  try {
    const { username, password } = req.body;
    const db = readDb();
    const user = db.users.find((u) => u.username === username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return sendResponse(res, 401, {
        success: false,
        message: 'Credenciales inválidas.',
        errors: ['INVALID_CREDENTIALS']
      });
    }

    const token = jwt.sign(
      { sub: user.id, username: user.username, rol: user.rol },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return sendResponse(res, 200, {
      success: true,
      data: {
        token,
        token_type: 'Bearer',
        expires_in: '2 horas',
        rol: user.rol
      },
      message: 'Autenticación exitosa.',
      errors: []
    });
  } catch (error) {
    return sendResponse(res, 500, {
      success: false,
      message: 'Error interno del servidor.',
      errors: ['INTERNAL_SERVER_ERROR']
    });
  }
}

module.exports = { login };
