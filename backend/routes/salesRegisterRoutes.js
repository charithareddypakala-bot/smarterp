const express = require("express");
const router = express.Router();

const { getSalesRegister } = require("../controllers/salesRegisterController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getSalesRegister);

module.exports = router;