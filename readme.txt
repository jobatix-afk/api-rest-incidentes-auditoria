API REST - GESTIÓN DE INCIDENTES DE AUDITORÍA
=============================================

REQUISITOS
- Node.js 18 o superior
- npm

INSTALACIÓN
1. Descomprima el proyecto.
2. Abra una terminal dentro de la carpeta del proyecto.
3. Ejecute:

   npm install

COMANDO DE INICIO

   npm start

La API quedará disponible en:
http://localhost:3000

USUARIOS DE PRUEBA
------------------
Auditor:
usuario: auditor
contraseña: Auditor123*
rol: auditor

Administrador:
usuario: admin
contraseña: Admin123*
rol: administrador

Las contraseñas NO se almacenan en texto plano. En el primer inicio se genera data/db.json con hashes bcrypt.

ENDPOINTS
---------
POST   /auth/login                 Libre
POST   /incidentes                 JWT - auditor/administrador
GET    /incidentes                 JWT - auditor/administrador
GET    /incidentes/:id             JWT - auditor/administrador
PATCH  /incidentes/:id/estado      JWT - auditor/administrador
DELETE /incidentes/:id             JWT + administrador

ENUMS UTILIZADOS
----------------
tipo:
SEGURIDAD | INFRAESTRUCTURA | SOFTWARE | RED | DATOS | OTRO

severidad:
BAJA | MEDIA | ALTA | CRITICA

estado:
ABIERTO | EN_INVESTIGACION | RESUELTO | CERRADO

EJEMPLOS CURL
-------------
1) Login auditor
curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d "{\"username\":\"auditor\",\"password\":\"Auditor123*\"}"

2) Crear incidente
Reemplace TOKEN por el token recibido en login:

curl -X POST http://localhost:3000/incidentes -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" -d "{\"titulo\":\"Intentos fallidos de acceso\",\"descripcion\":\"Se detectaron múltiples intentos fallidos de autenticación.\",\"tipo\":\"SEGURIDAD\",\"severidad\":\"ALTA\",\"estado\":\"ABIERTO\",\"sistema_afectado\":\"Servidor de autenticación\",\"auditor_id\":1,\"fecha_deteccion\":\"2026-09-26T15:00:00-06:00\",\"observaciones\":\"Revisar logs del servidor.\"}"

3) Listar con paginación
curl -X GET "http://localhost:3000/incidentes?page=1&limit=10" -H "Authorization: Bearer TOKEN"

4) Obtener por ID
curl -X GET http://localhost:3000/incidentes/1 -H "Authorization: Bearer TOKEN"

5) Cambiar estado
curl -X PATCH http://localhost:3000/incidentes/1/estado -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" -d "{\"estado\":\"EN_INVESTIGACION\"}"

6) Eliminar lógicamente (requiere token del administrador)
curl -X DELETE http://localhost:3000/incidentes/1 -H "Authorization: Bearer TOKEN_ADMIN"

NOTAS DE SEGURIDAD
------------------
- JWT expira en 2 horas e incluye el campo rol.
- RBAC aplicado por middleware.
- Hashing bcrypt con factor de costo 12.
- Validación y sanitización de entradas.
- Helmet agrega cabeceras HTTP de seguridad.
- Los campos automáticos id, eliminado, created_at y update_at no se aceptan al crear.
- DELETE realiza borrado lógico: eliminado=true.
- Los incidentes eliminados no aparecen en GET /incidentes ni GET /incidentes/:id.
- Todas las respuestas tienen la forma: success, data, message, errors.
