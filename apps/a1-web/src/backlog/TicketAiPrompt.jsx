import { useEffect, useMemo, useState } from 'react'
import { Button, ButtonContainer, Code, Paragraph, Stack } from '@gtivr4/a1-design-system-react'
import { useBacklog } from './BacklogContext'
import {
  COMPLEXITY_FULL, PRIORITY_LABELS, SCOPE_LABELS, STATUS_LABELS, TYPE_LABELS, ticketRef,
} from '../services/backlog/types'

/**
 * Builds a complete, copy-pasteable AI prompt from a ticket — its metadata, description,
 * and discussion (comments + the PO's questions and your answers) — so you can paste it
 * into a coding-agent chat. Rendered as an editable code block so you can tweak it first.
 */
function buildPrompt(item, comments) {
  const meta = [`Type: ${TYPE_LABELS[item.type]}`]
  if (item.priority) meta.push(`Priority: ${PRIORITY_LABELS[item.priority]}`)
  if (item.complexity) meta.push(`Size: ${COMPLEXITY_FULL[item.complexity]}`)
  meta.push(`Status: ${STATUS_LABELS[item.status]}`)
  meta.push(`Scope: ${item.scopeKind === 'general'
    ? 'General'
    : SCOPE_LABELS[item.scopeKind] + (item.scopeLabel ? ` — ${item.scopeLabel}` : '')}`)

  const lines = [`Implement backlog ticket ${ticketRef(item.number)}: ${item.title}`, '', meta.join(' · '), '']
  if (item.description?.trim()) lines.push('Description:', item.description.trim(), '')

  const discussion = (comments || []).filter((c) => c.kind !== 'activity' && c.body?.trim())
  if (discussion.length) {
    lines.push('Discussion:')
    for (const c of discussion) {
      const who = c.meta?.personaName || c.userEmail || 'Someone'
      const tag = c.kind === 'question' ? ' (question)' : c.kind === 'answer' ? ' (answer)' : ''
      lines.push(`- ${who}${tag}: ${c.body.trim().replace(/\s*\n\s*/g, ' ')}`)
    }
    lines.push('')
  }

  lines.push(
    'Implement this in the A1 Design System monorepo, following the project conventions '
    + '(read CLAUDE.md / AGENTS.md and packages/react/ai/ — use A1 components + tokens, and update '
    + 'Storybook stories, the a1-web configurator, and the changelogs as the rules require). '
    + 'Work on a branch, then summarise what you changed.',
  )
  return lines.join('\n')
}

export function TicketAiPrompt({ item }) {
  const backlog = useBacklog()
  const [comments, setComments] = useState(null) // null = loading
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    let active = true
    setComments(null)
    backlog?.loadComments(item.id).then((rows) => { if (active) setComments(rows) })
    return () => { active = false }
  }, [item.id, backlog, nonce])

  const prompt = useMemo(() => buildPrompt(item, comments || []), [item, comments])

  return (
    <Stack gap="sm">
      <Paragraph size="sm" color="muted">
        A ready-to-paste prompt with everything about this ticket. Edit it if you like, then copy it into your AI chat to implement the ticket.
      </Paragraph>
      {comments === null
        ? <Paragraph size="sm" color="muted">Assembling…</Paragraph>
        : <Code variant="block" editable copyCode wrapping key={`${item.id}:${nonce}`}>{prompt}</Code>}
      <ButtonContainer align="start">
        <Button size="sm" variant="secondary" icon="refresh" onClick={() => setNonce((n) => n + 1)}>
          Regenerate
        </Button>
      </ButtonContainer>
    </Stack>
  )
}
