import "./toolbar.css";
import { useId, useRef, useState } from "react";
import { Icon } from "../icon/Icon.jsx";
import { Menu, MenuItem } from "../menu/Menu.jsx";

/** Standard icon for a "none" selection (no alignment, no size, …). */
export const TOOLBAR_NONE_ICON = "block";

const BREAKPOINTS = ["xs", "sm", "md", "lg", "xl"];

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

function isNoneValue(v) {
  return v === "none" || v === null || v === "";
}

/** A responsive `showLabel`/`showLabels` value: `{ xs?, sm?, … }` of booleans. */
function isResponsive(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

/** Is the label shown for any breakpoint? (decides whether the span renders). */
function labelEverShown(showLabel) {
  if (isResponsive(showLabel)) return BREAKPOINTS.some((bp) => showLabel[bp]);
  return !!showLabel;
}

/** Are labels shown at every breakpoint? (decides icon-only fallbacks/aria). */
function labelAlwaysShown(showLabel) {
  return showLabel === true;
}

/** Cascade per-breakpoint visibility classes for the label span (xs → xl). */
function labelVisibilityClasses(showLabel) {
  if (!isResponsive(showLabel)) return [];
  let last = false;
  return BREAKPOINTS.map((bp) => {
    if (typeof showLabel[bp] === "boolean") last = showLabel[bp];
    return `a1-toolbar__label--${last ? "show" : "hide"}-${bp}`;
  });
}

/**
 * Accessible name for a tool button. When labels are always visible the visible
 * text is the name (no aria-label). When they're hidden — or responsively
 * toggled — fall back to an explicit `aria-label` so the name is stable.
 */
function toolAriaLabel(showLabel, label) {
  return labelAlwaysShown(showLabel) ? undefined : label;
}

/**
 * Toolbar — a compact container that groups related editing controls (toggles,
 * single-select button groups, action buttons, selects, menus) on one subtle
 * surface. Think a text-editor toolbar, or the controls in the component
 * configurator. Compose it from the `Toolbar*` sub-components, separating tools
 * with `<ToolbarDivider />`.
 *
 * Pass `label` to render an optional caption above the bar — styled to match the
 * compact ChoiceGroup label so toolbars sit naturally alongside form controls.
 * Pass `overlay` to lift the bar into a floating, elevated surface (shadow +
 * border) for a toolbar that hovers over page content — e.g. a selection
 * formatting bar. The consumer positions the overlay (the bar itself does not
 * choose a location).
 *
 * By default the bar is `fit-content` wide. Pass `fullWidth` to stretch it to
 * fill its container, with the tools growing to share the available space
 * (dividers keep their natural size).
 */
export function Toolbar({
  label,
  overlay = false,
  fullWidth = false,
  "aria-label": ariaLabel,
  className = "",
  children,
  ...rest
}) {
  const labelId = useId();
  const bar = (
    <div
      role="toolbar"
      aria-label={label ? undefined : ariaLabel}
      aria-labelledby={label ? labelId : undefined}
      aria-orientation="horizontal"
      className={cx(
        "a1-toolbar",
        overlay && "a1-toolbar--overlay",
        fullWidth && "a1-toolbar--full-width",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );

  if (!label) return bar;

  return (
    <div className="a1-toolbar-field">
      <span className="a1-toolbar-field__label" id={labelId}>{label}</span>
      {bar}
    </div>
  );
}

/** Visual separator between tools within a Toolbar. */
export function ToolbarDivider() {
  return <span className="a1-toolbar__divider" role="separator" aria-orientation="vertical" />;
}

function ToolButtonContent({ icon, label, showLabel, swatch }) {
  const renderLabel = label != null && labelEverShown(showLabel);
  const labelClass = cx("a1-toolbar__label", ...labelVisibilityClasses(showLabel));
  return (
    <>
      {swatch ? <span className="a1-toolbar__swatch" style={{ background: swatch }} aria-hidden="true" /> : null}
      {icon ? <Icon name={icon} size="sm" /> : null}
      {renderLabel ? <span className={labelClass}>{label}</span> : null}
    </>
  );
}

/** A two-state toggle button (e.g. bold on/off). */
export function ToolbarToggle({
  icon,
  label,
  swatch,
  pressed = false,
  onChange,
  showLabel = false,
  disabled = false,
  className = "",
  ...rest
}) {
  return (
    <button
      type="button"
      className={cx("a1-toolbar__button", className)}
      aria-pressed={pressed}
      aria-label={toolAriaLabel(showLabel, label)}
      title={label}
      disabled={disabled}
      onClick={() => onChange?.(!pressed)}
      {...rest}
    >
      <ToolButtonContent icon={icon} label={label} showLabel={showLabel} swatch={swatch} />
    </button>
  );
}

/** A plain action button inside a Toolbar (no pressed state). */
export function ToolbarButton({
  icon,
  label,
  swatch,
  onClick,
  showLabel = false,
  disabled = false,
  className = "",
  ...rest
}) {
  return (
    <button
      type="button"
      className={cx("a1-toolbar__button", className)}
      aria-label={toolAriaLabel(showLabel, label)}
      title={label}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      <ToolButtonContent icon={icon} label={label} showLabel={showLabel} swatch={swatch} />
    </button>
  );
}

/**
 * A toolbar button that opens a dropdown `Menu` of choices (e.g. a list-type
 * picker: none / bulleted / numbered / checklist, or a text-size picker). The
 * button carries a small
 * caret to signal that it opens a menu. When `value` is set, the matching item
 * is marked active and — unless an explicit `icon` is given — the button shows
 * that item's icon so the toolbar reflects the current selection.
 */
export function ToolbarMenu({
  icon,
  label,
  value,
  onChange,
  items = [],
  showLabel = false,
  disabled = false,
  "aria-label": ariaLabel,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const active = items.find((it) => it.value === value);
  const buttonIcon = icon ?? active?.icon;
  const name = ariaLabel ?? label;

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className={cx("a1-toolbar__button", "a1-toolbar__menu-button", className)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={ariaLabel ?? toolAriaLabel(showLabel, label)}
        title={label}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
      >
        <ToolButtonContent icon={buttonIcon} label={label} showLabel={showLabel} />
        <Icon name="arrow_drop_down" size="sm" className="a1-toolbar__caret" />
      </button>
      <Menu open={open} onClose={() => setOpen(false)} anchorRef={btnRef} aria-label={name}>
        {items.map((it) => (
          <MenuItem
            key={String(it.value)}
            icon={it.icon}
            active={it.value === value}
            disabled={it.disabled}
            onClick={() => { onChange?.(it.value); setOpen(false); }}
          >
            {it.label ?? String(it.value)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

/**
 * A single-select button group (radio semantics) — e.g. text alignment, or a
 * compact `columns`-wide grid like a 3×3 crop-direction picker. Mutually
 * exclusive options with clearly highlighted selection, in far less space than a
 * ChoiceGroup.
 */
export function ToolbarGroup({
  value,
  onChange,
  options = [],
  columns,
  showLabels = false,
  labelMode = "all",
  "aria-label": ariaLabel,
  disabled = false,
  className = "",
}) {
  const btnRefs = useRef([]);
  const grid = typeof columns === "number" && columns > 0;
  const selectedIndex = options.findIndex((o) => o.value === value);

  function move(index, select = true) {
    const n = options.length;
    const idx = ((index % n) + n) % n;
    btnRefs.current[idx]?.focus();
    if (select) onChange?.(options[idx].value);
  }

  function handleKeyDown(e, i) {
    const n = options.length;
    let next = null;
    let clampVertical = false;
    switch (e.key) {
      case "ArrowRight": next = i + 1; break;
      case "ArrowLeft": next = i - 1; break;
      case "ArrowDown": next = grid ? i + columns : i + 1; clampVertical = grid; break;
      case "ArrowUp": next = grid ? i - columns : i - 1; clampVertical = grid; break;
      case "Home": next = 0; break;
      case "End": next = n - 1; break;
      default: return;
    }
    e.preventDefault();
    // Vertical moves in a grid clamp (don't wrap to a wrong column); everything
    // else wraps around the linear order.
    if (clampVertical) {
      if (next < 0 || next >= n) return;
      move(next);
    } else {
      move(next);
    }
  }

  const style = grid ? { "--a1-toolbar-grid-columns": columns } : undefined;

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cx("a1-toolbar__group", grid && "a1-toolbar__group--grid", className)}
      style={style}
    >
      {options.map((opt, i) => {
        const selected = i === selectedIndex;
        // Roving tabindex: the selected option (or the first, when none is
        // selected) is the single tab stop for the group.
        const tabIndex = selected || (selectedIndex === -1 && i === 0) ? 0 : -1;
        const optLabel = opt.label ?? String(opt.value);
        // `labelMode="selected"` shows the label only on the selected option;
        // the rest fall back to icon/swatch-only (and "none" to its icon).
        const optShowLabel = labelMode === "selected" ? selected : showLabels;
        const icon = opt.icon ?? (!labelAlwaysShown(optShowLabel) && isNoneValue(opt.value) ? TOOLBAR_NONE_ICON : undefined);
        return (
          <button
            key={String(opt.value)}
            ref={(el) => { btnRefs.current[i] = el; }}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={toolAriaLabel(optShowLabel, optLabel)}
            title={optLabel}
            tabIndex={tabIndex}
            disabled={disabled || opt.disabled}
            className="a1-toolbar__button"
            onClick={() => onChange?.(opt.value)}
            onKeyDown={(e) => handleKeyDown(e, i)}
          >
            <ToolButtonContent icon={icon} label={opt.label} showLabel={optShowLabel} swatch={opt.swatch} />
          </button>
        );
      })}
    </div>
  );
}
