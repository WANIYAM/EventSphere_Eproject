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
import validateObjectId from "../middleware/validateObjectId.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/:id/public", validateObjectId, getPublicExpoDetails);

router
  .route("/")
  .get(getExpos)
  .post(protect, authorize("admin"), upload.single("image"), createExpo);

router
  .route("/:id")
  .get(validateObjectId, getExpo)
  .put(protect, authorize("admin"), validateObjectId, upload.single("image"), updateExpo)
  .delete(protect, authorize("admin"), validateObjectId, deleteExpo);

router.get("/:expoId/booths", validateObjectId, getBoothsByExpo);
router.get("/:expoId/sessions", validateObjectId, getSessionsByExpo);

export default router;