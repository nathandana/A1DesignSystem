import {
  Breadcrumb,
  Heading,
  Paragraph,
  Section,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from '@gtivr4/a1-design-system-react'
import { useState } from 'react'

function TokenCode({ children }) {
  return <code className="a1-web-token-code">{children}</code>
}

function SimpleTable({ columns, rows }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontFamily: 'var(--component-paragraph-font-family)',
        fontSize: 'var(--semantic-font-size-body-sm)',
      }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  textAlign: 'start',
                  padding: 'var(--base-spacing-8) var(--base-spacing-12)',
                  borderBottom: '2px solid var(--semantic-color-border-default)',
                  color: 'var(--semantic-color-text-muted)',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.id ?? i}
              style={{ borderBottom: '1px solid var(--semantic-color-border-subtle)' }}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  style={{
                    padding: 'var(--base-spacing-8) var(--base-spacing-12)',
                    color: 'var(--semantic-color-text-default)',
                    verticalAlign: 'top',
                  }}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Row data ──────────────────────────────────────────────────────────────────

const viewportColumns = [
  { key: 'label', label: 'Label' },
  { key: 'range', label: 'Range' },
  { key: 'minToken', label: 'Min-width token' },
  { key: 'usage', label: 'Typical use' },
]

const viewportRows = [
  { id: 'xs', label: 'xs', range: '0 – 480 px',    minToken: '—',                                               usage: 'Mobile portrait, smallest phone widths' },
  { id: 'sm', label: 'sm', range: '481 – 640 px',   minToken: <TokenCode>--breakpoint-sm-min</TokenCode>,        usage: 'Large phone / small tablet' },
  { id: 'md', label: 'md', range: '641 – 1024 px',  minToken: <TokenCode>--breakpoint-md-min</TokenCode>,        usage: 'Tablet, small laptop' },
  { id: 'lg', label: 'lg', range: '1025 – 1440 px', minToken: <TokenCode>--breakpoint-lg-min</TokenCode>,        usage: 'Desktop, wide laptop' },
  { id: 'xl', label: 'xl', range: '1441 px+',        minToken: <TokenCode>--breakpoint-xl-min</TokenCode>,       usage: 'Large desktop, wide monitor' },
]

const containerColumns = [
  { key: 'label', label: 'Label' },
  { key: 'minWidth', label: 'min-width' },
  { key: 'usage', label: 'Typical use' },
  { key: 'example', label: 'CSS example' },
]

const containerRows = [
  {
    id: 'cq-sm',
    label: 'sm',
    minWidth: '320 px',
    usage: 'Smallest card / column; minor density adjustments',
    example: <TokenCode>{'@container a1-X (min-width: 320px)'}</TokenCode>,
  },
  {
    id: 'cq-md',
    label: 'md',
    minWidth: '480 px',
    usage: 'Medium card; layout shifts begin — used in Breadcrumb, ButtonContainer',
    example: <TokenCode>{'@container a1-X (min-width: 480px)'}</TokenCode>,
  },
  {
    id: 'cq-lg',
    label: 'lg',
    minWidth: '640 px',
    usage: 'Full-width or wide card; major layout changes e.g. icon shifts left of content',
    example: <TokenCode>{'@container a1-X (min-width: 640px)'}</TokenCode>,
  },
  {
    id: 'cq-xl',
    label: 'xl',
    minWidth: '960 px',
    usage: 'Very wide containers; data-dense components only',
    example: <TokenCode>{'@container a1-X (min-width: 960px)'}</TokenCode>,
  },
]

// ── Component ─────────────────────────────────────────────────────────────────

export function BreakpointsFoundationPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('viewport')

  return (
    <>
      <Section
        padding="sm"
        surface="panel"
        gradient="accent"
        gradientPosition="top-right"
        contentWidth="lg"
        gap="lg"
        aria-labelledby="responsive-heading"
      >
        <Stack direction="column" gap="xs">
          <Breadcrumb
            items={[
              { href: '/', label: 'Home' },
              { href: '?page=foundations', label: 'Foundations' },
              { label: 'Responsive' },
            ]}
          />
          <Heading as="h1" id="responsive-heading" type="display" size={{ xs: 'xl', md: 'xxl' }} textWrap="balance">
            Responsive
          </Heading>
          <Paragraph size="sm" color="muted">
            A1 uses two breakpoint systems. Viewport breakpoints (media queries) control page-level layout. Container query breakpoints control how individual components adapt to their own rendered width. Both use the same T-shirt-size labels — xs through xl — at values appropriate to each context.
          </Paragraph>
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="lg" aria-labelledby="responsive-heading">
        <Tabs value={activeTab} onChange={setActiveTab}>
          <TabList>
            <Tab value="viewport">Viewport breakpoints</Tab>
            <Tab value="container">Container queries</Tab>
          </TabList>

          <TabPanel value="viewport">
            <Stack gap="md">
              <Stack gap="xs">
                <Heading as="h2" size="md">Viewport breakpoints</Heading>
                <Paragraph color="muted" size="sm">
                  Used in media queries for page-level layout decisions. Defined as tokens in <TokenCode>system/tokens/breakpoint.json</TokenCode>. Components must be validated at all five breakpoints.
                </Paragraph>
              </Stack>
              <SimpleTable columns={viewportColumns} rows={viewportRows} />
            </Stack>
          </TabPanel>

          <TabPanel value="container">
            <Stack gap="md">
              <Stack gap="xs">
                <Heading as="h2" size="md">Container query breakpoints</Heading>
                <Paragraph color="muted" size="sm">
                  Used inside <TokenCode>@container</TokenCode> rules so components adapt to their own width, not the viewport. Values are hardcoded numbers — CSS custom properties cannot be used inside <TokenCode>@container</TokenCode> conditions. Always use these standard sizes for new components.
                </Paragraph>
              </Stack>
              <SimpleTable columns={containerColumns} rows={containerRows} />
              <Paragraph color="muted" size="sm">
                Set <TokenCode>{'container: a1-{component} / inline-size'}</TokenCode> on the component root. Use <TokenCode>min-width</TokenCode> for progressive enhancement and drive visual changes through CSS custom properties set inside the query block.
              </Paragraph>
            </Stack>
          </TabPanel>
        </Tabs>
      </Section>
    </>
  )
}
