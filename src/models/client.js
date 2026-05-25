import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true },
    email:   { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone:   { type: String, default: "" },
    company: { type: String, default: "" },
    address: { type: String, default: "" },
    notes:   { type: String, default: "" },
    status:  { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

clientSchema.index({ name: "text", email: "text", company: "text" });

export default mongoose.model("Client", clientSchema);