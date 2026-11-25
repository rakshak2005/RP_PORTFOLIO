import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import dns from 'dns';

// Only override DNS servers in local development (same behavior as server/seed)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (err) {
    console.warn('Could not set DNS servers, proceeding with default:', err);
  }
}

import User from '../models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';

const NEW_USERNAME = process.env.ADMIN_USERNAME || 'rakshak_2005';
const NEW_PASSWORD = process.env.ADMIN_PASSWORD || '09280928Rr';

const resetAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB...');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(NEW_PASSWORD, salt);

    // Remove any other user already holding the target username
    await User.deleteMany({ username: NEW_USERNAME });

    // Update the existing admin account (keep only one admin user)
    const users = await User.find().sort({ createdAt: 1 });
    let admin;

    if (users.length > 0) {
      admin = users[0];
      admin.username = NEW_USERNAME;
      admin.password = hashedPassword;
      await admin.save();
      console.log(`Updated existing admin account (_id: ${admin._id})`);
    } else {
      admin = await User.create({ username: NEW_USERNAME, password: hashedPassword });
      console.log(`Created new admin account (_id: ${admin._id})`);
    }

    // Verify the stored credentials work
    const stored = await User.findOne({ username: NEW_USERNAME });
    const ok = stored && (await bcrypt.compare(NEW_PASSWORD, stored.password));
    console.log(`Verification: ${ok ? 'PASSED' : 'FAILED'}`);

    if (!ok) process.exit(1);

    console.log('Admin credentials reset successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting admin credentials:', error);
    process.exit(1);
  }
};

resetAdmin();
