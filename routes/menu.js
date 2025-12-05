// routes/menu.js  (ESM version)
import express from "express";
import Item from "../models/Item.js";

const router = express.Router();

// GET /api/menu  → return burgers, sides, specials grouped
router.get("/", async (req, res) => {
  try {
    const burgers = await Item.find({ category: "burgers" }).sort({ createdAt: -1 });
    const sides = await Item.find({ category: "sides" }).sort({ createdAt: -1 });
    const specials = await Item.find({ category: "specials" }).sort({ createdAt: -1 });

    res.json({
      burgers,
      sides,
      specials
    });
  } catch (err) {
    console.error("Menu fetch error:", err);
    res.status(500).json({ error: "Failed to load menu" });
  }
});

export default router;
