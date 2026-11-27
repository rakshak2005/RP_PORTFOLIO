import express from 'express';
import multer from 'multer';
import path from 'path';
import auth from '../middleware/auth.js';
import Upload from '../models/Upload.js';

const router = express.Router();

// Store files in memory so they can be persisted in MongoDB.
// The hosting filesystem (e.g. Render) is ephemeral and wipes local uploads
// on every restart/redeploy, which made logos disappear after a while.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif|pdf/i;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpeg, jpg, png, webp, gif) and PDFs are allowed'));
  }
});

// Single file upload route (Protected)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + path.extname(req.file.originalname).toLowerCase();

    await Upload.create({
      filename,
      contentType: req.file.mimetype,
      size: req.file.size,
      data: req.file.buffer
    });

    // Same URL shape as before so existing stored paths keep working.
    res.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error('Error in POST /api/upload:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
