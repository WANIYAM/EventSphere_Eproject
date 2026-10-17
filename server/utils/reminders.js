import Session from "../models/Session.js";
import Registration from "../models/Registration.js";
import { notifyMany } from "./notify.js";

export const startReminders = () => {
  setInterval(async () => {
    try {
      const now = new Date();
      const thirtyMinsLater = new Date(now.getTime() + 30 * 60 * 1000);

      // Find sessions starting within 30 minutes where reminder hasn't been sent
      const upcomingSessions = await Session.find({
        startTime: { $gte: now, $lte: thirtyMinsLater },
        reminderSent: false
      });

      for (const session of upcomingSessions) {
        // Find both registered and bookmarked attendees for this session
        const registrations = await Registration.find({
          session: session._id,
          $or: [{ registered: true }, { bookmarked: true }]
        }).select("user");

        const userIds = registrations.map((r) => r.user);

        if (userIds.length > 0) {
          const timeStr = new Date(session.startTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          });
          const message = `Reminder: "${session.title}" starts at ${timeStr} in ${session.location || "TBA"}`;
          await notifyMany(userIds, message, `/expos/${session.expo}?tab=schedule`);
        }

        session.reminderSent = true;
        await session.save();
      }
    } catch (error) {
      console.error("Error running session reminders:", error);
    }
  }, 60000);
};