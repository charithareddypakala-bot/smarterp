const express = require("express");
const router = express.Router();

const {
  getLedgers,
  createLedger,
  updateLedger,
  deleteLedger,
} = require("../controllers/ledgerController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getLedgers);
router.post("/", protect, createLedger);
router.put("/:id", protect, updateLedger);
router.delete("/:id", protect, deleteLedger);

module.exports = router;