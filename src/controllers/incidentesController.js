const { readDb, writeDb } = require('../services/storageService');
const { sendResponse } = require('../utils/response');

function toPublicIncident(incident) {
  const { eliminado, ...publicIncident } = incident;
  return publicIncident;
}

function createIncident(req, res) {
  try {
    const db = readDb();
    const now = new Date().toISOString();

    const incident = {
      id: db.nextIncidentId,
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
      tipo: req.body.tipo,
      severidad: req.body.severidad,
      estado: req.body.estado,
      sistema_afectado: req.body.sistema_afectado,
      auditor_id: Number(req.body.auditor_id),
      fecha_deteccion: new Date(req.body.fecha_deteccion).toISOString(),
      observaciones: req.body.observaciones || '',
      eliminado: false,
      created_at: now,
      update_at: now
    };

    db.incidents.push(incident);
    db.nextIncidentId += 1;
    writeDb(db);

    return sendResponse(res, 201, {
      success: true,
      data: toPublicIncident(incident),
      message: 'Incidente creado correctamente.',
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

function listIncidents(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));

    const db = readDb();
    const active = db.incidents.filter((i) => i.eliminado === false);
    const total = active.length;
    const start = (page - 1) * limit;
    const items = active.slice(start, start + limit).map(toPublicIncident);

    return sendResponse(res, 200, {
      success: true,
      data: {
        data: items,
        page,
        limit,
        total
      },
      message: 'Incidentes obtenidos correctamente.',
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

function getIncidentById(req, res) {
  try {
    const id = Number(req.params.id);
    const db = readDb();
    const incident = db.incidents.find((i) => i.id === id && i.eliminado === false);

    if (!incident) {
      return sendResponse(res, 404, {
        success: false,
        message: 'Incidente no encontrado.',
        errors: ['INCIDENT_NOT_FOUND']
      });
    }

    return sendResponse(res, 200, {
      success: true,
      data: toPublicIncident(incident),
      message: 'Incidente obtenido correctamente.',
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

function updateIncidentStatus(req, res) {
  try {
    const id = Number(req.params.id);
    const db = readDb();
    const incident = db.incidents.find((i) => i.id === id && i.eliminado === false);

    if (!incident) {
      return sendResponse(res, 404, {
        success: false,
        message: 'Incidente no encontrado.',
        errors: ['INCIDENT_NOT_FOUND']
      });
    }

    incident.estado = req.body.estado;
    incident.update_at = new Date().toISOString();
    writeDb(db);

    return sendResponse(res, 200, {
      success: true,
      data: toPublicIncident(incident),
      message: 'Estado del incidente actualizado correctamente.',
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

function deleteIncident(req, res) {
  try {
    const id = Number(req.params.id);
    const db = readDb();
    const incident = db.incidents.find((i) => i.id === id && i.eliminado === false);

    if (!incident) {
      return sendResponse(res, 404, {
        success: false,
        message: 'Incidente no encontrado.',
        errors: ['INCIDENT_NOT_FOUND']
      });
    }

    incident.eliminado = true;
    incident.update_at = new Date().toISOString();
    writeDb(db);

    return sendResponse(res, 200, {
      success: true,
      data: { id: incident.id },
      message: 'Incidente eliminado lógicamente.',
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

module.exports = {
  createIncident,
  listIncidents,
  getIncidentById,
  updateIncidentStatus,
  deleteIncident
};
