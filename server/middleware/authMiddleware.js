import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect routes with JWT token verification
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    let decoded;
    try {
      token = req.headers.authorization.split(" ")[1];
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }

    try {
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

    } catch (error) {
      return next(error);
    }

    return next();
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Middleware to authorize specific user roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Role '${req.user?.role}' is not authorized.`
      });
    }
    next();
  };
};
