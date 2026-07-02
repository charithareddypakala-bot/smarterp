const JournalVoucher = require("../models/JournalVoucher");

exports.getJournalVouchers = async (req, res) => {
  try {
    const { companyId } = req.query;

    const vouchers = await JournalVoucher.find({
      companyId,
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({ success: true, vouchers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createJournalVoucher = async (req, res) => {
  try {
    const voucher = await JournalVoucher.create({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Journal Voucher Created",
      voucher,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};