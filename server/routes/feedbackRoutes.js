import express from "express";
import { createFeedback, getAllFeedback } from "../controllers/feedbackController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Any logged-in user can submit feedback
router.post("/", protect, createFeedback);

// Only admin can view all feedback
router.get("/", protect, authorize("admin"), getAllFeedback);

export default router;
