// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://go-trailhead-leaderboard-api.up.railway.app',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    })
  );
};
