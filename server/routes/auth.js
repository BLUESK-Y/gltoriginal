import { Router } from "express";
import bcrypt from "bcryptjs";
import Client from "../models/Client.js";

const router = Router();

router.post("/login", async (req, res, next) => {
  try {
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const password = String(req.body?.password ?? "");

    if (!email || !password) {
      return res.status(400).json({ error: "Enter your email and password." });
    }

    const client = await Client.findOne({ email });
    const ok = client && (await bcrypt.compare(password, client.passwordHash));
    if (!ok) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    res.json({ ok: true, client: { email: client.email, name: client.name } });
  } catch (err) {
    next(err);
  }
});

export default router;
