const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Proxy per le richieste API
app.use('/api', createProxyMiddleware({
  target: 'https://go-trailhead-leaderboard-api.up.railway.app',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '',
  },
}));

// Servire i file statici della build di React
app.use(express.static(path.join(__dirname, 'build')));

// Gestione delle richieste restituendo il file index.html per tutte le altre richieste
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
