import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Accordion,
  Autocomplete,
  Banner,
  Button,
  ButtonContainer,
  Card,
  Code,
  DataTable,
  DefinitionList,
  Divider,
  Heading,
  Icon,
  IconButton,
  InlineEditable,
  Link,
  MessageBadge,
  NumberField,
  Paragraph,
  Section,
  SegmentedControl,
  Slider,
  Stack,
  Switch,
  TextareaField,
  TextField,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  ToolbarGroup,
} from '@gtivr4/a1-design-system-react'
import { DEFAULT_RAMPS, RAMP_LABELS, RAMP_NAMES, RAMP_STOPS } from '../lib/themeColors.ts'
import { compileThemeVars, inverseSemanticVars, rampFrom500, rampsFrom500, themeJsonString } from '../lib/themeCompile.ts'
import { DEFAULT_FONT_SIZES, DEFAULT_FONT_WEIGHTS, DEFAULT_ICON_SETTINGS, DEFAULT_SEMANTIC_COLORS, DEFAULT_TEXT_COLORS, DEFAULT_TYPE_ADVANCED, DEFAULT_TYPE_STYLES, SCALE_STEPS, SEMANTIC_COLOR_GROUPS, getTheme, updateTheme } from '../lib/themeStore.ts'
import { describeError, generateFontPairing, generateTheme } from '../lib/aiTheme.ts'
import { hasApiKey, setApiKey } from '../lib/aiImages.ts'
import { RenderPageDefinition } from '../editor/pageRenderer.tsx'
import { EditorHistoryPanel } from '../editor/EditorHistoryPanel.jsx'
import { STYLE_TILE_DEFINITION } from './themeStyleTile.js'
import { formatHex, hsl as toHsl, rgb as toRgb, wcagContrast } from 'culori'

const GOOGLE_FONTS = [
  'Inter', 'Manrope', 'Roboto', 'Open Sans', 'Montserrat', 'Poppins', 'Raleway', 'Nunito', 'Work Sans',
  'Source Sans 3', 'DM Sans', 'Space Grotesk', 'Sora', 'Jost', 'Outfit', 'Hanken Grotesk', 'Plus Jakarta Sans',
  'Rubik', 'Karla', 'Mulish', 'Figtree', 'Archivo', 'Lora', 'Merriweather', 'Playfair Display', 'Libre Baskerville',
  'Cormorant Garamond', 'EB Garamond', 'Fraunces', 'DM Serif Display', 'Spectral', 'Bitter', 'Crimson Text',
  'Abril Fatface', 'Bebas Neue', 'Oswald', 'Josefin Sans', 'Quicksand', 'Comfortaa', 'Pinyon Script',
  'Great Vibes', 'Tangerine', 'Sacramento', 'Dancing Script', 'Caveat',
].map((f) => ({ value: f, label: f }))

const WEIGHT_VALUES = [100, 200, 300, 400, 500, 600, 700, 800, 900]
const WEIGHT_NAMES = {
  100: 'Thin', 200: 'Extra-light', 300: 'Light', 400: 'Regular', 500: 'Medium',
  600: 'Semi-bold', 700: 'Bold', 800: 'Extra-bold', 900: 'Black',
}
const FONT_ROLES = [
  { slot: 'display', label: 'Display' },
  { slot: 'heading', label: 'Heading' },
  { slot: 'body', label: 'Body' },
]

// Letter spacing detents (em × 100, kept small) — tighter → looser.
const LETTER_SPACING_VALUES = [-3, -2, -1, 0, 2, 4, 8]

// Per-role font-family CSS var (so plain elements in the scale preview pick up the role's font).
const ROLE_FONT_VAR = {
  display: 'var(--component-heading-font-family-display)',
  heading: 'var(--component-heading-font-family-heading)',
  body: 'var(--component-paragraph-font-family)',
}

const TEXT_COLOR_FIELDS = [
  { name: 'default', label: 'Default' },
  { name: 'muted', label: 'Muted' },
  { name: 'accent', label: 'Accent' },
  { name: 'inverse', label: 'Inverse' },
]

const AUTO_NONE = [{ value: 'auto', label: 'Auto' }, { value: 'none', label: 'None' }]
const KERNING_OPTS = [{ value: 'auto', label: 'Auto' }, { value: 'normal', label: 'Normal' }, { value: 'none', label: 'None' }]
const RENDERING_OPTS = [
  { value: 'auto', label: 'Auto' },
  { value: 'optimizeLegibility', label: 'Legible' },
  { value: 'optimizeSpeed', label: 'Speed' },
  { value: 'geometricPrecision', label: 'Precise' },
]
const WEBKIT_SMOOTH_OPTS = [{ value: 'auto', label: 'Auto' }, { value: 'antialiased', label: 'Antialiased' }, { value: 'none', label: 'None' }]
const MOZ_SMOOTH_OPTS = [{ value: 'auto', label: 'Auto' }, { value: 'grayscale', label: 'Grayscale' }]

const TRANSFORM_OPTIONS = [
  { value: 'none', label: 'None', icon: 'block' },
  { value: 'capitalize', label: 'Capitalize', icon: 'match_case' },
  { value: 'uppercase', label: 'Uppercase', icon: 'text_fields' },
  { value: 'lowercase', label: 'Lowercase', icon: 'text_format' },
]

const STYLE_OPTIONS = [
  { value: 'normal', label: 'Normal', icon: 'format_clear' },
  { value: 'italic', label: 'Italic', icon: 'format_italic' },
]

const ROLE_LABEL = { display: 'Display', heading: 'Heading', body: 'Body' }

/** Inline CSS for a role's preview-only type refinements (letter-spacing in em×100 + advanced font props). */
function typeCss(rs) {
  const s = {
    letterSpacing: `${(rs.letterSpacing ?? 0) / 100}em`,
    fontStyle: rs.fontStyle,
    textTransform: rs.textTransform,
  }
  const a = rs.advanced
  if (!a) return s
  if (a.fontSynthesis !== 'auto') s.fontSynthesis = a.fontSynthesis
  if (a.fontSynthesisWeight !== 'auto') s.fontSynthesisWeight = a.fontSynthesisWeight
  if (a.fontSynthesisStyle !== 'auto') s.fontSynthesisStyle = a.fontSynthesisStyle
  if (a.fontSynthesisSmallCaps !== 'auto') s.fontSynthesisSmallCaps = a.fontSynthesisSmallCaps
  if (a.fontKerning !== 'auto') s.fontKerning = a.fontKerning
  if (a.fontOpticalSizing !== 'auto') s.fontOpticalSizing = a.fontOpticalSizing
  if (a.fontSizeAdjust) s.fontSizeAdjust = (a.fontSizeAdjust / 100).toFixed(2)
  if (a.textRendering !== 'auto') s.textRendering = a.textRendering
  if (a.webkitFontSmoothing !== 'auto') s.WebkitFontSmoothing = a.webkitFontSmoothing
  if (a.mozOsxFontSmoothing !== 'auto') s.MozOsxFontSmoothing = a.mozOsxFontSmoothing
  return s
}

function loadGoogleFont(family) {
  if (!family) return
  const id = `gf-${family.replace(/\s+/g, '-')}`
  if (document.getElementById(id)) return
  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, '+')}:ital,wght@0,100..900;1,100..900&display=swap`
  document.head.appendChild(link)
}

const COLOR_COLUMNS = [
  { key: 'swatch', label: '', width: '3rem' },
  { key: 'ramp', label: 'Ramp', sortable: true },
  { key: 'step', label: 'Step', type: 'number', sortable: true },
  { key: 'value', label: 'Value', sortable: true },
]

/** Style tile shown in the "Preview" toggle — renders the showcase page
 *  definition under the live theme vars so the whole design language is visible. */
function StyleTile({ vars }) {
  return (
    <div className="a1-web-style-tile" style={vars}>
      <RenderPageDefinition definition={STYLE_TILE_DEFINITION} />
    </div>
  )
}

const COLOR_MODEL_OPTIONS = [
  { value: 'hex', label: 'Hex' },
  { value: 'rgb', label: 'RGB' },
  { value: 'hsl', label: 'HSL' },
]

// Friendly history labels derived from the patched keys.
const PATCH_LABELS = {
  ramps: 'Edit colour ramp',
  fonts: 'Change font',
  fontWeights: 'Change font weight',
  typeStyles: 'Edit type style',
  fontSizes: 'Edit type scale',
  textColors: 'Edit text colour',
  semanticColors: 'Edit semantic colour',
  roundness: 'Change roundness',
  icon: 'Edit icons',
  name: 'Rename theme',
  description: 'Edit description',
}
function describePatch(partial) {
  const keys = Object.keys(partial || {})
  if (keys.length > 1) return 'Generate with AI'
  return PATCH_LABELS[keys[0]] ?? 'Edit'
}
function histEntry(theme, label) {
  return { id: `h-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, theme, label, timestamp: Date.now() }
}

/** A single ramp colour, editable as a swatch + hex / RGB / HSL inputs. */
function ColorRow({ label, value, model, onChange }) {
  const hex = value || '#000000'
  const [hexText, setHexText] = useState(hex)
  useEffect(() => { setHexText(hex) }, [hex])

  let fields = null
  if (model === 'hex') {
    fields = (
      <input
        type="text"
        className="a1-web-color-hex-input"
        value={hexText}
        spellCheck={false}
        aria-label={`${label} hex`}
        onChange={(e) => {
          const v = e.target.value
          setHexText(v)
          if (/^#[0-9a-fA-F]{6}$/.test(v)) onChange(v)
        }}
        onBlur={() => setHexText(hex)}
      />
    )
  } else if (model === 'rgb') {
    const c = toRgb(hex) || { r: 0, g: 0, b: 0 }
    const r = Math.round((c.r ?? 0) * 255)
    const g = Math.round((c.g ?? 0) * 255)
    const b = Math.round((c.b ?? 0) * 255)
    const set = (nr, ng, nb) => onChange(formatHex({ mode: 'rgb', r: nr / 255, g: ng / 255, b: nb / 255 }))
    fields = (
      <span className="a1-web-color-fields">
        <input type="number" className="a1-web-color-num" min="0" max="255" value={r} aria-label={`${label} red`} onChange={(e) => set(Number(e.target.value) || 0, g, b)} />
        <input type="number" className="a1-web-color-num" min="0" max="255" value={g} aria-label={`${label} green`} onChange={(e) => set(r, Number(e.target.value) || 0, b)} />
        <input type="number" className="a1-web-color-num" min="0" max="255" value={b} aria-label={`${label} blue`} onChange={(e) => set(r, g, Number(e.target.value) || 0)} />
      </span>
    )
  } else {
    const c = toHsl(hex) || { h: 0, s: 0, l: 0 }
    const h = Math.round(c.h ?? 0)
    const s = Math.round((c.s ?? 0) * 100)
    const l = Math.round((c.l ?? 0) * 100)
    const set = (nh, ns, nl) => onChange(formatHex({ mode: 'hsl', h: nh, s: ns / 100, l: nl / 100 }))
    fields = (
      <span className="a1-web-color-fields">
        <input type="number" className="a1-web-color-num" min="0" max="360" value={h} aria-label={`${label} hue`} onChange={(e) => set(Number(e.target.value) || 0, s, l)} />
        <input type="number" className="a1-web-color-num" min="0" max="100" value={s} aria-label={`${label} saturation`} onChange={(e) => set(h, Number(e.target.value) || 0, l)} />
        <input type="number" className="a1-web-color-num" min="0" max="100" value={l} aria-label={`${label} lightness`} onChange={(e) => set(h, s, Number(e.target.value) || 0)} />
      </span>
    )
  }

  return (
    <div className="a1-web-theme-color-row">
      <input type="color" className="a1-web-theme-swatch" value={hex} aria-label={`${label} colour`} onChange={(e) => onChange(e.target.value)} />
      <span className="a1-web-theme-color-name">{label}</span>
      {fields}
    </div>
  )
}

// Which semantic tokens each individual preview element uses — drives the
// click-to-filter so e.g. clicking the tertiary button shows just its colours.
const ELEMENT_TOKENS = {
  'button-primary': ['action-background', 'action-foreground'],
  'button-secondary': ['action-border', 'text-accent'],
  'button-tertiary': ['text-accent'],
  heading: ['text-default'],
  body: ['text-default'],
  muted: ['text-muted'],
  link: ['text-accent'],
  card: ['surface-card', 'text-default', 'text-muted', 'border-subtle'],
  field: ['border-strong', 'text-default'],
  'badge-info': ['status-info-background', 'status-info-foreground'],
  'badge-success': ['status-success-background', 'status-success-foreground'],
  'badge-warn': ['status-warn-background', 'status-warn-foreground'],
  'badge-error': ['status-error-background', 'status-error-foreground'],
}
const ELEMENT_LABELS = {
  'button-primary': 'Primary button', 'button-secondary': 'Secondary button', 'button-tertiary': 'Tertiary button',
  heading: 'Heading', body: 'Body text', muted: 'Muted text', link: 'Link',
  card: 'Card', field: 'Field',
  'badge-info': 'Info badge', 'badge-success': 'Success badge', 'badge-warn': 'Warn badge', 'badge-error': 'Error badge',
}

// Foreground/background pairings from the preview to check for WCAG contrast.
const CONTRAST_PAIRS = [
  { label: 'Button label', fg: 'action-foreground', bg: 'action-background', comp: 'button' },
  { label: 'Body text', fg: 'text-default', bg: 'surface-page', comp: 'text' },
  { label: 'Muted text', fg: 'text-muted', bg: 'surface-page', comp: 'text' },
  { label: 'Link', fg: 'text-accent', bg: 'surface-page', comp: 'text' },
  { label: 'Text on card', fg: 'text-default', bg: 'surface-card', comp: 'card' },
  { label: 'Info badge', fg: 'status-info-foreground', bg: 'status-info-background', comp: 'status' },
  { label: 'Success badge', fg: 'status-success-foreground', bg: 'status-success-background', comp: 'status' },
  { label: 'Warn badge', fg: 'status-warn-foreground', bg: 'status-warn-background', comp: 'status' },
  { label: 'Error badge', fg: 'status-error-foreground', bg: 'status-error-background', comp: 'status' },
]

/** A WCAG ratio as a pass/fail badge (AA normal text = 4.5, AA large = 3). */
function ContrastBadge({ ratio }) {
  if (ratio == null) return <Paragraph as="span" size="xs" color="muted">—</Paragraph>
  const status = ratio >= 4.5 ? 'success' : ratio >= 3 ? 'warn' : 'error'
  return <MessageBadge size="sm" status={status}>{ratio.toFixed(2)}:1</MessageBadge>
}

/** Components that exercise the semantic colour tokens — rendered inside a panel
 *  whose CSS vars (standard or inverse) drive the colours. Every element is an
 *  individual click target that filters the controls to just its colours. */
function SemShowcase({ onPick, selected }) {
  const pick = (key) => (e) => { e.preventDefault(); e.stopPropagation(); onPick?.(selected === key ? null : key) }
  const cls = (key) => `a1-web-sem-pick${selected === key ? ' a1-web-sem-pick--active' : ''}`
  const t = (key) => `Filter to ${ELEMENT_LABELS[key]} colours`
  return (
    <Stack gap="md">
      <ButtonContainer>
        <Button size="sm" className={cls('button-primary')} title={t('button-primary')} onClick={pick('button-primary')}>Primary</Button>
        <Button size="sm" variant="secondary" className={cls('button-secondary')} title={t('button-secondary')} onClick={pick('button-secondary')}>Secondary</Button>
        <Button size="sm" variant="tertiary" icon="bolt" className={cls('button-tertiary')} title={t('button-tertiary')} onClick={pick('button-tertiary')}>Tertiary</Button>
      </ButtonContainer>
      <Stack gap="xs">
        <div className={cls('heading')} title={t('heading')} onClick={pick('heading')}>
          <Heading as="p" size="sm">Heading on the surface</Heading>
        </div>
        <Paragraph size="sm">
          <span className={cls('body')} title={t('body')} onClick={pick('body')}>Body text</span> with a <Link href="#" className={cls('link')} title={t('link')} onClick={pick('link')}>link</Link> and a <span className={cls('muted')} title={t('muted')} onClick={pick('muted')}><Paragraph as="span" color="muted">muted</Paragraph></span> aside.
        </Paragraph>
      </Stack>
      <div className={cls('card')} title={t('card')} onClick={pick('card')}>
        <Card>
          <Stack gap="xs">
            <Heading as="h3" size="xs">Card surface</Heading>
            <Paragraph size="sm" color="muted">Raised above the page.</Paragraph>
          </Stack>
        </Card>
      </div>
      <div className={cls('field')} title={t('field')} onClick={pick('field')}>
        <TextField label="Field" size="compact" />
      </div>
      <Stack direction="row" gap="xs" wrap>
        <span className={cls('badge-info')} title={t('badge-info')} onClick={pick('badge-info')}><MessageBadge size="sm" status="info">Info</MessageBadge></span>
        <span className={cls('badge-success')} title={t('badge-success')} onClick={pick('badge-success')}><MessageBadge size="sm" status="success">Success</MessageBadge></span>
        <span className={cls('badge-warn')} title={t('badge-warn')} onClick={pick('badge-warn')}><MessageBadge size="sm" status="warn">Warn</MessageBadge></span>
        <span className={cls('badge-error')} title={t('badge-error')} onClick={pick('badge-error')}><MessageBadge size="sm" status="error">Error</MessageBadge></span>
      </Stack>
    </Stack>
  )
}

export function ThemeEditor({ themeId, category = 'color', onNavigate, onBackToThemes }) {
  // Edit history: a stack of theme snapshots + a cursor. `theme` is the snapshot
  // at the cursor; patch pushes, undo/redo/jump move the cursor.
  const [history, setHistory] = useState(() => {
    const t = getTheme(themeId)
    return { entries: t ? [histEntry(t, 'Opened')] : [], cursor: t ? 0 : -1 }
  })
  useEffect(() => {
    const t = getTheme(themeId)
    setHistory({ entries: t ? [histEntry(t, 'Opened')] : [], cursor: t ? 0 : -1 })
  }, [themeId])
  const [asideTab, setAsideTab] = useState('config') // right panel: config | history
  const theme = history.entries[history.cursor]?.theme ?? null
  const canUndo = history.cursor > 0
  const canRedo = history.cursor < history.entries.length - 1

  const [prompt, setPrompt] = useState('')
  const [keyReady, setKeyReady] = useState(() => hasApiKey())
  const [keyInput, setKeyInput] = useState('')
  const [applied, setApplied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [view, setView] = useState('specific') // 'specific' = category controls; 'preview' = style tile
  const [colorView, setColorView] = useState('swatches') // Colour page: 'swatches' (default) | 'table'
  const [colorModel, setColorModel] = useState('hex') // ramp editing model: hex | rgb | hsl
  const [selectedComp, setSelectedComp] = useState(null) // semantic page: filter tokens to a clicked component
  const [samples, setSamples] = useState({
    display: 'The quiet morning light',
    heading: 'A heading sets the section',
    body: 'Body copy carries the reading. The quick brown fox jumps over the lazy dog — enough words to feel the rhythm and weight of the body face against the headings and display above.',
  })
  const setSample = (slot, v) => setSamples((s) => ({ ...s, [slot]: v }))
  const [fontPrompt, setFontPrompt] = useState('')
  const [fontLoading, setFontLoading] = useState(false)
  const [fontNote, setFontNote] = useState('')
  const [fontError, setFontError] = useState('')
  const [fontAiOpen, setFontAiOpen] = useState(false) // AI pairing is opt-in, behind a button
  const [showTypeDesc, setShowTypeDesc] = useState(true) // toggle the advanced-property descriptions

  // Deep-merge stored values with defaults so themes saved before a field
  // existed (e.g. typeStyles[role].advanced) don't crash or render empty.
  const weights = { ...DEFAULT_FONT_WEIGHTS, ...(theme?.fontWeights ?? {}) }
  const mergeRole = (r) => ({
    ...DEFAULT_TYPE_STYLES[r],
    ...(theme?.typeStyles?.[r] ?? {}),
    advanced: { ...DEFAULT_TYPE_ADVANCED, ...(theme?.typeStyles?.[r]?.advanced ?? {}) },
  })
  const typeStyles = { display: mergeRole('display'), heading: mergeRole('heading'), body: mergeRole('body') }
  const fontSizes = {
    display: { ...DEFAULT_FONT_SIZES.display, ...(theme?.fontSizes?.display ?? {}) },
    heading: { ...DEFAULT_FONT_SIZES.heading, ...(theme?.fontSizes?.heading ?? {}) },
    body: { ...DEFAULT_FONT_SIZES.body, ...(theme?.fontSizes?.body ?? {}) },
  }
  const textColors = { ...DEFAULT_TEXT_COLORS, ...(theme?.textColors ?? {}) }
  const iconSettings = { ...DEFAULT_ICON_SETTINGS, ...(theme?.icon ?? {}) }
  // Palette options for the colour-variant Autocomplete: every ramp stop as a
  // labelled swatch (deduped by hex). Drives the "pick a colour from the ramp" pattern.
  const rampColorOptions = useMemo(() => {
    if (!theme) return []
    const seen = new Set()
    const out = []
    for (const r of RAMP_NAMES) {
      for (const s of RAMP_STOPS) {
        const hex = theme.ramps?.[r]?.[s]
        if (!hex || seen.has(hex)) continue
        seen.add(hex)
        out.push({ value: hex, label: `${RAMP_LABELS[r]} ${s}` })
      }
    }
    return out
  }, [theme])
  const semanticColors = useMemo(() => {
    const stored = theme?.semanticColors ?? {}
    const out = {}
    for (const key of Object.keys(DEFAULT_SEMANTIC_COLORS)) {
      out[key] = { ...DEFAULT_SEMANTIC_COLORS[key], ...(stored[key] ?? {}) }
    }
    return out
  }, [theme])
  // Ramp-reference options for the semantic pickers: value "<ramp>:<stop>", swatch = resolved hex.
  const rampRefOptions = useMemo(() => {
    if (!theme) return []
    const out = []
    for (const r of RAMP_NAMES) {
      for (const s of RAMP_STOPS) {
        const hex = theme.ramps?.[r]?.[s]
        if (!hex) continue
        out.push({ value: `${r}:${s}`, label: `${RAMP_LABELS[r]} ${s}`, swatch: hex })
      }
    }
    return out
  }, [theme])
  const spec = useMemo(() => (theme ? {
    ramps: theme.ramps,
    fonts: theme.fonts,
    fontWeights: weights,
    fontSizes,
    textColors,
    semanticColors,
    icon: iconSettings,
    roundness: theme.roundness,
  } : null), [theme]) // eslint-disable-line react-hooks/exhaustive-deps
  const vars = useMemo(() => (spec ? compileThemeVars(spec) : {}), [spec])
  // Inverse preview vars: compiled (standard) vars with the inverse semantic overrides applied.
  const inverseVars = useMemo(() => ({ ...vars, ...inverseSemanticVars(semanticColors) }), [vars, semanticColors])
  const jsonString = useMemo(() => (spec ? themeJsonString(spec, { name: theme.name, description: theme.description }) : ''), [spec, theme])

  const [asideNode, setAsideNode] = useState(null)
  useLayoutEffect(() => {
    // Re-acquire on resize too: at xs/sm the slot moves into a BottomSheet, so
    // the portal target changes when crossing the breakpoint.
    const find = () => setAsideNode(document.getElementById('a1-web-theme-aside-slot'))
    find()
    window.addEventListener('resize', find)
    return () => window.removeEventListener('resize', find)
  }, [category])

  useEffect(() => { if (theme) Object.values(theme.fonts).forEach(loadGoogleFont) }, [theme])
  useEffect(() => {
    const root = document.documentElement
    if (applied) Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v))
    return () => { if (applied) Object.keys(vars).forEach((k) => root.style.removeProperty(k)) }
  }, [applied, vars])

  // Patch the working theme: persist to the store and push a history entry
  // (truncating any redo branch).
  function patch(partial, label) {
    setHistory((h) => {
      const base = h.entries[h.cursor]?.theme
      if (!base) return h
      const next = { ...base, ...partial }
      updateTheme(base.id, partial)
      const kept = h.entries.slice(0, h.cursor + 1)
      return { entries: [...kept, histEntry(next, label || describePatch(partial))], cursor: kept.length }
    })
  }
  function gotoHistory(i) {
    setHistory((h) => {
      if (i < 0 || i >= h.entries.length || i === h.cursor) return h
      const snap = h.entries[i].theme
      updateTheme(snap.id, snap)
      return { ...h, cursor: i }
    })
  }
  function restoreById(entryId) {
    const i = history.entries.findIndex((e) => e.id === entryId)
    if (i >= 0) gotoHistory(i)
  }
  function renameHistory(entryId, label) {
    setHistory((h) => ({ ...h, entries: h.entries.map((e) => (e.id === entryId ? { ...e, label } : e)) }))
  }
  function undo() { gotoHistory(history.cursor - 1) }
  function redo() { gotoHistory(history.cursor + 1) }
  function regenRamp(rampName, hex500) { patch({ ramps: { ...theme.ramps, [rampName]: rampFrom500(hex500) } }) }
  function setStop(rampName, stop, hex) { patch({ ramps: { ...theme.ramps, [rampName]: { ...theme.ramps[rampName], [stop]: hex } } }) }
  function setFont(slot, family) { patch({ fonts: { ...theme.fonts, [slot]: family } }) }
  function setWeight(slot, value) { patch({ fontWeights: { ...weights, [slot]: value } }) }
  function setType(slot, partial) { patch({ typeStyles: { ...typeStyles, [slot]: { ...typeStyles[slot], ...partial } } }) }
  function setAdvanced(slot, partial) { setType(slot, { advanced: { ...typeStyles[slot].advanced, ...partial } }) }
  function setFontSize(role, step, rem) { patch({ fontSizes: { ...fontSizes, [role]: { ...fontSizes[role], [step]: rem } } }) }
  function setTextColor(name, hex) { patch({ textColors: { ...textColors, [name]: hex } }) }
  function setIcon(partial) { patch({ icon: { ...iconSettings, ...partial } }) }
  function setSemanticColor(key, mode, ref) {
    patch({ semanticColors: { ...semanticColors, [key]: { ...semanticColors[key], [mode]: ref } } })
  }
  // Resolve a ramp ref ("accent:500") or hex to an actual hex from the theme ramps.
  function resolveRef(ref) {
    if (!ref) return null
    if (ref.startsWith('#')) return ref
    const [ramp, stop] = ref.split(':')
    return theme?.ramps?.[ramp]?.[stop] ?? null
  }
  function contrastFor(mode, fgKey, bgKey) {
    const fg = resolveRef(semanticColors[fgKey]?.[mode])
    const bg = resolveRef(semanticColors[bgKey]?.[mode])
    if (!fg || !bg) return null
    try { return wcagContrast(fg, bg) } catch { return null }
  }
  function saveKey() { setApiKey(keyInput); if (keyInput.trim()) setKeyReady(true) }

  async function pairFonts() {
    if (!fontPrompt.trim()) return
    setFontLoading(true); setFontError(''); setFontNote('')
    try {
      const f = await generateFontPairing(fontPrompt.trim())
      ;[f.display, f.heading, f.body].forEach(loadGoogleFont)
      patch({ fonts: { display: f.display, heading: f.heading, body: f.body } })
      setFontNote(f.rationale || '')
    } catch (err) {
      setFontError(describeError(err))
      if (err instanceof Error && err.message === 'NO_API_KEY') setKeyReady(false)
    } finally { setFontLoading(false) }
  }

  async function generate() {
    if (!prompt.trim()) return
    setLoading(true); setError('')
    try {
      const t = await generateTheme(prompt.trim())
      patch({
        name: t.name || theme.name,
        description: t.description || theme.description,
        ramps: rampsFrom500({ ...DEFAULT_RAMPS, ...t.ramps }),
        fonts: { display: t.fonts.display, heading: t.fonts.heading, body: t.fonts.body },
        roundness: Math.max(0, Math.min(16, Math.round(t.roundness ?? 8))),
      })
    } catch (err) {
      setError(describeError(err))
      if (err instanceof Error && err.message === 'NO_API_KEY') setKeyReady(false)
    } finally { setLoading(false) }
  }

  if (!theme) {
    return (
      // Update to an Empty State component
      <Section padding="lg">
        <Stack gap="sm">
          <Paragraph>That theme no longer exists.</Paragraph>
          <ButtonContainer><Button icon="arrow_back" onClick={onBackToThemes}>All themes</Button></ButtonContainer>
        </Stack>
      </Section>
    )
  }

  const [cat, sub] = category.split(':')
  const tile = <StyleTile vars={vars} theme={theme} />

  // ── Center (the "Specific" view — category controls) ─────────────────────────
  let specific = null

  if (cat === 'color' && sub) {
    const ramp = theme.ramps[sub] ?? {}
    specific = (
      <div className="a1-web-ramp-strip">
        {RAMP_STOPS.map((stop) => (
          <div key={stop} className="a1-web-ramp-stop">
            <span className="a1-web-ramp-chip" style={{ background: ramp[stop] }} />
            <span className="a1-web-ramp-stop-num">{stop}</span>
            <span className="a1-web-ramp-stop-hex">{ramp[stop]}</span>
          </div>
        ))}
      </div>
    )
  } else if (cat === 'color') {
    const rows = RAMP_NAMES.flatMap((rampName) =>
      RAMP_STOPS.map((stop) => ({
        id: `${rampName}-${stop}`,
        swatch: <span className="a1-web-theme-cell-swatch" style={{ background: theme.ramps[rampName]?.[stop] }} aria-hidden="true" />,
        ramp: RAMP_LABELS[rampName],
        step: stop,
        value: theme.ramps[rampName]?.[stop] ?? '',
      })),
    )
    specific = colorView === 'table' ? (
      <DataTable columns={COLOR_COLUMNS} rows={rows} getRowId={(r) => r.id} />
    ) : (
      <Stack gap="lg">
        {RAMP_NAMES.map((rampName) => (
          <Stack key={rampName} gap="xs">
            <Heading as="h2" size="sm">{RAMP_LABELS[rampName]}</Heading>
            <div className="a1-web-ramp-strip">
              {RAMP_STOPS.map((stop) => (
                <div key={stop} className="a1-web-ramp-stop">
                  <span className="a1-web-ramp-chip" style={{ background: theme.ramps[rampName]?.[stop] }} />
                  <span className="a1-web-ramp-stop-num">{stop}</span>
                  <span className="a1-web-ramp-stop-hex">{theme.ramps[rampName]?.[stop]}</span>
                </div>
              ))}
            </div>
          </Stack>
        ))}
      </Stack>
    )
  } else if (cat === 'typography' && sub) {
    const role = sub
    const rs = typeStyles[role]
    const roleFont = ROLE_FONT_VAR[role]
    specific = (
      <div style={vars}>
        <Stack gap="lg">
          <Stack gap="sm">
            <Heading as="h2" size="sm">Scale</Heading>
            <Paragraph size="xs" color="muted">Every {ROLE_LABEL[role].toLowerCase()} size step — adjust each in the right panel.</Paragraph>
            {SCALE_STEPS[role].map((step) => {
              const rem = fontSizes[role][step]
              return (
                <div key={step} className="a1-web-type-scale-row">
                  <span className="a1-web-type-scale-sample" style={{ fontFamily: roleFont, fontWeight: weights[role], fontSize: `${rem}rem`, ...typeCss(rs) }}>{ROLE_LABEL[role]}</span>
                  <span className="a1-web-type-scale-meta">
                    <span className="a1-web-type-scale-name">{step}</span>
                    <span className="a1-web-type-scale-unit">{rem}rem</span>
                  </span>
                </div>
              )
            })}
          </Stack>
          <Divider space="none" />
          <Stack gap="sm">
            <Heading as="h2" size="sm">Text colours</Heading>
            <Paragraph size="xs" color="muted">The predefined text colours — shared across all type; edit them in the right panel.</Paragraph>
            {TEXT_COLOR_FIELDS.map(({ name, label }) => (
              <div key={name} className="a1-web-theme-color-row">
                <span className="a1-web-theme-cell-swatch" style={{ background: textColors[name] }} aria-hidden="true" />
                <span className="a1-web-theme-color-name">{label}</span>
                <span className={`a1-web-type-color-sample${name === 'inverse' ? ' a1-web-type-color-sample--inverse' : ''}`} style={{ color: textColors[name], fontFamily: roleFont, fontWeight: weights[role] }}>
                  {ROLE_LABEL[role]} sample
                </span>
              </div>
            ))}
          </Stack>
        </Stack>
      </div>
    )
  } else if (cat === 'typography') {
    specific = (
      <Stack gap="lg">
        <Accordion label="Type roles" size="lg" divider>
          <Stack gap="sm">
            <Paragraph size="sm" color="muted">A1 type is organised into three roles. Open each in the sidebar to set its font, weight, scale, and refinements — pick fonts that share a coherent voice while contrasting enough to signal hierarchy.</Paragraph>
            <Stack gap="xs">
              <Paragraph size="sm"><strong>Display</strong> — the largest, most expressive type, reserved for hero titles and standout moments. Use it sparingly (ideally one per view); a distinctive or decorative face works well here since it carries the brand’s personality.</Paragraph>
              <Paragraph size="sm"><strong>Heading</strong> — section and subsection titles that structure the page (h1–h6). Should read as clearly more prominent than body, but stay highly legible. Drive prominence by hierarchy and weight, not size alone.</Paragraph>
              <Paragraph size="sm"><strong>Body</strong> — running text, descriptions, and UI copy. This face does the most reading work, so prioritise legibility at small sizes, a comfortable x-height, and a neutral, unfatiguing voice.</Paragraph>
            </Stack>
          </Stack>
        </Accordion>
        <div style={vars}>
<Section
  padding="sm"
  surface="panel"
  gap="xs"
  contentWidth="md"
  borderSize="sm"
  borderStyle="dotted"
  radius="md"
>
            <Heading as="h3" type="display" size="xl" style={typeCss(typeStyles.display)}>
              <InlineEditable seamless value={samples.display} onChange={(v) => setSample('display', v)} aria-label="Display sample text">{samples.display}</InlineEditable>
            </Heading>
          <Divider space="none" />
            <Heading as="h3" size="md" style={typeCss(typeStyles.heading)}>
              <InlineEditable seamless value={samples.heading} onChange={(v) => setSample('heading', v)} aria-label="Heading sample text">{samples.heading}</InlineEditable>
            </Heading>
            <Paragraph style={typeCss(typeStyles.body)}>
              <InlineEditable seamless multiline value={samples.body} onChange={(v) => setSample('body', v)} aria-label="Body sample text">{samples.body}</InlineEditable>
            </Paragraph>
          <Divider space="none" />
          <DefinitionList
            size="sm"
            labelWidth="fixed"
            items={[
              { label: 'Display', value: theme.fonts.display },
              { label: 'Heading', value: theme.fonts.heading },
              { label: 'Body', value: theme.fonts.body },
            ]}
          />
        </Section>
        </div>
      </Stack>
    )
  } else if (cat === 'semantic') {
    specific = (
      <Stack gap="lg">
        <Paragraph size="sm" color="muted">Map each semantic colour to a value from the ramp, for the <strong>standard</strong> page and for <strong>inverse</strong> (dark) islands. <strong>Click a component</strong> below to filter the right panel to just the colours it uses; click it again to clear.</Paragraph>
        <div className="a1-web-sem-grid">
          <div className="a1-web-sem-panel" style={vars}>
            <Stack gap="md">
              <Paragraph size="xs" color="muted">Standard</Paragraph>
              <SemShowcase onPick={setSelectedComp} selected={selectedComp} />
            </Stack>
          </div>
          <div className="a1-web-sem-panel" style={inverseVars}>
            <Stack gap="md">
              <Paragraph size="xs" color="muted">Inverse</Paragraph>
              <SemShowcase onPick={setSelectedComp} selected={selectedComp} />
            </Stack>
          </div>
        </div>
        <Stack gap="sm">
          <Heading as="h2" size="xs">Contrast report</Heading>
          <Paragraph size="xs" color="muted">Live WCAG contrast of the preview pairings. <MessageBadge size="sm" status="success">≥ 4.5</MessageBadge> passes AA for normal text, <MessageBadge size="sm" status="warn">≥ 3</MessageBadge> AA large only, <MessageBadge size="sm" status="error">&lt; 3</MessageBadge> fails.</Paragraph>
          <div className="a1-web-contrast">
            <div className="a1-web-contrast__head">
              <span>Pairing</span><span>Standard</span><span>Inverse</span>
            </div>
            {CONTRAST_PAIRS.filter((p) => {
              if (!selectedComp) return true
              const set = new Set(ELEMENT_TOKENS[selectedComp])
              return set.has(p.fg) || set.has(p.bg)
            }).map((p) => (
              <div key={p.label} className="a1-web-contrast__row">
                <span>{p.label}</span>
                <ContrastBadge ratio={contrastFor('standard', p.fg, p.bg)} />
                <ContrastBadge ratio={contrastFor('inverse', p.fg, p.bg)} />
              </div>
            ))}
          </div>
        </Stack>
      </Stack>
    )
  } else if (cat === 'shape') {
    specific = (
      <div style={vars}>
        <Stack gap="lg">
          <ButtonContainer>
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="tertiary" icon="bolt">Tertiary</Button>
          </ButtonContainer>
          <Card>
            <Stack gap="sm">
              <Heading as="h3" size="sm">Card corners follow the roundness</Heading>
              <TextField label="Field" size="compact" />
            </Stack>
          </Card>
        </Stack>
      </div>
    )
  } else if (cat === 'icons') {
    const sampleIcons = ['home', 'search', 'settings', 'favorite', 'star', 'delete', 'check_circle', 'bolt', 'download', 'edit', 'notifications', 'account_circle']
    specific = (
      <div style={vars}>
        <Stack gap="lg">
          <Stack gap="sm">
            <Heading as="h2" size="sm">Gallery</Heading>
            <Stack direction="row" gap="md" align="center" wrap>
              {sampleIcons.map((n) => <Icon key={n} name={n} size="lg" />)}
            </Stack>
          </Stack>
          <Divider space="none" />
          <Stack gap="sm">
            <Heading as="h2" size="sm">Outline vs filled</Heading>
            <Stack direction="row" gap="lg" align="center" wrap>
              <Stack direction="row" gap="xs" align="center"><Icon name="favorite" size="lg" fill={false} /><Paragraph size="sm" color="muted">Outline</Paragraph></Stack>
              <Stack direction="row" gap="xs" align="center"><Icon name="favorite" size="lg" fill /><Paragraph size="sm" color="muted">Filled</Paragraph></Stack>
            </Stack>
          </Stack>
          <Divider space="none" />
          <Stack gap="sm">
            <Heading as="h2" size="sm">Size scale</Heading>
            <Stack direction="row" gap="md" align="center" wrap>
              {['xs', 'sm', 'md', 'lg', 'xl', 'jumbo'].map((s) => <Icon key={s} name="star" size={s} />)}
            </Stack>
          </Stack>
          <Divider space="none" />
          <Stack gap="sm">
            <Heading as="h2" size="sm">In context</Heading>
            <ButtonContainer>
              <Button icon="rocket_launch">Launch</Button>
              <Button variant="secondary" icon="download">Download</Button>
              <IconButton icon="favorite" label="Favourite" />
            </ButtonContainer>
          </Stack>
        </Stack>
      </div>
    )
  } else if (cat === 'details') {
    specific = (
      <Stack gap="md">
        <Stack gap="sm" style={{ maxWidth: '32rem' }}>
          <TextField label="Theme name" size="default" value={theme.name} onChange={(e) => patch({ name: e.target.value })} />
          <TextareaField label="Description" size="default" rows="md" value={theme.description} onChange={(e) => patch({ description: e.target.value })} />
        </Stack>
      </Stack>
    )
  } else if (cat === 'code') {
    specific = (
      <Stack gap="md">
        <Switch label="Apply live to this app" checked={applied} onChange={setApplied} />
        <Paragraph size="sm" color="muted">Copy this into <code>system/themes/&lt;name&gt;/theme.json</code>, then run <code>npm run build:tokens</code>.</Paragraph>
        <Code variant="block" wrapping copyCode>{jsonString}</Code>
      </Stack>
    )
  }

  // ── Aside ─────────────────────────────────────────────────────────────────────
  let aside = null
  if (cat === 'color' && sub) {
    const ramp = theme.ramps[sub] ?? {}
    aside = (
      <div className="a1-web-config-aside__inner">
        <Stack gap="sm">
          <Heading as="h2" size="sm">{RAMP_LABELS[sub] ?? sub} values</Heading>
          <Paragraph size="xs" color="muted">Edit each stop’s exact colour.</Paragraph>
          <Toolbar label="Colour model">
            <ToolbarGroup aria-label="Colour model" value={colorModel} onChange={setColorModel} showLabels options={COLOR_MODEL_OPTIONS} />
          </Toolbar>
          {RAMP_STOPS.map((stop) => (
            <ColorRow key={stop} label={String(stop)} model={colorModel} value={ramp[stop]} onChange={(hex) => setStop(sub, stop, hex)} />
          ))}
          <Divider space="none" />
          <Button size="sm" variant="secondary" icon="restart_alt" onClick={() => regenRamp(sub, ramp[500])}>Regenerate from -500</Button>
        </Stack>
      </div>
    )
  } else if (cat === 'color') {
    aside = (
      <div className="a1-web-config-aside__inner">
        <Stack gap="lg">
          <div>
            <Heading as="h2" size="sm">Generate with AI</Heading>
            {!keyReady ? (
              <Stack gap="sm">
                <Paragraph size="sm" color="muted">Paste an Anthropic API key (stored only in this browser). <Link href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer">Get a key</Link>.</Paragraph>
                <TextField label="Anthropic API key" type="password" size="compact" autoComplete="off" value={keyInput} onChange={(e) => setKeyInput(e.target.value)} />
                <ButtonContainer><Button size="sm" disabled={!keyInput.trim()} onClick={saveKey}>Save key</Button></ButtonContainer>
              </Stack>
            ) : (
              <Stack gap="sm">
                <TextField label="Describe the theme" size="compact" hint="e.g. “a warm, earthy theme for an artisan bakery”" value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); generate() } }} />
                <ButtonContainer><Button size="sm" icon="auto_awesome" loading={loading} disabled={!prompt.trim()} onClick={generate}>Generate theme</Button></ButtonContainer>
                {error && <Banner status="error" variant="inline" onDismiss={() => setError('')}>{error}</Banner>}
              </Stack>
            )}
          </div>
          <Divider space="none" />
          <Stack gap="sm">
            <Heading as="h2" size="sm">Ramps</Heading>
            <Paragraph size="xs" color="muted">Set each ramp’s mid (-500). Open a ramp in the sidebar to edit individual values.</Paragraph>
            <Toolbar label="Colour model">
              <ToolbarGroup aria-label="Colour model" value={colorModel} onChange={setColorModel} showLabels options={COLOR_MODEL_OPTIONS} />
            </Toolbar>
            {RAMP_NAMES.map((rampName) => (
              <ColorRow key={rampName} label={RAMP_LABELS[rampName]} model={colorModel} value={theme.ramps[rampName]?.[500]} onChange={(hex) => regenRamp(rampName, hex)} />
            ))}
          </Stack>
        </Stack>
      </div>
    )
  } else if (cat === 'typography' && sub) {
    const role = sub
    const rs = typeStyles[role]
    const adv = rs.advanced
    const advGroup = (label, prop, options, desc) => (
      <Stack gap="xs">
        <Toolbar label={label}>
          <ToolbarGroup aria-label={label} value={adv[prop]} onChange={(v) => setAdvanced(role, { [prop]: v })} showLabels options={options} />
        </Toolbar>
        {showTypeDesc && <Paragraph size="xs" color="muted">{desc}</Paragraph>}
      </Stack>
    )
    aside = (
      <div className="a1-web-config-aside__inner">
        <Stack gap="sm">
          <Heading as="h2" size="sm">{ROLE_LABEL[role]}</Heading>
          <Autocomplete label="Font" size="compact" allowCreate options={GOOGLE_FONTS} value={theme.fonts[role]} onChange={(v) => setFont(role, v)} />
          <Slider
            label="Weight"
            size="compact"
            detents={WEIGHT_VALUES}
            value={weights[role]}
            onChange={(v) => setWeight(role, v)}
            formatValue={(v) => WEIGHT_NAMES[v] ?? String(v)}
          />
          <Slider
            label="Letter spacing"
            size="compact"
            detents={LETTER_SPACING_VALUES}
            value={rs.letterSpacing}
            onChange={(v) => setType(role, { letterSpacing: v })}
            formatValue={(v) => `${(v / 100).toFixed(2)}em`}
          />
          <Toolbar label="Style">
            <ToolbarGroup
              aria-label="Font style"
              value={rs.fontStyle}
              onChange={(v) => setType(role, { fontStyle: v })}
              showLabels
              options={STYLE_OPTIONS}
            />
          </Toolbar>
          <Toolbar label="Transform">
            <ToolbarGroup
              aria-label="Text transform"
              value={rs.textTransform}
              onChange={(v) => setType(role, { textTransform: v })}
              options={TRANSFORM_OPTIONS}
            />
          </Toolbar>
          {rs.textTransform === 'uppercase' && (
            <Banner status="warn" variant="inline">
              Uppercase is an accessibility concern: screen readers may spell it letter-by-letter, it slows scanning, and it breaks localized strings. A1 recommends sentence case — use weight or size for emphasis. (Preview only — not written to the theme.)
            </Banner>
          )}
          <Accordion label="Scale" divider defaultOpen>
            <Stack gap="sm">
              <Paragraph size="xs" color="muted">Set the rem size for each {ROLE_LABEL[role].toLowerCase()} step.</Paragraph>
              {SCALE_STEPS[role].map((step) => (
                <NumberField
                  key={step}
                  size="compact"
                  label={step}
                  unit="rem"
                  step={0.0625}
                  min={0.25}
                  max={10}
                  value={fontSizes[role][step]}
                  onChange={(e) => setFontSize(role, step, Number(e.target.value) || 0)}
                />
              ))}
            </Stack>
          </Accordion>
          <Accordion label="Text colours" divider>
            <Stack gap="sm">
              <Paragraph size="xs" color="muted">Pick each text colour from the palette, or type a custom hex. Shared across all type.</Paragraph>
              {TEXT_COLOR_FIELDS.map(({ name, label }) => (
                <Autocomplete
                  key={name}
                  variant="color"
                  size="compact"
                  allowCreate
                  label={label}
                  options={rampColorOptions}
                  value={textColors[name]}
                  onChange={(v) => setTextColor(name, v)}
                  createLabel={(q) => `Use ${q}`}
                />
              ))}
            </Stack>
          </Accordion>
          <Accordion label="Advanced" divider defaultOpen>
            <Stack gap="md">
              <Switch label="Show descriptions" checked={showTypeDesc} onChange={setShowTypeDesc} />
              {advGroup('Font synthesis', 'fontSynthesis', AUTO_NONE, 'Master switch for faking faces the font lacks. None stops the browser from synthesising bold, italic, or small-caps — text then only uses real styles shipped with the font.')}
              {advGroup('Synthesis weight', 'fontSynthesisWeight', AUTO_NONE, 'Whether the browser may fake a bolder weight when the font has no real bold. None keeps weights true to the font’s actual cuts.')}
              {advGroup('Synthesis style', 'fontSynthesisStyle', AUTO_NONE, 'Whether the browser may fake italics by slanting the upright (“faux italic”) when no true italic exists. None avoids the artificial slant.')}
              {advGroup('Synthesis small-caps', 'fontSynthesisSmallCaps', AUTO_NONE, 'Whether the browser may synthesise small capitals by shrinking capitals when the font has no real small-caps glyphs.')}
              {advGroup('Kerning', 'fontKerning', KERNING_OPTS, 'Uses the font’s built-in kerning to tighten specific letter pairs (e.g. “AV”, “To”). Normal forces it on, None turns it off for even spacing.')}
              {advGroup('Optical sizing', 'fontOpticalSizing', AUTO_NONE, 'Lets variable fonts adapt their design to the rendered size — finer detail at small sizes, more contrast at large. None freezes one design across sizes.')}
              <Stack gap="xs">
                <Slider
                  label="Size adjust"
                  size="compact"
                  min={0}
                  max={100}
                  step={1}
                  value={adv.fontSizeAdjust}
                  onChange={(v) => setAdvanced(role, { fontSizeAdjust: v })}
                  formatValue={(v) => (v === 0 ? 'None' : (v / 100).toFixed(2))}
                />
                {showTypeDesc && <Paragraph size="xs" color="muted">Normalises apparent size by x-height (the value is the target aspect ratio), so a fallback font reads at the same visual size as the intended one. None leaves it untouched.</Paragraph>}
              </Stack>
              {advGroup('Text rendering', 'textRendering', RENDERING_OPTS, 'A hint about what to optimise: Legible enables kerning and ligatures (best for body), Speed skips them, Precise favours geometric accuracy. Auto lets the browser decide.')}
              {advGroup('Font smoothing (WebKit)', 'webkitFontSmoothing', WEBKIT_SMOOTH_OPTS, 'Safari/Chrome on macOS only. Antialiased renders lighter, thinner strokes (common for light text on dark); None disables smoothing. No effect on Windows.')}
              {advGroup('Font smoothing (Firefox/macOS)', 'mozOsxFontSmoothing', MOZ_SMOOTH_OPTS, 'Firefox on macOS only. Grayscale renders lighter strokes to match WebKit’s antialiased look. No effect elsewhere.')}
            </Stack>
          </Accordion>
        </Stack>
      </div>
    )
  } else if (cat === 'typography') {
    aside = (
      <div className="a1-web-config-aside__inner">
        <Stack gap="lg">
          <Stack gap="sm">
            <Heading as="h2" size="sm">Typography</Heading>
            <Paragraph size="xs" color="muted">Open Display, Heading, or Body in the sidebar to edit each role’s font, weight, scale, and advanced properties. Or pair a full set with AI.</Paragraph>
          </Stack>
          <Divider space="none" />
          {!fontAiOpen ? (
            <ButtonContainer>
              <Button size="sm" variant="secondary" icon="auto_awesome" onClick={() => setFontAiOpen(true)}>Pair with AI</Button>
            </ButtonContainer>
          ) : (
            <Stack gap="sm">
              <Stack direction="row" align="center" justify="between" gap="sm">
                <Heading as="h2" size="sm">Pair with AI</Heading>
                <IconButton icon="close" size="sm" variant="tertiary" label="Close AI pairing" onClick={() => setFontAiOpen(false)} />
              </Stack>
              {!keyReady ? (
                <Stack gap="sm">
                  <Paragraph size="sm" color="muted">Paste an Anthropic API key (stored only in this browser). <Link href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer">Get a key</Link>.</Paragraph>
                  <TextField label="Anthropic API key" type="password" size="compact" autoComplete="off" value={keyInput} onChange={(e) => setKeyInput(e.target.value)} />
                  <ButtonContainer><Button size="sm" disabled={!keyInput.trim()} onClick={saveKey}>Save key</Button></ButtonContainer>
                </Stack>
              ) : (
                <Stack gap="sm">
                  <Paragraph size="xs" color="muted">Describe a mood or brand and Claude searches Google Fonts for a compatible display/heading/body trio.</Paragraph>
                  <TextField label="Describe the type" size="compact" hint="e.g. “elegant editorial, script display”" value={fontPrompt} onChange={(e) => setFontPrompt(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); pairFonts() } }} />
                  <ButtonContainer><Button size="sm" icon="auto_awesome" loading={fontLoading} disabled={!fontPrompt.trim()} onClick={pairFonts}>Pair fonts</Button></ButtonContainer>
                  {fontNote && <Paragraph size="xs" color="muted">{fontNote}</Paragraph>}
                  {fontError && <Banner status="error" variant="inline" onDismiss={() => setFontError('')}>{fontError}</Banner>}
                </Stack>
              )}
            </Stack>
          )}
        </Stack>
      </div>
    )
  } else if (cat === 'semantic') {
    const visible = selectedComp ? new Set(ELEMENT_TOKENS[selectedComp]) : null
    aside = (
      <div className="a1-web-config-aside__inner">
        <Stack gap="sm">
          <Heading as="h2" size="sm">Semantic colours</Heading>
          {selectedComp ? (
            <Banner status="warn" variant="inline" onDismiss={() => setSelectedComp(null)}>
              Filtered to {ELEMENT_LABELS[selectedComp]}.
            </Banner>
          ) : (
            <Paragraph size="xs" color="muted">Pick a ramp value for each token in both modes — or click a component in the preview to filter.</Paragraph>
          )}
          {SEMANTIC_COLOR_GROUPS.map((group, gi) => {
            const tokens = group.tokens.filter(([key]) => !visible || visible.has(key))
            if (!tokens.length) return null
            return (
              <Accordion key={`${group.id}-${selectedComp ?? 'all'}`} label={group.label} divider defaultOpen={gi === 0 || !!visible}>
                <Stack gap="md">
                  {tokens.map(([key, label]) => (
                    <Stack key={key} gap="xs">
                      <Paragraph size="sm"><strong>{label}</strong></Paragraph>
                      <Autocomplete
                        variant="color"
                        size="compact"
                        label="Standard"
                        options={rampRefOptions}
                        value={semanticColors[key]?.standard}
                        onChange={(v) => setSemanticColor(key, 'standard', v)}
                      />
                      <Autocomplete
                        variant="color"
                        size="compact"
                        label="Inverse"
                        options={rampRefOptions}
                        value={semanticColors[key]?.inverse}
                        onChange={(v) => setSemanticColor(key, 'inverse', v)}
                      />
                    </Stack>
                  ))}
                </Stack>
              </Accordion>
            )
          })}
        </Stack>
      </div>
    )
  } else if (cat === 'icons') {
    aside = (
      <div className="a1-web-config-aside__inner">
        <Stack gap="sm">
          <Heading as="h2" size="sm">Icons</Heading>
          <Paragraph size="xs" color="muted">Material Symbols variation axes applied to every icon by default.</Paragraph>
          <Toolbar label="Fill">
            <ToolbarGroup
              aria-label="Fill"
              value={iconSettings.fill ? 'filled' : 'outline'}
              onChange={(v) => setIcon({ fill: v === 'filled' })}
              showLabels
              options={[
                { value: 'outline', label: 'Outline', icon: 'favorite' },
                { value: 'filled', label: 'Filled', icon: 'favorite' },
              ]}
            />
          </Toolbar>
          <Slider
            label="Weight"
            size="compact"
            detents={[100, 200, 300, 400, 500, 600, 700]}
            value={iconSettings.weight}
            onChange={(v) => setIcon({ weight: v })}
            formatValue={(v) => String(v)}
          />
          <Slider
            label="Grade"
            size="compact"
            min={-50}
            max={200}
            step={25}
            value={iconSettings.grade}
            onChange={(v) => setIcon({ grade: v })}
            formatValue={(v) => String(v)}
          />
          <Toolbar label="Optical size">
            <ToolbarGroup
              aria-label="Optical size"
              value={String(iconSettings.opticalSize)}
              onChange={(v) => setIcon({ opticalSize: Number(v) })}
              showLabels
              options={[
                { value: '20', label: '20' },
                { value: '24', label: '24' },
                { value: '40', label: '40' },
                { value: '48', label: '48' },
              ]}
            />
          </Toolbar>
          <Paragraph size="xs" color="muted">Optical size tunes stroke detail for the rendered size; A1’s size classes set their own optical size, so this is the default for medium icons.</Paragraph>
        </Stack>
      </div>
    )
  } else if (cat === 'shape') {
    aside = (
      <div className="a1-web-config-aside__inner">
        <Stack gap="sm">
          <Heading as="h2" size="sm">Shape</Heading>
          <Slider label="Roundness" min={0} max={16} value={theme.roundness} onChange={(v) => patch({ roundness: v })} formatValue={(v) => `${v}px`} />
        </Stack>
      </div>
    )
  }

  // A single view toolbar. On the Colour page it folds in the Swatches/Table
  // sub-views alongside Preview; elsewhere it's Specific/Preview.
  const isColorMain = cat === 'color' && !sub
  const viewOptions = isColorMain
    ? [
        { value: 'swatches', label: 'Swatches', icon: 'palette' },
        { value: 'table', label: 'Table', icon: 'table_rows' },
        { value: 'preview', label: 'Preview', icon: 'visibility' },
      ]
    : [
        { value: 'specific', label: 'Specific', icon: 'tune' },
        { value: 'preview', label: 'Preview', icon: 'visibility' },
      ]
  const viewValue = isColorMain ? (view === 'preview' ? 'preview' : colorView) : view
  const onViewChange = isColorMain
    ? (v) => { if (v === 'preview') { setView('preview') } else { setView('specific'); setColorView(v) } }
    : setView

  // The right panel switches between the category Config and the History list
  // (same pattern as the page editor's aside).
  const asidePanel = (
    <div className="a1-web-theme-aside">
      <div className="a1-web-theme-aside-tabs">
        <SegmentedControl
          options={[
            { value: 'config', label: 'Config', icon: 'tune' },
            { value: 'history', label: 'History', icon: 'history' },
          ]}
          value={asideTab}
          onChange={setAsideTab}
          size="sm"
          fullWidth
          aria-label="Theme panel"
        />
      </div>
      {asideTab === 'config'
        ? (aside ?? <div className="a1-web-config-aside__inner"><Paragraph size="sm" color="muted">No settings for this view.</Paragraph></div>)
        : (
          <div className="a1-web-config-aside__inner">
            <EditorHistoryPanel
              entries={history.entries}
              currentIndex={history.cursor}
              onJump={gotoHistory}
              onRestore={restoreById}
              onRename={renameHistory}
            />
          </div>
        )}
    </div>
  )

  return (
    <>
      <Section padding="sm" aria-label={`${theme.name} theme`}>
        <Stack gap="md">
          <Toolbar aria-label="Editor actions">
            <ToolbarButton icon="undo" label="Undo" disabled={!canUndo} onClick={undo} />
            <ToolbarButton icon="redo" label="Redo" disabled={!canRedo} onClick={redo} />
            <ToolbarDivider />
            <ToolbarGroup aria-label="View" value={viewValue} onChange={onViewChange} showLabels options={viewOptions} />
          </Toolbar>
          {view === 'preview' ? tile : specific}
        </Stack>
      </Section>
      {asideNode && createPortal(asidePanel, asideNode)}
    </>
  )
}
