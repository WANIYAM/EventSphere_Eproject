import Notification from "../models/Notification.js";

export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user.id,
      read: false
    });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching unread count" });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { read: true }
    );
    res.status(200).json({ message: "All marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Error updating notifications" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notif = await Notification.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    if (!notif) {
      return res.status(404).json({ message: "Notification not found" });
    }
    notif.read = true;
    await notif.save();
    res.status(200).json(notif);
  } catch (error) {
    res.status(500).json({ message: "Error updating notification" });
  }
};
