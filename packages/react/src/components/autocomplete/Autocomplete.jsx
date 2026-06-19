import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "../icon/Icon.jsx";
import { MessageBadge } from "../message/Message.jsx";
import { useLabel } from "../labels/Labels.jsx";
import "./autocomplete.css";

const SIZES = ["compact", "default", "comfortable"];

function normalizeOption(o) {
  return typeof o === "string" ? { value: o, label: o } : o;
}

/**
 * Autocomplete — a combobox that filters a list of options as you type, in
 * single- or multi-select mode. Optionally lets the user create a value that
 * isn't in the list (`allowCreate`). Built on the ARIA combobox/listbox pattern
 * and styled to match the A1 field family.
 */
const VARIANTS = ["default", "color"];

export function Autocomplete({
  options = [],
  value,
  onChange,
  multiple = false,
  allowCreate = false,
  onCreate,
  variant = "default",
  label,
  hint,
  error,
  size,
  required = false,
  disabled = false,
  id: providedId,
  name,
  className = "",
  emptyText = "No matches",
  createLabel = (q) => `Add “${q}”`,
  "aria-label": ariaLabel,
  ...props
}) {
  const autoId = useId();
  const id = providedId ?? autoId;
  const listId = `${id}-listbox`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const resolvedSize = SIZES.includes(size) ? size : "default";
  const resolvedVariant = VARIANTS.includes(variant) ? variant : "default";
  const requiredText = useLabel("field.required", "Required");

  const items = useMemo(() => options.map(normalizeOption), [options]);
  const selectedValues = multiple
    ? (Array.isArray(value) ? value : [])
    : (value != null && value !== "" ? [value] : []);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const rootRef = useRef(null);
  const controlRef = useRef(null);
  const listRef = useRef(null);
  // The listbox is portaled to <body> so it escapes any clipping ancestor
  // (e.g. an Accordion's overflow:hidden panel); position it under the control.
  const [menuPos, setMenuPos] = useState(null);

  const labelFor = (v) => items.find((i) => i.value === v)?.label ?? v;
  // A swatch colour for a value: an explicit option `swatch`, or the value
  // itself when it's a CSS colour (the common case for a colour picker).
  const swatchFor = (v) => {
    const opt = items.find((i) => i.value === v);
    if (opt && opt.swatch) return opt.swatch;
    return resolvedVariant === "color" ? v : undefined;
  };
  const selectedLabel = !multiple && selectedValues.length ? labelFor(selectedValues[0]) : "";
  const selectedSwatch = !multiple && selectedValues.length ? swatchFor(selectedValues[0]) : undefined;

  const q = query.trim().toLowerCase();
  // In multi mode, keep selected options in the list (shown checked) so they can
  // be toggled off; in single mode the list is just the filter results.
  const filtered = items.filter((i) => !q || i.label.toLowerCase().includes(q));
  const exactExists = items.some((i) => i.label.toLowerCase() === q || String(i.value).toLowerCase() === q);
  const showCreate = allowCreate && q.length > 0 && !exactExists
    && !(multiple && selectedValues.includes(query.trim()));
  const visible = showCreate
    ? [...filtered, { __create: true, value: query.trim(), label: createLabel(query.trim()) }]
    : filtered;

  // Close on outside interaction. The portaled listbox lives outside rootRef, so
  // ignore clicks within it too.
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (rootRef.current?.contains(e.target)) return;
      if (listRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  // Track the control's viewport rect while open so the fixed-position listbox
  // follows it through scrolling/resizing of any ancestor.
  useLayoutEffect(() => {
    if (!open || disabled) return undefined;
    const update = () => {
      const el = controlRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setMenuPos({ top: r.bottom, left: r.left, width: r.width });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, disabled]);

  // On open, highlight the currently-selected option so the menu opens focused
  // on it (single-select; in multi mode the first selected value).
  useEffect(() => {
    if (!open) return;
    if (selectedValues.length === 0) { setActiveIndex(-1); return; }
    const idx = visible.findIndex((o) => !o.__create && o.value === selectedValues[0]);
    if (idx >= 0) setActiveIndex(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Keep the active option scrolled into view (on open + arrow navigation).
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const el = listRef.current?.querySelector(".a1-autocomplete__option--active");
    el?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex, menuPos]);

  function commit(option) {
    if (!option) return;
    if (option.__create) onCreate?.(option.value);
    const v = option.value;
    if (multiple) {
      // Toggle: re-selecting a checked option removes it. The menu stays open
      // until the user dismisses it (outside click / Escape).
      if (selectedValues.includes(v)) onChange?.(selectedValues.filter((x) => x !== v));
      else onChange?.([...selectedValues, v]);
      setQuery("");
      setActiveIndex(-1);
      setOpen(true);
      inputRef.current?.focus();
    } else {
      onChange?.(v);
      setQuery("");
      setOpen(false);
    }
  }

  function removeValue(v) {
    if (multiple) onChange?.(selectedValues.filter((x) => x !== v));
    else onChange?.("");
  }

  function handleKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.min(i + 1, visible.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (open && activeIndex >= 0 && visible[activeIndex]) { e.preventDefault(); commit(visible[activeIndex]); }
      else if (open && visible.length === 1) { e.preventDefault(); commit(visible[0]); }
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Backspace" && multiple && query === "" && selectedValues.length) {
      removeValue(selectedValues[selectedValues.length - 1]);
    }
  }

  const describedBy = [error ? errorId : hint ? hintId : null].filter(Boolean).join(" ") || undefined;
  const inputValue = multiple ? query : (open ? query : selectedLabel);

  const classes = [
    "a1-autocomplete",
    `a1-autocomplete--${resolvedSize}`,
    resolvedVariant === "color" && "a1-autocomplete--color",
    multiple && "a1-autocomplete--multiple",
    error && "a1-autocomplete--error",
    required && "a1-autocomplete--required",
    disabled && "a1-autocomplete--disabled",
    open && "a1-autocomplete--open",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={classes} ref={rootRef} {...props}>
      {label && (
        <label className="a1-autocomplete__label" htmlFor={id}>
          {label}
          {required && resolvedSize === "comfortable" ? (
            <MessageBadge status="info" subtle size="sm" icon={null}>{requiredText}</MessageBadge>
          ) : required ? (
            <span className="a1-autocomplete__asterisk" aria-hidden="true"> *</span>
          ) : null}
        </label>
      )}

      <div
        ref={controlRef}
        className="a1-autocomplete__control"
        onClick={() => { if (!disabled) { setOpen(true); inputRef.current?.focus(); } }}
      >
        {multiple && selectedValues.map((v) => (
          <span key={v} className="a1-autocomplete__chip">
            {swatchFor(v) && <span className="a1-autocomplete__swatch" style={{ background: swatchFor(v) }} aria-hidden="true" />}
            {labelFor(v)}
            <button
              type="button"
              className="a1-autocomplete__chip-remove"
              aria-label={`Remove ${labelFor(v)}`}
              disabled={disabled}
              onClick={(e) => { e.stopPropagation(); removeValue(v); }}
            >
              <Icon name="close" />
            </button>
          </span>
        ))}

        {!multiple && selectedSwatch && (
          <span className="a1-autocomplete__swatch a1-autocomplete__swatch--leading" style={{ background: selectedSwatch }} aria-hidden="true" />
        )}

        <input
          ref={inputRef}
          id={id}
          name={name}
          className="a1-autocomplete__input"
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-label={ariaLabel}
          aria-activedescendant={open && activeIndex >= 0 ? `${id}-opt-${activeIndex}` : undefined}
          aria-describedby={describedBy}
          autoComplete="off"
          disabled={disabled}
          required={required && selectedValues.length === 0}
          value={inputValue}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setActiveIndex(-1); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />

        {!multiple && selectedValues.length > 0 && !disabled && (
          <button
            type="button"
            className="a1-autocomplete__clear"
            aria-label="Clear selection"
            onClick={(e) => { e.stopPropagation(); removeValue(selectedValues[0]); setQuery(""); inputRef.current?.focus(); }}
          >
            <Icon name="close" />
          </button>
        )}
        <Icon name="expand_more" className="a1-autocomplete__chevron" aria-hidden="true" />
      </div>

      {open && !disabled && menuPos && createPortal(
        <ul
          ref={listRef}
          className="a1-autocomplete__listbox a1-autocomplete__listbox--floating"
          role="listbox"
          id={listId}
          aria-multiselectable={multiple || undefined}
          style={{ position: "fixed", top: menuPos.top, left: menuPos.left, width: menuPos.width }}
        >
          {visible.length === 0 ? (
            <li className="a1-autocomplete__empty">{emptyText}</li>
          ) : visible.map((opt, idx) => {
            const isSelected = !opt.__create && selectedValues.includes(opt.value);
            return (
              <li
                key={opt.__create ? `__create-${opt.value}` : opt.value}
                id={`${id}-opt-${idx}`}
                role="option"
                aria-selected={isSelected}
                className={[
                  "a1-autocomplete__option",
                  idx === activeIndex && "a1-autocomplete__option--active",
                  opt.__create && "a1-autocomplete__option--create",
                ].filter(Boolean).join(" ")}
                onMouseDown={(e) => { e.preventDefault(); commit(opt); }}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                {opt.__create && <Icon name="add" className="a1-autocomplete__option-icon" aria-hidden="true" />}
                {multiple && !opt.__create && (
                  <span className={`a1-autocomplete__checkbox${isSelected ? " a1-autocomplete__checkbox--on" : ""}`} aria-hidden="true" />
                )}
                {!opt.__create && swatchFor(opt.value) && (
                  <span className="a1-autocomplete__swatch" style={{ background: swatchFor(opt.value) }} aria-hidden="true" />
                )}
                <span className="a1-autocomplete__option-label">{opt.label}</span>
                {!multiple && isSelected && <Icon name="check" className="a1-autocomplete__option-check" aria-hidden="true" />}
              </li>
            );
          })}
        </ul>,
        // When inside a modal <dialog> (top layer), portal into it so the
        // listbox joins the dialog's top-layer stack and isn't painted behind
        // it. Otherwise portal to <body>. See "Z-index and Layering" in
        // project-foundations.md.
        controlRef.current?.closest("dialog") ?? document.body,
      )}

      {error ? (
        <p className="a1-autocomplete__message a1-autocomplete__message--error" id={errorId}>{error}</p>
      ) : hint ? (
        <p className="a1-autocomplete__message a1-autocomplete__message--hint" id={hintId}>{hint}</p>
      ) : null}
    </div>
  );
}
