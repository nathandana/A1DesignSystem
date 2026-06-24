import { useMemo, useState } from 'react'
import {
  Banner, Button, ButtonContainer, Card, Dialog, Divider, Heading, Icon,
  MessageBadge, MessageEmptyState, Paragraph, Stack, Tab, TabList, TabPanel, Tabs,
} from '@gtivr4/a1-design-system-react'
import { useBacklog } from './BacklogContext'
import { StatusBadge } from './TicketBadges'
import { auditNav, getMainMenu, informationArchitect } from '../services/architect'
import { ticketRef } from '../services/backlog/types'

/**
 * Dev-only "Virtual Information Architect" — a local, deterministic IA reviewer (no API
 * credits). It audits a navigation model (the a1-web main menu) against IA/UX heuristics
 * and reports findings grouped by concern. The architect is read-only — it advises, it
 * doesn't make changes — but a developer can **file any actionable finding as a backlog
 * ticket**. The report runs in a dialog with a **History** tab of everything it has filed.
 *
 * De-duplication is persistent: each filed ticket carries the finding's stable ref in its
 * description, so a finding already on the backlog shows as "filed" (and is skipped by
 * "file all") even after a reload — the architect never logs the same issue twice.
 *
 * Render gated behind `import.meta.env.DEV` so it never ships.
 */

// Severity → Card status stripe + badge tone + label.
const SEVERITY_UI = {
  critical: { status: 'error', label: 'Critical', badge: 'error' },
  warning: { status: 'warn', label: 'Warning', badge: 'warn' },
  suggestion: { status: 'info', label: 'Suggestion', badge: 'info' },
  praise: { status: 'success', label: 'Working well', badge: 'success' },
}

// Prose marker (any architect-filed ticket carries it → powers the History tab).
const ARCHITECT_MARKER = 'Virtual Information Architect'

// Findings the architect can file as work — praise is informational only.
const isActionable = (f) => f.severity !== 'praise'
// Map severity → ticket type: a broken law is a bug; everything else is housekeeping.
const ticketTypeFor = (f) => (f.severity === 'critical' ? 'bug' : 'chore')
// Stable, per-finding signature embedded in the ticket so re-runs recognise it.
const findingSig = (navId, finding) => `${navId}::${finding.id}`

function findingDescription(finding, report) {
  const lines = [
    `**${finding.heuristic}**${finding.category ? ` · ${finding.category}` : ''} — ${finding.principle}`,
    '',
    finding.detail,
  ]
  if (finding.suggestion) lines.push('', `**Suggestion:** ${finding.suggestion}`)
  if (finding.nodes?.length) lines.push('', `Affects: ${finding.nodes.join(', ')}`)
  lines.push(
    '',
    `_Filed by the ${ARCHITECT_MARKER} from an audit of the ${report.navName} — finding ref \`${findingSig(report.navId, finding)}\`._`,
  )
  return lines.join('\n')
}

export function VirtualArchitectPanel() {
  const backlog = useBacklog()
  // runKey increments on "Re-run" so useMemo produces a fresh audit of the live menu.
  const [runKey, setRunKey] = useState(0)
  const [lastRun, setLastRun] = useState(null)
  const report = useMemo(() => auditNav(getMainMenu()), [runKey])
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('findings')
  const [busy, setBusy] = useState(null) // finding.id currently filing, or 'all'

  if (!backlog) return null

  const items = backlog.items ?? []
  // Persistent: every ticket the architect has ever filed (newest first).
  const history = items
    .filter((it) => (it.description || '').includes(ARCHITECT_MARKER))
    .sort((a, b) => b.number - a.number)
  // Map a finding's signature → the ticket that already records it, so we never repeat.
  const filedRef = (finding) => {
    const sig = findingSig(report.navId, finding)
    const hit = items.find((it) => (it.description || '').includes(sig))
    return hit ? ticketRef(hit.number) : null
  }

  const actionable = report.findings.filter(isActionable)
  const unfiled = actionable.filter((f) => !filedRef(f))

  async function logTicket(finding) {
    if (filedRef(finding)) return null // already on the backlog — don't repeat
    return backlog.create({
      title: `${report.navName} IA — ${finding.title}`,
      description: findingDescription(finding, report),
      type: ticketTypeFor(finding),
      scope: { kind: 'app', label: report.navName },
    })
  }

  function handleRerun() {
    setRunKey((k) => k + 1)
    setLastRun(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
  }

  async function handleLogOne(finding) {
    setBusy(finding.id)
    try { await logTicket(finding) } finally { setBusy(null) }
  }

  async function handleLogAll() {
    setBusy('all')
    try {
      for (const f of unfiled) await logTicket(f) // sequential so refs stay ordered
    } finally { setBusy(null) }
  }

  const summary = Object.entries(report.counts)
    .filter(([, n]) => n > 0)
    .map(([sev, n]) => ({ sev, n }))

  return (
    <Stack gap="md">
      <Stack direction="row" gap="xs" align="center" wrap>
        <Icon name={informationArchitect.icon} color="accent" />
        <Heading as="h3" size="xs">{informationArchitect.name}</Heading>
        <MessageBadge status="warn" subtle size="sm">Dev only</MessageBadge>
      </Stack>
      <Paragraph size="sm" color="muted">{informationArchitect.blurb}</Paragraph>

      {/* Launcher card — opens the report dialog */}
      <Card>
        <Stack gap="sm">
          <Stack direction="row" gap="sm" align="center" wrap>
            <Icon name="rule" color="accent" size="sm" />
            <Heading as="h4" size="xs">Audit — {report.navName}</Heading>
          </Stack>
          <Stack direction="row" gap="xs" wrap>
            {summary.map(({ sev, n }) => (
              <MessageBadge key={sev} status={SEVERITY_UI[sev].badge} subtle size="sm">
                {SEVERITY_UI[sev].label}: {n}
              </MessageBadge>
            ))}
          </Stack>
          {lastRun && (
            <Paragraph size="xs" color="muted">Last run at {lastRun}</Paragraph>
          )}
          <ButtonContainer align="start">
            <Button size="sm" icon="account_tree" onClick={() => { setTab('findings'); setOpen(true) }}>
              Open report
            </Button>
            <Button size="sm" variant="secondary" icon="refresh" onClick={handleRerun}>
              Re-run
            </Button>
          </ButtonContainer>
        </Stack>
      </Card>

      <Dialog
        open={open}
        onClose={busy ? undefined : () => setOpen(false)}
        title={informationArchitect.name}
        size="lg"
        footer={
          <ButtonContainer>
            <Button variant="secondary" icon="refresh" disabled={!!busy} onClick={handleRerun}>Re-run</Button>
            <Button variant="secondary" disabled={!!busy} onClick={() => setOpen(false)}>Close</Button>
          </ButtonContainer>
        }
      >
        <Tabs value={tab} onChange={setTab} equalHeight>
          <TabList>
            <Tab value="findings" icon="rule">Findings</Tab>
            <Tab value="history" icon="history" count={history.length}>History</Tab>
          </TabList>

          {/* ── Findings ─────────────────────────────────────────── */}
          <TabPanel value="findings">
            <Stack gap="md">
              <Stack gap="xs">
                <Paragraph size="sm" color="muted">
                  {report.topLevelCount} top-level groups · max depth {report.maxDepth} · {report.nodeCount} items examined
                </Paragraph>
                {actionable.length > 0 && (
                  <ButtonContainer align="start">
                    <Button
                      size="sm"
                      icon="playlist_add"
                      loading={busy === 'all'}
                      disabled={unfiled.length === 0 || !!busy}
                      onClick={handleLogAll}
                    >
                      {unfiled.length === 0
                        ? 'All findings filed'
                        : `File ${unfiled.length} finding${unfiled.length === 1 ? '' : 's'} as tickets`}
                    </Button>
                  </ButtonContainer>
                )}
              </Stack>

              <Stack gap="sm">
                {report.findings.map((f) => {
                  const ui = SEVERITY_UI[f.severity]
                  const ref = filedRef(f)
                  return (
                    <Card key={f.id} status={ui.status} statusLabel={ui.label}>
                      <Stack gap="xs">
                        <Stack direction="row" gap="xs" align="center" wrap>
                          <Heading as="h4" size="xs">{f.title}</Heading>
                          {f.category && <MessageBadge status="neutral" subtle size="sm">{f.category}</MessageBadge>}
                        </Stack>
                        <Paragraph size="sm">{f.detail}</Paragraph>
                        {f.suggestion && (
                          <Paragraph size="sm"><strong>Suggestion:</strong> {f.suggestion}</Paragraph>
                        )}
                        {f.nodes?.length > 0 && (
                          <Paragraph size="xs" color="muted">Affects: {f.nodes.join(', ')}</Paragraph>
                        )}
                        <Paragraph size="xs" color="muted">{f.heuristic} — {f.principle}</Paragraph>
                        {isActionable(f) && (
                          ref ? (
                            <Stack direction="row" gap="xs" align="center">
                              <Icon name="check_circle" color="success" size="sm" />
                              <Paragraph size="xs" color="muted">Filed as {ref}</Paragraph>
                            </Stack>
                          ) : (
                            <ButtonContainer align="start">
                              <Button
                                size="sm"
                                variant="secondary"
                                icon="add_task"
                                loading={busy === f.id}
                                disabled={!!busy}
                                onClick={() => handleLogOne(f)}
                              >
                                File as ticket
                              </Button>
                            </ButtonContainer>
                          )
                        )}
                      </Stack>
                    </Card>
                  )
                })}
              </Stack>

              <Banner status="info" variant="inline" title="Architects advise, they don't build">
                These are recommendations from IA/UX heuristics, not automatic changes. File the ones
                you agree with; the Virtual Product Owner will prioritise and size them like any other
                ticket. A finding already on the backlog is shown as filed and never logged twice.
              </Banner>
            </Stack>
          </TabPanel>

          {/* ── History ──────────────────────────────────────────── */}
          <TabPanel value="history">
            {history.length === 0 ? (
              <MessageEmptyState
                icon="history"
                title="Nothing filed yet"
                description="Findings you file from the Findings tab will appear here."
              />
            ) : (
              <Stack gap="xs">
                <Paragraph size="sm" color="muted">
                  {history.length} ticket{history.length === 1 ? '' : 's'} filed by the architect.
                </Paragraph>
                {history.map((it) => (
                  <div key={it.id}>
                    <Stack direction="row" gap="sm" align="center" wrap>
                      <Paragraph size="sm"><strong>{ticketRef(it.number)}</strong> {it.title}</Paragraph>
                      <StatusBadge status={it.status} size="sm" />
                    </Stack>
                    <Divider space="xs" />
                  </div>
                ))}
              </Stack>
            )}
          </TabPanel>
        </Tabs>
      </Dialog>
    </Stack>
  )
}
