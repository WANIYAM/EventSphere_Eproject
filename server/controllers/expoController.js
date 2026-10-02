import Expo from "../models/Expo.js";
import Booth from "../models/Booth.js";
import Application from "../models/Application.js";

// @desc    Create a new expo & auto-generate booths
// @route   POST /api/expos
export const createExpo = async (req, res) => {
  try {
    const { title, description, theme, location, startDate, endDate, boothCount, boothPrice, boothSize } = req.body;

    if (!title || !startDate || !endDate) {
      return res.status(400).json({ message: "Please provide title, startDate, and endDate" });
    }

    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);

    if (newEnd < newStart) {
      return res.status(400).json({ message: "End date cannot be before start date" });
    }

    // Check for location and date overlap with existing expos
    if (location && location.trim()) {
      const trimmedLocation = location.trim();
      const escapedLocation = trimmedLocation.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      const conflictingExpo = await Expo.findOne({
        location: { $regex: new RegExp(`^${escapedLocation}$`, "i") },
        startDate: { $lte: newEnd },
        endDate: { $gte: newStart }
      });

      if (conflictingExpo) {
        return res.status(400).json({
          message: "Another expo is already scheduled at this location during these dates."
        });
      }
    }

    const expo = await Expo.create({
      title,
      description,
      theme,
      location,
      startDate: newStart,
      endDate: newEnd,
      createdBy: req.user._id
    });

    // Auto-create booths
    const count = parseInt(boothCount) || 20;
    const price = parseFloat(boothPrice) || 500;
    const size = boothSize || "3x3 m";

    const boothsToCreate = [];
    for (let i = 1; i <= count; i++) {
      boothsToCreate.push({
        expo: expo._id,
        boothNumber: `A${i}`,
        size,
        price,
        status: "available"
      });
    }

    await Booth.insertMany(boothsToCreate);

    return res.status(201).json(expo);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get all expos
// @route   GET /api/expos
export const getExpos = async (req, res) => {
  try {
    const expos = await Expo.find().sort({ startDate: 1 });
    return res.status(200).json(expos);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get single expo by ID
// @route   GET /api/expos/:id
export const getExpo = async (req, res) => {
  try {
    const expo = await Expo.findById(req.params.id);
    if (!expo) {
      return res.status(404).json({ message: "Expo not found" });
    }
    return res.status(200).json(expo);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update expo
// @route   PUT /api/expos/:id
export const updateExpo = async (req, res) => {
  try {
    const existingExpo = await Expo.findById(req.params.id);
    if (!existingExpo) {
      return res.status(404).json({ message: "Expo not found" });
    }

    const newStart = req.body.startDate ? new Date(req.body.startDate) : existingExpo.startDate;
    const newEnd = req.body.endDate ? new Date(req.body.endDate) : existingExpo.endDate;

    if (newEnd < newStart) {
      return res.status(400).json({ message: "End date cannot be before start date" });
    }

    const targetLocation = req.body.location !== undefined ? req.body.location : existingExpo.location;

    // Check for location and date overlap with existing expos (excluding current expo)
    if (targetLocation && targetLocation.trim()) {
      const trimmedLocation = targetLocation.trim();
      const escapedLocation = trimmedLocation.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      const conflictingExpo = await Expo.findOne({
        _id: { $ne: req.params.id },
        location: { $regex: new RegExp(`^${escapedLocation}$`, "i") },
        startDate: { $lte: newEnd },
        endDate: { $gte: newStart }
      });

      if (conflictingExpo) {
        return res.status(400).json({
          message: "Another expo is already scheduled at this location during these dates."
        });
      }
    }

    if (req.body.title !== undefined) existingExpo.title = req.body.title;
    if (req.body.description !== undefined) existingExpo.description = req.body.description;
    if (req.body.theme !== undefined) existingExpo.theme = req.body.theme;
    existingExpo.location = targetLocation;
    existingExpo.startDate = newStart;
    existingExpo.endDate = newEnd;

    await existingExpo.save();

    return res.status(200).json(existingExpo);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Delete expo & related booths/applications
// @route   DELETE /api/expos/:id
export const deleteExpo = async (req, res) => {
  try {
    const expoId = req.params.id;
    const expo = await Expo.findById(expoId);

    if (!expo) {
      return res.status(404).json({ message: "Expo not found" });
    }

    await Booth.deleteMany({ expo: expoId });
    await Application.deleteMany({ expo: expoId });
    await expo.deleteOne();

    return res.status(200).json({ message: "Expo and related booths & applications deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
