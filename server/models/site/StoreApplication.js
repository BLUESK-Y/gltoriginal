import mongoose from 'mongoose';

/** A retailer applying to host a hub under the deposit + revenue-split model. */
const storeApplicationSchema = new mongoose.Schema(
  {
    ownerName: { type: String, required: true, trim: true },
    storeName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    locality: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    storeSize: {
      type: String,
      enum: ['under500', '500to1500', 'over1500'],
      required: true,
    },
    category: { type: String, enum: ['A', 'B'], required: true },
    status: {
      type: String,
      enum: ['new', 'surveyed', 'signed', 'installed', 'rejected'],
      default: 'new',
      index: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export default mongoose.model('StoreApplication', storeApplicationSchema);
