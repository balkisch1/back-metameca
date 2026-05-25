import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },

    category: { type: String, default: "Général", trim: true },

    reference: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    // 🔥 AJOUT ICI
    family: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    images: [
      {
        filename: String,
        url: String,
      },
    ],

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Text index
productSchema.index({ name: "text", description: "text", category: "text" });

export default mongoose.model("Product", productSchema);