const express = require('express');
const helmet = require('helmet');
const authRoutes = require('./routes/authRoutes');
const incidentesRoutes = require('./routes/incidentesRoutes');
const { sendResponse } = require('./utils/response');

const app = express();

app.use(helmet());
app.use(express.json({ limit: '50kb' }));

app.use('/auth', authRoutes);
app.use('/incidentes', incidentesRoutes);

app.use((req, res) => {
  return sendResponse(res, 404, {
    success: false,
    message: 'Endpoint no encontrado.',
    errors: ['ROUTE_NOT_FOUND']
  });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return sendResponse(res, 400, {
      success: false,
      message: 'JSON inválido.',
      errors: ['INVALID_JSON']
    });
  }

  console.error(err);
  return sendResponse(res, 500, {
    success: false,
    message: 'Error interno del servidor.',
    errors: ['INTERNAL_SERVER_ERROR']
  });
});

module.exports = app;
