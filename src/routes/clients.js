
import { Router } from "express";
import Client from "../models/Client.js";
import Reservation from "../models/Reservation.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// GET /api/clients
router.get("/", authenticate, async (req, res) => {
  try {
    const { search } = req.query;
    const filter = {};
    if (search) filter.$text = { $search: search };

    const clients = await Client.find(filter).sort({ createdAt: -1 });

    // Add reservation count
    const withCounts = await Promise.all(
      clients.map(async (c) => {
        const count = await Reservation.countDocuments({ clientId: c._id });
        return { ...c.toJSON(), reservationCount: count };
      })
    );

    res.json(withCounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/clients/:id  (with full reservation list)
router.get("/:id", authenticate, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ error: "Client introuvable" });

    const reservations = await Reservation.find({ clientId: req.params.id })
      .populate("productId", "name price image")
      .sort({ createdAt: -1 });

    // Rename productId → product for frontend compatibility
    const mapped = reservations.map((r) => {
      const obj = r.toJSON();
      obj.product = obj.productId;
      delete obj.productId;
      return obj;
    });

    res.json({ ...client.toJSON(), reservations: mapped });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/clients
router.post("/", authenticate, async (req, res) => {
  try {
    const { name, email, phone, company, address, notes } = req.body;
    if (!name || !email) return res.status(400).json({ error: "Nom et email requis" });

    const exists = await Client.findOne({ email });
    if (exists) return res.status(409).json({ error: "Email déjà utilisé" });

    const client = await Client.create({ name, email, phone, company, address, notes });
    res.status(201).json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/clients/:id
router.put("/:id", authenticate, async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!client) return res.status(404).json({ error: "Client introuvable" });
    res.json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/clients/:id
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ error: "Client introuvable" });
    res.json({ message: "Client supprimé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
