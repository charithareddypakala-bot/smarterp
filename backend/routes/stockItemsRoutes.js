const express = require("express");
const router = express.Router();

const {
  getStockItems,
  createStockItem,
  updateStockItem,
  deleteStockItem,
} = require("../controllers/stockItemController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getStockItems);
router.post("/", protect, createStockItem);
router.put("/:id", protect, updateStockItem);
router.delete("/:id", protect, deleteStockItem);

module.exports = router;