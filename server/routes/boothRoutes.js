import express from "express";
import {
  updateBooth,
  assignBooth,
  releaseBooth,
  reserveBooth,
  cancelReservation,
  confirmBooth,
  updateMyBooth
} from "../controllers/boothController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin routes
router.put("/:id", protect, authorize("admin"), updateBooth);
router.put("/:id/assign", protect, authorize("admin"), assignBooth);
router.put("/:id/release", protect, authorize("admin"), releaseBooth);
router.put("/:id/confirm", protect, authorize("admin"), confirmBooth);

// Exhibitor routes
router.put("/:id/reserve", protect, authorize("exhibitor"), reserveBooth);
router.put("/:id/cancel", protect, authorize("exhibitor"), cancelReservation);
router.put("/:id/my-details", protect, authorize("exhibitor"), updateMyBooth);

export default router;
