import express from "express";
import {
  getExhibitors,
  getCategories,
  getExhibitor
} from "../controllers/exhibitorController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Any logged-in user can browse exhibitors
router.get("/", protect, getExhibitors);
router.get("/categories", protect, getCategories);
router.get("/:id", protect, getExhibitor);

export default router;
