const express = require("express");
const router = express.Router();

const {
  getBankTransactions,
  createBankTransaction,
  toggleReconciliation,
} = require("../controllers/bankTransactionController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getBankTransactions);
router.post("/", protect, createBankTransaction);
router.patch("/:id/reconcile", protect, toggleReconciliation);

module.exports = router;