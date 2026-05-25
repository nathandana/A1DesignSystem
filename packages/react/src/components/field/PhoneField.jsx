import { useState, useRef, useLayoutEffect } from "react";
import { TextField } from "./TextField.jsx";
import { buildDisplay, extractDigits, maskMaxDigits, nextSlotIndex } from "./maskUtils.js";

const DEFAULT_MASK = "#-###-###-####";

export function PhoneField({
  mask = DEFAULT_MASK,
  value,
  defaultValue,
  onChange,
  onKeyDown: externalKeyDown,
  onFocus:   externalFocus,
  onClick:   externalClick,
  ...props
}) {
  const maxLen = maskMaxDigits(mask);

  const [digits, setDigits] = useState(() =>
    value != null
      ? extractDigits(String(value)).slice(0, maxLen)
      : defaultValue != null
      ? extractDigits(String(defaultValue)).slice(0, maxLen)
      : ""
  );

  const inputRef   = useRef(null);
  const nextCursor = useRef(null);

  // In controlled mode derive digits from value prop; otherwise use internal state
  const currentDigits = value != null
    ? extractDigits(String(value)).slice(0, maxLen)
    : digits;

  const display = buildDisplay(currentDigits, mask);

  useLayoutEffect(() => {
    if (nextCursor.current !== null && inputRef.current) {
      const pos = nextCursor.current;
      inputRef.current.setSelectionRange(pos, pos);
      nextCursor.current = null;
    }
  });

  function updateDigits(newDigits) {
    if (value == null) setDigits(newDigits);
    onChange?.({ target: { value: buildDisplay(newDigits, mask) } });
    nextCursor.current = nextSlotIndex(newDigits.length, mask);
  }

  function handleKeyDown(e) {
    if (e.key >= "0" && e.key <= "9") {
      e.preventDefault();
      if (currentDigits.length < maxLen) updateDigits(currentDigits + e.key);
    } else if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.target;
      if (selectionStart !== selectionEnd) updateDigits("");
      else if (currentDigits.length > 0) updateDigits(currentDigits.slice(0, -1));
    }
    externalKeyDown?.(e);
  }

  function handleChange(e) {
    // Handles paste and browser autocomplete
    const newDigits = extractDigits(e.target.value).slice(0, maxLen);
    updateDigits(newDigits);
  }

  function handleFocus(e) {
    nextCursor.current = nextSlotIndex(currentDigits.length, mask);
    externalFocus?.(e);
  }

  function handleClick(e) {
    nextCursor.current = nextSlotIndex(currentDigits.length, mask);
    externalClick?.(e);
  }

  const splitAt = nextSlotIndex(currentDigits.length, mask);
  const inputOverlay = (
    <div className="a1-field__mask-overlay" aria-hidden="true">
      <span className="a1-field__mask-typed">{display.slice(0, splitAt)}</span>
      <span className="a1-field__mask-placeholder">{display.slice(splitAt)}</span>
    </div>
  );

  return (
    <TextField
      ref={inputRef}
      type="tel"
      inputMode="numeric"
      autoComplete="tel"
      value={display}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onClick={handleClick}
      inputOverlay={inputOverlay}
      {...props}
    />
  );
}
