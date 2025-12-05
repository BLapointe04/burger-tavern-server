// server.js (ESM version)
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Import routes
import itemsRoute from "./routes/items.js";
import menuRoute from "./routes/menu.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://blapointe04.github.io",
    "https://burger-tavern-react.onrender.com"
  ],
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));


// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Routes
app.use("/api/items", itemsRoute);
app.use("/api/menu", menuRoute);

app.get("/", (req, res) => {
  res.send("Burger Tavern API is running.");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
