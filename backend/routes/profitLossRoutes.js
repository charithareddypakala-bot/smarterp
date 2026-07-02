const express = require("express");
const router = express.Router();

const { getProfitLoss } = require("../controllers/profitLossController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getProfitLoss);

module.exports = router;