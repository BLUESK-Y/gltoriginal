import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true },
  hubId: { type: String, required: true },
  hubName: { type: String, required: true },
  type: { type: String, required: true },
  note: { type: String, default: "" },
  state: { type: String, default: "Sent to ops" }
}, { timestamps: true });

export default mongoose.model("Ticket", ticketSchema);
