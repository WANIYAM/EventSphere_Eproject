import Notification from "../models/Notification.js";
import { emitToUser } from "./socket.js";

export const createNotification = async (userId, message, link = "") => {
  try {
    const notif = await Notification.create({
      user: userId,
      message,
      link
    });

    emitToUser(userId, "notification", notif);
    return notif;
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

export const notifyMany = async (userIds, message, link = "") => {
  try {
    if (!userIds || userIds.length === 0) return;
    const uniqueIds = [...new Set(userIds.map((id) => id.toString()))];

    const docs = uniqueIds.map((uId) => ({
      user: uId,
      message,
      link
    }));

    const created = await Notification.insertMany(docs);
    created.forEach((notif) => {
      emitToUser(notif.user.toString(), "notification", notif);
    });
  } catch (error) {
    console.error("Error creating bulk notifications:", error);
  }
};
