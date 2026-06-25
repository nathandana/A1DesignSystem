import { Html, Line, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import {
  Breadcrumb,
  DataTable,
  Heading,
  MessageBadge,
  Paragraph,
  Section,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Toolbar,
  ToolbarGroup,
  ToolbarToggle,
  TreeMenu,
} from '@gtivr4/a1-design-system-react'
import { converter, inGamut } from 'culori'
import { createPortal } from 'react-dom'
import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import tokens from '../../../../../build/json/tokens.json'
import { getFoundationBreadcrumbItems } from './utils.js'

const toOklch = converter('oklch')
const isInSrgb = inGamut('rgb')
const toRgb = converter('rgb')
const LIGHTNESS_SCALE = 8
const CHROMA_SCALE = 12
const LIGHTNESS_LEVELS = [0.2, 0.4, 0.6, 0.8]
const GAMUT_EPSILON = 0.000001

function pointPosition(color) {
  const angle = ((color.h ?? 0) * Math.PI) / 180
  const radius = color.c * CHROMA_SCALE
  return [
    Math.cos(angle) * radius,
    (color.l - 0.5) * LIGHTNESS_SCALE,
    Math.sin(angle) * radius,
  ]
}

function isDisplayableSrgb(color) {
  const rgb = toRgb(color)
  return Boolean(rgb) && ['r', 'g', 'b'].every((channel) => (
    rgb[channel] >= -GAMUT_EPSILON && rgb[channel] <= 1 + GAMUT_EPSILON
  ))
}

function buildColorModel(resolvedValues = {}) {
  return Object.entries(tokens.base.color).map(([ramp, values]) => {
    const points = Object.entries(values)
      .filter(([step, value]) => /^\d+$/.test(step) && typeof value === 'string')
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([step, value]) => {
        const tokenName = `--base-color-${ramp}-${step}`
        const resolvedValue = resolvedValues[tokenName] || value
        const color = toOklch(resolvedValue)
        return {
          id: `${ramp}-${step}`,
          name: `${ramp}-${step}`,
          ramp,
          step: Number(step),
          value: resolvedValue,
          l: color?.l ?? 0,
          c: color?.c ?? 0,
          h: color?.h ?? 0,
          inGamut: isDisplayableSrgb(color),
          position: pointPosition(color),
        }
      })

    const lightnessDeltas = points.slice(1).map((point, index) => ({
      from: points[index],
      to: point,
      delta: Math.abs(point.l - points[index].l),
    }))
    const averageDelta = lightnessDeltas.reduce((sum, item) => sum + item.delta, 0) / Math.max(lightnessDeltas.length, 1)
    const steepest = lightnessDeltas.reduce((current, item) => (
      !current || item.delta > current.delta ? item : current
    ), null)

    return {
      id: ramp,
      name: ramp,
      points,
      diagnostics: {
        hueStart: points[0]?.h ?? 0,
        hueEnd: points.at(-1)?.h ?? 0,
        lightnessStart: points[0]?.l ?? 0,
        lightnessEnd: points.at(-1)?.l ?? 0,
        maxChroma: Math.max(...points.map((point) => point.c), 0),
        steepest,
        uneven: Boolean(steepest && averageDelta > 0 && steepest.delta > averageDelta * 1.45),
      },
    }
  })
}

function useResolvedRampValues(theme, colorMode) {
  const [values, setValues] = useState({})

  useEffect(() => {
    let frame
    function readValues() {
      const styles = getComputedStyle(document.documentElement)
      const next = {}
      Object.entries(tokens.base.color).forEach(([ramp, steps]) => {
        Object.keys(steps).forEach((step) => {
          const tokenName = `--base-color-${ramp}-${step}`
          next[tokenName] = styles.getPropertyValue(tokenName).trim()
        })
      })
      setValues(next)
    }
    function scheduleRead() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(readValues)
    }

    scheduleRead()
    const observer = new MutationObserver(scheduleRead)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme', 'data-color-mode'] })
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [theme, colorMode])

  return values
}

function useSceneColors() {
  const [colors, setColors] = useState({
    guide: '#64748b',
    subtle: '#c8d2e0',
    text: '#060b14',
    surface: '#ffffff',
  })

  useEffect(() => {
    function readColors() {
      const styles = getComputedStyle(document.documentElement)
      setColors({
        guide: styles.getPropertyValue('--semantic-color-border-strong').trim(),
        subtle: styles.getPropertyValue('--semantic-color-border-subtle').trim(),
        text: styles.getPropertyValue('--semantic-color-text-default').trim(),
        surface: styles.getPropertyValue('--semantic-color-surface-card').trim(),
      })
    }

    readColors()
    const observer = new MutationObserver(readColors)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme', 'data-color-mode'] })
    return () => observer.disconnect()
  }, [])

  return colors
}

function GamutBoundary({ color }) {
  const geometry = useMemo(() => {
    const hueSegments = 48
    const lightnessSegments = 18
    const positions = []
    const indices = []

    for (let lightnessIndex = 0; lightnessIndex <= lightnessSegments; lightnessIndex += 1) {
      const l = lightnessIndex / lightnessSegments
      for (let hueIndex = 0; hueIndex <= hueSegments; hueIndex += 1) {
        const h = (hueIndex / hueSegments) * 360
        let low = 0
        let high = 0.45
        for (let attempt = 0; attempt < 10; attempt += 1) {
          const c = (low + high) / 2
          if (isInSrgb({ mode: 'oklch', l, c, h })) low = c
          else high = c
        }
        positions.push(...pointPosition({ l, c: low, h }))
      }
    }

    const rowSize = hueSegments + 1
    for (let row = 0; row < lightnessSegments; row += 1) {
      for (let column = 0; column < hueSegments; column += 1) {
        const a = row * rowSize + column
        const b = a + rowSize
        indices.push(a, b, a + 1, b, b + 1, a + 1)
      }
    }

    const result = new THREE.BufferGeometry()
    result.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    result.setIndex(indices)
    result.computeVertexNormals()
    return result
  }, [])

  useEffect(() => () => geometry.dispose(), [geometry])

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial color={color} transparent opacity={0.08} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  )
}

function Guides({ showPlanes, colors }) {
  return (
    <group>
      <Line points={[[0, -4, 0], [0, 4, 0]]} color={colors.guide} lineWidth={1} />
      <Line points={[[-4, -4, 0], [4, -4, 0]]} color={colors.guide} lineWidth={1} />
      <Line points={[[0, -4, -4], [0, -4, 4]]} color={colors.guide} lineWidth={1} />
      {showPlanes && LIGHTNESS_LEVELS.map((level) => (
        <mesh
          key={level}
          position={[0, (level - 0.5) * LIGHTNESS_SCALE, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[3.85, 3.9, 64]} />
          <meshBasicMaterial color={colors.subtle} transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}

function ColorPoint({ point, selected, showLabel, showGamutWarnings, onSelect, sceneColors }) {
  return (
    <group position={point.position}>
      <mesh
        onClick={(event) => {
          event.stopPropagation()
          onSelect(point.id)
        }}
        scale={selected ? 1.45 : 1}
      >
        <sphereGeometry args={[0.11, 20, 20]} />
        <meshStandardMaterial
          color={point.value}
          emissive={point.value}
          emissiveIntensity={0.16}
          roughness={0.55}
        />
      </mesh>
      {showGamutWarnings && !point.inGamut && (
        <mesh>
          <sphereGeometry args={[0.16, 20, 20]} />
          <meshBasicMaterial color={sceneColors.text} transparent opacity={0.35} wireframe depthWrite={false} />
        </mesh>
      )}
      {(showLabel || selected) && (
        <Html position={[0.18, 0.18, 0]} center={false} style={{ pointerEvents: 'none' }}>
          <span className="a1-web-color-space-label">{point.name}</span>
        </Html>
      )}
    </group>
  )
}

function ColorScene({
  ramps,
  selectedPointId,
  onSelectPoint,
  connectRamps,
  showPlanes,
  showGamut,
  showGamutWarnings,
  showLabels,
}) {
  const sceneColors = useSceneColors()

  return (
    <div className="a1-web-color-space-scene">
      <Canvas
        camera={{ position: [7, 5.5, 7], fov: 46, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        fallback={<p className="a1-web-color-space-fallback">This browser cannot render the 3D color space.</p>}
        aria-label="Interactive OKLCH color token space. Drag to orbit, scroll to zoom, and use the token selector for an accessible alternative."
      >
        <ambientLight intensity={1.7} />
        <directionalLight position={[5, 8, 5]} intensity={2.2} />
        <Guides showPlanes={showPlanes} colors={sceneColors} />
        {showGamut && <GamutBoundary color={sceneColors.guide} />}
        {ramps.map((ramp) => (
          <group key={ramp.id}>
            {connectRamps && ramp.points.length > 1 && (
              <Line
                points={ramp.points.map((point) => point.position)}
                color={ramp.points[Math.floor(ramp.points.length / 2)]?.value}
                lineWidth={2}
                transparent
                opacity={0.72}
              />
            )}
            {ramp.points.map((point) => (
              <ColorPoint
                key={point.id}
                point={point}
                selected={point.id === selectedPointId}
                showLabel={showLabels}
                showGamutWarnings={showGamutWarnings}
                onSelect={onSelectPoint}
                sceneColors={sceneColors}
              />
            ))}
          </group>
        ))}
        <OrbitControls makeDefault enableDamping dampingFactor={0.08} minDistance={5} maxDistance={20} />
      </Canvas>
      <div className="a1-web-color-space-axis a1-web-color-space-axis--lightness">Lightness</div>
      <div className="a1-web-color-space-axis a1-web-color-space-axis--chroma">Chroma</div>
      <div className="a1-web-color-space-axis a1-web-color-space-axis--hue">Hue rotates around the center</div>
    </div>
  )
}

function VisualizationControls({
  ramps,
  selectedRamp,
  selectedPoint,
  onSelectRamp,
  onSelectPoint,
  showAllRamps,
  onShowAllRamps,
  connectRamps,
  onConnectRamps,
  showPlanes,
  onShowPlanes,
  showGamut,
  onShowGamut,
  showGamutWarnings,
  onShowGamutWarnings,
  showLabels,
  onShowLabels,
  activeTab,
  selectedStep,
  onSelectedStep,
}) {
  const rampItems = ramps.map((ramp) => ({
    value: ramp.id,
    label: ramp.name,
    swatch: ramp.points.find((point) => point.step === 500)?.value
      ?? ramp.points[Math.floor(ramp.points.length / 2)]?.value,
  }))
  const tokenItems = selectedRamp.points.map((point) => ({
    value: point.id,
    label: point.name,
    swatch: point.value,
  }))
  const stepItems = [...new Set(ramps.flatMap((ramp) => ramp.points.map((point) => point.step)))]
    .sort((a, b) => a - b)
    .map((step) => ({
      id: `step-${step}`,
      label: String(step),
      icon: 'tonality',
    }))

  return (
    <div className="a1-web-config-aside__inner">
      <div className="a1-web-config-panel">
        <div className="a1-web-config-panel__body">
          <Stack gap="md">
            {activeTab !== 'alignment' && (
              <Toolbar label="Ramp" fullWidth>
                <ToolbarGroup
                  aria-label="Ramp"
                  value={selectedRamp.id}
                  onChange={onSelectRamp}
                  options={rampItems}
                  columns={4}
                />
              </Toolbar>
            )}
            {activeTab === 'alignment' ? (
              <Stack gap="xs">
                <Paragraph size="xs" color="muted">Ramp step</Paragraph>
                <TreeMenu
                  aria-label="Ramp step"
                  items={stepItems}
                  selectedId={`step-${selectedStep}`}
                  onSelect={(id) => onSelectedStep(Number(id.replace('step-', '')))}
                />
              </Stack>
            ) : (
              <>
                <Toolbar label="Token" fullWidth>
                  <ToolbarGroup
                    aria-label="Token"
                    value={selectedPoint.id}
                    onChange={onSelectPoint}
                    options={tokenItems}
                    columns={6}
                  />
                </Toolbar>
                <Toolbar label="Ramps" fullWidth>
                  {activeTab === 'space' && (
                    <ToolbarToggle
                      icon="visibility"
                      label="Show all ramps"
                      pressed={showAllRamps}
                      onChange={onShowAllRamps}
                    />
                  )}
                  <ToolbarToggle
                    icon="timeline"
                    label="Connect ramp steps"
                    pressed={connectRamps}
                    onChange={onConnectRamps}
                  />
                </Toolbar>
                <Toolbar label="Guides" fullWidth>
                  <ToolbarToggle
                    icon="layers"
                    label="Lightness guides"
                    pressed={showPlanes}
                    onChange={onShowPlanes}
                  />
                  <ToolbarToggle
                    icon="deployed_code"
                    label="sRGB boundary"
                    pressed={showGamut}
                    onChange={onShowGamut}
                  />
                  <ToolbarToggle
                    icon="grid_on"
                    label="Out-of-gamut warnings"
                    pressed={showGamutWarnings}
                    onChange={onShowGamutWarnings}
                  />
                  <ToolbarToggle
                    icon="label"
                    label="Token names"
                    pressed={showLabels}
                    onChange={onShowLabels}
                  />
                </Toolbar>
                <Stack gap="xs">
                  <MessageBadge status="neutral" subtle icon="grid_on">
                    Out-of-gamut warning
                  </MessageBadge>
                  <Paragraph size="xs" color="muted">
                    A wireframe shell marks a theoretical OKLCH coordinate outside sRGB. Current hex tokens should not show one; the toggle is useful when future editable coordinates are added.
                  </Paragraph>
                </Stack>
              </>
            )}
          </Stack>
        </div>
      </div>
    </div>
  )
}

function formatDecimal(value) {
  return value.toFixed(3)
}

function formatDegree(value) {
  return `${Math.round(value)}°`
}

function RampDiagnostics({ ramp, selectedPoint }) {
  const { diagnostics } = ramp
  const warning = diagnostics.uneven
    ? `${diagnostics.steepest.from.name} to ${diagnostics.steepest.to.name} has the steepest lightness change.`
    : 'Lightness changes are broadly even across neighboring steps.'

  const rows = [
    { id: 'hue', metric: 'Hue drift', value: `${formatDegree(diagnostics.hueStart)} → ${formatDegree(diagnostics.hueEnd)}` },
    { id: 'lightness', metric: 'Lightness range', value: `${formatDecimal(diagnostics.lightnessStart)} → ${formatDecimal(diagnostics.lightnessEnd)}` },
    { id: 'chroma', metric: 'Maximum chroma', value: formatDecimal(diagnostics.maxChroma) },
    { id: 'smoothness', metric: 'Step smoothness', value: warning },
  ]

  return (
    <Stack gap="md">
      <Heading as="h2" size="lg">{ramp.name} ramp</Heading>
      <DataTable
        columns={[
          { key: 'metric', label: 'Metric' },
          { key: 'value', label: 'Value' },
        ]}
        rows={rows}
        getRowId={(row) => row.id}
        size="compact"
        caption={`${ramp.name} ramp diagnostics`}
      />
      {selectedPoint && (
        <output className="a1-web-color-space-selection" aria-live="polite">
          <span className="a1-web-color-space-swatch" style={{ '--a1-color-space-swatch': selectedPoint.value }} />
          <span>
            <strong>{selectedPoint.name}</strong><br />
            {selectedPoint.value} · L {formatDecimal(selectedPoint.l)} · C {formatDecimal(selectedPoint.c)} · H {formatDegree(selectedPoint.h)}
          </span>
        </output>
      )}
    </Stack>
  )
}

function StepAlignment({ ramps, selectedStep }) {
  const rows = ramps.map((ramp) => ({
    ramp,
    point: ramp.points.find((point) => point.step === selectedStep),
  }))

  return (
    <Stack gap="md">
      <div className="a1-web-color-alignment" role="img" aria-label={`Lightness alignment for color step ${selectedStep}`}>
        <div className="a1-web-color-alignment__scale" aria-hidden="true">
          <span />
          <span><span>0</span><span>0.5</span><span>1</span></span>
          <span />
        </div>
        {rows.map(({ ramp, point }) => (
          <div className="a1-web-color-alignment__row" key={ramp.id}>
            <span>{ramp.name}</span>
            <div className="a1-web-color-alignment__track">
              {point ? (
                <span
                  className="a1-web-color-alignment__point"
                  style={{
                    '--a1-color-lightness': `${point.l * 100}%`,
                    '--a1-color-value': point.value,
                  }}
                  title={`${point.name}: lightness ${formatDecimal(point.l)}`}
                />
              ) : (
                <span className="a1-web-color-alignment__missing">No step</span>
              )}
            </div>
            <span>{point ? formatDecimal(point.l) : '—'}</span>
          </div>
        ))}
      </div>
    </Stack>
  )
}

export function ColorVisualizationFoundationPage({ onNavigate, theme, colorMode }) {
  const resolvedRampValues = useResolvedRampValues(theme, colorMode)
  const ramps = useMemo(() => buildColorModel(resolvedRampValues), [resolvedRampValues])
  const [activeTab, setActiveTab] = useState('space')
  const [selectedRampId, setSelectedRampId] = useState(ramps.find((ramp) => ramp.id === 'info')?.id ?? ramps[0]?.id)
  const [selectedPointId, setSelectedPointId] = useState(`${selectedRampId}-500`)
  const [showAllRamps, setShowAllRamps] = useState(true)
  const [connectRamps, setConnectRamps] = useState(true)
  const [showPlanes, setShowPlanes] = useState(true)
  const [showGamut, setShowGamut] = useState(true)
  const [showGamutWarnings, setShowGamutWarnings] = useState(true)
  const [showLabels, setShowLabels] = useState(false)
  const [selectedStep, setSelectedStep] = useState(500)
  const [asideNode, setAsideNode] = useState(null)

  const selectedRamp = ramps.find((ramp) => ramp.id === selectedRampId) ?? ramps[0]
  const visibleRamps = showAllRamps ? ramps : [selectedRamp]
  const selectedPoint = ramps.flatMap((ramp) => ramp.points).find((point) => point.id === selectedPointId)
    ?? selectedRamp.points[0]

  useLayoutEffect(() => {
    const find = () => setAsideNode(document.getElementById('a1-web-color-visualization-aside-slot'))
    find()
    window.addEventListener('resize', find)
    return () => window.removeEventListener('resize', find)
  }, [])

  function selectRamp(id) {
    setSelectedRampId(id)
    const ramp = ramps.find((item) => item.id === id)
    setSelectedPointId(ramp?.points.find((point) => point.step === 500)?.id ?? ramp?.points[0]?.id)
  }

  return (
    <>
      {asideNode && createPortal(
        <VisualizationControls
          ramps={ramps}
          selectedRamp={selectedRamp}
          selectedPoint={selectedPoint}
          onSelectRamp={selectRamp}
          onSelectPoint={setSelectedPointId}
          showAllRamps={showAllRamps}
          onShowAllRamps={setShowAllRamps}
          connectRamps={connectRamps}
          onConnectRamps={setConnectRamps}
          showPlanes={showPlanes}
          onShowPlanes={setShowPlanes}
          showGamut={showGamut}
          onShowGamut={setShowGamut}
          showGamutWarnings={showGamutWarnings}
          onShowGamutWarnings={setShowGamutWarnings}
          showLabels={showLabels}
          onShowLabels={setShowLabels}
          activeTab={activeTab}
          selectedStep={selectedStep}
          onSelectedStep={setSelectedStep}
        />,
        asideNode,
      )}
      <Section
        padding="xs"
        contentWidth="xl"
        surface="panel"
        borderSize="sm"
        borderVariant="accent"
        borderSides="bottom"
      >
        <Stack direction="column" gap="xs">
          <Breadcrumb items={getFoundationBreadcrumbItems('Color visualization', onNavigate)} />
          <Heading as="h1" id="color-visualization-heading" size={{ xs: 'lg', md: 'xxl' }}>
            Color visualization
          </Heading>
          <Paragraph size="sm" color="muted">
            Inspect A1 color ramps in OKLCH space. Height represents lightness, distance from the center represents chroma, and rotation represents hue.
          </Paragraph>
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="xl" aria-labelledby="color-visualization-heading">
        <Tabs value={activeTab} onChange={setActiveTab} variant="line">
          <TabList>
            <Tab value="space" icon="deployed_code">3D space</Tab>
            <Tab value="ramp" icon="timeline">Ramp inspector</Tab>
            <Tab value="alignment" icon="align_vertical_center">Step alignment</Tab>
          </TabList>

          <TabPanel value="space">
            <Stack gap="md">
              <ColorScene
                ramps={visibleRamps}
                selectedPointId={selectedPoint.id}
                onSelectPoint={(id) => {
                  setSelectedPointId(id)
                  const point = ramps.flatMap((ramp) => ramp.points).find((item) => item.id === id)
                  if (point) setSelectedRampId(point.ramp)
                }}
                connectRamps={connectRamps}
                showPlanes={showPlanes}
                showGamut={showGamut}
                showGamutWarnings={showGamutWarnings}
                showLabels={showLabels}
              />
              <RampDiagnostics ramp={selectedRamp} selectedPoint={selectedPoint} />
            </Stack>
          </TabPanel>

          <TabPanel value="ramp">
            <Stack gap="md">
              <ColorScene
                ramps={[selectedRamp]}
                selectedPointId={selectedPoint.id}
                onSelectPoint={setSelectedPointId}
                connectRamps={connectRamps}
                showPlanes={showPlanes}
                showGamut={showGamut}
                showGamutWarnings={showGamutWarnings}
                showLabels={showLabels}
              />
              <RampDiagnostics ramp={selectedRamp} selectedPoint={selectedPoint} />
            </Stack>
          </TabPanel>

          <TabPanel value="alignment">
            <StepAlignment ramps={ramps} selectedStep={selectedStep} />
          </TabPanel>
        </Tabs>
      </Section>
    </>
  )
}
