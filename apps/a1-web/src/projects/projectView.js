export const COMPACT_PROJECT_VIEW_QUERY = '(max-width: 640px)'

/** xs and sm start with the readable list; md and larger start on Canvas. */
export function getDefaultProjectView(matchMedia) {
  const query = matchMedia ?? (
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia.bind(window)
      : null
  )
  return query?.(COMPACT_PROJECT_VIEW_QUERY).matches ? 'list' : 'canvas'
}
