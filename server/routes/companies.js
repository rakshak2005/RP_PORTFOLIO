import express from 'express';
import Company from '../models/Company.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all companies (manual order first, then oldest)
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find().sort({ order: 1, createdAt: 1 });
    res.json(companies);
  } catch (error) {
    console.error('Error in GET /api/companies:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reorder companies (must be declared before /:id)
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
      return res.status(400).json({ message: 'No valid company ids supplied' });
    }

    await Company.bulkWrite(operations);
    res.json({ message: 'Company order updated' });
  } catch (error) {
    console.error('Error in PUT /api/companies/reorder:', error);
    res.status(400).json({ message: error.message });
  }
});

// Create company
router.post('/', auth, async (req, res) => {
  try {
    if (req.body._id === '') {
      delete req.body._id;
    }
    // Append new companies to the end of the manual order unless one is supplied
    if (req.body.order === undefined || req.body.order === null || req.body.order === '') {
      const last = await Company.findOne().sort({ order: -1 }).select('order');
      req.body.order = last ? (Number(last.order) || 0) + 1 : 0;
    }
    const company = new Company(req.body);
    await company.save();
    res.status(201).json(company);
  } catch (error) {
    console.error('Error in POST /api/companies:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update company
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.body._id === '') {
      delete req.body._id;
    }
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    console.error('Error in PUT /api/companies/:id:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete company
router.delete('/:id', auth, async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/companies/:id:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
