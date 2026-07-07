import {
  DataTable,
  Heading,
  Paragraph,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'
import tokens from '../../../../../build/json/tokens.json'
import { PageTitleArea } from '../PageTitleArea.jsx'
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
      <PageTitleArea
        headingId="elevation-heading"
        breadcrumbItems={getFoundationBreadcrumbItems('Elevation', onNavigate)}
        title="Elevation"
        description="Surface hierarchy, shadows, and the visual rules that separate content layers. Five shadow levels cover everything from subtle card lift to modal dialogs above the page."
      />

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
