import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Truck,
  BookOpen,
  Folder,
  Boxes,
  Ruler,
  Receipt,
  ShoppingCart,
  Wallet,
  HandCoins,
  ArrowLeftRight,
  NotebookPen,
  FileMinus,
  FilePlus,
  Warehouse,
  Percent,
  Landmark,
  BarChart3,
  Scale,
  TrendingUp,
  BookText,
  Settings,
  Keyboard,
  type LucideIcon,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  OPEN_COMMAND_PALETTE,
  openShortcutsHelp,
} from "@/hooks/use-keyboard-shortcuts";

interface CommandLink {
  label: string;
  to: string;
  icon: LucideIcon;
  keys?: string;
}

interface CommandGroupDef {
  heading: string;
  items: CommandLink[];
}

const COMMAND_GROUPS: CommandGroupDef[] = [
  {
    heading: "Go to",
    items: [
      { label: "Dashboard", to: "/app", icon: LayoutDashboard, keys: "Ctrl H" },
      { label: "Inventory", to: "/app/inventory", icon: Warehouse, keys: "Ctrl I" },
      { label: "GST", to: "/app/gst", icon: Percent, keys: "Alt X" },
      { label: "Banking", to: "/app/banking", icon: Landmark },
      { label: "Reports", to: "/app/reports", icon: BarChart3 },
      { label: "Settings", to: "/app/settings", icon: Settings },
    ],
  },
  {
    heading: "Masters",
    items: [
      { label: "Customers", to: "/app/customers", icon: Users },
      { label: "Suppliers", to: "/app/suppliers", icon: Truck },
      { label: "Ledgers", to: "/app/ledgers", icon: BookOpen, keys: "Alt L" },
      { label: "Account Groups", to: "/app/groups", icon: Folder, keys: "Alt G" },
      { label: "Stock Groups", to: "/app/stock-groups", icon: Boxes },
      { label: "Stock Items", to: "/app/stock-items", icon: Boxes, keys: "Alt S" },
      { label: "Units of Measure", to: "/app/units", icon: Ruler, keys: "Alt U" },
    ],
  },
  {
    heading: "Vouchers",
    items: [
      { label: "Sales Voucher", to: "/app/sales", icon: Receipt, keys: "F8" },
      { label: "Purchase Voucher", to: "/app/purchase", icon: ShoppingCart, keys: "F9" },
      { label: "Payment", to: "/app/payment", icon: Wallet },
      { label: "Receipt", to: "/app/receipt", icon: HandCoins, keys: "F6" },
      { label: "Contra", to: "/app/contra", icon: ArrowLeftRight, keys: "F10" },
      { label: "Journal", to: "/app/journal", icon: NotebookPen, keys: "F7" },
      { label: "Credit Note", to: "/app/credit-note", icon: FileMinus, keys: "Alt F8" },
      { label: "Debit Note", to: "/app/debit-note", icon: FilePlus, keys: "Alt F9" },
    ],
  },
  {
    heading: "Reports",
    items: [
      { label: "Balance Sheet", to: "/app/balance-sheet", icon: Scale, keys: "Alt B" },
      { label: "Profit & Loss", to: "/app/profit-loss", icon: TrendingUp, keys: "Alt P" },
      { label: "Trial Balance", to: "/app/trial-balance", icon: BookText, keys: "Alt T" },
    ],
  },
];

/**
 * Global command palette (Ctrl/Cmd + K). Provides fuzzy navigation
 * across every SmartERP module — the keyboard-first entry point.
 */
export function CommandPalette() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_COMMAND_PALETTE, onOpen);
    return () => window.removeEventListener(OPEN_COMMAND_PALETTE, onOpen);
  }, []);

  const run = (to: string) => {
    setOpen(false);
    navigate({ to });
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search modules, vouchers, reports…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {COMMAND_GROUPS.map((group, gi) => (
          <div key={group.heading}>
            {gi > 0 && <CommandSeparator />}
            <CommandGroup heading={group.heading}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.to + item.label}
                  value={`${group.heading} ${item.label}`}
                  onSelect={() => run(item.to)}
                >
                  <item.icon className="size-4" />
                  <span>{item.label}</span>
                  {item.keys && <CommandShortcut>{item.keys}</CommandShortcut>}
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        ))}
        <CommandSeparator />
        <CommandGroup heading="Help">
          <CommandItem
            value="keyboard shortcuts help"
            onSelect={() => {
              setOpen(false);
              openShortcutsHelp();
            }}
          >
            <Keyboard className="size-4" />
            <span>Keyboard Shortcuts</span>
            <CommandShortcut>?</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
