const SalesVoucher = require("../models/SalesVoucher");
const PurchaseVoucher = require("../models/PurchaseVoucher");
const JournalVoucher = require("../models/JournalVoucher");

exports.getProfitLoss = async (req, res) => {
  try {
    const { companyId } = req.query;
    const userId = req.user.id;

    const sales = await SalesVoucher.find({ companyId, userId });
    const purchases = await PurchaseVoucher.find({ companyId, userId });
    const journals = await JournalVoucher.find({ companyId, userId });

    const salesTotal = sales.reduce(
      (sum, v) => sum + Number(v.totalAmount || v.total || 0),
      0
    );

    const purchaseTotal = purchases.reduce(
      (sum, v) => sum + Number(v.total || v.totalAmount || 0),
      0
    );

    let expenseTotal = 0;
    let incomeTotal = 0;

    journals.forEach((voucher) => {
      (voucher.entries || []).forEach((entry) => {
        const ledger = String(entry.ledgerName || "").toLowerCase();

        if (
          ledger.includes("rent") ||
          ledger.includes("salary") ||
          ledger.includes("expense") ||
          ledger.includes("depreciation")
        ) {
          if (entry.type === "Debit") {
            expenseTotal += Number(entry.amount || 0);
          }
        }

        if (
          ledger.includes("income") ||
          ledger.includes("commission") ||
          ledger.includes("discount received")
        ) {
          if (entry.type === "Credit") {
            incomeTotal += Number(entry.amount || 0);
          }
        }
      });
    });

    const grossProfit = salesTotal - purchaseTotal;
    const netProfit = salesTotal + incomeTotal - purchaseTotal - expenseTotal;

    res.json({
      success: true,
      salesTotal,
      purchaseTotal,
      expenseTotal,
      incomeTotal,
      grossProfit,
      netProfit,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};