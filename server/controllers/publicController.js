import Expo from "../models/Expo.js";
import Session from "../models/Session.js";
import Booth from "../models/Booth.js";
import Application from "../models/Application.js";
import User from "../models/User.js";

export const getLandingData = async (req, res) => {
  try {
    // 1. Live Stats Count
    const [totalExpos, totalExhibitors, totalSessions, totalAttendees, totalBooths, bookedBooths] =
      await Promise.all([
        Expo.countDocuments(),
        User.countDocuments({ role: "exhibitor" }),
        Session.countDocuments(),
        User.countDocuments({ role: "attendee" }),
        Booth.countDocuments(),
        Booth.countDocuments({ status: "booked" }),
      ]);

    // 2. All Expos for the dropdown & cards
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

    // 3. Approved Exhibitors across all expos
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
      expoTitle: app.expo?.title || "Expo 2025",
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