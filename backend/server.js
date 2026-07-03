console.log("🔥 SERVER FILE RUNNING:", __filename);

const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const cors = require("cors");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const companyRoutes = require("./routes/companyRoutes");
const customerRoutes = require("./routes/customerRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const stockItemRoutes = require("./routes/stockItemsRoutes");
const salesVoucherRoutes = require("./routes/salesVoucherRoutes");
const purchaseVoucherRoutes = require("./routes/purchaseVoucherRoutes");
const receiptVoucherRoutes = require("./routes/receiptVoucherRoutes");
const paymentVoucherRoutes = require("./routes/paymentVoucherRoutes");
const contraVoucherRoutes = require("./routes/contraVoucherRoutes");
const journalVoucherRoutes = require("./routes/journalVoucherRoutes");
const trialBalanceRoutes = require("./routes/trialBalanceRoutes");
const dayBookRoutes = require("./routes/dayBookRoutes");
const profitLossRoutes = require("./routes/profitLossRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const balanceSheetRoutes = require("./routes/balanceSheetRoutes");
const salesReturnRoutes =require("./routes/salesReturnRoutes");
const purchaseReturnRoutes = require("./routes/purchaseReturnRoutes");
const ledgerRoutes = require("./routes/ledgerRoutes");
const customerLedgerRoutes =require("./routes/customerLedgerRoutes");
const supplierLedgerRoutes = require("./routes/supplierLedgerRoutes");
const salesRegisterRoutes = require("./routes/salesRegisterRoutes");
const purchaseRegisterRoutes = require("./routes/purchaseRegisterRoutes");
const cashFlowRoutes = require("./routes/cashFlowRoutes");
const gstSummaryRoutes = require("./routes/gstSummaryRoutes");
const inventoryMovementRoutes = require("./routes/inventoryMovementRoutes");
const bankTransactionRoutes = require("./routes/bankTransactionRoutes");
const stockTransferRoutes = require("./routes/stockTransferRoutes");
const inventoryAdjustmentRoutes = require("./routes/inventoryAdjustmentRoutes");
const damagedStockRoutes = require("./routes/damagedStockRoutes");
const reservedStockRoutes = require("./routes/reservedStockRoutes");
const companyProfileRoutes = require("./routes/companyProfileRoutes");
const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Backend is running...");
});

app.get("/api/purchases-test", (req, res) => {
  res.json({ success: true, message: "purchase test working" });
});
app.get("/api/contra-test", (req, res) => {
  res.json({ success: true, message: "contra test working" });
});
app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/stock-items", stockItemRoutes);
app.use("/api/sales", salesVoucherRoutes);
app.use("/api/purchases", purchaseVoucherRoutes);
app.use("/api/receipts", receiptVoucherRoutes);
app.use("/api/payments", paymentVoucherRoutes);
app.use("/api/contra", contraVoucherRoutes);
app.use("/api/journal-vouchers", journalVoucherRoutes);
app.use("/api/journals", journalVoucherRoutes);
app.use("/api/trial-balance", trialBalanceRoutes);
app.use("/api/day-book", dayBookRoutes);
app.use("/api/profit-loss", profitLossRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/balance-sheet", balanceSheetRoutes);
app.use("/api/sales-returns", salesReturnRoutes);
app.use("/api/purchase-returns", purchaseReturnRoutes);
app.use("/api/ledgers", ledgerRoutes);
app.use("/api/customer-ledger", customerLedgerRoutes);
app.use("/api/supplier-ledger", supplierLedgerRoutes);
app.use("/api/sales-register", salesRegisterRoutes);
app.use("/api/purchase-register", purchaseRegisterRoutes);
app.use("/api/cash-flow", cashFlowRoutes); 
app.use("/api/gst-summary", gstSummaryRoutes);
app.use("/api/inventory-movement", inventoryMovementRoutes);
app.use("/api/banking", bankTransactionRoutes);
app.use("/api/stock-transfers", stockTransferRoutes);
app.use("/api/inventory-adjustments", inventoryAdjustmentRoutes);
app.use("/api/reserved-stock", reservedStockRoutes);
app.use("/api/damaged-stock", damagedStockRoutes);
app.use("/api/company-profile", companyProfileRoutes);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log("✅ ROUTES LOADED");
      connectDB();
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB Error:", err.message);
  });