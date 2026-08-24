import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Client", clientSchema);
