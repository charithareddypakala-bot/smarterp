const ContraVoucher = require("../models/ContraVoucher");

exports.getContraVouchers = async (req, res) => {
  try {
    const { companyId } = req.query;

    const vouchers = await ContraVoucher.find({
      companyId,
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({ success: true, vouchers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createContraVoucher = async (req, res) => {
  try {
    const voucher = await ContraVoucher.create({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Contra Voucher Created",
      voucher,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};