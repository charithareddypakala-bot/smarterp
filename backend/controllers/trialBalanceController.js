const SalesVoucher = require("../models/SalesVoucher");
const PurchaseVoucher = require("../models/PurchaseVoucher");
const ReceiptVoucher = require("../models/ReceiptVoucher");
const PaymentVoucher = require("../models/PaymentVoucher");
const JournalVoucher = require("../models/JournalVoucher");

exports.getTrialBalance = async (req, res) => {
  try {
    const { companyId } = req.query;
    const userId = req.user.id;

    const rows = {};

    function addLedger(name, debit = 0, credit = 0) {
      if (!rows[name]) rows[name] = { ledger: name, debit: 0, credit: 0 };
      rows[name].debit += debit;
      rows[name].credit += credit;
    }

    const sales = await SalesVoucher.find({ companyId, userId });
    sales.forEach((v) => {
      addLedger(v.customerName || "Customer", v.totalAmount || v.total || 0, 0);
      addLedger("Sales Account", 0, v.totalAmount || v.total || 0);
    });

    const purchases = await PurchaseVoucher.find({ companyId, userId });
    purchases.forEach((v) => {
      addLedger("Purchase Account", v.total || 0, 0);
      addLedger(v.supplierName || "Supplier", 0, v.total || 0);
    });

    const receipts = await ReceiptVoucher.find({ companyId, userId });
    receipts.forEach((v) => {
      addLedger("Cash / Bank", v.amount || 0, 0);
      addLedger(v.customerName || "Customer", 0, v.amount || 0);
    });

    const payments = await PaymentVoucher.find({ companyId, userId });
    payments.forEach((v) => {
      addLedger(v.supplierName || "Supplier", v.amount || 0, 0);
      addLedger("Cash / Bank", 0, v.amount || 0);
    });

    const journals = await JournalVoucher.find({ companyId, userId });
    journals.forEach((v) => {
      (v.entries || []).forEach((entry) => {
        if (entry.type === "Debit") {
          addLedger(entry.ledgerName, entry.amount || 0, 0);
        } else {
          addLedger(entry.ledgerName, 0, entry.amount || 0);
        }
      });
    });

    const result = Object.values(rows);
    const totalDebit = result.reduce((sum, r) => sum + r.debit, 0);
    const totalCredit = result.reduce((sum, r) => sum + r.credit, 0);

    res.json({
      success: true,
      rows: result,
      totalDebit,
      totalCredit,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};