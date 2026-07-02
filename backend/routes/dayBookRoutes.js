const express = require("express");
const router = express.Router();

const { getDayBook } = require("../controllers/dayBookController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getDayBook);

module.exports = router;