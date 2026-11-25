import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

// Only override DNS servers in local development (same behavior as the server)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (err) {
    console.warn('Could not set DNS servers, proceeding with default:', err);
  }
}

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';

const backfill = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    const coll = mongoose.connection.collection('projects');

    // Newest first, matching the previous default display order
    const docs = await coll.find({}).sort({ createdAt: -1 }).toArray();

    let updated = 0;
    for (let i = 0; i < docs.length; i++) {
      const doc = docs[i];
      if (typeof doc.order !== 'number') {
        await coll.updateOne({ _id: doc._id }, { $set: { order: i } });
        updated++;
      }
    }

    console.log(`Checked ${docs.length} projects, assigned order to ${updated}.`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error backfilling project order:', error);
    process.exit(1);
  }
};

backfill();
