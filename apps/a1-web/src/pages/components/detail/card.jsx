import {
  Card,
  Code,
  Heading,
  Paragraph,
  Stack,
  TextField,
  Toolbar,
  ToolbarDivider,
  ToolbarGroup,
  ToolbarToggle,
} from '@gtivr4/a1-design-system-react'
import { Choice, Lockable, WithHelp, statusOptions } from './configKit.jsx'

// 3×3 hero-badge placement → directional icons for the alignment-grid picker.
const HERO_BADGE_POSITIONS = [
  { value: 'top-start', icon: 'north_west' },
  { value: 'top-center', icon: 'north' },
  { value: 'top-end', icon: 'north_east' },
  { value: 'middle-start', icon: 'west' },
  { value: 'middle-center', icon: 'filter_center_focus' },
  { value: 'middle-end', icon: 'east' },
  { value: 'bottom-start', icon: 'south_west' },
  { value: 'bottom-center', icon: 'south' },
  { value: 'bottom-end', icon: 'south_east' },
]
import { IconSelect } from './IconSelect.jsx'
import { PageLinkField } from './PageLinkField.jsx'

const AS_OPTIONS = ['div', 'article', 'section']
// None first and the standard circle-slash none icon; None is the default.
const ICON_DISPLAY_OPTIONS = ['none', 'default', 'hero']
const HERO_COLOR_OPTIONS = ['action', 'neutral', 'info', 'success', 'warn', 'error']
const NONE_ICON = 'block'

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
    config.iconDisplay === 'hero' ? propString('heroBadge', config.heroBadge, '') : null,
    config.iconDisplay === 'hero' && config.heroBadge ? propString('heroBadgeStatus', config.heroBadgeStatus, 'neutral') : null,
    config.iconDisplay === 'hero' && config.heroBadge ? propString('heroBadgePosition', config.heroBadgePosition, 'top-end') : null,
    propString('status', config.status, ''),
    config.status ? propString('statusLabel', config.statusLabel, '') : null,
    config.status ? propBoolean('statusPulse', config.statusPulse, false) : null,
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
    iconDisplay: 'none',
    heroColor: 'action',
    heroBadge: '',
    heroBadgeStatus: 'neutral',
    heroBadgePosition: 'top-end',
    status: '',
    statusLabel: 'In progress',
    statusPulse: false,
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
      heroBadge={config.iconDisplay === 'hero' && config.heroBadge ? config.heroBadge : undefined}
      heroBadgeStatus={config.heroBadgeStatus}
      heroBadgePosition={config.heroBadgePosition}
      status={config.status || undefined}
      statusLabel={config.status && config.statusLabel ? config.statusLabel : undefined}
      statusPulse={config.statusPulse}
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

export function Controls({ config, setConfig, pages }) {
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
      <Lockable prop="variant"><Toolbar label="Variant">
        <ToolbarGroup
          aria-label="Variant"
          showLabels
          value={config.variant}
          onChange={(variant) => setConfig((current) => ({ ...current, variant }))}
          options={[
            { label: 'Default', value: 'default' },
            { label: 'Navigation', value: 'navigation' },
          ]}
        />
        <ToolbarDivider />
        <ToolbarToggle icon="crop_free" label="Bare" pressed={config.bare} onChange={(bare) => setConfig((current) => ({ ...current, bare }))} />
      </Toolbar></Lockable>
      {config.variant !== 'navigation' && (
        <Choice prop="as"
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
        <PageLinkField
          pages={pages}
          value={config.href}
          onChange={(href) => setConfig((current) => ({ ...current, href }))}
        />
      )}
      <Choice prop="iconDisplay"
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
        <Choice prop="heroColor"
          label="Hero color"
          iconOnly
          value={config.heroColor}
          onChange={(heroColor) => setConfig((current) => ({ ...current, heroColor }))}
          options={statusOptions(HERO_COLOR_OPTIONS)}
        />
      )}
      {config.iconDisplay === 'hero' && (
        <TextField
          label="Hero badge"
          size="compact"
          hint="Badge overlaid on the hero. Leave blank for none."
          value={config.heroBadge}
          onChange={(event) => setConfig((current) => ({ ...current, heroBadge: event.target.value }))}
        />
      )}
      {config.iconDisplay === 'hero' && config.heroBadge && (
        <>
          <Choice prop="heroBadgeStatus"
            label="Badge status"
            iconOnly
            value={config.heroBadgeStatus}
            onChange={(heroBadgeStatus) => setConfig((current) => ({ ...current, heroBadgeStatus }))}
            options={statusOptions(['neutral', 'info', 'success', 'warn', 'error'])}
          />
          <Toolbar label="Badge position">
            <ToolbarGroup
              aria-label="Badge position"
              columns={3}
              value={config.heroBadgePosition}
              onChange={(heroBadgePosition) => setConfig((current) => ({ ...current, heroBadgePosition }))}
              options={HERO_BADGE_POSITIONS.map((p) => ({ value: p.value, icon: p.icon, label: p.value.replace('-', ' ') }))}
            />
          </Toolbar>
        </>
      )}
      <Choice prop="status"
        label="Status stripe"
        iconOnly
        helper="Colours a stripe down the card's start edge to signal status. Pair it with a label so meaning isn't colour-only."
        value={config.status}
        onChange={(status) => setConfig((current) => ({ ...current, status }))}
        options={statusOptions(['', 'neutral', 'info', 'success', 'warn', 'error'])}
      />
      {config.status && (
        <>
          <WithHelp helper="Badge shown at the top of the card, tinted to match the stripe. Leave blank for a stripe only.">
            <TextField
              label="Status label"
              size="compact"
              value={config.statusLabel}
              onChange={(event) => setConfig((current) => ({ ...current, statusLabel: event.target.value }))}
            />
          </WithHelp>
          <WithHelp helper="Subtly pulses the stripe to indicate in-progress work. Respects the reduced-motion OS setting (stays static).">
            <Toolbar label="Animate stripe">
              <ToolbarToggle
                icon="sync"
                label="Pulse (in progress)"
                showLabel
                pressed={config.statusPulse}
                onChange={(statusPulse) => setConfig((current) => ({ ...current, statusPulse }))}
              />
            </Toolbar>
          </WithHelp>
        </>
      )}
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildCardSnippet(config)}</Code>
}
