import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Helper function to generate JWT token (valid for 7 days)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc    Register a new user (exhibitor or attendee)
// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, company } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email, and password" });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Restrict role selection
    const userRole = role || "attendee";
    if (userRole === "admin" || !["exhibitor", "attendee"].includes(userRole)) {
      return res.status(400).json({ message: "Invalid role. Only exhibitor or attendee allowed" });
    }

    // Check for duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
      phone,
      company
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Login user & return JWT token
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get currently logged in user profile
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      company: user.company
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Generate password reset token
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please provide an email address" });
    }

    const user = await User.findOne({ email });
    const successMsg = "If an account with that email exists, a password reset link has been generated.";

    if (!user) {
      console.log(`[Forgot Password]: No user found for ${email}`);
      return res.status(200).json({ message: successMsg });
    }

    // Generate random raw token
    const rawToken = crypto.randomBytes(20).toString("hex");

    // Hash token for storage & set 15 min expiry
    user.resetToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    user.resetTokenExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetLink = `http://localhost:5173/reset-password/${rawToken}`;
    console.log(`[DEV Password Reset Link]: ${resetLink}`);

    return res.status(200).json({
      message: successMsg,
      resetToken: rawToken,
      resetLink
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Reset password using reset token
// @route   PUT /api/auth/reset-password/:token
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
