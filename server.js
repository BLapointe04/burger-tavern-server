import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { burgers, sides, specials } from "./data/menu.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5173/burger-tavern-react",
    "https://blapointe04.github.io",
    "https://blapointe04.github.io/burger-tavern-react"
  ],
  methods: ["GET", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.static(path.join(__dirname, "public")));


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/menu", (req, res) => {
  res.json({ burgers, sides, specials });
});


app.get("/api/items/:slug", (req, res) => {
  const all = [...burgers, ...sides, ...specials];
  const item = all.find(i => i.slug === req.params.slug);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}).on("error", err => {
  console.error("Listen error:", err);
  process.exit(1);
});
