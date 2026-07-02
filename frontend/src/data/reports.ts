// Dummy data for SmartERP financial statements:
// Trial Balance, Profit & Loss, Balance Sheet and Day Book.

/** A single trial-balance ledger row with debit/credit closing balances. */
export interface TrialBalanceRow {
  ledger: string;
  group: string;
  debit: number;
  credit: number;
}

export const trialBalance: TrialBalanceRow[] = [
  { ledger: "Cash-in-hand", group: "Current Assets", debit: 184500, credit: 0 },
  { ledger: "HDFC Bank", group: "Bank Accounts", debit: 920400, credit: 0 },
  { ledger: "ICICI Bank", group: "Bank Accounts", debit: 412300, credit: 0 },
  { ledger: "Sundry Debtors", group: "Current Assets", debit: 768900, credit: 0 },
  { ledger: "Stock-in-hand", group: "Current Assets", debit: 982000, credit: 0 },
  { ledger: "Furniture & Fixtures", group: "Fixed Assets", debit: 350000, credit: 0 },
  { ledger: "Plant & Machinery", group: "Fixed Assets", debit: 640000, credit: 0 },
  { ledger: "Capital Account", group: "Capital Account", debit: 0, credit: 2500000 },
  { ledger: "Sundry Creditors", group: "Current Liabilities", debit: 0, credit: 543200 },
  { ledger: "GST Payable", group: "Duties & Taxes", debit: 0, credit: 128400 },
  { ledger: "Bank Loan", group: "Loans (Liability)", debit: 0, credit: 600000 },
  { ledger: "Sales Account", group: "Sales Accounts", debit: 0, credit: 1840000 },
  { ledger: "Purchase Account", group: "Purchase Accounts", debit: 1120000, credit: 0 },
  { ledger: "Salary & Wages", group: "Indirect Expenses", debit: 320000, credit: 0 },
  { ledger: "Rent", group: "Indirect Expenses", debit: 144000, credit: 0 },
  { ledger: "Electricity", group: "Indirect Expenses", debit: 58200, credit: 0 },
  { ledger: "Freight & Cartage", group: "Direct Expenses", debit: 96400, credit: 0 },
  { ledger: "Discount Received", group: "Indirect Income", debit: 0, credit: 36100 },
  { ledger: "Interest Received", group: "Indirect Income", debit: 0, credit: 18800 },
];

/** A P&L statement line. side = debit (expense) or credit (income). */
export interface PLRow {
  particulars: string;
  amount: number;
}

export const plExpenses: PLRow[] = [
  { particulars: "Opening Stock", amount: 720000 },
  { particulars: "Purchase Account", amount: 1120000 },
  { particulars: "Direct Expenses (Freight)", amount: 96400 },
  { particulars: "Gross Profit c/o", amount: 885600 },
];

export const plIncome: PLRow[] = [
  { particulars: "Sales Account", amount: 1840000 },
  { particulars: "Closing Stock", amount: 982000 },
];

export const plIndirectExpenses: PLRow[] = [
  { particulars: "Salary & Wages", amount: 320000 },
  { particulars: "Rent", amount: 144000 },
  { particulars: "Electricity", amount: 58200 },
  { particulars: "Net Profit", amount: 418300 },
];

export const plIndirectIncome: PLRow[] = [
  { particulars: "Gross Profit b/f", amount: 885600 },
  { particulars: "Discount Received", amount: 36100 },
  { particulars: "Interest Received", amount: 18800 },
];

/** A balance-sheet line. */
export interface BSRow {
  particulars: string;
  amount: number;
}

export const bsLiabilities: BSRow[] = [
  { particulars: "Capital Account", amount: 2500000 },
  { particulars: "Net Profit", amount: 418300 },
  { particulars: "Bank Loan", amount: 600000 },
  { particulars: "Sundry Creditors", amount: 543200 },
  { particulars: "GST Payable", amount: 128400 },
];

export const bsAssets: BSRow[] = [
  { particulars: "Plant & Machinery", amount: 640000 },
  { particulars: "Furniture & Fixtures", amount: 350000 },
  { particulars: "Closing Stock", amount: 982000 },
  { particulars: "Sundry Debtors", amount: 768900 },
  { particulars: "HDFC Bank", amount: 920400 },
  { particulars: "ICICI Bank", amount: 412300 },
  { particulars: "Cash-in-hand", amount: 184500 },
];

/** A Day Book entry — chronological list of all vouchers. */
export interface DayBookRow {
  date: string;
  voucherNo: string;
  type: string;
  particulars: string;
  debit: number;
  credit: number;
}

export const dayBook: DayBookRow[] = [
  { date: "2026-06-19", voucherNo: "SAL-1042", type: "Sales", particulars: "Amit Verma", debit: 0, credit: 47600 },
  { date: "2026-06-19", voucherNo: "REC-0231", type: "Receipt", particulars: "HDFC Bank", debit: 47600, credit: 0 },
  { date: "2026-06-18", voucherNo: "PUR-0712", type: "Purchase", particulars: "Bharat Steel Works", debit: 156000, credit: 0 },
  { date: "2026-06-18", voucherNo: "CON-0091", type: "Contra", particulars: "HDFC Bank → Cash", debit: 50000, credit: 0 },
  { date: "2026-06-17", voucherNo: "PAY-0188", type: "Payment", particulars: "Krishna Textiles", debit: 0, credit: 64000 },
  { date: "2026-06-17", voucherNo: "JV-0145", type: "Journal", particulars: "Depreciation A/c", debit: 18500, credit: 0 },
  { date: "2026-06-16", voucherNo: "SAL-1041", type: "Sales", particulars: "Rohan Das", debit: 0, credit: 89000 },
  { date: "2026-06-15", voucherNo: "REC-0230", type: "Receipt", particulars: "ICICI Bank", debit: 89000, credit: 0 },
  { date: "2026-06-14", voucherNo: "CON-0090", type: "Contra", particulars: "Cash → ICICI Bank", debit: 120000, credit: 0 },
  { date: "2026-06-13", voucherNo: "JV-0144", type: "Journal", particulars: "Salary Payable", debit: 320000, credit: 0 },
];
