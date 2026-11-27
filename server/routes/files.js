import express from 'express';
import Upload from '../models/Upload.js';

const router = express.Router();

// Serves files that live in MongoDB. Mounted after express.static, so files
// that still exist on disk (e.g. tracked assets) are served first.
router.get('/:filename', async (req, res) => {
  try {
    const file = await Upload.findOne({ filename: req.params.filename });
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.set('Content-Type', file.contentType || 'application/octet-stream');
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(file.data);
  } catch (error) {
    console.error('Error serving uploaded file:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
