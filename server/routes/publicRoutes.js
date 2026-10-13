import express from "express";
import { getLandingData } from "../controllers/publicController.js";

const router = express.Router();

// Public endpoint - NO JWT REQUIRED
router.get("/landing-data", getLandingData);

export default router;