const mongoose = require("mongoose");

const purchaseItemSchema = new mongoose.Schema(
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

const purchaseVoucherSchema = new mongoose.Schema(
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
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    supplierName: String,
    invoiceNo: String,
    invoiceDate: String,
    items: [purchaseItemSchema],
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("PurchaseVoucher", purchaseVoucherSchema);
