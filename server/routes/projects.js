import express from 'express';
import Project from '../models/Project.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all projects (manual order first, then newest)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Error in GET /api/projects:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reorder projects (must be declared before /:id)
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
      return res.status(400).json({ message: 'No valid project ids supplied' });
    }

    await Project.bulkWrite(operations);
    res.json({ message: 'Project order updated' });
  } catch (error) {
    console.error('Error in PUT /api/projects/reorder:', error);
    res.status(400).json({ message: error.message });
  }
});

// Create project
router.post('/', auth, async (req, res) => {
  try {
    if (req.body._id === '') {
      delete req.body._id;
    }
    // Append new projects to the end of the manual order unless one is supplied
    if (req.body.order === undefined || req.body.order === null || req.body.order === '') {
      const last = await Project.findOne().sort({ order: -1 }).select('order');
      req.body.order = last ? (Number(last.order) || 0) + 1 : 0;
    }
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error('Error in POST /api/projects:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update project
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.body._id === '') {
      delete req.body._id;
    }
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error in PUT /api/projects/:id:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/projects/:id:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
