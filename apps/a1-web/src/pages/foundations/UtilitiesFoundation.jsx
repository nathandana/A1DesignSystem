import { useState } from 'react'
import {
  Breadcrumb,
  Code,
  DataTable,
  Heading,
  Paragraph,
  Section,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from '@gtivr4/a1-design-system-react'
import tokens from '../../../../../build/json/tokens.json'
import {
  UTILITY_DEFINITIONS,
  getAcceptedUtilitiesForComponent,
  utilityTypeForCatalogComponent,
} from '../../editor/utilityRegistry.ts'
import { componentCategories } from '../components/data.js'
// The utility stylesheets, so the live demos below actually apply the classes.
import '../../../../../packages/react/src/utilities/spacing.css'
import '../../../../../packages/react/src/utilities/width.css'
import '../../../../../packages/react/src/utilities/sr-only.css'

function TokenCode({ children }) {
  return <code className="a1-web-token-code">{children}</code>
}

// The sizes the spacing utility ships (a subset of the base spacing scale).
const SPACING_SIZES = [0, 1, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 64, 96, 128]
const WIDTH_SIZES = ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl']
const MAX_WIDTH_SIZES = ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full', 'none']
const MIN_WIDTH_SIZES = ['0', '3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full']
const GAP_SIZES = ['0', 'xs', 'sm', 'md', 'lg']

const demoBar = {
  blockSize: 'var(--base-spacing-24)',
  background: 'var(--semantic-color-action-background)',
  borderRadius: 'var(--base-radius-sm)',
}
const demoTrack = {
  background: 'var(--semantic-color-surface-raised)',
  borderRadius: 'var(--base-radius-sm)',
}
const demoInner = {
  inlineSize: 'var(--base-spacing-40)',
  blockSize: 'var(--base-spacing-20)',
  background: 'var(--semantic-color-action-background)',
  borderRadius: 'var(--base-radius-sm)',
}

const scaleColumns = [
  { key: 'cls', label: 'Class' },
  { key: 'token', label: 'Token' },
  { key: 'value', label: 'Value' },
]

const utilityFamilyColumns = [
  { key: 'utility', label: 'Utility' },
  { key: 'classes', label: 'Classes' },
  { key: 'values', label: 'Values' },
  { key: 'common', label: 'Common picks' },
]

const utilityFamilyRows = Object.values(UTILITY_DEFINITIONS).map((utility) => ({
  id: utility.key,
  utility: utility.label,
  classes: <TokenCode>{`.${utility.classPrefix}-*`}</TokenCode>,
  values: utility.values.join(', '),
  common: utility.commonValues.join(', '),
}))

function supportCell(supported) {
  return supported ? 'Yes' : '—'
}

const utilityLookupColumns = [
  { key: 'component', label: 'Component' },
  { key: 'category', label: 'Category' },
  { key: 'componentType', label: 'Type' },
  ...Object.values(UTILITY_DEFINITIONS).map((utility) => ({ key: utility.key, label: utility.label })),
]

const utilityLookupRows = componentCategories.flatMap((category) => (
  category.components.map((component) => {
    const componentType = utilityTypeForCatalogComponent(component.id, component.title)
    const accepted = new Set(getAcceptedUtilitiesForComponent(componentType).map((utility) => utility.key))
    return {
      id: component.id,
      component: component.title,
      category: category.title,
      componentType: <TokenCode>{componentType}</TokenCode>,
      ...Object.fromEntries(Object.keys(UTILITY_DEFINITIONS).map((key) => [key, supportCell(accepted.has(key))])),
    }
  })
))

const spacingRows = SPACING_SIZES.map((n) => ({
  id: `sp-${n}`,
  cls: <TokenCode>{`.a1-p-${n}`}</TokenCode>,
  token: n === 0 ? '—' : <TokenCode>{`--base-spacing-${n}`}</TokenCode>,
  value: n === 0 ? '0' : tokens.base.spacing[String(n)],
}))

function widthValue(s) {
  if (s === '0') return '0'
  if (s === 'full') return '100%'
  if (s === 'none') return 'none'
  return tokens.base.contentWidth[s]
}

function widthToken(s) {
  if (s === '0' || s === 'full' || s === 'none') return '—'
  return <TokenCode>{`--base-content-width-${s}`}</TokenCode>
}

const maxWidthRows = MAX_WIDTH_SIZES.map((s) => ({
  id: `w-${s}`,
  cls: <TokenCode>{`.a1-max-w-${s}`}</TokenCode>,
  token: widthToken(s),
  value: widthValue(s),
}))

const minWidthRows = MIN_WIDTH_SIZES.map((s) => ({
  id: `min-w-${s}`,
  cls: <TokenCode>{`.a1-min-w-${s}`}</TokenCode>,
  token: widthToken(s),
  value: widthValue(s),
}))

const gapRows = GAP_SIZES.map((s) => ({
  id: `gap-${s}`,
  cls: <TokenCode>{`.a1-gap-${s}`}</TokenCode>,
  token: s === '0' ? '—' : <TokenCode>{`--semantic-spacing-gap-${s}`}</TokenCode>,
  value: s === '0' ? '0' : tokens.semantic.spacing.gap[s],
}))

export function UtilitiesFoundationPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('spacing')

  return (
    <>
      <Section
        padding="xs"
        contentWidth="2xl"
        surface="panel"
        borderSize="sm"
        borderVariant="accent"
        borderSides="bottom"
      >
        <Stack direction="column" gap="xs">
          <Breadcrumb
            items={[
              { href: '/', label: 'Home', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
              { href: '?page=foundations', label: 'Foundations', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('foundations') } },
              { label: 'Utilities' },
            ]}
          />
          <Heading as="h1" id="utilities-heading" size={{ xs: 'lg', md: 'xxl' }}>
            Utilities
          </Heading>
          <Paragraph size="sm" color="muted">
            Small, single-purpose class utilities for one-off adjustments — every value traces to a token.
            Reach for a layout component (<Code variant="inline">Stack</Code>, <Code variant="inline">Grid</Code>,
            {' '}<Code variant="inline">Section</Code>) first; use a utility only when no component covers the need.
            Import each stylesheet you use, e.g.{' '}
            <Code variant="inline">{"import '@gtivr4/a1-design-system-react/utilities/width.css'"}</Code>.
          </Paragraph>
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="2xl">
        <Tabs value={activeTab} onChange={setActiveTab} variant="line">
          <TabList>
            <Tab value="spacing">Spacing</Tab>
            <Tab value="gap">Gap</Tab>
            <Tab value="width">Width</Tab>
            <Tab value="screen-reader">Screen-reader</Tab>
            <Tab value="support">Component support</Tab>
          </TabList>

          <TabPanel value="spacing">
            <Stack gap="md" aria-labelledby="util-spacing-heading">
              <Heading as="h2" id="util-spacing-heading" size="lg">Spacing</Heading>
              <Paragraph size="sm" color="muted">
                Padding and margin on the base spacing scale. Pattern{' '}
                <Code variant="inline">{'a1-{p|m}{side?}-{size}'}</Code> — <Code variant="inline">p</Code> (padding) or{' '}
                <Code variant="inline">m</Code> (margin); optional side <Code variant="inline">t b l r</Code> or axis{' '}
                <Code variant="inline">x y</Code> (omit for all sides).
              </Paragraph>
              <Stack direction="row" gap="lg" wrap align="end">
                {[4, 8, 16, 24].map((n) => (
                  <Stack key={n} gap="xs" align="center">
                    <div style={demoTrack}>
                      <div className={`a1-p-${n}`} style={demoInner} />
                    </div>
                    <TokenCode>{`.a1-p-${n}`}</TokenCode>
                  </Stack>
                ))}
              </Stack>
              <DataTable
                columns={scaleColumns}
                rows={spacingRows}
                getRowId={(r) => r.id}
                size="compact"
                scrollable
                caption="Spacing utility sizes — padding shown; the same sizes apply to margin (a1-m-*) and each side / axis"
              />
            </Stack>
          </TabPanel>

          <TabPanel value="gap">
            <Stack gap="md" aria-labelledby="util-gap-heading">
              <Heading as="h2" id="util-gap-heading" size="lg">Gap</Heading>
              <Paragraph size="sm" color="muted">
                Gap utilities apply to flex or grid containers when a component-level gap prop is not available.
                Values map to semantic spacing roles rather than raw base spacing numbers.
              </Paragraph>
              <Stack direction="row" gap="lg" wrap align="end">
                {GAP_SIZES.map((s) => (
                  <Stack key={s} gap="xs" align="center">
                    <Stack direction="row" className={`a1-gap-${s}`} style={demoTrack}>
                      <div style={demoInner} />
                      <div style={demoInner} />
                    </Stack>
                    <TokenCode>{`.a1-gap-${s}`}</TokenCode>
                  </Stack>
                ))}
              </Stack>
              <DataTable
                columns={scaleColumns}
                rows={gapRows}
                getRowId={(r) => r.id}
                size="compact"
                scrollable
                caption="Gap utility sizes"
              />
            </Stack>
          </TabPanel>

          <TabPanel value="width">
            <Stack gap="md" aria-labelledby="util-width-heading">
              <Heading as="h2" id="util-width-heading" size="lg">Width</Heading>
              <Paragraph size="sm" color="muted">
                Constrain inline size. <Code variant="inline">a1-max-w-*</Code> caps the width;{' '}
                <Code variant="inline">a1-min-w-*</Code> sets a floor. The <Code variant="inline">3xs…2xl</Code> scale is the
                shared content-width utility scale; Section&rsquo;s <Code variant="inline">contentWidth</Code> uses the{' '}
                <Code variant="inline">xs…2xl</Code> subset. Width utilities also include{' '}
                <Code variant="inline">full</Code> / <Code variant="inline">none</Code> /{' '}
                <Code variant="inline">0</Code>. Logical <Code variant="inline">inline-size</Code> keeps it correct in RTL.
              </Paragraph>
              <Stack gap="sm">
                {WIDTH_SIZES.map((s) => (
                  <Stack key={s} gap="xs">
                    <TokenCode>{`.a1-max-w-${s}`}</TokenCode>
                    <div className={`a1-max-w-${s}`} style={demoBar} />
                  </Stack>
                ))}
              </Stack>
              <DataTable
                columns={scaleColumns}
                rows={maxWidthRows}
                getRowId={(r) => r.id}
                size="compact"
                scrollable
                caption="Max-width utility sizes"
              />
              <DataTable
                columns={scaleColumns}
                rows={minWidthRows}
                getRowId={(r) => r.id}
                size="compact"
                scrollable
                caption="Min-width utility sizes"
              />
            </Stack>
          </TabPanel>

          <TabPanel value="screen-reader">
            <Stack gap="md" aria-labelledby="util-sronly-heading">
              <Heading as="h2" id="util-sronly-heading" size="lg">Screen-reader only</Heading>
              <Paragraph size="sm" color="muted">
                <Code variant="inline">a1-sr-only</Code> hides content visually while keeping it available to assistive
                technology — for a label, heading, or status that sighted users already get from context.
              </Paragraph>
              <Paragraph size="sm">
                This sentence is preceded by visually-hidden text:{' '}
                <span className="a1-sr-only">Screen-reader only example — </span>only sighted users skip it.
              </Paragraph>
            </Stack>
          </TabPanel>

          <TabPanel value="support">
            <Stack gap="md" aria-labelledby="util-family-heading">
              <Heading as="h2" id="util-family-heading" size="lg">Component support</Heading>
              <Paragraph size="sm" color="muted">
                These are the utility families exposed by the editor registry. The configurator shows common picks as
                toolbar buttons and moves less-common values into an overflow menu.
              </Paragraph>
              <DataTable
                columns={utilityFamilyColumns}
                rows={utilityFamilyRows}
                getRowId={(r) => r.id}
                size="compact"
                scrollable
                caption="Every utility family exposed by the editor utility registry"
              />
              <DataTable
                columns={utilityLookupColumns}
                rows={utilityLookupRows}
                getRowId={(r) => r.id}
                size="compact"
                scrollable
                caption="Component utility support lookup"
              />
            </Stack>
          </TabPanel>
        </Tabs>
      </Section>
    </>
  )
}
