import path from "node:path";
import { fileURLToPath } from "node:url";

import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import hubsRouter from "./routes/hubs.js";
import ticketsRouter from "./routes/tickets.js";
import campaignRouter from "./routes/campaign.js";
import reportsRouter from "./routes/reports.js";
import authRouter from "./routes/auth.js";
import siteRouter from "./routes/site.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === "production";
const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/hubs", hubsRouter);
app.use("/api/tickets", ticketsRouter);
app.use("/api/campaign", campaignRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/auth", authRouter);
app.use("/api/site", siteRouter);

// In production, this same service also serves the built client — one
// Render web service instead of a separate static site + API.
if (isProd) {
  const clientDist = path.resolve(__dirname, "../client/dist");
  app.use(express.static(clientDist, { maxAge: "1h" }));
  app.get(/^(?!\/api).*/, (req, res) => {
    // The shell names the hashed bundles, so it must never be cached.
    res.set("Cache-Control", "no-cache");
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`GLT server listening on :${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
