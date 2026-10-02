import Registration from "../models/Registration.js";
import Session from "../models/Session.js";

// @desc    Register for an expo
// @route   POST /api/registrations
export const registerForExpo = async (req, res) => {
  try {
    const { expo } = req.body;
    if (!expo) return res.status(400).json({ message: "Please provide expo" });

    // Block duplicates
    const exists = await Registration.findOne({
      user: req.user._id, expo, type: "expo"
    });
    if (exists) return res.status(400).json({ message: "Already registered for this expo" });

    const reg = await Registration.create({
      user: req.user._id, expo, type: "expo", registered: true
    });
    return res.status(201).json(reg);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Register for a session (auto-register expo too)
// @route   POST /api/registrations/session
export const registerForSession = async (req, res) => {
  try {
    const { session } = req.body;
    if (!session) return res.status(400).json({ message: "Please provide session" });

    const sess = await Session.findById(session);
    if (!sess) return res.status(404).json({ message: "Session not found" });

    // Auto-create expo registration if missing
    const expoReg = await Registration.findOne({
      user: req.user._id, expo: sess.expo, type: "expo"
    });
    if (!expoReg) {
      await Registration.create({
        user: req.user._id, expo: sess.expo, type: "expo", registered: true
      });
    }

    // If bookmark-only doc exists, set registered true
    const existing = await Registration.findOne({
      user: req.user._id, session, type: "session"
    });
    if (existing) {
      if (existing.registered) {
        return res.status(400).json({ message: "Already registered for this session" });
      }
      existing.registered = true;
      await existing.save();
      return res.json(existing);
    }

    const reg = await Registration.create({
      user: req.user._id, expo: sess.expo, session, type: "session", registered: true
    });
    return res.status(201).json(reg);
  } catch (error) {
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

    const existing = await Registration.findOne({
      user: req.user._id, session, type: "session"
    });

    if (existing) {
      // Toggle bookmark
      existing.bookmarked = !existing.bookmarked;
      // If not registered and no longer bookmarked, remove doc
      if (!existing.registered && !existing.bookmarked) {
        await existing.deleteOne();
        return res.json({ message: "Bookmark removed", bookmarked: false });
      }
      await existing.save();
      return res.json(existing);
    }

    // Create bookmark-only doc
    const reg = await Registration.create({
      user: req.user._id, expo: sess.expo, session, type: "session",
      registered: false, bookmarked: true
    });
    return res.status(201).json(reg);
  } catch (error) {
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
      // If bookmarked, keep doc with registered false
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
      user: req.user._id, expo: reg.expo, type: "session"
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
