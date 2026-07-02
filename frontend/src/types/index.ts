// Shared domain types for SmartERP (frontend-only, dummy data).

export interface Company {
  id: string;
  name: string;
  gstin: string;
  financialYear: string;
  address: string;
  logoColor: string; // accent color used in card avatar
  type: "Private Ltd" | "Proprietorship" | "Partnership" | "LLP";
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  gstin: string;
  city: string;
  balance: number; // outstanding receivable
  status: "active" | "inactive";
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  gstin: string;
  city: string;
  balance: number; // outstanding payable
  status: "active" | "inactive";
}

export interface StockItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  gstRate: number; // percentage
}

export interface Transaction {
  id: string;
  type: "Sales" | "Purchase" | "Payment" | "Receipt";
  party: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
}

export interface InvoiceLine {
  id: string;
  itemId: string;
  name: string;
  quantity: number;
  price: number;
  gstRate: number;
}

export interface StatCard {
  label: string;
  value: string;
  change: number; // percent change
  icon: string;
}

export interface MonthlyPoint {
  month: string;
  sales: number;
  purchase: number;
}

export interface CategoryShare {
  name: string;
  value: number;
}
