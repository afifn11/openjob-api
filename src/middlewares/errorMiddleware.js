const { ClientError } = require('../exceptions');

// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      status: 'failed',
      message: err.message,
    });
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      status: 'failed',
      message: 'File size too large. Maximum is 5MB.',
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      status: 'failed',
      message: 'Unexpected field. Use "document" as the field name.',
    });
  }

  // PostgreSQL unique violation (fallback - most are handled in repositories)
  if (err.code === '23505') {
    return res.status(400).json({
      status: 'failed',
      message: 'Data already exists (duplicate entry).',
    });
  }

  if (err.code === '23503') {
    return res.status(400).json({
      status: 'failed',
      message: 'Referenced resource does not exist.',
    });
  }

  console.error('Unhandled Error:', err);
  return res.status(500).json({
    status: 'failed',
    message: 'Internal server error',
  });
};

module.exports = errorMiddleware;
