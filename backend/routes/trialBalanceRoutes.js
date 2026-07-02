const express = require("express");
const router = express.Router();

const { getTrialBalance } = require("../controllers/trialBalanceController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getTrialBalance);

module.exports = router;