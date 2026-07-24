import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react'
import { Banner, Button, ButtonContainer, Paragraph, Stack } from '@gtivr4/a1-design-system-react'
import { useBacklog } from './BacklogContext'
import { ThreadEntry } from './TicketThreadEntry'
import { PERSONAS } from '../services/backlog/personas'
import { COMPLEXITY_LABELS, PRIORITY_LABELS, TYPE_LABELS } from '../services/backlog/types'
import { useT } from '../labels/useT'

/**
 * Per-ticket Virtual Team review. A button per persona (currently the Product Owner)
 * evaluates *this* ticket — setting type/priority/size, asking clarifying questions, and stamping
 * the review tag. It re-evaluates when the ticket has changed since the last review, and
 * reports "nothing changed" otherwise. Render gated behind `import.meta.env.DEV`.
 */
function Outcome({ persona, result }) {
  if (result.reason === 'unchanged') {
    return <Paragraph size="sm" color="muted">{persona.role}: already reviewed — nothing has changed since.</Paragraph>
  }
  if (result.reason === 'declined') {
    return <Paragraph size="sm" color="muted">{persona.role}: nothing to do here.</Paragraph>
  }
  if (!result.acted) {
    return (
      <Paragraph size="sm" color="muted">
        {persona.role}: reviewed — type, priority, and size already match. {result.rationale}
      </Paragraph>
    )
  }
  const bits = []
  if (result.type) bits.push(`type → ${TYPE_LABELS[result.type]}`)
  if (result.priority) bits.push(`priority → ${PRIORITY_LABELS[result.priority]}`)
  if (result.complexity) bits.push(`size → ${COMPLEXITY_LABELS[result.complexity]}`)
  if (result.questions) bits.push(`${result.questions} question${result.questions > 1 ? 's' : ''} asked`)
  return (
    <Banner status="info" variant="inline" title={`${persona.role} reviewed this ticket`}>
      {result.rationale}{bits.length ? ` Set ${bits.join(', ')}.` : ''}
    </Banner>
  )
}

export const TicketPersonaReview = forwardRef(function TicketPersonaReview({ item, hideActions = false }, ref) {
  const backlog = useBacklog()
  const t = useT()
  const [busy, setBusy] = useState(null) // persona id
  const [outcome, setOutcome] = useState(null) // { persona, result }
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)
  const [thread, setThread] = useState(null)

  useEffect(() => {
    let active = true
    setThread(null)
    backlog?.loadComments(item.id).then((rows) => { if (active) setThread(rows) })
    return () => { active = false }
  }, [item.id, backlog?.loadComments, backlog?.threadVersion])

  const poQuestionIds = useMemo(
    () => new Set((thread ?? [])
      .filter((entry) => entry.kind === 'question' && entry.meta?.persona === 'product-owner')
      .map((entry) => entry.id)),
    [thread],
  )
  const poThread = useMemo(() => (thread ?? []).filter((entry) => (
    entry.meta?.persona === 'product-owner'
      || (entry.kind === 'answer' && poQuestionIds.has(entry.meta?.answersCommentId))
  )), [poQuestionIds, thread])
  const answeredIds = useMemo(
    () => new Set((thread ?? [])
      .filter((entry) => entry.kind === 'answer' && entry.meta?.answersCommentId)
      .map((entry) => entry.meta.answersCommentId)),
    [thread],
  )

  async function review(persona) {
    setBusy(persona.id)
    setOutcome(null)
    setStatus(null)
    setError(null)
    try {
      const result = await backlog.reviewItem(persona, item)
      setOutcome({ persona, result })
    } finally {
      setBusy(null)
    }
  }

  async function reviewWithCodex(persona) {
    setBusy(`${persona.id}:codex`)
    setOutcome(null)
    setError(null)
    setStatus(t('label.app.backlog.virtualPoCodexConnecting', 'Connecting to Codex…'))
    try {
      const result = await backlog.reviewItemWithCodex(persona, item, (phase) => {
        const labels = {
          connecting: 'label.app.backlog.virtualPoCodexConnecting',
          thinking: 'label.app.backlog.virtualPoCodexThinking',
          validating: 'label.app.backlog.virtualPoCodexValidating',
          applying: 'label.app.backlog.virtualPoCodexApplying',
          complete: 'label.app.backlog.virtualPoCodexComplete',
          fallback: 'label.app.backlog.virtualPoCodexFallback',
        }
        const fallbacks = {
          connecting: 'Connecting to Codex…',
          thinking: 'Codex is reviewing the ticket…',
          validating: 'Validating Codex questions…',
          applying: 'Applying questions to the ticket…',
          complete: 'Codex review complete.',
          fallback: 'Codex was unavailable, so the local Product Owner review was used.',
        }
        setStatus(t(labels[phase], fallbacks[phase]))
      })
      setOutcome({ persona, result })
      setStatus(result.source === 'fallback'
        ? t('label.app.backlog.virtualPoCodexFallback', 'Codex was unavailable, so the local Product Owner review was used.')
        : t('label.app.backlog.virtualPoCodexComplete', 'Codex review complete.'))
    } catch (reviewError) {
      setError(reviewError instanceof Error ? reviewError.message : 'Could not apply the Product Owner review.')
      setStatus(null)
    } finally {
      setBusy(null)
    }
  }

  useImperativeHandle(ref, () => ({
    review: () => {
      const persona = PERSONAS.find((candidate) => candidate.id === 'product-owner') || PERSONAS[0]
      return persona ? reviewWithCodex(persona) : Promise.resolve(null)
    },
  }), [reviewWithCodex])

  return (
    <Stack gap="xs">
      {!hideActions && (
        <ButtonContainer align="center">
          {PERSONAS.map((p) => (
            <Button
              key={p.id}
              size="lg"
              variant="secondary"
              icon={p.id === 'product-owner' ? 'auto_awesome' : p.icon}
              loading={busy === p.id || busy === `${p.id}:codex`}
              onClick={() => p.id === 'product-owner' ? reviewWithCodex(p) : review(p)}
            >
              {p.id === 'product-owner'
                ? t('label.app.backlog.virtualPoCodex', 'Review with Product Owner')
                : `Review with ${p.role}`}
            </Button>
          ))}
        </ButtonContainer>
      )}
      {status && <Paragraph size="xs" color="muted" aria-live="polite">{status}</Paragraph>}
      {error && (
        <Banner
          status="error"
          variant="inline"
          title={t('label.app.backlog.virtualPoCodexErrorTitle', 'Product Owner review failed')}
        >
          {error}
        </Banner>
      )}
      {outcome && <Outcome persona={outcome.persona} result={outcome.result} />}
      {outcome?.result?.source === 'fallback' && (
        <Paragraph size="xs" color="muted">
          {t('label.app.backlog.virtualPoCodexFallback', 'Codex was unavailable, so the local Product Owner review was used.')}
        </Paragraph>
      )}
      <Stack gap="xs">
        <Paragraph size="sm">
          {t('label.app.backlog.virtualPoQuestionsAndComments', 'Questions and comments')}
        </Paragraph>
        {thread === null
          ? <Paragraph size="xs" color="muted">{t('label.app.backlog.virtualPoLoadingThread', 'Loading the Product Owner discussion…')}</Paragraph>
          : poThread.length === 0
            ? <Paragraph size="xs" color="muted">{t('label.app.backlog.virtualPoNoThread', 'No Product Owner questions or comments yet.')}</Paragraph>
            : poThread.map((entry) => (
              <ThreadEntry
                key={entry.id}
                entry={entry}
                answered={answeredIds.has(entry.id)}
                onAnswer={(questionId, body, choice) => backlog.answer(item, questionId, body, choice)}
              />
            ))}
      </Stack>
    </Stack>
  )
})
