const StockTransfer = require("../models/StockTransfer");

exports.getStockTransfers = async (req, res) => {
  try {
    const { companyId } = req.query;

    const transfers = await StockTransfer.find({
      companyId,
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      transfers,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createStockTransfer = async (req, res) => {
  try {
    const transfer = await StockTransfer.create({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Stock transfer recorded",
      transfer,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};