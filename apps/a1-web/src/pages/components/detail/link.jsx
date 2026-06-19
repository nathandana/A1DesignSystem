import {
  Code,
  Link,
  Paragraph,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { Choice, ConfigSlider } from './configKit.jsx'
import { IconSelect } from './IconSelect.jsx'
import { PageLinkField } from './PageLinkField.jsx'

const LINK_SIZE_OPTIONS = ['', 'xs', 'sm', 'md', 'lg', 'xl']
const LINK_WEIGHT_OPTIONS = ['', 'normal', 'medium', 'semibold', 'bold']

function optionLabel(value) {
  if (value === '') return 'Inherit'
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function escapeJsxText(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('{', '&#123;')
    .replaceAll('}', '&#125;')
}

function propString(name, value, defaultValue) {
  if (value === undefined || value === null || value === defaultValue || value === '') return null
  return `${name}="${String(value).replaceAll('"', '&quot;')}"`
}

function buildLinkSnippet(config) {
  const props = [
    propString('href', config.href, '#'),
    propString('size', config.size, ''),
    propString('weight', config.weight, ''),
    propString('icon', config.showIcon ? config.icon : '', ''),
    config.showIcon ? propString('iconPosition', config.iconPosition, 'start') : null,
  ].filter(Boolean).join(' ')

  return `<Link${props ? ` ${props}` : ''}>${escapeJsxText(config.children || 'Link text')}</Link>`
}

export function getDefaultConfig() {
  return {
    children: 'Read the documentation',
    href: '#',
    size: '',
    weight: '',
    showIcon: false,
    icon: 'open_in_new',
    iconPosition: 'end',
  }
}

export function Preview({ config }) {
  const icon = config.showIcon ? config.icon : undefined
  return (
    <Paragraph>
      Learn more in the{' '}
      <Link
        href={config.href || '#'}
        size={config.size || undefined}
        weight={config.weight || undefined}
        icon={icon}
        iconPosition={config.iconPosition}
      >
        {config.children || 'Link text'}
      </Link>
      .
    </Paragraph>
  )
}

export function Controls({ config, setConfig, pages }) {
  return (
    <Stack gap="lg">
      <TextField
        label="Text"
        size="compact"
        value={config.children}
        onChange={(event) => setConfig((current) => ({ ...current, children: event.target.value }))}
      />
      <PageLinkField
        pages={pages}
        value={config.href}
        onChange={(href) => setConfig((current) => ({ ...current, href }))}
      />
      <ConfigSlider prop="size" label="Size" values={LINK_SIZE_OPTIONS} value={config.size} onChange={(size) => setConfig((current) => ({ ...current, size }))} />
      <Choice prop="weight"
        label="Weight"
        size="compact"
        hideIndicator
        columns={2}
        value={config.weight}
        onChange={(weight) => setConfig((current) => ({ ...current, weight }))}
        options={LINK_WEIGHT_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <Choice
        label="Icon"
        iconOnly
        value={!config.showIcon ? 'none' : (config.iconPosition === 'end' ? 'right' : 'left')}
        onChange={(placement) => setConfig((current) => placement === 'none'
          ? { ...current, showIcon: false }
          : { ...current, showIcon: true, iconPosition: placement === 'right' ? 'end' : 'start' })}
        options={[
          { value: 'none', label: 'None' },
          { value: 'left', label: 'Left', icon: 'align_horizontal_left' },
          { value: 'right', label: 'Right', icon: 'align_horizontal_right' },
        ]}
      />
      {config.showIcon && (
        <IconSelect
          label="Icon name"
          value={config.icon}
          onChange={(icon) => setConfig((current) => ({ ...current, icon }))}
        />
      )}
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildLinkSnippet(config)}</Code>
}
