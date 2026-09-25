/** Content relevance, independent of the visitor's selected audience. */
export const SHARED_FOCUS = Object.freeze(["ux", "ds"]);

/** Accept the existing audience URL spelling without changing stored metadata. */
export function normalizeFocus(value) {
  if (value === "systems") return "ds";
  return value === "ux" || value === "ds" ? value : "all";
}

/** Omitted metadata inherits its parent; root content defaults to both. */
export function getContentFocus(item = {}, inherited = SHARED_FOCUS) {
  const focus = item.focus ?? inherited;
  if (!Array.isArray(focus) || focus.length === 0 || focus.some((value) => !SHARED_FOCUS.includes(value))) {
    throw new TypeError('Content focus must be a nonempty array containing "ux", "ds", or both.');
  }
  return [...new Set(focus)];
}

export function matchesFocus(item, selectedFocus = "all", inherited = SHARED_FOCUS) {
  const focus = getContentFocus(item, inherited);
  const selected = normalizeFocus(selectedFocus);
  return selected === "all" || focus.includes(selected);
}

/** Preserves authored order and never mutates the source collection. */
export function filterByFocus(items, selectedFocus = "all", inherited = SHARED_FOCUS) {
  return items.filter((item) => matchesFocus(item, selectedFocus, inherited));
}

/** Works on native markup and A1 components that forward data attributes. */
export function focusAttributes(item, inherited = SHARED_FOCUS) {
  return { "data-portfolio-focus": getContentFocus(item, inherited).join(" ") };
}

/** Inspect any rendered descendant; the closest explicit annotation wins. */
export function getElementFocus(element) {
  const scope = element?.closest("[data-portfolio-focus]");
  return scope
    ? getContentFocus({ focus: scope.getAttribute("data-portfolio-focus").split(/\s+/) })
    : [...SHARED_FOCUS];
}
