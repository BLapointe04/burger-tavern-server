// server.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import Joi from "joi";
import { burgers, sides, specials } from "./data/menu.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://blapointe04.github.io"
  ]
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Helper: create slug
const toSlug = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Joi validation schema
const priceRegex = /^\$?\d+(\.\d{2})?$/;

const itemSchema = Joi.object({
  name: Joi.string().min(2).max(80).required(),
  desc: Joi.string().min(2).max(300).required(),
  image: Joi.string().uri().required(),
  price: Joi.string().pattern(priceRegex).required(),
  category: Joi.string().valid("burgers", "sides", "specials").required(),
  slug: Joi.string().optional()
});

// Helper to find which list an item is in
function findList(category) {
  if (category === "burgers") return burgers;
  if (category === "sides") return sides;
  if (category === "specials") return specials;
  return null;
}

// GET: main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// GET: menu data
app.get("/api/menu", (req, res) => {
  res.json({ burgers, sides, specials });
});

// GET: single item
app.get("/api/items/:slug", (req, res) => {
  const slug = req.params.slug;
  const all = [...burgers, ...sides, ...specials];
  const item = all.find(i => i.slug === slug);

  if (!item) {
    return res.status(404).json({ error: "Item not found" });
  }

  res.json(item);
});

// POST: create new item
app.post("/api/items", (req, res) => {
  const { error, value } = itemSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      ok: false,
      message: "Validation failed",
      details: error.details.map(d => d.message)
    });
  }

  const { name, desc, image, price, category } = value;
  const slug = value.slug || toSlug(name);

  const all = [...burgers, ...sides, ...specials];
  if (all.find(i => i.slug === slug)) {
    return res.status(409).json({ ok: false, message: "Item already exists" });
  }

  const newItem = { name, desc, image, price, slug };
  findList(category).push(newItem);

  res.status(201).json({ ok: true, item: newItem, category });
});

//  PUT: edit item
app.put("/api/items/:slug", (req, res) => {
  const slug = req.params.slug;

  const { error, value } = itemSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      ok: false,
      message: "Validation failed",
      details: error.details.map(d => d.message)
    });
  }

  const { name, desc, image, price, category } = value;

  // Find item in ANY list
  const lists = { burgers, sides, specials };
  let oldList = null;
  let itemIndex = -1;

  for (const [key, list] of Object.entries(lists)) {
    const index = list.findIndex(i => i.slug === slug);
    if (index !== -1) {
      oldList = list;
      itemIndex = index;
      break;
    }
  }

  if (!oldList) {
    return res.status(404).json({ ok: false, message: "Item not found" });
  }

  // Build updated item
  const updatedItem = {
    name,
    desc,
    image,
    price,
    slug: value.slug || slug
  };

  // If category changed → move to new list
  if (oldList !== findList(category)) {
    oldList.splice(itemIndex, 1);
    findList(category).push(updatedItem);
  } else {
    oldList[itemIndex] = updatedItem;
  }

  return res.status(200).json({ ok: true, item: updatedItem });
});

//  DELETE: remove item
app.delete("/api/items/:slug", (req, res) => {
  const slug = req.params.slug;

  const lists = [burgers, sides, specials];
  let deleted = false;

  for (const list of lists) {
    const index = list.findIndex(i => i.slug === slug);
    if (index !== -1) {
      list.splice(index, 1);
      deleted = true;
      break;
    }
  }

  if (!deleted) {
    return res.status(404).json({ ok: false, message: "Item not found" });
  }

  return res.status(200).json({ ok: true });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
