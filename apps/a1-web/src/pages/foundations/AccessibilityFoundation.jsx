import {
  Breadcrumb,
  Card,
  DataTable,
  Grid,
  Heading,
  Icon,
  List,
  ListItem,
  MessageBadge,
  Paragraph,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'
import tokens from '../../../../../build/json/tokens.json'

function TokenCode({ children }) {
  return <code className="a1-web-token-code">{children}</code>
}

const focusColumns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'token', label: 'Token', sortable: true, sortAccessor: (r) => r.tokenText },
  { key: 'value', label: 'Value' },
]

function extractFocusTokens(obj, path = []) {
  const rows = []
  for (const [key, val] of Object.entries(obj)) {
    const next = [...path, key]
    if (typeof val === 'string' || typeof val === 'number') {
      const tokenText = `--component-${next.map((s) => s.replace(/([A-Z])/g, '-$1').toLowerCase()).join('-')}`
      rows.push({
        id: next.join('.'),
        name: next.join(' / '),
        token: <TokenCode>{tokenText}</TokenCode>,
        tokenText,
        value: String(val),
      })
    } else if (val && typeof val === 'object') {
      rows.push(...extractFocusTokens(val, next))
    }
  }
  return rows
}

const focusRelatedComponents = ['button', 'field', 'link', 'tab']
const focusRows = focusRelatedComponents.flatMap((comp) => {
  const compTokens = tokens.component?.[comp] ?? {}
  return extractFocusTokens(compTokens, [comp]).filter(
    (r) => r.name.toLowerCase().includes('focus') || r.name.toLowerCase().includes('ring')
  )
})

const WCAG_PRINCIPLES = [
  {
    icon: 'visibility',
    title: 'Perceivable',
    points: [
      'Text contrast meets WCAG AA (4.5:1 for normal text, 3:1 for large)',
      'Non-text elements meet 3:1 contrast for meaningful UI',
      'Color is never the only means of conveying information',
      'All images have descriptive alt text',
    ],
  },
  {
    icon: 'keyboard',
    title: 'Operable',
    points: [
      'Every interactive element is reachable by keyboard',
      'Focus order follows document flow',
      'Visible focus indicators are present on all interactive elements',
      'No keyboard traps — users can always navigate away',
    ],
  },
  {
    icon: 'record_voice_over',
    title: 'Understandable',
    points: [
      'Labels are present on all form controls',
      'Error messages identify the problem and suggest a fix',
      'Instructions are visible, not just placeholder text',
      'Language is identified in the HTML',
    ],
  },
  {
    icon: 'build',
    title: 'Robust',
    points: [
      'Semantic HTML — buttons are buttons, links are links',
      'ARIA is used only where native semantics fall short',
      'Dynamic updates are announced to assistive technology',
      'Components are tested with screen readers',
    ],
  },
]

// ── Component ─────────────────────────────────────────────────────────────────

export function AccessibilityFoundationPage({ onNavigate }) {
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
            items={[
              { href: '/', label: 'Home', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
              { href: '?page=foundations', label: 'Foundations', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('foundations') } },
              { label: 'Accessibility' },
            ]}
          />
          <Heading as="h1" id="a11y-heading" size={{ xs: 'lg', md: 'xxl' }}>
            Accessibility
          </Heading>
          <Paragraph size="sm" color="muted">
            Contrast, focus states, semantic markup, keyboard interaction, and screen reader labels. Accessibility is designed into every component — not bolted on afterward.
          </Paragraph>
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="lg" aria-labelledby="a11y-principles-heading">
        <Stack gap="xl">

          <Stack gap="lg">
            <Stack direction="column" gap="sm">
              <Heading as="h2" id="a11y-principles-heading" type="display" size={{ xs: 'lg', md: 'xl' }}>
                WCAG principles.
              </Heading>
              <Paragraph size="sm" color="muted">
                A1 components target WCAG 2.1 Level AA. The four principles — Perceivable, Operable, Understandable, Robust — guide every component decision.
              </Paragraph>
            </Stack>

            <Grid columns={{ xs: 1, sm: 2 }} gap="md">
              {WCAG_PRINCIPLES.map((principle) => (
                <Card key={principle.title} icon={principle.icon}>
                  <Stack direction="column" gap="md">
                    <Heading as="h3" size="md">{principle.title}</Heading>
                    <List icon="check" size="sm" color="muted">
                      {principle.points.map((point) => (
                        <ListItem key={point}>{point}</ListItem>
                      ))}
                    </List>
                  </Stack>
                </Card>
              ))}
            </Grid>
          </Stack>

          {focusRows.length > 0 && (
            <Stack gap="lg">
              <Stack direction="column" gap="sm">
                <Heading as="h2" type="display" size={{ xs: 'lg', md: 'xl' }}>
                  Focus ring tokens.
                </Heading>
                <Paragraph size="sm" color="muted">
                  Every interactive component uses a design token for its focus ring. Override these in a theme file to meet your brand's focus style requirements without touching component code.
                </Paragraph>
              </Stack>
              <DataTable
                columns={focusColumns}
                rows={focusRows}
                getRowId={(r) => r.id}
                size="compact"
                scrollable
                caption="Focus ring tokens"
              />
            </Stack>
          )}

        </Stack>
      </Section>
    </>
  )
}
