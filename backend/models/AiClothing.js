const mongoose = require("mongoose");

const aiClothingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    color: { type: String, required: true },
    style: String,
    occasion: String,
    season: String,
  },
  { timestamps: true }
);

aiClothingSchema.index({ category: 1 });

module.exports = mongoose.model("AiClothing", aiClothingSchema);
