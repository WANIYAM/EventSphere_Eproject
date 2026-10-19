import express from "express";
import {
  getMyNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";
import validateObjectId from "../middleware/validateObjectId.js";

const router = express.Router();

router.use(protect);

router.get("/", getMyNotifications);
router.get("/unread-count", getUnreadCount);
router.put("/read-all", markAllAsRead);
router.put("/:id/read", validateObjectId, markAsRead);

export default router;