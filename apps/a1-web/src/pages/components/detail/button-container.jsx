import {
  Button,
  ButtonContainer,
  ChoiceGroup,
  Code,
  IconButton,
  Stack,
  Switch,
  TextField,
} from '@gtivr4/a1-design-system-react'

const ALIGN_OPTIONS = ['start', 'center', 'end']
const SIZE_OPTIONS = ['sm', 'md', 'lg']

function optionLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

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
      <ChoiceGroup
        label="Align"
        size="compact"
        hideIndicator
        columns={3}
        value={config.align}
        onChange={(align) => setConfig((current) => ({ ...current, align }))}
        options={ALIGN_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <ChoiceGroup
        label="Size"
        size="compact"
        hideIndicator
        columns={2}
        value={config.size}
        onChange={(size) => setConfig((current) => ({ ...current, size }))}
        options={[
          { label: 'Default', value: '' },
          ...SIZE_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt })),
        ]}
      />
      <Switch
        label="Fill buttons"
        size="compact"
        checked={config.fillButtons}
        onChange={(fillButtons) => setConfig((current) => ({ ...current, fillButtons }))}
      />
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildButtonContainerSnippet(config)}</Code>
}
