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
  const [busy, setBusy] = useState(null) // persona id currently running
  const [progress, setProgress] = useState(null) // { done, total }
  const [preview, setPreview] = useState(null) // { persona, summary }
  const [result, setResult] = useState(null) // summary after apply

  if (!backlog) return null

  async function handlePreview(persona) {
    setBusy(persona.id)
    setResult(null)
    try {
      const summary = await backlog.reviewWithPersona(persona, { dryRun: true })
      setPreview({ persona, summary })
    } finally {
      setBusy(null)
    }
  }

  async function handleApply() {
    if (!preview) return
    const { persona } = preview
    setBusy(persona.id)
    setProgress({ done: 0, total: preview.summary.total })
    try {
      const summary = await backlog.reviewWithPersona(persona, {
        onProgress: (done, total) => setProgress({ done, total }),
      })
      setPreview(null)
      setResult(summary)
    } finally {
      setBusy(null)
      setProgress(null)
    }
  }

  const s = preview?.summary

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
                  <Button size="sm" icon="reviews" loading={busy === p.id && !preview} onClick={() => handlePreview(p)}>
                    Review backlog
                  </Button>
                </ButtonContainer>
              </Stack>
            </Card>
          ))}
        </Grid>

        {result && (
          <Banner
            status="success"
            variant="inline"
            title={`${result.personaName} reviewed the backlog`}
            onDismiss={() => setResult(null)}
          >
            Reviewed {result.reviewed} ticket{result.reviewed === 1 ? '' : 's'} ({result.skipped} already up to date)
            {' '}— acted on {result.acted}: {result.reprioritized} reprioritized, {result.resized} resized,
            {' '}{result.questions} clarifying question{result.questions === 1 ? '' : 's'} asked.
            {result.moved > 0 && (
              <> Moved {result.moved} shipped ticket{result.moved === 1 ? '' : 's'} forward per the CHANGELOG.</>
            )}
          </Banner>
        )}
      </Stack>

      <Dialog
        open={!!preview}
        onClose={busy ? undefined : () => setPreview(null)}
        title={preview ? `${preview.persona.name} — proposed review` : ''}
        footer={preview ? (
          <ButtonContainer>
            <Button variant="secondary" onClick={() => setPreview(null)} disabled={!!busy}>Cancel</Button>
            <Button
              icon="check"
              loading={!!busy}
              disabled={s.reviewed === 0 && s.moved === 0}
              onClick={handleApply}
            >
              {busy
                ? (progress ? `Applying… ${progress.done}/${progress.total}` : 'Applying…')
                : `Apply to ${s.reviewed + s.moved} ticket${s.reviewed + s.moved === 1 ? '' : 's'}`}
            </Button>
          </ButtonContainer>
        ) : undefined}
      >
        {preview && (
          <Stack gap="sm">
            <Paragraph size="sm">
              Of <strong>{s.total}</strong> open tickets, <strong>{s.skipped}</strong> are already reviewed and unchanged.
              {' '}The {preview.persona.role} would (re)review <strong>{s.reviewed}</strong> and act on{' '}
              <strong>{s.acted}</strong> — {s.reprioritized} reprioritized, {s.resized} resized,
              {' '}{s.questions} clarifying question{s.questions === 1 ? '' : 's'}.
              {s.moved > 0 && (
                <> It would also move <strong>{s.moved}</strong> shipped ticket{s.moved === 1 ? '' : 's'} forward per the CHANGELOG.</>
              )}
            </Paragraph>
            {s.acted === 0 && s.moved === 0 ? (
              <Paragraph size="sm" color="muted">
                {s.reviewed === 0
                  ? 'Everything is already reviewed and up to date — nothing to do.'
                  : `Reviewed ${s.reviewed}, but nothing needs changing — they already match the ${preview.persona.role}'s view. Apply to record the review tag.`}
              </Paragraph>
            ) : (
              <>
                <List size="sm">
                  {s.changes.slice(0, PREVIEW_LIMIT).map((c) => (
                    <ListItem key={c.ref}>
                      <strong>{c.ref}</strong> {c.title}
                      {c.status ? <> · shipped → {STATUS_LABELS[c.status]}</> : null}
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
