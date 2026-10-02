import Feedback from "../models/Feedback.js";

// @desc    Submit feedback (any logged-in user)
// @route   POST /api/feedback
export const createFeedback = async (req, res) => {
  try {
    const { type, message } = req.body;

    if (!type || !["suggestion", "issue"].includes(type)) {
      return res.status(400).json({ message: "Type must be 'suggestion' or 'issue'" });
    }
    if (!message || message.trim().length < 5) {
      return res.status(400).json({ message: "Message must be at least 5 characters" });
    }

    const feedback = await Feedback.create({
      user: req.user._id,
      type,
      message: message.trim()
    });

    return res.status(201).json(feedback);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get all feedback (admin only)
// @route   GET /api/feedback
export const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });
    return res.json(feedback);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
