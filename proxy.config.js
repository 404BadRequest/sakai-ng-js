const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use('/api', createProxyMiddleware({
    target: 'https://localhost:4200',  // Cambia esto por la URL de tu API
    changeOrigin: true,
    secure: false
  }));
};