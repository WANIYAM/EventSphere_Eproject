import express from "express";
import {
  createSession,
  updateSession,
  deleteSession,
  getSessionsByExpo,
  getSession
} from "../controllers/sessionController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// General session endpoints
router.post("/", protect, authorize("admin"), createSession);
router.get("/:id", protect, getSession);
router.put("/:id", protect, authorize("admin"), updateSession);
router.delete("/:id", protect, authorize("admin"), deleteSession);

export default router;
export { getSessionsByExpo };
