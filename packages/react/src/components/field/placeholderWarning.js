const warned = new Set();

/**
 * A1 fields have no placeholder by design (use `label` and `hint`). The prop
 * is accepted-and-discarded for drop-in compatibility; this makes the discard
 * visible in development instead of silent.
 */
export function warnPlaceholderIgnored(component) {
  if (typeof process !== "undefined" && process.env && process.env.NODE_ENV === "production") return;
  if (warned.has(component)) return;
  warned.add(component);
  console.warn(
    `[a1] ${component}: the placeholder prop is ignored — A1 fields have no placeholder by design. Use label and hint instead.`
  );
}
