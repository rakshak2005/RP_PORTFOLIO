import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  company: { type: String, required: true },
  logo: { type: String, required: true }, // local path or cloud URL
  badge: { type: String, default: "" },
  role: { type: String, required: true },
  timeline: { type: String, default: "" },
  description: { type: String, required: true },
  highlights: [{ type: String }],
  color: { type: String, default: "from-[#d946ef]/5 to-[#8b1ff5]/5" },
  borderColor: { type: String, default: "hover:border-[#d946ef]/20" },
  glowColor: { type: String, default: "bg-[#d946ef]/5" }
}, { timestamps: true });

export default mongoose.model('Company', companySchema);
