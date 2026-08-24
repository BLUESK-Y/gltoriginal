import mongoose from 'mongoose';

/** A brand asking to run a campaign, captured from the campaign builder. */
const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    state: { type: String, required: true },
    // A campaign books either every live city in the state, or a chosen set of
    // cities — so coverage is a scope plus a list, not one city name.
    scope: { type: String, enum: ['state', 'city'], default: 'state' },
    cities: { type: [String], default: [] },
    hubs: { type: Number, required: true },
    duration: { type: String, required: true },
    storeMix: { type: String, required: true },
    preferredStart: Date,
    // Recomputed on the server at submit time — never trusted from the client.
    quotedTotal: Number,
    quotedAdvance: Number,
    status: {
      type: String,
      enum: ['new', 'contacted', 'quoted', 'won', 'lost'],
      default: 'new',
      index: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export default mongoose.model('Lead', leadSchema);
