import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  technologies: [{ type: String }],
  image: { type: String, default: "" }, // local path, cloud URL, or empty (uses iframe preview)
  githubLink: { type: String, default: "" },
  demoLink: { type: String, default: "" },
  isHidden: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
