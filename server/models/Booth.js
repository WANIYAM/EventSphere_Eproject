import mongoose from "mongoose";

const boothSchema = new mongoose.Schema(
  {
    expo: { type: mongoose.Schema.Types.ObjectId, ref: "Expo", required: true },
    boothNumber: { type: String, required: true },
    size: { type: String },
    price: { type: Number },
    status: {
      type: String,
      enum: ["available", "reserved", "booked"],
      default: "available"
    },
    exhibitor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    details: { type: String },
    staff: [
      {
        name: { type: String, required: true },
        role: { type: String }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Booth", boothSchema);
