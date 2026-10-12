import tokens from '../../../../system/tokens/component/switch-morph.json' with { type: 'json' }
const curve = tokens.component.switchMorph.easing.$value.match(/[\d.]+/g).map(Number)
const mix = (a, b, progress) => a + (b - a) * progress

// Same quarter-turn and endpoints as Switch transition, in normalized thumb units.
export function strokePose(index, progress, geometry) {
  const g = geometry
  const p = Math.max(0, Math.min(1, progress))
  const start = index === 0 ? [g.crossStart, g.crossStart] : [g.crossStart, g.crossEnd]
  const end = index === 0 ? [g.checkStartX, g.checkStartY] : [g.checkJointX, g.checkJointY]
  const length = mix(g.crossLength, index === 0 ? g.checkShortLength : g.checkLongLength, p)
  const angle = (index === 0 ? 1 : -1) * g.strokeAngle * Math.PI / 180
  return {
    x: mix(start[0], end[0], p) + Math.cos(angle) * length / 2,
    y: mix(start[1], end[1], p) + Math.sin(angle) * length / 2,
    length,
    angle: angle - (1 - p) * g.strokeRotation * Math.PI / 180,
  }
}

// Invert the existing cubic Bézier's x coordinate so durations match CSS.
export function switchEase(progress) {
  const bezier = (t, a, b) => 3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t * t * b + t ** 3
  let low = 0, high = 1
  for (let i = 0; i < 16; i++) {
    const t = (low + high) / 2
    if (bezier(t, curve[0], curve[2]) < progress) low = t
    else high = t
  }
  return bezier((low + high) / 2, curve[1], curve[3])
}
