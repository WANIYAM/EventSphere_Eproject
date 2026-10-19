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
    capacity: { type: Number, default: 100 }, // Maximum session seat limit
    reminderSent: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// High-frequency timetable query and reminder sort index
sessionSchema.index({ expo: 1, startTime: 1 });

export default mongoose.model("Session", sessionSchema);