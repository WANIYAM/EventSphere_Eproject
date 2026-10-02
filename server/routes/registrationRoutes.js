import express from "express";
import {
  registerForExpo,
  registerForSession,
  toggleBookmark,
  cancelRegistration,
  getMyRegistrations
} from "../controllers/registrationController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes: attendee only
router.post("/", protect, authorize("attendee"), registerForExpo);
router.post("/session", protect, authorize("attendee"), registerForSession);
router.put("/bookmark", protect, authorize("attendee"), toggleBookmark);
router.get("/my", protect, authorize("attendee"), getMyRegistrations);
router.delete("/:id", protect, authorize("attendee"), cancelRegistration);

export default router;
