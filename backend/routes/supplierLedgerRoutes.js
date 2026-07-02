const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  getSupplierLedger,
} = require("../controllers/supplierLedgerController");

router.get("/", protect, getSupplierLedger);

module.exports = router;