const BankTransaction = require("../models/BankTransaction");

exports.getBankTransactions = async (req, res) => {
  try {
    const { companyId } = req.query;

    const transactions = await BankTransaction.find({
      companyId,
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      transactions,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createBankTransaction = async (req, res) => {
  try {
    const transaction = await BankTransaction.create({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Bank transaction created",
      transaction,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.toggleReconciliation = async (req, res) => {
  try {
    const transaction = await BankTransaction.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    transaction.reconciled = !transaction.reconciled;
    await transaction.save();

    res.json({
      success: true,
      message: "Reconciliation status updated",
      transaction,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};