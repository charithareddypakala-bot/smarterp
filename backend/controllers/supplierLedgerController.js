const PurchaseVoucher = require("../models/PurchaseVoucher");
const PaymentVoucher = require("../models/PaymentVoucher");

exports.getSupplierLedger = async (req, res) => {
  try {
    const { companyId, supplierId } = req.query;

    const purchases = await PurchaseVoucher.find({
      companyId,
      supplierId,
      userId: req.user.id,
    });

    const payments = await PaymentVoucher.find({
      companyId,
      supplierId,
      userId: req.user.id,
    });

    const entries = [];

    purchases.forEach((p) => {
      entries.push({
        date: p.date || p.createdAt,
        voucher: p.invoiceNo,
        type: "Purchase",
        debit: 0,
        credit: Number(p.total || p.totalAmount || 0),
      });
    });

    payments.forEach((p) => {
      entries.push({
        date: p.createdAt,
        voucher: p.paymentNo,
        type: "Payment",
        debit: Number(p.amount || 0),
        credit: 0,
      });
    });

    entries.sort((a, b) => new Date(a.date) - new Date(b.date));

    let balance = 0;

    const ledger = entries.map((e) => {
      balance += e.credit;
      balance -= e.debit;

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