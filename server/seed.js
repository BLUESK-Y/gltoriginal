import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { connectDB } from "./config/db.js";
import { CAMPAIGN } from "./data/campaign.js";
import { buildHubsSeed } from "./data/hubsSeed.js";
import { hubs as siteHubsSeed } from "./data/site/hubs.js";
import Client from "./models/Client.js";
import Hub from "./models/Hub.js";
import SiteHub from "./models/site/Hub.js";

const CLIENT_EMAIL = "client@flashpopfoods.com";
const CLIENT_PASSWORD = "flashpop2026";

async function run() {
  await connectDB();

  const hubs = buildHubsSeed();
  await Hub.deleteMany({});
  await Hub.insertMany(hubs);
  console.log(`Seeded ${hubs.length} hubs.`);

  await SiteHub.deleteMany({});
  await SiteHub.insertMany(siteHubsSeed);
  console.log(`Seeded ${siteHubsSeed.length} site hubs (landing page map).`);

  const passwordHash = await bcrypt.hash(CLIENT_PASSWORD, 10);
  await Client.deleteMany({});
  await Client.create({ email: CLIENT_EMAIL, passwordHash, name: CAMPAIGN.client });
  console.log(`Seeded client login: ${CLIENT_EMAIL} / ${CLIENT_PASSWORD}`);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
