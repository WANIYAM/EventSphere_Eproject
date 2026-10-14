import express from "express";
import {
  createSession,
  updateSession,
  deleteSession,
  getSessionsByExpo,
  getSession
} from "../controllers/sessionController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import validateObjectId from "../middleware/validateObjectId.js";

const router = express.Router();

// General session endpoints
router.post("/", protect, authorize("admin"), createSession);
router.get("/:id", validateObjectId, getSession);
router.put("/:id", protect, authorize("admin"), validateObjectId, updateSession);
router.delete("/:id", protect, authorize("admin"), validateObjectId, deleteSession);

export default router;
export { getSessionsByExpo };