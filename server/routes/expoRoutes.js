import express from "express";
import {
  createExpo,
  getExpos,
  getExpo,
  getPublicExpoDetails,
  updateExpo,
  deleteExpo
} from "../controllers/expoController.js";
import { getBoothsByExpo } from "../controllers/boothController.js";
import { getSessionsByExpo } from "../controllers/sessionController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. Unified public details route for attendee ExpoDetails page
router.get("/:id/public", getPublicExpoDetails);

// 2. Base expos routes: public GET, admin-protected POST
router
  .route("/")
  .get(getExpos)
  .post(protect, authorize("admin"), createExpo);

// 3. Single expo routes: public GET, admin-protected PUT/DELETE
router
  .route("/:id")
  .get(getExpo)
  .put(protect, authorize("admin"), updateExpo)
  .delete(protect, authorize("admin"), deleteExpo);

// 4. Public sub-routes for booths and sessions
router.get("/:expoId/booths", getBoothsByExpo);
router.get("/:expoId/sessions", getSessionsByExpo);

export default router;