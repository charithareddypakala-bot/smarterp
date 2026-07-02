const CompanyProfile = require("../models/CompanyProfile");

exports.getCompanyProfile = async (req, res) => {
  try {
    const { companyId } = req.query;

    const profile = await CompanyProfile.findOne({
      companyId,
      userId: req.user.id,
    });

    res.json({
      success: true,
      profile,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.saveCompanyProfile = async (req, res) => {
  try {
    const { companyId } = req.body;

    const profile = await CompanyProfile.findOneAndUpdate(
      {
        companyId,
        userId: req.user.id,
      },
      {
        ...req.body,
        userId: req.user.id,
      },
      {
        new: true,
        upsert: true,
      }
    );

    res.json({
      success: true,
      message: "Company profile saved",
      profile,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};