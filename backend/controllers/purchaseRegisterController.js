const PurchaseVoucher = require("../models/PurchaseVoucher");

exports.getPurchaseRegister = async (req, res) => {
  try {
    const { companyId } = req.query;

    const purchases = await PurchaseVoucher.find({
      companyId,
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    const entries = purchases.map((p) => ({
      date: p.invoiceDate || p.createdAt,
      invoiceNo: p.purchaseNo || p.invoiceNo,
      supplierName: p.supplierName,
      subtotal: p.subtotal || 0,
      gst: p.gst || 0,
      total: p.total || p.totalAmount || 0,
    }));

    const totalPurchase = entries.reduce(
      (sum, e) => sum + Number(e.total || 0),
      0
    );

    const totalGst = entries.reduce(
      (sum, e) => sum + Number(e.gst || 0),
      0
    );

    res.json({
      success: true,
      entries,
      totalPurchase,
      totalGst,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};