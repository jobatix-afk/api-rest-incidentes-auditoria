const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, '../../data/db.json');

function ensureDatabase() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (!fs.existsSync(DB_PATH)) {
    const initial = {
      users: [
        {
          id: 1,
          username: 'auditor',
          password: bcrypt.hashSync('Auditor123*', 12),
          rol: 'auditor'
        },
        {
          id: 2,
          username: 'admin',
          password: bcrypt.hashSync('Admin123*', 12),
          rol: 'administrador'
        }
      ],
      incidents: [],
      nextIncidentId: 1
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf8');
  }
}

function readDb() {
  ensureDatabase();
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = { ensureDatabase, readDb, writeDb };
