import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import dns from 'dns';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (err) {
  console.warn('Could not set DNS servers, proceeding with default:', err);
}

// Import routes
import authRoutes from './routes/auth.js';
import heroRoutes from './routes/hero.js';
import projectRoutes from './routes/projects.js';
import companyRoutes from './routes/companies.js';
import skillRoutes from './routes/skills.js';
import uploadRoutes from './routes/upload.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Ensure upload directory exists
const uploadDir = path.resolve('server/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploads statically
app.use('/uploads', express.static(uploadDir));

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Ensure MongoDB is installed and running locally, or configure a MONGO_URI in .env');
  });

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/upload', uploadRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Portfolio API is running successfully' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
