import {
  Button,
  Code,
  SplitButton,
  Stack,
  TextField,
  Toolbar,
  ToolbarToggle,
} from '@gtivr4/a1-design-system-react'
import { Choice, ConfigSlider } from './configKit.jsx'
import { IconSelect } from './IconSelect.jsx'
import { PageLinkField } from './PageLinkField.jsx'

// Bare display: render the preview full-width (no centering Section) so the
// `fullWidth` toggle actually fills — a centered Section would shrink it to
// content. The Preview centers a natural-width button itself.
export const bareDisplay = true

const VARIANT_OPTIONS = ['primary', 'secondary', 'tertiary', 'destructive', 'success']
// Icons for the variant picker: an emphasis ramp (primary → tertiary) plus the
// two status variants. With labelMode="selected" only the chosen variant is named.
const VARIANT_ICONS = {
  primary: 'star',
  secondary: 'star_half',
  tertiary: 'star_outline',
  destructive: 'delete',
  success: 'check_circle',
}
const SIZE_OPTIONS = ['sm', 'md', 'lg']

// Sample secondary actions for the split-button demo.
const SAMPLE_ACTIONS = [
  { id: 'draft', label: 'Save as draft', icon: 'draft' },
  { id: 'template', label: 'Save as template', icon: 'bookmark' },
  { id: 'duplicate', label: 'Duplicate', icon: 'content_copy' },
]

// Platforms the page can render the component "as". The detail page reads this
// to show a "View as" toolbar; Preview/Controls/Snippet receive the active mode.
export const viewAsModes = [
  { value: 'react', label: 'React' },
  { value: 'native', label: 'Native' },
  { value: 'pure', label: 'Pure' },
]

// Which props each platform's Button supports. variant / size / icon /
// iconPosition / disabled apply everywhere; these differ:
// - Native (React Native) navigates via onPress, so there is no href.
// - Pure (HTML/CSS) has no full-width or loading modifier.
const PROP_SUPPORT = {
  react: { href: true, fullWidth: true, loading: true, split: true },
  native: { href: false, fullWidth: true, loading: true, split: false },
  pure: { href: true, fullWidth: false, loading: false, split: false },
}

function support(viewAs) {
  return PROP_SUPPORT[viewAs] ?? PROP_SUPPORT.react
}

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
    split: false,
  }
}

export function Preview({ config, viewAs = 'react' }) {
  // The A1 design is identical across platforms, so the preview always renders
  // the React component — but only with the props the selected platform supports
  // (e.g. Native drops href, Pure drops full-width/loading).
  const s = support(viewAs)
  const el = config.split && s.split ? (
    <SplitButton
      variant={config.variant}
      size={config.size}
      icon={config.icon || undefined}
      iconPosition={config.iconPosition}
      loading={config.loading}
      disabled={config.disabled}
      actions={SAMPLE_ACTIONS}
    >
      {config.label || 'Button'}
    </SplitButton>
  ) : (
    <Button
      variant={config.variant}
      size={config.size}
      href={s.href ? (config.href || undefined) : undefined}
      icon={config.icon || undefined}
      iconPosition={config.iconPosition}
      fullWidth={s.fullWidth ? config.fullWidth : false}
      loading={s.loading ? config.loading : false}
      disabled={config.disabled}
    >
      {config.label || 'Button'}
    </Button>
  )
  // Centered so a natural-width button looks balanced; a fullWidth button
  // (width: 100%) fills the row regardless of the centering.
  return (
    <div style={{ display: 'flex', justifyContent: 'center', inlineSize: '100%', padding: 'var(--base-spacing-16)' }}>
      {el}
    </div>
  )
}

export function Controls({ config, setConfig, pages, viewAs = 'react' }) {
  const s = support(viewAs)
  return (
    <Stack gap="lg">
      <TextField
        label="Label"
        size="compact"
        value={config.label}
        onChange={(event) => setConfig((current) => ({ ...current, label: event.target.value }))}
      />
      <Choice prop="variant"
        label="Variant"
        labelMode="selected"
        helper="Sets the button's visual emphasis and intent. Use one primary per decision area."
        value={config.variant}
        onChange={(variant) => setConfig((current) => ({ ...current, variant }))}
        options={VARIANT_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt, icon: VARIANT_ICONS[opt] }))}
      />
      <ConfigSlider prop="size" label="Size" helper="Controls the button's height, padding, and text size." values={SIZE_OPTIONS} value={config.size} onChange={(size) => setConfig((current) => ({ ...current, size }))} />
      <Choice
        label="Icon"
        iconOnly
        helper="Adds a leading or trailing icon — or none."
        value={!config.icon ? 'none' : (config.iconPosition === 'end' ? 'right' : 'left')}
        onChange={(placement) => setConfig((current) => placement === 'none'
          ? { ...current, icon: '' }
          : { ...current, icon: current.icon || 'check', iconPosition: placement === 'right' ? 'end' : 'start' })}
        options={[
          { value: 'none', label: 'None' },
          { value: 'left', label: 'Left', icon: 'align_horizontal_left' },
          { value: 'right', label: 'Right', icon: 'align_horizontal_right' },
        ]}
      />
      {config.icon && (
        <IconSelect
          value={config.icon}
          onChange={(icon) => setConfig((current) => ({ ...current, icon }))}
        />
      )}
      {s.href && (
        <PageLinkField
          pages={pages}
          value={config.href ?? ''}
          onChange={(href) => setConfig((current) => ({ ...current, href }))}
        />
      )}
      <Toolbar label="State">
        {s.fullWidth && (
          <ToolbarToggle icon="width_full" label="Full width" pressed={config.fullWidth} onChange={(fullWidth) => setConfig((current) => ({ ...current, fullWidth }))} />
        )}
        {s.loading && (
          <ToolbarToggle icon="progress_activity" label="Loading" pressed={config.loading} onChange={(loading) => setConfig((current) => ({ ...current, loading }))} />
        )}
        <ToolbarToggle icon="block" label="Disabled" pressed={config.disabled} onChange={(disabled) => setConfig((current) => ({ ...current, disabled }))} />
        {s.split && (
          <ToolbarToggle icon="arrow_drop_down_circle" label="Split (menu)" pressed={config.split} onChange={(split) => setConfig((current) => ({ ...current, split }))} />
        )}
      </Toolbar>
    </Stack>
  )
}

function buildReactSnippet(config) {
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

function buildNativeSnippet(config) {
  // React Native: navigates via onPress (no href); same visual props otherwise.
  const props = [
    config.variant !== 'primary' ? `variant="${config.variant}"` : null,
    config.size !== 'md' ? `size="${config.size}"` : null,
    config.icon ? `icon="${config.icon}"` : null,
    config.icon && config.iconPosition !== 'start' ? `iconPosition="${config.iconPosition}"` : null,
    config.fullWidth ? 'fullWidth' : null,
    config.loading ? 'loading' : null,
    config.disabled ? 'disabled' : null,
    'onPress={handlePress}',
  ].filter(Boolean).join(' ')

  return `import { Button } from '@gtivr4/a1-design-system-react-native'

<Button ${props}>${escapeJsxText(config.label || 'Button')}</Button>`
}

const PURE_VARIANT_CLASS = {
  secondary: 'a1-button-secondary',
  tertiary: 'a1-button-tertiary',
  destructive: 'a1-button-destructive',
  success: 'a1-button-success',
}
const PURE_SIZE_CLASS = { sm: 'a1-button-small', lg: 'a1-button-large' }

function buildPureSnippet(config) {
  const classes = ['a1-button']
  if (config.variant !== 'primary' && PURE_VARIANT_CLASS[config.variant]) classes.push(PURE_VARIANT_CLASS[config.variant])
  if (PURE_SIZE_CLASS[config.size]) classes.push(PURE_SIZE_CLASS[config.size])
  const classAttr = classes.join(' ')

  const label = escapeJsxText(config.label || 'Button')
  const iconSpan = config.icon ? `<span class="a1-icon" aria-hidden="true">${config.icon}</span>` : ''
  const inner = !iconSpan
    ? label
    : (config.iconPosition === 'end' ? `${label} ${iconSpan}` : `${iconSpan} ${label}`)

  // An href renders an anchor styled as a button; disabled maps to aria-disabled.
  if (config.href) {
    const ariaDisabled = config.disabled ? ' aria-disabled="true"' : ''
    return `<a class="${classAttr}" href="${config.href}"${ariaDisabled}>${inner}</a>`
  }
  const disabledAttr = config.disabled ? ' disabled' : ''
  return `<button class="${classAttr}" type="button"${disabledAttr}>${inner}</button>`
}

function buildSplitSnippet(config) {
  const props = [
    config.variant !== 'primary' ? `variant="${config.variant}"` : null,
    config.size !== 'md' ? `size="${config.size}"` : null,
    config.icon ? `icon="${config.icon}"` : null,
    config.icon && config.iconPosition !== 'start' ? `iconPosition="${config.iconPosition}"` : null,
    config.loading ? 'loading' : null,
    config.disabled ? 'disabled' : null,
    'onClick={handleSave}',
  ].filter(Boolean).join('\n  ')

  return `<SplitButton
  ${props}
  actions={[
    { id: 'draft', label: 'Save as draft', icon: 'draft' },
    { id: 'template', label: 'Save as template', icon: 'bookmark' },
    { id: 'duplicate', label: 'Duplicate', icon: 'content_copy' },
  ]}
>
  ${escapeJsxText(config.label || 'Button')}
</SplitButton>`
}

export function Snippet({ config, viewAs = 'react' }) {
  if (config.split && support(viewAs).split) {
    return <Code variant="block" wrapping copyCode>{buildSplitSnippet(config)}</Code>
  }
  const build = viewAs === 'native' ? buildNativeSnippet
    : viewAs === 'pure' ? buildPureSnippet
      : buildReactSnippet
  return <Code variant="block" wrapping copyCode>{build(config)}</Code>
}
