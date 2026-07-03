import { Fragment, useEffect, useRef, useState } from "react";
import { Button } from "../button/Button.jsx";
import { SelectField } from "../field/SelectField.jsx";
import { Icon } from "../icon/Icon.jsx";
import { IconButton } from "../icon-button/IconButton.jsx";
import { InlineEditable } from "../inline-editable/InlineEditable.jsx";
import { Link } from "../link/Link.jsx";
import { MessageBadge, MessageEmptyState } from "../message/Message.jsx";
import { Pagination } from "../pagination/Pagination.jsx";
import { DataTableFilters } from "./DataTableFilters.jsx";
import "./data-table.css";

/**
 * columns: Array<{
 *   key: string,
 *   label: string,
 *   type?: "text" | "number" | "currency" | "date" | "badge" | "avatar" | "image" | "link" | "actions",
 *   align?: "start" | "center" | "end",
 *   width?: string,
 *   sortable?: boolean,
 *   filterable?: boolean,
 *   searchable?: boolean,
 *   editable?: boolean,
 *   sortAccessor?: (row: Record<string, any>) => any,
 *   searchAccessor?: (row: Record<string, any>) => any,
 *   searchMatcher?: (row: Record<string, any>, query: string) => boolean,
 *   renderCell?: ({ value, row, column, rowIndex }) => ReactNode,
 *   statusMap?: Record<string, "neutral"|"info"|"success"|"warn"|"error">,
 *   currencySymbol?: string,
 * }>
 * rows: Array<Record<string, any>>
 * getRowId?: (row: Record<string, any>, index: number) => string | number
 * size?: "comfortable" | "default" | "compact"
 *   omit (default) — switches between densities automatically based on available container width
 * mobileLayout?: "cards" | "table"
 *   cards (default) — renders each row as a definition-list card below 640px
 *   table — preserves the table layout on mobile and enables horizontal scroll
 */

// Estimated minimum content width per column type at a "neutral" padding level
const COL_BASE_WIDTH = {
  avatar:   160,  // avatar circle + name text
  image:     72,  // small thumbnail
  date:     110,  // "Jan 12, 2026"
  actions:  120,  // one or two compact buttons
  link:     120,  // linked text
  text:     120,  // generic text — assume moderate length
  badge:     95,  // short label in a chip
  currency:  85,  // $XX,XXX
  number:    75,  // numeric digits
};

// Extra horizontal padding added per column at each density (both sides)
const DENSITY_PADDING = {
  comfortable: 40,  // 20px × 2
  default:     32,  // 16px × 2
  compact:     24,  // 12px × 2
};

function minWidthForDensity(columns, density) {
  return columns.reduce((sum, col) => {
    const content = col.width
      ? parseFloat(col.width) || COL_BASE_WIDTH.text
      : (COL_BASE_WIDTH[col.type] ?? COL_BASE_WIDTH.text);
    return sum + content + DENSITY_PADDING[density];
  }, 0);
}

function normalizeSort(sort) {
  if (!sort?.key) return null;
  return {
    key: sort.key,
    direction: sort.direction === "desc" ? "desc" : "asc",
  };
}

function getSortValue(row, col) {
  const value = typeof col.sortAccessor === "function"
    ? col.sortAccessor(row)
    : row[col.key];

  if (value == null || value === "") return null;

  if (col.type === "number" || col.type === "currency" || col.numeric) {
    const num = typeof value === "number"
      ? value
      : parseFloat(String(value).replace(/[^0-9.-]/g, ""));
    return Number.isNaN(num) ? value : num;
  }

  if (col.type === "date") {
    const time = value instanceof Date ? value.getTime() : Date.parse(value);
    return Number.isNaN(time) ? value : time;
  }

  return value;
}

function compareSortValues(a, b) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;

  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }

  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

function defaultGetRowId(row, index) {
  return row.id ?? row.key ?? row.name ?? index;
}

function normalizeRowIds(ids) {
  return (ids ?? []).map((id) => String(id));
}

function normalizeFilterValue(filters, value = {}) {
  return filters.reduce((next, filter) => {
    next[filter.key] = value[filter.key] ?? (filter.type === "multi" ? [] : "");
    return next;
  }, {});
}

function comparableValue(value) {
  if (value == null) return "";
  if (typeof value === "object") {
    if ("label" in value) return String(value.label ?? "");
    if ("name" in value) return String(value.name ?? "");
    if ("title" in value) return String(value.title ?? "");
  }
  return String(value);
}

function filterMatches(rowValue, selectedValue, type) {
  if (type === "multi") {
    const selected = Array.isArray(selectedValue) ? selectedValue : [];
    if (selected.length === 0) return true;
    if (Array.isArray(rowValue)) return selected.some((value) => rowValue.map(comparableValue).includes(value));
    return selected.includes(comparableValue(rowValue));
  }

  if (!selectedValue) return true;
  if (Array.isArray(rowValue)) return rowValue.map(comparableValue).includes(selectedValue);
  return comparableValue(rowValue) === selectedValue;
}

function getSearchValue(row, column) {
  if (typeof column.searchAccessor === "function") return column.searchAccessor(row);
  return comparableValue(row[column.key]);
}

function searchMatches(row, column, query) {
  if (typeof column.searchMatcher === "function") return column.searchMatcher(row, query);
  return String(getSearchValue(row, column) ?? "").toLowerCase().includes(query);
}

function buildColumnFilters(columns, rows) {
  return columns
    .filter((column) => column.filterable)
    .map((column) => {
      const values = new Set();
      rows.forEach((row) => {
        const value = row[column.key];
        if (Array.isArray(value)) {
          value.forEach((item) => {
            const comparable = comparableValue(item);
            if (comparable) values.add(comparable);
          });
          return;
        }
        const comparable = comparableValue(value);
        if (comparable) values.add(comparable);
      });
      return {
        key: column.key,
        label: column.label,
        type: column.filterType ?? "multi",
        options: [...values].sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).map((value) => ({
          value,
          label: value,
        })),
      };
    })
    .filter((filter) => filter.options.length > 0);
}

function applyFiltersAndSearch(rows, filters, filterValue, searchValue, searchColumn, searchableColumns, columns) {
  let result = rows;

  if (filters.length > 0) {
    result = result.filter((row) =>
      filters.every((filter) => filterMatches(row[filter.key], filterValue[filter.key], filter.type))
    );
  }

  const query = String(searchValue ?? "").trim().toLowerCase().replace(/\s+/g, "_");
  if (!query) return result;

  const searchColumns = searchableColumns?.length > 0
    ? searchableColumns
    : columns.map((column) => ({ key: column.key, label: column.label }));

  return result.filter((row) => {
    if (searchColumn) {
      const column = searchColumns.find((item) => item.key === searchColumn) ?? { key: searchColumn };
      return searchMatches(row, column, query);
    }

    return searchColumns.some((column) => searchMatches(row, column, query));
  });
}

function isInteractiveColumn(col) {
  return col.type === "link" || col.type === "actions" || col.editable;
}

function hasInteractiveValue(value) {
  if (Array.isArray(value)) return value.length > 0;
  return value != null && value !== "";
}

function SelectionCheckbox({ checked, indeterminate = false, label, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      className="a1-data-table__checkbox"
      checked={checked}
      aria-label={label}
      onChange={(event) => onChange(event.target.checked)}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export function DataTable({
  columns = [],
  rows = [],
  size,
  zebra = false,
  scrollable = false,
  caption,
  notices = [],
  page,
  defaultPage = 1,
  pageSize,
  defaultPageSize,
  pageSizeOptions = [],
  totalPages,
  totalRows,
  onPageChange,
  onPageSizeChange,
  sort,
  defaultSort,
  onSortChange,
  filters = [],
  filterValue,
  defaultFilterValue = {},
  onFilterChange,
  searchValue,
  defaultSearchValue = "",
  onSearchChange,
  searchColumn,
  defaultSearchColumn = "",
  onSearchColumnChange,
  searchableColumns,
  selectable = false,
  mobileLayout = "cards",
  selectedRowIds,
  defaultSelectedRowIds = [],
  onSelectedRowIdsChange,
  onDeleteSelected,
  onCellChange,
  getRowId = defaultGetRowId,
  emptyTitle = "No results",
  emptyDescription,
  emptyIcon = "inbox",
  className = "",
  ...props
}) {
  const wrapperRef = useRef(null);
  const [autoDensity, setAutoDensity] = useState("default");
  const [internalSort, setInternalSort] = useState(() => normalizeSort(defaultSort));
  const [internalPage, setInternalPage] = useState(defaultPage);
  const [internalPageSize, setInternalPageSize] = useState(() => pageSize ?? defaultPageSize);
  const [internalFilterValue, setInternalFilterValue] = useState(() => normalizeFilterValue(filters, defaultFilterValue));
  const [internalSearchValue, setInternalSearchValue] = useState(defaultSearchValue);
  const [internalSearchColumn, setInternalSearchColumn] = useState(defaultSearchColumn);
  const [internalSelectedRowIds, setInternalSelectedRowIds] = useState(() => normalizeRowIds(defaultSelectedRowIds));

  const isAuto = size === undefined;
  const isSortControlled = sort !== undefined;
  const isPageControlled = page !== undefined;
  const isPageSizeControlled = pageSize !== undefined && onPageSizeChange !== undefined;
  const isFilterControlled = filterValue !== undefined;
  const isSearchControlled = searchValue !== undefined;
  const isSearchColumnControlled = searchColumn !== undefined;
  const isSelectionControlled = selectedRowIds !== undefined;
  const resolvedFilters = filters.length > 0 ? filters : buildColumnFilters(columns, rows);
  const resolvedSearchableColumns = searchableColumns?.length > 0
    ? searchableColumns
    : columns.filter((column) => column.searchable).map((column) => ({
      key: column.key,
      label: column.label,
      searchAccessor: column.searchAccessor,
      searchMatcher: column.searchMatcher,
    }));
  const activeDensity = isAuto ? autoDensity : size;
  const resolvedMobileLayout = mobileLayout === "table" ? "table" : "cards";
  const activeSort = isSortControlled ? normalizeSort(sort) : internalSort;
  const activePage = isPageControlled ? page : internalPage;
  const activePageSize = isPageSizeControlled ? pageSize : internalPageSize;
  const activeFilterValue = isFilterControlled
    ? normalizeFilterValue(resolvedFilters, filterValue)
    : normalizeFilterValue(resolvedFilters, internalFilterValue);
  const activeSearchValue = isSearchControlled ? searchValue : internalSearchValue;
  const activeSearchColumn = isSearchColumnControlled ? searchColumn : internalSearchColumn;
  const activeSelectedRowIds = isSelectionControlled
    ? normalizeRowIds(selectedRowIds)
    : internalSelectedRowIds;
  const selectedRowIdSet = new Set(activeSelectedRowIds);
  const pageSizeChoices = [...new Set(
    [activePageSize, ...pageSizeOptions]
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value) && value > 0)
  )].sort((a, b) => a - b);

  // Compute the density that best fits the current container width
  useEffect(() => {
    if (!isAuto) return;
    const el = wrapperRef.current;
    if (!el) return;

    const comfortable = minWidthForDensity(columns, "comfortable");
    const dflt        = minWidthForDensity(columns, "default");

    const pick = (width) => {
      if (width >= comfortable) return "comfortable";
      if (width >= dflt)        return "default";
      return "compact";
    };

    const ro = new ResizeObserver(([entry]) => {
      setAutoDensity(pick(entry.contentRect.width));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [isAuto, columns]);

  useEffect(() => {
    if (isPageSizeControlled || pageSize === undefined) return;
    setInternalPageSize(pageSize);
  }, [isPageSizeControlled, pageSize]);

  // ── Derived values ──────────────────────────────────────────────────────

  const tableClass = [
    "a1-data-table",
    activeDensity !== "default" && `a1-data-table--${activeDensity}`,
    zebra && "a1-data-table--zebra",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const wrapperClass = [
    "a1-data-table-wrapper",
    `a1-data-table-wrapper--mobile-${resolvedMobileLayout}`,
  ]
    .filter(Boolean)
    .join(" ");

  const filteredRows = applyFiltersAndSearch(
    rows,
    resolvedFilters,
    activeFilterValue,
    activeSearchValue,
    activeSearchColumn,
    resolvedSearchableColumns,
    columns
  );
  const sortableColumns = columns.filter((col) => col.sortable);
  const sortedRows = activeSort
    ? [...filteredRows].sort((a, b) => {
      const col = columns.find((column) => column.key === activeSort.key);
      if (!col) return 0;

      const result = compareSortValues(getSortValue(a, col), getSortValue(b, col));
      return activeSort.direction === "desc" ? -result : result;
    })
    : filteredRows;
  const hasInternalPagination = Number.isFinite(activePageSize) && activePageSize > 0;
  const resolvedTotalPages = hasInternalPagination
    ? Math.max(1, Math.ceil(sortedRows.length / activePageSize))
    : totalPages;
  const clampedPage = resolvedTotalPages != null
    ? Math.min(Math.max(activePage ?? 1, 1), resolvedTotalPages)
    : activePage;
  const paginatedRows = hasInternalPagination
    ? sortedRows.slice((clampedPage - 1) * activePageSize, clampedPage * activePageSize)
    : sortedRows;
  const showPagination = resolvedTotalPages != null && resolvedTotalPages > 1;
  const rowStart = hasInternalPagination
    ? (paginatedRows.length > 0 ? (clampedPage - 1) * activePageSize + 1 : 0)
    : (page != null ? (page - 1) * filteredRows.length + 1 : 1);
  const rowEnd = hasInternalPagination
    ? (paginatedRows.length > 0 ? rowStart + paginatedRows.length - 1 : 0)
    : (page != null ? rowStart + filteredRows.length - 1 : filteredRows.length);
  const knownTotal = hasInternalPagination
    ? sortedRows.length
    : (totalRows ?? (showPagination ? totalPages * filteredRows.length : filteredRows.length));
  const visibleRowEntries = paginatedRows.map((row, index) => ({
    row,
    index: hasInternalPagination ? (clampedPage - 1) * activePageSize + index : index,
    id: String(getRowId(row, hasInternalPagination ? (clampedPage - 1) * activePageSize + index : index)),
    supportsRowClickSelection: selectable && !columns.some((col) =>
      isInteractiveColumn(col) && hasInteractiveValue(row[col.key])
    ),
  }));
  const selectedRows = visibleRowEntries
    .filter((entry) => selectedRowIdSet.has(entry.id))
    .map((entry) => entry.row);
  const selectedCount = activeSelectedRowIds.length;
  const hasFilterControls = resolvedFilters.length > 0
    || resolvedSearchableColumns.length > 0
    || onSearchChange
    || searchValue !== undefined;
  const activeSortValue = activeSort ? `${activeSort.key}:${activeSort.direction}` : "";
  const allVisibleSelected = visibleRowEntries.length > 0
    && visibleRowEntries.every((entry) => selectedRowIdSet.has(entry.id));
  const someVisibleSelected = visibleRowEntries.some((entry) => selectedRowIdSet.has(entry.id));

  function updatePage(nextPage) {
    const normalized = resolvedTotalPages != null
      ? Math.min(Math.max(nextPage, 1), resolvedTotalPages)
      : Math.max(nextPage, 1);
    if (!isPageControlled) setInternalPage(normalized);
    onPageChange?.(normalized);
  }

  function resetPage() {
    updatePage(1);
  }

  function updatePageSize(nextPageSize) {
    const normalized = Math.max(1, Number(nextPageSize) || 1);
    if (!isPageSizeControlled) setInternalPageSize(normalized);
    onPageSizeChange?.(normalized);
    updatePage(1);
  }

  function updateSort(nextSort) {
    if (!isSortControlled) setInternalSort(nextSort);
    onSortChange?.(nextSort);
    resetPage();
  }

  function updateFilterValue(nextValue) {
    const normalized = normalizeFilterValue(resolvedFilters, nextValue);
    if (!isFilterControlled) setInternalFilterValue(normalized);
    onFilterChange?.(normalized);
    resetPage();
  }

  function updateSearchValue(nextValue) {
    if (!isSearchControlled) setInternalSearchValue(nextValue);
    onSearchChange?.(nextValue);
    resetPage();
  }

  function updateSearchColumn(nextValue) {
    if (!isSearchColumnControlled) setInternalSearchColumn(nextValue);
    onSearchColumnChange?.(nextValue);
    resetPage();
  }

  function updateSelectedRowIds(nextIds) {
    const normalized = normalizeRowIds(nextIds);
    if (!isSelectionControlled) setInternalSelectedRowIds(normalized);
    onSelectedRowIdsChange?.(normalized);
  }

  function toggleColumnSort(col) {
    const nextDirection = activeSort?.key === col.key && activeSort.direction === "asc"
      ? "desc"
      : "asc";
    updateSort({ key: col.key, direction: nextDirection });
  }

  function handleMobileSortChange(event) {
    updateMobileSortValue(event.target.value);
  }

  function updateMobileSortValue(value) {
    if (!value) {
      updateSort(null);
      return;
    }

    const [key, direction] = value.split(":");
    updateSort({ key, direction });
  }

  function toggleRowSelected(rowId, checked) {
    const next = checked
      ? [...new Set([...activeSelectedRowIds, rowId])]
      : activeSelectedRowIds.filter((id) => id !== rowId);
    updateSelectedRowIds(next);
  }

  function toggleAllVisible(checked) {
    const visibleIds = visibleRowEntries.map((entry) => entry.id);
    const next = checked
      ? [...new Set([...activeSelectedRowIds, ...visibleIds])]
      : activeSelectedRowIds.filter((id) => !visibleIds.includes(id));
    updateSelectedRowIds(next);
  }

  function handleDeleteSelected() {
    onDeleteSelected?.(selectedRows, activeSelectedRowIds);
    updateSelectedRowIds([]);
  }

  function handleRowClick(rowId, supportsRowClickSelection, event) {
    if (!supportsRowClickSelection) return;
    if (event.target.closest("a, button, input, select, textarea, label, [contenteditable='true'], [role='textbox']")) return;
    toggleRowSelected(rowId, !selectedRowIdSet.has(rowId));
  }

  // ── Cell rendering ──────────────────────────────────────────────────────

  function renderCell(col, value, row, rowIndex) {
    if (typeof col.renderCell === "function") {
      return col.renderCell({ value, row, column: col, rowIndex });
    }

    if (col.editable && typeof onCellChange === "function") {
      return (
        <InlineEditable
          seamless
          multiline={col.multiline}
          value={value == null ? "" : String(value)}
          placeholder={col.placeholder ?? "Empty"}
          aria-label={`Edit ${col.label}`}
          onChange={(nextValue) => onCellChange(row, col.key, nextValue, rowIndex)}
        />
      );
    }

    if (value == null || value === "") return "—";

    switch (col.type) {
      case "avatar": {
        const initials = String(value)
          .split(" ")
          .slice(0, 2)
          .map((w) => w.charAt(0).toUpperCase())
          .join("");
        return (
          <span className="a1-data-table__avatar-cell">
            <span className="a1-data-table__avatar" aria-hidden="true">{initials}</span>
            <span>{value}</span>
          </span>
        );
      }

      case "image": {
        // value is an image URL, or `{ src, alt }`.
        const src = value && typeof value === "object" ? value.src : value;
        const alt = value && typeof value === "object" ? (value.alt ?? "") : "";
        return src
          ? <img className="a1-data-table__thumb" src={src} alt={alt} loading="lazy" />
          : <span className="a1-data-table__thumb a1-data-table__thumb--empty" aria-hidden="true" />;
      }

      case "badge": {
        const status = col.statusMap?.[value] ?? "neutral";
        const compact = activeDensity === "compact";
        return (
          <MessageBadge
            status={status}
            subtle
            size={compact ? "sm" : undefined}
            icon={compact ? null : undefined}
          >
            {value}
          </MessageBadge>
        );
      }

      case "link": {
        const config = typeof value === "object"
          ? value
          : { href: "#", label: value };
        const href = config.href ?? "#";
        return (
          <Link
            href={href}
            icon={config.icon}
            iconPosition={config.iconPosition ?? "end"}
            target={config.target}
            rel={config.rel ?? (config.target === "_blank" ? "noreferrer" : undefined)}
          >
            {config.label ?? href}
          </Link>
        );
      }

      case "actions": {
        const actions = Array.isArray(value) ? value : [value];
        return (
          <span className="a1-data-table__actions">
            {actions.filter(Boolean).map((item, index) => {
              const action = typeof item === "object" ? item : { label: String(item) };
              return action.iconOnly ? (
                <IconButton
                  key={`${action.label ?? action.icon ?? "action"}-${index}`}
                  variant={action.variant ?? "tertiary"}
                  size="sm"
                  icon={action.icon}
                  label={action.label}
                  disabled={action.disabled}
                  onClick={action.onClick}
                />
              ) : (
                <Button
                  key={`${action.label ?? action.icon ?? "action"}-${index}`}
                  variant={action.variant ?? "tertiary"}
                  size="sm"
                  icon={action.icon}
                  iconPosition={action.iconPosition ?? "start"}
                  disabled={action.disabled}
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              );
            })}
          </span>
        );
      }

      case "currency": {
        const symbol = col.currencySymbol ?? "$";
        const num = typeof value === "number"
          ? value
          : parseFloat(String(value).replace(/[^0-9.-]/g, ""));
        return isNaN(num)
          ? value
          : `${symbol}${num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
      }

      case "number": {
        const num = typeof value === "number" ? value : parseFloat(value);
        return isNaN(num) ? value : num.toLocaleString("en-US");
      }

      default:
        return value;
    }
  }

  function getAlign(col) {
    if (col.align) return col.align;
    if (col.type === "number" || col.type === "currency" || col.numeric) return "end";
    return "start";
  }

  function getSortIcon(col) {
    if (activeSort?.key !== col.key) return "unfold_more";
    return activeSort.direction === "desc" ? "arrow_downward" : "arrow_upward";
  }

  function getSortAria(col) {
    if (!col.sortable) return undefined;
    if (activeSort?.key !== col.key) return "none";
    return activeSort.direction === "desc" ? "descending" : "ascending";
  }

  function renderMobileCard({ row, rowIndex, rowId, isSelected, supportsRowClickSelection, noticeColSpan }) {
    return (
      <tr className="a1-data-table__mobile-card-row" aria-hidden={resolvedMobileLayout === "table" ? "true" : undefined}>
        <td className="a1-data-table__mobile-card-cell" colSpan={noticeColSpan}>
          <div
            className="a1-data-table__mobile-card"
            data-selected={isSelected ? "true" : undefined}
            data-selectable-row={supportsRowClickSelection ? "true" : undefined}
            onClick={(event) => handleRowClick(rowId, supportsRowClickSelection, event)}
          >
            <dl className="a1-data-table__mobile-definition-list">
              {selectable && (
                <div className="a1-data-table__mobile-definition-item">
                  <dt className="a1-data-table__mobile-definition-label">Select</dt>
                  <dd className="a1-data-table__mobile-definition-value">
                    <SelectionCheckbox
                      checked={isSelected}
                      label={`Select row ${rowIndex + 1}`}
                      onChange={(checked) => toggleRowSelected(rowId, checked)}
                    />
                  </dd>
                </div>
              )}
              {columns.map((col) => (
                <div className="a1-data-table__mobile-definition-item" key={col.key}>
                  <dt className="a1-data-table__mobile-definition-label">{col.label}</dt>
                  <dd className="a1-data-table__mobile-definition-value" data-align={getAlign(col)}>
                    {renderCell(col, row[col.key], row, rowIndex)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </td>
      </tr>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div ref={wrapperRef} className={wrapperClass} {...props}>
      {hasFilterControls && (
        <DataTableFilters
          filters={resolvedFilters}
          value={activeFilterValue}
          onChange={updateFilterValue}
          searchValue={activeSearchValue}
          onSearchChange={onSearchChange != null || searchValue !== undefined || resolvedSearchableColumns.length > 0 ? updateSearchValue : undefined}
          searchColumn={activeSearchColumn}
          onSearchColumnChange={updateSearchColumn}
          searchableColumns={resolvedSearchableColumns}
          sortOptions={sortableColumns.map((column) => ({ key: column.key, label: column.label }))}
          sortValue={activeSortValue}
          onSortValueChange={sortableColumns.length > 0 ? updateMobileSortValue : undefined}
        />
      )}
      {selectable && selectedCount > 0 && (
        <div className="a1-data-table-bulk-actions" role="region" aria-label="Bulk actions">
          <span className="a1-data-table-bulk-actions__count">
            {selectedCount} selected
          </span>
          <div className="a1-data-table-bulk-actions__controls">
            <Button
              variant="tertiary"
              size="sm"
              onClick={() => updateSelectedRowIds([])}
            >
              Clear
            </Button>
            {onDeleteSelected && (
              <Button
                variant="destructive"
                size="sm"
                icon="delete"
                onClick={handleDeleteSelected}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      )}
      {sortableColumns.length > 0 && !hasFilterControls && (
        <div className="a1-data-table-sort">
          <SelectField
            label="Sort"
            size="compact"
            value={activeSort ? `${activeSort.key}:${activeSort.direction}` : ""}
            onChange={handleMobileSortChange}
          >
            <option value="">No sorting</option>
            {sortableColumns.flatMap((col) => [
              <option key={`${col.key}:asc`} value={`${col.key}:asc`}>
                {col.label} ascending
              </option>,
              <option key={`${col.key}:desc`} value={`${col.key}:desc`}>
                {col.label} descending
              </option>,
            ])}
          </SelectField>
        </div>
      )}
      <div className={["a1-data-table-scroll", scrollable && "a1-data-table-scroll--scrollable"].filter(Boolean).join(" ")} tabIndex={scrollable ? 0 : undefined}>
        {filteredRows.length === 0 ? (
          <div className="a1-data-table__empty">
            <MessageEmptyState
              scale="card"
              icon={emptyIcon}
              title={emptyTitle}
              description={emptyDescription}
            />
          </div>
        ) : (
          <table className={tableClass}>
            {caption && <caption>{caption}</caption>}
            <thead>
              <tr>
                {selectable && (
                  <th
                    scope="col"
                    className="a1-data-table__select-header"
                  >
                    <SelectionCheckbox
                      checked={allVisibleSelected}
                      indeterminate={someVisibleSelected && !allVisibleSelected}
                      label={allVisibleSelected ? "Deselect all rows" : "Select all rows"}
                      onChange={toggleAllVisible}
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={getSortAria(col)}
                    data-align={getAlign(col)}
                    style={col.width ? { width: col.width } : undefined}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        className="a1-data-table__sort-button"
                        onClick={() => toggleColumnSort(col)}
                      >
                        <span>{col.label}</span>
                        <Icon
                          name={getSortIcon(col)}
                          className="a1-data-table__sort-icon"
                        />
                      </button>
                    ) : col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(() => {
                const noticeColSpan = selectable ? columns.length + 1 : columns.length;
                const noticeMap = {};
                notices.forEach(({ content, afterRow = 0 }) => {
                  if (!noticeMap[afterRow]) noticeMap[afterRow] = [];
                  noticeMap[afterRow].push(content);
                });
                return visibleRowEntries.map(({ row, index: rowIndex, id: rowId, supportsRowClickSelection }, i) => {
                  const isSelected = selectedRowIdSet.has(rowId);
                  const noticesHere = noticeMap[i] ?? [];
                  return (
                    <Fragment key={rowId}>
                      {noticesHere.map((content, j) => (
                        <tr key={j} className="a1-data-table__notice-row">
                          <td className="a1-data-table__notice-cell" colSpan={noticeColSpan}>{content}</td>
                        </tr>
                      ))}
                      <tr
                        className="a1-data-table__desktop-row"
                        data-selected={isSelected ? "true" : undefined}
                        data-selectable-row={supportsRowClickSelection ? "true" : undefined}
                        onClick={(event) => handleRowClick(rowId, supportsRowClickSelection, event)}
                      >
                        {selectable && (
                          <td
                            className="a1-data-table__select-cell"
                            data-label="Select"
                          >
                            <SelectionCheckbox
                              checked={isSelected}
                              label={`Select row ${rowIndex + 1}`}
                              onChange={(checked) => toggleRowSelected(rowId, checked)}
                            />
                          </td>
                        )}
                        {columns.map((col) => (
                          <td
                            key={col.key}
                            data-label={col.label}
                            data-align={getAlign(col)}
                          >
                            {renderCell(col, row[col.key], row, rowIndex)}
                          </td>
                        ))}
                      </tr>
                      {renderMobileCard({ row, rowIndex, rowId, isSelected, supportsRowClickSelection, noticeColSpan })}
                    </Fragment>
                  );
                });
              })()}
            </tbody>
          </table>
        )}
      </div>

      {(showPagination || filteredRows.length > 0) && (
        <div className="a1-data-table-footer">
          <span className="a1-data-table-footer__count">
            {showPagination
              ? `Showing ${rowStart}–${rowEnd} of ${knownTotal} results`
              : `${filteredRows.length} ${filteredRows.length === 1 ? "result" : "results"}`}
          </span>
          {showPagination && (
            <div className="a1-data-table-footer__controls">
              {pageSizeChoices.length > 1 && (
                <SelectField
                  label="Rows per page"
                  size="compact"
                  value={String(activePageSize)}
                  onChange={(event) => updatePageSize(event.target.value)}
                >
                  {pageSizeChoices.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </SelectField>
              )}
              <Pagination
                page={clampedPage}
                totalPages={resolvedTotalPages}
                onChange={updatePage}
                size="sm"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
