const ProfileService = require('../services/ProfileService');
const { sendSuccess } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const getProfile = asyncHandler(async (req, res) => {
  const user = await ProfileService.getProfile(req.user.id);
  return sendSuccess(res, user);
});

const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await ProfileService.getMyApplications(req.user.id);
  return sendSuccess(res, { applications });
});

const getMyBookmarks = asyncHandler(async (req, res) => {
  const bookmarks = await ProfileService.getMyBookmarks(req.user.id);
  return sendSuccess(res, { bookmarks });
});

module.exports = { getProfile, getMyApplications, getMyBookmarks };
