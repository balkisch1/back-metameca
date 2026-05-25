import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    clientId:      { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    productId:     { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity:      { type: Number, default: 1, min: 1 },
    totalPrice:    { type: Number, required: true },
    notes:         { type: String, default: "" },
    scheduledDate: { type: Date, default: null },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    source:        { type: String, enum: ["admin", "public"], default: "admin" },
    notifiedAdmin: { type: Boolean, default: true },
    files: [{        // ← déplacé à l'intérieur
      originalName: String,
      filename:     String,
      mimetype:     String,
      size:         Number,
      url:          String,
      uploadedAt:   { type: Date, default: Date.now },
    }],
  },
  { timestamps: true }
);

export default mongoose.model("Reservation", reservationSchema);