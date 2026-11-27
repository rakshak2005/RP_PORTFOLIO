import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import Achievement from '../models/Achievement.js';

dotenv.config();

// Same DNS workaround as server.js for local development.
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (err) {
    console.warn('Could not set DNS servers:', err);
  }
}

const seedAchievements = [
  {
    type: 'hackathon',
    title: 'Hackathon Name',
    project: 'Project Name',
    achievement: 'Winner',
    year: '2026',
    organization: 'Organizing Body',
    description:
      'Add the story behind this win — the challenge, your role, the build, and what the judges recognised.',
    category: 'Hackathons',
    accent: 'gold',
    image: '',
    certificate: '',
    order: 0
  },
  {
    type: 'hackathon',
    title: 'Hackathon Name',
    project: 'Project Name',
    achievement: 'Winner',
    year: '2026',
    organization: 'Organizing Body',
    description:
      'Add the story behind this win — the challenge, your role, the build, and what the judges recognised.',
    category: 'Hackathons',
    accent: 'silver',
    image: '',
    certificate: '',
    order: 1
  },
  {
    type: 'certificate',
    title: 'Front End Development',
    organization: 'Codsoft',
    year: '2025',
    category: 'Technical',
    image: '',
    order: 2
  },
  {
    type: 'certificate',
    title: 'Development',
    organization: 'Oasis Infobyte',
    year: '2025',
    category: 'Certifications',
    image: '',
    order: 3
  },
  {
    type: 'certificate',
    title: 'Flutter Development',
    organization: 'Oasis Infobyte',
    year: '2025',
    category: 'Technical',
    image: '',
    order: 4
  },
  {
    type: 'certificate',
    title: 'Azure Fundamentals',
    organization: 'Microsoft',
    year: '2022',
    category: 'Certifications',
    image: '',
    order: 5
  }
];

const run = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not set. Add it to your .env file.');
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const count = await Achievement.countDocuments();
  if (count > 0) {
    console.log(`Achievements collection already has ${count} entries. Nothing seeded.`);
    await mongoose.disconnect();
    return;
  }

  await Achievement.insertMany(seedAchievements);
  console.log(`Seeded ${seedAchievements.length} achievements.`);
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error('Achievement seed failed:', error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
