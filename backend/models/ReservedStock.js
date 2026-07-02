const mongoose = require("mongoose");

const reservedStockSchema = new mongoose.Schema(
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
    reserveNo: String,
    itemId: String,
    itemName: String,
    customerName: String,
    quantity: {
      type: Number,
      required: true,
    },
    note: String,
    status: {
      type: String,
      default: "Reserved",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReservedStock", reservedStockSchema);