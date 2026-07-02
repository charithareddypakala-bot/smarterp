const ReceiptVoucher = require("../models/ReceiptVoucher");

exports.getReceiptVouchers = async (req, res) => {
  try {
    const { companyId } = req.query;

    const vouchers = await ReceiptVoucher.find({
      companyId,
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      vouchers,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.createReceiptVoucher = async (req, res) => {
  try {
    const voucher = await ReceiptVoucher.create({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Receipt Voucher Created",
      voucher,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};