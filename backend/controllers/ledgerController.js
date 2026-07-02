const Ledger = require("../models/Ledger");

exports.getLedgers = async (req, res) => {
  try {
    const { companyId } = req.query;

    const ledgers = await Ledger.find({
      companyId,
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({ success: true, ledgers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createLedger = async (req, res) => {
  try {
    const ledger = await Ledger.create({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Ledger created successfully",
      ledger,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateLedger = async (req, res) => {
  try {
    const ledger = await Ledger.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Ledger updated successfully",
      ledger,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteLedger = async (req, res) => {
  try {
    await Ledger.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    res.json({
      success: true,
      message: "Ledger deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};