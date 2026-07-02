const SalesVoucher = require("../models/SalesVoucher");
const StockItem = require("../models/StockItem");

exports.getSalesVouchers = async (req, res) => {
  try {
    const { companyId } = req.query;

    const vouchers = await SalesVoucher.find({
      userId: req.user.id,
      companyId,
    }).sort({ createdAt: -1 });

    res.json({ success: true, vouchers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createSalesVoucher = async (req, res) => {
  try {
    const voucher = await SalesVoucher.create({
      ...req.body,
      userId: req.user.id,
    });

    for (const item of req.body.items) {
      if (item.itemId) {
        await StockItem.findByIdAndUpdate(item.itemId, {
          $inc: { quantity: -Number(item.quantity) },
        });
      }
    }

    res.status(201).json({
      success: true,
      message: "Sales voucher created successfully",
      voucher,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getSalesVouchersByCustomer = async (req, res) => {
  try {
    const { companyId, customerId } = req.query;

    const vouchers = await SalesVoucher.find({
      companyId,
      customerId,
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      vouchers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};