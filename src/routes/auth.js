import { Router } from "express";
import bcrypt from "bcryptjs";
import Admin from "../models/admin.js";
import { signToken, authenticate } from "../middleware/auth.js";

const router = Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email et mot de passe requis" });

  const admin = await Admin.findOne({ email });
  console.log("Found admin:", admin); // null = wrong DB connection


  if (!admin)
    return res.status(401).json({ error: "Identifiants incorrects" });

  const valid = await bcrypt.compare(password, admin.password);
console.log("Password received:", JSON.stringify(password));
console.log("Valid:", valid);

  if (!valid)
    return res.status(401).json({ error: "Identifiants incorrects" });

  const token = signToken({
    id: admin._id,
    email: admin.email,
    role: admin.role,
    name: admin.name
  });

  res.json({
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    }
  });
});



// POST /api/auth/register-admin (protected - superadmin only)
router.post("/register-admin", authenticate, async (req, res) => {
  if (req.admin.role !== "superadmin")
    return res.status(403).json({ error: "Permission refusée" });

  const { name, email, password, role = "admin" } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: "Tous les champs sont requis" });

  const exists = await Admin.findOne({ email });

  if (exists)
    return res.status(409).json({ error: "Email déjà utilisé" });

  const hashed = await bcrypt.hash(password, 10);

  const admin = await Admin.create({
    name,
    email,
    password: hashed,
    role
  });

  res.status(201).json({
    id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role
  });
});

// GET /api/auth/me
router.get("/me", authenticate, async (req, res) => {
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
