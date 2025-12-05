import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

// ROUTES
import itemsRoute from "./routes/items.js";
import menuRoute from "./routes/menu.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


app.use(cors());
app.use(express.json()); 
// Serve static public folder (optional)
app.use(express.static(path.join(__dirname, "public")));

const MONGO_URL = process.env.MONGO_URL;

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));


app.use("/api/items", itemsRoute);
app.use("/api/menu", menuRoute);

app.get("/", (req, res) => {
  res.send("Burger Tavern API is running.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
