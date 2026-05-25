import { TextField } from "./TextField.jsx";

// Mask format uses '#' for digit, any other character is a literal separator.
export const ZIP_MASKS = {
  zip5:    "#####",
  zip9:    "#####-####",
};

const DEFAULT_MASK = ZIP_MASKS.zip5;

function formatWithMask(digits, mask) {
  let out = "", di = 0;
  for (let i = 0; i < mask.length && di < digits.length; i++) {
    out += mask[i] === "#" ? digits[di++] : mask[i];
  }
  return out;
}

const extractDigits = (v) => v.replace(/\D/g, "");
const maskMaxDigits = (mask) => [...mask].filter(c => c === "#").length;

export function ZipField({
  mask = DEFAULT_MASK,
  value,
  defaultValue,
  onChange,
  className = "",
  ...props
}) {
  const maxLen = maskMaxDigits(mask);

  function handleChange(e) {
    const digits    = extractDigits(e.target.value).slice(0, maxLen);
    const formatted = formatWithMask(digits, mask);
    onChange?.({ ...e, target: { ...e.target, value: formatted } });
  }

  const formattedValue   = value        != null ? formatWithMask(extractDigits(String(value)),        mask) : undefined;
  const formattedDefault = defaultValue != null ? formatWithMask(extractDigits(String(defaultValue)), mask) : undefined;

  return (
    <TextField
      type="text"
      inputMode="numeric"
      autoComplete="postal-code"
      value={formattedValue}
      defaultValue={formattedDefault}
      onChange={handleChange}
      className={`a1-field--fit ${className}`.trim()}
      {...props}
    />
  );
}
