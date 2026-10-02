import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for admin seeding...");

    const adminEmail = "admin@eventsphere.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`Admin user already exists (${adminEmail}). Skipping seed.`);
    } else {
      await User.create({
        name: "Admin",
        email: adminEmail,
        password: "Admin@123",
        role: "admin"
      });
      console.log(`[Admin Seed Created Successfully]: Email: ${adminEmail}, Password: Admin@123`);
    }

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error.message);
    process.exit(1);
  }
};

createAdmin();
