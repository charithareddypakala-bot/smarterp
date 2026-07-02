const PaymentVoucher = require("../models/PaymentVoucher");

exports.getPaymentVouchers = async (req, res) => {
  try {
    const { companyId } = req.query;

    const vouchers = await PaymentVoucher.find({
      companyId,
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({ success: true, vouchers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createPaymentVoucher = async (req, res) => {
  try {
    const voucher = await PaymentVoucher.create({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Payment Voucher Created",
      voucher,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};