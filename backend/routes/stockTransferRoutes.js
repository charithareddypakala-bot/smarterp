const express = require("express");
const router = express.Router();

const {
  getStockTransfers,
  createStockTransfer,
} = require("../controllers/stockTransferController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getStockTransfers);
router.post("/", protect, createStockTransfer);

module.exports = router;