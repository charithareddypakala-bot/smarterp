const express = require("express");
const router = express.Router();

const {
  getPurchaseRegister,
} = require("../controllers/purchaseRegisterController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getPurchaseRegister);

module.exports = router;