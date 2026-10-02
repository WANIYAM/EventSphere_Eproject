import express from "express";
import {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword
} from "../controllers/authController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

// Protected routes
router.get("/me", protect, getMe);
router.get("/admin-check", protect, authorize("admin"), (req, res) => {
  res.status(200).json({ message: "admin ok" });
});

export default router;
