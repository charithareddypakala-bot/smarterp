const PurchaseVoucher = require("../models/PurchaseVoucher");
const SalesVoucher = require("../models/SalesVoucher");
const SalesReturn = require("../models/SalesReturn");
const PurchaseReturn = require("../models/PurchaseReturn");

exports.getInventoryMovement = async (req, res) => {
  try {
    const { companyId } = req.query;
    const userId = req.user.id;

    const movements = [];

    const purchases = await PurchaseVoucher.find({ companyId, userId });
    purchases.forEach((v) => {
      (v.items || []).forEach((item) => {
        movements.push({
          date: v.createdAt,
          voucherNo: v.invoiceNo || v.purchaseNo,
          type: "Purchase",
          itemName: item.name || item.itemName,
          stockIn: Number(item.quantity || 0),
          stockOut: 0,
        });
      });
    });

    const sales = await SalesVoucher.find({ companyId, userId });
    sales.forEach((v) => {
      (v.items || []).forEach((item) => {
        movements.push({
          date: v.createdAt,
          voucherNo: v.invoiceNo,
          type: "Sales",
          itemName: item.name || item.itemName,
          stockIn: 0,
          stockOut: Number(item.quantity || 0),
        });
      });
    });

    const salesReturns = await SalesReturn.find({ companyId, userId });
    salesReturns.forEach((v) => {
      (v.items || []).forEach((item) => {
        movements.push({
          date: v.createdAt,
          voucherNo: v.returnNo,
          type: "Sales Return",
          itemName: item.name || item.itemName,
          stockIn: Number(item.quantity || 0),
          stockOut: 0,
        });
      });
    });

    const purchaseReturns = await PurchaseReturn.find({ companyId, userId });
    purchaseReturns.forEach((v) => {
      (v.items || []).forEach((item) => {
        movements.push({
          date: v.createdAt,
          voucherNo: v.returnNo,
          type: "Purchase Return",
          itemName: item.name || item.itemName,
          stockIn: 0,
          stockOut: Number(item.quantity || 0),
        });
      });
    });

    movements.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      movements,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};