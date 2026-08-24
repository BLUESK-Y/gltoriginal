import mongoose from 'mongoose';

const hubSchema = new mongoose.Schema(
  {
    hubId: { type: String, required: true, unique: true, index: true },
    storeName: { type: String, required: true, trim: true },
    locality: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true, index: true },
    state: { type: String, required: true, trim: true, index: true },
    category: { type: String, enum: ['A', 'B'], required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    status: { type: String, enum: ['live', 'network'], default: 'network', index: true },
    panels: { type: Number, default: 2 },
    image: String,
    thumb: String,
    note: String,
  },
  { timestamps: true, versionKey: false },
);

export default mongoose.model('SiteHub', hubSchema, 'sitehubs');
