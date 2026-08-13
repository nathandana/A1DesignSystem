export const RESPONSIVE_VISIBILITY_BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl']

/** Resolve A1's cascading responsive boolean syntax into one value per breakpoint. */
export function resolveResponsiveVisibility(value) {
  if (typeof value === 'boolean') {
    return Object.fromEntries(RESPONSIVE_VISIBILITY_BREAKPOINTS.map((breakpoint) => [breakpoint, value]))
  }

  let current = true
  const resolved = {}
  for (const breakpoint of RESPONSIVE_VISIBILITY_BREAKPOINTS) {
    if (value && typeof value === 'object' && !Array.isArray(value) && typeof value[breakpoint] === 'boolean') {
      current = value[breakpoint]
    }
    resolved[breakpoint] = current
  }
  return resolved
}

/** Convert the editor's five explicit choices back to compact responsive syntax. */
export function visibilityFromBreakpoints(visibleBreakpoints) {
  const visible = new Set(Array.isArray(visibleBreakpoints) ? visibleBreakpoints : [])
  const responsive = {}
  let previous = true

  for (const breakpoint of RESPONSIVE_VISIBILITY_BREAKPOINTS) {
    const current = visible.has(breakpoint)
    if (current !== previous) {
      responsive[breakpoint] = current
      previous = current
    }
  }

  return Object.keys(responsive).length ? responsive : null
}

export function visibleBreakpoints(value) {
  const resolved = resolveResponsiveVisibility(value)
  return RESPONSIVE_VISIBILITY_BREAKPOINTS.filter((breakpoint) => resolved[breakpoint])
}

/** Classes are exact-range switches; CSS owns the tokenized media queries. */
export function responsiveVisibilityClasses(value) {
  const resolved = resolveResponsiveVisibility(value)
  return RESPONSIVE_VISIBILITY_BREAKPOINTS
    .filter((breakpoint) => !resolved[breakpoint])
    .map((breakpoint) => `a1-web-node-hidden-${breakpoint}`)
    .join(' ')
}
