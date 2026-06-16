import {
  ChoiceGroup,
  Code,
  Heading,
  Paragraph,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'

export const bareDisplay = true

const AS_OPTIONS = ['section', 'div', 'main', 'header', 'footer']
const PADDING_OPTIONS = ['none', 'xs', 'sm', 'md', 'lg']
const SURFACE_OPTIONS = ['', 'page', 'panel', 'raised']
const GAP_OPTIONS = ['', 'xs', 'sm', 'md', 'lg', 'xl']
const CONTENT_WIDTH_OPTIONS = ['', 'xs', 'sm', 'md', 'lg', 'xl', '2xl']
const HEIGHT_OPTIONS = ['', 'hero', 'screen']
const ALIGN_OPTIONS = ['', 'left', 'center', 'right']
const GRADIENT_OPTIONS = ['', 'accent', 'highlight', 'info', 'success', 'warn']
const BORDER_SIZE_OPTIONS = ['', 'xs', 'sm', 'md', 'lg']
const BORDER_STYLE_OPTIONS = ['solid', 'dashed', 'dotted']
const BORDER_VARIANT_OPTIONS = ['subtle', 'strong', 'accent']
const RADIUS_OPTIONS = ['none', 'sm', 'md', 'lg', 'xl']
const NONE_ICON = 'layers_clear'
const GRADIENT_POSITION_OPTIONS = [
  'top-left',
  'top',
  'top-right',
  'left',
  'center',
  'right',
  'bottom-left',
  'bottom',
  'bottom-right',
]

function optionLabel(value) {
  if (!value) return 'None'
  return value.charAt(0).toUpperCase() + value.slice(1).replaceAll('-', ' ')
}

function optionWithNoneIcon(value, noneValue = '') {
  if (value === noneValue) {
    return { label: optionLabel(value), value, icon: NONE_ICON, iconOnly: true }
  }

  return { label: optionLabel(value), value }
}

const ALIGN_OPTION_ITEMS = ALIGN_OPTIONS.map((value) => {
  const icons = {
    '': NONE_ICON,
    left: 'align_horizontal_left',
    center: 'align_horizontal_center',
    right: 'align_horizontal_right',
  }

  return { label: optionLabel(value), value, icon: icons[value], iconOnly: true }
})

const GRADIENT_POSITION_OPTION_ITEMS = GRADIENT_POSITION_OPTIONS.map((value) => {
  const icons = {
    center: 'center_focus_strong',
    top: 'north',
    'top-right': 'north_east',
    right: 'east',
    'bottom-right': 'south_east',
    bottom: 'south',
    'bottom-left': 'south_west',
    left: 'west',
    'top-left': 'north_west',
  }

  return { label: optionLabel(value), value, icon: icons[value], iconOnly: true }
})

function escapeJsxString(value) {
  return String(value ?? '').replaceAll('"', '&quot;')
}

function propString(name, value, defaultValue) {
  if (value === undefined || value === null || value === defaultValue || value === '') return null
  return `${name}="${escapeJsxString(value)}"`
}

function propBoolean(name, value, defaultValue) {
  if (value === defaultValue) return null
  return value ? name : `${name}={false}`
}

function buildSectionSnippet(config) {
  const props = [
    propString('as', config.as, 'section'),
    propString('padding', config.padding, 'md'),
    propString('surface', config.surface, ''),
    propString('gap', config.gap, ''),
    propString('contentWidth', config.contentWidth, ''),
    propString('height', config.height, ''),
    propString('align', config.align, ''),
    propString('gradient', config.gradient, ''),
    config.gradient ? propString('gradientPosition', config.gradientPosition, 'center') : null,
    propString('borderSize', config.borderSize, ''),
    propString('borderStyle', config.borderStyle, 'solid'),
    propString('borderVariant', config.borderVariant, 'subtle'),
    propString('radius', config.radius, 'none'),
    propBoolean('inverse', config.inverse, false),
  ].filter(Boolean).join('\n  ')

  return `<Section${props ? `\n  ${props}\n` : ' '}/>`
}

export function getDefaultConfig() {
  return {
    as: 'section',
    padding: 'md',
    surface: 'panel',
    gap: 'sm',
    contentWidth: 'md',
    height: '',
    align: '',
    gradient: '',
    gradientPosition: 'center',
    borderSize: '',
    borderStyle: 'solid',
    borderVariant: 'subtle',
    radius: 'none',
    inverse: false,
  }
}

export function Preview({ config }) {
  return (
    <Section
      as={config.as}
      padding={config.padding}
      surface={config.surface || undefined}
      gap={config.gap || undefined}
      contentWidth={config.contentWidth || undefined}
      height={config.height || undefined}
      align={config.align || undefined}
      gradient={config.gradient || undefined}
      gradientPosition={config.gradient ? config.gradientPosition : undefined}
      borderSize={config.borderSize || undefined}
      borderStyle={config.borderStyle}
      borderVariant={config.borderVariant}
      radius={config.radius}
      inverse={config.inverse}
    >
      <Heading as="h2" size="xl">
        Build with the system
      </Heading>
      <Paragraph>
        Sections create full-width content bands with tokenized surfaces, spacing, alignment, and optional responsive content width.
      </Paragraph>
    </Section>
  )
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))

  return (
    <Stack gap="lg">
      <ChoiceGroup
        label="Element"
        size="compact"
        hideIndicator
        columns={3}
        value={config.as}
        onChange={(as) => set({ as })}
        options={AS_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <ChoiceGroup
        label="Surface"
        size="compact"
        hideIndicator
        columns={3}
        value={config.surface}
        onChange={(surface) => set({ surface })}
        options={SURFACE_OPTIONS.map((opt) => optionWithNoneIcon(opt))}
      />
      <ChoiceGroup
        label="Padding"
        size="compact"
        hideIndicator
        columns={5}
        value={config.padding}
        onChange={(padding) => set({ padding })}
        options={PADDING_OPTIONS.map((opt) => optionWithNoneIcon(opt, 'none'))}
      />
      <ChoiceGroup
        label="Gap"
        size="compact"
        hideIndicator
        columns={4}
        value={config.gap}
        onChange={(gap) => set({ gap })}
        options={GAP_OPTIONS.map((opt) => optionWithNoneIcon(opt))}
      />
      <ChoiceGroup
        label="Content width"
        size="compact"
        hideIndicator
        columns={4}
        value={config.contentWidth}
        onChange={(contentWidth) => set({ contentWidth })}
        options={CONTENT_WIDTH_OPTIONS.map((opt) => optionWithNoneIcon(opt))}
      />
      <ChoiceGroup
        label="Align"
        size="compact"
        hideIndicator
        iconOnly
        columns={4}
        value={config.align}
        onChange={(align) => set({ align })}
        options={ALIGN_OPTION_ITEMS}
      />
      <ChoiceGroup
        label="Height"
        size="compact"
        hideIndicator
        columns={3}
        value={config.height}
        onChange={(height) => set({ height })}
        options={HEIGHT_OPTIONS.map((opt) => optionWithNoneIcon(opt))}
      />
      <ChoiceGroup
        label="Gradient"
        size="compact"
        hideIndicator
        columns={3}
        value={config.gradient}
        onChange={(gradient) => set({ gradient })}
        options={GRADIENT_OPTIONS.map((opt) => optionWithNoneIcon(opt))}
      />
      {config.gradient && (
        <ChoiceGroup
          label="Gradient position"
          size="compact"
          hideIndicator
          iconOnly
          columns={3}
          value={config.gradientPosition}
          onChange={(gradientPosition) => set({ gradientPosition })}
          options={GRADIENT_POSITION_OPTION_ITEMS}
        />
      )}
      <ChoiceGroup
        label="Border size"
        size="compact"
        hideIndicator
        columns={5}
        value={config.borderSize}
        onChange={(borderSize) => set({ borderSize })}
        options={BORDER_SIZE_OPTIONS.map((opt) => optionWithNoneIcon(opt))}
      />
      {config.borderSize && (
        <>
          <ChoiceGroup
            label="Border style"
            size="compact"
            hideIndicator
            columns={3}
            value={config.borderStyle}
            onChange={(borderStyle) => set({ borderStyle })}
            options={BORDER_STYLE_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
          />
          <ChoiceGroup
            label="Border variant"
            size="compact"
            hideIndicator
            columns={3}
            value={config.borderVariant}
            onChange={(borderVariant) => set({ borderVariant })}
            options={BORDER_VARIANT_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
          />
        </>
      )}
      <ChoiceGroup
        label="Radius"
        size="compact"
        hideIndicator
        columns={5}
        value={config.radius}
        onChange={(radius) => set({ radius })}
        options={RADIUS_OPTIONS.map((opt) => optionWithNoneIcon(opt, 'none'))}
      />
      <ChoiceGroup
        label="Inverse"
        size="compact"
        hideIndicator
        columns={4}
        value={config.inverse ? 'on' : 'off'}
        onChange={(value) => set({ inverse: value === 'on' })}
        options={[
          { label: 'Off', value: 'off' },
          { label: 'On', value: 'on' },
        ]}
      />
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildSectionSnippet(config)}</Code>
}
