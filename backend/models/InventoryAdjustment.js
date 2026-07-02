const mongoose = require("mongoose");

const inventoryAdjustmentSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    adjustmentNo: String,
    itemId: String,
    itemName: String,
    currentStock: Number,
    physicalStock: Number,
    difference: Number,
    reason: String,
    note: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "InventoryAdjustment",
  inventoryAdjustmentSchema
);