let version = 0;
let family = "A1 Custom Icons";
let icons = new Map();
const listeners = new Set();
const STYLE_ID = "a1-custom-icon-font";

function notify() {
  version += 1;
  for (const listener of listeners) listener();
}

function cssString(value) {
  return String(value ?? "").replaceAll("\\", "\\\\").replaceAll('"', '\\"').replaceAll("\n", "");
}

/** Register the browser-built custom icon font currently available to this view. */
export function registerCustomIconFont({ fontUrl, mappings, fontFamily = "A1 Custom Icons" }) {
  family = fontFamily;
  icons = new Map(Object.entries(mappings ?? {}));

  if (typeof document !== "undefined") {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }
    style.textContent = fontUrl
      ? `@font-face{font-family:"${cssString(fontFamily)}";src:url("${cssString(fontUrl)}") format("truetype");font-display:block;font-style:normal;font-weight:normal;}`
      : "";
  }
  notify();
}

/** Remove every custom icon from the active runtime scope. */
export function clearCustomIconFont() {
  icons = new Map();
  if (typeof document !== "undefined") {
    const style = document.getElementById(STYLE_ID);
    if (style) style.textContent = "";
  }
  notify();
}

export function getCustomIcon(name) {
  const key = String(name ?? "");
  const value = icons.get(key) ?? icons.get(key.replace(/^custom:/, ""));
  if (value == null) return null;
  const character = typeof value === "number"
    ? String.fromCodePoint(value)
    : String(value).replace(/^custom:/, "");
  return { character, family };
}

export function subscribeCustomIcons(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCustomIconVersion() {
  return version;
}
