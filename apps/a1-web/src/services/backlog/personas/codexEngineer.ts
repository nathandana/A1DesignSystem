import type { BacklogComment, BacklogItem } from '../types'
import { CodexBridgeError, commentPayload, normalizeQuestions, ticketPayload } from './codexProductOwner'
import type { PersonaQuestion } from './types'
import { stripIrrelevantCssSections } from '../devPlan'

const BRIDGE_HOST = 'http://127.0.0.1:4318'
const REQUEST_TIMEOUT_MS = 135_000
const WORK_TYPES = ['component', 'layout', 'styling', 'content', 'data', 'bug', 'docs', 'testing', 'architecture', 'mixed', 'unknown'] as const

export type EngineerWorkType = (typeof WORK_TYPES)[number]
export type EngineerStatus = 'connecting' | 'thinking' | 'classifying' | 'validating' | 'complete'

export interface EngineerPlanResult {
  workType: EngineerWorkType;
  cssRelevant: boolean;
  summary: string;
  questions: PersonaQuestion[];
  plan: string;
}

function bridgeHost(): string {
  try { return localStorage.getItem('a1-codex-bridge-host') || BRIDGE_HOST } catch { return BRIDGE_HOST }
}

function clean(value: unknown, max = 400): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function normalizeResult(value: unknown): EngineerPlanResult {
  const result = value && typeof value === 'object' ? value as Record<string, unknown> : {}
  const workType = WORK_TYPES.includes(result.workType as EngineerWorkType)
    ? result.workType as EngineerWorkType
    : 'unknown'
  return {
    workType,
    cssRelevant: result.cssRelevant === true,
    summary: clean(result.summary, 240),
    questions: normalizeQuestions(result.questions, 3),
    plan: stripIrrelevantCssSections(clean(result.plan, 30_000), result.cssRelevant === true),
  }
}

/** Ask the local Codex bridge to classify a ticket, ask only blocking questions, and plan it. */
export async function askCodexEngineer(
  item: BacklogItem,
  comments: BacklogComment[],
  relatedItems: BacklogItem[] = [],
  manualFeedback = '',
  previousQuestions: PersonaQuestion[] = [],
  questionAnswers: Record<string, { text?: string; choice?: string }> = {},
  onStatus?: (status: EngineerStatus) => void,
): Promise<EngineerPlanResult> {
  onStatus?.('connecting')
  const controller = new AbortController()
  const thinkingTimer = window.setTimeout(() => onStatus?.('thinking'), 700)
  const classifyTimer = window.setTimeout(() => onStatus?.('classifying'), 2500)
  const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const response = await fetch(`${bridgeHost()}/codex/backlog/engineer-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        ticket: ticketPayload(item),
        comments: commentPayload(comments),
        relatedItems: relatedItems.filter((candidate) => candidate.id !== item.id).slice(0, 20).map(ticketPayload),
        manualFeedback: clean(manualFeedback, 4000),
        previousQuestions: previousQuestions.map((question) => ({ key: question.key, text: question.text })),
        questionAnswers,
      }),
    })
    if (!response.ok) throw new CodexBridgeError(`CODEX_BRIDGE_HTTP_${response.status}`, `HTTP_${response.status}`)
    onStatus?.('validating')
    const payload = await response.json()
    if (!payload?.ok) throw new CodexBridgeError(clean(payload?.error) || 'CODEX_BRIDGE_REJECTED')
    const result = normalizeResult(payload.result)
    if (!result.plan) throw new CodexBridgeError('CODEX_ENGINEER_EMPTY_PLAN', 'EMPTY_PLAN')
    onStatus?.('complete')
    return result
  } catch (error) {
    if (error instanceof CodexBridgeError) throw error
    throw new CodexBridgeError(error instanceof Error ? error.message : 'CODEX_BRIDGE_UNREACHABLE', 'UNREACHABLE')
  } finally {
    window.clearTimeout(thinkingTimer)
    window.clearTimeout(classifyTimer)
    window.clearTimeout(timer)
  }
}
