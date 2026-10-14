import express from "express";
import {
  getLandingData,
  getPublicExpos,
  getPublicExpoById,
  getPublicExhibitors,
  getPublicExhibitorById,
  getFeaturedExhibitors,
  getPublicStats,
} from "../controllers/publicController.js";
import validateObjectId from "../middleware/validateObjectId.js";

const router = express.Router();

router.get("/landing-data", getLandingData);
router.get("/stats", getPublicStats);
router.get("/expos", getPublicExpos);
router.get("/expos/:id", validateObjectId, getPublicExpoById);
router.get("/exhibitors", getPublicExhibitors);
router.get("/exhibitors/:id", validateObjectId, getPublicExhibitorById);
router.get("/featured-exhibitors", getFeaturedExhibitors);

export default router;