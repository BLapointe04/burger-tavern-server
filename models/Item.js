import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: "" },
  imageUrl: { type: String, required: true },
  category: { type: String, required: true }
});

export default mongoose.model("Item", ItemSchema);
