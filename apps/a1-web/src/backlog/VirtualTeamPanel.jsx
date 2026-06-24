import { useState } from 'react'
import {
  Banner, Button, ButtonContainer, Card, Dialog, Grid, Heading, Icon,
  List, ListItem, MessageBadge, Paragraph, Stack,
} from '@gtivr4/a1-design-system-react'
import { useBacklog } from './BacklogContext'
import { PERSONAS } from '../services/backlog/personas'
import { COMPLEXITY_LABELS, PRIORITY_LABELS, STATUS_LABELS } from '../services/backlog/types'

/**
 * Dev-only "Virtual team" control. Each persona is a local, deterministic model (no API
 * credits) that reviews the whole backlog. Clicking a persona runs a **dry run** first and
 * shows what it would change; Apply writes priority/size changes + clarifying questions,
 * attributed to the persona. Render it gated behind `import.meta.env.DEV` so it never ships.
 */
const PREVIEW_LIMIT = 40

export function VirtualTeamPanel() {
  const backlog = useBacklog()
  const [busy, setBusy] = useState(null) // key currently running: persona.id, `cleanup-${id}`, or 'apply'
  const [progress, setProgress] = useState(null) // { done, total }
  const [preview, setPreview] = useState(null) // { persona, summary, elapsedMs, mode: 'review'|'cleanup' }
  const [result, setResult] = useState(null) // summary after apply, with elapsedMs + mode

  if (!backlog) return null

  async function handlePreview(persona) {
    setBusy(persona.id)
    setResult(null)
    const t0 = performance.now()
    try {
      const summary = await backlog.reviewWithPersona(persona, { dryRun: true })
      setPreview({ persona, summary, elapsedMs: performance.now() - t0, mode: 'review' })
    } finally {
      setBusy(null)
    }
  }

  async function handleCleanupPreview(persona) {
    setBusy(`cleanup-${persona.id}`)
    setResult(null)
    const t0 = performance.now()
    try {
      const summary = await backlog.cleanupStatus(persona, { dryRun: true })
      setPreview({ persona, summary, elapsedMs: performance.now() - t0, mode: 'cleanup' })
    } finally {
      setBusy(null)
    }
  }

  async function handleApply() {
    if (!preview) return
    const { persona, mode } = preview
    setBusy('apply')
    setProgress({ done: 0, total: preview.summary.total })
    const t0 = performance.now()
    try {
      const fn = mode === 'cleanup' ? backlog.cleanupStatus : backlog.reviewWithPersona
      const summary = await fn(persona, {
        onProgress: (done, total) => setProgress({ done, total }),
      })
      setPreview(null)
      setResult({ ...summary, elapsedMs: performance.now() - t0, mode })
    } finally {
      setBusy(null)
      setProgress(null)
    }
  }

  const s = preview?.summary
  const isCleanup = preview?.mode === 'cleanup'
  const applyCount = isCleanup ? (s?.moved ?? 0) : ((s?.reviewed ?? 0) + (s?.moved ?? 0))

  return (
    <>
      <Stack gap="sm">
        {/* The "Virtual team" title + groups icon come from the enclosing tab; here we just
            flag that it's dev-only and explain what it does. */}
        <Stack direction="row" gap="xs" align="center" wrap>
          <MessageBadge status="warn" subtle size="sm">Dev only</MessageBadge>
        </Stack>
        <Paragraph size="sm" color="muted">
          Local, deterministic team members that review the backlog like the real thing — no API credits.
          Hidden in production builds. Each runs a preview first; Apply writes changes attributed to the persona.
        </Paragraph>

        <Grid columns={{ xs: 1, md: 2 }} gap="sm">
          {PERSONAS.map((p) => (
            <Card key={p.id}>
              <Stack gap="xs">
                <Stack direction="row" gap="xs" align="center">
                  <Icon name={p.icon} color="accent" />
                  <Heading as="h3" size="xs">{p.name}</Heading>
                </Stack>
                <Paragraph size="sm" color="muted">{p.blurb}</Paragraph>
                <ButtonContainer align="start">
                  <Button size="sm" icon="reviews" loading={busy === p.id} onClick={() => handlePreview(p)}>
                    Review backlog
                  </Button>
                  {p.id === 'product-owner' && (
                    <Button size="sm" variant="secondary" icon="fact_check" loading={busy === `cleanup-${p.id}`} onClick={() => handleCleanupPreview(p)}>
                      Check status
                    </Button>
                  )}
                </ButtonContainer>
              </Stack>
            </Card>
          ))}
        </Grid>

        {result && (
          <Banner
            status="success"
            variant="inline"
            title={result.mode === 'cleanup'
              ? `${result.personaName} — status cleanup complete`
              : `${result.personaName} reviewed the backlog`}
            onDismiss={() => setResult(null)}
          >
            {result.mode === 'cleanup' ? (
              <>
                Moved {result.moved} ticket{result.moved === 1 ? '' : 's'} to match the CHANGELOG
                {' '}({result.skipped} already at the correct status).
              </>
            ) : (
              <>
                Reviewed {result.reviewed} ticket{result.reviewed === 1 ? '' : 's'} ({result.skipped} already up to date)
                {' '}— acted on {result.acted}: {result.reprioritized} reprioritized, {result.resized} resized,
                {' '}{result.questions} clarifying question{result.questions === 1 ? '' : 's'} asked.
                {result.moved > 0 && (
                  <> Moved {result.moved} shipped ticket{result.moved === 1 ? '' : 's'} forward per the CHANGELOG.</>
                )}
              </>
            )}
            {result.elapsedMs != null && (
              <> · {(result.elapsedMs / 1000).toFixed(1)}s (local — no API tokens)</>
            )}
          </Banner>
        )}
      </Stack>

      <Dialog
        open={!!preview}
        onClose={busy ? undefined : () => setPreview(null)}
        title={preview
          ? isCleanup
            ? `${preview.persona.name} — status cleanup`
            : `${preview.persona.name} — proposed review`
          : ''}
        footer={preview ? (
          <Stack gap="xs">
            {preview?.elapsedMs != null && (
              <Paragraph size="xs" color="muted">
                Preview: {(preview.elapsedMs / 1000).toFixed(1)}s (local — no API tokens)
              </Paragraph>
            )}
            <ButtonContainer>
              <Button variant="secondary" onClick={() => setPreview(null)} disabled={busy === 'apply'}>Cancel</Button>
              <Button
                icon="check"
                loading={busy === 'apply'}
                disabled={applyCount === 0}
                onClick={handleApply}
              >
                {busy === 'apply'
                  ? (progress ? `Applying… ${progress.done}/${progress.total}` : 'Applying…')
                  : isCleanup
                    ? (applyCount === 0 ? 'Nothing to update' : `Update ${applyCount} ticket${applyCount === 1 ? '' : 's'}`)
                    : `Apply to ${applyCount} ticket${applyCount === 1 ? '' : 's'}`}
              </Button>
            </ButtonContainer>
          </Stack>
        ) : undefined}
      >
        {preview && (
          <Stack gap="sm">
            {isCleanup ? (
              <Paragraph size="sm">
                Scanned <strong>{s.total}</strong> open tickets against the CHANGELOG.
                {s.moved > 0
                  ? <> Found <strong>{s.moved}</strong> that can be moved to their correct status.</>
                  : <> All tickets are already at the correct status — nothing to update.</>}
              </Paragraph>
            ) : (
              <Paragraph size="sm">
                Of <strong>{s.total}</strong> open tickets, <strong>{s.skipped}</strong> are already reviewed and unchanged.
                {' '}The {preview.persona.role} would (re)review <strong>{s.reviewed}</strong> and act on{' '}
                <strong>{s.acted}</strong> — {s.reprioritized} reprioritized, {s.resized} resized,
                {' '}{s.questions} clarifying question{s.questions === 1 ? '' : 's'}.
                {s.moved > 0 && (
                  <> It would also move <strong>{s.moved}</strong> shipped ticket{s.moved === 1 ? '' : 's'} forward per the CHANGELOG.</>
                )}
              </Paragraph>
            )}
            {applyCount === 0 && !isCleanup && (
              <Paragraph size="sm" color="muted">
                {s.reviewed === 0
                  ? 'Everything is already reviewed and up to date — nothing to do.'
                  : `Reviewed ${s.reviewed}, but nothing needs changing — they already match the ${preview.persona.role}'s view. Apply to record the review tag.`}
              </Paragraph>
            )}
            {s.changes.length > 0 && (
              <>
                <List size="sm">
                  {s.changes.slice(0, PREVIEW_LIMIT).map((c) => (
                    <ListItem key={c.ref}>
                      <strong>{c.ref}</strong> {c.title}
                      {c.status ? <> · {STATUS_LABELS[c.statusFrom ?? c.status]} → {STATUS_LABELS[c.status]}</> : null}
                      {c.priority ? <> · {c.priorityFrom ? PRIORITY_LABELS[c.priorityFrom] : '—'} → {PRIORITY_LABELS[c.priority]}</> : null}
                      {c.complexity ? <> · size {COMPLEXITY_LABELS[c.complexity]}</> : null}
                      {c.questions > 0 ? <> · {c.questions} question{c.questions === 1 ? '' : 's'}</> : null}
                    </ListItem>
                  ))}
                </List>
                {s.changes.length > PREVIEW_LIMIT && (
                  <Paragraph size="xs" color="muted">…and {s.changes.length - PREVIEW_LIMIT} more.</Paragraph>
                )}
              </>
            )}
          </Stack>
        )}
      </Dialog>
    </>
  )
}
