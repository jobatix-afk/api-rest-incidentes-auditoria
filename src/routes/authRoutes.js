const express = require('express');
const { body } = require('express-validator');
const { login } = require('../controllers/authController');
const { sanitizeBody, validateRequest } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post(
  '/login',
  sanitizeBody,
  body('username').isString().trim().isLength({ min: 3, max: 50 }),
  body('password').isString().isLength({ min: 8, max: 128 }),
  validateRequest,
  login
);

module.exports = router;
