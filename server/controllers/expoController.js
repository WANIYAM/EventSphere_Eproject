import Expo from "../models/Expo.js";
import Booth from "../models/Booth.js";
import Session from "../models/Session.js";
import Application from "../models/Application.js";

// @desc    Create a new expo & auto-generate booths
// @route   POST /api/expos
export const createExpo = async (req, res) => {
  try {
    const {
      title,
      description,
      theme,
      location,
      startDate,
      endDate,
      boothCount,
      boothPrice,
      boothSize
    } = req.body;

    if (!title || !startDate || !endDate) {
      return res.status(400).json({ message: "Please provide title, startDate, and endDate" });
    }

    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);

    if (newEnd < newStart) {
      return res.status(400).json({ message: "End date cannot be before start date" });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : (req.body.image || "");

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
      image,
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

// @desc    Get all expos (Public)
// @route   GET /api/expos
export const getExpos = async (req, res) => {
  try {
    const expos = await Expo.find().sort({ startDate: 1 });
    return res.status(200).json(expos);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get complete expo data including booths, sessions & exhibitors
// @route   GET /api/expos/:id  AND  GET /api/expos/:id/public
export const getPublicExpoDetails = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("➡️ [getPublicExpoDetails] HIT! Requested Expo ID:", id);

    const expo = await Expo.findById(id).populate("createdBy", "name email");
    if (!expo) {
      console.log("❌ Expo not found for ID:", id);
      return res.status(404).json({ message: "Expo not found" });
    }

    // 1. Fetch booths
    const booths = await Booth.find({ expo: id })
      .populate("exhibitor", "name email company")
      .sort({ boothNumber: 1 });
    console.log(`➡️ Booths found: ${booths.length} (Assigned exhibitors: ${booths.filter(b => b.exhibitor).length})`);

    // 2. Fetch applications (accept pending & approved so exhibitors always show)
    const applications = await Application.find({ expo: id })
      .populate("exhibitor", "name email company")
      .populate("booth", "boothNumber size price status");
    console.log(`➡️ Applications found in DB for this expo: ${applications.length}`);

    applications.forEach((a, i) => {
      console.log(`   [${i + 1}] Company: "${a.companyName}", Status: "${a.status}", Rep: "${a.exhibitor?.name}"`);
    });

    // 3. Build unified Exhibitors list
    const exhibitorMap = new Map();

    // From Applications
    applications.forEach((app) => {
      const exhibitorId = app.exhibitor?._id?.toString() || app._id.toString();
      exhibitorMap.set(exhibitorId, {
        id: exhibitorId,
        company: app.companyName || app.exhibitor?.company || app.exhibitor?.name || "Company Name Pending",
        representative: app.exhibitor?.name || "Representative",
        email: app.exhibitor?.email || "",
        products: app.products || "Exhibitor Showroom & Services",
        status: app.status,
        boothNumber: app.booth?.boothNumber || null,
        boothSize: app.booth?.size || null,
      });
    });

    // From assigned Booths
    booths.forEach((booth) => {
      if (booth.exhibitor) {
        const exhibitorId = booth.exhibitor._id?.toString();
        if (exhibitorId && !exhibitorMap.has(exhibitorId)) {
          exhibitorMap.set(exhibitorId, {
            id: exhibitorId,
            company: booth.exhibitor.company || booth.exhibitor.name,
            representative: booth.exhibitor.name,
            email: booth.exhibitor.email,
            products: booth.details || "Showcase Products",
            status: "approved",
            boothNumber: booth.boothNumber,
            boothSize: booth.size,
          });
        } else if (exhibitorId && exhibitorMap.has(exhibitorId)) {
          const existing = exhibitorMap.get(exhibitorId);
          existing.boothNumber = booth.boothNumber;
          existing.boothSize = booth.size;
        }
      }
    });

    const exhibitors = Array.from(exhibitorMap.values());
    console.log(`➡️ Total exhibitors being sent to frontend: ${exhibitors.length}`);

    // 4. Fetch schedule sessions
    const sessions = await Session.find({ expo: id }).sort({ startTime: 1 });

    // Backwards-compatible response object
    return res.status(200).json({
      ...expo.toObject(),
      expo,
      booths,
      sessions,
      exhibitors,
    });
  } catch (error) {
    console.error("❌ Error in getPublicExpoDetails:", error);
    return res.status(500).json({ message: error.message });
  }
};

// getExpo delegates to getPublicExpoDetails so both GET /api/expos/:id and GET /api/expos/:id/public return full data
export const getExpo = getPublicExpoDetails;

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

    // Check for location and date overlap with other expos
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
    if (req.file) {
      existingExpo.image = `/uploads/${req.file.filename}`;
    } else if (req.body.image !== undefined) {
      existingExpo.image = req.body.image;
    }
    existingExpo.location = targetLocation;
    existingExpo.startDate = newStart;
    existingExpo.endDate = newEnd;

    await existingExpo.save();

    return res.status(200).json(existingExpo);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Delete expo & related booths/applications/sessions
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
    await Session.deleteMany({ expo: expoId });
    await expo.deleteOne();

    return res.status(200).json({ message: "Expo and related booths & applications deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};