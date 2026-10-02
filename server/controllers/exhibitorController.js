import User from "../models/User.js";
import Application from "../models/Application.js";
import Booth from "../models/Booth.js";

// @desc    List exhibitors with approved applications
// @route   GET /api/exhibitors
export const getExhibitors = async (req, res) => {
  try {
    const { expo, category, search } = req.query;

    // Find approved applications, optionally filtered by expo
    const appFilter = { status: "approved" };
    if (expo) appFilter.expo = expo;

    const approvedApps = await Application.find(appFilter)
      .populate("booth", "boothNumber")
      .populate("expo", "title");

    // Group applications by exhibitor
    const exhibitorMap = {};
    approvedApps.forEach((app) => {
      const eid = app.exhibitor.toString();
      if (!exhibitorMap[eid]) exhibitorMap[eid] = [];
      exhibitorMap[eid].push(app);
    });

    const exhibitorIds = Object.keys(exhibitorMap);
    if (exhibitorIds.length === 0) return res.json([]);

    // Build user query
    const userFilter = { _id: { $in: exhibitorIds } };
    if (category) {
      userFilter.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    const users = await User.find(userFilter).select(
      "name company description category website logo"
    );

    let results = users.map((u) => {
      const apps = exhibitorMap[u._id.toString()];
      return {
        _id: u._id,
        name: u.name,
        company: u.company,
        description: u.description,
        category: u.category,
        website: u.website,
        logo: u.logo,
        booths: apps.map((a) => a.booth?.boothNumber).filter(Boolean),
        products: apps.map((a) => a.products).filter(Boolean).join(", ")
      };
    });

    // Text search filter
    if (search) {
      const re = new RegExp(search, "i");
      results = results.filter(
        (r) =>
          re.test(r.company) ||
          re.test(r.name) ||
          re.test(r.description) ||
          re.test(r.products)
      );
    }

    return res.json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Distinct non-empty categories
// @route   GET /api/exhibitors/categories
export const getCategories = async (req, res) => {
  try {
    // Get exhibitor IDs that have approved apps
    const approvedApps = await Application.find({ status: "approved" }).distinct("exhibitor");
    const categories = await User.distinct("category", {
      _id: { $in: approvedApps },
      category: { $ne: null, $ne: "" }
    });
    return res.json(categories.filter(Boolean));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Single exhibitor public profile
// @route   GET /api/exhibitors/:id
export const getExhibitor = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "name company description category website logo"
    );
    if (!user) return res.status(404).json({ message: "Exhibitor not found" });

    // Get approved applications with expo and booth info
    const apps = await Application.find({
      exhibitor: req.params.id,
      status: "approved"
    })
      .populate("expo", "title startDate endDate location")
      .populate("booth", "boothNumber");

    const expos = apps.map((a) => ({
      expo: a.expo,
      boothNumber: a.booth?.boothNumber || "TBA",
      products: a.products
    }));

    return res.json({
      _id: user._id,
      name: user.name,
      company: user.company,
      description: user.description,
      category: user.category,
      website: user.website,
      logo: user.logo,
      expos
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
