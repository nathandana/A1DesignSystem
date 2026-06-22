import { useRef, useState, useCallback, forwardRef } from "react";
import { TextField } from "./TextField.jsx";
import { Icon } from "../icon/Icon.jsx";
import { IconButton } from "../icon-button/IconButton.jsx";
import { useLabel } from "../labels/Labels.jsx";

/**
 * SearchField — a field-family search input with a **leading search icon** inside the field
 * and a **trailing clear button** that appears only when there's a value. Built on TextField,
 * so it inherits the label / hint / error / size (compact · default · comfortable) behaviour
 * and field-family sizing. Renders a native `type="search"` input (the browser's own clear
 * affordance is suppressed in favour of the A1 clear button).
 *
 * Controlled or uncontrolled. The clear button dispatches a native input event so both
 * styles update; `onSearch(value)` fires on Enter; `onClear()` fires after clearing.
 */
export const SearchField = forwardRef(function SearchField({
  value,
  defaultValue,
  onChange,
  onClear,
  onSearch,
  onKeyDown,
  clearLabel,
  disabled = false,
  className = "",
  ...props
}, forwardedRef) {
  const localRef = useRef(null);
  const mergedRef = useCallback((el) => {
    localRef.current = el;
    if (typeof forwardedRef === "function") forwardedRef(el);
    else if (forwardedRef) forwardedRef.current = el;
  }, [forwardedRef]);

  // Track whether there's a value (drives the clear button) for both controlled + uncontrolled.
  const isControlled = value !== undefined;
  const [hasValueUncontrolled, setHasValueUncontrolled] = useState(
    () => String(defaultValue ?? "").length > 0,
  );
  const hasValue = isControlled ? String(value ?? "").length > 0 : hasValueUncontrolled;

  const clearText = useLabel("field.clearSearch", "Clear search");

  function handleChange(e) {
    if (!isControlled) setHasValueUncontrolled(e.target.value.length > 0);
    onChange?.(e);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && onSearch) onSearch(localRef.current?.value ?? "");
    onKeyDown?.(e);
  }

  function clear() {
    const input = localRef.current;
    if (input) {
      // Native setter + input event so controlled consumers' onChange fires too (React
      // listens to the native input event), not just our uncontrolled state.
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
      setter?.call(input, "");
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.focus();
    }
    if (!isControlled) setHasValueUncontrolled(false);
    onClear?.();
  }

  const overlay = (
    <>
      <span className="a1-field__search-icon" aria-hidden="true">
        <Icon name="search" size="sm" color="muted" />
      </span>
      {hasValue && !disabled && (
        <IconButton
          className="a1-field__search-clear"
          icon="close"
          size="sm"
          variant="tertiary"
          label={clearLabel ?? clearText}
          onClick={clear}
        />
      )}
    </>
  );

  return (
    <TextField
      ref={mergedRef}
      type="search"
      disabled={disabled}
      className={["a1-field--search", hasValue && "a1-field--search-has-value", className]
        .filter(Boolean).join(" ")}
      inputOverlay={overlay}
      value={value}
      defaultValue={defaultValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
});
