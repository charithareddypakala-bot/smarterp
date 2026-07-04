import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";
import { SearchBar } from "@/components/common/search-bar";
import { DataTable, type Column } from "@/components/common/data-table";
import { DataPagination } from "@/components/common/data-pagination";
import { useTable } from "@/hooks/use-table";
import { formatCurrency, formatDate } from "@/lib/format";
import type { VoucherEntry } from "@/data/vouchers";

/**
 * Reusable list view for ledger-style vouchers
 * (Contra, Journal, Credit Note, Debit Note).
 */
interface EntryVoucherModuleProps {
  title: string;
  description: string;
  accountLabel: string;
  actionLabel: string;
  data: VoucherEntry[];
  /** Optional custom actions to render in the header (overrides default create button) */
  headerActions?: React.ReactNode;
}

export function EntryVoucherModule({
  title,
  description,
  accountLabel,
  actionLabel,
  data,
  headerActions,
}: EntryVoucherModuleProps) {
  const table = useTable(data, { searchKeys: ["id", "account", "particulars"], pageSize: 8 });

  const columns: Column<VoucherEntry>[] = [
    {
      key: "id",
      header: "Voucher No.",
      cell: (v) => <span className="font-medium text-foreground">{v.id}</span>,
    },
    { key: "date", header: "Date", cell: (v) => formatDate(v.date) },
    { key: "account", header: accountLabel, cell: (v) => v.account },
    {
      key: "particulars",
      header: "Particulars",
      cell: (v) => <span className="text-muted-foreground">{v.particulars}</span>,
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      cell: (v) => <span className="font-medium">{formatCurrency(v.amount)}</span>,
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader title={title} description={description} actions={headerActions ?? (
        <Button onClick={() => toast.info(`${actionLabel} form coming soon`)}>
          <Plus className="size-4" /> {actionLabel}
        </Button>
      )} />
      <SearchBar value={table.search} onChange={table.setSearch} placeholder="Search vouchers…" />
      <DataTable
        columns={columns}
        data={table.rows}
        rowKey={(v) => v.id}
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
