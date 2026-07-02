const express = require("express");
const router = express.Router();

const { getGstSummary } = require("../controllers/gstSummaryController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getGstSummary);

module.exports = router;