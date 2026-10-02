import express from "express";
import {
  createApplication,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus
} from "../controllers/applicationController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("exhibitor"),
  upload.array("documents", 3),
  createApplication
);
router.get("/my", protect, authorize("exhibitor"), getMyApplications);
router.get("/", protect, authorize("admin"), getAllApplications);
router.put("/:id/status", protect, authorize("admin"), updateApplicationStatus);

export default router;
