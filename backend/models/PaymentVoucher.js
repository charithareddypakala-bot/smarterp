const mongoose = require("mongoose");

const paymentVoucherSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
    supplierName: String,
    paymentNo: String,
    amount: { type: Number, required: true },
    mode: { type: String, default: "Cash" },
    note: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentVoucher", paymentVoucherSchema);