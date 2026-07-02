const mongoose = require("mongoose");

const salesReturnSchema = new mongoose.Schema(
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

    customerId: String,
    customerName: String,

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

module.exports = mongoose.model("SalesReturn", salesReturnSchema);