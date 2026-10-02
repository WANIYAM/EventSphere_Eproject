import User from "../models/User.js";
import Expo from "../models/Expo.js";
import Session from "../models/Session.js";
import Application from "../models/Application.js";
import Feedback from "../models/Feedback.js";
import Booth from "../models/Booth.js";
import Registration from "../models/Registration.js";

export const getAdminAnalytics = async (req, res) => {
  try {
    // Totals
    const usersCount = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: "admin" });
    const exhibitorCount = await User.countDocuments({ role: "exhibitor" });
    const attendeeCount = await User.countDocuments({ role: "attendee" });

    const exposCount = await Expo.countDocuments();
    const sessionsCount = await Session.countDocuments();
    const applicationsCount = await Application.countDocuments();
    const feedbackCount = await Feedback.countDocuments();

    // Booths by status
    const availableBooths = await Booth.countDocuments({ status: "available" });
    const reservedBooths = await Booth.countDocuments({ status: "reserved" });
    const bookedBooths = await Booth.countDocuments({ status: "booked" });

    // Applications by status
    const pendingApps = await Application.countDocuments({ status: "pending" });
    const approvedApps = await Application.countDocuments({ status: "approved" });
    const rejectedApps = await Application.countDocuments({ status: "rejected" });

    // Feedback by type
    const suggestionFeedback = await Feedback.countDocuments({ type: "suggestion" });
    const issueFeedback = await Feedback.countDocuments({ type: "issue" });

    // Registrations per Expo (type "expo")
    const expos = await Expo.find().select("title");
    const registrationsPerExpo = await Promise.all(
      expos.map(async (expo) => {
        const count = await Registration.countDocuments({ expo: expo._id, type: "expo" });
        return { expoTitle: expo.title, count };
      })
    );

    // Top 5 Sessions by registrations
    const topSessionsAgg = await Registration.aggregate([
      { $match: { type: "session", registered: true } },
      { $group: { _id: "$session", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const topSessions = await Promise.all(
      topSessionsAgg.map(async (item) => {
        const sessionDoc = await Session.findById(item._id).select("title");
        return {
          title: sessionDoc ? sessionDoc.title : "Unknown Session",
          count: item.count
        };
      })
    );

    // Occupancy per Expo (taken = reserved + booked)
    const occupancyPerExpo = await Promise.all(
      expos.map(async (expo) => {
        const total = await Booth.countDocuments({ expo: expo._id });
        const taken = await Booth.countDocuments({
          expo: expo._id,
          status: { $in: ["reserved", "booked"] }
        });
        const percent = total > 0 ? Math.round((taken / total) * 100) : 0;
        return { expoTitle: expo.title, total, taken, percent };
      })
    );

    res.status(200).json({
      totals: {
        users: usersCount,
        admins: adminCount,
        exhibitors: exhibitorCount,
        attendees: attendeeCount,
        expos: exposCount,
        sessions: sessionsCount,
        applications: applicationsCount,
        feedback: feedbackCount
      },
      boothsByStatus: [
        { name: "Available", count: availableBooths },
        { name: "Reserved", count: reservedBooths },
        { name: "Booked", count: bookedBooths }
      ],
      applicationsByStatus: [
        { name: "Pending", value: pendingApps },
        { name: "Approved", value: approvedApps },
        { name: "Rejected", value: rejectedApps }
      ],
      registrationsPerExpo,
      topSessions,
      occupancyPerExpo,
      feedbackByType: [
        { type: "Suggestion", count: suggestionFeedback },
        { type: "Issue", count: issueFeedback }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
