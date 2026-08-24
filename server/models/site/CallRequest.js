import mongoose from 'mongoose';

/** A brand asking GLT to call them back — no campaign details attached. */
const callRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['new', 'contacted', 'closed'],
      default: 'new',
      index: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export default mongoose.model('CallRequest', callRequestSchema);
