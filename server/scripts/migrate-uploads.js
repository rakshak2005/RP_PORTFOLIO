import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import fs from 'fs';
import path from 'path';
import Upload from '../models/Upload.js';

dotenv.config();

// Same DNS workaround as server.js for local development.
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (err) {
    console.warn('Could not set DNS servers:', err);
  }
}

const uploadDir = path.resolve('server/uploads');
const mimeTypes = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.pdf': 'application/pdf'
};

const run = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not set. Add it to your .env file.');
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  if (!fs.existsSync(uploadDir)) {
    console.log(`No uploads directory found at ${uploadDir}. Nothing to migrate.`);
    await mongoose.disconnect();
    return;
  }

  const files = fs.readdirSync(uploadDir).filter((name) => !name.startsWith('.'));
  let migrated = 0;

  for (const filename of files) {
    const existing = await Upload.findOne({ filename }).select('_id');
    if (existing) {
      console.log(`skip   ${filename} (already in database)`);
      continue;
    }

    const filePath = path.join(uploadDir, filename);
    if (!fs.statSync(filePath).isFile()) continue;

    const data = fs.readFileSync(filePath);
    await Upload.create({
      filename,
      contentType: mimeTypes[path.extname(filename).toLowerCase()] || 'application/octet-stream',
      size: data.length,
      data
    });
    migrated++;
    console.log(`migrate ${filename}`);
  }

  console.log(`Done. Migrated ${migrated} file(s).`);
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error('Upload migration failed:', error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
