import Registration from "../models/Registration.js";
import Session from "../models/Session.js";
import Expo from "../models/Expo.js";

// @desc    Register for an expo
// @route   POST /api/registrations
export const registerForExpo = async (req, res) => {
  try {
    const { expo } = req.body;
    if (!expo) return res.status(400).json({ message: "Please provide expo" });

    const expoDoc = await Expo.findById(expo);
    if (!expoDoc) return res.status(404).json({ message: "Expo not found" });

    // Reject registration if expo has already ended
    if (expoDoc.endDate && new Date(expoDoc.endDate) < new Date()) {
      return res.status(400).json({ message: "This expo has already ended" });
    }

    // Pre-check for duplicate registration
    const exists = await Registration.findOne({
      user: req.user._id,
      expo,
      type: "expo"
    });
    if (exists) {
      return res.status(409).json({ message: "Already registered" });
    }

    const reg = await Registration.create({
      user: req.user._id,
      expo,
      type: "expo",
      registered: true
    });
    return res.status(201).json(reg);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Already registered" });
    }
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Register for a session (auto-register expo too, with overlap warning)
// @route   POST /api/registrations/session
export const registerForSession = async (req, res) => {
  try {
    const { session } = req.body;
    if (!session) return res.status(400).json({ message: "Please provide session" });

    const sess = await Session.findById(session);
    if (!sess) return res.status(404).json({ message: "Session not found" });

    // Reject registration if session has already ended
    if (sess.endTime && new Date(sess.endTime) < new Date()) {
      return res.status(400).json({ message: "This session has already ended" });
    }

    // Auto-create expo registration if missing
    try {
      const expoReg = await Registration.findOne({
        user: req.user._id,
        expo: sess.expo,
        type: "expo"
      });
      if (!expoReg) {
        await Registration.create({
          user: req.user._id,
          expo: sess.expo,
          type: "expo",
          registered: true
        });
      }
    } catch (expoErr) {
      if (expoErr.code !== 11000) {
        console.error("Error creating parent expo registration:", expoErr);
      }
    }

    // Check for overlapping active sessions for this user (non-blocking)
    let warning;
    if (sess.startTime && sess.endTime) {
      const userActiveSessions = await Registration.find({
        user: req.user._id,
        type: "session",
        registered: true,
        session: { $ne: sess._id }
      }).populate("session", "title startTime endTime");

      const newStart = new Date(sess.startTime);
      const newEnd = new Date(sess.endTime);

      for (const r of userActiveSessions) {
        if (r.session && r.session.startTime && r.session.endTime) {
          const existStart = new Date(r.session.startTime);
          const existEnd = new Date(r.session.endTime);

          if (existStart < newEnd && existEnd > newStart) {
            warning = `This session overlaps with ${r.session.title}`;
            break;
          }
        }
      }
    }

    // If bookmark-only doc exists, update registered to true
    const existing = await Registration.findOne({
      user: req.user._id,
      session,
      type: "session"
    });

    if (existing) {
      if (existing.registered) {
        return res.status(409).json({ message: "Already registered" });
      }
      existing.registered = true;
      await existing.save();

      const responseObj = existing.toObject();
      if (warning) responseObj.warning = warning;
      return res.json(responseObj);
    }

    const reg = await Registration.create({
      user: req.user._id,
      expo: sess.expo,
      session,
      type: "session",
      registered: true
    });

    const responseObj = reg.toObject();
    if (warning) responseObj.warning = warning;
    return res.status(201).json(responseObj);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Already registered" });
    }
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle bookmark on a session
// @route   PUT /api/registrations/bookmark
export const toggleBookmark = async (req, res) => {
  try {
    const { session } = req.body;
    if (!session) return res.status(400).json({ message: "Please provide session" });

    const sess = await Session.findById(session);
    if (!sess) return res.status(404).json({ message: "Session not found" });

    // Reject bookmarking if session has already ended
    if (sess.endTime && new Date(sess.endTime) < new Date()) {
      return res.status(400).json({ message: "This session has already ended" });
    }

    const existing = await Registration.findOne({
      user: req.user._id,
      session,
      type: "session"
    });

    if (existing) {
      existing.bookmarked = !existing.bookmarked;
      // If not registered and no longer bookmarked, remove doc
      if (!existing.registered && !existing.bookmarked) {
        await existing.deleteOne();
        return res.json({ message: "Bookmark removed", bookmarked: false });
      }
      await existing.save();
      return res.json(existing);
    }

    const reg = await Registration.create({
      user: req.user._id,
      expo: sess.expo,
      session,
      type: "session",
      registered: false,
      bookmarked: true
    });
    return res.status(201).json(reg);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Already registered" });
    }
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a registration
// @route   DELETE /api/registrations/:id
export const cancelRegistration = async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.id);
    if (!reg) return res.status(404).json({ message: "Registration not found" });
    if (reg.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (reg.type === "session") {
      if (reg.bookmarked) {
        reg.registered = false;
        await reg.save();
        return res.json({ message: "Session registration cancelled, bookmark kept" });
      }
      await reg.deleteOne();
      return res.json({ message: "Session registration cancelled" });
    }

    // Cancelling expo: also remove session registrations for that expo
    await Registration.deleteMany({
      user: req.user._id,
      expo: reg.expo,
      type: "session"
    });
    await reg.deleteOne();
    return res.json({ message: "Expo registration and related session registrations cancelled" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get all user's registrations
// @route   GET /api/registrations/my
export const getMyRegistrations = async (req, res) => {
  try {
    const regs = await Registration.find({ user: req.user._id })
      .populate("expo", "title startDate endDate location")
      .populate("session", "title speaker location startTime endTime")
      .sort({ createdAt: -1 });
    return res.json(regs);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};