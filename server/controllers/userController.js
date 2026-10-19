import User from "../models/User.js";

// @desc    Get all users with optional role filter (Admin only, sanitized against NoSQL injection)
// @route   GET /api/users
export const getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = {};

    // Block NoSQL query selector injection like ?role[$ne]=null
    if (role && typeof role === "string" && ["admin", "exhibitor", "attendee"].includes(role.trim())) {
      filter.role = role.trim();
    }

    const users = await User.find(filter)
      .select("name email role company phone category")
      .sort({ name: 1 });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};