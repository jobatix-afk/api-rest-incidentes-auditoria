const app = require('./app');
const { PORT } = require('./config/constants');
const { ensureDatabase } = require('./services/storageService');

ensureDatabase();

app.listen(PORT, () => {
  console.log(`API ejecutándose en http://localhost:${PORT}`);
});
