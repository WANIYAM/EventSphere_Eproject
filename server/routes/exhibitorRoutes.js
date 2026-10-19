import express from "express";
import {
  getExhibitors,
  getCategories,
  getExhibitor
} from "../controllers/exhibitorController.js";
import { protect } from "../middleware/authMiddleware.js";
import validateObjectId from "../middleware/validateObjectId.js";

const router = express.Router();

router.get("/", protect, getExhibitors);
router.get("/categories", protect, getCategories);
router.get("/:id", protect, validateObjectId, getExhibitor);

export default router;