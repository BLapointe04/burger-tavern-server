// routes/items.js  (ESM version)
import express from "express";
import Item from "../models/Item.js";
import { itemSchema } from "../validation/itemValidation.js";

const router = express.Router();


router.get("/:slug", async (req, res) => {
  try {
    const item = await Item.findOne({ slug: req.params.slug });

    if (!item) {
      return res.status(404).json({ ok: false, message: "Item not found" });
    }

    res.json(item);
  } catch (err) {
    console.error("GET item error:", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});


router.post("/", async (req, res) => {
  // Validate with Joi
  const { error } = itemSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      ok: false,
      message: "Validation failed",
      details: error.details.map((d) => d.message),
    });
  }

  try {
    const newItem = new Item(req.body);
    await newItem.save();

    // Client expects: { ok: true, item, category }
    res.json({
      ok: true,
      item: newItem,
      category: newItem.category,
    });
  } catch (err) {
    console.error("POST item error:", err);
    res.status(500).json({
      ok: false,
      message: "Server error while saving item",
    });
  }
});


router.put("/:slug", async (req, res) => {
  // Validate with Joi
  const { error } = itemSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      ok: false,
      message: "Validation failed",
      details: error.details.map((d) => d.message),
    });
  }

  try {
    // Keep slug stable so URL doesn't break
    req.body.slug = req.params.slug;

    const updated = await Item.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ ok: false, message: "Item not found" });
    }

    // Client expects: { ok: true, item: updatedItem }
    res.json({ ok: true, item: updated });
  } catch (err) {
    console.error("PUT update error:", err);
    res.status(500).json({ ok: false, message: "Server error while updating" });
  }
});


router.delete("/:slug", async (req, res) => {
  try {
    const deleted = await Item.findOneAndDelete({ slug: req.params.slug });

    if (!deleted) {
      return res.status(404).json({ ok: false, message: "Item not found" });
    }

    // Client only expects: { ok: true }
    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE error:", err);
    res.status(500).json({ ok: false, message: "Server error while deleting" });
  }
});

export default router;
