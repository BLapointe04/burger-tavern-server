// models/Item.js
import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    category: { 
      type: String, 
      required: true, 
      enum: ["burgers", "sides", "specials"] 
    },
    image: { type: String },
    slug: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", ItemSchema);

export default Item;
