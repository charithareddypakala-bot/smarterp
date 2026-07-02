const express = require("express");
const router = express.Router();

const {
  getCompanyProfile,
  saveCompanyProfile,
} = require("../controllers/companyProfileController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getCompanyProfile);
router.post("/", protect, saveCompanyProfile);

module.exports = router;