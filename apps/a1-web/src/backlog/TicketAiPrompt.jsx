import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react'
import { Banner, Button, ButtonContainer, CircularProgress, Code, Icon, Paragraph, Stack, TextField } from '@gtivr4/a1-design-system-react'
import { useBacklog } from './BacklogContext'
import { QuestionChoices } from './TicketThreadEntry'
import { useT } from '../labels/useT'
import {
  buildTicketContext, buildPlanRequest, classifyWork, developPlanLocally, ensureFinalStandardsReview,
  getOpenQuestions, hasProductOwnerReview, PLAN_SYSTEM,
} from '../services/backlog/devPlan'
import { askCodexEngineer } from '../services/backlog/personas/codexEngineer'
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
        return {
          plan: ensureFinalStandardsReview(r.text, classifyWork(item).cssRelevant),
          source: 'local',
          info: { model: r.model, elapsedMs: r.elapsedMs, outputTokens: r.outputTokens },
        }
      }
    } catch {
      /* local runner errored — fall back below */
    }
  }
  return { plan: developPlanLocally(item, comments, linked), source: 'builtin', info: null }
}

// Free-text answer for an engineer question with no preset options. Mirrors the
// QuestionChoices submit affordance so the dialog feels the same either way.
function FreeAnswer({ onAnswer, submitLabel = 'Save answer' }) {
  const [value, setValue] = useState('')
  return (
    <Stack gap="xs">
      <TextField label="Your answer" size="compact" value={value} onChange={(e) => setValue(e.target.value)} autoComplete="off" />
      <ButtonContainer align="start">
        <Button size="sm" icon="reply" disabled={!value.trim()} onClick={() => onAnswer(value.trim())}>{submitLabel}</Button>
      </ButtonContainer>
    </Stack>
  )
}

export const TicketAiPrompt = forwardRef(function TicketAiPrompt({ item, hideEngineerAction = false }, ref) {
  const t = useT()
  const backlog = useBacklog()
  const [comments, setComments] = useState(null) // null = loading
  const [plan, setPlan] = useState('')
  const [planning, setPlanning] = useState(false)
  const [source, setSource] = useState(null) // 'local' | 'builtin' | 'codex'
  const [info, setInfo] = useState(null) // { model, elapsedMs, outputTokens }
  const [mode, setMode] = useState('plan') // 'plan' | 'raw'
  const [codexBusy, setCodexBusy] = useState(false)
  const [codexStatus, setCodexStatus] = useState(null)
  const [codexError, setCodexError] = useState(null)
  const [codexQuestions, setCodexQuestions] = useState([])
  const [codexWorkType, setCodexWorkType] = useState(null)
  const [codexCssRelevant, setCodexCssRelevant] = useState(null)
  const [codexPlan, setCodexPlan] = useState('')
  const [codexAnswers, setCodexAnswers] = useState({}) // { [question.key]: { text, choice? } }

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
    setCodexStatus(null)
    setCodexError(null)
    setCodexQuestions([])
    setCodexWorkType(null)
    setCodexCssRelevant(null)
    setCodexPlan('')
    setCodexAnswers({})
    backlog?.loadComments(item.id).then((rows) => { if (active) setComments(rows) })
    return () => { active = false }
  }, [item.id, backlog, backlog?.threadVersion])

  // Develop the plan once the thread is loaded.
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
  }, [comments, item, linked])

  const rawDetails = comments === null ? '' : buildTicketContext(item, comments, linked)
  const shown = mode === 'plan' ? plan : rawDetails
  const discussion = comments?.filter((c) => c.kind !== 'activity' && c.body?.trim()) ?? []
  const openQuestions = comments === null ? [] : getOpenQuestions(comments)
  const needsProductOwnerReview = import.meta.env.DEV
    && comments !== null
    && !hasProductOwnerReview(item, comments)

  // A dialog turn with the engineer. First run: no prior questions/answers. Follow-up
  // runs pass the questions it last asked plus the requester's inline answers, so the
  // engineer refines its guidance in a back-and-forth — like the Product Owner does.
  async function askEngineer(previousQuestions = [], answers = {}) {
    if (comments === null || codexBusy) return
    setCodexBusy(true)
    setCodexError(null)
    setCodexStatus(t('label.app.backlog.buildWithAiCodexConnecting', 'Connecting to the virtual engineer…'))
    try {
      const result = await askCodexEngineer(
        item,
        comments,
        linked,
        '',
        previousQuestions,
        answers,
        (status) => {
          const labels = {
            connecting: 'label.app.backlog.buildWithAiCodexConnecting',
            thinking: 'label.app.backlog.buildWithAiCodexThinking',
            classifying: 'label.app.backlog.buildWithAiCodexClassifying',
            validating: 'label.app.backlog.buildWithAiCodexValidating',
            complete: 'label.app.backlog.buildWithAiCodexComplete',
          }
          const fallbacks = {
            connecting: 'Connecting to the virtual engineer…',
            thinking: 'The virtual engineer is reading the ticket…',
            classifying: 'Classifying the work…',
            validating: 'Validating the plan…',
            complete: 'Virtual engineer guidance added to the build instructions.',
          }
          setCodexStatus(t(labels[status], fallbacks[status]))
        },
      )
      // Keep the original Build with AI instructions intact. Codex adds a focused
      // implementation supplement rather than replacing the plan the user already has.
      setCodexPlan(result.plan)
      setSource('codex')
      setInfo(null)
      setCodexQuestions(result.questions)
      setCodexAnswers({}) // fresh round for any newly-asked questions
      setCodexWorkType(result.workType)
      setCodexCssRelevant(result.cssRelevant)
      setCodexStatus(t('label.app.backlog.buildWithAiEngineerAddedGuidance', 'Virtual engineer guidance added to the existing build instructions.'))
    } catch (error) {
      setCodexError(error instanceof Error ? error.message : 'Could not reach the virtual engineer.')
      setCodexStatus(null)
    } finally {
      setCodexBusy(false)
    }
  }

  useImperativeHandle(ref, () => ({ review: () => askEngineer() }), [askEngineer])

  const answeredCount = Object.keys(codexAnswers).length
  const setAnswer = (key, value) => setCodexAnswers((prev) => ({ ...prev, [key]: value }))

  const shownPlan = source === 'codex' && codexPlan
    ? `${plan.trim()}\n\n## Virtual engineer guidance\n${codexPlan.trim()}`
    : plan

  return (
    <Stack gap="sm">
      <Paragraph size="sm" color="muted">
        Develops a plan you can paste into a coding agent. Uses a local AI model when one is reachable,
        and falls back to a built-in staff-developer planner when not. Edit it before copying if you like.
      </Paragraph>

      {needsProductOwnerReview && (
        <Banner
          status="warn"
          variant="inline"
          title={t('label.app.backlog.buildWithAiVirtualPoNotRun', 'Virtual PO has not reviewed this ticket')}
        >
          {t('label.app.backlog.buildWithAiVirtualPoNotRunBody', 'Run the Virtual PO review first if you want product questions included in the build context.')}
        </Banner>
      )}
      {openQuestions.length > 0 && (
        <Banner
          status="warn"
          variant="inline"
          title={t('label.app.backlog.buildWithAiOutstandingQuestions', 'Outstanding questions')}
        >
          {openQuestions.length} {openQuestions.length === 1
            ? t('label.app.backlog.buildWithAiOutstandingQuestion', 'question is unanswered.')
            : t('label.app.backlog.buildWithAiOutstandingQuestionsPlural', 'questions are unanswered.')}
          {' '}{t('label.app.backlog.buildWithAiQuestionsIncluded', 'They are included in the build context.')}
        </Banner>
      )}
      {discussion.length > 0 && (
        <Paragraph size="xs" color="muted">
          {discussion.length} {discussion.length === 1
            ? t('label.app.backlog.buildWithAiDiscussionEntry', 'comment or Q&A entry')
            : t('label.app.backlog.buildWithAiDiscussionEntries', 'comments and Q&A entries')}{' '}
          {t('label.app.backlog.buildWithAiDiscussionIncluded', 'are included in this plan.')}
        </Paragraph>
      )}
      {codexQuestions.length > 0 && (
        <Banner
          status="info"
          variant="inline"
          title={t('label.app.backlog.buildWithAiCodexQuestions', 'Virtual engineer questions')}
        >
          <Stack gap="sm">
            <Paragraph size="xs" color="muted">
              {t('label.app.backlog.buildWithAiCodexQuestionsHint', 'Answer inline and the engineer will fold your answers into the build guidance — the same way the Product Owner works.')}
            </Paragraph>
            {codexQuestions.map((question) => {
              const answer = codexAnswers[question.key]
              return (
                <Stack key={question.key} gap="xs">
                  <Paragraph size="sm">{question.text}</Paragraph>
                  {answer ? (
                    <Stack direction="row" gap="xs" align="center" wrap>
                      <Icon name="check_circle" color="success" size="sm" />
                      <Paragraph size="xs" color="muted">{answer.text}</Paragraph>
                      <Button size="sm" variant="tertiary" icon="undo" onClick={() => setCodexAnswers(({ [question.key]: _drop, ...rest }) => rest)}>
                        {t('label.app.backlog.buildWithAiCodexAnswerChange', 'Change')}
                      </Button>
                    </Stack>
                  ) : question.options?.length ? (
                    <QuestionChoices
                      options={question.options}
                      allowOther={question.allowOther !== false}
                      submitLabel={t('label.app.backlog.buildWithAiCodexSaveAnswer', 'Save answer')}
                      onAnswer={(text, choice) => setAnswer(question.key, { text, choice })}
                    />
                  ) : (
                    <FreeAnswer
                      submitLabel={t('label.app.backlog.buildWithAiCodexSaveAnswer', 'Save answer')}
                      onAnswer={(text) => setAnswer(question.key, { text })}
                    />
                  )}
                </Stack>
              )
            })}
            <ButtonContainer align="start">
              <Button
                size="sm"
                icon="auto_awesome"
                loading={codexBusy}
                disabled={answeredCount === 0}
                onClick={() => askEngineer(codexQuestions, codexAnswers)}
              >
                {answeredCount === 0
                  ? t('label.app.backlog.buildWithAiCodexAnswerToContinue', 'Answer a question to continue')
                  : t('label.app.backlog.buildWithAiCodexRefine', `Send ${answeredCount} answer${answeredCount === 1 ? '' : 's'} & refine guidance`)}
              </Button>
            </ButtonContainer>
          </Stack>
        </Banner>
      )}
      {codexStatus && <Paragraph size="xs" color="muted" aria-live="polite">{codexStatus}</Paragraph>}
      {codexError && (
        <Banner
          status="error"
          variant="inline"
          title={t('label.app.backlog.buildWithAiCodexErrorTitle', 'Virtual engineer unavailable')}
        >
          {codexError} {t('label.app.backlog.buildWithAiCodexErrorBody', 'The existing local planner remains available.')}
        </Banner>
      )}
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
          {mode === 'plan' && source === 'codex' && codexWorkType && (
            <Paragraph size="xs" color="muted">
              {t('label.app.backlog.buildWithAiCodexClassification', 'Classified as')} {codexWorkType}{' · '}
              {codexCssRelevant
                ? t('label.app.backlog.buildWithAiCodexStylingIncluded', 'styling guidance included')
                : t('label.app.backlog.buildWithAiCodexStylingOmitted', 'styling guidance omitted')}.
            </Paragraph>
          )}
          {mode === 'plan' && source === 'builtin' && (
            <Paragraph size="xs" color="muted">
              Planned with the built-in staff-developer planner. Start a local model (Ollama) and it will
              write the plan instead — still no API credits.
            </Paragraph>
          )}
          <Code variant="block" editable copyCode wrapping key={`${item.id}:${mode}:${source}:${codexPlan}`}>
            {mode === 'plan' ? shownPlan : shown}
          </Code>
        </>
      )}

      <ButtonContainer align="start">
        {!hideEngineerAction && (
          <Button size="sm" variant="secondary" icon="auto_awesome" loading={codexBusy} disabled={comments === null} onClick={() => askEngineer()}>
            {t('label.app.backlog.buildWithAiReviewEngineer', 'Review with Engineer')}
          </Button>
        )}
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
})
