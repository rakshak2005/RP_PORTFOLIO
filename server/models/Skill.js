import mongoose from 'mongoose';

const skillItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, default: "Code2" } // Name of Lucide icon to render
});

const skillSchema = new mongoose.Schema({
  title: { type: String, required: true },
  icon: { type: String, default: "Layers" }, // Lucide icon for category
  side: { type: String, enum: ['left', 'right'], default: 'left' },
  skills: [skillItemSchema],
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Skill', skillSchema);
