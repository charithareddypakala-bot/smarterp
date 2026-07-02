const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema(
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
    name: {
      type: String,
      required: true,
    },
    group: {
      type: String,
      required: true,
    },
    openingBalance: {
      type: Number,
      default: 0,
    },
    balanceType: {
      type: String,
      enum: ["Dr", "Cr"],
      default: "Dr",
    },
    gstin: String,
    pan: String,
    phone: String,
    email: String,
    address: String,
    remarks: String,
    status: {
      type: String,
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ledger", ledgerSchema);