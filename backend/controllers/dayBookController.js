const SalesVoucher = require("../models/SalesVoucher");
const PurchaseVoucher = require("../models/PurchaseVoucher");
const ReceiptVoucher = require("../models/ReceiptVoucher");
const PaymentVoucher = require("../models/PaymentVoucher");
const JournalVoucher = require("../models/JournalVoucher");

exports.getDayBook = async (req, res) => {
  try {
    const { companyId } = req.query;
    const userId = req.user.id;

    const entries = [];

    const sales = await SalesVoucher.find({ companyId, userId });
    sales.forEach((v) => {
      entries.push({
        date: v.createdAt,
        type: "Sales",
        voucherNo: v.invoiceNo,
        party: v.customerName,
        amount: v.total || v.totalAmount || 0,
      });
    });

    const purchases = await PurchaseVoucher.find({ companyId, userId });
    purchases.forEach((v) => {
      entries.push({
        date: v.createdAt,
        type: "Purchase",
        voucherNo: v.invoiceNo,
        party: v.supplierName,
        amount: v.total || v.totalAmount || v.grandTotal || 0,
      });
    });

    const receipts = await ReceiptVoucher.find({ companyId, userId });
    receipts.forEach((v) => {
      entries.push({
        date: v.createdAt,
        type: "Receipt",
        voucherNo: v.receiptNo,
        party: v.customerName,
        amount: v.amount || 0,
      });
    });

    const payments = await PaymentVoucher.find({ companyId, userId });
    payments.forEach((v) => {
      entries.push({
        date: v.createdAt,
        type: "Payment",
        voucherNo: v.paymentNo,
        party: v.supplierName,
        amount: v.amount || 0,
      });
    });

    const journals = await JournalVoucher.find({ companyId, userId });
    journals.forEach((v) => {
      entries.push({
        date: v.createdAt,
        type: "Journal",
        voucherNo: v.journalNo,
        party: v.narration || "Journal Entry",
        amount: (v.entries || []).reduce((s, e) => s + Number(e.amount || 0), 0) / 2,
      });
    });

    entries.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      entries,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};