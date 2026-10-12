// Pure helpers for the segmented control transitions.

/** Which way the selection moved: 'forward' (towards the end) or 'back'. */
export const travelDirection = (from, to) => (to >= from ? 'forward' : 'back')

/** Inset edges for a rect inside a box `width` wide. */
export const edges = ({ x, y, width, height }, boxWidth) => ({ left: x, right: boxWidth - x - width, top: y, height })

/**
 * Morph keyframes: the selection shrinks to a bar under its segment, travels
 * to the new segment and grows back. Rects are { x, y, width, height } in the
 * wrapper's coordinates (`boxWidth` wide); `bar` is the bar's { width, height }.
 */
export function morphFrames(from, to, bar, boxWidth) {
  const rect = r => {
    const e = edges(r, boxWidth)
    return { left: `${e.left}px`, right: `${e.right}px`, top: `${e.top}px`, height: `${e.height}px` }
  }
  const barAt = r => ({ x: r.x + (r.width - bar.width) / 2, y: r.y + r.height - bar.height, width: bar.width, height: bar.height })
  return [
    rect(from),
    { ...rect(barAt(from)), offset: 0.3 },
    { ...rect(barAt(to)), offset: 0.7 },
    rect(to),
  ]
}
