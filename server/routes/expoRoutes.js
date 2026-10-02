import express from "express";
import {
  createExpo,
  getExpos,
  getExpo,
  updateExpo,
  deleteExpo
} from "../controllers/expoController.js";
import { getBoothsByExpo } from "../controllers/boothController.js";
import { getSessionsByExpo } from "../controllers/sessionController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getExpos)
  .post(protect, authorize("admin"), createExpo);

router
  .route("/:id")
  .get(protect, getExpo)
  .put(protect, authorize("admin"), updateExpo)
  .delete(protect, authorize("admin"), deleteExpo);

router.get("/:expoId/booths", protect, getBoothsByExpo);
router.get("/:expoId/sessions", protect, getSessionsByExpo);

export default router;
