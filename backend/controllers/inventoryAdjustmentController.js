const InventoryAdjustment = require("../models/InventoryAdjustment");
const StockItem = require("../models/StockItem");

exports.getInventoryAdjustments = async (req, res) => {
  try {
    const { companyId } = req.query;

    const adjustments = await InventoryAdjustment.find({
      companyId,
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      adjustments,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createInventoryAdjustment = async (req, res) => {
  try {
    const adjustment = await InventoryAdjustment.create({
      ...req.body,
      userId: req.user.id,
    });

    await StockItem.findByIdAndUpdate(req.body.itemId, {
      quantity: Number(req.body.physicalStock),
    });

    res.status(201).json({
      success: true,
      message: "Inventory adjustment saved",
      adjustment,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};