import * as THREE from 'three'
import { strokePose, switchEase } from './switch-motion.js'

export function createSwitchScene(host, onFailure) {
  const document = host.ownerDocument, window = document.defaultView
  const probe = document.createElement('span')
  probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none'
  host.appendChild(probe)
  const style = () => window.getComputedStyle(host)
  const raw = name => style().getPropertyValue(name).trim()
  const px = name => { probe.style.width = `var(${name})`; return parseFloat(window.getComputedStyle(probe).width) }
  const t = {}, morph = {}
  for (const name of style()) {
    for (const [prefix, target] of [['--component-switch-three-', t], ['--component-switch-morph-', morph]]) {
      if (name.startsWith(prefix)) target[name.slice(prefix.length).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = parseFloat(raw(name))
    }
  }
  const w = px('--component-switch-track-width'), h = px('--component-switch-track-height')
  const size = px('--component-switch-thumb-size'), gap = px('--component-switch-gap')
  const border = px('--component-field-border-width'), padding = px('--component-switch-three-canvas-padding')
  let renderer
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }) }
  catch (error) { probe.remove(); throw error }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  host.appendChild(renderer.domElement)
  const scene = new THREE.Scene(), group = new THREE.Group()
  scene.add(group)
  const camera = new THREE.OrthographicCamera(-(w / 2 + padding), w / 2 + padding, h / 2 + padding, -(h / 2 + padding), 0.1, 200)
  camera.position.z = 100
  const geometries = new Set(), materials = new Set()
  const material = () => {
    const result = new THREE.MeshStandardMaterial({ roughness: t.roughness, metalness: t.metalness })
    materials.add(result); return result
  }
  const rimMaterial = material(), trackMaterial = material(), thumbMaterial = material(), inkMaterial = material()
  function mesh(geometry, mat, parent = group) {
    geometries.add(geometry)
    const result = new THREE.Mesh(geometry, mat); parent.add(result); return result
  }
  function capsule(width, height, depth, mat, parent = group) {
    const r = height / 2, edge = width / 2 - r
    const shape = new THREE.Shape()
    shape.absarc(-edge, 0, r, Math.PI / 2, Math.PI * 1.5, false)
    shape.absarc(edge, 0, r, -Math.PI / 2, Math.PI / 2, false)
    shape.closePath()
    const bevel = Math.min(t.bevel, depth / 4)
    const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: bevel, bevelThickness: bevel, curveSegments: 24 })
    geometry.translate(0, 0, -depth / 2)
    return mesh(geometry, mat, parent)
  }
  capsule(w, h, t.trackDepth, rimMaterial)
  const track = capsule(w - 2 * border, h - 2 * border, t.trackDepth / 2, trackMaterial)
  track.position.z = t.trackDepth / 2
  const thumb = new THREE.Group(); group.add(thumb)
  capsule(size, size, t.thumbDepth, thumbMaterial, thumb)
  const strokes = [0, 1].map(() => {
    const stroke = new THREE.Group(); thumb.add(stroke)
    const bar = mesh(new THREE.BoxGeometry(1, 1, 1), inkMaterial, stroke)
    const caps = [-1, 1].map(() => mesh(new THREE.SphereGeometry(0.5, 16, 8), inkMaterial, stroke))
    stroke.position.z = t.thumbDepth / 2 + t.strokeDepth
    return { stroke, bar, caps }
  })
  const lightColor = raw('--component-switch-three-light')
  scene.add(new THREE.AmbientLight(lightColor, t.ambientIntensity))
  const key = new THREE.DirectionalLight(lightColor, t.keyIntensity)
  key.position.set(-w, h * 2, w); scene.add(key)
  const fill = new THREE.DirectionalLight(lightColor, t.fillIntensity)
  fill.position.set(w, -h, w); scene.add(fill)
  let frame = 0, disposed = false, initialized = false, position = 0, from = 0, target = 0, started = 0, duration = 100
  let current = { checked: false, disabled: false, still: false, view: 'angled' }
  // Canvas resolves all CSS color syntaxes, including light-dark()/color-mix().
  const swatch = document.createElement('canvas'); swatch.width = swatch.height = 1
  const ctx = swatch.getContext('2d', { willReadFrequently: true })
  function color(mat, token) {
    probe.style.color = `var(${token})`
    ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = window.getComputedStyle(probe).color; ctx.fillRect(0, 0, 1, 1)
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
    mat.color.setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace)
  }
  function palette() {
    const { checked, disabled } = current
    color(rimMaterial, disabled ? '--semantic-color-border-subtle' : checked ? '--component-switch-track-on-border' : '--semantic-color-border-strong')
    color(trackMaterial, disabled ? '--semantic-color-surface-raised' : checked ? '--component-switch-track-on-background' : '--semantic-color-surface-field')
    color(thumbMaterial, disabled ? '--semantic-color-border-default' : checked ? '--component-switch-thumb-on-background' : '--component-switch-thumb-background')
    color(inkMaterial, disabled ? '--semantic-color-text-muted' : checked ? '--component-switch-track-on-background' : '--component-switch-thumb-on-background')
    requestDraw()
  }
  function sample(now) {
    const progress = Math.min(1, Math.max(0, (now - started) / duration))
    position = current.still || document.hidden ? target : from + (target - from) * switchEase(progress)
    if (progress === 1) position = target
    return progress
  }
  function draw(now) {
    frame = 0
    if (disposed) return
    const progress = sample(now), moving = position !== target
    const lift = moving ? Math.sin(progress * Math.PI) : 0
    group.rotation.x = current.view === 'front' ? 0 : -t.viewTilt
    thumb.position.set(-w / 2 + gap + size / 2 + position * (w - 2 * gap - size), 0, t.trackDepth + t.thumbDepth / 2 + lift * t.lift)
    thumb.rotation.y = lift * t.tilt * Math.sign(target - from)
    strokes.forEach(({ stroke, bar, caps }, index) => {
      const pose = strokePose(index, position, morph), thickness = size * morph.strokeThickness
      stroke.position.x = (pose.x - 0.5) * size; stroke.position.y = (0.5 - pose.y) * size
      stroke.rotation.z = -pose.angle
      bar.scale.set(pose.length * size, thickness, t.strokeDepth)
      caps.forEach((cap, i) => { cap.position.x = (i ? 1 : -1) * pose.length * size / 2; cap.scale.set(thickness, thickness, t.strokeDepth) })
    })
    renderer.domElement.dataset.moving = String(moving)
    renderer.render(scene, camera)
    if (moving && !document.hidden) requestDraw()
  }
  function requestDraw() { if (!frame && !disposed) frame = window.requestAnimationFrame(draw) }
  const resize = new ResizeObserver(() => {
    const bounds = host.getBoundingClientRect()
    if (bounds.width && bounds.height) { renderer.setSize(bounds.width, bounds.height); requestDraw() }
  })
  resize.observe(host)
  const theme = new MutationObserver(palette)
  for (let ancestor = host.parentElement; ancestor; ancestor = ancestor.parentElement) theme.observe(ancestor, { attributes: true, attributeFilter: ['class', 'style'] })
  const scheme = window.matchMedia('(prefers-color-scheme: dark)')
  scheme.addEventListener('change', palette)
  document.addEventListener('visibilitychange', requestDraw)
  const lost = event => { event.preventDefault(); onFailure() }
  renderer.domElement.addEventListener('webglcontextlost', lost)
  return {
    update(next) {
      const now = window.performance.now()
      if (initialized) sample(now)
      from = position; target = Number(next.checked); started = now; current = next
      const time = raw('--a1-switch-three-duration')
      duration = parseFloat(time) * (time.endsWith('ms') ? 1 : 1000)
      if (!initialized || next.still) position = from = target
      initialized = true; palette()
    },
    dispose() {
      disposed = true; window.cancelAnimationFrame(frame); resize.disconnect(); theme.disconnect()
      scheme.removeEventListener('change', palette); document.removeEventListener('visibilitychange', requestDraw)
      renderer.domElement.removeEventListener('webglcontextlost', lost)
      geometries.forEach(geometry => geometry.dispose()); materials.forEach(mat => mat.dispose())
      renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove(); probe.remove()
    },
  }
}
