import { drawBlob } from './blob.js'

const TAU = Math.PI * 2
const clamp = value => Math.max(0, Math.min(1, value))

// A single, seekable timeline owns the percentage, perimeter and reveal.
export function animationState(elapsed, duration, hold, revealDuration) {
  const progress = clamp(elapsed / duration)
  const revealElapsed = elapsed - duration - hold
  const reveal = revealDuration === 0 ? Number(revealElapsed >= 0) : clamp(revealElapsed / revealDuration)
  const phase = progress < 1 ? 'generating' : elapsed < duration + hold
    ? 'completing' : reveal < 1 ? 'revealing' : 'complete'
  return { progress, percent: Math.floor(progress * 100), reveal, phase }
}

export function perimeterLength(width, height, radius) {
  return 2 * (width + height - 4 * radius) + TAU * radius
}

function perimeter(ctx, width, height, inset, radius) {
  const right = width - inset, bottom = height - inset
  ctx.beginPath()
  ctx.moveTo(width / 2, inset) // 12 o’clock, clockwise, including rounded corners.
  ctx.lineTo(right - radius, inset)
  ctx.arcTo(right, inset, right, inset + radius, radius)
  ctx.lineTo(right, bottom - radius)
  ctx.arcTo(right, bottom, right - radius, bottom, radius)
  ctx.lineTo(inset + radius, bottom)
  ctx.arcTo(inset, bottom, inset, bottom - radius, radius)
  ctx.lineTo(inset, inset + radius)
  ctx.arcTo(inset, inset, inset + radius, inset, radius)
  ctx.lineTo(width / 2, inset)
}

export function readVisuals(canvas) {
  const styles = getComputedStyle(canvas)
  const value = name => styles.getPropertyValue(`--component-image-generation-${name}`).trim()
  const rootSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
  const size = name => Number.parseFloat(value(name)) * (value(name).endsWith('rem') ? rootSize : 1)
  // Let the browser resolve token colors (hex, rgb, color-mix, etc.) instead of
  // assuming one serialization format. This runs only when appearance changes.
  const swatch = document.createElement('canvas')
  swatch.width = swatch.height = 1
  const swatchContext = swatch.getContext('2d', { willReadFrequently: true })
  const rgb = color => {
    swatchContext.clearRect(0, 0, 1, 1)
    swatchContext.fillStyle = color
    swatchContext.fillRect(0, 0, 1, 1)
    return Array.from(swatchContext.getImageData(0, 0, 1, 1).data).slice(0, 3)
  }
  const background = rgb(value('background'))
  const highlight = rgb(value('blob-highlight-color'))
  // Add light on a dark surface; preserve ink/colored layers on a light one.
  // Derive the blend from resolved A1 roles, not hard-coded theme names.
  const composite = highlight.reduce((sum, channel) => sum + channel, 0) > background.reduce((sum, channel) => sum + channel, 0)
    ? 'screen' : 'source-over'
  return {
    duration: Number.parseFloat(value('duration')),
    hold: Number.parseFloat(value('completion-hold')),
    revealDuration: Number.parseFloat(value('reveal-duration')),
    orbitDuration: Number.parseFloat(value('orbit-duration')),
    pulseDuration: Number.parseFloat(value('pulse-duration')),
    radius: size('radius'), border: size('border-width'), glow: size('glow'),
    background: value('background'),
    start: rgb(value('start-color')), end: rgb(value('end-color')),
    minDiscs: +value('disc-count-min'), maxDiscs: +value('disc-count-max'),
    discRadius: +value('disc-radius'), opacity: +value('disc-opacity'),
    pulseStrength: +value('pulse-strength'), waveAmplitude: +value('wave-amplitude'),
    blob: {
      radiusMin: +value('blob-radius-min'), radiusMax: +value('blob-radius-max'),
      complexityMin: +value('blob-complexity-min'), complexityMax: +value('blob-complexity-max'),
      amplitude: +value('blob-amplitude'),
      brightnessMin: +value('blob-brightness-min'), brightnessMax: +value('blob-brightness-max'),
      layers: +value('blob-layers'), glow: size('blob-glow'), highlight, composite,
    },
  }
}

export function drawFrame(ctx, width, height, elapsed, state, image, visual, reducedMotion, animationStyle = 'discs') {
  const { progress, reveal } = state
  const time = reducedMotion ? 0 : elapsed
  const orbit = time / visual.orbitDuration * TAU
  const pulse = Math.sin(time / visual.pulseDuration * TAU)
  const channels = visual.start.map((channel, index) => Math.round(channel + (visual.end[index] - channel) * progress))
  const color = alpha => `rgba(${channels.join(',')},${alpha})`
  const inset = reveal >= 1 ? 0 : visual.border
  const radius = Math.min(visual.radius, width / 4, height / 4)
  ctx.clearRect(0, 0, width, height)
  ctx.save()
  ctx.beginPath()
  ctx.roundRect(inset, inset, width - 2 * inset, height - 2 * inset, radius)
  ctx.clip()
  if (reveal < 1) {
    ctx.fillStyle = visual.background
    ctx.fillRect(0, 0, width, height)
  }

  // Index-derived orbits are deterministic. Every added disc fades in instead
  // of popping, and the whole field becomes denser as generation progresses.
  const count = reducedMotion ? visual.minDiscs : visual.minDiscs + progress * (visual.maxDiscs - visual.minDiscs)
  if (reveal < 1 && animationStyle === 'blob') {
    drawBlob(ctx, width, height, progress, orbit, pulse, channels, visual.blob, reducedMotion)
  } else if (reveal < 1) {
    for (let index = 0; index < Math.ceil(count); index++) {
      const seed = index * 2.399963229728653 // Golden-angle distribution.
      const spread = Math.sqrt((index + 0.5) / visual.maxDiscs)
      const angle = seed + orbit * (index % 2 ? 1 : -1)
      const x = width * (0.5 + Math.cos(angle) * spread * 0.54)
      const y = height * (0.5 + Math.sin(angle) * spread * 0.54)
      const discPulse = reducedMotion ? 1 : 1 + Math.sin(time / visual.pulseDuration * TAU + seed) * visual.pulseStrength
      const discRadius = Math.min(width, height) * visual.discRadius * (0.7 + (index % 5) / 5) * discPulse
      const alpha = Math.min(1, count - index) * visual.opacity
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle + orbit)
      // Oblique discs show their rotation through changing elliptical faces.
      ctx.scale(1, 0.55 + 0.35 * Math.abs(Math.sin(seed + orbit)))
      const fill = ctx.createRadialGradient(-discRadius / 3, -discRadius / 3, 0, 0, 0, discRadius)
      fill.addColorStop(0, color(alpha * 1.7))
      fill.addColorStop(0.65, color(alpha))
      fill.addColorStop(1, color(alpha * 0.15))
      ctx.fillStyle = fill
      ctx.beginPath()
      ctx.arc(0, 0, discRadius, 0, TAU)
      ctx.fill()
      ctx.restore()
    }
  }

  if (reveal > 0) {
    // The image stays still: a soft travelling wave swims down from the top.
    const eased = reveal * reveal * (3 - 2 * reveal)
    const amplitude = reducedMotion ? 0 : height * visual.waveAmplitude * Math.sin(reveal * Math.PI)
    const level = height * eased
    const waveY = x => level + Math.sin(x / width * TAU + reveal * TAU) * amplitude
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(0, waveY(0))
    for (let x = 0; x <= width; x += width / 120) ctx.lineTo(x, waveY(x))
    ctx.lineTo(width, waveY(width))
    ctx.lineTo(width, 0)
    ctx.closePath()
    ctx.clip()
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
    ctx.drawImage(image, (width - image.naturalWidth * scale) / 2, (height - image.naturalHeight * scale) / 2, image.naturalWidth * scale, image.naturalHeight * scale)
    ctx.restore()
    if (reveal < 1 && !reducedMotion) {
      ctx.beginPath()
      for (let x = 0; x <= width; x += width / 120) {
        if (x === 0) ctx.moveTo(x, waveY(x))
        else ctx.lineTo(x, waveY(x))
      }
      ctx.strokeStyle = color(0.8)
      ctx.shadowColor = color(0.8)
      ctx.shadowBlur = visual.glow
      ctx.lineWidth = visual.border
      ctx.stroke()
    }
  }
  ctx.restore()

  // The finished image owns the full frame; the progress border is transient.
  if (reveal >= 1) return

  const length = perimeterLength(width - 2 * inset, height - 2 * inset, radius)
  perimeter(ctx, width, height, inset, radius)
  ctx.lineWidth = visual.border
  ctx.strokeStyle = color(0.18)
  ctx.stroke()
  if (progress > 0) {
    ctx.save()
    ctx.setLineDash([length * progress, length])
    ctx.lineCap = 'round'
    ctx.strokeStyle = color(reducedMotion || progress === 1 ? 0.85 : 0.72 + pulse * visual.pulseStrength)
    ctx.shadowColor = color(0.5)
    ctx.shadowBlur = visual.glow * (reducedMotion ? 0 : 0.5 + pulse * visual.pulseStrength)
    ctx.stroke()
    ctx.restore()
  }
}
