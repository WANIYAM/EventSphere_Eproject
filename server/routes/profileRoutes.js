import express from "express";
import { getProfile, updateProfile, uploadLogo } from "../controllers/profileController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", protect, getProfile);
router.put("/", protect, updateProfile);
router.post("/logo", protect, authorize("exhibitor"), upload.single("logo"), uploadLogo);

export default router;
