import {
  Card,
  ChoiceGroup,
  Code,
  Heading,
  Paragraph,
  Stack,
  Switch,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { IconSelect } from './IconSelect.jsx'

const AS_OPTIONS = ['div', 'article', 'section']
const ICON_DISPLAY_OPTIONS = ['default', 'hero', 'none']
const HERO_COLOR_OPTIONS = ['action', 'neutral', 'info', 'success', 'warn', 'error']
const NONE_ICON = 'layers_clear'

function optionLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function optionWithNoneIcon(value) {
  if (value === 'none') {
    return { label: optionLabel(value), value, icon: NONE_ICON, iconOnly: true }
  }

  return { label: optionLabel(value), value }
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

function buildCardSnippet(config) {
  const icon = config.iconDisplay === 'none' ? '' : config.icon
  const props = [
    propString('as', config.as, 'div'),
    propString('variant', config.variant, 'default'),
    config.variant === 'navigation' ? propString('href', config.href, '') : null,
    propBoolean('bare', config.bare, false),
    propString('icon', icon, ''),
    propString('iconDisplay', icon ? config.iconDisplay : 'none', icon ? 'default' : 'none'),
    config.iconDisplay === 'hero' ? propString('heroColor', config.heroColor, 'action') : null,
  ].filter(Boolean).join(' ')

  return `<Card${props ? ` ${props}` : ''}>
  <Heading as="h3" size="sm">${escapeJsxText(config.title || 'Card title')}</Heading>
  <Paragraph size="sm" color="muted">
    ${escapeJsxText(config.body || 'Supporting card content.')}
  </Paragraph>
</Card>`
}

export function getDefaultConfig() {
  return {
    as: 'div',
    title: 'Responsive card',
    body: 'The icon treatment adapts as the card container crosses standard query widths.',
    variant: 'default',
    href: '#',
    bare: false,
    icon: 'dashboard',
    iconDisplay: 'hero',
    heroColor: 'action',
  }
}

export function Preview({ config }) {
  const icon = config.iconDisplay === 'none' ? undefined : config.icon

  return (
    <Card
      as={config.variant === 'navigation' ? undefined : config.as}
      variant={config.variant}
      href={config.variant === 'navigation' ? config.href : undefined}
      bare={config.bare}
      icon={icon}
      iconDisplay={config.iconDisplay}
      heroColor={config.heroColor}
    >
      <Stack gap="xs">
        <Heading as="h3" size="sm">{config.title || 'Card title'}</Heading>
        <Paragraph size="sm" color="muted">
          {config.body || 'Supporting card content.'}
        </Paragraph>
      </Stack>
    </Card>
  )
}

export function Controls({ config, setConfig }) {
  return (
    <Stack gap="lg">
      {/* <TextField
        label="Title"
        size="compact"
        value={config.title}
        onChange={(event) => setConfig((current) => ({ ...current, title: event.target.value }))}
      />
      <TextField
        label="Body"
        size="compact"
        value={config.body}
        onChange={(event) => setConfig((current) => ({ ...current, body: event.target.value }))}
      /> */}
      <ChoiceGroup
        label="Variant"
        size="compact"
        hideIndicator
        columns={2}
        value={config.variant}
        onChange={(variant) => setConfig((current) => ({ ...current, variant }))}
        options={[
          { label: 'Default', value: 'default' },
          { label: 'Navigation', value: 'navigation' },
        ]}
      />
      {config.variant !== 'navigation' && (
        <ChoiceGroup
          label="Element"
          size="compact"
          hideIndicator
          columns={3}
          value={config.as}
          onChange={(as) => setConfig((current) => ({ ...current, as }))}
          options={AS_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
        />
      )}
      {config.variant === 'navigation' && (
        <TextField
          label="Href"
          size="compact"
          value={config.href}
          onChange={(event) => setConfig((current) => ({ ...current, href: event.target.value }))}
        />
      )}
      <ChoiceGroup
        label="Icon display"
        size="compact"
        hideIndicator
        columns={3}
        value={config.iconDisplay}
        onChange={(iconDisplay) => setConfig((current) => ({ ...current, iconDisplay }))}
        options={ICON_DISPLAY_OPTIONS.map((opt) => optionWithNoneIcon(opt))}
      />
      {config.iconDisplay !== 'none' && (
        <IconSelect
          label="Icon"
          value={config.icon}
          onChange={(icon) => setConfig((current) => ({ ...current, icon }))}
        />
      )}
      {config.iconDisplay === 'hero' && (
        <ChoiceGroup
          label="Hero color"
          size="compact"
          hideIndicator
          columns={2}
          value={config.heroColor}
          onChange={(heroColor) => setConfig((current) => ({ ...current, heroColor }))}
          options={HERO_COLOR_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
        />
      )}
      <Switch
        label="Bare"
        size="compact"
        checked={config.bare}
        onChange={(bare) => setConfig((current) => ({ ...current, bare }))}
      />
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildCardSnippet(config)}</Code>
}
