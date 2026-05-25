import { useRef, useLayoutEffect } from "react";
import { TextField } from "./TextField.jsx";

const DEFAULT_MASK = "#-###-###-####";

function formatWithMask(digits, mask) {
  let out = "", di = 0;
  for (let i = 0; i < mask.length && di < digits.length; i++) {
    out += mask[i] === "#" ? digits[di++] : mask[i];
  }
  return out;
}

const extractDigits = (v) => v.replace(/\D/g, "");
const maskMaxDigits = (mask) => [...mask].filter(c => c === "#").length;

// Map how many digits are before the cursor to a cursor position in the formatted string.
// Separator characters between digits are included in the advance.
function formattedCursorPos(digitCount, mask) {
  let dc = 0, pos = 0;
  for (let i = 0; i < mask.length; i++) {
    if (mask[i] === "#") {
      if (dc >= digitCount) break;
      dc++;
      pos = i + 1;
    } else if (dc > 0 && dc < digitCount) {
      // Separator between digits we've already passed — advance past it
      pos = i + 1;
    }
  }
  return pos;
}

export function PhoneField({
  mask = DEFAULT_MASK,
  value,
  defaultValue,
  onChange,
  ...props
}) {
  const inputRef   = useRef(null);
  const nextCursor = useRef(null);
  const maxLen     = maskMaxDigits(mask);

  // After React commits the new value, restore the calculated cursor position.
  useLayoutEffect(() => {
    if (nextCursor.current !== null && inputRef.current) {
      const pos = nextCursor.current;
      inputRef.current.setSelectionRange(pos, pos);
      nextCursor.current = null;
    }
  });

  function handleChange(e) {
    const raw          = e.target.value;
    const cursorBefore = e.target.selectionStart;
    const digits       = extractDigits(raw).slice(0, maxLen);
    const formatted    = formatWithMask(digits, mask);

    // Count digits that were to the left of the cursor before formatting,
    // then find that same digit-count position in the new formatted string.
    const digitsLeft   = extractDigits(raw.slice(0, cursorBefore)).length;
    nextCursor.current = formattedCursorPos(digitsLeft, mask);

    onChange?.({ ...e, target: { ...e.target, value: formatted } });
  }

  const formattedValue   = value        != null ? formatWithMask(extractDigits(String(value)),        mask) : undefined;
  const formattedDefault = defaultValue != null ? formatWithMask(extractDigits(String(defaultValue)), mask) : undefined;

  return (
    <TextField
      ref={inputRef}
      type="tel"
      inputMode="numeric"
      value={formattedValue}
      defaultValue={formattedDefault}
      onChange={handleChange}
      {...props}
    />
  );
}
