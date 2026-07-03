const SalesVoucher = require("../models/SalesVoucher");
const PurchaseVoucher = require("../models/PurchaseVoucher");
const ReceiptVoucher = require("../models/ReceiptVoucher");
const PaymentVoucher = require("../models/PaymentVoucher");
const StockItem = require("../models/StockItem");
const Customer = require("../models/customer");
const Supplier = require("../models/Supplier");

exports.getDashboard = async (req, res) => {
  try {
    const { companyId } = req.query;
    const userId = req.user.id;

    const sales = await SalesVoucher.find({ companyId, userId }).sort({
      createdAt: -1,
    });

    const purchases = await PurchaseVoucher.find({ companyId, userId }).sort({
      createdAt: -1,
    });

    const receipts = await ReceiptVoucher.find({ companyId, userId }).sort({
      createdAt: -1,
    });

    const payments = await PaymentVoucher.find({ companyId, userId }).sort({
      createdAt: -1,
    });

    const stock = await StockItem.find({ companyId, userId });

    const customers = await Customer.find({ companyId, userId });

    const suppliers = await Supplier.find({ companyId, userId });

    const totalSales = sales.reduce(
      (sum, v) => sum + Number(v.totalAmount || v.total || 0),
      0
    );

    const totalPurchases = purchases.reduce(
      (sum, v) => sum + Number(v.totalAmount || v.total || 0),
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
        sum +
        Number(item.quantity || 0) *
          Number(item.purchasePrice || 0),
      0
    );

    const netProfit = totalSales - totalPurchases;

    const lowStock = stock
      .filter((item) => Number(item.quantity || 0) <= 20)
      .slice(0, 5);

    const recentTransactions = [
      ...sales.slice(0, 5).map((v) => ({
        type: "Sales",
        voucherNo: v.invoiceNo,
        party: v.customerName,
        amount: v.totalAmount || v.total || 0,
        date: v.createdAt,
      })),

      ...purchases.slice(0, 5).map((v) => ({
        type: "Purchase",
        voucherNo: v.purchaseNo || v.invoiceNo,
        party: v.supplierName,
        amount: v.totalAmount || v.total || 0,
        date: v.createdAt,
      })),

      ...receipts.slice(0, 5).map((v) => ({
        type: "Receipt",
        voucherNo: v.receiptNo,
        party: v.customerName,
        amount: v.amount,
        date: v.createdAt,
      })),

      ...payments.slice(0, 5).map((v) => ({
        type: "Payment",
        voucherNo: v.paymentNo,
        party: v.supplierName,
        amount: v.amount,
        date: v.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 8);

    // Monthly Sales Chart
    const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const monthlySales = Array(12).fill(0);
const monthlyPurchases = Array(12).fill(0);
const monthlyReceipts = Array(12).fill(0);
const monthlyPayments = Array(12).fill(0);

sales.forEach((sale) => {
  const month = new Date(sale.createdAt).getMonth();
  monthlySales[month] += Number(sale.totalAmount || sale.total || 0);
});

purchases.forEach((purchase) => {
  const month = new Date(purchase.createdAt).getMonth();
  monthlyPurchases[month] += Number(purchase.totalAmount || purchase.total || 0);
});

receipts.forEach((receipt) => {
  const month = new Date(receipt.createdAt).getMonth();
  monthlyReceipts[month] += Number(receipt.amount || 0);
});

payments.forEach((payment) => {
  const month = new Date(payment.createdAt).getMonth();
  monthlyPayments[month] += Number(payment.amount || 0);
});

const monthlySalesData = monthNames.map((month, index) => ({
  month,
  sales: monthlySales[index],
  purchase: monthlyPurchases[index],
}));

const monthlyCashFlowData = monthNames.map((month, index) => ({
  month,
  receipts: monthlyReceipts[index],
  payments: monthlyPayments[index],
}));

    const recentSales = sales.slice(0, 5).map((sale) => ({
      invoiceNo: sale.invoiceNo,
      customer: sale.customerName,
      amount: sale.totalAmount || sale.total || 0,
      date: sale.createdAt,
    }));

    res.json({
  success: true,
  summary: {
    totalSales,
    totalPurchases,
    totalReceipts,
    totalPayments,
    stockValue,
    customersCount: customers.length,
    suppliersCount: suppliers.length,
    stockItemsCount: stock.length,
    netProfit,
  },
  monthlySales: monthlySalesData,
  monthlyCashFlow: monthlyCashFlowData,
  recentSales,
  lowStock,
  recentTransactions,
});
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};