const PurchaseVoucher = require("../models/PurchaseVoucher");
const StockItem = require("../models/StockItem");

exports.getPurchaseVouchers = async (req, res) => {
  try {
    const { companyId } = req.query;

    const vouchers = await PurchaseVoucher.find({
      companyId,
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      vouchers,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.createPurchaseVoucher = async (req, res) => {
  try {
    if (!req.body.companyId) {
      return res.status(400).json({
        success: false,
        message: "Company not selected. Please select a company again.",
      });
    }

    if (!req.body.supplierId) {
      return res.status(400).json({
        success: false,
        message: "Supplier is required",
      });
    }

    if (!Array.isArray(req.body.items) || req.body.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one purchase item is required",
      });
    }

    const subtotal = req.body.items.reduce(
      (sum, item) => sum + Number(item.quantity || 0) * Number(item.rate || 0),
      0
    );

    const gst = req.body.items.reduce((sum, item) => {
      const base = Number(item.quantity || 0) * Number(item.rate || 0);
      return sum + (base * Number(item.gstPercentage || 0)) / 100;
    }, 0);

    const total = subtotal + gst;

    console.log("PURCHASE BODY:", req.body.items);
console.log("CALCULATED:", { subtotal, gst, total });

const voucher = await PurchaseVoucher.create({
  companyId: req.body.companyId,
  userId: req.user.id,

  supplierId: req.body.supplierId,
  supplierName: req.body.supplierName,

  invoiceNo: req.body.invoiceNo,
  purchaseNo: req.body.invoiceNo,
  invoiceDate: req.body.invoiceDate,

  items: req.body.items,

  subtotal,
  gst,
  gstAmount: gst,

  total,
  totalAmount: total,
});

    for (const item of req.body.items) {
      if (item.itemId) {
        await StockItem.findByIdAndUpdate(item.itemId, {
          $inc: { quantity: Number(item.quantity || 0) },
        });
      }
    }

    res.status(201).json({
      success: true,
      message: "Purchase Voucher Created",
      voucher,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};