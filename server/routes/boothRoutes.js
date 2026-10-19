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
import validateObjectId from "../middleware/validateObjectId.js";

const router = express.Router();

// Admin routes
router.put("/:id", protect, authorize("admin"), validateObjectId, updateBooth);
router.put("/:id/assign", protect, authorize("admin"), validateObjectId, assignBooth);
router.put("/:id/release", protect, authorize("admin"), validateObjectId, releaseBooth);
router.put("/:id/confirm", protect, authorize("admin"), validateObjectId, confirmBooth);

// Exhibitor routes
router.put("/:id/reserve", protect, authorize("exhibitor"), validateObjectId, reserveBooth);
router.put("/:id/cancel", protect, authorize("exhibitor"), validateObjectId, cancelReservation);
router.put("/:id/my-details", protect, authorize("exhibitor"), validateObjectId, updateMyBooth);

export default router;