import { useState, useRef, useLayoutEffect } from "react";
import { TextField } from "./TextField.jsx";
import { buildDisplay, extractDigits, maskMaxDigits, nextSlotIndex } from "./maskUtils.js";
import "./credit-card.css";

const CARD_TYPES = [
  { type: "amex",       label: "Amex", pattern: /^3[47]/,                    mask: "#### ###### #####"  },
  { type: "mastercard", label: "MC",   pattern: /^(5[1-5]|2[2-7])/,         mask: "#### #### #### ####" },
  { type: "discover",   label: "Disc", pattern: /^6(?:011|22|4[4-9]|5)/,    mask: "#### #### #### ####" },
  { type: "visa",       label: "Visa", pattern: /^4/,                        mask: "#### #### #### ####" },
];

const DEFAULT_MASK = "#### #### #### ####";

function detectCard(digits) {
  return CARD_TYPES.find(c => c.pattern.test(digits)) ?? null;
}

export function CreditCardField({
  value,
  defaultValue,
  onChange,
  onKeyDown: externalKeyDown,
  onFocus:   externalFocus,
  onClick:   externalClick,
  className = "",
  ...props
}) {
  const [digits, setDigits] = useState(() =>
    value != null
      ? extractDigits(String(value)).slice(0, 16)
      : defaultValue != null
      ? extractDigits(String(defaultValue)).slice(0, 16)
      : ""
  );

  const inputRef   = useRef(null);
  const nextCursor = useRef(null);

  const currentDigits = value != null
    ? extractDigits(String(value)).slice(0, 16)
    : digits;

  const card    = currentDigits.length > 0 ? detectCard(currentDigits) : null;
  const mask    = card?.mask ?? DEFAULT_MASK;
  const maxLen  = maskMaxDigits(mask);
  const trimmed = currentDigits.slice(0, maxLen);
  const display = buildDisplay(trimmed, mask);

  useLayoutEffect(() => {
    if (nextCursor.current !== null && inputRef.current) {
      const pos = nextCursor.current;
      inputRef.current.setSelectionRange(pos, pos);
      nextCursor.current = null;
    }
  });

  function updateDigits(newDigits) {
    const card    = newDigits.length > 0 ? detectCard(newDigits) : null;
    const newMask = card?.mask ?? DEFAULT_MASK;
    const clamped = newDigits.slice(0, maskMaxDigits(newMask));
    if (value == null) setDigits(clamped);
    onChange?.({ target: { value: buildDisplay(clamped, newMask) } });
    nextCursor.current = nextSlotIndex(clamped.length, newMask);
  }

  function handleKeyDown(e) {
    if (e.key >= "0" && e.key <= "9") {
      e.preventDefault();
      if (trimmed.length < maxLen) updateDigits(currentDigits.slice(0, maxLen) + e.key);
    } else if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.target;
      if (selectionStart !== selectionEnd) updateDigits("");
      else if (currentDigits.length > 0) updateDigits(currentDigits.slice(0, -1));
    }
    externalKeyDown?.(e);
  }

  function handleChange(e) {
    const newDigits = extractDigits(e.target.value).slice(0, 16);
    updateDigits(newDigits);
  }

  function handleFocus(e) {
    nextCursor.current = nextSlotIndex(trimmed.length, mask);
    externalFocus?.(e);
  }

  function handleClick(e) {
    nextCursor.current = nextSlotIndex(trimmed.length, mask);
    externalClick?.(e);
  }

  const splitAt = nextSlotIndex(trimmed.length, mask);
  const inputOverlay = (
    <>
      <div className="a1-field__mask-overlay" aria-hidden="true">
        <span className="a1-field__mask-typed">{display.slice(0, splitAt)}</span>
        <span className="a1-field__mask-placeholder">{display.slice(splitAt)}</span>
      </div>
      {card && (
        <span className="a1-credit-card__badge" aria-hidden="true">{card.label}</span>
      )}
    </>
  );

  const classes = ["a1-credit-card", card && "a1-credit-card--detected", className]
    .filter(Boolean).join(" ").trim();

  return (
    <TextField
      ref={inputRef}
      type="tel"
      inputMode="numeric"
      autoComplete="cc-number"
      value={display}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onClick={handleClick}
      inputOverlay={inputOverlay}
      className={classes}
      {...props}
    />
  );
}
