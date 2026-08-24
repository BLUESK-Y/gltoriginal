import { Router } from "express";
import Hub from "../models/Hub.js";

const router = Router();

// GET /api/hubs?status=verified&category=A&q=welgate
router.get("/", async (req, res, next) => {
  try {
    const { status, category, q } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (q) {
      const rx = new RegExp(q.trim(), "i");
      filter.$or = [{ name: rx }, { area: rx }, { hubId: rx }];
    }
    const hubs = await Hub.find(filter).sort({ hubId: 1 });
    res.json(hubs);
  } catch (err) {
    next(err);
  }
});

router.get("/:hubId", async (req, res, next) => {
  try {
    const hub = await Hub.findOne({ hubId: req.params.hubId });
    if (!hub) return res.status(404).json({ error: "Hub not found" });
    res.json(hub);
  } catch (err) {
    next(err);
  }
});

export default router;
