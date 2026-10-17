import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    link: { type: String },
    type: { type: String },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Notification bell badge & unread counter index
notificationSchema.index({ user: 1, read: 1 });

export default mongoose.model("Notification", notificationSchema);