import express from "express";
import {
  sendMessage,
  getInbox,
  getSent,
  markAsRead,
  getUnreadCount,
  getAdminContact
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/inbox", protect, getInbox);
router.get("/sent", protect, getSent);
router.put("/:id/read", protect, markAsRead);
router.get("/unread-count", protect, getUnreadCount);
router.get("/admin-contact", protect, getAdminContact);

export default router;
