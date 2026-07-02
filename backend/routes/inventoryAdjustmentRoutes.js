const express = require("express");
const router = express.Router();

const {
  getInventoryAdjustments,
  createInventoryAdjustment,
} = require("../controllers/inventoryAdjustmentController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getInventoryAdjustments);
router.post("/", protect, createInventoryAdjustment);

module.exports = router;