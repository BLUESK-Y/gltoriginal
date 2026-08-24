import { Router } from "express";
import Ticket from "../models/Ticket.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { hubId, hubName, type, note } = req.body;
    if (!hubId || !hubName || !type) {
      return res.status(400).json({ error: "hubId, hubName and type are required" });
    }
    const count = await Ticket.countDocuments();
    const ticket = await Ticket.create({
      ticketId: "GLT-TKT-" + String(1040 + count),
      hubId,
      hubName,
      type,
      note: (note || "").trim(),
      state: "Sent to ops"
    });
    res.status(201).json(ticket);
  } catch (err) {
    next(err);
  }
});

router.delete("/", async (req, res, next) => {
  try {
    await Ticket.deleteMany({});
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
