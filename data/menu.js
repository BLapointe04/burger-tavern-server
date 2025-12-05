const express = require("express");
const Item = require("../models/Item");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const burgers = await Item.find({ category: "burgers" }).sort({ createdAt: -1 });
    const sides = await Item.find({ category: "sides" }).sort({ createdAt: -1 });
    const specials = await Item.find({ category: "specials" }).sort({ createdAt: -1 });

    res.json({ burgers, sides, specials });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
