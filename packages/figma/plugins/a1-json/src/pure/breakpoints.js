export const A1_BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl'];
export const A1_BREAKPOINT_WIDTHS = { xs: 480, sm: 640, md: 1024, lg: 1440, xl: 1600 };

export function resolveBreakpointVisibility(value) {
  if (typeof value === 'boolean') {
    return Object.fromEntries(A1_BREAKPOINTS.map((breakpoint) => [breakpoint, value]));
  }
  let current = true;
  const resolved = {};
  for (const breakpoint of A1_BREAKPOINTS) {
    if (value && typeof value === 'object' && !Array.isArray(value) && typeof value[breakpoint] === 'boolean') {
      current = value[breakpoint];
    }
    resolved[breakpoint] = current;
  }
  return resolved;
}

export function compactBreakpointVisibility(value) {
  const resolved = resolveBreakpointVisibility(value);
  const compact = {};
  let previous = true;
  for (const breakpoint of A1_BREAKPOINTS) {
    if (resolved[breakpoint] !== previous) {
      compact[breakpoint] = resolved[breakpoint];
      previous = resolved[breakpoint];
    }
  }
  return Object.keys(compact).length ? compact : null;
}

export function normalizeResponsiveColumns(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const out = {};
  for (const key of A1_BREAKPOINTS) {
    const columns = value[key];
    if (Number.isInteger(columns) && columns > 0) out[key] = columns;
  }
  return Object.keys(out).length > 0 ? out : null;
}

export function formatResponsiveGridColumns(columns) {
  const responsiveColumns = normalizeResponsiveColumns(columns);
  if (!responsiveColumns) return '';
  return `{${A1_BREAKPOINTS
    .filter((breakpoint) => Number.isInteger(responsiveColumns[breakpoint]) && responsiveColumns[breakpoint] > 0)
    .map((breakpoint) => `${breakpoint}:${responsiveColumns[breakpoint]}`)
    .join(', ')}}`;
}

export function stripResponsiveGridColumnsName(name) {
  // The dash separator is optional: hand-authored names like "Grid {xs:2}"
  // must strip too, or re-syncing metadata accumulates suffix groups.
  return String(name || 'Grid')
    .replace(/\s*(?:[-–—]\s*)?\{\s*(?:(?:['"]?(?:xs|sm|md|lg|xl)['"]?)\s*:\s*\d+\s*,?\s*)+\}\s*$/i, '')
    .trim() || 'Grid';
}

export function parseResponsiveGridColumnsName(name) {
  const match = String(name || '').match(/\{\s*([^{}]+)\s*\}\s*$/);
  if (!match) return null;
  const columns = {};
  for (const part of match[1].split(',')) {
    const pair = part.trim().match(/^['"]?(xs|sm|md|lg|xl)['"]?\s*:\s*(\d+)$/i);
    if (!pair) return null;
    const breakpoint = pair[1].toLowerCase();
    const value = Number(pair[2]);
    if (!Number.isInteger(value) || value < 1) return null;
    columns[breakpoint] = value;
  }
  return normalizeResponsiveColumns(columns);
}

export function responsiveGridName(baseName, columns) {
  const suffix = formatResponsiveGridColumns(columns);
  return suffix ? `${stripResponsiveGridColumnsName(baseName)} - ${suffix}` : stripResponsiveGridColumnsName(baseName);
}

export function responsiveColumnsAt(value, breakpoint) {
  const columns = normalizeResponsiveColumns(value);
  if (!columns) return null;
  const targetIndex = Math.max(0, A1_BREAKPOINTS.indexOf(breakpoint));
  let inherited = null;
  for (let index = 0; index <= targetIndex; index += 1) {
    const key = A1_BREAKPOINTS[index];
    if (Number.isInteger(columns[key]) && columns[key] > 0) inherited = columns[key];
  }
  if (inherited !== null) return inherited;
  for (const key of A1_BREAKPOINTS) {
    if (Number.isInteger(columns[key]) && columns[key] > 0) return columns[key];
  }
  return null;
}

export function responsiveGridItemSpanAt(value, breakpoint, fullSpan = null) {
  const normalize = (candidate) => {
    if (candidate === 'full') return Number.isInteger(fullSpan) && fullSpan > 0 ? fullSpan : null;
    return Number.isInteger(candidate) && candidate > 0 ? candidate : null;
  };
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const targetIndex = Math.max(0, A1_BREAKPOINTS.indexOf(breakpoint));
    let inherited = null;
    for (let index = 0; index <= targetIndex; index += 1) {
      const key = A1_BREAKPOINTS[index];
      const candidate = normalize(value[key]);
      if (candidate !== null) inherited = candidate;
    }
    if (inherited !== null) return inherited;
    for (const key of A1_BREAKPOINTS) {
      const candidate = normalize(value[key]);
      if (candidate !== null) return candidate;
    }
    return null;
  }
  return normalize(value);
}

export function breakpointForWidth(width, fallback = 'md') {
  if (typeof width !== 'number' || !Number.isFinite(width) || width <= 0) return fallback;
  return A1_BREAKPOINTS.reduce((nearest, breakpoint) => {
    const nearestWidth = A1_BREAKPOINT_WIDTHS[nearest] || width;
    const candidateWidth = A1_BREAKPOINT_WIDTHS[breakpoint] || width;
    return Math.abs(candidateWidth - width) < Math.abs(nearestWidth - width) ? breakpoint : nearest;
  }, fallback);
}

export function collectAuthoredBreakpoints(value, found = new Set()) {
  if (Array.isArray(value)) {
    for (const item of value) collectAuthoredBreakpoints(item, found);
    return found;
  }
  if (!value || typeof value !== 'object') return found;
  const keys = Object.keys(value);
  const responsiveKeys = keys.filter((key) => A1_BREAKPOINTS.includes(key));
  if (responsiveKeys.length > 0 && responsiveKeys.length === keys.length) {
    for (const key of responsiveKeys) found.add(key);
  }
  for (const item of Object.values(value)) collectAuthoredBreakpoints(item, found);
  return found;
}
