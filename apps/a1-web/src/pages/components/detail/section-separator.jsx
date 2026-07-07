import {
  Code,
  Heading,
  Paragraph,
  Section,
  SectionSeparator,
  Stack,
  Toolbar,
  ToolbarGroup,
  ToolbarToggle,
} from '@gtivr4/a1-design-system-react'
import { Choice, ConfigSlider } from './configKit.jsx'
import { Toggle } from './Toggle.jsx'

const SURFACE_OPTIONS = ['page', 'panel', 'raised']
const SHAPE_OPTIONS = ['wave', 'swell', 'curve', 'slope', 'peak', 'valley', 'ribbon']
const SIZE_OPTIONS = ['xs', 'sm', 'md', 'lg', 'xl']
const BORDER_SIZE_OPTIONS = ['xs', 'sm', 'md', 'lg']
const BORDER_VARIANT_OPTIONS = ['subtle', 'strong', 'accent']
const SURFACE_ITEMS = SURFACE_OPTIONS.map((value) => ({
  label: optionLabel(value),
  value,
  swatch: `var(--semantic-color-surface-${value})`,
}))

export const bareDisplay = true

function optionLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1).replaceAll('-', ' ')
}

function propString(name, value, defaultValue) {
  if (value === undefined || value === null || value === defaultValue || value === '') return null
  return `${name}="${value}"`
}

function propBoolean(name, value, defaultValue) {
  if (value === defaultValue) return null
  return `${name}={${value ? 'true' : 'false'}}`
}

function buildSnippet(config, utilityClass = '') {
  const props = [
    propString('className', utilityClass, ''),
    propString('topSurface', config.topSurface, 'page'),
    propString('bottomSurface', config.bottomSurface, 'panel'),
    propBoolean('topInverse', config.topInverse, false),
    propBoolean('bottomInverse', config.bottomInverse, false),
    propString('shape', config.shape, 'wave'),
    propString('size', config.size, 'md'),
    propBoolean('border', config.border, false),
    config.border ? propString('borderSize', config.borderSize, 'xs') : null,
    config.border ? propString('borderVariant', config.borderVariant, 'subtle') : null,
    propBoolean('decorative', config.decorative, true),
  ].filter(Boolean).join(' ')

  return `<SectionSeparator${props ? ` ${props}` : ''} />`
}

export function getDefaultConfig() {
  return {
    topSurface: 'panel',
    bottomSurface: 'raised',
    topInverse: false,
    bottomInverse: false,
    shape: 'wave',
    size: 'md',
    border: true,
    borderSize: 'sm',
    borderVariant: 'accent',
    decorative: true,
  }
}

export function Preview({ config, utilityClass = '' }) {
  return (
    <Stack gap="none">
      <Section
        padding="md"
        surface={config.topSurface}
        inverse={config.topInverse}
        align="center"
        gap="xs"
      >
        <Heading as="h3" size="md">Top section</Heading>
        <Paragraph size="sm" color="muted">The separator carries this surface into the next section.</Paragraph>
      </Section>
      <SectionSeparator
        className={utilityClass || undefined}
        topSurface={config.topSurface}
        bottomSurface={config.bottomSurface}
        topInverse={config.topInverse}
        bottomInverse={config.bottomInverse}
        shape={config.shape}
        size={config.size}
        border={config.border}
        borderSize={config.borderSize}
        borderVariant={config.borderVariant}
        decorative={config.decorative}
      />
      <Section
        padding="md"
        surface={config.bottomSurface}
        inverse={config.bottomInverse}
        align="center"
        gap="xs"
      >
        <Heading as="h3" size="md">Bottom section</Heading>
        <Paragraph size="sm" color="muted">Surface and inverse choices can differ on each side.</Paragraph>
      </Section>
    </Stack>
  )
}

export function Controls({ config, setConfig }) {
  return (
    <Stack gap="lg">
      <Toolbar label="Top surface">
        <ToolbarGroup
          aria-label="Top surface"
          labelMode="selected"
          value={config.topSurface}
          onChange={(topSurface) => setConfig((current) => ({ ...current, topSurface }))}
          options={SURFACE_ITEMS}
        />
        <ToolbarToggle
          icon="invert_colors"
          label="Top inverse"
          pressed={config.topInverse}
          onChange={(topInverse) => setConfig((current) => ({ ...current, topInverse }))}
        />
      </Toolbar>
      <Toolbar label="Bottom surface">
        <ToolbarGroup
          aria-label="Bottom surface"
          labelMode="selected"
          value={config.bottomSurface}
          onChange={(bottomSurface) => setConfig((current) => ({ ...current, bottomSurface }))}
          options={SURFACE_ITEMS}
        />
        <ToolbarToggle
          icon="invert_colors"
          label="Bottom inverse"
          pressed={config.bottomInverse}
          onChange={(bottomInverse) => setConfig((current) => ({ ...current, bottomInverse }))}
        />
      </Toolbar>
      <Choice
        prop="shape"
        label="Shape"
        size="compact"
        hideIndicator
        columns={2}
        value={config.shape}
        onChange={(shape) => setConfig((current) => ({ ...current, shape }))}
        options={SHAPE_OPTIONS.map((value) => ({ label: optionLabel(value), value }))}
      />
      <ConfigSlider
        prop="size"
        label="Size"
        values={SIZE_OPTIONS}
        value={config.size}
        onChange={(size) => setConfig((current) => ({ ...current, size }))}
      />
      <Toggle
        prop="border"
        label="Border highlight"
        value={config.border}
        onChange={(border) => setConfig((current) => ({ ...current, border }))}
      />
      {config.border && (
        <>
          <ConfigSlider
            prop="borderSize"
            label="Border size"
            values={BORDER_SIZE_OPTIONS}
            value={config.borderSize}
            onChange={(borderSize) => setConfig((current) => ({ ...current, borderSize }))}
          />
          <Choice
            prop="borderVariant"
            label="Border variant"
            size="compact"
            hideIndicator
            columns={3}
            value={config.borderVariant}
            onChange={(borderVariant) => setConfig((current) => ({ ...current, borderVariant }))}
            options={BORDER_VARIANT_OPTIONS.map((value) => ({
              label: optionLabel(value),
              value,
              swatch: value === 'subtle'
                ? 'var(--semantic-color-border-subtle)'
                : value === 'strong'
                  ? 'var(--semantic-color-border-strong)'
                  : 'var(--semantic-color-text-accent)',
            }))}
          />
        </>
      )}
      <Toggle
        prop="decorative"
        label="Decorative"
        value={config.decorative}
        onChange={(decorative) => setConfig((current) => ({ ...current, decorative }))}
      />
    </Stack>
  )
}

export function Snippet({ config, utilityClass = '' }) {
  return <Code variant="block" wrapping copyCode>{buildSnippet(config, utilityClass)}</Code>
}
