// Paper-plane stage for the send version of the button completion experiment.
// Deterministic for a given elapsed time and result time. While the stage
// opens, the button's icon becomes a paper plane resting in a slingshot near
// the left edge. It is drawn back and released (the slingshot then recoils out
// of the button), then cruises along a clear arc
// inside the stage for as long as sending takes: it covers most of the arc in
// the expected time and slows the longer sending runs, so the flight reflects
// real progress. When the result arrives, a success finishes the arc and flies
// out through the right edge while the slingshot becomes a centred checkmark; a
// failure peels off and crash-lands above the label, vanishing in a mini explosion,
// while the slingshot becomes a cross.
// Dashed, curved motion lines trail the plane and animate away behind it.
// Colours come from the button.

// lead: the icon growing into the plane (enterDuration). expected: a typical send.
// finish: the time to fly a whole arc once the result is known.
// beat: a pause after the flight; mark: the result mark drawing on.
// slingExit: the slingshot leaving after launch.
export const DEFAULT_PLANE_TIMING = { lead: 500, aim: 500, slingExit: 500, expected: 2000, finish: 1200, beat: 500, mark: 500 }

// The share of the arc the plane can cover before the result is known.
const CRUISE_LIMIT = 0.85

/** Parse a CSS time value ("750ms", "0.5s") to milliseconds. */
export function parseDuration(value, fallback = 0) {
  const text = String(value ?? '').trim()
  const number = Number.parseFloat(text)
  if (!Number.isFinite(number)) return fallback
  return text.endsWith('ms') ? number : text.endsWith('s') ? number * 1000 : number
}

/** Stage timing from the button-completion tokens. */
export function readPlaneTiming(element) {
  const style = getComputedStyle(element)
  const read = (name, fallback) => parseDuration(style.getPropertyValue(`--component-button-completion-${name}-duration`), fallback)
  return {
    lead: read('enter', DEFAULT_PLANE_TIMING.lead),
    aim: read('aim', DEFAULT_PLANE_TIMING.aim),
    slingExit: read('sling-exit', DEFAULT_PLANE_TIMING.slingExit),
    expected: read('expected', DEFAULT_PLANE_TIMING.expected),
    finish: read('finish', DEFAULT_PLANE_TIMING.finish),
    beat: read('result-beat', DEFAULT_PLANE_TIMING.beat),
    mark: read('mark', DEFAULT_PLANE_TIMING.mark),
  }
}

const clamp = value => Math.min(1, Math.max(0, value))
const lerp = (a, b, t) => a + (b - a) * t
const easeInOut = t => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)
const easeOut = t => 1 - (1 - t) ** 3
const step = (value, from, span) => easeInOut(clamp((value - from) / span))

/** Arc progress after `ms` of cruising: fast at first, slowing as time passes. */
export function cruiseProgress(ms, expected = DEFAULT_PLANE_TIMING.expected) {
  return CRUISE_LIMIT * (1 - Math.exp((-2 * Math.max(0, ms)) / expected))
}

/**
 * Where the animation is at `elapsed` ms after sending started.
 * `resultAt` is when the outcome arrived (ms after start), or null while pending.
 * Stages: enter → aim → cruise (until the result) → finish → beat → mark → done.
 * Pass `result` so a failure's finish allows time for the crash.
 */
export function planeTimeline(elapsed, resultAt, timing = DEFAULT_PLANE_TIMING, result = null) {
  const { lead = 0, aim, expected, finish, beat = 0, mark = 0 } = timing
  const release = lead + aim
  const base = { lead: lead ? clamp(elapsed / lead) : 1, aim: clamp((elapsed - lead) / aim), flight: Math.max(0, elapsed - release) }
  if (elapsed < lead) return { ...base, stage: 'enter', progress: 0 }
  if (elapsed < release) return { ...base, stage: 'aim', progress: 0 }
  const resolved = resultAt == null ? null : Math.max(resultAt, release) - release
  if (resolved == null || base.flight < resolved) {
    return { ...base, stage: 'cruise', progress: cruiseProgress(base.flight, expected) }
  }
  // Fly the rest of the arc at roughly the full-arc pace.
  const resolvedProgress = cruiseProgress(resolved, expected)
  // A failure always gets the full pace, so the crash and burst can read.
  const span = result === 'failed' ? finish : Math.max(finish * 0.3, finish * (1 - resolvedProgress))
  const finishing = clamp((base.flight - resolved) / span)
  if (finishing < 1) return { ...base, stage: 'finish', progress: resolvedProgress, finishing }
  // A beat after the flight, then the result mark draws on.
  const after = base.flight - resolved - span
  if (after < beat) return { ...base, stage: 'beat', progress: resolvedProgress, finishing: 1 }
  const marking = mark ? clamp((after - beat) / mark) : 1
  return { ...base, stage: marking >= 1 ? 'done' : 'mark', progress: resolvedProgress, finishing: 1, marking }
}

// The filled Material Symbols "send" glyph (24-unit grid: 3,4 → 22,12 → 3,20
// with a notch at 9,12), nose along +x, in units of the plane size, so the
// flying plane matches the button's icon exactly.
const GLYPH = [[3, 4], [22, 12], [3, 20], [3, 13.5], [9, 12], [3, 10.5]]
const GLYPH_SPAN = 19
const PLANE = GLYPH.map(([gx, gy]) => [((gx - 12.5) / GLYPH_SPAN) * 0.9, ((gy - 12) / GLYPH_SPAN) * 0.9])
/** Plane size that matches an icon drawn at `iconSize` (the glyph spans 19 of 24 units). */
const iconScale = iconSize => (iconSize * GLYPH_SPAN) / 24 / 0.9
const TAIL = 0.45
// How much of the arc the dashed trail covers behind the plane.
const TRAIL_WINDOW = 0.35

/** The flight arc: a parabola from `start` that leaves through the right edge. */
export function flightArc(width, height, start, size = height * 0.36) {
  const end = [width + size, height * 0.35]
  const peak = height * 0.32
  const at = u => [lerp(start[0], end[0], u), lerp(start[1], end[1], u) - peak * 4 * u * (1 - u)]
  const heading = u => Math.atan2(end[1] - start[1] - peak * 4 * (1 - 2 * u), end[0] - start[0])
  return { at, heading }
}

/** A failing drop: a quadratic curve from where the plane was to the ground ahead. */
function fallCurve(width, height, from, heading, size = height * 0.36) {
  const ground = [Math.min(from[0] + width * 0.18, width - size * 0.8), height - size * 0.5] // nose-down, the tip just touches the floor
  const reach = Math.hypot(ground[0] - from[0], ground[1] - from[1]) * 0.5
  const control = [from[0] + Math.cos(heading) * reach, from[1] + Math.sin(heading) * reach]
  const at = t => [
    (1 - t) ** 2 * from[0] + 2 * (1 - t) * t * control[0] + t * t * ground[0],
    (1 - t) ** 2 * from[1] + 2 * (1 - t) * t * control[1] + t * t * ground[1],
  ]
  const heading2 = t => Math.atan2(
    2 * (1 - t) * (control[1] - from[1]) + 2 * t * (ground[1] - control[1]),
    2 * (1 - t) * (control[0] - from[0]) + 2 * t * (ground[0] - control[0]),
  )
  return { at, heading: heading2 }
}

/**
 * Stage geometry in CSS pixels for a `width` × `height` stage.
 * `result` is 'success' or 'failed' once known; `reduced` freezes motion and
 * shows the outcome as soon as it is known. `origin` ({ x, y, size } in stage
 * pixels) is the button icon the plane grows out of while the stage opens.
 * `iconSize` is the resting icon's rendered size; the plane flies at exactly
 * that glyph size so it matches the icon it came from.
 */
export function planeScene(timeline, width, height, result, elapsed = 0, reduced = false, origin = null, iconSize = null, timing = DEFAULT_PLANE_TIMING) {
  const size = iconSize ? iconScale(iconSize) : height * 0.36
  const tipY = height * 0.6
  const forkX = Math.max(width * 0.12, size * 0.9)
  const spread = height * 0.13
  const pull = Math.min(width * 0.08, size * 0.6)
  const tailOffset = TAIL * size
  const restX = forkX + tailOffset
  const release = [restX - pull, tipY]
  const arc = flightArc(width, height, release, size)
  const sample = (curve, from, to, count = 24) => Array.from({ length: count + 1 }, (_, index) => curve.at(lerp(from, to, index / count)))

  let stage = timeline.stage
  let progress = timeline.progress
  let finishing = timeline.finishing ?? 0
  if (reduced) {
    // No flight: the plane waits in the sling, then appears at its outcome.
    if (result) { stage = 'done'; progress = 0; finishing = 1 }
    else if (stage !== 'enter') stage = 'aim'
  }

  let x = restX - pull * (reduced ? 1 : easeInOut(timeline.aim))
  let y = tipY
  let angle = 0
  let alpha = 1
  let scale = size
  let band = x - tailOffset
  let trail = null
  let explosion = null

  // The icon becomes the plane: it grows from the button icon into the sling.
  if (stage === 'enter' && origin && !reduced) {
    const enter = easeInOut(timeline.lead)
    x = lerp(origin.x, restX, enter)
    y = lerp(origin.y, tipY, enter)
    scale = lerp(iconScale(origin.size), size, enter)
    band = restX - tailOffset
  }

  if (stage !== 'enter' && stage !== 'aim') {
    let u = progress
    let streakCurve = arc
    let streakTo = u
    if (result === 'failed' && stage !== 'cruise') {
      // Fall for the first 60%, crash on the bottom edge, then burst.
      // Crash on the floor of the artwork area, above the label row.
      const fall = fallCurve(width, height, arc.at(progress), arc.heading(progress), size)
      const falling = clamp(finishing / 0.6)
      ;[x, y] = fall.at(falling)
      angle = fall.heading(falling)
      if (falling >= 1) {
        // A small jolt on impact.
        const jolt = clamp((finishing - 0.6) / 0.15)
        angle += Math.sin(jolt * Math.PI) * 0.25
        const [noseX, noseY] = [x + Math.cos(angle) * TAIL * size, y + Math.sin(angle) * TAIL * size]
        // The plane vanishes into the burst.
        alpha = 1 - clamp((finishing - 0.6) / 0.12)
        explosion = { x: noseX, y: Math.min(noseY, height), progress: clamp((finishing - 0.6) / 0.4), radius: size * 0.9 }
      }
      // The arc part erodes as the plane falls; the fall part retracts after the crash.
      const arcFrom = Math.min(progress, Math.max(0, progress - TRAIL_WINDOW) + falling * TRAIL_WINDOW)
      const fallFrom = step(finishing, 0.6, 0.3)
      trail = { lines: [
        ...(arcFrom < progress - 1e-3 ? [sample(arc, arcFrom, progress)] : []),
        ...(fallFrom < falling - 1e-3 ? [sample(fall, fallFrom, falling, 12)] : []),
      ] }
      streakCurve = fall
      streakTo = falling < 1 ? falling : 0
    } else {
      // Fly the rest of the arc and out through the right edge.
      if (stage !== 'cruise') u = lerp(progress, 1, finishing)
      ;[x, y] = arc.at(u)
      angle = arc.heading(u)
      // The trail keeps a short window behind the plane, its start erasing as
      // the plane advances, and follows it out of the button.
      const exit = stage === 'cruise' ? 0 : step(finishing, 0.7, 0.3)
      const from = lerp(Math.max(0, u - TRAIL_WINDOW), 1, exit)
      trail = { lines: from < u - 1e-3 ? [sample(arc, from, u)] : [] }
      streakTo = exit > 0.5 ? 0 : u
    }
    // Two short curves parallel to the path, just behind the tail.
    if (!reduced && alpha > 0 && streakTo > 0.04) {
      const from = Math.max(0, streakTo - 0.16)
      const to = Math.max(from, streakTo - 0.03)
      trail.streaks = [-0.22, 0.22].map(offset => Array.from({ length: 9 }, (_, index) => {
        const v = lerp(from, to, index / 8)
        const [px, py] = streakCurve.at(v)
        const normal = streakCurve.heading(v) + Math.PI / 2
        return [px + Math.cos(normal) * offset * size, py + Math.sin(normal) * offset * size]
      }))
    }
    trail.offset = reduced ? 0 : -elapsed / 20
    // The band follows the plane until it passes the fork, then settles.
    const settle = timeline.flight / 1000
    band = x - tailOffset < forkX ? x - tailOffset : forkX + pull * 0.35 * Math.exp(-7 * settle) * Math.sin(28 * settle)
  }

  const toStage = ([px, py]) => [
    x + px * scale * Math.cos(angle) - py * scale * Math.sin(angle),
    y + px * scale * Math.sin(angle) + py * scale * Math.cos(angle),
  ]

  // An upright Y near the left edge; the band runs from both tines to the tail.
  // Once the band has snapped after launch, it recoils out through the left
  // edge with a slight drop, leaving only the plane in the button.
  const launched = stage !== 'enter' && stage !== 'aim' && !reduced
  const exit = launched ? clamp((timeline.flight - 200) / (timing.slingExit ?? DEFAULT_PLANE_TIMING.slingExit)) ** 2 : 0
  const dx = -(forkX + spread * 2) * exit
  const dy = spread * 0.8 * exit
  const shift = ([px, py]) => [px + dx, py + dy]
  const fork = {
    tips: [[forkX - spread * 0.7, tipY - spread * 0.7], [forkX + spread * 0.7, tipY - spread * 0.7]].map(shift),
    junction: shift([forkX, tipY + spread * 1.2]),
    base: shift([forkX, height]),
  }
  // Once the result is known, a mark draws itself on, stroke by stroke, in the
  // centre: a checkmark, or a cross. (With reduced motion the still slingshot
  // fades out as it draws.)
  const mark = result && (stage === 'mark' || stage === 'done') ? (stage === 'done' ? 1 : easeInOut(timeline.marking)) : 0
  const cx = width / 2
  const cy = height * 0.45
  const c = height * 0.5
  const strokes = result === 'failed'
    ? [[[cx - c * 0.32, cy - c * 0.32], [cx + c * 0.32, cy + c * 0.32]], [[cx + c * 0.32, cy - c * 0.32], [cx - c * 0.32, cy + c * 0.32]]]
    : [[[cx - c * 0.42, cy + c * 0.02], [cx - c * 0.1, cy + c * 0.34], [cx + c * 0.48, cy - c * 0.38]]]

  return {
    points: PLANE.map(toStage),
    alpha,
    trail,
    explosion,
    mark: mark > 0 ? { kind: result === 'failed' ? 'cross' : 'check', progress: mark, strokes } : null,
    sling: {
      alpha: exit >= 1 ? 0 : (reduced || !origin ? 1 : clamp((timeline.lead - 0.4) / 0.6)) * (1 - clamp(mark * 2.5)),
      ...fork,
      band: shift([band, tipY]),
    },
  }
}

/** Resolve stage colours from the element that hosts the canvas. */
export function readPlaneColors(element) {
  const style = getComputedStyle(element)
  const stroke = Number.parseFloat(style.getPropertyValue('--component-button-completion-stroke-width'))
    * Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
  return { paper: style.color, ink: style.backgroundColor, stroke: Number.isFinite(stroke) ? stroke : 2 }
}

function polyline(context, points) {
  context.beginPath()
  points.forEach(([px, py], index) => (index ? context.lineTo(px, py) : context.moveTo(px, py)))
}

export function drawPlaneScene(context, scene, colors) {
  const { sling, trail } = scene
  context.lineCap = 'round'
  context.lineJoin = 'round'
  context.strokeStyle = colors.paper

  // Slingshot: frame, then the band in a V to the plane's tail. It fades out
  // as the result mark draws on.
  if (sling.alpha > 0) {
    context.globalAlpha = sling.alpha
    context.lineWidth = colors.stroke * 2.5
    context.beginPath()
    context.moveTo(...sling.tips[0])
    context.lineTo(...sling.junction)
    context.lineTo(...sling.tips[1])
    context.moveTo(...sling.junction)
    context.lineTo(...sling.base)
    context.stroke()
    {
      context.globalAlpha = sling.alpha
      context.lineWidth = colors.stroke
      context.beginPath()
      context.moveTo(...sling.tips[0])
      context.lineTo(...sling.band)
      context.lineTo(...sling.tips[1])
      context.stroke()
    }
  }

  // Dashed, curved motion lines that march toward the plane and erase behind it.
  if (trail) {
    context.setLineDash([colors.stroke * 3, colors.stroke * 3])
    context.lineDashOffset = trail.offset ?? 0
    context.lineWidth = colors.stroke
    context.globalAlpha = 0.55
    for (const line of trail.lines) {
      polyline(context, line)
      context.stroke()
    }
    context.globalAlpha = 0.8 * scene.alpha
    for (const streak of trail.streaks ?? []) {
      polyline(context, streak)
      context.stroke()
    }
    context.setLineDash([])
    context.lineDashOffset = 0
  }

  // Result mark, drawn on along its total stroke length.
  if (scene.mark) {
    const lengths = scene.mark.strokes.map(points => points.slice(1).reduce((sum, point, index) => sum + Math.hypot(point[0] - points[index][0], point[1] - points[index][1]), 0))
    let remaining = lengths.reduce((sum, length) => sum + length, 0) * scene.mark.progress
    context.globalAlpha = 1
    context.strokeStyle = colors.paper
    context.lineWidth = colors.stroke * 3.5
    for (const points of scene.mark.strokes) {
      if (remaining <= 0) break
      context.beginPath()
      context.moveTo(...points[0])
      for (let index = 1; index < points.length && remaining > 0; index++) {
        const [fromX, fromY] = points[index - 1]
        const [toX, toY] = points[index]
        const length = Math.hypot(toX - fromX, toY - fromY)
        const t = Math.min(1, remaining / length)
        context.lineTo(fromX + (toX - fromX) * t, fromY + (toY - fromY) * t)
        remaining -= length
      }
      context.stroke()
    }
  }

  // Mini explosion at the crash: rays bursting up and out, a puff ring and
  // a few debris specks, all fading as they spread.
  const burst = scene.explosion
  if (burst && burst.progress > 0 && burst.progress < 1) {
    const e = easeOut(burst.progress)
    const fade = 1 - burst.progress
    context.strokeStyle = colors.paper
    context.fillStyle = colors.paper
    context.lineWidth = colors.stroke * 1.5
    context.globalAlpha = fade
    for (let index = 0; index < 7; index++) {
      const angle = Math.PI + (Math.PI * (index + 0.5)) / 7
      const inner = burst.radius * (0.15 + 0.45 * e)
      const outer = burst.radius * (0.35 + 0.75 * e)
      context.beginPath()
      context.moveTo(burst.x + Math.cos(angle) * inner, burst.y + Math.sin(angle) * inner)
      context.lineTo(burst.x + Math.cos(angle) * outer, burst.y + Math.sin(angle) * outer)
      context.stroke()
    }
    context.globalAlpha = fade * 0.6
    context.beginPath()
    context.arc(burst.x, burst.y, burst.radius * 0.5 * e, Math.PI, 2 * Math.PI)
    context.stroke()
    context.globalAlpha = fade
    for (const [dx, dy] of [[-0.9, -0.55], [0.75, -0.8], [0.2, -1.1]]) {
      context.beginPath()
      context.arc(burst.x + dx * burst.radius * e, burst.y + dy * burst.radius * e + burst.radius * 0.4 * e * e, colors.stroke, 0, 2 * Math.PI)
      context.fill()
    }
  }

  if (scene.alpha > 0) {
    context.globalAlpha = scene.alpha
    context.fillStyle = colors.paper
    polyline(context, scene.points)
    context.closePath()
    context.fill()
  }
  context.globalAlpha = 1
}
