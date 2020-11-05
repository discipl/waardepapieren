const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://localhost:3232/',
      changeOrigin: true,
      secure: false,
      ws: true,
      logLevel: 'debug',
      pathRewrite: {
        '^/api': '', // remove base path
      },
    })
  );
};
