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
import { useT } from '../labels/useT.js'

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

function useStatusMeta(t) {
  return {
    pass:                 { status: 'success', label: t('app.accessibility.statusPass', 'Pass'),               icon: 'check_circle' },
    'pass-with-warnings': { status: 'warn',    label: t('app.accessibility.statusPassWithWarnings', 'Pass with warnings'), icon: 'warning' },
    fail:                 { status: 'error',   label: t('app.accessibility.statusFail', 'Fail'),               icon: 'error'        },
  }
}

function useManualItems(t) {
  return [
    { icon: 'record_voice_over', text: t('app.accessibility.manualItem1', 'Screen reader announcement quality and wording') },
    { icon: 'psychology',        text: t('app.accessibility.manualItem2', 'Cognitive load and complexity of error messages') },
    { icon: 'animation',         text: t('app.accessibility.manualItem3', 'Motion sensitivity in animated transitions') },
    { icon: 'error_outline',     text: t('app.accessibility.manualItem4', 'Error recovery paths and contextual guidance') },
    { icon: 'campaign',          text: t('app.accessibility.manualItem5', 'Complex live-region behavior (toasts, status updates)') },
    { icon: 'alt_route',         text: t('app.accessibility.manualItem6', 'Meaningful alt text and link text in context') },
    { icon: 'keyboard',          text: t('app.accessibility.manualItem7', 'Keyboard model appropriateness per interaction pattern') },
  ]
}

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

function ViolationCard({ story, t }) {
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
              <Paragraph size="sm" color="muted">
                +{v.nodes.length - 2}{' '}
                {v.nodes.length - 2 === 1
                  ? t('app.accessibility.moreNode', 'more node')
                  : t('app.accessibility.moreNodes', 'more nodes')}
              </Paragraph>
            )}
          </Stack>
        ))}
      </Stack>
    </Card>
  )
}

export function Accessibility({ onNavigate }) {
  const t = useT()
  const { generated, status, totalScanned, totalViolations, storiesAffected, counts, stories } = reportData
  const STATUS_META = useStatusMeta(t)
  const MANUAL_ITEMS = useManualItems(t)
  const meta = STATUS_META[status] ?? STATUS_META.fail

  return (
    <>
      <Section padding="xs" contentWidth="xl" surface="panel" borderSize="sm" borderVariant="accent" borderSides="bottom">
        <Stack direction="column" gap="xs">
          <Breadcrumb
            items={[
              { label: t('app.page.home', 'Home'), href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
              { label: t('app.accessibility.pageTitle', 'Accessibility report') },
            ]}
          />
          <Heading as="h1" id="a11y-heading" size={{ xs: 'lg', md: 'xxl' }}>
            {t('app.accessibility.pageTitle', 'Accessibility report')}
          </Heading>
          <Paragraph size="sm" color="muted">
            {t('app.accessibility.pageDescription', 'Automated WCAG 2.0 / 2.1 / 2.2 Level A & AA checks run against every Storybook story in the default theme using axe-core via the Storybook test runner.')}
          </Paragraph>
          <Stack direction="row" gap="xs" align="center" wrap>
            <MessageBadge icon={meta.icon} size="sm" status={meta.status}>{meta.label}</MessageBadge>
            <Paragraph size="sm" color="muted">{t('app.accessibility.lastScanned', 'Last scanned:')} {generated}</Paragraph>
          </Stack>
        </Stack>
      </Section>

      {/* ── Summary stats ── */}
      <Section padding="sm" contentWidth="lg" surface="raised" aria-label={t('app.accessibility.reportSummaryLabel', 'Report summary')}>
        <Grid columns={{ xs: 2, sm: 3, md: 6 }} gap="sm">
          <StatCard value={totalScanned}                    label={t('app.accessibility.storiesScanned', 'Stories scanned')}  />
          <StatCard value={storiesAffected}                 label={t('app.accessibility.storiesAffected', 'Stories affected')} highlight />
          <StatCard value={totalViolations}                 label={t('app.accessibility.totalViolations', 'Total violations')} highlight />
          <StatCard value={counts.critical}                 label={t('app.accessibility.critical', 'Critical')}         highlight />
          <StatCard value={counts.serious}                  label={t('app.accessibility.serious', 'Serious')}          highlight />
          <StatCard value={counts.moderate + counts.minor}  label={t('app.accessibility.moderateMinor', 'Moderate / minor')} />
        </Grid>
      </Section>

      {/* ── Scope note ── */}
      <Section padding="sm" contentWidth="lg" aria-label={t('app.accessibility.scopeNoteLabel', 'Scope note')}>
        <Banner variant="inline" status="info" title={t('app.accessibility.bannerTitle', 'Automated pass ≠ accessibility approved')}>
          {t('app.accessibility.bannerBody', 'Automated tools catch an estimated 30–57% of WCAG issues. This report covers machine-detectable violations in tested scenarios. Manual review is required for screen reader quality, cognitive load, motion sensitivity, and complex live-region behavior.')}
        </Banner>
      </Section>

      {/* ── Violations ── */}
      {stories.length > 0 && (
        <Section padding="sm" contentWidth="lg" aria-labelledby="violations-heading">
          <Stack gap="lg">
            <Stack direction="column" gap="sm">
              <Heading as="h2" id="violations-heading" size={{ xs: 'md', md: 'lg' }}>
                {t('app.accessibility.violationsHeading', 'Violations')} — {stories.length}{' '}
                {stories.length === 1
                  ? t('app.accessibility.violationsStory', 'story')
                  : t('app.accessibility.violationsStories', 'stories')}
              </Heading>
              <Paragraph size="md" color="muted">
                {t('app.accessibility.violationsDescription', 'Each card shows the story ID, violation rule, severity, and affected HTML nodes.')}
              </Paragraph>
            </Stack>
            <Grid columns={{ xs: 1, md: 2 }} gap="md">
              {stories.map(story => (
                <ViolationCard key={story.id} story={story} t={t} />
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
            <Heading as="h2" id="allclear-heading" size="lg" align="center">
              {t('app.accessibility.allClearTitle', 'No violations found')}
            </Heading>
            <Paragraph size="lg" color="muted" align="center">
              All {totalScanned} {t('app.accessibility.allClearDescriptionSuffix', 'stories passed WCAG 2.0 / 2.1 / 2.2 Levels A & AA.')}
            </Paragraph>
          </Stack>
        </Section>
      )}

      {/* ── Manual review checklist ── */}
      <Section padding="lg" contentWidth="lg" surface="panel" aria-labelledby="manual-heading">
        <Stack gap="lg">
          <Stack direction="column" gap="sm">
            <MessageBadge icon="checklist">{t('app.accessibility.manualBadge', 'Manual review required')}</MessageBadge>
            <Heading as="h2" id="manual-heading" size={{ xs: 'md', md: 'lg' }}>
              {t('app.accessibility.manualTitle', 'What automation cannot verify')}
            </Heading>
            <Paragraph size="md" color="muted" style={{ maxInlineSize: '600px', textWrap: 'pretty' }}>
              {t('app.accessibility.manualDescription', 'These areas require human judgement and cannot be fully validated by axe or any automated tool. Each should be reviewed before a component is marked production-ready.')}
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
            <MessageBadge icon="terminal">{t('app.accessibility.localChecksBadge', 'Local checks')}</MessageBadge>
            <Heading as="h2" id="coverage-heading" size={{ xs: 'md', md: 'lg' }}>
              {t('app.accessibility.localChecksTitle', 'Run the checks yourself')}
            </Heading>
            <Paragraph size="md" color="muted" style={{ maxInlineSize: '600px', textWrap: 'pretty' }}>
              {t('app.accessibility.localChecksDescription', 'The full suite runs axe against every Storybook story, with Playwright keyboard interaction tests for Menu, Dialog, Tabs, Accordion, and Breadcrumb.')}
            </Paragraph>
          </Stack>
          <Grid columns={{ xs: 1, sm: 3 }} gap="sm">
            {[
              { cmd: 'npm run test:qa',               desc: t('app.accessibility.cmdFullSuite', 'Full axe scan + visual regression + report') },
              { cmd: 'npm run a11y:component <name>',  desc: t('app.accessibility.cmdFocused', 'Focused check for one component')            },
              { cmd: 'npm run a11y:playwright',         desc: t('app.accessibility.cmdKeyboard', 'Keyboard interaction tests only')            },
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
