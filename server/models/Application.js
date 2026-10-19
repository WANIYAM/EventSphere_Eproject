import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    expo: { type: mongoose.Schema.Types.ObjectId, ref: "Expo", required: true },
    exhibitor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    companyName: { type: String },
    products: { type: String },
    documents: [{ type: String }],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    booth: { type: mongoose.Schema.Types.ObjectId, ref: "Booth" }
  },
  { timestamps: true }
);

// Admin application review and approval filters
applicationSchema.index({ expo: 1, status: 1 });
applicationSchema.index({ exhibitor: 1, status: 1 });

export default mongoose.model("Application", applicationSchema);