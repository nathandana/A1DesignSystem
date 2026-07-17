import { Children, cloneElement, forwardRef, isValidElement, useId, useRef, useState } from "react";
import "./chip.css";
import { Icon } from "../icon/Icon.jsx";
import { Menu } from "../menu/Menu.jsx";

const SIZES = ["sm", "md", "lg"];
const SELECTION_MODES = ["none", "single", "multiple"];

function getValue(child) {
  if (!isValidElement(child)) return undefined;
  return child.props.value ?? child.props.title ?? child.props.children;
}

function isSelectedValue(selectionMode, value, selectedValue) {
  if (selectionMode === "multiple") {
    return Array.isArray(selectedValue) && selectedValue.includes(value);
  }
  if (selectionMode === "single") return selectedValue === value;
  // selectionMode "none" carries no selection semantics: return undefined so
  // `__selected ?? selected` lets each chip's own `selected` prop stand
  // (filter/menu chips inside non-selectable rows).
  return undefined;
}

function nextValue(selectionMode, value, currentValue) {
  if (selectionMode === "multiple") {
    const current = Array.isArray(currentValue) ? currentValue : [];
    return current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
  }
  if (selectionMode === "single") return currentValue === value ? "" : value;
  return currentValue;
}

export const Chip = forwardRef(function Chip({
  as,
  href,
  icon,
  title,
  children,
  selected = false,
  disabled = false,
  size = "md",
  menu,
  menuLabel,
  onClick,
  className = "",
  __selectionMode,
  __onSelect,
  __selected,
  ...props
}, forwardedRef) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const hasMenu = Boolean(menu);
  const resolvedSize = SIZES.includes(size) ? size : "md";
  const resolvedSelected = Boolean(__selected ?? selected);
  const selectionMode = SELECTION_MODES.includes(__selectionMode) ? __selectionMode : "none";
  const label = title ?? children;
  const Component = as ?? (href ? "a" : "button");
  const isButton = Component === "button";
  const interactiveProps = isButton ? { type: "button", disabled } : disabled ? { "aria-disabled": true } : {};
  const selectionProps = selectionMode === "single"
    ? { role: "radio", "aria-checked": resolvedSelected }
    : selectionMode === "multiple"
      ? { role: "checkbox", "aria-checked": resolvedSelected }
      : {};

  function handleClick(event) {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (hasMenu) {
      event.preventDefault();
      setOpen((current) => !current);
      return;
    }
    __onSelect?.();
  }

  return (
    <>
      <Component
        ref={(node) => {
          anchorRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        href={href}
        className={[
          "a1-chip",
          resolvedSize !== "md" && `a1-chip--${resolvedSize}`,
          resolvedSelected && "a1-chip--selected",
          hasMenu && "a1-chip--menu",
          disabled && "a1-chip--disabled",
          className,
        ].filter(Boolean).join(" ")}
        aria-haspopup={hasMenu ? "menu" : undefined}
        aria-expanded={hasMenu ? open : undefined}
        {...selectionProps}
        {...interactiveProps}
        {...props}
        onClick={handleClick}
      >
        {icon && <Icon name={icon} className="a1-chip__icon" aria-hidden="true" />}
        <span className="a1-chip__title">{label}</span>
        {hasMenu && <Icon name={open ? "expand_less" : "expand_more"} className="a1-chip__chevron" aria-hidden="true" />}
      </Component>
      {hasMenu && (
        <Menu
          open={open}
          anchorRef={anchorRef}
          onClose={() => setOpen(false)}
          aria-label={menuLabel ?? (typeof label === "string" ? label : "Chip menu")}
        >
          {typeof menu === "function" ? menu({ close: () => setOpen(false) }) : menu}
        </Menu>
      )}
    </>
  );
});

export function ChipGroup({
  selectionMode = "none",
  value,
  defaultValue,
  onChange,
  wrap = true,
  size = "md",
  label,
  className = "",
  children,
  ...props
}) {
  const autoId = useId();
  const resolvedSelectionMode = SELECTION_MODES.includes(selectionMode) ? selectionMode : "none";
  const [internalValue, setInternalValue] = useState(defaultValue ?? (resolvedSelectionMode === "multiple" ? [] : ""));
  const currentValue = value !== undefined ? value : internalValue;
  const groupRole = resolvedSelectionMode === "none" ? "group" : resolvedSelectionMode === "single" ? "radiogroup" : "group";
  const labelId = label ? `${autoId}-label` : undefined;

  function select(childValue) {
    if (resolvedSelectionMode === "none") return;
    const next = nextValue(resolvedSelectionMode, childValue, currentValue);
    if (value === undefined) setInternalValue(next);
    onChange?.(next);
  }

  function handleKeyDown(event) {
    if (resolvedSelectionMode !== "single") return;
    const chips = Array.from(event.currentTarget.querySelectorAll('[role="radio"]'))
      .filter((chip) => chip.getAttribute("aria-disabled") !== "true" && !chip.disabled);
    const index = chips.indexOf(document.activeElement);
    if (index < 0) return;

    let nextIndex = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % chips.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + chips.length) % chips.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = chips.length - 1;

    if (nextIndex >= 0) {
      event.preventDefault();
      const nextChip = chips[nextIndex];
      nextChip.focus();
      nextChip.click();
    }
  }

  const items = Children.toArray(children).filter(Boolean);

  return (
    <div
      className={[
        "a1-chip-group",
        !wrap && "a1-chip-group--nowrap",
        className,
      ].filter(Boolean).join(" ")}
      role={groupRole}
      aria-labelledby={labelId}
      {...props}
      onKeyDown={(event) => {
        props.onKeyDown?.(event);
        if (!event.defaultPrevented) handleKeyDown(event);
      }}
    >
      {label && <span id={labelId} className="a1-chip-group__label">{label}</span>}
      <div className="a1-chip-group__items">
        {items.map((child, index) => {
          if (!isValidElement(child)) return child;
          const childValue = getValue(child);
          const selected = isSelectedValue(resolvedSelectionMode, childValue, currentValue);
          const singleTabIndex = resolvedSelectionMode === "single"
            ? (selected || (!currentValue && index === 0) ? 0 : -1)
            : undefined;
          return cloneElement(child, {
            key: child.key ?? index,
            size: child.props.size ?? size,
            tabIndex: child.props.tabIndex ?? singleTabIndex,
            __selectionMode: resolvedSelectionMode,
            __selected: selected,
            __onSelect: () => select(childValue),
          });
        })}
      </div>
    </div>
  );
}
