// Simple health check controller for backend
function health(req, res) {
  res.json({ status: 'ok', uptime: process.uptime() });
}

module.exports = { health };
