import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    expo: { type: mongoose.Schema.Types.ObjectId, ref: "Expo", required: true },
    title: { type: String, required: true },
    speaker: { type: String },
    topic: { type: String },
    location: { type: String },
    startTime: { type: Date },
    endTime: { type: Date },
    reminderSent: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Session", sessionSchema);
