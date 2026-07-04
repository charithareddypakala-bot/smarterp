const PurchaseReturn = require("../models/PurchaseReturn");
const StockItem = require("../models/StockItem");

exports.createPurchaseReturn = async (req, res) => {
  try {
    const voucher = await PurchaseReturn.create({
      ...req.body,
      userId: req.user.id,
    });

    // Update stock quantities. If item.restock is true, increase stock, otherwise decrease.
    for (const item of req.body.items) {
      if (item.itemId) {
        const delta = item.restock ? Number(item.quantity || 0) : -Number(item.quantity || 0);
        await StockItem.findByIdAndUpdate(item.itemId, {
          $inc: { quantity: delta },
        });
      }
    }

    // Create a payment-like adjustment to reduce supplier payable when a purchase return occurs
    try {
      const PaymentVoucher = require("../models/PaymentVoucher");

      if (voucher.supplierId && (voucher.total || voucher.totalAmount)) {
        await PaymentVoucher.create({
          companyId: voucher.companyId,
          userId: req.user.id,
          supplierId: voucher.supplierId,
          supplierName: voucher.supplierName,
          paymentNo: voucher.returnNo || `PR-${Date.now()}`,
          amount: voucher.total || voucher.totalAmount || 0,
          mode: "Adjustment",
          note: "Purchase return adjustment",
        });
      }
    } catch (err) {
      console.warn("Failed to create payment adjustment for purchase return:", err.message || err);
    }

    res.status(201).json({
      success: true,
      voucher,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getPurchaseReturns = async (req, res) => {
  try {
    const { companyId } = req.query;

    const vouchers = await PurchaseReturn.find({
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