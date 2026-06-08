import {
  Breadcrumb,
  DataTable,
  Heading,
  Paragraph,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'
import tokens from '../../../../../build/json/tokens.json'

function TokenCode({ children }) {
  return <code className="a1-web-token-code">{children}</code>
}

function RadiusSwatch({ value }) {
  return <span className="a1-web-radius-swatch" style={{ borderRadius: value }} aria-hidden="true" />
}

// ── Row data ──────────────────────────────────────────────────────────────────

const radiusColumns = [
  { key: 'swatch', label: 'Preview', width: 'var(--base-spacing-64)' },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'token', label: 'Token', sortable: true, sortAccessor: (r) => r.tokenText },
  { key: 'value', label: 'Value' },
]

const radiusRows = Object.entries(tokens.base.radius).map(([name, value]) => ({
  id: `radius-${name}`,
  swatch: <RadiusSwatch value={value} />,
  name,
  token: <TokenCode>{`--base-radius-${name}`}</TokenCode>,
  tokenText: `--base-radius-${name}`,
  value,
}))

// ── Component ─────────────────────────────────────────────────────────────────

export function ShapeFoundationPage({ onNavigate }) {
  return (
    <>
      <Section
        padding="sm"
        surface="panel"
        gradient="accent"
        gradientPosition="top-right"
        contentWidth="xl"
        gap="lg"
        aria-labelledby="shape-heading"
      >
        <Stack direction="column" gap="xs">
          <Breadcrumb
            items={[
              { href: '/', label: 'Home' },
              { href: '?page=foundations', label: 'Foundations' },
              { label: 'Shape' },
            ]}
          />
          <Heading as="h1" id="shape-heading" type="heading" size={{ xs: 'xl', md: 'xxl' }} textWrap="balance">
            Shape
          </Heading>
          <Paragraph size="sm" color="muted">
            Radius, container shape, control shape, and the geometric rules that make components feel consistent — from subtle rounding on controls to the expressive curves on cards and dialogs.
          </Paragraph>
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="xl" aria-labelledby="shape-token-heading">
        <Stack gap="lg">

          <DataTable
            columns={radiusColumns}
            rows={radiusRows}
            getRowId={(r) => r.id}
            size="compact"
            scrollable
            caption="Base radius tokens"
          />
        </Stack>
      </Section>
    </>
  )
}
