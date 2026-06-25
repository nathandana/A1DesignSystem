import { useState } from 'react'
import { Banner, Button, ButtonContainer, Paragraph, Stack } from '@gtivr4/a1-design-system-react'
import { useBacklog } from './BacklogContext'
import { PERSONAS } from '../services/backlog/personas'
import { COMPLEXITY_LABELS, PRIORITY_LABELS, TYPE_LABELS } from '../services/backlog/types'

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

export function TicketPersonaReview({ item }) {
  const backlog = useBacklog()
  const [busy, setBusy] = useState(null) // persona id
  const [outcome, setOutcome] = useState(null) // { persona, result }

  async function review(persona) {
    setBusy(persona.id)
    setOutcome(null)
    try {
      const result = await backlog.reviewItem(persona, item)
      setOutcome({ persona, result })
    } finally {
      setBusy(null)
    }
  }

  return (
    <Stack gap="xs">
      <ButtonContainer align="start">
        {PERSONAS.map((p) => (
          <Button key={p.id} size="sm" variant="secondary" icon={p.icon} loading={busy === p.id} onClick={() => review(p)}>
            Review with {p.role}
          </Button>
        ))}
      </ButtonContainer>
      {outcome && <Outcome persona={outcome.persona} result={outcome.result} />}
    </Stack>
  )
}
