const express = require("express");
const router = express.Router();

const { getCashFlow } = require("../controllers/cashFlowController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getCashFlow);

module.exports = router;