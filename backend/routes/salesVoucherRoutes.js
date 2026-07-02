const express = require("express");
const router = express.Router();

const {
  getSalesVouchers,
  createSalesVoucher,
  getSalesVouchersByCustomer,
} = require("../controllers/salesVoucherController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getSalesVouchers);
router.post("/", protect, createSalesVoucher);
router.get("/customer/:customerId", protect, getSalesVouchersByCustomer);

module.exports = router;