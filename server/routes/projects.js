import express from 'express';
import Project from '../models/Project.js';
import Meta from '../models/Meta.js';
import auth from '../middleware/auth.js';
import canonicalProjects, { normalizeProjectTitle } from '../data/projects.js';

const router = express.Router();

// Bump this when new canonical projects are added to the catalog.
const CATALOG_VERSION = 1;
const CATALOG_KEY = 'projectCatalog';

// Import any canonical projects that are missing from the database once per
// catalog version, so the admin "Arrange Projects" screen shows the complete
// list without resurrecting projects that were intentionally deleted.
let syncPromise = null;
const syncCanonicalProjects = () => {
  if (syncPromise) return syncPromise;

  syncPromise = (async () => {
    await Meta.findOneAndUpdate(
      { key: CATALOG_KEY },
      { $setOnInsert: { value: { version: 0 } } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Atomically claim the sync so concurrent requests only run it once.
    const claim = await Meta.findOneAndUpdate(
      { key: CATALOG_KEY, 'value.version': { $lt: CATALOG_VERSION } },
      { $set: { 'value.version': CATALOG_VERSION } },
      { new: true }
    );
    if (!claim) return;

    const existing = await Project.find().select('title order');
    const existingTitles = new Set(existing.map((p) => normalizeProjectTitle(p.title)));
    const missing = canonicalProjects.filter(
      (p) => !existingTitles.has(normalizeProjectTitle(p.title))
    );

    if (missing.length === 0) return;

    let nextOrder = existing.reduce(
      (max, p) => Math.max(max, Number.isFinite(p.order) ? p.order : -1),
      -1
    ) + 1;

    const docs = missing.map((p) => ({
      ...p,
      isHidden: false,
      order: nextOrder++
    }));

    await Project.insertMany(docs, { ordered: false });
  })()
    .catch((error) => {
      console.error('Error syncing canonical projects:', error);
    })
    .finally(() => {
      syncPromise = null;
    });

  return syncPromise;
};

// Get all projects (manual order first, then newest)
router.get('/', async (req, res) => {
  try {
    await syncCanonicalProjects();
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
