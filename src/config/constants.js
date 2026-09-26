module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'cambiar-esta-clave-secreta-en-produccion-2026',
  JWT_EXPIRES_IN: '2h',
  PORT: Number(process.env.PORT) || 3000,
  TIPOS: ['SEGURIDAD', 'INFRAESTRUCTURA', 'SOFTWARE', 'RED', 'DATOS', 'OTRO'],
  SEVERIDADES: ['BAJA', 'MEDIA', 'ALTA', 'CRITICA'],
  ESTADOS: ['ABIERTO', 'EN_INVESTIGACION', 'RESUELTO', 'CERRADO'],
  ROLES: ['auditor', 'administrador']
};
