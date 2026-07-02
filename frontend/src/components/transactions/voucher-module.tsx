import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";
import { SearchBar } from "@/components/common/search-bar";
import { DataTable, type Column } from "@/components/common/data-table";
import { DataPagination } from "@/components/common/data-pagination";
import { StatusBadge } from "@/components/common/status-badge";
import { useTable } from "@/hooks/use-table";
import { formatCurrency, formatDate } from "@/lib/format";
import { transactions } from "@/data/transactions";
import type { Transaction } from "@/types";

/**
 * Reusable voucher list for Payment / Receipt screens.
 * Filters the shared transaction dataset by voucher type.
 */
interface VoucherModuleProps {
  title: string;
  description: string;
  voucherType: Transaction["type"];
  partyLabel: string;
  actionLabel: string;
}

export function VoucherModule({
  title,
  description,
  voucherType,
  partyLabel,
  actionLabel,
}: VoucherModuleProps) {
  const data = transactions.filter((t) => t.type === voucherType);
  const table = useTable(data, { searchKeys: ["party", "id"], pageSize: 8 });

  const columns: Column<Transaction>[] = [
    {
      key: "id",
      header: "Voucher No.",
      cell: (t) => <span className="font-medium text-foreground">{t.id}</span>,
    },
    { key: "party", header: partyLabel },
    { key: "date", header: "Date", cell: (t) => formatDate(t.date) },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      cell: (t) => <span className="font-medium">{formatCurrency(t.amount)}</span>,
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      cell: (t) => <StatusBadge status={t.status} />,
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title={title}
        description={description}
        actions={
          <Button onClick={() => toast.info(`${actionLabel} form coming soon`)}>
            <Plus className="size-4" /> {actionLabel}
          </Button>
        }
      />

      <SearchBar
        value={table.search}
        onChange={table.setSearch}
        placeholder="Search vouchers…"
      />

      <DataTable
        columns={columns}
        data={table.rows}
        rowKey={(t) => t.id}
        emptyTitle="No vouchers found"
      />

      <DataPagination
        page={table.page}
        pageCount={table.pageCount}
        total={table.total}
        pageSize={table.pageSize}
        onPageChange={table.setPage}
      />
    </div>
  );
}
