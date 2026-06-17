import {
  Button,
  ButtonContainer,
  Code,
  IconButton,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { Choice, ConfigSlider } from './configKit.jsx'

// "Fill" folds the fillButtons prop into the alignment control as a fourth
// option (justify reads as "stretch to fill the row").
const ALIGN_OPTIONS = [
  { value: 'start', label: 'Start', icon: 'format_align_left' },
  { value: 'center', label: 'Center', icon: 'format_align_center' },
  { value: 'end', label: 'End', icon: 'format_align_right' },
  { value: 'fill', label: 'Fill buttons', icon: 'format_align_justify' },
]
const SIZE_OPTIONS = ['sm', 'md', 'lg']

function escapeJsxText(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function propString(name, value, defaultValue) {
  if (value === undefined || value === null || value === defaultValue || value === '') return null
  return `${name}="${String(value).replaceAll('"', '&quot;')}"`
}

function propBoolean(name, value, defaultValue) {
  if (value === defaultValue) return null
  return `${name}={${value ? 'true' : 'false'}}`
}

function buildButtonContainerSnippet(config) {
  const props = [
    propString('align', config.align, 'start'),
    propString('size', config.size, ''),
    propBoolean('fillButtons', config.fillButtons, false),
  ].filter(Boolean).join(' ')

  return `<ButtonContainer${props ? ` ${props}` : ''}>
  <Button variant="secondary">${escapeJsxText(config.secondaryLabel || 'Cancel')}</Button>
  <Button variant="primary">${escapeJsxText(config.primaryLabel || 'Save')}</Button>
  <IconButton icon="more_horiz" label="More actions" />
</ButtonContainer>`
}

export function getDefaultConfig() {
  return {
    align: 'end',
    size: '',
    fillButtons: false,
    primaryLabel: 'Save changes',
    secondaryLabel: 'Cancel',
  }
}

export function Preview({ config }) {
  return (
    <ButtonContainer
      align={config.align}
      size={config.size || undefined}
      fillButtons={config.fillButtons}
    >
      <Button variant="secondary">{config.secondaryLabel || 'Cancel'}</Button>
      <Button variant="primary">{config.primaryLabel || 'Save'}</Button>
      <IconButton icon="more_horiz" label="More actions" />
    </ButtonContainer>
  )
}

export function Controls({ config, setConfig }) {
  return (
    <Stack gap="lg">
      <TextField
        label="Primary label"
        size="compact"
        value={config.primaryLabel}
        onChange={(event) => setConfig((current) => ({ ...current, primaryLabel: event.target.value }))}
      />
      <TextField
        label="Secondary label"
        size="compact"
        value={config.secondaryLabel}
        onChange={(event) => setConfig((current) => ({ ...current, secondaryLabel: event.target.value }))}
      />
      <Choice
        label="Align"
        iconOnly
        value={config.fillButtons ? 'fill' : config.align}
        onChange={(value) => setConfig((current) => value === 'fill'
          ? { ...current, fillButtons: true }
          : { ...current, align: value, fillButtons: false })}
        options={ALIGN_OPTIONS}
      />
      <ConfigSlider
        label="Size"
        values={['', ...SIZE_OPTIONS]}
        value={config.size}
        onChange={(size) => setConfig((current) => ({ ...current, size }))}
      />
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildButtonContainerSnippet(config)}</Code>
}
