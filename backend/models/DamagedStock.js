const mongoose = require("mongoose");

const damagedStockSchema = new mongoose.Schema(
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
    damageNo: String,
    itemId: String,
    itemName: String,
    quantity: {
      type: Number,
      required: true,
    },
    reason: String,
    note: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("DamagedStock", damagedStockSchema);