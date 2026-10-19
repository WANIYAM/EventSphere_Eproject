import express from "express";
import {
  sendMessage,
  sendPublicContact,
  getInbox,
  getSent,
  markAsRead,
  getUnreadCount,
  getAdminContact,
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";
import validateObjectId from "../middleware/validateObjectId.js";

const router = express.Router();

// Public contact route (no login required)
router.post("/public-contact", sendPublicContact);

// Authenticated message routes
router.post("/", protect, sendMessage);
router.get("/inbox", protect, getInbox);
router.get("/sent", protect, getSent);
router.put("/:id/read", protect, validateObjectId, markAsRead);
router.get("/unread-count", protect, getUnreadCount);
router.get("/admin-contact", protect, getAdminContact);

export default router;