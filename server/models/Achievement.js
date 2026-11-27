import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['hackathon', 'certificate'],
    default: 'certificate'
  },
  title: { type: String, required: true },
  project: { type: String, default: '' },
  achievement: { type: String, default: '' },
  year: { type: String, default: '' },
  organization: { type: String, default: '' },
  description: { type: String, default: '' },
  category: {
    type: String,
    enum: ['Hackathons', 'Technical', 'Certifications', 'Workshops', 'Other'],
    default: 'Certifications'
  },
  accent: {
    type: String,
    enum: ['gold', 'silver'],
    default: 'gold'
  },
  image: { type: String, default: '' },
  certificate: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isHidden: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Achievement', achievementSchema);
