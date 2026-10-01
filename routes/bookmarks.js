import express from 'express';
import Bookmark from '../models/Bookmark.js';

const router = express.Router();

// GET /api/bookmarks?userId=...
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ success: false, error: 'userId is required' });

    const bookmarks = await Bookmark.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, bookmarks });
  } catch (error) {
    console.error('Error fetching bookmarks:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/bookmarks
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      resourceId,
      title,
      platform = '',
      linkUrl = '',
      resourceData = {}
    } = req.body;

    if (!userId || !resourceId || !title) {
      return res.status(400).json({
        success: false,
        error: 'userId, resourceId and title are required'
      });
    }

    const bookmark = await Bookmark.findOneAndUpdate(
      { userId, resourceId },
      { $set: { title, platform, linkUrl, resourceData } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ success: true, bookmark });
  } catch (error) {
    console.error('Error saving bookmark:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/bookmarks/:resourceId?userId=...
router.delete('/:resourceId', async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { userId } = req.query;

    if (!userId) return res.status(400).json({ success: false, error: 'userId is required' });

    await Bookmark.findOneAndDelete({ userId, resourceId });
    res.json({ success: true, message: 'Bookmark deleted' });
  } catch (error) {
    console.error('Error deleting bookmark:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
