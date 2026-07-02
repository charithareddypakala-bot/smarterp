import type { Transaction } from "@/types";

// Larger dummy voucher list used by Payment / Receipt / Ledger views.
export const transactions: Transaction[] = [
  { id: "RCT-0455", type: "Receipt", party: "Rahul Sharma", date: "2026-06-19", amount: 45200, status: "paid" },
  { id: "RCT-0454", type: "Receipt", party: "Divya Menon", date: "2026-06-15", amount: 51300, status: "paid" },
  { id: "RCT-0453", type: "Receipt", party: "Neha Gupta", date: "2026-06-12", amount: 15600, status: "paid" },
  { id: "RCT-0452", type: "Receipt", party: "Pooja Joshi", date: "2026-06-09", amount: 4200, status: "pending" },
  { id: "RCT-0451", type: "Receipt", party: "Vikram Singh", date: "2026-06-04", amount: 67500, status: "paid" },
  { id: "PAY-0322", type: "Payment", party: "Pioneer Chemicals", date: "2026-06-18", amount: 165000, status: "paid" },
  { id: "PAY-0321", type: "Payment", party: "Bharat Steel Works", date: "2026-06-14", amount: 234500, status: "paid" },
  { id: "PAY-0320", type: "Payment", party: "Krishna Textiles", date: "2026-06-11", amount: 78900, status: "pending" },
  { id: "PAY-0319", type: "Payment", party: "Royal Hardware Co", date: "2026-06-07", amount: 43200, status: "paid" },
  { id: "PAY-0318", type: "Payment", party: "Galaxy Plastics", date: "2026-06-02", amount: 27800, status: "overdue" },
  { id: "INV-1042", type: "Sales", party: "Amit Verma", date: "2026-06-20", amount: 128400, status: "pending" },
  { id: "INV-1041", type: "Sales", party: "Rohan Das", date: "2026-06-18", amount: 88900, status: "overdue" },
  { id: "INV-1040", type: "Sales", party: "Vikram Singh", date: "2026-06-17", amount: 67500, status: "pending" },
  { id: "PUR-0871", type: "Purchase", party: "Bharat Steel Works", date: "2026-06-19", amount: 234500, status: "paid" },
  { id: "PUR-0870", type: "Purchase", party: "Krishna Textiles", date: "2026-06-16", amount: 78900, status: "pending" },
];

export interface Ledger {
  id: string;
  name: string;
  group: string;
  balance: number;
  type: "Dr" | "Cr";
}

export const ledgers: Ledger[] = [
  { id: "l1", name: "Cash in Hand", group: "Cash-in-hand", balance: 184500, type: "Dr" },
  { id: "l2", name: "HDFC Bank A/c", group: "Bank Accounts", balance: 942300, type: "Dr" },
  { id: "l3", name: "Sundry Debtors", group: "Current Assets", balance: 462000, type: "Dr" },
  { id: "l4", name: "Sundry Creditors", group: "Current Liabilities", balance: 589800, type: "Cr" },
  { id: "l5", name: "Sales Account", group: "Income", balance: 1840000, type: "Cr" },
  { id: "l6", name: "Purchase Account", group: "Expense", balance: 1120000, type: "Dr" },
  { id: "l7", name: "GST Payable", group: "Duties & Taxes", balance: 96400, type: "Cr" },
  { id: "l8", name: "Salary Account", group: "Indirect Expense", balance: 320000, type: "Dr" },
  { id: "l9", name: "Rent Account", group: "Indirect Expense", balance: 90000, type: "Dr" },
  { id: "l10", name: "Capital Account", group: "Capital", balance: 2500000, type: "Cr" },
];

export interface BankAccount {
  id: string;
  bank: string;
  accountNo: string;
  type: string;
  balance: number;
}

export const bankAccounts: BankAccount[] = [
  { id: "b1", bank: "HDFC Bank", accountNo: "•••• 4821", type: "Current", balance: 942300 },
  { id: "b2", bank: "ICICI Bank", accountNo: "•••• 7720", type: "Savings", balance: 318900 },
  { id: "b3", bank: "State Bank of India", accountNo: "•••• 1156", type: "Current", balance: 156400 },
];
