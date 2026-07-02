const SalesReturn = require("../models/SalesReturn");
const StockItem = require("../models/StockItem");

exports.createSalesReturn = async (req, res) => {
  try {
    const userId = req.user.id;

    const voucher = await SalesReturn.create({
      ...req.body,
      userId,
    });

    // Increase stock back
    for (const item of req.body.items) {
      await StockItem.findByIdAndUpdate(item.itemId, {
        $inc: { quantity: item.quantity },
      });
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

exports.getSalesReturns = async (req, res) => {
  try {
    const { companyId } = req.query;

    const vouchers = await SalesReturn.find({
      companyId,
      userId: req.user.id,
    });

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