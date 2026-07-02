const ReceiptVoucher = require("../models/ReceiptVoucher");
const PaymentVoucher = require("../models/PaymentVoucher");

exports.getCashFlow = async (req, res) => {
  try {
    const { companyId } = req.query;
    const userId = req.user.id;

    const receipts = await ReceiptVoucher.find({ companyId, userId });
    const payments = await PaymentVoucher.find({ companyId, userId });

    const totalInflow = receipts.reduce(
      (sum, r) => sum + Number(r.amount || 0),
      0
    );

    const totalOutflow = payments.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );

    const netCashFlow = totalInflow - totalOutflow;

    res.json({
      success: true,
      inflows: receipts.map((r) => ({
        date: r.createdAt,
        voucherNo: r.receiptNo,
        party: r.customerName,
        amount: r.amount,
      })),
      outflows: payments.map((p) => ({
        date: p.createdAt,
        voucherNo: p.paymentNo,
        party: p.supplierName,
        amount: p.amount,
      })),
      totalInflow,
      totalOutflow,
      netCashFlow,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};