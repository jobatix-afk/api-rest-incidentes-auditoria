function sanitizeText(value) {
  if (typeof value !== 'string') return value;

  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .trim();
}

function sanitizeObject(obj = {}) {
  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') clean[key] = sanitizeText(value);
    else clean[key] = value;
  }
  return clean;
}

module.exports = { sanitizeText, sanitizeObject };
