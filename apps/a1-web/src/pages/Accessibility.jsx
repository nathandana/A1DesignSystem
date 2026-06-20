import {
  Banner,
  Breadcrumb,
  Card,
  Grid,
  Heading,
  Icon,
  MessageBadge,
  Paragraph,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'
import reportData from '../../../../reports/a11y.json'

const CODE_STYLE = {
  fontFamily: 'var(--component-inline-font-family-mono, monospace)',
  fontSize: 'var(--semantic-font-size-body-xs)',
  background: 'var(--semantic-color-surface-raised)',
  borderRadius: 'var(--base-radius-sm)',
  padding: '2px var(--base-spacing-6)',
  color: 'var(--semantic-color-text-default)',
  wordBreak: 'break-all',
}

const PRE_STYLE = {
  ...CODE_STYLE,
  display: 'block',
  padding: 'var(--base-spacing-8)',
  margin: 0,
  overflowX: 'auto',
  whiteSpace: 'pre-wrap',
  color: 'var(--semantic-color-text-accent)',
}

function Code({ children }) { return <code style={CODE_STYLE}>{children}</code> }
function Pre({ children })  { return <pre  style={PRE_STYLE}>{children}</pre>   }

const IMPACT_COLORS = {
  critical: 'error',
  serious:  'error',
  moderate: 'warn',
  minor:    'info',
}

const STATUS_META = {
  pass:                 { status: 'success', label: 'Pass',               icon: 'check_circle' },
  'pass-with-warnings': { status: 'warn',    label: 'Pass with warnings', icon: 'warning'      },
  fail:                 { status: 'error',   label: 'Fail',               icon: 'error'        },
}

const MANUAL_ITEMS = [
  { icon: 'record_voice_over', text: 'Screen reader announcement quality and wording' },
  { icon: 'psychology',        text: 'Cognitive load and complexity of error messages' },
  { icon: 'animation',         text: 'Motion sensitivity in animated transitions' },
  { icon: 'error_outline',     text: 'Error recovery paths and contextual guidance' },
  { icon: 'campaign',          text: 'Complex live-region behavior (toasts, status updates)' },
  { icon: 'alt_route',         text: 'Meaningful alt text and link text in context' },
  { icon: 'keyboard',          text: 'Keyboard model appropriateness per interaction pattern' },
]

function StatCard({ value, label, highlight }) {
  return (
    <Card shadow="xs">
      <Stack direction="column" gap="xs">
        <Heading as="p" type="display" size="lg" color={highlight && Number(value) > 0 ? 'error' : undefined}>
          {value}
        </Heading>
        <Paragraph size="sm" color="muted">{label}</Paragraph>
      </Stack>
    </Card>
  )
}

function ViolationCard({ story }) {
  return (
    <Card shadow="xs">
      <Stack direction="column" gap="sm">
        <Code>{story.id}</Code>
        {story.violations.map((v, i) => (
          <Stack key={i} direction="column" gap="xs">
            <Stack direction="row" gap="xs" align="center" wrap>
              <MessageBadge status={IMPACT_COLORS[v.impact] ?? 'info'}>{v.impact}</MessageBadge>
              <Code>{v.id}</Code>
              {v.nodeCount > 1 && (
                <Paragraph size="sm" color="muted">× {v.nodeCount}</Paragraph>
              )}
            </Stack>
            <Paragraph size="sm" color="muted">{v.description}</Paragraph>
            {v.nodes.slice(0, 2).map((n, j) => (
              <Pre key={j}>{n.html}</Pre>
            ))}
            {v.nodes.length > 2 && (
              <Paragraph size="sm" color="muted">+{v.nodes.length - 2} more node{v.nodes.length - 2 === 1 ? '' : 's'}</Paragraph>
            )}
          </Stack>
        ))}
      </Stack>
    </Card>
  )
}

export function Accessibility({ onNavigate }) {
  const { generated, status, totalScanned, totalViolations, storiesAffected, counts, stories } = reportData
  const meta = STATUS_META[status] ?? STATUS_META.fail

  return (
    <>
      <Section padding="xs" contentWidth="xl" surface="panel" borderSize="sm" borderVariant="accent" borderSides="bottom">
        <Stack direction="column" gap="xs">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
              { label: 'Accessibility report' },
            ]}
          />
          <Heading as="h1" id="a11y-heading" size={{ xs: 'lg', md: 'xxl' }}>
            Accessibility report
          </Heading>
          <Paragraph size="sm" color="muted">
            Automated WCAG 2.0 / 2.1 / 2.2 Level A &amp; AA checks run against every Storybook story
            in the default theme using axe-core via the Storybook test runner.
          </Paragraph>
          <Stack direction="row" gap="xs" align="center" wrap>
            <MessageBadge icon={meta.icon} size="sm" status={meta.status}>{meta.label}</MessageBadge>
            <Paragraph size="sm" color="muted">Last scanned: {generated}</Paragraph>
          </Stack>
        </Stack>
      </Section>

      {/* ── Summary stats ── */}
      <Section padding="sm" contentWidth="lg" surface="raised" aria-label="Report summary">
        <Grid columns={{ xs: 2, sm: 3, md: 6 }} gap="sm">
          <StatCard value={totalScanned}                    label="Stories scanned"  />
          <StatCard value={storiesAffected}                 label="Stories affected" highlight />
          <StatCard value={totalViolations}                 label="Total violations" highlight />
          <StatCard value={counts.critical}                 label="Critical"         highlight />
          <StatCard value={counts.serious}                  label="Serious"          highlight />
          <StatCard value={counts.moderate + counts.minor}  label="Moderate / minor" />
        </Grid>
      </Section>

      {/* ── Scope note ── */}
      <Section padding="sm" contentWidth="lg" aria-label="Scope note">
        <Banner variant="inline" status="info" title="Automated pass ≠ accessibility approved">
          Automated tools catch an estimated 30–57% of WCAG issues. This report covers machine-detectable
          violations in tested scenarios. Manual review is required for screen reader quality, cognitive load,
          motion sensitivity, and complex live-region behavior.
        </Banner>
      </Section>

      {/* ── Violations ── */}
      {stories.length > 0 && (
        <Section padding="sm" contentWidth="lg" aria-labelledby="violations-heading">
          <Stack gap="lg">
            <Stack direction="column" gap="sm">
              <Heading as="h2" id="violations-heading" size={{ xs: 'md', md: 'lg' }}>
                Violations — {stories.length} {stories.length === 1 ? 'story' : 'stories'}
              </Heading>
              <Paragraph size="md" color="muted">
                Each card shows the story ID, violation rule, severity, and affected HTML nodes.
              </Paragraph>
            </Stack>
            <Grid columns={{ xs: 1, md: 2 }} gap="md">
              {stories.map(story => (
                <ViolationCard key={story.id} story={story} />
              ))}
            </Grid>
          </Stack>
        </Section>
      )}

      {/* ── All clear ── */}
      {stories.length === 0 && (
        <Section padding="lg" contentWidth="lg" aria-labelledby="allclear-heading">
          <Stack direction="column" gap="md" align="center">
            <Icon name="check_circle" style={{ fontSize: 64, color: 'var(--semantic-color-status-success-background)' }} />
            <Heading as="h2" id="allclear-heading" size="lg" align="center">No violations found</Heading>
            <Paragraph size="lg" color="muted" align="center">
              All {totalScanned} stories passed WCAG 2.0 / 2.1 / 2.2 Levels A &amp; AA.
            </Paragraph>
          </Stack>
        </Section>
      )}

      {/* ── Manual review checklist ── */}
      <Section padding="lg" contentWidth="lg" surface="panel" aria-labelledby="manual-heading">
        <Stack gap="lg">
          <Stack direction="column" gap="sm">
            <MessageBadge icon="checklist">Manual review required</MessageBadge>
            <Heading as="h2" id="manual-heading" size={{ xs: 'md', md: 'lg' }}>
              What automation cannot verify
            </Heading>
            <Paragraph size="md" color="muted" style={{ maxInlineSize: '600px', textWrap: 'pretty' }}>
              These areas require human judgement and cannot be fully validated by axe or any
              automated tool. Each should be reviewed before a component is marked production-ready.
            </Paragraph>
          </Stack>
          <Grid columns={{ xs: 1, sm: 2, md: 3 }} gap="sm">
            {MANUAL_ITEMS.map(({ icon, text }) => (
              <Card key={text} shadow="xs">
                <Stack direction="row" gap="sm" align="start">
                  <Icon name={icon} style={{ color: 'var(--semantic-color-text-muted)', flexShrink: 0 }} />
                  <Paragraph size="sm">{text}</Paragraph>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Section>

      {/* ── Coverage note ── */}
      <Section padding="lg" surface="panel" contentWidth="lg" aria-labelledby="coverage-heading">
        <Stack direction="column" gap="md">
          <Stack direction="column" gap="sm">
            <MessageBadge icon="terminal">Local checks</MessageBadge>
            <Heading as="h2" id="coverage-heading" size={{ xs: 'md', md: 'lg' }}>
              Run the checks yourself
            </Heading>
            <Paragraph size="md" color="muted" style={{ maxInlineSize: '600px', textWrap: 'pretty' }}>
              The full suite runs axe against every Storybook story, with Playwright keyboard
              interaction tests for Menu, Dialog, Tabs, Accordion, and Breadcrumb.
            </Paragraph>
          </Stack>
          <Grid columns={{ xs: 1, sm: 3 }} gap="sm">
            {[
              { cmd: 'npm run test:qa',               desc: 'Full axe scan + visual regression + report' },
              { cmd: 'npm run a11y:component <name>',  desc: 'Focused check for one component'           },
              { cmd: 'npm run a11y:playwright',         desc: 'Keyboard interaction tests only'           },
            ].map(({ cmd, desc }) => (
              <Card key={cmd} shadow="xs">
                <Stack direction="column" gap="xs">
                  <Code>{cmd}</Code>
                  <Paragraph size="sm" color="muted">{desc}</Paragraph>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Section>
    </>
  )
}
