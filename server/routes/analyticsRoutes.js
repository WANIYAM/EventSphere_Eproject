import express from "express";
import { getAdminAnalytics } from "../controllers/analyticsController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Mount on /api/analytics
router.get("/admin", protect, authorize("admin"), getAdminAnalytics);
router.get("/", protect, authorize("admin"), getAdminAnalytics);

export default router;