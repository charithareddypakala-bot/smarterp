const mongoose = require("mongoose");

const purchaseReturnSchema = new mongoose.Schema(
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
    supplierId: String,
    supplierName: String,
    returnNo: String,
    items: [
      {
        itemId: String,
        name: String,
        quantity: Number,
        price: Number,
        gstRate: Number,
      },
    ],
    subtotal: Number,
    gst: Number,
    total: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("PurchaseReturn", purchaseReturnSchema);