import path from "path";
import http from "http";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import dbCheck from "./middleware/dbCheck.js";
import { initSocket } from "./utils/socket.js";
import { startReminders } from "./utils/reminders.js";

import authRoutes from "./routes/authRoutes.js";
import expoRoutes from "./routes/expoRoutes.js";
import boothRoutes from "./routes/boothRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import exhibitorRoutes from "./routes/exhibitorRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploads folder statically
app.use("/uploads", express.static(path.resolve("uploads")));

// Health check remains available while the database is unavailable.
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

app.use("/api", dbCheck);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/expos", expoRoutes);
app.use("/api/booths", boothRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/exhibitors", exhibitorRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/analytics", analyticsRoutes);
// Add this line in the Routes section (around line 55):
app.use("/api/public", publicRoutes);
app.use("/api", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack || err);

  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === "production" && status >= 500
      ? "Something went wrong on the server."
      : err.message || "Internal server error";

  return res.status(status).json({ message });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

let remindersStarted = false;
connectDB()
  .then(() => {
    if (!remindersStarted) {
      startReminders();
      remindersStarted = true;
    }
  })
  .catch((error) => {
    console.error("MongoDB connection retry loop stopped unexpectedly:", error);
  });