import Session from "../models/Session.js";
import Registration from "../models/Registration.js";
import { emitToAll } from "../utils/socket.js";
import { notifyMany } from "../utils/notify.js";

// @desc    Create a session
// @route   POST /api/sessions
export const createSession = async (req, res) => {
  try {
    const { expo, title, speaker, topic, location, startTime, endTime } = req.body;

    if (!expo || !title || !startTime || !endTime) {
      return res.status(400).json({ message: "Please provide expo, title, startTime, and endTime" });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
      return res.status(400).json({ message: "End time must be after start time" });
    }

    // Overlap check for same expo AND same location
    if (location) {
      const overlap = await Session.findOne({
        expo,
        location,
        startTime: { $lt: end },
        endTime: { $gt: start }
      });

      if (overlap) {
        return res.status(400).json({
          message: `Session overlaps with an existing session ('${overlap.title}') at this location.`
        });
      }
    }

    const session = await Session.create({
      expo,
      title,
      speaker,
      topic,
      location,
      startTime: start,
      endTime: end,
      reminderSent: false
    });

    emitToAll("schedule:updated", { expoId: expo });

    return res.status(201).json(session);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update session
// @route   PUT /api/sessions/:id
export const updateSession = async (req, res) => {
  try {
    const { title, speaker, topic, location, startTime, endTime } = req.body;
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const start = startTime ? new Date(startTime) : session.startTime;
    const end = endTime ? new Date(endTime) : session.endTime;

    if (end <= start) {
      return res.status(400).json({ message: "End time must be after start time" });
    }

    const sessionLocation = location !== undefined ? location : session.location;

    // Overlap check
    if (sessionLocation) {
      const overlap = await Session.findOne({
        _id: { $ne: req.params.id },
        expo: session.expo,
        location: sessionLocation,
        startTime: { $lt: end },
        endTime: { $gt: start }
      });

      if (overlap) {
        return res.status(400).json({
          message: `Session overlaps with an existing session ('${overlap.title}') at this location.`
        });
      }
    }

    // Reset reminderSent if startTime changed
    if (startTime && new Date(startTime).getTime() !== new Date(session.startTime).getTime()) {
      session.reminderSent = false;
    }

    session.title = title || session.title;
    session.speaker = speaker !== undefined ? speaker : session.speaker;
    session.topic = topic !== undefined ? topic : session.topic;
    session.location = sessionLocation;
    session.startTime = start;
    session.endTime = end;

    await session.save();

    emitToAll("schedule:updated", { expoId: session.expo });

    // Notify all registered or bookmarked users for this session
    const regs = await Registration.find({ session: session._id }).select("user");
    const userIds = regs.map((r) => r.user);
    if (userIds.length > 0) {
      await notifyMany(
        userIds,
        `Session "${session.title}" was updated`,
        `/expos/${session.expo}?tab=schedule`
      );
    }

    return res.status(200).json(session);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Delete session
// @route   DELETE /api/sessions/:id
export const deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const expoId = session.expo;
    const sessionTitle = session.title;
    const sessionId = session._id;

    // Find registered/bookmarked users for this session or expo registered users
    const sessionRegs = await Registration.find({ session: sessionId }).select("user");
    let userIds = sessionRegs.map((r) => r.user.toString());

    if (userIds.length === 0) {
      const expoRegs = await Registration.find({ expo: expoId, type: "expo" }).select("user");
      userIds = expoRegs.map((r) => r.user.toString());
    }

    await session.deleteOne();

    emitToAll("schedule:updated", { expoId });

    if (userIds.length > 0) {
      await notifyMany(
        userIds,
        `Session "${sessionTitle}" was cancelled`,
        `/expos/${expoId}?tab=schedule`
      );
    }

    return res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get all sessions for a specific expo
// @route   GET /api/expos/:expoId/sessions
export const getSessionsByExpo = async (req, res) => {
  try {
    const sessions = await Session.find({ expo: req.params.expoId }).sort({ startTime: 1 });
    return res.status(200).json(sessions);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get single session by ID
// @route   GET /api/sessions/:id
export const getSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    return res.status(200).json(session);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
