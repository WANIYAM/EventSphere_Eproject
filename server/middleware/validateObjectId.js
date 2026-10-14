import mongoose from "mongoose";

// Middleware validating route parameters against standard MongoDB ObjectId format
const validateObjectId = (paramOrReq, res, next) => {
  // If used directly as router middleware: router.get("/:id", validateObjectId, handler)
  if (typeof next === "function") {
    const req = paramOrReq;
    for (const param of Object.keys(req.params)) {
      if (param === "id" || param.toLowerCase().endsWith("id")) {
        if (!mongoose.Types.ObjectId.isValid(req.params[param])) {
          return res.status(400).json({ message: "Invalid id" });
        }
      }
    }
    return next();
  }

  // If invoked with a specific parameter name: validateObjectId("expoId")
  const paramName = typeof paramOrReq === "string" ? paramOrReq : "id";
  return (req, res, next) => {
    const id = req.params[paramName];
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    next();
  };
};

export default validateObjectId;