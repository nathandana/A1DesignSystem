const TAU = Math.PI * 2
const mix = (from, to, amount) => from + (to - from) * amount

export function blobState(progress, visual, reducedMotion) {
  const amount = Math.max(0, Math.min(1, progress))
  // Reduced motion keeps the silhouette fixed. Only luminosity/color progress.
  const shapeProgress = reducedMotion ? 0 : amount
  return {
    radius: mix(visual.radiusMin, visual.radiusMax, shapeProgress),
    complexity: mix(visual.complexityMin, visual.complexityMax, shapeProgress),
    brightness: mix(visual.brightnessMin, visual.brightnessMax, amount),
    amplitude: visual.amplitude * shapeProgress,
  }
}

export function drawBlob(ctx, width, height, progress, orbit, pulse, channels, visual, reducedMotion) {
  const state = blobState(progress, visual, reducedMotion)
  const radius = Math.min(width, height) * state.radius
  const brightness = state.brightness
  const color = opacity => `rgba(${channels.join(',')},${opacity})`
  const highlight = channels.map((channel, index) => Math.round(mix(channel, visual.highlight[index], progress)))
  const light = opacity => `rgba(${highlight.join(',')},${opacity})`

  ctx.save()
  ctx.translate(width / 2, height / 2)
  // A diffuse halo keeps the low-progress silhouette soft; the center and folds
  // gain contrast against the themed surface as generation advances.
  const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 2)
  halo.addColorStop(0, color(brightness / 2))
  halo.addColorStop(1, color(0))
  ctx.fillStyle = halo
  ctx.fillRect(-radius * 2, -radius * 2, radius * 4, radius * 4)

  ctx.globalCompositeOperation = visual.composite
  for (let layer = 0; layer < visual.layers; layer++) {
    ctx.save()
    const phase = orbit * (layer % 2 ? -1 : 1) + layer * TAU / visual.layers
    const layerRadius = radius * (1 - layer / (visual.layers * 2))
    ctx.rotate(phase / 2)
    ctx.beginPath()
    // Integer harmonics close smoothly at the seam. Each new harmonic fades
    // in continuously, so increasing complexity never pops between shapes.
    const samples = 192
    for (let index = 0; index <= samples; index++) {
      const angle = index / samples * TAU
      let displacement = 0
      for (let harmonic = 2; harmonic <= Math.ceil(state.complexity); harmonic++) {
        const weight = Math.min(1, state.complexity - harmonic + 1)
        displacement += Math.sin(angle * harmonic + phase * (harmonic % 2 ? -1 : 1)) * weight / Math.sqrt(harmonic)
      }
      const reach = layerRadius * (1 + state.amplitude * Math.tanh(displacement))
      const x = Math.cos(angle) * reach, y = Math.sin(angle) * reach
      if (index === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    const fill = ctx.createRadialGradient(-layerRadius / 3, -layerRadius / 3, 0, 0, 0, layerRadius * 1.5)
    fill.addColorStop(0, light(brightness))
    fill.addColorStop(0.4, color(brightness / 2))
    fill.addColorStop(1, color(0))
    ctx.fillStyle = fill
    ctx.shadowColor = color(brightness)
    ctx.shadowBlur = visual.glow * brightness * (1 + pulse * state.amplitude)
    ctx.fill()
    ctx.restore()
  }
  ctx.restore()
}
