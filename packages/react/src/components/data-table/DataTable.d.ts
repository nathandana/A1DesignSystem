import * as React from "react";

export interface DataTableColumn {
  key: string;
  label: string;
  type?: "text" | "number" | "currency" | "date" | "badge" | "avatar" | "image" | "link" | "actions";
  align?: "start" | "center" | "end";
  width?: string;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: "single" | "multi";
  searchable?: boolean;
  editable?: boolean;
  multiline?: boolean;
  placeholder?: string;
  sortAccessor?: (row: Record<string, unknown>) => unknown;
  searchAccessor?: (row: Record<string, unknown>) => unknown;
  /** Custom matcher for built-in search. Return true when this row should match the normalized query. */
  searchMatcher?: (row: Record<string, unknown>, query: string) => boolean;
  renderCell?: (context: {
    value: unknown;
    row: Record<string, unknown>;
    column: DataTableColumn;
    rowIndex: number;
  }) => React.ReactNode;
  statusMap?: Record<string, "neutral" | "info" | "success" | "warn" | "error">;
  currencySymbol?: string;
}

export interface DataTableSortState {
  key: string;
  direction: "asc" | "desc";
}

export interface DataTableFilter {
  key: string;
  label: string;
  type?: "single" | "multi";
  options: Array<{ value: string; label: string }>;
}

export interface DataTableProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: DataTableColumn[];
  rows?: Record<string, unknown>[];
  /**
   * Cell spacing density.
   * Omit (default) to auto-select density based on the available container width.
   */
  size?: "comfortable" | "default" | "compact";
  /** Alternate row shading. Default: false */
  zebra?: boolean;
  /** Enable horizontal scroll on the table. Default: false */
  scrollable?: boolean;
  /**
   * Mobile presentation below 640px.
   * "cards" renders each row as a Card-like definition list. "table" preserves the table layout with horizontal scroll.
   * Default: "cards"
   */
  mobileLayout?: "cards" | "table";
  /** Accessible caption for the table */
  caption?: string;
  /** Controlled current page (1-based) */
  page?: number;
  /** Uncontrolled initial page. Default: 1 */
  defaultPage?: number;
  /** Number of rows per page for built-in pagination */
  pageSize?: number;
  /** Initial rows per page for uncontrolled built-in pagination */
  defaultPageSize?: number;
  /** Page-size choices shown in the pagination footer */
  pageSizeOptions?: number[];
  /** Total page count for server-side pagination */
  totalPages?: number;
  /** Total row count for server-side row counter */
  totalRows?: number;
  /** Called when the active page changes */
  onPageChange?: (page: number) => void;
  /** Called when the rows-per-page value changes */
  onPageSizeChange?: (pageSize: number) => void;
  /** Controlled sort state */
  sort?: DataTableSortState | null;
  /** Uncontrolled initial sort state */
  defaultSort?: DataTableSortState;
  /** Called when sort changes */
  onSortChange?: (sort: DataTableSortState | null) => void;
  filters?: DataTableFilter[];
  filterValue?: Record<string, unknown>;
  defaultFilterValue?: Record<string, unknown>;
  onFilterChange?: (value: Record<string, unknown>) => void;
  searchValue?: string;
  defaultSearchValue?: string;
  onSearchChange?: (value: string) => void;
  searchColumn?: string;
  defaultSearchColumn?: string;
  onSearchColumnChange?: (column: string) => void;
  searchableColumns?: Array<{
    key: string;
    label: string;
    searchAccessor?: (row: Record<string, unknown>) => unknown;
    /** Custom matcher for built-in search. Return true when this row should match the normalized query. */
    searchMatcher?: (row: Record<string, unknown>, query: string) => boolean;
  }>;
  /** Enable row selection. Default: false */
  selectable?: boolean;
  selectedRowIds?: (string | number)[];
  defaultSelectedRowIds?: (string | number)[];
  onSelectedRowIdsChange?: (ids: string[]) => void;
  onDeleteSelected?: (rows: Record<string, unknown>[], ids: string[]) => void;
  onCellChange?: (row: Record<string, unknown>, columnKey: string, value: string, rowIndex: number) => void;
  getRowId?: (row: Record<string, unknown>, index: number) => string | number;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: string;
  /**
   * Custom full-width no-padding rows inserted into the table body.
   * Each entry specifies `content` (ReactNode) and an optional `afterRow` index (0-based,
   * default 0 = before all data rows). Multiple entries with the same `afterRow` stack in order.
   */
  notices?: Array<{ content: React.ReactNode; afterRow?: number }>;
}

export declare function DataTable(props: DataTableProps): React.ReactElement;
