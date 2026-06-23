import {
  Code,
  IconButton,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { Choice, ConfigSlider } from './configKit.jsx'
import { IconSelect } from './IconSelect.jsx'
import { PageLinkField } from './PageLinkField.jsx'
import { Toggle } from './Toggle.jsx'

// IconButton is always a fixed, square, natural-width control — it is never
// stretched to full width. Do not add a fullWidth option here; use Button with
// fullWidth for full-width actions. See system rule `icon-button-natural-width`.
const VARIANT_OPTIONS = ['tertiary', 'secondary', 'destructive', 'success']
// Icons for the variant picker, matching Button's emphasis ramp + status icons.
// With labelMode="selected" only the chosen variant shows its label.
const VARIANT_ICONS = {
  secondary: 'star_half',
  tertiary: 'star_outline',
  destructive: 'delete',
  success: 'check_circle',
}
const SIZE_OPTIONS = ['sm', 'md', 'lg']

function optionLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function getDefaultConfig() {
  return {
    icon: 'settings',
    label: 'Settings',
    variant: 'tertiary',
    size: 'md',
    href: '',
    disabled: false,
  }
}

export function Preview({ config, utilityClass = '' }) {
  return (
    <IconButton
      className={utilityClass || undefined}
      icon={config.icon || 'help'}
      label={config.label || 'Action'}
      variant={config.variant}
      size={config.size}
      href={config.href || undefined}
      disabled={config.disabled}
    />
  )
}

export function Controls({ config, setConfig, pages }) {
  return (
    <Stack gap="lg">
      <IconSelect
        value={config.icon}
        onChange={(icon) => setConfig((current) => ({ ...current, icon }))}
      />
      <TextField
        label="Accessible label"
        hint="Used as the aria-label and tooltip."
        size="compact"
        value={config.label}
        onChange={(event) => setConfig((current) => ({ ...current, label: event.target.value }))}
      />
      <Choice prop="variant"
        label="Variant"
        labelMode="selected"
        helper="Sets the icon button's visual emphasis and intent."
        value={config.variant}
        onChange={(variant) => setConfig((current) => ({ ...current, variant }))}
        options={VARIANT_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt, icon: VARIANT_ICONS[opt] }))}
      />
      <ConfigSlider prop="size" label="Size" helper="Sets the target size — sm (24px) for dense toolbars up to lg." values={SIZE_OPTIONS} value={config.size} onChange={(size) => setConfig((current) => ({ ...current, size }))} />
      <PageLinkField
        pages={pages}
        value={config.href ?? ''}
        onChange={(href) => setConfig((current) => ({ ...current, href }))}
      />
      <Toggle prop="disabled" label="Disabled" value={config.disabled} onChange={(disabled) => setConfig((current) => ({ ...current, disabled }))} />
    </Stack>
  )
}

function buildIconButtonSnippet(config, utilityClass = '') {
  const props = [
    utilityClass ? `className="${utilityClass.replaceAll('"', '&quot;')}"` : null,
    config.href ? 'as="a"' : null,
    `icon="${config.icon || 'help'}"`,
    `label="${String(config.label || 'Action').replaceAll('"', '&quot;')}"`,
    config.variant !== 'tertiary' ? `variant="${config.variant}"` : null,
    config.size !== 'md' ? `size="${config.size}"` : null,
    config.href ? `href="${config.href}"` : null,
    config.disabled ? 'disabled' : null,
  ].filter(Boolean).join(' ')

  return `<IconButton ${props} />`
}

export function Snippet({ config, utilityClass = '' }) {
  return <Code variant="block" wrapping copyCode>{buildIconButtonSnippet(config, utilityClass)}</Code>
}
