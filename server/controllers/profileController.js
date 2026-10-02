import User from "../models/User.js";

// @desc    Get logged in user profile
// @route   GET /api/profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile details
// @route   PUT /api/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, company, description, website, category } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (company !== undefined) user.company = company;
    if (description !== undefined) user.description = description;
    if (website !== undefined) user.website = website;
    if (category !== undefined) user.category = category;

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Upload company logo (Exhibitor only)
// @route   POST /api/profile/logo
export const uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image file" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const logoPath = `/uploads/${req.file.filename}`;
    user.logo = logoPath;
    await user.save();

    return res.status(200).json({
      message: "Logo uploaded successfully",
      logo: logoPath
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
