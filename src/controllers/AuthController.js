const AuthService = require('../services/AuthService');
const { sendSuccess } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

// POST /authentications → data: { accessToken, refreshToken }
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const tokens = await AuthService.login({ email, password });
  return sendSuccess(res, tokens, 200, 'Login successful');
});

// PUT /authentications → data: { accessToken }
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await AuthService.refreshToken(refreshToken);
  return sendSuccess(res, result, 200, 'Access token refreshed');
});

// DELETE /authentications → data: {}
const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  await AuthService.logout(refreshToken);
  return sendSuccess(res, {}, 200, 'Logout successful');
});

module.exports = { login, refreshToken, logout };
