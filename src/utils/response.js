const sendSuccess = (res, data = {}, statusCode = 200, message = 'success') => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data,
  });
};

const sendError = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({
    status: 'failed',
    message,
  });
};

module.exports = { sendSuccess, sendError };
