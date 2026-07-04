import * as React from "react";

export interface DataTableFilterOption {
  value: string;
  label?: React.ReactNode;
}

export interface DataTableFilterDef {
  key: string;
  label?: React.ReactNode;
  type?: "single" | "multi";
  options: DataTableFilterOption[];
}

export interface DataTableSortOption {
  key: string;
  label?: React.ReactNode;
}

export interface DataTableSearchableColumn {
  key: string;
  label?: React.ReactNode;
  searchAccessor?: (row: Record<string, unknown>) => unknown;
  searchMatcher?: (row: Record<string, unknown>, query: string) => boolean;
}

export interface DataTableFiltersProps {
  filters?: DataTableFilterDef[];
  /** Filter key → selected value(s). Single filters use a string; multi filters use a string array. */
  value?: Record<string, unknown>;
  onChange?: (value: Record<string, unknown>) => void;
  searchValue?: string;
  /** Providing this enables the search field. */
  onSearchChange?: (value: string) => void;
  searchColumn?: string;
  onSearchColumnChange?: (column: string) => void;
  searchableColumns?: DataTableSearchableColumn[];
  sortOptions?: DataTableSortOption[];
  sortValue?: string;
  /** Providing this (with sortOptions) enables the sort control. */
  onSortValueChange?: (value: string) => void;
  className?: string;
}

/** Standalone filter/search/sort bar that pairs with DataTable for externally-controlled data. */
export declare function DataTableFilters(props: DataTableFiltersProps): React.ReactElement;
