// Dummy data for the additional Tally-style vouchers
// (Contra, Journal, Credit Note, Debit Note).

export interface VoucherEntry {
  id: string;
  date: string;
  /** Account debited / credited, or the parties involved. */
  account: string;
  particulars: string;
  amount: number;
}

export const contraVouchers: VoucherEntry[] = [
  { id: "CON-0091", date: "2026-06-18", account: "HDFC Bank → Cash", particulars: "Cash withdrawal for office", amount: 50000 },
  { id: "CON-0090", date: "2026-06-14", account: "Cash → ICICI Bank", particulars: "Cash deposit", amount: 120000 },
  { id: "CON-0089", date: "2026-06-09", account: "HDFC Bank → SBI", particulars: "Inter-bank transfer", amount: 200000 },
  { id: "CON-0088", date: "2026-06-03", account: "Cash → HDFC Bank", particulars: "Daily collection deposit", amount: 35400 },
];

export const journalVouchers: VoucherEntry[] = [
  { id: "JV-0145", date: "2026-06-17", account: "Depreciation A/c", particulars: "Depreciation on machinery", amount: 18500 },
  { id: "JV-0144", date: "2026-06-13", account: "Salary Payable", particulars: "Salary provision for June", amount: 320000 },
  { id: "JV-0143", date: "2026-06-08", account: "Prepaid Insurance", particulars: "Insurance adjustment", amount: 24000 },
  { id: "JV-0142", date: "2026-06-02", account: "Bad Debts", particulars: "Write-off — Galaxy Plastics", amount: 12800 },
];

export const creditNotes: VoucherEntry[] = [
  { id: "CN-0033", date: "2026-06-19", account: "Amit Verma", particulars: "Sales return — 4 pcs LED Bulb", amount: 4760 },
  { id: "CN-0032", date: "2026-06-12", account: "Rohan Das", particulars: "Damaged goods return", amount: 8900 },
  { id: "CN-0031", date: "2026-06-05", account: "Vikram Singh", particulars: "Rate difference adjustment", amount: 2100 },
];

export const debitNotes: VoucherEntry[] = [
  { id: "DN-0028", date: "2026-06-18", account: "Bharat Steel Works", particulars: "Purchase return — defective rods", amount: 15600 },
  { id: "DN-0027", date: "2026-06-11", account: "Krishna Textiles", particulars: "Short supply adjustment", amount: 6400 },
  { id: "DN-0026", date: "2026-06-04", account: "Pioneer Chemicals", particulars: "Quality rejection", amount: 9800 },
];
