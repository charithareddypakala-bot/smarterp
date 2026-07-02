const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    address: String,
    gstin: String,
    financialYear: String,
    state: String,
    contactName: String,
    phone: String,
    email: String,
    logoColor: String,
    type: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);