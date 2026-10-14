import Expo from "../models/Expo.js";
import Session from "../models/Session.js";
import Booth from "../models/Booth.js";
import Application from "../models/Application.js";
import User from "../models/User.js";

// @desc    Existing landing data (stats, featured expo, all expos, sessions, booths, exhibitors)
// @route   GET /api/public/landing-data
export const getLandingData = async (req, res) => {
  try {
    const [totalExpos, totalExhibitors, totalSessions, totalAttendees, totalBooths, bookedBooths] =
      await Promise.all([
        Expo.countDocuments(),
        User.countDocuments({ role: "exhibitor" }),
        Session.countDocuments(),
        User.countDocuments({ role: "attendee" }),
        Booth.countDocuments(),
        Booth.countDocuments({ status: "booked" }),
      ]);

    const allExpos = await Expo.find().sort({ startDate: 1 });
    const featuredExpo = allExpos[0] || null;

    let sessions = [];
    let booths = [];
    let approvedExhibitors = [];

    if (featuredExpo) {
      sessions = await Session.find({ expo: featuredExpo._id }).sort({ startTime: 1 });
      booths = await Booth.find({ expo: featuredExpo._id })
        .populate("exhibitor", "name company category logo")
        .sort({ boothNumber: 1 });
    }

    const approvedApps = await Application.find({ status: "approved" })
      .populate("exhibitor", "name company description website category logo")
      .populate("expo", "title")
      .populate("booth", "boothNumber price size");

    approvedExhibitors = approvedApps.map((app) => ({
      _id: app.exhibitor?._id || app._id,
      name: app.exhibitor?.name || "Exhibitor",
      company: app.companyName || app.exhibitor?.company || "Partner Brand",
      description: app.exhibitor?.description || app.products || "Verified trade show exhibitor.",
      category: app.exhibitor?.category || "Technology",
      logo: app.exhibitor?.logo || null,
      expoTitle: app.expo?.title || "Expo",
      boothNumber: app.booth?.boothNumber || "A1",
    }));

    res.status(200).json({
      stats: {
        totalExpos,
        totalExhibitors,
        totalSessions,
        totalAttendees,
        totalBooths,
        bookedBooths,
        occupancyRate: totalBooths > 0 ? Math.round((bookedBooths / totalBooths) * 100) : 0,
      },
      allExpos,
      featuredExpo,
      sessions,
      booths,
      approvedExhibitors,
    });
  } catch (error) {
    console.error("Error fetching landing data:", error);
    res.status(500).json({ message: "Failed to fetch live landing data" });
  }
};

// @desc    Get all public expos
// @route   GET /api/public/expos
export const getPublicExpos = async (req, res) => {
  try {
    const expos = await Expo.find().sort({ startDate: 1 });
    return res.status(200).json(expos);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get single expo with sessions, floorplan booths, and approved exhibitors (no emails/phones)
// @route   GET /api/public/expos/:id
export const getPublicExpoById = async (req, res) => {
  try {
    const { id } = req.params;

    const expo = await Expo.findById(id).select("-__v");
    if (!expo) {
      return res.status(404).json({ message: "Expo not found" });
    }

    // 1. Sessions sorted by start time
    const sessions = await Session.find({ expo: id }).sort({ startTime: 1 });

    // 2. Floorplan booths (exclude sensitive personal info)
    const booths = await Booth.find({ expo: id })
      .populate("exhibitor", "name company category logo")
      .sort({ boothNumber: 1 });

    // 3. Approved applications for this expo
    const applications = await Application.find({ expo: id, status: "approved" })
      .populate("exhibitor", "name company description website category logo")
      .populate("booth", "boothNumber size price status");

    const exhibitorMap = new Map();

    // Collect from approved applications
    applications.forEach((app) => {
      const exhibitorId = app.exhibitor?._id?.toString() || app._id.toString();
      exhibitorMap.set(exhibitorId, {
        _id: exhibitorId,
        id: exhibitorId,
        name: app.exhibitor?.name || "Representative",
        company: app.companyName || app.exhibitor?.company || app.exhibitor?.name || "Exhibitor",
        description: app.exhibitor?.description || app.products || "Verified trade show exhibitor.",
        category: app.exhibitor?.category || "General",
        website: app.exhibitor?.website || null,
        logo: app.exhibitor?.logo || null,
        products: app.products || "",
        boothNumber: app.booth?.boothNumber || null,
        boothSize: app.booth?.size || null,
      });
    });

    // Also include any assigned booth whose exhibitor may not have an explicit application doc
    booths.forEach((booth) => {
      if (booth.exhibitor) {
        const exhibitorId = booth.exhibitor._id?.toString();
        if (exhibitorId && !exhibitorMap.has(exhibitorId)) {
          exhibitorMap.set(exhibitorId, {
            _id: exhibitorId,
            id: exhibitorId,
            name: booth.exhibitor.name || "Representative",
            company: booth.exhibitor.company || booth.exhibitor.name,
            description: booth.details || "Showcasing products and services.",
            category: booth.exhibitor.category || "General",
            logo: booth.exhibitor.logo || null,
            products: booth.details || "",
            boothNumber: booth.boothNumber,
            boothSize: booth.size,
          });
        } else if (exhibitorId && exhibitorMap.has(exhibitorId)) {
          const item = exhibitorMap.get(exhibitorId);
          item.boothNumber = booth.boothNumber;
          item.boothSize = booth.size;
        }
      }
    });

    const exhibitors = Array.from(exhibitorMap.values());

    return res.status(200).json({
      expo,
      sessions,
      booths,
      exhibitors,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get all approved exhibitors with optional ?search= and ?category=
// @route   GET /api/public/exhibitors
export const getPublicExhibitors = async (req, res) => {
  try {
    const { search, category } = req.query;

    const approvedApps = await Application.find({ status: "approved" })
      .populate("exhibitor", "name company description website category logo")
      .populate("expo", "title startDate endDate location theme")
      .populate("booth", "boothNumber price size status");

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
          category: app.exhibitor?.category || "Technology",
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

    // Apply category filter
    if (category && category !== "all") {
      const catLower = category.toLowerCase();
      exhibitors = exhibitors.filter(
        (ex) => (ex.category || "").toLowerCase() === catLower
      );
    }

    // Apply search filter
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      exhibitors = exhibitors.filter((ex) => {
        const company = (ex.company || "").toLowerCase();
        const desc = (ex.description || "").toLowerCase();
        const products = (ex.products || "").toLowerCase();
        const cat = (ex.category || "").toLowerCase();
        const booth = (ex.boothNumber || "").toLowerCase();
        return (
          company.includes(q) ||
          desc.includes(q) ||
          products.includes(q) ||
          cat.includes(q) ||
          booth.includes(q)
        );
      });
    }

    return res.status(200).json(exhibitors);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get single exhibitor profile by User ID (public, sanitized)
// @route   GET /api/public/exhibitors/:id
export const getPublicExhibitorById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Fetch user profile
    const user = await User.findById(id).select(
      "name company description website category logo"
    );

    // 2. Fetch approved applications for this exhibitor
    const applications = await Application.find({
      exhibitor: id,
      status: "approved",
    })
      .populate("expo", "title startDate endDate location theme description")
      .populate("booth", "boothNumber size price status");

    if (!user && applications.length === 0) {
      return res.status(404).json({ message: "Exhibitor not found" });
    }

    const expos = applications.map((app) => ({
      expo: app.expo,
      booth: app.booth,
      products: app.products,
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

// @desc    Get featured exhibitors for landing/directory showcase
// @route   GET /api/public/featured-exhibitors
export const getFeaturedExhibitors = async (req, res) => {
  try {
    const approvedApps = await Application.find({ status: "approved" })
      .populate("exhibitor", "name company description website category logo")
      .populate("expo", "title")
      .populate("booth", "boothNumber")
      .limit(12);

    const seen = new Set();
    const featured = [];

    approvedApps.forEach((app) => {
      const exId = app.exhibitor?._id?.toString() || app._id.toString();
      if (!seen.has(exId)) {
        seen.add(exId);
        featured.push({
          _id: exId,
          name: app.exhibitor?.name || "Representative",
          company: app.companyName || app.exhibitor?.company || "Exhibitor",
          description: app.exhibitor?.description || app.products || "Featured Trade Show Partner",
          category: app.exhibitor?.category || "Technology",
          logo: app.exhibitor?.logo || null,
          expoTitle: app.expo?.title || "Expo",
          boothNumber: app.booth?.boothNumber || null,
        });
      }
    });

    return res.status(200).json(featured);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get public system stats
// @route   GET /api/public/stats
export const getPublicStats = async (req, res) => {
  try {
    const [totalExpos, totalExhibitors, totalSessions, totalAttendees, totalBooths, bookedBooths] =
      await Promise.all([
        Expo.countDocuments(),
        User.countDocuments({ role: "exhibitor" }),
        Session.countDocuments(),
        User.countDocuments({ role: "attendee" }),
        Booth.countDocuments(),
        Booth.countDocuments({ status: "booked" }),
      ]);

    return res.status(200).json({
      totalExpos,
      totalExhibitors,
      totalSessions,
      totalAttendees,
      totalBooths,
      bookedBooths,
      occupancyRate: totalBooths > 0 ? Math.round((bookedBooths / totalBooths) * 100) : 0,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};