import Application from "../models/Application.js";
import Booth from "../models/Booth.js";
import User from "../models/User.js";
import { createNotification, notifyMany } from "../utils/notify.js";

// @desc    Submit an exhibitor application for an expo with optional documents
// @route   POST /api/applications
export const createApplication = async (req, res) => {
  try {
    const { expo, companyName, products } = req.body;

    if (!expo || !companyName) {
      return res.status(400).json({ message: "Please provide expo ID and companyName" });
    }

    // Block duplicates (same exhibitor + same expo)
    const existingApp = await Application.findOne({
      expo,
      exhibitor: req.user._id
    });

    if (existingApp) {
      return res.status(400).json({ message: "You have already applied for this expo" });
    }

    // Extract file paths if uploaded
    const documents = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : [];

    const application = await Application.create({
      expo,
      exhibitor: req.user._id,
      companyName,
      products,
      documents,
      status: "pending"
    });

    // Notify all admins
    const admins = await User.find({ role: "admin" }).select("_id");
    const adminIds = admins.map((a) => a._id);
    if (adminIds.length > 0) {
      await notifyMany(
        adminIds,
        `New application from ${companyName}`,
        "/admin/applications"
      );
    }

    return res.status(201).json(application);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get applications for logged-in exhibitor
// @route   GET /api/applications/my
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ exhibitor: req.user._id })
      .populate("expo", "title startDate endDate location theme")
      .populate("booth", "boothNumber size price status")
      .sort({ createdAt: -1 });

    return res.status(200).json(applications);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get all applications (admin) with optional status & expo filters
// @route   GET /api/applications
export const getAllApplications = async (req, res) => {
  try {
    const { status, expo } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (expo) filter.expo = expo;

    const applications = await Application.find(filter)
      .populate("exhibitor", "name email company phone")
      .populate("expo", "title startDate endDate location")
      .populate("booth", "boothNumber size price")
      .sort({ createdAt: -1 });

    return res.status(200).json(applications);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status (approved or rejected)
// @route   PUT /api/applications/:id/status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be 'approved' or 'rejected'" });
    }

    const application = await Application.findById(req.params.id).populate("expo", "title");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;

    // If rejected and a booth was assigned, release that booth
    if (status === "rejected" && application.booth) {
      const booth = await Booth.findById(application.booth);
      if (booth) {
        booth.exhibitor = null;
        booth.status = "available";
        await booth.save();
      }
      application.booth = null;
    }

    await application.save();

    const expoTitle = application.expo?.title || "the expo";
    await createNotification(
      application.exhibitor,
      `Your application for ${expoTitle} was ${status}.`,
      "/exhibitor/applications"
    );

    return res.status(200).json({ message: `Application ${status} successfully`, application });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
