require('dotenv').config();
const express = require('express');
const path = require('path');

const routes = require('./routes');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'OpenJob RESTful API v2 is running',
    version: '2.0.0',
  });
});

// All API routes
app.use(routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'failed',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Centralized error handler (MUST be last)
app.use(errorMiddleware);

module.exports = app;
