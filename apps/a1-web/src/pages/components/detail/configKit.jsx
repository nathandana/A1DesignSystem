import { createContext, useContext, useState } from 'react'
import {
  Accordion,
  IconButton,
  Paragraph,
  Slider,
  Stack,
  Toolbar,
  ToolbarGroup,
  ToolbarToggle,
} from '@gtivr4/a1-design-system-react'
import { ConfigLockContext, Lockable, applyLockToggle } from './configLock.jsx'

export { Toggle } from './Toggle.jsx'
export { ConfigLockContext, Lockable } from './configLock.jsx'

/**
 * ConfigHelpContext — toggles per-property helper text across every configurator.
 * The detail panel's "Helper text" switch provides `showHelp`; it is off by
 * default. Controls in this kit accept an optional `helper` string and render a
 * short muted summary beneath themselves only while `showHelp` is true.
 */
export const ConfigHelpContext = createContext({ showHelp: false })

/**
 * WithHelp — appends a muted helper line below a control when help is enabled.
 * When help is off (or no `helper` is given) it returns the control untouched,
 * so it adds no DOM in the default state.
 */
export function WithHelp({ helper, children }) {
  const { showHelp } = useContext(ConfigHelpContext)
  if (!helper || !showHelp) return children
  return (
    <Stack gap="xs">
      {children}
      <Paragraph size="xs" color="muted" className="a1-web-config-help">{helper}</Paragraph>
    </Stack>
  )
}

/**
 * ConfigHelp — renders its children only while the Helper text toggle is on.
 * Use it to gate standalone guidance blocks (not tied to a single control), e.g.
 * the Heading configurator's "edit in the preview / markdown shorthand" note.
 */
export function ConfigHelp({ children }) {
  const { showHelp } = useContext(ConfigHelpContext)
  return showHelp ? children : null
}

/**
 * The field-family density scale, mapped to Material Symbols density icons so
 * the Size control reads as an icon-only density picker (compact → comfortable).
 */
export const DENSITY_SIZE_OPTIONS = [
  { value: 'compact', label: 'Compact', icon: 'density_small' },
  { value: 'default', label: 'Default', icon: 'density_medium' },
  { value: 'comfortable', label: 'Comfortable', icon: 'density_large' },
]

/**
 * Choice — a labelled single-select config control rendered as a Toolbar group.
 * A drop-in for the configurators' previous `ChoiceGroup` controls: pass the
 * same `label` / `value` / `onChange` / `options`. Options accept
 * `{ value, label?, icon?, swatch?, disabled? }`.
 *
 * - `iconOnly` hides the labels (icon-only buttons) and keeps `columns` so icon
 *   grids (e.g. a 3×3 picker) stay a grid; labelled groups wrap instead.
 */
export function Choice({ label, value, onChange, options, iconOnly = false, columns, prop, helper, labelMode }) {
  return (
    <WithHelp helper={helper}>
      <Lockable prop={prop}>
        <Toolbar label={label}>
          <ToolbarGroup
            aria-label={typeof label === 'string' ? label : undefined}
            showLabels={!iconOnly}
            labelMode={labelMode}
            columns={iconOnly ? columns : undefined}
            value={value}
            onChange={onChange}
            options={options}
          />
        </Toolbar>
      </Lockable>
    </WithHelp>
  )
}

/**
 * DensityChoice — the form-field Size control rendered as an icon-only density
 * picker (density_small / density_medium / density_large).
 */
export function DensityChoice({ label = 'Size', value, onChange, prop = 'size', helper }) {
  // labelMode="selected": the chosen density shows its label; the rest stay
  // icon-only (density_small / medium / large).
  return (
    <Choice label={label} labelMode="selected" value={value} onChange={onChange} options={DENSITY_SIZE_OPTIONS} prop={prop} helper={helper} />
  )
}

// Semantic colours for status/colour pickers, shown as swatch-only Toolbar
// chips. A falsy/"none" value has no swatch, so it renders the standard none icon.
const STATUS_SWATCHES = {
  neutral: 'var(--semantic-color-text-muted)',
  muted: 'var(--semantic-color-text-muted)',
  accent: 'var(--semantic-color-text-accent)',
  inverse: 'var(--semantic-color-text-inverse)',
  info: 'var(--semantic-color-status-info-background)',
  success: 'var(--semantic-color-status-success-background)',
  warn: 'var(--semantic-color-status-warn-background)',
  error: 'var(--semantic-color-status-error-background)',
  action: 'var(--semantic-color-action-background)',
}

function statusLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

/**
 * statusOptions — build swatch-only `ToolbarGroup` options from a list of
 * colour/status values (neutral / info / success / warn / error / action, plus
 * muted / accent / inverse). Pair with `<Choice iconOnly>` so the picker shows
 * colour chips with the value name as each chip's accessible label. A `''`/"none"
 * value has no swatch (it keeps the none icon); pass `noneLabel` to name it
 * (e.g. "Inherit" for an icon colour).
 */
export function statusOptions(values, { noneLabel = 'None' } = {}) {
  return values.map((value) => ({
    value,
    label: value ? statusLabel(value) : noneLabel,
    swatch: STATUS_SWATCHES[value],
  }))
}

/**
 * FieldState — a Toolbar of toggle buttons for a form control's boolean state.
 * Pass only the flags the control supports; `onChange` receives a single-key
 * patch (e.g. `{ required: true }`) suitable for a `setConfig` merge.
 */
export function FieldState({ label = 'State', items, onChange, helper }) {
  // FieldState knows each toggle's config key, so it can self-mark when any of
  // its keys (or the whole element) is locked, and lock them all when authoring.
  const lockCtx = useContext(ConfigLockContext)
  const keys = items.map((item) => item.prop ?? item.key)
  const anyLocked = keys.some((key) => lockCtx.lockedProps.has(key))
  const toolbar = (
    <Toolbar label={label}>
      {items.map((item) => (
        <ToolbarToggle
          key={item.key}
          icon={item.icon}
          label={item.label}
          pressed={item.value}
          onChange={(value) => onChange({ [item.key]: value })}
        />
      ))}
    </Toolbar>
  )

  if (lockCtx.authoring && lockCtx.onSetLockedProps) {
    return (
      <WithHelp helper={helper}>
        <Stack direction="row" gap="xs" align="center" className={anyLocked ? 'a1-web-tool-authoring--locked' : undefined}>
          <div className="a1-web-tool-authoring__control">{toolbar}</div>
          <IconButton
            icon={anyLocked ? 'lock' : 'lock_open'}
            size="sm"
            variant={anyLocked ? 'primary' : 'tertiary'}
            aria-label={anyLocked ? 'Unlock these properties' : 'Lock these properties'}
            onClick={() => applyLockToggle(lockCtx, keys, !anyLocked)}
          />
        </Stack>
      </WithHelp>
    )
  }

  return (
    <WithHelp helper={helper}>
      <Lockable locked={lockCtx.fullyLocked || anyLocked}>{toolbar}</Lockable>
    </WithHelp>
  )
}

// Viewport breakpoints (from system/tokens/breakpoint.json) for responsive props.
export const RESPONSIVE_BREAKPOINTS = [
  { key: 'xs', label: 'XS', range: '≤ 480px', icon: 'smartphone' },
  { key: 'sm', label: 'SM', range: '481–640px', icon: 'tablet_android' },
  { key: 'md', label: 'MD', range: '641–1024px', icon: 'tablet_mac' },
  { key: 'lg', label: 'LG', range: '1025–1440px', icon: 'laptop' },
  { key: 'xl', label: 'XL', range: '≥ 1441px', icon: 'desktop_windows' },
]

function isResponsiveValue(value) {
  return value != null && typeof value === 'object' && !Array.isArray(value)
}

const BREAKPOINT_KEYS = ['xs', 'sm', 'md', 'lg', 'xl']

function snippetValue(value) {
  return typeof value === 'string' ? `"${value}"` : String(value)
}

/**
 * Serialize a possibly-responsive prop for a JSX snippet. Returns
 * `name={{ xs: …, md: … }}` for a responsive object, `name="…"` / `name={…}`
 * for a scalar, or `null` to omit (empty object, or scalar equal to
 * `defaultValue` / empty).
 */
export function responsiveProp(name, value, defaultValue) {
  if (isResponsiveValue(value)) {
    const entries = BREAKPOINT_KEYS
      .filter((key) => value[key] !== undefined && value[key] !== '')
      .map((key) => `${key}: ${snippetValue(value[key])}`)
    return entries.length ? `${name}={{ ${entries.join(', ')} }}` : null
  }
  if (value === undefined || value === null || value === '' || value === defaultValue) return null
  return typeof value === 'string' ? `${name}="${value}"` : `${name}={${value}}`
}

/**
 * ResponsiveControl — wraps a property control so it can be set **per breakpoint**.
 * In single-value mode it renders the control plus a small "devices" icon button.
 * Clicking it switches the value to a responsive object (`{ xs?, sm?, … }`) and
 * shows a Toolbar of breakpoint toggles; enabling a breakpoint adds an Accordion
 * (labelled with the breakpoint + its pixel range) holding the control for that
 * breakpoint. Toggling them all off / pressing the button again returns to a
 * single value.
 *
 * `children` is a render prop `(value, onChange, bp) => control` that renders the
 * underlying control **without its own label** (the label is supplied here, and
 * each breakpoint's accordion supplies the breakpoint name). `bp` is `null` in
 * single-value mode and the breakpoint key (`"xs"`…`"xl"`) per breakpoint — use
 * it to render extra controls (e.g. a Wrap toggle) only in the single-value bar.
 */
export function ResponsiveControl({ label, value, onChange, defaultValue, children, prop, helper }) {
  const responsive = isResponsiveValue(value)
  // Remember the single value so it seeds newly-enabled breakpoints.
  const [scalarMemo, setScalarMemo] = useState(responsive ? defaultValue : value)
  const seed = scalarMemo !== undefined ? scalarMemo : defaultValue

  const enableResponsive = () => { setScalarMemo(value); onChange({}) }
  const disableResponsive = () => {
    const firstDefined = RESPONSIVE_BREAKPOINTS.map((bp) => value[bp.key]).find((v) => v !== undefined)
    onChange(firstDefined !== undefined ? firstDefined : seed)
  }
  const toggleBreakpoint = (key, on) => {
    const next = { ...value }
    if (on) next[key] = value[key] !== undefined ? value[key] : seed
    else delete next[key]
    onChange(next)
  }
  const setBreakpoint = (key, v) => onChange({ ...value, [key]: v })

  return (
    <WithHelp helper={helper}>
    <Lockable prop={prop}>
    <Stack gap="xs">
      <Stack direction="row" gap="xs" align="center" justify="between">
        {label != null && <Paragraph size="xs" color="muted">{label}</Paragraph>}
        <IconButton
          icon="devices"
          size="sm"
          variant={responsive ? 'primary' : 'tertiary'}
          label={responsive ? `${label} — use a single value` : `${label} — set per breakpoint`}
          onClick={responsive ? disableResponsive : enableResponsive}
        />
      </Stack>

      {responsive ? (
        <Stack gap="xs">
          <Toolbar aria-label={`${label} breakpoints`}>
            {RESPONSIVE_BREAKPOINTS.map((bp) => (
              <ToolbarToggle
                key={bp.key}
                label={bp.label}
                showLabel
                pressed={value[bp.key] !== undefined}
                onChange={(on) => toggleBreakpoint(bp.key, on)}
              />
            ))}
          </Toolbar>
          {RESPONSIVE_BREAKPOINTS.filter((bp) => value[bp.key] !== undefined).map((bp) => (
            <Accordion key={bp.key} label={`${bp.label} breakpoint`} subtext={bp.range} size="sm" divider defaultOpen>
              {children(value[bp.key], (v) => setBreakpoint(bp.key, v), bp.key)}
            </Accordion>
          ))}
        </Stack>
      ) : (
        children(value, onChange, null)
      )}
    </Stack>
    </Lockable>
    </WithHelp>
  )
}

function defaultFormat(value) {
  if (!value || value === 'none') return '--'
  return value.charAt(0).toUpperCase() + value.slice(1).replaceAll('-', ' ')
}

// Longer, spoken-out size names shown in the Slider's value bubble while the
// short abbreviation (Sm, Md, …) stays under the track.
const SIZE_LONG_LABELS = {
  '': 'Default', none: 'None', auto: 'Auto',
  xxs: '2X-small', xs: 'Extra small', sm: 'Small', md: 'Medium',
  lg: 'Large', xl: 'Extra large', xxl: '2X-large',
  '2xl': '2X-large', '3xl': '3X-large',
  jumbo: 'Jumbo', xJumbo: 'Extra jumbo',
}

function longSizeLabel(value) {
  if (value == null) return SIZE_LONG_LABELS['']
  if (value in SIZE_LONG_LABELS) return SIZE_LONG_LABELS[value]
  return value.charAt(0).toUpperCase() + value.slice(1).replaceAll('-', ' ')
}

/**
 * ConfigSlider — a compact, subtle Slider over a string-value scale, for size /
 * spacing controls (matches the Section configurator). `values` is the ordered
 * scale (the lowest stop, '' or 'none', renders as "--"); the slider maps the
 * thumb index back to the string value. Pass `format` to customise the short
 * detent labels; `bubbleFormat` customises the longer value-bubble label.
 */
export function ConfigSlider({ label, values, value, onChange, format = defaultFormat, bubbleFormat = longSizeLabel, prop, helper }) {
  const detents = values.map((v, index) => ({ value: index, label: format(v) }))
  const clampIndex = (index) => Math.max(0, Math.min(values.length - 1, Math.round(index)))
  return (
    <WithHelp helper={helper}>
      <Lockable prop={prop}>
        <Slider
          size="compact"
          variant="subtle"
          label={label}
          detents={detents}
          value={Math.max(0, values.indexOf(value))}
          onChange={(index) => onChange(values[index])}
          bubbleLabel={(index) => bubbleFormat(values[clampIndex(index)])}
        />
      </Lockable>
    </WithHelp>
  )
}
