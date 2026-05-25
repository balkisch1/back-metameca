import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";
import bcrypt from "bcryptjs";  
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// CREATE TOKEN
export const signToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
};

// AUTH MIDDLEWARE
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    req.admin = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
  











  
};