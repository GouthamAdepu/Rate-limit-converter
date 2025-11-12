const express = require('express');
const path = require('path');
const { rateLimiter, getMetrics } = require('./rateLimiter');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy to get correct client IP
app.set('trust proxy', true);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Metrics endpoint (excluded from rate limiting)
app.get('/api/metrics', (req, res) => {
  res.json(getMetrics());
});

// Apply rate limiter middleware to other API routes
app.use('/api', rateLimiter);

// Serve dashboard on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Main API endpoint
app.get('/api/data', (req, res) => {
  res.json({
    message: 'Success'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`🔌 API endpoint: http://localhost:${PORT}/api/data`);
  console.log(`📈 Metrics endpoint: http://localhost:${PORT}/api/metrics`);
});
