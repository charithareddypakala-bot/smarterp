const mongoose = require("mongoose");

const salesItemSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StockItem",
    },
    itemName: String,
    quantity: {
      type: Number,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    gstPercentage: {
      type: Number,
      default: 0,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const salesVoucherSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    customerName: String,
    invoiceNo: {
      type: String,
      required: true,
    },
    invoiceDate: {
      type: String,
      required: true,
    },
    items: [salesItemSchema],
    subtotal: {
      type: Number,
      default: 0,
    },
    gstAmount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      default: "Unpaid",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SalesVoucher", salesVoucherSchema);