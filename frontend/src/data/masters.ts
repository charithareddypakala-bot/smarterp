// Dummy master data for SmartERP — Account Groups, Stock Groups and Units.

/** Tally-style account group used to classify ledgers. */
export interface AccountGroup {
  id: string;
  name: string;
  nature: "Assets" | "Liabilities" | "Income" | "Expenses";
  parent: string;
  ledgers: number;
}

export const accountGroups: AccountGroup[] = [
  { id: "g1", name: "Current Assets", nature: "Assets", parent: "Primary", ledgers: 6 },
  { id: "g2", name: "Bank Accounts", nature: "Assets", parent: "Current Assets", ledgers: 3 },
  { id: "g3", name: "Cash-in-hand", nature: "Assets", parent: "Current Assets", ledgers: 1 },
  { id: "g4", name: "Sundry Debtors", nature: "Assets", parent: "Current Assets", ledgers: 24 },
  { id: "g5", name: "Fixed Assets", nature: "Assets", parent: "Primary", ledgers: 4 },
  { id: "g6", name: "Current Liabilities", nature: "Liabilities", parent: "Primary", ledgers: 5 },
  { id: "g7", name: "Sundry Creditors", nature: "Liabilities", parent: "Current Liabilities", ledgers: 18 },
  { id: "g8", name: "Duties & Taxes", nature: "Liabilities", parent: "Current Liabilities", ledgers: 4 },
  { id: "g9", name: "Capital Account", nature: "Liabilities", parent: "Primary", ledgers: 2 },
  { id: "g10", name: "Sales Accounts", nature: "Income", parent: "Primary", ledgers: 3 },
  { id: "g11", name: "Direct Income", nature: "Income", parent: "Primary", ledgers: 2 },
  { id: "g12", name: "Purchase Accounts", nature: "Expenses", parent: "Primary", ledgers: 3 },
  { id: "g13", name: "Direct Expenses", nature: "Expenses", parent: "Primary", ledgers: 5 },
  { id: "g14", name: "Indirect Expenses", nature: "Expenses", parent: "Primary", ledgers: 9 },
];

/** Stock group used to categorise inventory items. */
export interface StockGroup {
  id: string;
  name: string;
  parent: string;
  items: number;
}

export const stockGroups: StockGroup[] = [
  { id: "sg1", name: "Electronics", parent: "Primary", items: 42 },
  { id: "sg2", name: "Furniture", parent: "Primary", items: 18 },
  { id: "sg3", name: "Groceries", parent: "Primary", items: 96 },
  { id: "sg4", name: "Medical", parent: "Primary", items: 64 },
  { id: "sg5", name: "Construction", parent: "Primary", items: 31 },
  { id: "sg6", name: "Electrical", parent: "Electronics", items: 27 },
  { id: "sg7", name: "Plumbing", parent: "Construction", items: 15 },
  { id: "sg8", name: "Paints", parent: "Construction", items: 12 },
];

/** Unit of measure for stock items. */
export interface Unit {
  id: string;
  symbol: string;
  name: string;
  decimals: number;
}

export const units: Unit[] = [
  { id: "u1", symbol: "PCS", name: "Pieces", decimals: 0 },
  { id: "u2", symbol: "KG", name: "Kilograms", decimals: 3 },
  { id: "u3", symbol: "BOX", name: "Box", decimals: 0 },
  { id: "u4", symbol: "LTR", name: "Litre", decimals: 2 },
  { id: "u5", symbol: "MTR", name: "Metre", decimals: 2 },
  { id: "u6", symbol: "BAG", name: "Bag", decimals: 0 },
  { id: "u7", symbol: "SHEET", name: "Sheet", decimals: 0 },
  { id: "u8", symbol: "CAN", name: "Can", decimals: 0 },
];
