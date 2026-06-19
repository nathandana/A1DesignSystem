import {
  Banner,
  Breadcrumb,
  Heading,
  List,
  ListItem,
  Paragraph,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'

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
              <th key={col.key} style={{
                textAlign: 'start',
                padding: 'var(--base-spacing-8) var(--base-spacing-12)',
                borderBottom: '2px solid var(--semantic-color-border-default)',
                color: 'var(--semantic-color-text-muted)',
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id ?? i} style={{ borderBottom: '1px solid var(--semantic-color-border-subtle)' }}>
              {columns.map((col) => (
                <td key={col.key} style={{
                  padding: 'var(--base-spacing-8) var(--base-spacing-12)',
                  color: 'var(--semantic-color-text-default)',
                  verticalAlign: 'top',
                }}>{row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const scaleColumns = [
  { key: 'layer', label: 'Layer' },
  { key: 'token', label: 'Token (target)' },
  { key: 'value', label: 'Value' },
  { key: 'used', label: 'Used by' },
]
const scaleRows = [
  { id: 'content', layer: 'Content', token: '—', value: 'auto / 0', used: 'In-flow content; component-local -1 / 0 / 1 for internal stacking only' },
  { id: 'sticky', layer: 'Sticky', token: <TokenCode>--semantic-z-sticky</TokenCode>, value: '100', used: 'TopHeader, PageLayout sticky regions' },
  { id: 'pinned', layer: 'Pinned chrome', token: <TokenCode>--semantic-z-pinned</TokenCode>, value: '200', used: 'SideNav overlay, BottomDrawer, BottomSheet, PageNav, StickyActions' },
  { id: 'popover', layer: 'Popover', token: <TokenCode>--semantic-z-popover</TokenCode>, value: '1000', used: 'Menu, Autocomplete, Select, ContextMenu, tooltips' },
  { id: 'modal', layer: 'Modal (non-top-layer)', token: <TokenCode>--semantic-z-modal</TokenCode>, value: '1100', used: 'Any modal not using the native top layer' },
  { id: 'toast', layer: 'Toast', token: <TokenCode>--semantic-z-toast</TokenCode>, value: '1200', used: 'Snackbar / toasts, above non-top-layer modals' },
]

const auditColumns = [
  { key: 'component', label: 'Component' },
  { key: 'current', label: 'Current' },
  { key: 'action', label: 'Layer / action' },
]
const auditRows = [
  { id: 'dialog', component: 'Dialog', current: 'native top layer', action: 'Correct' },
  { id: 'menu', component: 'Menu, Autocomplete', current: '1000, <body> portal', action: 'Popover — behind a top-layer Dialog → top layer / portal into dialog (Autocomplete fixed)' },
  { id: 'ctx', component: 'ContextMenu', current: 'hardcoded 1000', action: 'Popover — replace with the token' },
  { id: 'snackbar', component: 'Snackbar', current: '1100', action: 'Toast — behind a top-layer Dialog → top layer' },
  { id: 'header', component: 'TopHeader / PageLayout', current: '100', action: 'Sticky — ok' },
  { id: 'pinned', component: 'SideNav / BottomDrawer / BottomSheet / PageNav / StickyActions', current: '150–200', action: 'Pinned — align onto 200' },
]

export function ZIndexFoundationPage() {
  return (
    <>
      <Section
        padding="sm"
        surface="panel"
        gradient="accent"
        gradientPosition="top-right"
        contentWidth="xl"
        gap="lg"
        aria-labelledby="zindex-heading"
      >
        <Stack direction="column" gap="xs">
          <Breadcrumb
            items={[
              { href: '/', label: 'Home' },
              { href: '?page=foundations', label: 'Foundations' },
              { label: 'Z-index' },
            ]}
          />
          <Heading as="h1" id="zindex-heading" type="heading" size={{ xs: 'xl', md: 'xxl' }} textWrap="balance">
            Z-index &amp; layering
          </Heading>
          <Paragraph size="sm" color="muted">
            A1 stacks overlays with two distinct mechanisms — the browser top layer and a numeric z-index scale. Mixing them is the usual cause of “my menu is behind the dialog” bugs, so decide which layer an element belongs to before assigning any z-index.
          </Paragraph>
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="xl" gap="lg">
        <Stack gap="md">
          <Heading as="h2" size="md">1. The browser top layer (modals)</Heading>
          <Paragraph color="muted" size="sm">
            <TokenCode>Dialog</TokenCode> renders a native <TokenCode>&lt;dialog&gt;</TokenCode> opened with <TokenCode>showModal()</TokenCode>, which the browser paints in the <strong>top layer</strong> — above the entire normal stacking context, regardless of any z-index. No z-index, however large, can place a normal-layer element above an open modal dialog.
          </Paragraph>
          <Banner status="info" variant="inline">
            Anything that must appear <strong>above a modal</strong> — a menu opened inside a dialog, a confirmation snackbar, a tooltip — must also live in the top layer (the Popover API, or rendered inside the open <TokenCode>&lt;dialog&gt;</TokenCode>), not merely carry a higher number. Within the top layer, stacking is by open order (last opened wins).
          </Banner>
        </Stack>

        <Stack gap="md">
          <Heading as="h2" size="md">2. The z-index scale (everything else)</Heading>
          <Paragraph color="muted" size="sm">
            For elements in the normal layer — sticky chrome, pinned furniture, non-modal popovers, toasts that never overlap a modal — use this single ordered scale. Never invent values between the bands. The tokens are the target; if one doesn’t exist yet, add it to <TokenCode>system/tokens/</TokenCode> (semantic tier).
          </Paragraph>
          <SimpleTable columns={scaleColumns} rows={scaleRows} />
        </Stack>

        <Stack gap="md">
          <Heading as="h2" size="md">Current state (audit)</Heading>
          <SimpleTable columns={auditColumns} rows={auditRows} />
        </Stack>

        <Stack gap="md">
          <Heading as="h2" size="md">Rules</Heading>
          <List as="ol">
            <ListItem><strong>One scale.</strong> Every normal-layer z-index references a layer token; no ad-hoc numbers between bands.</ListItem>
            <ListItem><strong>Top layer for anything that must beat a modal.</strong> Menus, context menus, tooltips, and toasts that can appear over a Dialog use the Popover API or render inside the dialog — z-index alone will not work.</ListItem>
            <ListItem><strong>Component-local stacking</strong> (-1 / 0 / 1) stays inside the component and never participates in the global scale.</ListItem>
          </List>
        </Stack>
      </Section>
    </>
  )
}
