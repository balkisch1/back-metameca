import { Router } from "express";
import bcrypt from "bcryptjs";
import Admin from "../models/admin.js";
import Client from "../models/client.js";  // ← manquant !

import { signToken, authenticateAdmin  } from "../middleware/auth.js";

const router = Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    // 1. chercher admin (superadmin aussi)
   let user = await Admin.findOne({ email });
let role = "superadmin";

if (!user) {
  user = await Client.findOne({ email });
  role = "client";
}

    if (!user) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    // 3. check password
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    // 4. token
    const token = signToken({
      id: user._id,
      email: user.email,
      role, // 🔥 IMPORTANT (pas hardcodé)
      name: user.name
    });

    // 5. response UNIFORME
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET /api/auth/me
router.get("/me", authenticateAdmin, async (req, res) => {
  const admin = await Admin.findById(req.admin.id);

  if (!admin)
    return res.status(404).json({ error: "Admin introuvable" });

  res.json({
    id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role
  });
});















export default router;
