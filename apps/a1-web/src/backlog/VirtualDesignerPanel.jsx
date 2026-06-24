import { useMemo, useState } from 'react'
import {
  Banner, Button, ButtonContainer, Card, Dialog, Divider, Heading, Icon,
  MessageBadge, MessageEmptyState, Paragraph, SelectField, Stack, Tab, TabList, TabPanel, Tabs,
} from '@gtivr4/a1-design-system-react'
import { useBacklog } from './BacklogContext'
import { StatusBadge } from './TicketBadges'
import { useFindingDecisions } from './useFindingDecisions'
import {
  auditDesign, auditPage, auditProject, auditReleaseNotes,
  listDesignTargets, readPageNodes, projectPagesWithNodes,
  readDesignModel, virtualDesigner,
} from '../services/designer'
import { ticketRef } from '../services/backlog/types'
import { getAllPatterns } from '../patterns/patternStore'
import changelog from '../../CHANGELOG.md?raw'

/**
 * Dev-only "Virtual Designer" — a local, deterministic design reviewer (no API credits). It
 * audits a model of the design system's foundations (the live token scales — radius, spacing,
 * type) against design-craft heuristics and reports findings grouped by lens. The designer is
 * read-only — it advises, it doesn't make changes — but "Virtual designers create tickets":
 * a developer can **file any actionable finding as a backlog ticket**. The report runs in a
 * dialog with a **History** tab of everything it has filed.
 *
 * De-duplication is persistent: each filed ticket carries the finding's stable ref in its
 * description, so a finding already on the backlog shows as "filed" (and is skipped by
 * "file all") even after a reload — the designer never logs the same issue twice.
 *
 * Render gated behind `import.meta.env.DEV` so it never ships.
 */

// Severity → Card status stripe + badge tone + label.
const SEVERITY_UI = {
  critical: { status: 'error', label: 'Critical', badge: 'error' },
  warning: { status: 'warn', label: 'Warning', badge: 'warn' },
  suggestion: { status: 'info', label: 'Refinement', badge: 'info' },
  praise: { status: 'success', label: 'Dialled in', badge: 'success' },
}

// Prose marker (any designer-filed ticket carries it → powers the History tab).
const DESIGNER_MARKER = 'Virtual Designer'

// Findings the designer can file as work — praise is informational only.
const isActionable = (f) => f.severity !== 'praise'
// Map severity → ticket type: a broken scale is a bug; refinements are housekeeping.
const ticketTypeFor = (f) => (f.severity === 'critical' || f.severity === 'warning' ? 'bug' : 'chore')
// Stable, per-finding signature embedded in the ticket so re-runs recognise it.
const findingSig = (modelId, finding) => `${modelId}::${finding.id}`

function findingDescription(finding, report) {
  const lines = [
    `**${finding.heuristic}**${finding.category ? ` · ${finding.category}` : ''} — ${finding.principle}`,
    '',
    finding.detail,
  ]
  if (finding.suggestion) lines.push('', `**Suggestion:** ${finding.suggestion}`)
  if (finding.nodes?.length) lines.push('', `Tokens: ${finding.nodes.join(', ')}`)
  lines.push(
    '',
    `_Filed by the ${DESIGNER_MARKER} from a review of the ${report.modelName} — finding ref \`${findingSig(report.modelId, finding)}\`._`,
  )
  return lines.join('\n')
}

export function VirtualDesignerPanel() {
  const backlog = useBacklog()
  // runKey increments on "Re-run" so useMemo re-reads the live tokens and re-audits.
  const [runKey, setRunKey] = useState(0)
  const [lastRun, setLastRun] = useState(null)
  const [target, setTarget] = useState('tokens')

  // Load the dynamic target list once per render cycle (not inside runKey memo so the
  // dropdown doesn't flicker on re-run).
  const dynamicTargets = useMemo(() => listDesignTargets(), [runKey])

  const report = useMemo(() => {
    if (target === 'release-notes') {
      const pageRefs = dynamicTargets
        .filter((t) => t.value.startsWith('page:'))
        .map((t) => ({ id: t.value.slice(5), title: t.label.split(' / ').slice(1).join(' / '), projectId: t.projectId, projectName: t.projectName }))
      return auditReleaseNotes(changelog, pageRefs, getAllPatterns())
    }
    if (target.startsWith('project:')) {
      const projectId = target.slice(8)
      const tgt = dynamicTargets.find((t) => t.value === target)
      return auditProject(projectId, tgt?.projectName ?? 'Project', projectPagesWithNodes(projectId))
    }
    if (target.startsWith('page:')) {
      const pageId = target.slice(5)
      const tgt = dynamicTargets.find((t) => t.value === target)
      return auditPage({ id: pageId, name: tgt?.label ?? 'Page', nodes: readPageNodes(pageId) })
    }
    return auditDesign(readDesignModel())
  }, [runKey, target, dynamicTargets])
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('findings')
  const [busy, setBusy] = useState(null) // finding.id currently filing, or 'all'
  const decisions = useFindingDecisions('designer')

  if (!backlog) return null

  const items = backlog.items ?? []
  // Persistent: every ticket the designer has ever filed (newest first).
  const history = items
    .filter((it) => (it.description || '').includes(DESIGNER_MARKER))
    .sort((a, b) => b.number - a.number)
  // Map a finding's signature → the ticket that already records it, so we never repeat.
  const filedRef = (finding) => {
    const sig = findingSig(report.modelId, finding)
    const hit = items.find((it) => (it.description || '').includes(sig))
    return hit ? ticketRef(hit.number) : null
  }

  const actionable = report.findings.filter(isActionable)
  // "File all" skips findings already filed or declined.
  const unfiled = actionable.filter((f) => !filedRef(f) && !decisions.isDeclined(findingSig(report.modelId, f)))

  async function logTicket(finding) {
    if (filedRef(finding)) return null // already on the backlog — don't repeat
    const tgt = dynamicTargets.find((t) => t.value === target)
    const isProjectTarget = target.startsWith('project:') || target.startsWith('page:')
    const scope = isProjectTarget
      ? { kind: 'project', label: tgt?.projectName ?? report.modelName, ref: tgt?.projectId }
      : { kind: 'foundation', label: finding.category || report.modelName }
    return backlog.create({
      title: `Design — ${finding.title}`,
      description: findingDescription(finding, report),
      type: ticketTypeFor(finding),
      scope,
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
        <Icon name={virtualDesigner.icon} color="accent" />
        <Heading as="h3" size="xs">{virtualDesigner.name}</Heading>
        <MessageBadge status="warn" subtle size="sm">Dev only</MessageBadge>
      </Stack>
      <Paragraph size="sm" color="muted">{virtualDesigner.blurb}</Paragraph>

      {/* Target picker */}
      <SelectField label="Review target" size="compact" value={target} onChange={(e) => setTarget(e.target.value)}>
        {dynamicTargets.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
        <option value="release-notes">Release notes</option>
      </SelectField>

      {/* Launcher card — opens the report dialog */}
      <Card>
        <Stack gap="sm">
          <Stack direction="row" gap="sm" align="center" wrap>
            <Icon name="design_services" color="accent" size="sm" />
            <Heading as="h4" size="xs">Review — {report.modelName}</Heading>
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
            <Button size="sm" icon="design_services" onClick={() => { setTab('findings'); setOpen(true) }}>
              Open review
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
        title={virtualDesigner.name}
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
            <Tab value="findings" icon="design_services">Findings</Tab>
            <Tab value="history" icon="history" count={history.length}>History</Tab>
          </TabList>

          {/* ── Findings ─────────────────────────────────────────── */}
          <TabPanel value="findings">
            <Stack gap="md">
              <Stack gap="xs">
                <Paragraph size="sm" color="muted">{report.subtitle}</Paragraph>
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
                  const sig = findingSig(report.modelId, f)
                  const declined = decisions.isDeclined(sig)
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
                          <Paragraph size="xs" color="muted">Tokens: {f.nodes.join(', ')}</Paragraph>
                        )}
                        <Paragraph size="xs" color="muted">{f.heuristic} — {f.principle}</Paragraph>
                        {isActionable(f) && (
                          ref ? (
                            <Stack direction="row" gap="xs" align="center">
                              <Icon name="check_circle" color="success" size="sm" />
                              <Paragraph size="xs" color="muted">Filed as {ref}</Paragraph>
                            </Stack>
                          ) : declined ? (
                            <Stack direction="row" gap="xs" align="center" wrap>
                              <Icon name="block" color="muted" size="sm" />
                              <Paragraph size="xs" color="muted">
                                Declined{decisions.commentFor(sig) ? ` — ${decisions.commentFor(sig)}` : ''}
                              </Paragraph>
                              <Button size="sm" variant="tertiary" icon="undo" onClick={() => decisions.undo(sig)}>
                                Undo
                              </Button>
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
                              <Button
                                size="sm"
                                variant="tertiary"
                                icon="block"
                                disabled={!!busy}
                                onClick={() => decisions.start(sig, f.title)}
                              >
                                Decline
                              </Button>
                            </ButtonContainer>
                          )
                        )}
                      </Stack>
                    </Card>
                  )
                })}
              </Stack>

              <Banner status="info" variant="inline" title="Designers advise, they don't build">
                These are recommendations from design-craft heuristics, not automatic changes. File the
                ones you agree with; the Virtual Product Owner will prioritise and size them like any other
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
                  {history.length} ticket{history.length === 1 ? '' : 's'} filed by the designer.
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

      {decisions.dialog}
    </Stack>
  )
}
