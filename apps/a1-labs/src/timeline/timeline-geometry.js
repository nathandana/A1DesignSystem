// Connector geometry for the timeline. Every milestone's connector runs along
// the axis from the previous badge, wraps a quarter arc around its own badge
// (radius = badge radius + arc gap) and turns sharply into a straight stem
// that ends at a hollow node beside the milestone's details. Coordinates are
// pixels in the track's box. `dir` is 1 for left-to-right, -1 for right-to-left.

const n = value => Math.round(value * 10) / 10

/** Horizontal layout: the stem rises (`above`) or drops (`below`) to its node. */
export function horizontalConnector({ fromX, cx, cy, radius, side, nodeY, nodeRadius, dir = 1 }) {
  const up = side === 'above' ? -1 : 1
  const sweep = (up === -1) === (dir === 1) ? 1 : 0
  return `M ${n(fromX)} ${n(cy)} H ${n(cx - dir * radius)} A ${n(radius)} ${n(radius)} 0 0 ${sweep} ${n(cx)} ${n(cy + up * radius)} V ${n(nodeY - up * nodeRadius)}`
}

/** Vertical layout: the axis runs down; the stem turns out towards its node. */
export function verticalConnector({ fromY, cx, cy, radius, nodeX, nodeRadius }) {
  const out = nodeX >= cx ? 1 : -1
  const sweep = out === 1 ? 1 : 0
  return `M ${n(cx)} ${n(fromY)} V ${n(cy - radius)} A ${n(radius)} ${n(radius)} 0 0 ${sweep} ${n(cx + out * radius)} ${n(cy)} H ${n(nodeX - out * nodeRadius)}`
}

/** Which way milestone `index` branches in the horizontal layout. */
export const sideOf = index => (index % 2 === 0 ? 'above' : 'below')

/** `auto` is horizontal from `minWidth` up, vertical below it. */
export function resolveOrientation(layout, width, minWidth) {
  if (layout === 'horizontal' || layout === 'vertical') return layout
  return width >= minWidth ? 'horizontal' : 'vertical'
}
