import mongoose from "mongoose";

const expoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    theme: { type: String },
    location: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    image: { type: String, default: "" },
    capacity: { type: Number, default: 1000 }, // Maximum attendee capacity
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default mongoose.model("Expo", expoSchema);