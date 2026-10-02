import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eventsphere";

const dropOldIndexes = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    
    const collection = mongoose.connection.db.collection("registrations");
    const indexes = await collection.indexes();
    console.log("Current indexes:", indexes);

    // Common names for compound unique indexes created previously
    for (const index of indexes) {
      if (index.name !== "_id_") {
        console.log(`Dropping index: ${index.name}`);
        try {
          await collection.dropIndex(index.name);
          console.log(`Successfully dropped ${index.name}`);
        } catch (err) {
          console.warn(`Could not drop ${index.name}: ${err.message}`);
        }
      }
    }

    console.log("Index cleanup completed. Re-syncing Mongoose indexes...");
    // Import schema model to trigger index build
    await import("../models/Registration.js");
    await mongoose.model("Registration").syncIndexes();
    console.log("New partial indexes created successfully.");

    process.exit(0);
  } catch (error) {
    console.error("Error dropping indexes:", error);
    process.exit(1);
  }
};

dropOldIndexes();
