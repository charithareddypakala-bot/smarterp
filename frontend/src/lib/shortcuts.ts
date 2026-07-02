// Central registry of keyboard shortcuts for SmartERP.
// Used by the keyboard handler, the command palette and the help dialog.
// Mirrors the keyboard map from the SmartERP specification.

export interface Shortcut {
  /** Human-readable key combo, e.g. "Ctrl + K". */
  keys: string;
  /** What the shortcut does. */
  label: string;
  /** Optional route this shortcut navigates to (used by the handler & palette). */
  to?: string;
}

export interface ShortcutSection {
  title: string;
  items: Shortcut[];
}

/** Full keyboard map, grouped exactly like the spec sheet. */
export const shortcutSections: ShortcutSection[] = [
  {
    title: "Global",
    items: [
      { keys: "F1", label: "Company Selection", to: "/companies" },
      { keys: "F2", label: "Change Financial Year" },
      { keys: "F3", label: "Company Information" },
      { keys: "F4", label: "Calculator" },
      { keys: "F5", label: "Refresh" },
      { keys: "Esc", label: "Previous Screen" },
      { keys: "Ctrl + Q", label: "Logout", to: "/" },
      { keys: "Ctrl + H", label: "Home", to: "/app" },
      { keys: "Ctrl + K", label: "Command Search" },
    ],
  },
  {
    title: "Masters",
    items: [
      { keys: "Alt + L", label: "Create Ledger", to: "/app/ledgers" },
      { keys: "Alt + A", label: "Alter Ledger", to: "/app/ledgers" },
      { keys: "Alt + G", label: "Create Group", to: "/app/groups" },
      { keys: "Alt + S", label: "Create Stock Item", to: "/app/stock-items" },
      { keys: "Alt + U", label: "Unit Creation", to: "/app/units" },
    ],
  },
  {
    title: "Vouchers",
    items: [
      { keys: "F6", label: "Receipt Voucher", to: "/app/receipt" },
      { keys: "F7", label: "Journal Voucher", to: "/app/journal" },
      { keys: "F8", label: "Sales Voucher", to: "/app/sales" },
      { keys: "F9", label: "Purchase Voucher", to: "/app/purchase" },
      { keys: "F10", label: "Contra Voucher", to: "/app/contra" },
      { keys: "Alt + F8", label: "Credit Note", to: "/app/credit-note" },
      { keys: "Alt + F9", label: "Debit Note", to: "/app/debit-note" },
    ],
  },
  {
    title: "Inventory",
    items: [
      { keys: "Ctrl + I", label: "Inventory Dashboard", to: "/app/inventory" },
      { keys: "Ctrl + N", label: "New Item", to: "/app/stock-items" },
      { keys: "Ctrl + R", label: "Stock Report", to: "/app/inventory" },
    ],
  },
  {
    title: "Billing",
    items: [
      { keys: "Ctrl + B", label: "New Invoice", to: "/app/sales" },
      { keys: "Ctrl + P", label: "Print Invoice" },
      { keys: "Ctrl + Shift + P", label: "PDF Download" },
    ],
  },
  {
    title: "Customers & Suppliers",
    items: [
      { keys: "Ctrl + Shift + C", label: "Customer Ledger", to: "/app/customers" },
      { keys: "Ctrl + Shift + S", label: "Supplier Ledger", to: "/app/suppliers" },
    ],
  },
  {
    title: "Reports",
    items: [
      { keys: "Alt + B", label: "Balance Sheet", to: "/app/balance-sheet" },
      { keys: "Alt + P", label: "Profit & Loss", to: "/app/profit-loss" },
      { keys: "Alt + T", label: "Trial Balance", to: "/app/trial-balance" },
      { keys: "Alt + R", label: "Stock Summary", to: "/app/inventory" },
      { keys: "Alt + X", label: "GST Report", to: "/app/gst" },
    ],
  },
  {
    title: "Search & Navigation",
    items: [
      { keys: "Ctrl + F", label: "Search" },
      { keys: "Ctrl + Shift + F", label: "Global Search" },
      { keys: "Arrow Keys", label: "Navigation" },
      { keys: "Enter", label: "Select" },
      { keys: "Tab / Shift + Tab", label: "Next / Previous Field" },
    ],
  },
];
