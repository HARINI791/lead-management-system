const express = require("express");
const { body, validationResult, query } = require("express-validator");
const Lead = require("../models/Lead");

const router = express.Router();


const buildFilterQuery = (filters) => {
  let query = {};

  // If no filters, return empty query (matches all)
  if (!filters || Object.keys(filters).length === 0) {
    return {};
  }

  Object.keys(filters).forEach((key) => {
    if (filters[key] !== undefined && filters[key] !== "") {
      switch (key) {
        case "email":
        case "company":
        case "city":
          if (filters[key + "_operator"] === "contains") {
            query[key] = { $regex: filters[key], $options: "i" }; // case-insensitive
          } else {
            query[key] = filters[key];
          }
          break;
        case "score":
        case "lead_value": {
          const num = Number(filters[key]); // ✅ use filters, not query
          if (!Number.isNaN(num)) {
            query[key] = { $gte: num }; // ✅ treat as >=
          }
          break;
        }

        case "age":
          if (filters.age_operator === "gt") {
            query.age = { $gt: parseInt(filters[key]) };
          } else if (filters.age_operator === "lt") {
            query.age = { $lt: parseInt(filters[key]) };
          } else {
            query.age = parseInt(filters[key]);
          }
          break;

        default:
          query[key] = filters[key];
      }
    }
  });

  return query;
};



// ✅ Get leads with pagination + filters
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
  ],
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      // remove page & limit before building filters
      const { page: _page, limit: _limit, ...rest } = req.query;

      const filterQuery = buildFilterQuery({
        ...rest,
        user: req.user._id,
      });

      const total = await Lead.countDocuments(filterQuery);
      const totalPages = Math.ceil(total / limit);


      const leads = await Lead.find(filterQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      res.status(200).json({
        data: leads,
        page,
        limit,
        total,
        totalPages,
      });
    } catch (error) {
      console.error("Get leads error:", error);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  }
);

// ✅ Create lead
router.post(
  "/",
  [
    body("first_name").trim().notEmpty(),
    body("last_name").trim().notEmpty(),
    body("email").isEmail().normalizeEmail(),
    body("phone").optional().trim(),
    body("company").optional().trim(),
    body("city").optional().trim(),
    body("state").optional().trim(),
    body("source")
      .optional()
      .isIn([
        "website",
        "facebook_ads",
        "google_ads",
        "referral",
        "events",
        "other",
      ]),
    body("status")
      .optional()
      .isIn(["new", "contacted", "qualified", "lost", "won"]),
    body("score").optional().isInt({ min: 0, max: 100 }),
    body("lead_value").optional().isFloat({ min: 0 }),
    body("is_qualified").optional().isBoolean(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const leadData = { ...req.body, user: req.user._id };
      const lead = new Lead(leadData);
      await lead.save();

      res.status(201).json({
        message: "Lead created successfully",
        lead,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ error: "Email already exists" });
      }
      console.error("Create lead error:", error);
      res.status(500).json({ error: "Failed to create lead" });
    }
  }
);

// ✅ Get single lead (with user check)
router.get("/:id", async (req, res) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, user: req.user._id });

    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    res.status(200).json({ lead });
  } catch (error) {
    console.error("Get lead error:", error);
    res.status(500).json({ error: "Failed to fetch lead" });
  }
});

// ✅ Update lead
router.put(
  "/:id",
  [
    body("first_name").optional().trim().notEmpty(),
    body("last_name").optional().trim().notEmpty(),
    body("email").optional().isEmail().normalizeEmail(),
    body("phone").optional().trim(),
    body("company").optional().trim(),
    body("city").optional().trim(),
    body("state").optional().trim(),
    body("source")
      .optional()
      .isIn([
        "website",
        "facebook_ads",
        "google_ads",
        "referral",
        "events",
        "other",
      ]),
    body("status")
      .optional()
      .isIn(["new", "contacted", "qualified", "lost", "won"]),
    body("score").optional().isInt({ min: 0, max: 100 }),
    body("lead_value").optional().isFloat({ min: 0 }),
    body("is_qualified").optional().isBoolean(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const lead = await Lead.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        { ...req.body, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }

      res.status(200).json({
        message: "Lead updated successfully",
        lead,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ error: "Email already exists" });
      }
      console.error("Update lead error:", error);
      res.status(500).json({ error: "Failed to update lead" });
    }
  }
);

// ✅ Delete lead
router.delete("/:id", async (req, res) => {
  try {
    const lead = await Lead.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    res.status(200).json({
      message: "Lead deleted successfully",
      lead,
    });
  } catch (error) {
    console.error("Delete lead error:", error);
    res.status(500).json({ error: "Failed to delete lead" });
  }
});

module.exports = router;
