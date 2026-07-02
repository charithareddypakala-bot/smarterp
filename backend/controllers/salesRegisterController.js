const SalesVoucher = require("../models/SalesVoucher");

exports.getSalesRegister = async (req, res) => {
  try {
    const { companyId } = req.query;

    const sales = await SalesVoucher.find({
      companyId,
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    const entries = sales.map((s) => ({
      date: s.invoiceDate || s.createdAt,
      invoiceNo: s.invoiceNo,
      customerName: s.customerName,
      subtotal: s.subtotal || 0,
      gst: s.gstAmount || s.gst || 0,
      total: s.totalAmount || s.total || 0,
      paymentStatus: s.paymentStatus || "Unpaid",
    }));

    const totalSales = entries.reduce((sum, e) => sum + Number(e.total || 0), 0);
    const totalGst = entries.reduce((sum, e) => sum + Number(e.gst || 0), 0);

    res.json({
      success: true,
      entries,
      totalSales,
      totalGst,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};