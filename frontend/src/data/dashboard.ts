import type {
  Transaction,
  StatCard,
  MonthlyPoint,
  CategoryShare,
} from "@/types";

export const recentTransactions: Transaction[] = [
  { id: "INV-1042", type: "Sales", party: "Amit Verma", date: "2026-06-20", amount: 128400, status: "pending" },
  { id: "PUR-0871", type: "Purchase", party: "Bharat Steel Works", date: "2026-06-19", amount: 234500, status: "paid" },
  { id: "RCT-0455", type: "Receipt", party: "Rahul Sharma", date: "2026-06-19", amount: 45200, status: "paid" },
  { id: "INV-1041", type: "Sales", party: "Rohan Das", date: "2026-06-18", amount: 88900, status: "overdue" },
  { id: "PAY-0322", type: "Payment", party: "Pioneer Chemicals", date: "2026-06-18", amount: 165000, status: "paid" },
  { id: "INV-1040", type: "Sales", party: "Vikram Singh", date: "2026-06-17", amount: 67500, status: "pending" },
  { id: "PUR-0870", type: "Purchase", party: "Krishna Textiles", date: "2026-06-16", amount: 78900, status: "pending" },
  { id: "RCT-0454", type: "Receipt", party: "Divya Menon", date: "2026-06-15", amount: 51300, status: "paid" },
];

export const dashboardStats: StatCard[] = [
  { label: "Total Sales", value: "₹18.4L", change: 12.5, icon: "TrendingUp" },
  { label: "Total Purchase", value: "₹11.2L", change: 6.2, icon: "ShoppingCart" },
  { label: "Receivables", value: "₹4.6L", change: -3.1, icon: "Wallet" },
  { label: "Stock Value", value: "₹9.8L", change: 4.8, icon: "Boxes" },
];

export const monthlyTrend: MonthlyPoint[] = [
  { month: "Jan", sales: 1240000, purchase: 820000 },
  { month: "Feb", sales: 1380000, purchase: 910000 },
  { month: "Mar", sales: 1620000, purchase: 1040000 },
  { month: "Apr", sales: 1510000, purchase: 980000 },
  { month: "May", sales: 1740000, purchase: 1120000 },
  { month: "Jun", sales: 1840000, purchase: 1120000 },
];

export const categoryShare: CategoryShare[] = [
  { name: "Construction", value: 38 },
  { name: "Electrical", value: 24 },
  { name: "Raw Material", value: 18 },
  { name: "Paints", value: 12 },
  { name: "Hardware", value: 8 },
];
