const ReservedStock = require("../models/ReservedStock");

exports.getReservedStock = async (req, res) => {
  try {
    const { companyId } = req.query;

    const records = await ReservedStock.find({
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

exports.createReservedStock = async (req, res) => {
  try {
    const record = await ReservedStock.create({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Stock reserved successfully",
      record,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};