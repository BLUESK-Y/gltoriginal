import { Router } from "express";

import { findCities, findState, quote, RATE_CARD, REGIONS } from "../data/site/pricing.js";
import { validate } from "../middleware/validate.js";
import CallRequest from "../models/site/CallRequest.js";
import SiteHub from "../models/site/Hub.js";
import Lead from "../models/site/Lead.js";
import StoreApplication from "../models/site/StoreApplication.js";
import { callRequestSchema, leadSchema, quoteSchema, storeApplicationSchema } from "../schemas.js";

const router = Router();
const asyncRoute = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/* ---------------------------------------------------------------- network */

router.get(
  "/hubs",
  asyncRoute(async (req, res) => {
    const { city, state, status } = req.query;
    const filter = {};
    if (city) filter.city = city;
    if (state) filter.state = state;
    if (status) filter.status = status;
    const hubs = await SiteHub.find(filter).sort({ hubId: 1 }).lean();
    res.json({ count: hubs.length, hubs });
  })
);

router.get(
  "/hubs/stats",
  asyncRoute(async (req, res) => {
    const all = await SiteHub.find().lean();
    res.json({
      total: all.length,
      live: all.filter((h) => h.status === "live").length,
      panels: all.reduce((sum, h) => sum + (h.panels ?? 2), 0),
      catA: all.filter((h) => h.category === "A").length,
      catB: all.filter((h) => h.category === "B").length,
      cities: [...new Set(all.map((h) => h.city))],
    });
  })
);

/* ---------------------------------------------------------------- pricing */

router.get("/pricing/config", (req, res) => {
  res.json({ rateCard: RATE_CARD, regions: REGIONS });
});

router.post(
  "/pricing/quote",
  validate(quoteSchema),
  asyncRoute(async (req, res) => {
    const result = quote(req.body);
    if (!result) return res.status(400).json({ error: "Unknown duration or store mix" });
    res.json(result);
  })
);

/* ------------------------------------------------------------------ leads */

router.post(
  "/leads",
  validate(leadSchema),
  asyncRoute(async (req, res) => {
    const { scope, state, cities } = req.body;
    const target = scope === "city" ? findCities(state, cities) : findState(state);

    if (!target) {
      return res.status(400).json({
        error:
          scope === "city" ? "We do not cover one of those cities yet" : "We do not cover that state yet",
      });
    }

    const priced = quote(req.body);

    const lead = await Lead.create({
      ...req.body,
      quotedTotal: priced?.total,
      quotedAdvance: priced?.advance,
    });

    const place = scope === "city" ? cities.join(", ") : `${state} (statewide)`;

    res.status(201).json({
      id: lead._id,
      message:
        target.status === "live"
          ? "Enquiry received. We'll confirm hub availability within one working day."
          : `${place} is not live yet — you're on the waitlist and we'll be in touch before launch.`,
      waitlisted: target.status !== "live",
      quote: priced,
    });
  })
);

/* ------------------------------------------------------------ call requests */

router.post(
  "/call-requests",
  validate(callRequestSchema),
  asyncRoute(async (req, res) => {
    const callRequest = await CallRequest.create(req.body);
    res.status(201).json({
      id: callRequest._id,
      message: "Request received. We'll call you within one working day.",
    });
  })
);

/* ----------------------------------------------------------- store owners */

router.post(
  "/store-applications",
  validate(storeApplicationSchema),
  asyncRoute(async (req, res) => {
    const application = await StoreApplication.create({
      ...req.body,
      category: req.body.storeSize === "under500" ? "B" : "A",
    });
    res.status(201).json({
      id: application._id,
      message: "Application received. Our field team will visit and survey your counter.",
    });
  })
);

export default router;
