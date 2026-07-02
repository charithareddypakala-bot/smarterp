/** Maps app routes to a human page title for the navbar. */
export const routeTitles: Record<string, string> = {
  "/app": "Dashboard",
  "/app/customers": "Customers",
  "/app/suppliers": "Suppliers",
  "/app/ledgers": "Ledgers",
  "/app/groups": "Account Groups",
  "/app/stock-items": "Stock Items",
  "/app/stock-groups": "Stock Groups",
  "/app/units": "Units of Measure",
  "/app/sales": "Sales Invoice",
  "/app/purchase": "Purchase Voucher",
  "/app/payment": "Payments",
  "/app/receipt": "Receipts",
  "/app/contra": "Contra Voucher",
  "/app/journal": "Journal Voucher",
  "/app/credit-note": "Credit Note",
  "/app/debit-note": "Debit Note",
  "/app/inventory": "Inventory",
  "/app/gst": "GST",
  "/app/reports": "Reports",
  "/app/trial-balance": "Trial Balance",
  "/app/profit-loss": "Profit & Loss",
  "/app/balance-sheet": "Balance Sheet",
  "/app/day-book": "Day Book",
  "/app/banking": "Banking",
  "/app/accounting": "Accounting",
  "/app/payroll": "Payroll",
  "/app/utilities": "Utilities",
  "/app/administration": "Administration",
  "/app/settings": "Settings",
};

export function getRouteTitle(pathname: string): string {
  return routeTitles[pathname] ?? "SmartERP";
}
