const UserService = require('../services/UserService');
const { sendSuccess } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const user = await UserService.register(req.body);
  return sendSuccess(res, user, 201, 'User registered successfully');
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await UserService.getUserById(req.params.id, res);
  return sendSuccess(res, user);
});

module.exports = { register, getUserById };
