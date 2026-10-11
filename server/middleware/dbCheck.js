import mongoose from "mongoose";

const dbCheck = (req, res, next) => {
  if (req.path === "/health" || mongoose.connection.readyState === 1) {
    return next();
  }

  return res.status(503).json({
    message: "Database is unavailable. Please try again shortly."
  });
};

export default dbCheck;
