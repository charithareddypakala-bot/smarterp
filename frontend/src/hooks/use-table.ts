import { useMemo, useState } from "react";

/**
 * Generic client-side table state: search, optional predicate filter,
 * and pagination. Reused by Customers, Suppliers, Stock Items, etc.
 */
export function useTable<T>(
  data: T[],
  options: {
    searchKeys: (keyof T)[];
    pageSize?: number;
    filter?: (row: T) => boolean;
  },
) {
  const { searchKeys, pageSize = 8, filter } = options;
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.filter((row) => {
      if (filter && !filter(row)) return false;
      if (!q) return true;
      return searchKeys.some((key) =>
        String(row[key] ?? "")
          .toLowerCase()
          .includes(q),
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, search, filter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const paged = useMemo(
    () => filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filtered, currentPage, pageSize],
  );

  // Reset to page 1 whenever the search term changes.
  const onSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return {
    search,
    setSearch: onSearchChange,
    page: currentPage,
    setPage,
    pageCount,
    pageSize,
    total: filtered.length,
    rows: paged,
  };
}
