import path from "path";
import http from "http";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

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

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// 1. Security Headers via Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allows static /uploads to be loaded by the client
  })
);

// 2. Strict CORS Whitelist
const clientOrigin = process.env.CLIENT_URL || "http://localhost:5173";
app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  })
);

app.use(express.json());

// 3. Static Uploads
app.use("/uploads", express.static(path.resolve("uploads")));

// 4. Rate Limiting for Sensitive Auth Routes (Brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many authentication attempts. Please try again after 15 minutes." },
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.use("/api", dbCheck);

// Apply rate limiting specifically to authentication endpoints
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/forgot-password", authLimiter);

// Mounted Routes
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
app.use("/api/public", publicRoutes);

app.use("/api", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack || err);

  if (res.headersSent) {
    return next(err);
  }

  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid id" });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message || "Validation failed" });
  }

  const status = err.status || (err.statusCode ? err.statusCode : 500);
  const message = status >= 500 ? "Something went wrong" : (err.message || "Something went wrong");

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