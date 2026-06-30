import { useRef, useState } from "react";
import { Button } from "../button/Button.jsx";
import { Icon } from "../icon/Icon.jsx";
import { Menu, MenuSection, MenuItem } from "../menu/Menu.jsx";
import "./data-table-filters.css";

/**
 * filters: Array<{
 *   key: string,
 *   label: string,
 *   type?: "single" | "multi",   default "single"
 *   options: Array<{ value: string, label: string }>,
 * }>
 * value: Record<string, string | string[]>
 *   single → string ("" = no filter)
 *   multi  → string[] ([] = no filter)
 *
 * searchValue?: string
 * onSearchChange?: (text: string) => void
 * searchColumn?: string          — key of column being searched; "" = all
 * onSearchColumnChange?: (key: string) => void
 * searchableColumns?: Array<{ key: string, label: string }>
 */

// ── Helpers ──────────────────────────────────────────────────────────────────

function getSublabel(filter, selected) {
  if (filter.type === "multi") {
    const arr = Array.isArray(selected) ? selected : [];
    if (arr.length === 0) return null;
    if (arr.length === 1) return filter.options.find((o) => o.value === arr[0])?.label ?? arr[0];
    return `${arr.length}`;
  }
  if (!selected) return null;
  return filter.options.find((o) => o.value === selected)?.label ?? selected;
}

function isFilterActive(filter, selected) {
  if (filter.type === "multi") return Array.isArray(selected) && selected.length > 0;
  return Boolean(selected);
}

function radioIcon(checked) { return checked ? "radio_button_checked" : "radio_button_unchecked"; }
function checkIcon(checked) { return checked ? "check_box"            : "check_box_outline_blank"; }

// ── FilterChip (desktop only) ─────────────────────────────────────────────────

function FilterChip({ filter, selected, onSet }) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const isMulti  = filter.type === "multi";
  const arr      = isMulti ? (Array.isArray(selected) ? selected : []) : null;
  const sublabel = getSublabel(filter, selected);
  const isActive = isFilterActive(filter, selected);

  function handleOption(optValue) {
    if (isMulti) {
      const next = arr.includes(optValue)
        ? arr.filter((v) => v !== optValue)
        : [...arr, optValue];
      onSet(next);
      // keep open so user can pick multiple
    } else {
      onSet(selected === optValue ? "" : optValue);
      setOpen(false); // close after single pick
    }
  }

  return (
    <div className="a1-dt-filters__chip-wrap">
      <button
        ref={anchorRef}
        type="button"
        className={[
          "a1-dt-filters__chip",
          isActive && "a1-dt-filters__chip--active",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span>{filter.label}</span>
        {sublabel && (
          <>
            <span className="a1-dt-filters__chip-sep" aria-hidden="true">:</span>
            <span className="a1-dt-filters__chip-value">{sublabel}</span>
          </>
        )}
        <Icon
          name={open ? "expand_less" : "expand_more"}
          className="a1-dt-filters__chip-icon"
        />
      </button>

      <Menu
        open={open}
        anchorRef={anchorRef}
        onClose={() => setOpen(false)}
        aria-label={filter.label}
      >
        {!isMulti && (
          <MenuItem
            key="__all__"
            icon={radioIcon(!selected)}
            className={!selected ? "a1-dt-filters__item--on" : ""}
            onClick={() => { onSet(""); setOpen(false); }}
          >
            All
          </MenuItem>
        )}
        {filter.options.map((opt) => {
          const checked = isMulti ? arr.includes(opt.value) : selected === opt.value;
          const icon    = isMulti ? checkIcon(checked) : radioIcon(checked);
          return (
            <MenuItem
              key={opt.value}
              icon={icon}
              className={checked ? "a1-dt-filters__item--on" : ""}
              onClick={() => handleOption(opt.value)}
            >
              {opt.label}
            </MenuItem>
          );
        })}
        {isMulti && isActive && (
          <div className="a1-dt-filters__menu-clear">
            <Button
              variant="tertiary"
              size="sm"
              icon="close"
              onClick={() => { onSet([]); setOpen(false); }}
            >
              Clear
            </Button>
          </div>
        )}
      </Menu>
    </div>
  );
}

// ── DataTableFilters ──────────────────────────────────────────────────────────

export function DataTableFilters({
  filters = [],
  value = {},
  onChange,
  searchValue = "",
  onSearchChange,
  searchColumn = "",
  onSearchColumnChange,
  searchableColumns,
  className = "",
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileTriggerRef = useRef(null);

  const hasSearch = Boolean(onSearchChange);

  const activeCount = filters.filter((f) => isFilterActive(f, value[f.key])).length;
  const hasActive   = activeCount > 0 || Boolean(searchValue);

  function set(key, val) {
    onChange?.({ ...value, [key]: val });
  }

  function clearAll() {
    const cleared = {};
    filters.forEach((f) => { cleared[f.key] = f.type === "multi" ? [] : ""; });
    onChange?.(cleared);
    onSearchChange?.("");
  }

  // ── Search field (shared between desktop and mobile) ──────────────────────

  const searchField = hasSearch && (
    <div className="a1-dt-filters__search-wrap">
      <Icon name="search" className="a1-dt-filters__search-icon" />
      <input
        type="search"
        className="a1-dt-filters__search-input"
        data-a1-page-search=""
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search…"
        aria-label={searchColumn
          ? `Search in ${searchableColumns?.find((c) => c.key === searchColumn)?.label ?? searchColumn}`
          : "Search all fields"}
      />
      {searchableColumns?.length > 0 && (
        <div className="a1-dt-filters__scope-wrap">
          <select
            className="a1-dt-filters__scope-select"
            value={searchColumn}
            onChange={(e) => onSearchColumnChange?.(e.target.value)}
            aria-label="Search in field"
          >
            <option value="">All fields</option>
            {searchableColumns.map((col) => (
              <option key={col.key} value={col.key}>{col.label}</option>
            ))}
          </select>
          <Icon name="expand_more" className="a1-dt-filters__scope-icon" />
        </div>
      )}
    </div>
  );

  return (
    <div className={["a1-dt-filters", className].filter(Boolean).join(" ")}>

      {/* ── Desktop: search + chip row (hidden at xs) ──────────────────── */}
      <div className="a1-dt-filters__desktop">
        {searchField}

        {filters.length > 0 && (
          <>
            <span className="a1-dt-filters__label">Filters</span>
            <div className="a1-dt-filters__chips">
              {filters.map((f) => (
                <FilterChip
                  key={f.key}
                  filter={f}
                  selected={value[f.key] ?? (f.type === "multi" ? [] : "")}
                  onSet={(v) => set(f.key, v)}
                />
              ))}
            </div>
          </>
        )}

        {hasActive && (
          <Button variant="secondary" size="sm" onClick={clearAll} className="a1-dt-filters__clear-all">
            Clear all
          </Button>
        )}
      </div>

      {/* ── Mobile / xs: search always visible + menu button ───────────── */}
      <div className="a1-dt-filters__mobile">
        {searchField}

        {filters.length > 0 && (
          <div ref={mobileTriggerRef} className="a1-dt-filters__mobile-trigger">
            <Button
              variant="secondary"
              size="sm"
              icon="filter_list"
              onClick={() => setMobileOpen(true)}
            >
              Filters
              {activeCount > 0 && (
                <span
                  className="a1-dt-filters__mobile-count"
                  aria-label={`${activeCount} active`}
                >
                  {activeCount}
                </span>
              )}
            </Button>
          </div>
        )}

        {hasActive && (
          <Button variant="secondary" size="sm" onClick={clearAll}>
            Clear all
          </Button>
        )}

        {filters.length > 0 && (
          <Menu
            open={mobileOpen}
            anchorRef={mobileTriggerRef}
            onClose={() => setMobileOpen(false)}
            aria-label="Filters"
          >
            {filters.map((f) => {
              const isMulti = f.type === "multi";
              const val     = value[f.key];
              const arr     = isMulti ? (Array.isArray(val) ? val : []) : null;

              return (
                <MenuSection key={f.key} label={f.label}>
                  {!isMulti && (
                    <MenuItem
                      key="__all__"
                      icon={radioIcon(!val)}
                      className={!val ? "a1-dt-filters__item--on" : ""}
                      onClick={() => set(f.key, "")}
                    >
                      All
                    </MenuItem>
                  )}
                  {f.options.map((opt) => {
                    const checked = isMulti ? arr.includes(opt.value) : val === opt.value;
                    const icon    = isMulti ? checkIcon(checked) : radioIcon(checked);
                    return (
                      <MenuItem
                        key={opt.value}
                        icon={icon}
                        className={checked ? "a1-dt-filters__item--on" : ""}
                        onClick={() => {
                          if (isMulti) {
                            const next = arr.includes(opt.value)
                              ? arr.filter((v) => v !== opt.value)
                              : [...arr, opt.value];
                            set(f.key, next);
                          } else {
                            set(f.key, val === opt.value ? "" : opt.value);
                          }
                        }}
                      >
                        {opt.label}
                      </MenuItem>
                    );
                  })}
                </MenuSection>
              );
            })}

            {hasActive && (
              <div className="a1-dt-filters__menu-clear">
                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={() => { clearAll(); setMobileOpen(false); }}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </Menu>
        )}
      </div>
    </div>
  );
}
