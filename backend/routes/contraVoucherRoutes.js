const express = require("express");
const router = express.Router();

const {
  getContraVouchers,
  createContraVoucher,
} = require("../controllers/contraVoucherController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getContraVouchers);
router.post("/", protect, createContraVoucher);

module.exports = router;