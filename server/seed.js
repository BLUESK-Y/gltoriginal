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

const CLIENTS = [
  { email: "client@flashpopfoods.com", password: "flashpop2026", name: CAMPAIGN.client },
  { email: "client@gltdemo.com", password: "gltdemo2026", name: "GLT Demo" },
];

async function run() {
  await connectDB();

  const hubs = buildHubsSeed();
  await Hub.deleteMany({});
  await Hub.insertMany(hubs);
  console.log(`Seeded ${hubs.length} hubs.`);

  await SiteHub.deleteMany({});
  await SiteHub.insertMany(siteHubsSeed);
  console.log(`Seeded ${siteHubsSeed.length} site hubs (landing page map).`);

  await Client.deleteMany({});
  for (const { email, password, name } of CLIENTS) {
    const passwordHash = await bcrypt.hash(password, 10);
    await Client.create({ email, passwordHash, name });
    console.log(`Seeded client login: ${email} / ${password}`);
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
