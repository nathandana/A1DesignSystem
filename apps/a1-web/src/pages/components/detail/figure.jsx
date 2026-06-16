import {
  ChoiceGroup,
  Code,
  Figure,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { Toggle } from './Toggle.jsx'

const RADIUS_OPTIONS = ['', 'none', 'sm', 'md', 'lg']
const SIZE_OPTIONS = ['', 'xs', 'sm', 'md', 'lg']
const ALIGN_OPTIONS = ['start', 'center', 'end']
const CAPTION_POSITION_OPTIONS = ['start', 'center']

const PLACEHOLDER_SRC = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 270'%3E%3Crect width='480' height='270' fill='%23e9eef7'/%3E%3Ccircle cx='240' cy='120' r='48' fill='%237c3aed'/%3E%3Crect x='160' y='188' width='160' height='12' rx='6' fill='%23c4b5fd'/%3E%3C/svg%3E"

function optionLabel(value) {
  if (!value) return 'None'
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function escapeJsxString(value) {
  return String(value ?? '').replaceAll('"', '&quot;')
}

function propString(name, value, defaultValue) {
  if (value === undefined || value === null || value === defaultValue || value === '') return null
  return `${name}="${escapeJsxString(value)}"`
}

function propBoolean(name, value, defaultValue) {
  if (value === defaultValue) return null
  return value ? name : `${name}={false}`
}

function buildFigureSnippet(config) {
  const props = [
    `src="…"`,
    `alt="${escapeJsxString(config.alt || '')}"`,
    config.caption ? `caption="${escapeJsxString(config.caption)}"` : null,
    propString('radius', config.radius, ''),
    propString('size', config.size, ''),
    propString('align', config.align, 'start'),
    propString('captionPosition', config.captionPosition, 'start'),
    propBoolean('captionSrOnly', config.captionSrOnly, false),
  ].filter(Boolean).join('\n  ')

  return `<Figure\n  ${props}\n/>`
}

export function getDefaultConfig() {
  return {
    alt: 'Abstract figure preview',
    caption: 'Figure caption',
    radius: 'md',
    size: '',
    align: 'start',
    captionPosition: 'start',
    captionSrOnly: false,
  }
}

export function Preview({ config }) {
  return (
    <Figure
      src={PLACEHOLDER_SRC}
      alt={config.alt || ''}
      caption={config.captionSrOnly ? undefined : (config.caption || undefined)}
      radius={config.radius || undefined}
      size={config.size || undefined}
      align={config.align !== 'start' ? config.align : undefined}
      captionPosition={config.captionPosition}
      captionSrOnly={config.captionSrOnly}
    />
  )
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))

  return (
    <Stack gap="lg">
      <TextField
        label="Alt text"
        size="compact"
        value={config.alt}
        onChange={(event) => set({ alt: event.target.value })}
      />
      <TextField
        label="Caption"
        size="compact"
        value={config.caption}
        onChange={(event) => set({ caption: event.target.value })}
      />
      <Toggle
        label="Caption screen-reader only"
        value={config.captionSrOnly}
        onChange={(captionSrOnly) => set({ captionSrOnly })}
      />
      <ChoiceGroup
        label="Radius"
        size="compact"
        hideIndicator
        columns={3}
        value={config.radius}
        onChange={(radius) => set({ radius })}
        options={RADIUS_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <ChoiceGroup
        label="Size"
        size="compact"
        hideIndicator
        columns={3}
        value={config.size}
        onChange={(size) => set({ size })}
        options={SIZE_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <ChoiceGroup
        label="Align"
        size="compact"
        hideIndicator
        columns={3}
        value={config.align}
        onChange={(align) => set({ align })}
        options={ALIGN_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <ChoiceGroup
        label="Caption position"
        size="compact"
        hideIndicator
        columns={2}
        value={config.captionPosition}
        onChange={(captionPosition) => set({ captionPosition })}
        options={CAPTION_POSITION_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildFigureSnippet(config)}</Code>
}
