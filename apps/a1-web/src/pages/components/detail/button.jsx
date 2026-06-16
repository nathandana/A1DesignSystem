import {
  Button,
  ChoiceGroup,
  Code,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { IconSelect } from './IconSelect.jsx'
import { PageLinkField } from './PageLinkField.jsx'
import { Toggle } from './Toggle.jsx'

const VARIANT_OPTIONS = ['primary', 'secondary', 'tertiary', 'destructive', 'success']
const SIZE_OPTIONS = ['sm', 'md', 'lg']
const ICON_POSITION_OPTIONS = ['start', 'end']

function optionLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function escapeJsxText(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

export function getDefaultConfig() {
  return {
    label: 'Save changes',
    variant: 'primary',
    size: 'md',
    href: '',
    icon: '',
    iconPosition: 'start',
    fullWidth: false,
    loading: false,
    disabled: false,
  }
}

export function Preview({ config }) {
  return (
    <Button
      variant={config.variant}
      size={config.size}
      href={config.href || undefined}
      icon={config.icon || undefined}
      iconPosition={config.iconPosition}
      fullWidth={config.fullWidth}
      loading={config.loading}
      disabled={config.disabled}
    >
      {config.label || 'Button'}
    </Button>
  )
}

export function Controls({ config, setConfig, pages }) {
  return (
    <Stack gap="lg">
      <TextField
        label="Label"
        size="compact"
        value={config.label}
        onChange={(event) => setConfig((current) => ({ ...current, label: event.target.value }))}
      />
      <ChoiceGroup
        label="Variant"
        size="compact"
        hideIndicator
        columns={2}
        value={config.variant}
        onChange={(variant) => setConfig((current) => ({ ...current, variant }))}
        options={VARIANT_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <ChoiceGroup
        label="Size"
        size="compact"
        hideIndicator
        columns={3}
        value={config.size}
        onChange={(size) => setConfig((current) => ({ ...current, size }))}
        options={SIZE_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <Toggle
        label="Icon"
        value={!!config.icon}
        onChange={(checked) => setConfig((current) => ({ ...current, icon: checked ? (current.icon || 'check') : '' }))}
      />
      {config.icon && (
        <>
          <IconSelect
            value={config.icon}
            onChange={(icon) => setConfig((current) => ({ ...current, icon }))}
          />
          <ChoiceGroup
            label="Icon position"
            size="compact"
            hideIndicator
            columns={2}
            value={config.iconPosition}
            onChange={(iconPosition) => setConfig((current) => ({ ...current, iconPosition }))}
            options={ICON_POSITION_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
          />
        </>
      )}
      <PageLinkField
        pages={pages}
        value={config.href ?? ''}
        onChange={(href) => setConfig((current) => ({ ...current, href }))}
      />
      <Toggle label="Full width" value={config.fullWidth} onChange={(fullWidth) => setConfig((current) => ({ ...current, fullWidth }))} />
      <Toggle label="Loading" value={config.loading} onChange={(loading) => setConfig((current) => ({ ...current, loading }))} />
      <Toggle label="Disabled" value={config.disabled} onChange={(disabled) => setConfig((current) => ({ ...current, disabled }))} />
    </Stack>
  )
}

function buildButtonSnippet(config) {
  const props = [
    config.variant !== 'primary' ? `variant="${config.variant}"` : null,
    config.size !== 'md' ? `size="${config.size}"` : null,
    config.href ? `href="${config.href}"` : null,
    config.icon ? `icon="${config.icon}"` : null,
    config.icon && config.iconPosition !== 'start' ? `iconPosition="${config.iconPosition}"` : null,
    config.fullWidth ? 'fullWidth' : null,
    config.loading ? 'loading' : null,
    config.disabled ? 'disabled' : null,
  ].filter(Boolean).join(' ')

  const propsStr = props ? ` ${props}` : ''
  return `<Button${propsStr}>${escapeJsxText(config.label || 'Button')}</Button>`
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildButtonSnippet(config)}</Code>
}
