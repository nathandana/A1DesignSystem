import {
  ChoiceGroup,
  Code,
  Link,
  Paragraph,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { IconSelect } from './IconSelect.jsx'

const LINK_SIZE_OPTIONS = ['', 'xs', 'sm', 'md', 'lg', 'xl']
const LINK_WEIGHT_OPTIONS = ['', 'normal', 'medium', 'semibold', 'bold']
const LINK_ICON_POSITION_OPTIONS = ['start', 'end']

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

export function Controls({ config, setConfig }) {
  return (
    <Stack gap="lg">
      <TextField
        label="Text"
        size="compact"
        value={config.children}
        onChange={(event) => setConfig((current) => ({ ...current, children: event.target.value }))}
      />
      <TextField
        label="Href"
        size="compact"
        value={config.href}
        onChange={(event) => setConfig((current) => ({ ...current, href: event.target.value }))}
      />
      <ChoiceGroup
        label="Size"
        size="compact"
        hideIndicator
        columns={3}
        value={config.size}
        onChange={(size) => setConfig((current) => ({ ...current, size }))}
        options={LINK_SIZE_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <ChoiceGroup
        label="Weight"
        size="compact"
        hideIndicator
        columns={2}
        value={config.weight}
        onChange={(weight) => setConfig((current) => ({ ...current, weight }))}
        options={LINK_WEIGHT_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <ChoiceGroup
        label="Icon"
        size="compact"
        hideIndicator
        columns={2}
        value={config.showIcon ? 'show' : 'hide'}
        onChange={(value) => setConfig((current) => ({ ...current, showIcon: value === 'show' }))}
        options={[
          { label: 'Hide', value: 'hide' },
          { label: 'Show', value: 'show' },
        ]}
      />
      {config.showIcon && (
        <>
          <IconSelect
            label="Icon name"
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
            options={LINK_ICON_POSITION_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
          />
        </>
      )}
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildLinkSnippet(config)}</Code>
}
