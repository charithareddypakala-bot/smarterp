const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  getCustomerLedger,
} = require("../controllers/customerLedgerController");

router.get("/", protect, getCustomerLedger);

module.exports = router;