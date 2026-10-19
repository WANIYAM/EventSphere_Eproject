import User from "../models/User.js";
import Application from "../models/Application.js";
import Booth from "../models/Booth.js";

// Helper to escape user input before regex construction (prevents ReDoS)
const escapeRegex = (string) => {
  if (typeof string !== "string") return "";
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// @desc    Get exhibitors with approved applications (with ReDoS-safe search)
// @route   GET /api/exhibitors
export const getExhibitors = async (req, res) => {
  try {
    const { search, category, expo } = req.query;

    const appFilter = { status: "approved" };
    if (expo && typeof expo === "string") {
      appFilter.expo = expo;
    }

    const approvedApps = await Application.find(appFilter)
      .populate("exhibitor", "name company description website category logo")
      .populate("expo", "title startDate endDate location")
      .populate("booth", "boothNumber size price status");

    const exhibitorMap = new Map();

    approvedApps.forEach((app) => {
      const exhibitorId = app.exhibitor?._id?.toString() || app._id.toString();
      const existing = exhibitorMap.get(exhibitorId);

      const expoEntry = app.expo
        ? {
            _id: app.expo._id,
            title: app.expo.title,
            startDate: app.expo.startDate,
            endDate: app.expo.endDate,
            location: app.expo.location,
            boothNumber: app.booth?.boothNumber || null,
          }
        : null;

      if (!existing) {
        exhibitorMap.set(exhibitorId, {
          _id: exhibitorId,
          name: app.exhibitor?.name || "Representative",
          company: app.companyName || app.exhibitor?.company || app.exhibitor?.name || "Exhibitor",
          description: app.exhibitor?.description || app.products || "Verified trade show exhibitor.",
          category: app.exhibitor?.category || "General",
          website: app.exhibitor?.website || null,
          logo: app.exhibitor?.logo || null,
          products: app.products || "",
          boothNumber: app.booth?.boothNumber || null,
          expos: expoEntry ? [expoEntry] : [],
        });
      } else if (expoEntry) {
        existing.expos.push(expoEntry);
        if (!existing.boothNumber && expoEntry.boothNumber) {
          existing.boothNumber = expoEntry.boothNumber;
        }
      }
    });

    let exhibitors = Array.from(exhibitorMap.values());

    // ReDoS-safe category filter
    if (category && typeof category === "string" && category !== "all") {
      const safeCat = escapeRegex(category.trim()).toLowerCase();
      exhibitors = exhibitors.filter(
        (ex) => (ex.category || "").toLowerCase() === safeCat
      );
    }

    // ReDoS-safe text search filter
    if (search && typeof search === "string" && search.trim()) {
      const safeSearch = escapeRegex(search.trim()).toLowerCase();
      exhibitors = exhibitors.filter((ex) => {
        const company = (ex.company || "").toLowerCase();
        const desc = (ex.description || "").toLowerCase();
        const products = (ex.products || "").toLowerCase();
        const cat = (ex.category || "").toLowerCase();
        const booth = (ex.boothNumber || "").toLowerCase();
        return (
          company.includes(safeSearch) ||
          desc.includes(safeSearch) ||
          products.includes(safeSearch) ||
          cat.includes(safeSearch) ||
          booth.includes(safeSearch)
        );
      });
    }

    return res.status(200).json(exhibitors);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get all distinct categories from approved exhibitors
// @route   GET /api/exhibitors/categories
export const getCategories = async (req, res) => {
  try {
    const approvedApps = await Application.find({ status: "approved" }).populate("exhibitor", "category");
    const categorySet = new Set();

    approvedApps.forEach((app) => {
      if (app.exhibitor?.category) {
        categorySet.add(app.exhibitor.category.trim());
      }
    });

    return res.status(200).json(Array.from(categorySet).sort());
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get single exhibitor profile with expo history
// @route   GET /api/exhibitors/:id
export const getExhibitor = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("name company description website category logo");
    const applications = await Application.find({ exhibitor: id, status: "approved" })
      .populate("expo", "title startDate endDate location theme description")
      .populate("booth", "boothNumber size price status");

    if (!user && applications.length === 0) {
      return res.status(404).json({ message: "Exhibitor not found" });
    }

    const expos = applications.map((app) => ({
      expo: app.expo,
      booth: app.booth,
      products: app.products,
      boothNumber: app.booth?.boothNumber || null,
      companyName: app.companyName,
    }));

    const profile = {
      _id: user?._id || id,
      name: user?.name || applications[0]?.companyName || "Exhibitor",
      company: user?.company || applications[0]?.companyName || user?.name || "Company",
      description: user?.description || applications[0]?.products || "Exhibitor profile",
      website: user?.website || null,
      category: user?.category || "General",
      logo: user?.logo || null,
      products: applications.map((a) => a.products).filter(Boolean).join(", "),
      expos,
    };

    return res.status(200).json(profile);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};