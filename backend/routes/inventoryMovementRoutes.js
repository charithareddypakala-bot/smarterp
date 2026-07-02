const express = require("express");
const router = express.Router();

const { getInventoryMovement } = require("../controllers/inventoryMovementController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getInventoryMovement);

module.exports = router; 