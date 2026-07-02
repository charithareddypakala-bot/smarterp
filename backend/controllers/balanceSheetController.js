const SalesVoucher = require("../models/SalesVoucher");
const PurchaseVoucher = require("../models/PurchaseVoucher");
const ReceiptVoucher = require("../models/ReceiptVoucher");
const PaymentVoucher = require("../models/PaymentVoucher");
const StockItem = require("../models/StockItem");

exports.getBalanceSheet = async (req, res) => {
  try {
    const { companyId } = req.query;
    const userId = req.user.id;

    const sales = await SalesVoucher.find({ companyId, userId });
    const purchases = await PurchaseVoucher.find({ companyId, userId });
    const receipts = await ReceiptVoucher.find({ companyId, userId });
    const payments = await PaymentVoucher.find({ companyId, userId });
    const stock = await StockItem.find({ companyId, userId });

    const totalSales = sales.reduce(
      (sum, v) => sum + Number(v.total || v.totalAmount || 0),
      0
    );

    const totalPurchases = purchases.reduce(
      (sum, v) => sum + Number(v.total || v.totalAmount || 0),
      0
    );

    const totalReceipts = receipts.reduce(
      (sum, v) => sum + Number(v.amount || 0),
      0
    );

    const totalPayments = payments.reduce(
      (sum, v) => sum + Number(v.amount || 0),
      0
    );

    const stockValue = stock.reduce(
      (sum, item) =>
        sum + Number(item.quantity || 0) * Number(item.purchasePrice || 0),
      0
    );

   const receivables = Math.max(totalSales - totalReceipts, 0);
   const payables = Math.max(totalPurchases - totalPayments, 0);
   const cashBank = Math.max(totalReceipts - totalPayments, 0);
    const capital = stockValue + receivables + cashBank - payables;

    const assets = [
      { name: "Stock in Hand", amount: stockValue },
      { name: "Sundry Debtors", amount: receivables },
      { name: "Cash / Bank Balance", amount: cashBank },
    ];

    const liabilities = [
      { name: "Sundry Creditors", amount: payables },
      { name: "Capital Account", amount: capital },
    ];

    const totalAssets = assets.reduce((s, a) => s + a.amount, 0);
    const totalLiabilities = liabilities.reduce((s, l) => s + l.amount, 0);

    res.json({
      success: true,
      assets,
      liabilities,
      totalAssets,
      totalLiabilities,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};