import User from "../models/User.js";

// @desc    Get users list for admin (recipient selection)
// @route   GET /api/users
export const getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = {};
    if (role) filter.role = role;

    const users = await User.find(filter)
      .select("_id name email role company")
      .sort({ name: 1 });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
