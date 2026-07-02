const mongoose = require("mongoose");

const stockItemSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    name: { type: String, required: true },
    sku: String,
    unit: String,
    purchasePrice: { type: Number, default: 0 },
    sellingPrice: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    gstPercentage: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockItem", stockItemSchema);