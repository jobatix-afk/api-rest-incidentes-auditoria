function sendResponse(res, status, { success, data = null, message = '', errors = [] }) {
  return res.status(status).json({ success, data, message, errors });
}

module.exports = { sendResponse };
