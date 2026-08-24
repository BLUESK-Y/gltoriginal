import { Router } from "express";
import Hub from "../models/Hub.js";
import { REPORT_DEFS } from "../data/campaign.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const counts = await Promise.all(
      REPORT_DEFS.map((r) =>
        r.includeStatuses.length
          ? Hub.countDocuments({ status: { $in: r.includeStatuses } }).then((n) => Math.min(n, r.maxRows))
          : Promise.resolve(0)
      )
    );
    const reports = REPORT_DEFS.map((r, i) => ({ ...r, rows: counts[i] }));
    res.json(reports);
  } catch (err) {
    next(err);
  }
});

router.get("/:index", async (req, res, next) => {
  try {
    const idx = Number(req.params.index);
    const def = REPORT_DEFS[idx];
    if (!def) return res.status(404).json({ error: "Report not found" });
    if (def.state === "locked") return res.json({ ...def, hubs: [] });

    const hubs = await Hub.find({ status: { $in: def.includeStatuses } })
      .sort({ hubId: 1 })
      .limit(def.maxRows);

    res.json({ ...def, hubs });
  } catch (err) {
    next(err);
  }
});

export default router;
