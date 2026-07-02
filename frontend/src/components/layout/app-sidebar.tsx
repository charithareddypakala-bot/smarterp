import { Link, useRouterState } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  BarChart3,
  BookOpen,
BookText,
  Boxes,
  CalendarDays,
  ChevronRight,
    FileMinus,
  FilePlus,
  Folder,
  HandCoins,
  Landmark,
  LayoutDashboard,
  NotebookPen,
  Percent,
  Receipt,
  Ruler,
  Scale,
  Settings,
  ShoppingCart,
  TrendingUp,
  Truck,
  Users,
  Wallet,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface NavLink {
  title: string;  
  url: string;
  icon: LucideIcon;
}

interface NavGroup {
  title: string;
  icon: LucideIcon;
  children: NavLink[];
}

const primaryLinks: NavLink[] = [
  { title: "Dashboard", url: "/app", icon: LayoutDashboard },
];

const secondaryLinks: NavLink[] = [
  { title: "Settings", url: "/app/settings", icon: Settings },
 
];

const navGroups: NavGroup[] = [
  {
    title: "Masters",
    icon: Folder,
    children: [
      { title: "Company Profile", url: "/app/company-profile", icon: Settings },
      { title: "Customers", url: "/app/customers", icon: Users },
      { title: "Suppliers", url: "/app/suppliers", icon: Truck },
      { title: "Ledgers", url: "/app/ledgers", icon: BookOpen },
      { title: "Account Groups", url: "/app/groups", icon: Folder },
      { title: "Stock Items", url: "/app/stock-items", icon: Boxes },
      { title: "Stock Groups", url: "/app/stock-groups", icon: Boxes },
      { title: "Units", url: "/app/units", icon: Ruler },
    
    ],
  },

  {
    title: "Transactions",
    icon: ArrowLeftRight,
    children: [
      { title: "Sales", url: "/app/sales", icon: Receipt },
      { title: "Purchase", url: "/app/purchase", icon: ShoppingCart },
      { title: "Payment", url: "/app/payment", icon: Wallet },
      { title: "Receipt", url: "/app/receipt", icon: HandCoins },
      { title: "Contra", url: "/app/contra", icon: ArrowLeftRight },
      { title: "Journal", url: "/app/journal", icon: NotebookPen },
      { title: "Credit Note", url: "/app/credit-note", icon: FileMinus },
      { title: "Debit Note", url: "/app/debit-note", icon: FilePlus },
    ],
  },

  {
    title: "Inventory",
    icon: Warehouse,
    children: [
      { title: "Stock Summary", url: "/app/inventory", icon: Warehouse },
      { title: "Inventory Movement", url: "/app/inventory-movement", icon: Boxes },
      { title: "Low Stock Report", url: "/app/low-stock", icon: Boxes },
    {
  title: "Stock Transfer",
  url: "/app/stock-transfer",
  icon: ArrowLeftRight,
},
{
  title: "Inventory Adjustment",
  url: "/app/inventory-adjustment",
  icon: Boxes,
},
{
  title: "Reserved Stock",
  url: "/app/reserved-stock",
  icon: Boxes,
},
{
  title: "Damaged Stock",
  url: "/app/damaged-stock",
  icon: Boxes,
},
    ],
  },

  {
    title: "Banking",
    icon: Landmark,
    children: [
      { title: "Bank Transactions", url: "/app/banking", icon: Landmark },
      { title: "Cash Flow", url: "/app/cash-flow", icon: Wallet },
    ],
  },

  {
    title: "Reports",
    icon: BarChart3,
    children: [
      { title: "Trial Balance", url: "/app/trial-balance", icon: BookText },
      { title: "Profit & Loss", url: "/app/profit-loss", icon: TrendingUp },
      { title: "Balance Sheet", url: "/app/balance-sheet", icon: Scale },
      { title: "Day Book", url: "/app/day-book", icon: CalendarDays },
      { title: "Customer Ledger", url: "/app/customer-ledger", icon: Users },
      { title: "Supplier Ledger", url: "/app/supplier-ledger", icon: Truck },
      { title: "Sales Register", url: "/app/sales-register", icon: Receipt },
      { title: "Purchase Register", url: "/app/purchase-register", icon: ShoppingCart },
      { title: "GST Summary", url: "/app/gst-summary", icon: Percent },
    ],
  },
];

function getCompanyName() {
  if (typeof window === "undefined") return "SmartERP";
  return window.localStorage.getItem("companyName") || "SmartERP";
}

export function AppSidebar() {
    const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (router) => router.location.pathname });
const companyName = getCompanyName();

  const isActive = (url: string) => pathname === url;
const isGroupActive = (group: NavGroup) =>
    group.children.some((child) => isActive(child.url));

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={isActive("/app")} tooltip="SmartERP">
              <Link to="/app">
            <Boxes />
          <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">SmartERP</span>
              <span className="text-[11px] font-normal text-sidebar-foreground/60">
Enterprise Suite
</span>
            </span>
        </Link>
</SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
                <SidebarGroup>
          <SidebarMenu>
            {primaryLinks.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
asChild
isActive={isActive(item.url)}
tooltip={item.title}
>
                  <Link to={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

                <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <SidebarMenu>
            {navGroups.map((group) => {
              const active = isGroupActive(group);

              return (
                <Collapsible
                  key={group.title}
                  asChild
                  defaultOpen={active}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={group.title} isActive={active}>
                        <group.icon />
                        <span>{group.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {group.children.map((child) => (
                            <SidebarMenuSubItem key={child.title}>
                              <SidebarMenuSubButton asChild isActive={isActive(child.url)}>
                                <Link to={child.url}>
                                  <child.icon className="size-4" />
                                  <span>{child.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

                <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarMenu>
            {secondaryLinks.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
asChild
isActive={isActive(item.url)}
tooltip={item.title}
>
                  <Link to={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

    <SidebarFooter className="border-t border-sidebar-border">
  <div className="flex items-center gap-2.5 rounded-md px-1.5 py-1.5 text-sidebar-foreground/80">
    <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-accent text-xs font-semibold">
      {companyName.charAt(0).toUpperCase()}
    </div>

    {!collapsed && (
      <div className="flex min-w-0 flex-col leading-tight">
        <span className="truncate text-xs font-medium">{companyName}</span>
        <span className="truncate text-[11px] text-sidebar-foreground/60">
          Selected Company
        </span>
      </div>
    )}
  </div>
</SidebarFooter>
    </Sidebar>
  );
}
