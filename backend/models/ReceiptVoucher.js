const mongoose = require("mongoose");

const receiptVoucherSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    customerName: String,
    receiptNo: String,
    date: {
      type: Date,
      default: Date.now,
    },
    amount: {
      type: Number,
      required: true,
    },
    mode: {
      type: String,
      default: "Cash",
    },
    note: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReceiptVoucher", receiptVoucherSchema);