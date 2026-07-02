const mongoose = require("mongoose");

const journalEntrySchema = new mongoose.Schema(
  {
    ledgerName: { type: String, required: true },
    type: { type: String, enum: ["Debit", "Credit"], required: true },
    amount: { type: Number, required: true },
  },
  { _id: false }
);

const journalVoucherSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    journalNo: String,
    date: { type: Date, default: Date.now },
    narration: String,
    entries: [journalEntrySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("JournalVoucher", journalVoucherSchema);