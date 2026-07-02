const SalesVoucher = require("../models/SalesVoucher");
const PurchaseVoucher = require("../models/PurchaseVoucher");

exports.getGstSummary = async (req, res) => {
  try {
    const { companyId } = req.query;
    const userId = req.user.id;

    const sales = await SalesVoucher.find({ companyId, userId });
    const purchases = await PurchaseVoucher.find({ companyId, userId });

    const salesGst = sales.reduce(
      (sum, v) => sum + Number(v.gstAmount || v.gst || 0),
      0
    );

    const purchaseGst = purchases.reduce(
      (sum, v) => sum + Number(v.gst || v.gstAmount || 0),
      0
    );

    const netGst = salesGst - purchaseGst;

    res.json({
      success: true,
      salesGst,
      purchaseGst,
      netGst,
      status: netGst >= 0 ? "Payable" : "Refundable",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};