import {
  Button,
  ButtonContainer,
  Card,
  DataTable,
  Divider,
  Grid,
  Heading,
  Link,
  List,
  ListItem,
  MessageBadge,
  Paragraph,
  Section,
  Stack,
  SegmentedControl,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from '@gtivr4/a1-design-system-react'
import { useEffect, useState } from 'react'
import { PageBreadcrumb } from './PageBreadcrumb.jsx'
import tokens from '../../../../build/json/tokens.json'

const themeOptions = [
  { value: 'a1Light', label: 'Default' },
  { value: 'a1Heritage', label: 'Heritage' },
  { value: 'a1Accessible', label: 'Accessible' },
]

const colorModeOptions = [
  { value: 'light', icon: 'light_mode', ariaLabel: 'Light mode' },
  { value: 'dark', icon: 'dark_mode', ariaLabel: 'Dark mode' },
  { value: 'system', icon: 'desktop_windows', ariaLabel: 'System mode' },
]

const semanticColorColumns = [
  { key: 'swatch', label: 'Applied', width: 'var(--base-spacing-96)' },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'token', label: 'Token', sortable: true, sortAccessor: (row) => row.tokenText },
  { key: 'value', label: 'Current value', sortable: true },
]

const componentColorColumns = [
  { key: 'swatch', label: 'Applied', width: 'var(--base-spacing-96)' },
  { key: 'component', label: 'Component', sortable: true },
  { key: 'token', label: 'Token', sortable: true, sortAccessor: (row) => row.tokenText },
  { key: 'value', label: 'Current value', sortable: true },
]

function toKebab(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase()
}

function toCssVar(path) {
  return `--${path.map(toKebab).join('-')}`
}

function isColorValue(value) {
  return typeof value === 'string' && /^(#|rgb|hsl)/i.test(value)
}

function flattenColorTokens(value, path = []) {
  if (isColorValue(value)) {
    return [{
      path,
      name: path.join('.'),
      cssVar: toCssVar(path),
      value,
    }]
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) return []

  return Object.entries(value).flatMap(([key, nextValue]) =>
    flattenColorTokens(nextValue, [...path, key])
  )
}

function ColorSwatch({ cssVar }) {
  return (
    <span
      className="a1-web-color-swatch"
      style={{ '--a1-web-color-swatch': `var(${cssVar})` }}
      aria-hidden="true"
    />
  )
}

function TokenCode({ children }) {
  return <code className="a1-web-token-code">{children}</code>
}

function ColorTokenCard({ token }) {
  return (
      <Stack direction="column" gap="xs">
        <ColorSwatch cssVar={token.cssVar} />
        <Stack direction="column" gap="xs">
          <Paragraph size="xs" color="muted" align="center">
            {token.path[token.path.length - 1]}
          </Paragraph>
          {/* <TokenCode>{token.cssVar}</TokenCode> */}
          {/* <Paragraph size="sm" color="muted">
            {token.value}
          </Paragraph> */}
        </Stack>
      </Stack>
  )
}

function useResolvedColorRows(rows, theme, colorMode) {
  const [resolvedRows, setResolvedRows] = useState(rows)

  useEffect(() => {
    if (typeof window === 'undefined') {
      setResolvedRows(rows)
      return
    }

    const frame = window.requestAnimationFrame(() => {
      const styles = window.getComputedStyle(document.documentElement)
      setResolvedRows(rows.map((row) => ({
        ...row,
        value: styles.getPropertyValue(row.cssVar).trim() || row.fallbackValue,
      })))
    })

    return () => window.cancelAnimationFrame(frame)
  }, [rows, theme, colorMode])

  return resolvedRows
}

const primitiveColorRamps = Object.entries(tokens.base.color).map(([name, ramp]) => ({
  name,
  tokens: flattenColorTokens(ramp, ['base', 'color', name]).sort((a, b) =>
    Number(a.path[a.path.length - 1]) - Number(b.path[b.path.length - 1])
  ),
}))

const semanticColorRows = flattenColorTokens(tokens.semantic.color, ['semantic', 'color'])
  .map((token) => ({
    id: token.name,
    swatch: <ColorSwatch cssVar={token.cssVar} />,
    role: token.path.slice(2).join(' / '),
    token: <TokenCode>{token.cssVar}</TokenCode>,
    tokenText: token.cssVar,
    cssVar: token.cssVar,
    fallbackValue: token.value,
    value: token.value,
  }))

const componentColorRows = flattenColorTokens(tokens.component, ['component'])
  .map((token) => ({
    id: token.name,
    swatch: <ColorSwatch cssVar={token.cssVar} />,
    component: token.path[1],
    token: <TokenCode>{token.cssVar}</TokenCode>,
    tokenText: token.cssVar,
    cssVar: token.cssVar,
    fallbackValue: token.value,
    value: token.value,
  }))

export const foundations = [
  {
    id: 'foundation-color',
    title: 'Color',
    icon: 'palette',
    body: 'Color ramps, semantic color roles, status colors, surfaces, borders, action colors, inverse mode, and dark-mode behavior.',
    points: ['Base color ramps', 'Semantic text and surface roles', 'Status and action colors'],
  },
  {
    id: 'foundation-size',
    title: 'Size',
    icon: 'straighten',
    body: 'Spacing, dimensions, density, component sizing, icon sizing, touch targets, layout rhythm, and responsive scale decisions.',
    points: ['Spacing scale', 'Component dimensions', 'Responsive density'],
  },
  {
    id: 'foundation-type-scale',
    title: 'Type scale',
    icon: 'text_fields',
    body: 'Body, heading, and display type scales for readable interfaces across compact tools, editorial pages, and high-impact hero moments.',
    points: ['Body sizes', 'Heading sizes', 'Display sizes'],
  },
  {
    id: 'foundation-shape',
    title: 'Shape',
    icon: 'rounded_corner',
    body: 'Radius, container shape, control shape, card shape, dialog shape, and theme-specific geometry such as the heritage square profile.',
    points: ['Radius scale', 'Control corners', 'Container shape'],
  },
  {
    id: 'foundation-motion',
    title: 'Motion',
    icon: 'animation',
    body: 'Motion duration, easing, transition timing, and reduced-motion expectations for interactive components.',
    points: ['Duration scale', 'Easing roles', 'Reduced-motion behavior'],
  },
  {
    id: 'foundation-elevation',
    title: 'Elevation',
    icon: 'layers',
    body: 'Surface hierarchy, shadows, raised surfaces, panels, dialogs, menus, and the visual rules that separate content layers.',
    points: ['Surface hierarchy', 'Shadow tokens', 'Overlay depth'],
  },
  {
    id: 'foundation-iconography',
    title: 'Iconography',
    icon: 'interests',
    body: 'Material Symbols usage, icon sizing, optical size, weight, fill, and the rules for passing icon names into components.',
    points: ['Material Symbols', 'Icon name props', 'Optical sizing'],
  },
  {
    id: 'foundation-accessibility',
    title: 'Accessibility',
    icon: 'accessibility_new',
    body: 'Contrast, focus states, semantic markup, keyboard interaction, screen reader labels, and accessible component defaults.',
    points: ['Focus visibility', 'Semantic structure', 'Keyboard support'],
  },
]

export function Foundations({ onNavigate }) {
  return (
    <>
      <Section
        padding="sm"
        surface="panel"
        gradient="accent"
        gradientPosition="top-right"
        contentWidth="lg"
        gap="lg"
        aria-labelledby="foundations-heading"
      >
        <Stack direction="column" gap="sm">          <PageBreadcrumb
            items={[
              { href: '/', label: 'Home' },
              { label: 'Foundations' },
            ]}
          />          <MessageBadge icon="layers">Foundations</MessageBadge>
          <Heading
            as="h1"
            id="foundations-heading"
            type="display"
            size={{ xs: 'xl', md: 'xxl' }}
            textWrap="balance"
          >
            The core decisions behind every A1 component.
          </Heading>
          <Paragraph size={{ xs: 'md', md: 'lg', lg: 'xl' }} color="muted">
            Foundations define the shared language for color, size, type, shape, motion, elevation, icons, and accessibility across every package.
          </Paragraph>
        </Stack>
      </Section>

      <Section padding="lg" contentWidth="lg" aria-labelledby="foundation-list-heading">
        <Stack gap="lg">
          <Stack gap="sm">
            <MessageBadge icon="category">Core foundations</MessageBadge>
            <Heading as="h2" id="foundation-list-heading" type="display" size={{ xs: 'lg', md: 'xl' }}>
              Start with the primitives.
            </Heading>
            <Paragraph size="lg" color="muted" className="a1-web-section-body">
              Each foundation gets its own page. For now, the child pages are placeholders ready for deeper documentation.
            </Paragraph>
          </Stack>

          <Grid columns={{ xs: 1, sm: 2, lg: 4 }} gap="md">
            {foundations.map((foundation) => (
              <Card
                key={foundation.id}
                variant="navigation"
                href={`/?page=${foundation.id}`}
                icon={foundation.icon}
                onClick={(event) => {
                  event.preventDefault()
                  onNavigate?.(foundation.id)
                }}
              >
                <Stack direction="column" gap="sm">
                  <Heading as="h3" size="md">
                    {foundation.title}
                  </Heading>
                  <Paragraph size="sm" color="muted">
                    {foundation.body}
                  </Paragraph>
                  <List icon="check" size="sm" color="muted">
                    {foundation.points.map((point) => (
                      <ListItem key={point}>{point}</ListItem>
                    ))}
                  </List>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Section>
    </>
  )
}

function ColorFoundationPage({
  onNavigate,
  theme,
  onThemeChange,
  colorMode,
  onColorModeChange,
}) {
  const [activeTab, setActiveTab] = useState('primitives')
  const resolvedSemanticColorRows = useResolvedColorRows(semanticColorRows, theme, colorMode)
  const resolvedComponentColorRows = useResolvedColorRows(componentColorRows, theme, colorMode)

  return (
    <>
      <Section
        padding="sm"
        surface="panel"
        gradient="accent"
        gradientPosition="top-right"
        contentWidth="lg"
        gap="lg"
        aria-labelledby="color-foundation-heading"
      >
        <Stack direction="column" gap="sm">
          <PageBreadcrumb
            items={[
              { href: '/', label: 'Home' },
              { href: '?page=foundations', label: 'Foundations' },
              { label: 'Color' },
            ]}
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} gap="xs" align="center" justify="between">
            <Heading
              as="h1"
              id="color-foundation-heading"
              type="display"
              size={{ xs: 'xl', md: 'xxl' }}
              textWrap="balance"
            >
              Color
            </Heading>

            <Stack direction={{ xs: 'column', sm: 'row' }} gap="sm">
              <SegmentedControl
                options={themeOptions}
                value={theme}
                onChange={onThemeChange}
                aria-label="Theme"
                fullWidth
              />
              <SegmentedControl
                options={colorModeOptions}
                value={colorMode}
                onChange={onColorModeChange}
                aria-label="Mode"
                fullWidth
              />
            </Stack>
          </Stack>

          <Paragraph size="sm" color="muted">
            Inspect the generated color system, switch the active theme and mode, and see how token values are applied across primitives, semantic roles, and component-specific color tokens.
          </Paragraph>
        </Stack>

      </Section>

      <Section padding="lg" contentWidth="lg" aria-labelledby="color-token-browser-heading">
        <Stack gap="lg">
          <Stack direction="column" gap="sm">
            <MessageBadge icon="data_object">Token browser</MessageBadge>
            <Heading as="h2" id="color-token-browser-heading" type="display" size={{ xs: 'lg', md: 'xl' }}>
              Browse color by token layer.
            </Heading>
            <Paragraph size="lg" color="muted" className="a1-web-section-body">
              Primitive tokens define the raw ramps. Semantic tokens assign purpose. Component tokens apply color to specific interface parts.
            </Paragraph>
          </Stack>

          <Tabs value={activeTab} onChange={setActiveTab} variant="folder">
            <TabList>
              <Tab value="primitives" icon="gradient">Primitives</Tab>
              <Tab value="semantic" icon="category">Semantic</Tab>
              <Tab value="component" icon="widgets">Component</Tab>
            </TabList>

            <TabPanel value="primitives">
              <Stack gap="lg">
                {primitiveColorRamps.map((ramp) => (
                  <Section
                    padding="none"
                    gap="md"
                    aria-labelledby={`color-ramp-${ramp.name}`}
                  >
                    <Stack direction="column" gap="xs">
                      <Heading as="h3" id={`color-ramp-${ramp.name}`} size="lg">
                        {ramp.name}
                      </Heading>
                      <Paragraph size="md" color="muted">
                        Base ramp tokens applied directly as swatch fills.
                      </Paragraph>
                    </Stack>
                    <Stack direction="row" gap="sm" wrap>
                      {ramp.tokens.map((token) => (
                        <ColorTokenCard key={token.name} token={token} />
                      ))}
                    </Stack>
                  </Section>
                ))}
              </Stack>
            </TabPanel>

            <TabPanel value="semantic">
              <DataTable
                columns={semanticColorColumns}
                rows={resolvedSemanticColorRows}
                getRowId={(row) => row.id}
                density="auto"
                scrollable
                caption="Semantic color tokens"
              />
            </TabPanel>

            <TabPanel value="component">
              <DataTable
                columns={componentColorColumns}
                rows={resolvedComponentColorRows}
                getRowId={(row) => row.id}
                density="auto"
                scrollable
                caption="Component color tokens"
              />
            </TabPanel>
          </Tabs>

          <ButtonContainer>
            <Button icon="arrow_back" variant="secondary" onClick={() => onNavigate?.('foundations')}>
              Back to foundations
            </Button>
          </ButtonContainer>
        </Stack>
      </Section>
    </>
  )
}

export function FoundationDetail({
  foundation,
  onNavigate,
  theme,
  onThemeChange,
  colorMode,
  onColorModeChange,
}) {
  if (foundation?.id === 'foundation-color') {
    return (
      <ColorFoundationPage
        onNavigate={onNavigate}
        theme={theme}
        onThemeChange={onThemeChange}
        colorMode={colorMode}
        onColorModeChange={onColorModeChange}
      />
    )
  }

  const title = foundation?.title ?? 'Foundation'

  return (
    <Section
      padding="lg"
      contentWidth="md"
      alignment="center"
      gap="lg"
      aria-labelledby="foundation-detail-heading"
    >
      <Stack gap="sm">
        <PageBreadcrumb
          items={[
            { href: '/', label: 'Home' },
            { href: '?page=foundations', label: 'Foundations' },
            { label: title },
          ]}
        />
        <MessageBadge icon={foundation?.icon ?? 'layers'}>{title}</MessageBadge>
        <Heading
          as="h1"
          id="foundation-detail-heading"
          type="display"
          size={{ xs: 'xl', md: 'xxl' }}
          align="center"
        >
          {title} documentation is coming soon.
        </Heading>
        <Paragraph size="lg" color="muted" align="center">
          This child page is ready for the full foundation guide. It will cover guidance, tokens, examples, usage rules, and accessibility notes.
        </Paragraph>
      </Stack>

      <ButtonContainer align="center">
        <Button icon="arrow_back" variant="secondary" onClick={() => onNavigate?.('foundations')}>
          Back to foundations
        </Button>
      </ButtonContainer>
    </Section>
  )
}
