import mongoose from "mongoose";

const retryIntervalMs = 10_000;
const serverSelectionTimeoutMS = 10_000;

const getConnectionHint = (error) => {
  const message = [error?.message, error?.cause?.message]
    .filter(Boolean)
    .join(" ");
  const code = error?.code ?? error?.cause?.code;

  if (/bad auth|authentication failed/i.test(message) || code === 18 || code === 8000) {
    return "Check the database username and password in MONGO_URI.";
  }

  if (
    code === "ENOTFOUND" ||
    /ENOTFOUND|MongoParseError|Invalid connection string|Invalid scheme/i.test(message)
  ) {
    return "Check the MongoDB cluster address and connection string in MONGO_URI.";
  }

  if (
    /Could not connect to any servers|ReplicaSetNoPrimary|timed?\s*out|timeout/i.test(message) ||
    ["ETIMEDOUT", "ECONNREFUSED", "ENETUNREACH"].includes(code)
  ) {
    return "The current IP may not be allowed in Atlas Network Access, the cluster may be paused, or there may be no internet connection.";
  }

  return "Check MONGO_URI and the MongoDB Atlas connection settings.";
};

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB connection dropped. Mongoose will attempt to reconnect.");
});

mongoose.connection.on("reconnected", () => {
  console.log(`MongoDB reconnected: ${mongoose.connection.host}`);
});

mongoose.connection.on("error", (error) => {
  console.error(`MongoDB connection error: ${error.message}`);
});

const connectDB = async () => {
  let attempt = 0;

  while (mongoose.connection.readyState !== 1) {
    attempt += 1;
    console.log(`MongoDB connection attempt ${attempt}...`);

    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS
      });
      console.log(`MongoDB connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(
        `MongoDB connection failed: ${error.message}. ${getConnectionHint(error)} Retrying in 10 seconds.`
      );
      await new Promise((resolve) => setTimeout(resolve, retryIntervalMs));
    }
  }

  return mongoose.connection;
};

export default connectDB;