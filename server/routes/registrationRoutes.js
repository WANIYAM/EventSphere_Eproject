import express from "express";
import {
  registerForExpo,
  registerForSession,
  toggleBookmark,
  cancelRegistration,
  getMyRegistrations
} from "../controllers/registrationController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import validateObjectId from "../middleware/validateObjectId.js";

const router = express.Router();

// All routes: attendee only
router.post("/", protect, authorize("attendee"), registerForExpo);
router.post("/session", protect, authorize("attendee"), registerForSession);
router.put("/bookmark", protect, authorize("attendee"), toggleBookmark);
router.get("/my", protect, authorize("attendee"), getMyRegistrations);
router.delete("/:id", protect, authorize("attendee"), validateObjectId, cancelRegistration);

export default router;