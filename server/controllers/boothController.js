import Booth from "../models/Booth.js";
import Application from "../models/Application.js";
import { emitToAll } from "../utils/socket.js";
import { createNotification } from "../utils/notify.js";

// @desc    Get all booths for a specific expo (public/attendee view - no emails populated)
// @route   GET /api/expos/:expoId/booths
export const getBoothsByExpo = async (req, res) => {
  try {
    const booths = await Booth.find({ expo: req.params.expoId })
      .populate("exhibitor", "name company category logo")
      .sort({ boothNumber: 1 });
    return res.status(200).json(booths);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update booth details (Admin)
// @route   PUT /api/booths/:id
export const updateBooth = async (req, res) => {
  try {
    const { size, price, details, status } = req.body;
    const booth = await Booth.findByIdAndUpdate(
      req.params.id,
      { size, price, details, status },
      { new: true, runValidators: true }
    );

    if (!booth) {
      return res.status(404).json({ message: "Booth not found" });
    }

    emitToAll("booth:updated", { expoId: booth.expo });

    return res.status(200).json(booth);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Assign booth to an exhibitor with an approved application (Admin)
// @route   PUT /api/booths/:id/assign
export const assignBooth = async (req, res) => {
  try {
    const { exhibitorId } = req.body;
    if (!exhibitorId) {
      return res.status(400).json({ message: "Please provide exhibitorId" });
    }

    const booth = await Booth.findById(req.params.id);
    if (!booth) {
      return res.status(404).json({ message: "Booth not found" });
    }

    if (booth.status !== "available") {
      return res.status(400).json({ message: "Booth is not available for assignment" });
    }

    const application = await Application.findOne({
      expo: booth.expo,
      exhibitor: exhibitorId,
      status: "approved"
    });

    if (!application) {
      return res.status(400).json({
        message: "Exhibitor does not have an approved application for this expo"
      });
    }

    booth.exhibitor = exhibitorId;
    booth.status = "booked";
    await booth.save();

    application.booth = booth._id;
    await application.save();

    emitToAll("booth:updated", { expoId: booth.expo });

    await createNotification(
      exhibitorId,
      `Your booth #${booth.boothNumber} has been assigned!`,
      `/expos/${booth.expo}?tab=booths`
    );

    return res.status(200).json({ message: "Booth assigned successfully", booth });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Release a booked/reserved booth (Admin)
// @route   PUT /api/booths/:id/release
export const releaseBooth = async (req, res) => {
  try {
    const booth = await Booth.findById(req.params.id);
    if (!booth) {
      return res.status(404).json({ message: "Booth not found" });
    }

    const previousExhibitor = booth.exhibitor;

    await Application.findOneAndUpdate(
      { booth: booth._id },
      { booth: null }
    );

    booth.exhibitor = null;
    booth.status = "available";
    await booth.save();

    emitToAll("booth:updated", { expoId: booth.expo });

    if (previousExhibitor) {
      await createNotification(
        previousExhibitor,
        `Your booth #${booth.boothNumber} has been released by the admin.`,
        `/expos/${booth.expo}?tab=booths`
      );
    }

    return res.status(200).json({ message: "Booth released successfully", booth });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Reserve booth self-service (Exhibitor)
// @route   PUT /api/booths/:id/reserve
export const reserveBooth = async (req, res) => {
  try {
    const booth = await Booth.findById(req.params.id);
    if (!booth) {
      return res.status(404).json({ message: "Booth not found" });
    }

    if (booth.status !== "available") {
      return res.status(400).json({ message: "Booth is no longer available" });
    }

    const application = await Application.findOne({
      expo: booth.expo,
      exhibitor: req.user._id,
      status: "approved"
    });

    if (!application) {
      return res.status(400).json({
        message: "You do not have an approved application for this expo"
      });
    }

    const existingHolding = await Booth.findOne({
      expo: booth.expo,
      exhibitor: req.user._id,
      status: { $in: ["reserved", "booked"] }
    });

    if (existingHolding) {
      return res.status(400).json({
        message: "You already hold or reserved a booth for this expo"
      });
    }

    booth.status = "reserved";
    booth.exhibitor = req.user._id;
    await booth.save();

    application.booth = booth._id;
    await application.save();

    emitToAll("booth:updated", { expoId: booth.expo });

    return res.status(200).json({ message: "Booth reserved successfully", booth });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel booth reservation (Exhibitor)
// @route   PUT /api/booths/:id/cancel
export const cancelReservation = async (req, res) => {
  try {
    const booth = await Booth.findById(req.params.id);
    if (!booth) {
      return res.status(404).json({ message: "Booth not found" });
    }

    if (booth.status !== "reserved" || booth.exhibitor?.toString() !== req.user._id.toString()) {
      return res.status(400).json({ message: "You can only cancel your own reserved booth" });
    }

    await Application.findOneAndUpdate(
      { booth: booth._id },
      { booth: null }
    );

    booth.status = "available";
    booth.exhibitor = null;
    await booth.save();

    emitToAll("booth:updated", { expoId: booth.expo });

    return res.status(200).json({ message: "Reservation cancelled successfully", booth });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Confirm reserved booth to booked (Admin)
// @route   PUT /api/booths/:id/confirm
export const confirmBooth = async (req, res) => {
  try {
    const booth = await Booth.findById(req.params.id);
    if (!booth) {
      return res.status(404).json({ message: "Booth not found" });
    }

    if (booth.status !== "reserved") {
      return res.status(400).json({ message: "Only reserved booths can be confirmed" });
    }

    booth.status = "booked";
    await booth.save();

    emitToAll("booth:updated", { expoId: booth.expo });

    if (booth.exhibitor) {
      await createNotification(
        booth.exhibitor,
        `Your reservation for booth #${booth.boothNumber} has been confirmed!`,
        `/expos/${booth.expo}?tab=booths`
      );
    }

    return res.status(200).json({ message: "Booth confirmed to booked", booth });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update booth details and staff (Exhibitor for own booth)
// @route   PUT /api/booths/:id/my-details
export const updateMyBooth = async (req, res) => {
  try {
    const { details, staff } = req.body;
    const booth = await Booth.findById(req.params.id);

    if (!booth) {
      return res.status(404).json({ message: "Booth not found" });
    }

    if (booth.exhibitor?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this booth" });
    }

    if (details !== undefined) booth.details = details;
    if (staff !== undefined) booth.staff = staff;

    await booth.save();

    emitToAll("booth:updated", { expoId: booth.expo });

    return res.status(200).json({ message: "Booth details updated", booth });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};