const express = require("express");
const router = express.Router();

const {
  getReceiptVouchers,
  createReceiptVoucher,
} = require("../controllers/receiptVoucherController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getReceiptVouchers);
router.post("/", protect, createReceiptVoucher);

module.exports = router;