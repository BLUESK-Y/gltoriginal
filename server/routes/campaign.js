import { Router } from "express";
import Hub from "../models/Hub.js";
import Ticket from "../models/Ticket.js";
import { CAMPAIGN } from "../data/campaign.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const [verified, pending, flagged, total, footfallAgg, openTickets] = await Promise.all([
      Hub.countDocuments({ status: "verified" }),
      Hub.countDocuments({ status: "pending" }),
      Hub.countDocuments({ status: "flagged" }),
      Hub.countDocuments({}),
      Hub.aggregate([{ $group: { _id: null, sum: { $sum: "$footfall" } } }]),
      Ticket.countDocuments({})
    ]);

    res.json({
      ...CAMPAIGN,
      stats: {
        hubsTotal: total,
        verified,
        pending,
        flagged,
        footfall: footfallAgg[0]?.sum || 0,
        openTickets
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
