import { useEffect, useRef, useState } from "react";
import { Button } from "../button/Button.jsx";
import { SelectField } from "../field/SelectField.jsx";
import { Icon } from "../icon/Icon.jsx";
import { Link } from "../link/Link.jsx";
import { MessageBadge, MessageEmptyState } from "../message/Message.jsx";
import { Pagination } from "../pagination/Pagination.jsx";
import "./data-table.css";

/**
 * columns: Array<{
 *   key: string,
 *   label: string,
 *   type?: "text" | "number" | "currency" | "date" | "badge" | "avatar" | "link" | "actions",
 *   align?: "start" | "center" | "end",
 *   width?: string,
 *   sortable?: boolean,
 *   sortAccessor?: (row: Record<string, any>) => any,
 *   statusMap?: Record<string, "neutral"|"info"|"success"|"warn"|"error">,
 *   currencySymbol?: string,
 * }>
 * rows: Array<Record<string, any>>
 * getRowId?: (row: Record<string, any>, index: number) => string | number
 * density?: "auto" | "comfortable" | "default" | "compact"
 *   "auto" (default) — switches between densities based on available width and column definitions
 */

// Estimated minimum content width per column type at a "neutral" padding level
const COL_BASE_WIDTH = {
  avatar:   160,  // avatar circle + name text
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

function isInteractiveColumn(col) {
  return col.type === "link" || col.type === "actions";
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
  density = "default",
  zebra = false,
  scrollable = false,
  caption,
  page,
  totalPages,
  totalRows,
  onPageChange,
  sort,
  defaultSort,
  onSortChange,
  selectable = false,
  selectedRowIds,
  defaultSelectedRowIds = [],
  onSelectedRowIdsChange,
  onDeleteSelected,
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
  const [internalSelectedRowIds, setInternalSelectedRowIds] = useState(() => normalizeRowIds(defaultSelectedRowIds));

  const isAuto = density === "auto";
  const isSortControlled = sort !== undefined;
  const isSelectionControlled = selectedRowIds !== undefined;
  const activeDensity = isAuto ? autoDensity : density;
  const activeSort = isSortControlled ? normalizeSort(sort) : internalSort;
  const activeSelectedRowIds = isSelectionControlled
    ? normalizeRowIds(selectedRowIds)
    : internalSelectedRowIds;
  const selectedRowIdSet = new Set(activeSelectedRowIds);

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

  // ── Derived values ──────────────────────────────────────────────────────

  const tableClass = [
    "a1-data-table",
    activeDensity !== "default" && `a1-data-table--${activeDensity}`,
    zebra && "a1-data-table--zebra",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const showPagination = totalPages != null && totalPages > 1;
  const rowStart = page != null ? (page - 1) * rows.length + 1 : 1;
  const rowEnd   = page != null ? rowStart + rows.length - 1 : rows.length;
  const knownTotal = totalRows ?? (showPagination ? totalPages * rows.length : rows.length);
  const sortableColumns = columns.filter((col) => col.sortable);
  const sortedRows = activeSort
    ? [...rows].sort((a, b) => {
      const col = columns.find((column) => column.key === activeSort.key);
      if (!col) return 0;

      const result = compareSortValues(getSortValue(a, col), getSortValue(b, col));
      return activeSort.direction === "desc" ? -result : result;
    })
    : rows;
  const visibleRowEntries = sortedRows.map((row, index) => ({
    row,
    index,
    id: String(getRowId(row, index)),
    supportsRowClickSelection: selectable && !columns.some((col) =>
      isInteractiveColumn(col) && hasInteractiveValue(row[col.key])
    ),
  }));
  const selectedRows = visibleRowEntries
    .filter((entry) => selectedRowIdSet.has(entry.id))
    .map((entry) => entry.row);
  const selectedCount = activeSelectedRowIds.length;
  const allVisibleSelected = visibleRowEntries.length > 0
    && visibleRowEntries.every((entry) => selectedRowIdSet.has(entry.id));
  const someVisibleSelected = visibleRowEntries.some((entry) => selectedRowIdSet.has(entry.id));

  function updateSort(nextSort) {
    if (!isSortControlled) setInternalSort(nextSort);
    onSortChange?.(nextSort);
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
    const value = event.target.value;
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
    if (event.target.closest("a, button, input, select, textarea, label")) return;
    toggleRowSelected(rowId, !selectedRowIdSet.has(rowId));
  }

  // ── Cell rendering ──────────────────────────────────────────────────────

  function renderCell(col, value) {
    if (value == null || value === "") return "—";

    switch (col.type) {
      case "avatar": {
        const initials = String(value)
          .split(" ")
          .slice(0, 2)
          .map((w) => w[0])
          .join("")
          .toUpperCase();
        return (
          <span className="a1-data-table__avatar-cell">
            <span className="a1-data-table__avatar" aria-hidden="true">{initials}</span>
            <span>{value}</span>
          </span>
        );
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
          : { href: value, label: value };
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
            {actions.filter(Boolean).map((action, index) => (
              <Button
                key={`${action.label ?? action.icon ?? "action"}-${index}`}
                variant="tertiary"
                size="sm"
                icon={action.icon}
                iconPosition={action.iconPosition ?? "start"}
                disabled={action.disabled}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ))}
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

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div ref={wrapperRef} className="a1-data-table-wrapper" {...props}>
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
      {sortableColumns.length > 0 && (
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
      <div className={["a1-data-table-scroll", scrollable && "a1-data-table-scroll--scrollable"].filter(Boolean).join(" ")}>
        {rows.length === 0 ? (
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
              {visibleRowEntries.map(({ row, index: rowIndex, id: rowId, supportsRowClickSelection }) => {
                const isSelected = selectedRowIdSet.has(rowId);
                return (
                  <tr
                    key={rowId}
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
                        {renderCell(col, row[col.key])}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {(showPagination || rows.length > 0) && (
        <div className="a1-data-table-footer">
          <span className="a1-data-table-footer__count">
            {showPagination
              ? `Showing ${rowStart}–${rowEnd} of ${knownTotal} results`
              : `${rows.length} ${rows.length === 1 ? "result" : "results"}`}
          </span>
          {showPagination && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={onPageChange}
              size="sm"
            />
          )}
        </div>
      )}
    </div>
  );
}
