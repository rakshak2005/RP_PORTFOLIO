import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema({
  greeting: { type: String, default: "I'M" },
  name: { type: String, default: "RAKSHAK" },
  subtitle: { type: String, default: "Full-stack Web and App Developer." },
  description: { type: String, default: "Engineering high-performance digital architectures where logic meets aesthetics." },
  resumeLink: { type: String, default: "" },
  githubLink: { type: String, default: "" },
  linkedinLink: { type: String, default: "" },
  instagramLink: { type: String, default: "" },
  openForProjects: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Hero', heroSchema);
