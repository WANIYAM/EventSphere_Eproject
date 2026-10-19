import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String },
    body: { type: String },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Unread badge count & inbox query index
messageSchema.index({ receiver: 1, read: 1 });

// Sent archive index
messageSchema.index({ sender: 1, createdAt: -1 });

export default mongoose.model("Message", messageSchema);