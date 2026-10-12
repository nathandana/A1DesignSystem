import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { flapPose } from './flap-model.js'

// Shared physical mechanism. Each host supplies token-resolved materials and geometry.
export function createSplitFlapScene(host, { tokens: t, inverted, view, columns, rows = 1, separators = false, feet = true, housing = true, revealInitial = false, characterPath, sequenceTiming = 'step', font, onFailure }) {
  const document = host.ownerDocument, window = document.defaultView
  const count = columns * rows
  const pairGap = separators ? t.pairGap : 0
  const rowGap = t.rowGap ?? t.digitGap
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  renderer.outputColorSpace = THREE.SRGBColorSpace
  host.appendChild(renderer.domElement)
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(t.cameraFov, 1, 0.1, 100)
  const geometries = new Set(), materials = new Set(), textures = new Map()
  const material = props => {
    const result = new THREE.MeshStandardMaterial({ roughness: t.roughness, ...props })
    materials.add(result)
    return result
  }
  const stock = inverted ? t.white : t.black, ink = inverted ? t.black : t.white
  const cardMaterial = material({ color: stock })
  const caseMaterial = material({ color: t.housing, metalness: t.metalness / 2 })
  const recessMaterial = material({ color: t.recess })
  const metalMaterial = material({ color: t.metal, metalness: t.metalness, roughness: t.roughness / 2 })
  function box(parent, w, h, d, radius, mat, x = 0, y = 0, z = 0) {
    const geometry = new RoundedBoxGeometry(w, h, d, 2, radius)
    geometries.add(geometry)
    const mesh = new THREE.Mesh(geometry, mat)
    mesh.position.set(x, y, z)
    mesh.castShadow = mesh.receiveShadow = true
    parent.add(mesh)
    return mesh
  }
  function sphere(x, y, z, radius, mat) {
    const geometry = new THREE.SphereGeometry(radius, 16, 8)
    geometries.add(geometry)
    const mesh = new THREE.Mesh(geometry, mat)
    mesh.position.set(x, y, z)
    scene.add(mesh)
  }
  function face(value, half) {
    const key = `${value}-${half}`
    if (textures.has(key)) return textures.get(key)
    const source = document.createElement('canvas')
    source.width = t.textureWidth; source.height = t.textureHeight
    const ctx = source.getContext('2d')
    ctx.fillStyle = stock; ctx.fillRect(0, 0, source.width, source.height)
    ctx.fillStyle = ink
    ctx.font = `${t.numeralWeight} ${source.height * t.numeralScale}px ${font}`
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText(value, source.width / 2, source.height / 2, source.width * (t.inkWidth ?? 1))
    const cropped = document.createElement('canvas')
    cropped.width = source.width; cropped.height = source.height / 2
    cropped.getContext('2d').drawImage(source, 0, half * cropped.height, source.width, cropped.height, 0, 0, cropped.width, cropped.height)
    const map = new THREE.CanvasTexture(cropped)
    map.colorSpace = THREE.SRGBColorSpace
    const mat = material({ map })
    textures.set(key, mat)
    return mat
  }
  const span = columns * t.digitWidth + (columns - 1) * t.digitGap + (columns / 2 - 1) * pairGap
  const padding = housing ? t.housingPadding : t.digitGap
  const caseWidth = span + padding * 2
  const caseHeight = rows * t.digitHeight + (rows - 1) * rowGap + padding * 2
  const footHeight = feet ? t.footHeight : 0
  if (housing) box(scene, caseWidth, caseHeight, t.housingDepth, t.housingRadius, caseMaterial)
  for (const side of [-1, 1]) {
    if (feet) box(scene, t.footWidth, t.footHeight, t.housingDepth, t.cardRadius, recessMaterial,
      side * (caseWidth / 2 - t.footWidth), -caseHeight / 2 - t.footHeight / 2)
    if (housing) for (const y of [-1, 1]) sphere(side * (caseWidth / 2 - t.housingPadding / 2), y * (caseHeight / 2 - t.housingPadding / 2), t.housingDepth / 2, t.pinRadius, metalMaterial)
  }
  const digits = Array.from({ length: count }, (_, index) => {
    const column = index % columns, row = Math.floor(index / columns)
    const x = -span / 2 + t.digitWidth / 2 + column * (t.digitWidth + t.digitGap) + Math.floor(column / 2) * pairGap
    const y = ((rows - 1) / 2 - row) * (t.digitHeight + rowGap)
    const group = new THREE.Group(); group.position.set(x, y, t.cardFront); scene.add(group)
    if (housing) box(group, t.digitWidth + t.digitGap, t.digitHeight + t.digitGap, t.cardDepth, t.cardRadius, recessMaterial, 0, 0, -t.cardDepth * 2)
    // Visible layers behind the active card give the mechanism real thickness.
    for (const layer of [2, 1]) box(group, t.digitWidth, t.digitHeight, t.cardDepth, t.cardRadius, cardMaterial, 0, layer * t.seam, -layer * t.cardDepth)
    const halfHeight = (t.digitHeight - t.seam) / 2
    function halfCard(parent, half, z = 0) {
      return box(parent, t.digitWidth, halfHeight, t.cardDepth, t.cardRadius, cardMaterial,
        0, (half === 0 ? 1 : -1) * (halfHeight + t.seam) / 2, z)
    }
    const top = halfCard(group, 0), bottom = halfCard(group, 1)
    const outgoing = new THREE.Group(), incoming = new THREE.Group()
    group.add(outgoing, incoming)
    outgoing.position.z = incoming.position.z = t.cardDepth
    const oldTop = halfCard(outgoing, 0), newBottom = halfCard(incoming, 1)
    outgoing.visible = incoming.visible = false
    for (const side of [-1, 1]) {
      const geometry = new THREE.CylinderGeometry(t.pinRadius, t.pinRadius, t.pinLength, 16)
      geometries.add(geometry)
      const pin = new THREE.Mesh(geometry, metalMaterial)
      pin.rotation.z = Math.PI / 2
      pin.position.set(side * t.digitWidth / 2, 0, t.cardDepth)
      group.add(pin)
    }
    if (separators && column % 2 === 1 && column < columns - 1) {
      for (const side of [-1, 1]) sphere(x + t.digitWidth / 2 + (t.pairGap + t.digitGap) / 2,
        y + side * t.digitHeight / 6, t.cardFront, t.dotRadius, metalMaterial)
    }
    return { top, bottom, outgoing, incoming, oldTop, newBottom, value: null, displayed: null, queue: [], step: -1, start: 0, active: false }
  })
  function setFace(mesh, value, half) {
    mesh.material = [cardMaterial, cardMaterial, cardMaterial, cardMaterial, face(value, half), cardMaterial]
  }
  scene.add(new THREE.AmbientLight(t.light, t.ambientIntensity))
  const key = new THREE.DirectionalLight(t.light, t.keyIntensity)
  key.position.set(t.lightSide, t.lightHeight, t.lightFront)
  key.castShadow = true
  key.shadow.mapSize.set(2048, 2048)
  Object.assign(key.shadow.camera, { left: -caseWidth, right: caseWidth, top: caseWidth, bottom: -caseWidth })
  key.shadow.bias = -0.0001
  scene.add(key)
  const fill = new THREE.DirectionalLight(t.light, t.fillIntensity)
  fill.position.set(-t.lightSide, 0, t.lightFront); scene.add(fill)
  const shadowMaterial = new THREE.ShadowMaterial({ opacity: t.shadowOpacity })
  materials.add(shadowMaterial)
  const groundGeometry = new THREE.PlaneGeometry(caseWidth * 4, caseWidth * 4)
  geometries.add(groundGeometry)
  const ground = new THREE.Mesh(groundGeometry, shadowMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -caseHeight / 2 - footHeight
  ground.receiveShadow = true; scene.add(ground)
  let frame = 0, duration = parseFloat(t.duration) * (t.duration.endsWith('ms') ? 1 : 1000), disposed = false
  function draw(now = performance.now()) {
    frame = 0
    if (disposed) return
    let active = false
    for (const digit of digits) {
      if (!digit.active) continue
      const stepDuration = sequenceTiming === 'total' ? duration / Math.max(1, digit.queue.length) : duration
      let elapsed = (now - digit.start) / stepDuration
      if (characterPath) {
        const step = Math.min(digit.queue.length, Math.max(0, Math.floor(elapsed)))
        if (step !== digit.step && step < digit.queue.length) {
          const previous = step ? digit.queue[step - 1] : digit.displayed
          const next = digit.queue[step]
          setFace(digit.top, next, 0); setFace(digit.bottom, previous, 1)
          setFace(digit.oldTop, previous, 0); setFace(digit.newBottom, next, 1)
          digit.step = step
        }
        elapsed = step >= digit.queue.length ? 1 : elapsed - step
      }
      const pose = flapPose(elapsed)
      digit.outgoing.rotation.x = pose.outgoing
      digit.incoming.rotation.x = pose.incoming
      digit.outgoing.visible = pose.firstHalf && !pose.complete
      digit.incoming.visible = !pose.firstHalf && !pose.complete
      if (pose.complete) {
        setFace(digit.top, digit.value, 0)
        setFace(digit.bottom, digit.value, 1)
        digit.displayed = digit.value
        digit.active = false
      } else active = true
    }
    renderer.domElement.dataset.flipping = String(active)
    if (characterPath) {
      renderer.domElement.dataset.activeCards = String(digits.filter(digit => digit.active).length)
      renderer.domElement.dataset.characters = digits.map(digit => digit.active ? (digit.queue[Math.max(0, digit.step)] ?? digit.value) : digit.value).join('')
    }
    renderer.render(scene, camera)
    if (active && !document.hidden) frame = requestAnimationFrame(draw)
  }
  function requestDraw() { if (!frame && !disposed) frame = requestAnimationFrame(draw) }
  function resize() {
    const { width, height } = host.getBoundingClientRect()
    if (!width || !height) return
    renderer.setSize(width, height)
    camera.aspect = width / height
    const distance = Math.max(caseHeight + footHeight, caseWidth / camera.aspect) * t.cameraPadding / (2 * Math.tan(THREE.MathUtils.degToRad(t.cameraFov) / 2))
    camera.position.set(view === 'front' ? 0 : distance * t.viewAzimuth, view === 'front' ? 0 : distance * t.viewElevation, distance)
    camera.lookAt(0, -footHeight / 2, 0)
    camera.updateProjectionMatrix(); requestDraw()
  }
  function contextLost(event) { event.preventDefault(); onFailure() }
  renderer.domElement.addEventListener('webglcontextlost', contextLost)
  const observer = new ResizeObserver(resize); observer.observe(host); resize()
  document.addEventListener('visibilitychange', requestDraw)
  return {
    update(value, milliseconds, reducedMotion) {
      duration = milliseconds
      const start = performance.now()
      digits.forEach((digit, index) => {
        const next = value[index]
        if (next !== digit.value) {
          // Retarget from the currently displayed option, including interrupted cycles.
          const previous = (characterPath && digit.active
            ? digit.queue[Math.max(0, digit.step)] ?? digit.displayed
            : digit.displayed ?? digit.value) ?? (revealInitial ? ' ' : next)
          digit.displayed = previous
          digit.queue = characterPath ? characterPath(previous, next) : []
          digit.step = -1
          setFace(digit.top, next, 0)
          setFace(digit.bottom, previous, 1)
          setFace(digit.oldTop, previous, 0)
          setFace(digit.newBottom, next, 1)
          digit.active = (digit.value !== null || revealInitial) && !reducedMotion && !document.hidden && (!characterPath || digit.queue.length > 0)
          digit.value = next; digit.start = start
        }
        if (reducedMotion || !digit.active) {
          digit.active = false
          digit.outgoing.visible = digit.incoming.visible = false
          setFace(digit.top, next, 0)
          setFace(digit.bottom, next, 1)
          digit.displayed = next
        }
      })
      requestDraw()
    },
    dispose() {
      disposed = true; cancelAnimationFrame(frame); observer.disconnect()
      document.removeEventListener('visibilitychange', requestDraw)
      renderer.domElement.removeEventListener('webglcontextlost', contextLost)
      geometries.forEach(geometry => geometry.dispose())
      materials.forEach(mat => { mat.map?.dispose(); mat.dispose() })
      key.shadow.dispose()
      renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove()
    },
  }
}
