import path from "path";
import http from "http";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
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

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// Connect to MongoDB & start background timers
connectDB().then(() => {
  startReminders();
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploads folder statically
app.use("/uploads", express.static(path.resolve("uploads")));

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

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});