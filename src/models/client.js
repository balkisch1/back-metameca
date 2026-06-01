import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone:    { type: String, default: "" },
  company:  { type: String, default: "" },
  role:     { type: String, default: "client" },
  address:  { type: String, default: "" },
  notes:    { type: String, default: "" },
  status:   { type: String, default: "active" },
}, { timestamps: true });

// ← ce guard empêche l'erreur si le modèle est déjà compilé
export default mongoose.models.Client || mongoose.model("Client", clientSchema);