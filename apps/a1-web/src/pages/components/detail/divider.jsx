import {
  Code,
  Divider,
  Paragraph,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { Choice, ConfigSlider } from './configKit.jsx'
import { Toggle } from './Toggle.jsx'

const ORIENTATION_OPTIONS = ['horizontal', 'vertical']
const RESPONSIVE_BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl']
const DIVIDER_VARIANT_OPTIONS = ['subtle', 'strong', 'accent']
const DIVIDER_LINE_STYLE_OPTIONS = ['solid', 'dashed', 'dotted']
const DIVIDER_SIZE_OPTIONS = ['xs', 'sm', 'md', 'lg']
const DIVIDER_SPACE_OPTIONS = ['none', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl']

function optionLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function orientationValue(config) {
  if (config.orientationMode !== 'responsive') return config.orientation

  return RESPONSIVE_BREAKPOINTS.reduce((result, breakpoint) => {
    result[breakpoint] = config.responsiveOrientation?.[breakpoint] ?? 'horizontal'
    return result
  }, {})
}

function propString(name, value, defaultValue) {
  if (value === undefined || value === null || value === defaultValue || value === '') return null
  return `${name}="${value}"`
}

function propBoolean(name, value, defaultValue) {
  if (value === defaultValue) return null
  return `${name}={${value ? 'true' : 'false'}}`
}

function propExpression(name, value) {
  if (value === undefined || value === null || value === '') return null
  return `${name}={${JSON.stringify(value)}}`
}

function buildDividerSnippet(config) {
  const orientation = orientationValue(config)
  const props = [
    config.orientationMode === 'responsive'
      ? propExpression('orientation', orientation)
      : propString('orientation', orientation, 'horizontal'),
    propString('variant', config.variant, 'subtle'),
    propString('lineStyle', config.lineStyle, 'solid'),
    propString('size', config.size, 'xs'),
    propString('space', config.space, 'sm'),
    propBoolean('decorative', config.decorative, true),
  ].filter(Boolean).join(' ')

  return `<Divider${props ? ` ${props}` : ''} />`
}

function PreviewContent() {
  return (
    <Stack gap="xs">
      <Paragraph size="sm">Design tokens</Paragraph>
      <Paragraph size="sm" color="muted">
        Shared foundations for color, type, spacing, motion, and shape.
      </Paragraph>
    </Stack>
  )
}

export function getDefaultConfig() {
  return {
    orientationMode: 'horizontal',
    orientation: 'horizontal',
    responsiveOrientation: {
      xs: 'horizontal',
      sm: 'horizontal',
      md: 'vertical',
      lg: 'vertical',
      xl: 'vertical',
    },
    variant: 'subtle',
    lineStyle: 'solid',
    size: 'xs',
    space: 'sm',
    decorative: true,
  }
}

export function Preview({ config }) {
  const orientation = orientationValue(config)
  const isVertical = config.orientationMode === 'vertical' || config.orientation === 'vertical'

  if (config.orientationMode === 'responsive' || isVertical) {
    return (
      <Stack direction={{ xs: 'column', md: 'row' }} gap="sm" align="stretch">
        <PreviewContent />
        <Divider
          orientation={orientation}
          variant={config.variant}
          lineStyle={config.lineStyle}
          size={config.size}
          space={config.space}
          decorative={config.decorative}
        />
        <PreviewContent />
      </Stack>
    )
  }

  return (
    <Stack gap="sm">
      <PreviewContent />
      <Divider
        orientation={orientation}
        variant={config.variant}
        lineStyle={config.lineStyle}
        size={config.size}
        space={config.space}
        decorative={config.decorative}
      />
      <PreviewContent />
    </Stack>
  )
}

export function Controls({ config, setConfig }) {
  return (
    <Stack gap="lg">
      <Choice prop="orientationMode"
        label="Orientation"
        size="compact"
        hideIndicator
        columns={2}
        value={config.orientationMode}
        onChange={(orientationMode) => setConfig((current) => ({
          ...current,
          orientationMode,
          orientation: orientationMode === 'responsive' ? current.orientation : orientationMode,
        }))}
        options={[
          { label: 'Horizontal', value: 'horizontal' },
          { label: 'Vertical', value: 'vertical' },
          { label: 'Responsive', value: 'responsive' },
        ]}
      />
      {config.orientationMode === 'responsive' && RESPONSIVE_BREAKPOINTS.map((breakpoint) => (
        <Choice
          key={breakpoint}
          label={`${breakpoint} orientation`}
          size="compact"
          hideIndicator
          columns={2}
          value={config.responsiveOrientation?.[breakpoint] ?? 'horizontal'}
          onChange={(orientation) => setConfig((current) => ({
            ...current,
            responsiveOrientation: {
              ...current.responsiveOrientation,
              [breakpoint]: orientation,
            },
          }))}
          options={ORIENTATION_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
        />
      ))}
      <Choice prop="variant"
        label="Variant"
        size="compact"
        hideIndicator
        columns={2}
        value={config.variant}
        onChange={(variant) => setConfig((current) => ({ ...current, variant }))}
        options={DIVIDER_VARIANT_OPTIONS.map((opt) => ({
          label: optionLabel(opt),
          value: opt,
          swatch: opt === 'subtle'
            ? 'var(--semantic-color-border-subtle)'
            : opt === 'strong'
              ? 'var(--semantic-color-border-strong)'
              : 'var(--semantic-color-text-accent)',
        }))}
      />
      <Choice prop="lineStyle"
        label="Line style"
        size="compact"
        hideIndicator
        columns={3}
        value={config.lineStyle}
        onChange={(lineStyle) => setConfig((current) => ({ ...current, lineStyle }))}
        options={DIVIDER_LINE_STYLE_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <ConfigSlider prop="size" label="Size" values={DIVIDER_SIZE_OPTIONS} value={config.size} onChange={(size) => setConfig((current) => ({ ...current, size }))} />
      <ConfigSlider prop="space" label="Space" values={DIVIDER_SPACE_OPTIONS} value={config.space} onChange={(space) => setConfig((current) => ({ ...current, space }))} />
      <Toggle prop="decorative" label="Decorative" value={config.decorative} onChange={(decorative) => setConfig((current) => ({ ...current, decorative }))} />
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildDividerSnippet(config)}</Code>
}
