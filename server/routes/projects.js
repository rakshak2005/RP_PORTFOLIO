import express from 'express';
import Project from '../models/Project.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Error in GET /api/projects:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create project
router.post('/', auth, async (req, res) => {
  try {
    if (req.body._id === '') {
      delete req.body._id;
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
