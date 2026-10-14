import Message from "../models/Message.js";
import User from "../models/User.js";
import { emitToUser } from "../utils/socket.js";
import { createNotification } from "../utils/notify.js";

// @desc    Send a message with server-enforced recipient authorization
// @route   POST /api/messages
export const sendMessage = async (req, res) => {
  try {
    const { receiver, subject, body } = req.body;

    // 1. Validate required fields
    if (!receiver) {
      return res.status(400).json({ message: "Please provide a recipient" });
    }

    if (!subject || !subject.trim()) {
      return res.status(400).json({ message: "Subject is required" });
    }

    if (!body || !body.trim()) {
      return res.status(400).json({ message: "Message body is required" });
    }

    // 2. Reject messaging yourself
    if (receiver.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot message yourself" });
    }

    // 3. Find receiver
    const receiverUser = await User.findById(receiver);
    if (!receiverUser) {
      return res.status(404).json({ message: "Recipient user not found" });
    }

    // 4. Enforce role-based messaging permissions
    const senderRole = req.user.role;
    const receiverRole = receiverUser.role;

    // Attendees may only message organizers (admins) and exhibitors
    if (senderRole === "attendee" && receiverRole !== "admin" && receiverRole !== "exhibitor") {
      return res.status(403).json({
        message: "Attendees may only message event organizers and exhibitors"
      });
    }

    // Exhibitors may message admins, other exhibitors, and attendees
    if (
      senderRole === "exhibitor" &&
      !["admin", "exhibitor", "attendee"].includes(receiverRole)
    ) {
      return res.status(403).json({
        message: "Exhibitors may only message organizers, exhibitors, and attendees"
      });
    }

    // 5. Create and dispatch message
    const message = await Message.create({
      sender: req.user._id,
      receiver,
      subject: subject.trim(),
      body: body.trim()
    });

    const populatedMsg = await Message.findById(message._id).populate(
      "sender",
      "name role company email"
    );

    // Emit live WebSocket event to receiver
    emitToUser(receiver.toString(), "message:new", populatedMsg);

    // Create persistent notification for receiver
    const senderName = req.user.name || "a user";
    await createNotification(
      receiver,
      `New message from ${senderName}`,
      "/messages"
    );

    return res.status(201).json(populatedMsg);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get inbox messages for logged in user
// @route   GET /api/messages/inbox
export const getInbox = async (req, res) => {
  try {
    const messages = await Message.find({ receiver: req.user._id })
      .populate("sender", "name role company email")
      .sort({ createdAt: -1 });

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get sent messages for logged in user
// @route   GET /api/messages/sent
export const getSent = async (req, res) => {
  try {
    const messages = await Message.find({ sender: req.user._id })
      .populate("receiver", "name role company email")
      .sort({ createdAt: -1 });

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
export const markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to mark this message as read" });
    }

    message.read = true;
    await message.save();

    return res.status(200).json({ message: "Message marked as read", messageObj: message });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get unread message count
// @route   GET /api/messages/unread-count
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      read: false
    });
    return res.status(200).json({ count });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get first admin user for messaging
// @route   GET /api/messages/admin-contact
export const getAdminContact = async (req, res) => {
  try {
    const admin = await User.findOne({ role: "admin" }).select("_id name email");
    if (!admin) {
      return res.status(404).json({ message: "No admin user found" });
    }
    return res.status(200).json({ _id: admin._id, name: admin.name });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};