const BookmarkRepository = require('../repositories/BookmarkRepository');
const CacheService = require('./CacheService');
const generateId = require('../utils/generateId');
const { ConflictError } = require('../exceptions');

const CACHE_KEY_BOOKMARKS = (userId) => `bookmarks:user:${userId}`;

class BookmarkService {
  async createBookmark(userId, jobId) {
    const existing = await BookmarkRepository.findByJobAndUser(jobId, userId);
    if (existing) throw new ConflictError('Job already bookmarked');
    const id = generateId();
    const bookmark = await BookmarkRepository.create({ id, user_id: userId, job_id: jobId });
    await CacheService.delete(CACHE_KEY_BOOKMARKS(userId));
    return bookmark;
  }

  async getAllBookmarks() {
    return BookmarkRepository.findAll();
  }

  async getBookmarkById(id) {
    return BookmarkRepository.findById(id);
  }

  async getBookmarksByUser(userId, res) {
    const cacheKey = CACHE_KEY_BOOKMARKS(userId);
    const cached = await CacheService.get(cacheKey);
    if (cached) {
      if (res) res.setHeader('X-Data-Source', 'cache');
      return cached;
    }
    const bookmarks = await BookmarkRepository.findByUserId(userId);
    await CacheService.set(cacheKey, bookmarks);
    if (res) res.setHeader('X-Data-Source', 'database');
    return bookmarks;
  }

  async deleteBookmark(jobId, userId) {
    const result = await BookmarkRepository.deleteByJobAndUser(jobId, userId);
    await CacheService.delete(CACHE_KEY_BOOKMARKS(userId));
    return result;
  }
}

module.exports = new BookmarkService();
