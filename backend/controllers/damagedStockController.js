const DamagedStock = require("../models/DamagedStock");
const StockItem = require("../models/StockItem");

exports.getDamagedStock = async (req, res) => {
  try {
    const { companyId } = req.query;

    const records = await DamagedStock.find({
      companyId,
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      records,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createDamagedStock = async (req, res) => {
  try {
    const record = await DamagedStock.create({
      ...req.body,
      userId: req.user.id,
    });

    await StockItem.findByIdAndUpdate(req.body.itemId, {
      $inc: {
        quantity: -Number(req.body.quantity),
      },
    });

    res.status(201).json({
      success: true,
      message: "Damaged stock recorded",
      record,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};