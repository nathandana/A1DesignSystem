import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const tokenCssPath = path.join(root, 'packages/react/src/tokens.css')
const outputPath = path.join(root, 'apps/a1-web/src/pages/components/accessibilityReports.generated.js')
const checkOnly = process.argv.includes('--check')

function readTokenValues() {
  const css = fs.readFileSync(tokenCssPath, 'utf8')
  const values = {}
  const re = /--([a-z0-9-]+):\s*([^;]+);/gi
  let match
  while ((match = re.exec(css))) {
    values[match[1]] = match[2].replace(/\/\*.*?\*\//g, '').trim()
  }
  return values
}

function token(values, name) {
  const value = values[name]
  if (!value) throw new Error(`Missing token --${name}`)
  return value
}

function hexToRgb(hex) {
  const clean = hex.trim().replace('#', '')
  if (!/^[0-9a-f]{6}$/i.test(clean)) throw new Error(`Expected 6-digit hex color, got ${hex}`)
  return [0, 2, 4].map((index) => parseInt(clean.slice(index, index + 2), 16))
}

function rgbToHex(rgb) {
  return `#${rgb.map((value) => Math.round(value).toString(16).padStart(2, '0')).join('')}`
}

function blend(foreground, background, alpha) {
  const fg = hexToRgb(foreground)
  const bg = hexToRgb(background)
  return rgbToHex(fg.map((value, index) => value * alpha + bg[index] * (1 - alpha)))
}

function channelToLinear(value) {
  const normalized = value / 255
  return normalized <= 0.03928
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4
}

function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(channelToLinear)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrastRatio(foreground, background) {
  const fg = luminance(foreground)
  const bg = luminance(background)
  const lighter = Math.max(fg, bg)
  const darker = Math.min(fg, bg)
  return (lighter + 0.05) / (darker + 0.05)
}

function formatRatio(value) {
  return `${value.toFixed(2)}:1`
}

function cssLengthToPx(value) {
  const clean = String(value).trim()
  if (clean.endsWith('rem')) return Number(clean.replace('rem', '')) * 16
  if (clean.endsWith('px')) return Number(clean.replace('px', ''))
  throw new Error(`Expected rem or px length, got ${value}`)
}

function formatPx(value) {
  return `${Number(value.toFixed(2))} px`
}

function textWcag(value, { disabled = false } = {}) {
  if (disabled) return 'Exempt'
  if (value >= 7) return 'Pass AA / AAA'
  if (value >= 4.5) return 'Pass AA'
  return 'Needs review'
}

function nonTextWcag(value) {
  return value >= 3 ? 'Pass 2.4.11' : 'Needs review'
}

function tokenVar(name) {
  return `var(--${name})`
}

function contrastRow(values, config) {
  const foregroundHex = config.foregroundHex ?? token(values, config.foregroundToken)
  const backgroundHex = config.backgroundHex ?? token(values, config.backgroundToken)
  const ratio = contrastRatio(foregroundHex, backgroundHex)
  return {
    id: config.id,
    surface: config.surface,
    foreground: config.foreground,
    background: config.background,
    foregroundToken: config.foregroundToken ? tokenVar(config.foregroundToken) : foregroundHex,
    backgroundToken: config.backgroundToken ? tokenVar(config.backgroundToken) : backgroundHex,
    ratio: formatRatio(ratio),
    wcag: config.wcag ?? textWcag(ratio, { disabled: config.disabled }),
    notes: config.notes(foregroundHex, backgroundHex),
  }
}

function buttonContrastRows(values) {
  const page = token(values, 'semantic-color-surface-page')
  const disabledOpacity = Number(token(values, 'component-button-disabled-opacity'))
  const disabledForeground = blend(token(values, 'component-button-primary-foreground'), page, disabledOpacity)
  const disabledBackground = blend(token(values, 'component-button-primary-background'), page, disabledOpacity)

  return [
    contrastRow(values, {
      id: 'primary',
      surface: 'Primary',
      foreground: 'Primary foreground',
      background: 'Primary background',
      foregroundToken: 'component-button-primary-foreground',
      backgroundToken: 'component-button-primary-background',
      notes: (fg, bg) => `Computed from ${fg} over ${bg} in the default token bundle.`,
    }),
    contrastRow(values, {
      id: 'secondary',
      surface: 'Secondary',
      foreground: 'Secondary foreground',
      background: 'Secondary background',
      foregroundToken: 'component-button-secondary-foreground',
      backgroundToken: 'component-button-secondary-background',
      notes: (fg, bg) => `Computed from ${fg} over ${bg} in the default token bundle.`,
    }),
    contrastRow(values, {
      id: 'tertiary',
      surface: 'Tertiary',
      foreground: 'Tertiary foreground',
      background: 'Tertiary background',
      foregroundToken: 'component-button-tertiary-foreground',
      backgroundToken: 'component-button-tertiary-background',
      notes: (fg, bg) => `Computed from ${fg} over ${bg} in the default token bundle.`,
    }),
    contrastRow(values, {
      id: 'destructive',
      surface: 'Destructive',
      foreground: 'Error foreground',
      background: 'Error background',
      foregroundToken: 'semantic-color-status-error-foreground',
      backgroundToken: 'semantic-color-status-error-background',
      notes: (fg, bg) => `Computed from ${fg} over ${bg} in the default token bundle.`,
    }),
    contrastRow(values, {
      id: 'success',
      surface: 'Success',
      foreground: 'Success foreground',
      background: 'Success background',
      foregroundToken: 'semantic-color-status-success-foreground',
      backgroundToken: 'semantic-color-status-success-background',
      notes: (fg, bg) => `Computed from ${fg} over ${bg} in the default token bundle.`,
    }),
    contrastRow(values, {
      id: 'disabled',
      surface: 'Disabled primary',
      foreground: `Primary foreground at ${Math.round(disabledOpacity * 100)}% opacity`,
      background: `Primary background at ${Math.round(disabledOpacity * 100)}% opacity`,
      foregroundHex: disabledForeground,
      backgroundHex: disabledBackground,
      disabled: true,
      notes: () => `Computed from the full primary button composited at disabled opacity over ${page}.`,
    }),
    contrastRow(values, {
      id: 'focus',
      surface: 'Focus ring',
      foreground: 'Shared focus ring',
      background: 'Page surface',
      foregroundToken: 'component-button-focus-ring',
      backgroundToken: 'semantic-color-surface-page',
      wcag: nonTextWcag(contrastRatio(token(values, 'component-button-focus-ring'), page)),
      notes: (fg, bg) => `Computed from ${fg} over ${bg} using the shared focus ring token.`,
    }),
  ]
}

function targetStatus(size, minimum) {
  return size >= minimum ? 'Pass' : 'Needs exception'
}

function buttonTargetSizeRows(values) {
  const rows = [
    {
      id: 'small',
      size: 'Small',
      tokenName: '--component-button-small-height',
      tokenValue: token(values, 'component-button-small-height'),
      usage: 'Dense toolbars, compact tables, and repeated low-risk actions.',
    },
    {
      id: 'medium',
      size: 'Medium',
      tokenName: '--component-button-min-height',
      tokenValue: token(values, 'component-button-min-height'),
      usage: 'Default application actions.',
    },
    {
      id: 'large',
      size: 'Large',
      tokenName: '--component-button-large-height',
      tokenValue: token(values, 'component-button-large-height'),
      usage: 'Primary calls to action and touch-forward layouts.',
    },
  ]

  return rows.map((row) => {
    const blockSize = cssLengthToPx(row.tokenValue)
    const aaaStatus = targetStatus(blockSize, 44)
    return {
      id: row.id,
      size: row.size,
      measuredToken: row.tokenName,
      minimumBlockSize: formatPx(blockSize),
      wcag258: targetStatus(blockSize, 24),
      wcag255: aaaStatus,
      usage: row.usage,
      notes: aaaStatus === 'Pass'
        ? 'Meets the 44 px block-size target before any adjacent spacing is counted; inline size remains content-dependent.'
        : 'Below the 44 px AAA target by visual block size; use only where spacing, equivalent target, or inline layout exceptions are satisfied.',
    }
  })
}

const values = readTokenValues()
const buttonContrastRowsData = buttonContrastRows(values)
const buttonTargetSizeRowsData = buttonTargetSizeRows(values)
const content = `// Generated by scripts/a11y/generate-component-reports.mjs.
// Run npm run a11y:reports after rebuilding tokens.

export const BUTTON_CONTRAST_ROWS = ${JSON.stringify(buttonContrastRowsData, null, 2)}

export const BUTTON_TARGET_SIZE_ROWS = ${JSON.stringify(buttonTargetSizeRowsData, null, 2)}
`

if (checkOnly) {
  const current = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, 'utf8') : ''
  if (current !== content) {
    console.error('Component accessibility report data is out of date. Run npm run a11y:reports.')
    process.exit(1)
  }
} else {
  fs.writeFileSync(outputPath, content)
  console.log(`Wrote ${path.relative(root, outputPath)}`)
}
