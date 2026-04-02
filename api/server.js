const app = require('../backend/server.js');

module.exports = (req, res) => {
  // Vercel serverless functions in the /api directory automatically strip the '/api' prefix from req.url.
  // Our Express app explicitly expects the '/api' prefix (e.g., app.use('/api/auth', ...)).
  // We prepend '/api' to req.url if it's missing so the Express router can match the endpoints perfectly.
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + req.url;
  }
  return app(req, res);
};
