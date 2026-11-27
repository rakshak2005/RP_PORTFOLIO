import express from 'express';
import Achievement from '../models/Achievement.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all achievements (manual order first, then oldest)
router.get('/', async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ order: 1, createdAt: 1 });
    res.json(achievements);
  } catch (error) {
    console.error('Error in GET /api/achievements:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reorder achievements (must be declared before /:id)
router.put('/reorder', auth, async (req, res) => {
  try {
    const items = Array.isArray(req.body) ? req.body : req.body.order;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Expected a non-empty order array' });
    }

    const operations = items
      .filter((item) => item && item.id)
      .map((item) => ({
        updateOne: {
          filter: { _id: item.id },
          update: { $set: { order: Number(item.order) || 0 } }
        }
      }));

    if (operations.length === 0) {
      return res.status(400).json({ message: 'No valid achievement ids supplied' });
    }

    await Achievement.bulkWrite(operations);
    res.json({ message: 'Achievement order updated' });
  } catch (error) {
    console.error('Error in PUT /api/achievements/reorder:', error);
    res.status(400).json({ message: error.message });
  }
});

// Create achievement
router.post('/', auth, async (req, res) => {
  try {
    if (req.body._id === '') {
      delete req.body._id;
    }
    if (req.body.order === undefined || req.body.order === null || req.body.order === '') {
      const last = await Achievement.findOne().sort({ order: -1 }).select('order');
      req.body.order = last ? (Number(last.order) || 0) + 1 : 0;
    }
    const achievement = new Achievement(req.body);
    await achievement.save();
    res.status(201).json(achievement);
  } catch (error) {
    console.error('Error in POST /api/achievements:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update achievement
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.body._id === '') {
      delete req.body._id;
    }
    const achievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    res.json(achievement);
  } catch (error) {
    console.error('Error in PUT /api/achievements/:id:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete achievement
router.delete('/:id', auth, async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id);
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    res.json({ message: 'Achievement deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/achievements/:id:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
