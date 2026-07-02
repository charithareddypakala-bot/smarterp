const PurchaseReturn = require("../models/PurchaseReturn");
const StockItem = require("../models/StockItem");

exports.createPurchaseReturn = async (req, res) => {
  try {
    const voucher = await PurchaseReturn.create({
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