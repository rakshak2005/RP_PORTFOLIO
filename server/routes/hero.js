import express from 'express';
import Hero from '../models/Hero.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get Hero info (if empty, create default)
router.get('/', async (req, res) => {
  try {
    let hero = await Hero.findOne();
    if (!hero) {
      hero = new Hero();
      await hero.save();
    }
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Hero info
router.put('/', auth, async (req, res) => {
  try {
    let hero = await Hero.findOne();
    if (!hero) {
      hero = new Hero(req.body);
    } else {
      Object.assign(hero, req.body);
    }
    await hero.save();
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
