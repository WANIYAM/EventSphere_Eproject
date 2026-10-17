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

    if (senderRole === "attendee" && receiverRole !== "admin" && receiverRole !== "exhibitor") {
      return res.status(403).json({
        message: "Attendees may only message event organizers and exhibitors",
      });
    }

    if (
      senderRole === "exhibitor" &&
      !["admin", "exhibitor", "attendee"].includes(receiverRole)
    ) {
      return res.status(403).json({
        message: "Exhibitors may only message organizers, exhibitors, and attendees",
      });
    }

    // 5. Create and dispatch message
    const message = await Message.create({
      sender: req.user._id,
      receiver,
      subject: subject.trim(),
      body: body.trim(),
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

// @desc    Send a contact inquiry from any visitor (guest or logged-in)
// @route   POST /api/messages/public-contact
export const sendPublicContact = async (req, res) => {
  try {
    const { name, email, category, subject, body } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Your name is required" });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Your email address is required" });
    }
    if (!subject || !subject.trim()) {
      return res.status(400).json({ message: "Inquiry subject is required" });
    }
    if (!body || !body.trim()) {
      return res.status(400).json({ message: "Message body is required" });
    }

    // Find admin recipient
    const admin = await User.findOne({ role: "admin" });
    if (!admin) {
      return res.status(404).json({ message: "Operations desk is currently offline. Please try again later." });
    }

    // Find or create sender record for populated view in admin messages
    const cleanEmail = email.toLowerCase().trim();
    let sender = await User.findOne({ email: cleanEmail });
    if (!sender) {
      sender = await User.create({
        name: name.trim(),
        email: cleanEmail,
        password: Math.random().toString(36).slice(-8) + "Aa1!",
        role: "attendee",
      });
    }

    const formattedSubject = category
      ? `[${category.toUpperCase()}] ${subject.trim()}`
      : subject.trim();

    const message = await Message.create({
      sender: sender._id,
      receiver: admin._id,
      subject: formattedSubject,
      body: body.trim(),
    });

    const populatedMsg = await Message.findById(message._id).populate(
      "sender",
      "name role company email"
    );

    try {
      emitToUser(admin._id.toString(), "message:new", populatedMsg);
      await createNotification(
        admin._id,
        `New contact inquiry from ${name.trim()} (${cleanEmail})`,
        "/messages"
      );
    } catch (notifyErr) {
      console.warn("Notification dispatch skipped:", notifyErr.message);
    }

    return res.status(201).json({
      success: true,
      message: "Transmission received. The operations team will follow up within 24 hours.",
      data: populatedMsg,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get inbox messages with optional pagination
// @route   GET /api/messages/inbox
export const getInbox = async (req, res) => {
  try {
    const { page, limit } = req.query;

    if (page && limit) {
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 15;
      const skip = (pageNum - 1) * limitNum;

      const [messages, total] = await Promise.all([
        Message.find({ receiver: req.user._id })
          .populate("sender", "name role company email")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum),
        Message.countDocuments({ receiver: req.user._id }),
      ]);

      return res.status(200).json({
        messages,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
      });
    }

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
      read: false,
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