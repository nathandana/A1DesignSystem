import { useEffect, useMemo, useState } from 'react'
import { Button, ButtonContainer, CircularProgress, Code, Paragraph, Stack } from '@gtivr4/a1-design-system-react'
import { useBacklog } from './BacklogContext'
import { buildTicketContext, buildPlanRequest, developPlanLocally, PLAN_SYSTEM } from '../services/backlog/devPlan'
import { chooseModel, listLocalModels, localChat } from '../lib/localAi'

/**
 * "Build with AI" — turns a ticket into a **development plan** you can paste into a coding
 * agent. Rather than just concatenating the ticket fields, it sends them to a **local** LLM
 * (Ollama, via `lib/localAi.ts`) when available. If no local model is reachable it falls back to a
 * deterministic planner, so the production tab still works without API keys, browser secrets, or
 * tab always produces a real, editable plan. A "raw details" toggle still exposes the plain
 * ticket text.
 */

// Produce a plan: prefer a local model, fall back to the deterministic planner.
async function produce(item, comments, linked) {
  const models = await listLocalModels()
  const model = chooseModel(models)
  if (model) {
    try {
      const r = await localChat({ system: PLAN_SYSTEM, prompt: buildPlanRequest(item, comments, linked), model })
      if (r.text) {
        return { plan: r.text, source: 'local', info: { model: r.model, elapsedMs: r.elapsedMs, outputTokens: r.outputTokens } }
      }
    } catch {
      /* local runner errored — fall back below */
    }
  }
  return { plan: developPlanLocally(item, comments, linked), source: 'builtin', info: null }
}

export function TicketAiPrompt({ item }) {
  const backlog = useBacklog()
  const [comments, setComments] = useState(null) // null = loading
  const [plan, setPlan] = useState('')
  const [planning, setPlanning] = useState(false)
  const [source, setSource] = useState(null) // 'local' | 'builtin'
  const [info, setInfo] = useState(null) // { model, elapsedMs, outputTokens }
  const [mode, setMode] = useState('plan') // 'plan' | 'raw'
  const [nonce, setNonce] = useState(0)

  // The tickets linked to this one (A1-218) become context for the plan (A1-283) so
  // related/should-ship-together work isn't planned in isolation.
  const linked = useMemo(() => {
    const ids = new Set(item.links ?? [])
    return ids.size ? (backlog?.items ?? []).filter((i) => ids.has(i.id)) : []
  }, [item.links, backlog?.items])

  // Load the discussion thread for this ticket.
  useEffect(() => {
    let active = true
    setComments(null)
    setPlan('')
    setSource(null)
    setInfo(null)
    backlog?.loadComments(item.id).then((rows) => { if (active) setComments(rows) })
    return () => { active = false }
  }, [item.id, backlog])

  // Develop the plan once the thread is loaded (and on each Regenerate).
  useEffect(() => {
    if (comments === null) return undefined
    let active = true
    setPlanning(true)
    produce(item, comments, linked).then((res) => {
      if (!active) return
      setPlan(res.plan)
      setSource(res.source)
      setInfo(res.info)
      setPlanning(false)
    })
    return () => { active = false }
  }, [comments, item, linked, nonce])

  const rawDetails = comments === null ? '' : buildTicketContext(item, comments, linked)
  const shown = mode === 'plan' ? plan : rawDetails

  return (
    <Stack gap="sm">
      <Paragraph size="sm" color="muted">
        Develops a plan you can paste into a coding agent. Uses a local AI model when one is reachable,
        and falls back to a built-in staff-developer planner when not. Edit it before copying if you like.
      </Paragraph>

      {comments === null || planning ? (
        <Stack direction="row" gap="sm" align="center">
          <CircularProgress size="sm" indeterminate aria-label="Developing a plan" />
          <Paragraph size="sm" color="muted">
            {comments === null ? 'Reading the ticket…' : 'Developing a plan locally…'}
          </Paragraph>
        </Stack>
      ) : (
        <>
          {mode === 'plan' && source === 'local' && info && (
            <Paragraph size="xs" color="muted">
              Planned locally with {info.model} · {(info.elapsedMs / 1000).toFixed(1)}s
              {info.outputTokens ? ` · ${info.outputTokens} local tokens` : ''} — no API credits.
            </Paragraph>
          )}
          {mode === 'plan' && source === 'builtin' && (
            <Paragraph size="xs" color="muted">
              Planned with the built-in staff-developer planner. Start a local model (Ollama) and it will
              write the plan instead — still no API credits.
            </Paragraph>
          )}
          <Code variant="block" editable copyCode wrapping key={`${item.id}:${mode}:${nonce}:${source}`}>
            {shown}
          </Code>
        </>
      )}

      <ButtonContainer align="start">
        <Button size="sm" variant="secondary" icon="refresh" loading={planning} onClick={() => setNonce((n) => n + 1)}>
          Regenerate plan
        </Button>
        <Button
          size="sm"
          variant="tertiary"
          icon={mode === 'plan' ? 'description' : 'auto_awesome'}
          disabled={comments === null}
          onClick={() => setMode((m) => (m === 'plan' ? 'raw' : 'plan'))}
        >
          {mode === 'plan' ? 'Show raw ticket details' : 'Show the plan'}
        </Button>
      </ButtonContainer>
    </Stack>
  )
}
