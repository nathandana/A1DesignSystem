// Mode transition geometry. The reveal is a circle from the control the
// person used, growing until it covers the farthest corner of the viewport.
export function revealRadius(x, y, width, height) {
  return Math.ceil(Math.hypot(Math.max(x, width - x), Math.max(y, height - y)))
}
