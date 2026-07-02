const express = require("express");
const router = express.Router();

const {
  getDamagedStock,
  createDamagedStock,
} = require("../controllers/damagedStockController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getDamagedStock);
router.post("/", protect, createDamagedStock);

module.exports = router;