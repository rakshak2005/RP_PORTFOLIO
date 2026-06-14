import express from 'express';
import Skill from '../models/Skill.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all skills categories
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ order: 1 });
    res.json(skills);
  } catch (error) {
    console.error('Error in GET /api/skills:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create skills category
router.post('/', auth, async (req, res) => {
  try {
    if (req.body._id === '') {
      delete req.body._id;
    }
    const skill = new Skill(req.body);
    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    console.error('Error in POST /api/skills:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update skills category
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.body._id === '') {
      delete req.body._id;
    }
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!skill) {
      return res.status(404).json({ message: 'Skills category not found' });
    }
    res.json(skill);
  } catch (error) {
    console.error('Error in PUT /api/skills/:id:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete skills category
router.delete('/:id', auth, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skills category not found' });
    }
    res.json({ message: 'Skills category deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/skills/:id:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
