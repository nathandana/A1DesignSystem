import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Banner, Button, ButtonContainer, Card, Dialog, Divider, Heading, Icon,
  MessageBadge, MessageEmptyState, Paragraph, SelectField, Stack, Tab, TabList, TabPanel, Tabs,
} from '@gtivr4/a1-design-system-react'
import { useBacklog } from './BacklogContext'
import { StatusBadge } from './TicketBadges'
import { useFindingDecisions } from './useFindingDecisions'
import {
  auditNav,
  getMainMenu,
  informationArchitect,
  listArchitectTargets,
  projectNavModel,
  runArchitectAi,
} from '../services/architect'
import { ticketRef } from '../services/backlog/types'

/**
 * Dev-only "Virtual Information Architect" — a local IA reviewer backed by two layers:
 *
 *  1. **Deterministic heuristics** — 13 IA/UX rules that always run offline.
 *  2. **Ollama AI layer** — when a local model is available, enriches heuristic findings with
 *     concrete rename proposals and adds 1–3 contextual observations the rules cannot express.
 *
 * Both layers are read-only: the architect advises, it never mutates anything. Developers can
 * file any finding (heuristic or AI) as a backlog ticket. De-duplication is persistent.
 */

const SEVERITY_UI = {
  critical: { status: 'error', label: 'Critical', badge: 'error' },
  warning: { status: 'warn', label: 'Warning', badge: 'warn' },
  suggestion: { status: 'info', label: 'Suggestion', badge: 'info' },
  praise: { status: 'success', label: 'Working well', badge: 'success' },
}

const ARCHITECT_MARKER = 'Virtual Information Architect'

const isActionable = (f) => f.severity !== 'praise'
const ticketTypeFor = (f) => (f.severity === 'critical' ? 'bug' : 'feature')
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

function aiRunDetail(ai) {
  if (!ai || ai.engine !== 'model') return null
  const secs = `${(ai.elapsedMs / 1000).toFixed(1)}s`
  const tokens = (ai.promptTokens != null || ai.outputTokens != null)
    ? ` · ${ai.promptTokens ?? 0} in / ${ai.outputTokens ?? 0} out tokens`
    : ''
  return `${ai.model} · ${secs}${tokens} · local`
}

export function VirtualArchitectPanel() {
  const backlog = useBacklog()
  const [runKey, setRunKey] = useState(0)
  const [lastRun, setLastRun] = useState(null)
  const [target, setTarget] = useState('menu')

  // AI state
  const [aiResult, setAiResult] = useState(null)
  const [aiBusy, setAiBusy] = useState(false)
  const aiCancelRef = useRef(false)

  const architectTargets = useMemo(() => listArchitectTargets(), [runKey])

  // Split navModel from report so the AI effect can depend on navModel alone.
  const navModel = useMemo(() => {
    if (target.startsWith('project:')) {
      return projectNavModel(target.slice(8))
    }
    return getMainMenu()
  }, [runKey, target, architectTargets])

  const report = useMemo(() => auditNav(navModel), [navModel])

  // Run Ollama in the background whenever the nav model changes.
  useEffect(() => {
    aiCancelRef.current = false
    setAiResult(null)
    setAiBusy(true)
    runArchitectAi(navModel, report.findings)
      .then((result) => {
        if (aiCancelRef.current) return
        setAiResult(result.engine === 'none' ? null : result)
        setAiBusy(false)
      })
      .catch(() => { if (!aiCancelRef.current) setAiBusy(false) })
    return () => { aiCancelRef.current = true }
  }, [navModel]) // eslint-disable-line react-hooks/exhaustive-deps

  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('findings')
  const [busy, setBusy] = useState(null)       // heuristic: finding.id | 'all' | null
  const [aiFileBusy, setAiFileBusy] = useState(null) // AI: obs.id | 'all' | null
  const decisions = useFindingDecisions('architect')
  const aiDecisions = useFindingDecisions('architect-ai')

  if (!backlog) return null

  const items = backlog.items ?? []
  const history = items
    .filter((it) => (it.description || '').includes(ARCHITECT_MARKER))
    .sort((a, b) => b.number - a.number)

  // ── Heuristic finding helpers ───────────────────────────────────────────────

  const filedRef = (finding) => {
    const sig = findingSig(report.navId, finding)
    const hit = items.find((it) => (it.description || '').includes(sig))
    return hit ? ticketRef(hit.number) : null
  }

  const actionable = report.findings.filter(isActionable)
  const unfiled = actionable.filter(
    (f) => !filedRef(f) && !decisions.isDeclined(findingSig(report.navId, f)),
  )

  async function logTicket(finding) {
    if (filedRef(finding)) return null
    const tgt = architectTargets.find((t) => t.value === target)
    const isProject = target.startsWith('project:')
    const scope = isProject
      ? { kind: 'project', label: tgt?.label ?? report.navName, ref: tgt?.projectId }
      : { kind: 'app', label: report.navName }
    return backlog.create({
      title: `${report.navName} IA — ${finding.title}`,
      description: findingDescription(finding, report),
      type: ticketTypeFor(finding),
      scope,
    })
  }

  async function handleLogOne(finding) {
    setBusy(finding.id); try { await logTicket(finding) } finally { setBusy(null) }
  }

  async function handleLogAll() {
    setBusy('all'); try { for (const f of unfiled) await logTicket(f) } finally { setBusy(null) }
  }

  // ── AI observation helpers ──────────────────────────────────────────────────

  const aiObservations = aiResult?.observations ?? []
  const aiObsSig = (obs) => `ai::${report.navId}::${obs.id}`
  const aiObsRef = (obs) => {
    const sig = aiObsSig(obs)
    const hit = items.find((it) => (it.description || '').includes(sig))
    return hit ? ticketRef(hit.number) : null
  }
  const aiUnfiled = aiObservations.filter(
    (obs) => !aiObsRef(obs) && !aiDecisions.isDeclined(aiObsSig(obs)),
  )

  // Rename suggestions that match a finding's flagged nodes.
  const renamesFor = (nodes = []) => {
    if (!aiResult?.renames) return []
    return aiResult.renames.filter((r) => nodes.includes(r.from))
  }

  async function logAiTicket(obs) {
    if (aiObsRef(obs)) return null
    const sig = aiObsSig(obs)
    const lines = [
      `**AI observation** — ${obs.detail}`,
      ...(obs.suggestion ? ['', `**Suggestion:** ${obs.suggestion}`] : []),
      '',
      `_Filed by the ${ARCHITECT_MARKER} (AI layer, ${aiResult?.model ?? 'local model'}) from an audit of the ${report.navName} — ref \`${sig}\`._`,
    ]
    const tgt = architectTargets.find((t) => t.value === target)
    const isProject = target.startsWith('project:')
    const scope = isProject
      ? { kind: 'project', label: tgt?.label ?? report.navName, ref: tgt?.projectId }
      : { kind: 'app', label: report.navName }
    return backlog.create({
      title: `${report.navName} IA — ${obs.title}`,
      description: lines.join('\n'),
      type: 'feature',
      scope,
    })
  }

  async function handleAiLogOne(obs) {
    setAiFileBusy(obs.id); try { await logAiTicket(obs) } finally { setAiFileBusy(null) }
  }

  async function handleAiLogAll() {
    setAiFileBusy('all')
    try { for (const obs of aiUnfiled) await logAiTicket(obs) } finally { setAiFileBusy(null) }
  }

  // ── Misc ────────────────────────────────────────────────────────────────────

  function handleRerun() {
    setRunKey((k) => k + 1)
    setLastRun(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
  }

  const anyBusy = !!(busy || aiFileBusy)

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

      <SelectField
        label="Audit target"
        size="compact"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
      >
        {architectTargets.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </SelectField>

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
            {aiBusy && (
              <MessageBadge status="neutral" subtle size="sm">AI running…</MessageBadge>
            )}
            {aiResult && !aiBusy && (
              <MessageBadge status="info" subtle size="sm">AI enhanced</MessageBadge>
            )}
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
        onClose={anyBusy ? undefined : () => setOpen(false)}
        title={informationArchitect.name}
        size="lg"
        footer={
          <ButtonContainer>
            <Button variant="secondary" icon="refresh" disabled={anyBusy} onClick={handleRerun}>Re-run</Button>
            <Button variant="secondary" disabled={anyBusy} onClick={() => setOpen(false)}>Close</Button>
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
                  {aiResult && ` · AI: ${aiResult.renames.length} rename${aiResult.renames.length !== 1 ? 's' : ''}, ${aiResult.observations.length} observation${aiResult.observations.length !== 1 ? 's' : ''}`}
                </Paragraph>
                {aiBusy && (
                  <Paragraph size="xs" color="muted">AI analysis in progress (Ollama)…</Paragraph>
                )}
                {aiResult && !aiBusy && (
                  <Paragraph size="xs" color="muted">{aiRunDetail(aiResult)}</Paragraph>
                )}
                {actionable.length > 0 && (
                  <ButtonContainer align="start">
                    <Button
                      size="sm"
                      icon="playlist_add"
                      loading={busy === 'all'}
                      disabled={unfiled.length === 0 || anyBusy}
                      onClick={handleLogAll}
                    >
                      {unfiled.length === 0
                        ? 'All findings filed'
                        : `File ${unfiled.length} finding${unfiled.length === 1 ? '' : 's'} as tickets`}
                    </Button>
                  </ButtonContainer>
                )}
              </Stack>

              {/* Heuristic finding cards */}
              <Stack gap="sm">
                {report.findings.map((f) => {
                  const ui = SEVERITY_UI[f.severity]
                  const ref = filedRef(f)
                  const sig = findingSig(report.navId, f)
                  const declined = decisions.isDeclined(sig)
                  const renames = renamesFor(f.nodes)
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
                        {/* AI rename suggestions for this finding's flagged labels */}
                        {renames.map((r) => (
                          <Stack key={r.from} direction="row" gap="xs" align="center">
                            <Icon name="smart_toy" size="sm" color="accent" />
                            <Paragraph size="xs">
                              <strong>AI:</strong> "{r.from}" → "{r.to}" — {r.reason}
                            </Paragraph>
                          </Stack>
                        ))}
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
                                disabled={anyBusy}
                                onClick={() => handleLogOne(f)}
                              >
                                File as ticket
                              </Button>
                              <Button
                                size="sm"
                                variant="tertiary"
                                icon="block"
                                disabled={anyBusy}
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

              {/* AI observations — only shown when Ollama contributed */}
              {aiObservations.length > 0 && (
                <Stack gap="sm">
                  <Divider space="xs" />
                  <Stack direction="row" gap="xs" align="center" wrap>
                    <Icon name="smart_toy" size="sm" color="accent" />
                    <Heading as="h4" size="xs">AI observations</Heading>
                    <MessageBadge status="neutral" subtle size="sm">{aiResult?.model}</MessageBadge>
                    {aiUnfiled.length > 0 && (
                      <Button
                        size="sm"
                        variant="tertiary"
                        icon="playlist_add"
                        loading={aiFileBusy === 'all'}
                        disabled={anyBusy}
                        onClick={handleAiLogAll}
                      >
                        File {aiUnfiled.length}
                      </Button>
                    )}
                  </Stack>
                  {aiObservations.map((obs) => {
                    const ref = aiObsRef(obs)
                    const sig = aiObsSig(obs)
                    const declined = aiDecisions.isDeclined(sig)
                    return (
                      <Card key={obs.id} status="info" statusLabel="AI">
                        <Stack gap="xs">
                          <Heading as="h4" size="xs">{obs.title}</Heading>
                          <Paragraph size="sm">{obs.detail}</Paragraph>
                          {obs.suggestion && (
                            <Paragraph size="sm"><strong>Suggestion:</strong> {obs.suggestion}</Paragraph>
                          )}
                          {ref ? (
                            <Stack direction="row" gap="xs" align="center">
                              <Icon name="check_circle" color="success" size="sm" />
                              <Paragraph size="xs" color="muted">Filed as {ref}</Paragraph>
                            </Stack>
                          ) : declined ? (
                            <Stack direction="row" gap="xs" align="center" wrap>
                              <Icon name="block" color="muted" size="sm" />
                              <Paragraph size="xs" color="muted">
                                Declined{aiDecisions.commentFor(sig) ? ` — ${aiDecisions.commentFor(sig)}` : ''}
                              </Paragraph>
                              <Button size="sm" variant="tertiary" icon="undo" onClick={() => aiDecisions.undo(sig)}>
                                Undo
                              </Button>
                            </Stack>
                          ) : (
                            <ButtonContainer align="start">
                              <Button
                                size="sm"
                                variant="secondary"
                                icon="add_task"
                                loading={aiFileBusy === obs.id}
                                disabled={anyBusy}
                                onClick={() => handleAiLogOne(obs)}
                              >
                                File as ticket
                              </Button>
                              <Button
                                size="sm"
                                variant="tertiary"
                                icon="block"
                                disabled={anyBusy}
                                onClick={() => aiDecisions.start(sig, obs.title)}
                              >
                                Decline
                              </Button>
                            </ButtonContainer>
                          )}
                        </Stack>
                      </Card>
                    )
                  })}
                </Stack>
              )}

              <Banner status="info" variant="inline" title="Architects advise, they don't build">
                These are recommendations from IA/UX heuristics and optional AI analysis, not
                automatic changes. File the ones you agree with; the Virtual Product Owner will
                prioritise and size them like any other ticket. A finding already on the backlog is
                shown as filed and never logged twice.
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

      {decisions.dialog}
      {aiDecisions.dialog}
    </Stack>
  )
}
