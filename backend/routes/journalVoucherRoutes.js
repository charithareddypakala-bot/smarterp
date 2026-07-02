const express = require("express");
const router = express.Router();

const {
  getJournalVouchers,
  createJournalVoucher,
} = require("../controllers/journalVoucherController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getJournalVouchers);
router.post("/", protect, createJournalVoucher);

module.exports = router;