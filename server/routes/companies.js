import express from 'express';
import Company from '../models/Company.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all companies
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: 1 });
    res.json(companies);
  } catch (error) {
    console.error('Error in GET /api/companies:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create company
router.post('/', auth, async (req, res) => {
  try {
    if (req.body._id === '') {
      delete req.body._id;
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
