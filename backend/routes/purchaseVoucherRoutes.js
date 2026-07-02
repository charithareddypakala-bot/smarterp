const express = require("express");
const router = express.Router();

const {
  getPurchaseVouchers,
  createPurchaseVoucher,
} = require("../controllers/purchaseVoucherController");

const { protect } = require("../middleware/authMiddleware");


router.get("/", protect, getPurchaseVouchers);
router.post("/", protect, createPurchaseVoucher);

module.exports = router;