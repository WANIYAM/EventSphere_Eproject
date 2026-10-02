import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    expo: { type: mongoose.Schema.Types.ObjectId, ref: "Expo", required: true },
    session: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
    type: { type: String, enum: ["expo", "session"], default: "expo" },
    registered: { type: Boolean, default: true },
    bookmarked: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Partial unique index for expo registrations
registrationSchema.index(
  { user: 1, expo: 1 },
  { unique: true, partialFilterExpression: { type: "expo" } }
);

// Partial unique index for session registrations
registrationSchema.index(
  { user: 1, session: 1 },
  { unique: true, partialFilterExpression: { type: "session" } }
);

export default mongoose.model("Registration", registrationSchema);
