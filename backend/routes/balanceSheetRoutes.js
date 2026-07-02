const express = require("express");
const router = express.Router();

const { getBalanceSheet } = require("../controllers/balanceSheetController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getBalanceSheet);

module.exports = router;