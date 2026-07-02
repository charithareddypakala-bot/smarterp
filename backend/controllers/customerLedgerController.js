const SalesVoucher = require("../models/SalesVoucher");
const ReceiptVoucher = require("../models/ReceiptVoucher");

exports.getCustomerLedger = async (req, res) => {
  try {
    const { companyId, customerId } = req.query;

    const sales = await SalesVoucher.find({
      companyId,
      customerId,
      userId: req.user.id,
    });

    const receipts = await ReceiptVoucher.find({
      companyId,
      customerId,
      userId: req.user.id,
    });

    const entries = [];

    sales.forEach((s) => {
      entries.push({
        date: s.invoiceDate || s.createdAt,
        voucher: s.invoiceNo,
        type: "Sales",
        debit: Number(s.totalAmount || s.total || 0),
        credit: 0,
      });
    });

    receipts.forEach((r) => {
      entries.push({
        date: r.date || r.createdAt,
        voucher: r.receiptNo,
        type: "Receipt",
        debit: 0,
        credit: Number(r.amount || 0),
      });
    });

    entries.sort((a, b) => new Date(a.date) - new Date(b.date));

    let balance = 0;

    const ledger = entries.map((e) => {
      balance += e.debit;
      balance -= e.credit;

      return {
        ...e,
        balance,
      };
    });

    res.json({
      success: true,
      ledger,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};