const express = require("express");
const router = express.Router();

const {
  getPaymentVouchers,
  createPaymentVoucher,
} = require("../controllers/paymentVoucherController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getPaymentVouchers);
router.post("/", protect, createPaymentVoucher);

module.exports = router;