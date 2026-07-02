const StockItem = require("../models/StockItem");

exports.getStockItems = async (req, res) => {
  try {
    const { companyId } = req.query;

    const items = await StockItem.find({
      userId: req.user.id,
      companyId,
    });

    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createStockItem = async (req, res) => {
  try {
    const item = await StockItem.create({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Stock item created successfully",
      item,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateStockItem = async (req, res) => {
  try {
    const item = await StockItem.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Stock item not found",
      });
    }

    res.json({
      success: true,
      message: "Stock item updated successfully",
      item,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteStockItem = async (req, res) => {
  try {
    const item = await StockItem.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Stock item not found",
      });
    }

    res.json({
      success: true,
      message: "Stock item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};