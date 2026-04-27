const BookmarkService = require('../services/BookmarkService');
const { sendSuccess } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const createBookmark = asyncHandler(async (req, res) => {
  const bookmark = await BookmarkService.createBookmark(req.user.id, req.params.jobId);
  return sendSuccess(res, bookmark, 201, 'Job bookmarked successfully');
});

const getAllBookmarks = asyncHandler(async (req, res) => {
  const bookmarks = await BookmarkService.getBookmarksByUser(req.user.id, res);
  return sendSuccess(res, { bookmarks });
});

const getBookmarkById = asyncHandler(async (req, res) => {
  const bookmark = await BookmarkService.getBookmarkById(req.params.id);
  return sendSuccess(res, bookmark);
});

const deleteBookmark = asyncHandler(async (req, res) => {
  await BookmarkService.deleteBookmark(req.params.jobId, req.user.id);
  return sendSuccess(res, {}, 200, 'Bookmark removed successfully');
});

module.exports = { createBookmark, getAllBookmarks, getBookmarkById, deleteBookmark };
