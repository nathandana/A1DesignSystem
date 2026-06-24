import {
  Breadcrumb,
  DataTable,
  Heading,
  Paragraph,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'
import tokens from '../../../../../build/json/tokens.json'
import { getFoundationBreadcrumbItems } from './utils.js'

function TokenCode({ children }) {
  return <code className="a1-web-token-code">{children}</code>
}

function ShadowSwatch({ layers }) {
  const arr = Array.isArray(layers) ? layers : [layers]
  const boxShadow = arr.map((s) => `${s.offsetX} ${s.offsetY} ${s.blur} ${s.spread} ${s.color}`).join(', ')
  return <span className="a1-web-shadow-swatch" style={{ boxShadow }} aria-hidden="true" />
}

function shadowToCSS(layers) {
  const arr = Array.isArray(layers) ? layers : [layers]
  return arr.map((s) => `${s.offsetX} ${s.offsetY} ${s.blur} ${s.spread} ${s.color}`).join(', ')
}

// ── Row data ──────────────────────────────────────────────────────────────────

const shadowColumns = [
  { key: 'swatch', label: 'Preview', width: 'var(--base-spacing-64)' },
  { key: 'level', label: 'Level', sortable: true },
  { key: 'token', label: 'Token', sortable: true, sortAccessor: (r) => r.tokenText },
  { key: 'value', label: 'Value' },
]

const shadowRows = Object.entries(tokens.semantic.shadow).map(([level, layers]) => ({
  id: `shadow-${level}`,
  swatch: <ShadowSwatch layers={layers} />,
  level,
  token: <TokenCode>{`--semantic-shadow-${level}`}</TokenCode>,
  tokenText: `--semantic-shadow-${level}`,
  value: <TokenCode>{shadowToCSS(layers)}</TokenCode>,
}))

// ── Component ─────────────────────────────────────────────────────────────────

export function ElevationFoundationPage({ onNavigate }) {
  return (
    <>
      <Section
        padding="xs"
        contentWidth="xl"
        surface="panel"
        borderSize="sm"
        borderVariant="accent"
        borderSides="bottom"
      >
        <Stack direction="column" gap="xs">
          <Breadcrumb
            items={getFoundationBreadcrumbItems('Elevation', onNavigate)}
          />
          <Heading as="h1" id="elevation-heading" size={{ xs: 'lg', md: 'xxl' }}>
            Elevation
          </Heading>
          <Paragraph size="sm" color="muted">
            Surface hierarchy, shadows, and the visual rules that separate content layers. Five shadow levels cover everything from subtle card lift to modal dialogs above the page.
          </Paragraph>
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="xl" aria-labelledby="elevation-token-heading">
        <Stack gap="lg">

          <DataTable
            columns={shadowColumns}
            rows={shadowRows}
            getRowId={(r) => r.id}
            size="default"
            scrollable
            caption="Semantic shadow tokens"
          />
        </Stack>
      </Section>
    </>
  )
}
