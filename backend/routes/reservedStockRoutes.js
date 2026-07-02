const express = require("express");
const router = express.Router();

const {
  getReservedStock,
  createReservedStock,
} = require("../controllers/reservedStockController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getReservedStock);
router.post("/", protect, createReservedStock);

module.exports = router;