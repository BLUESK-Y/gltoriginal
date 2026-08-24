import mongoose from "mongoose";

const hubSchema = new mongoose.Schema({
  hubId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  area: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  category: { type: String, enum: ["A", "B"], required: true },
  status: { type: String, enum: ["verified", "pending", "flagged"], default: "pending" },
  footfall: { type: Number, default: 0 },
  auditDate: { type: Date },
  auditTime: { type: String },
  note: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("Hub", hubSchema);
