const express = require('express');
const { body, param, query } = require('express-validator');
const {
  createIncident,
  listIncidents,
  getIncidentById,
  updateIncidentStatus,
  deleteIncident
} = require('../controllers/incidentesController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const { sanitizeBody, validateRequest } = require('../middleware/validationMiddleware');
const { TIPOS, SEVERIDADES, ESTADOS } = require('../config/constants');

const router = express.Router();
router.use(authenticateJWT);

router.post(
  '/',
  authorizeRoles('auditor', 'administrador'),
  sanitizeBody,
  body('id').not().exists().withMessage('id es generado automáticamente.'),
  body('eliminado').not().exists().withMessage('eliminado es generado automáticamente.'),
  body('created_at').not().exists().withMessage('created_at es generado automáticamente.'),
  body('update_at').not().exists().withMessage('update_at es generado automáticamente.'),
  body('titulo').isString().trim().isLength({ min: 3, max: 150 }),
  body('descripcion').isString().trim().isLength({ min: 5, max: 2000 }),
  body('tipo').isIn(TIPOS).withMessage(`tipo debe ser uno de: ${TIPOS.join(', ')}`),
  body('severidad').isIn(SEVERIDADES).withMessage(`severidad debe ser una de: ${SEVERIDADES.join(', ')}`),
  body('estado').isIn(ESTADOS).withMessage(`estado debe ser uno de: ${ESTADOS.join(', ')}`),
  body('sistema_afectado').isString().trim().isLength({ min: 2, max: 150 }),
  body('auditor_id').isInt({ min: 1 }).withMessage('auditor_id debe ser entero positivo.'),
  body('fecha_deteccion').isISO8601().withMessage('fecha_deteccion debe ser una fecha válida ISO 8601.'),
  body('observaciones').optional().isString().trim().isLength({ max: 2000 }),
  validateRequest,
  createIncident
);

router.get(
  '/',
  authorizeRoles('auditor', 'administrador'),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  validateRequest,
  listIncidents
);

router.get(
  '/:id',
  authorizeRoles('auditor', 'administrador'),
  param('id').isInt({ min: 1 }),
  validateRequest,
  getIncidentById
);

router.patch(
  '/:id/estado',
  authorizeRoles('auditor', 'administrador'),
  sanitizeBody,
  param('id').isInt({ min: 1 }),
  body('estado').isIn(ESTADOS).withMessage(`estado debe ser uno de: ${ESTADOS.join(', ')}`),
  body().custom((value) => {
    const allowed = ['estado'];
    const extras = Object.keys(value).filter((k) => !allowed.includes(k));
    if (extras.length) throw new Error(`Solo se permite modificar estado. Campos extra: ${extras.join(', ')}`);
    return true;
  }),
  validateRequest,
  updateIncidentStatus
);

router.delete(
  '/:id',
  authorizeRoles('administrador'),
  param('id').isInt({ min: 1 }),
  validateRequest,
  deleteIncident
);

module.exports = router;
