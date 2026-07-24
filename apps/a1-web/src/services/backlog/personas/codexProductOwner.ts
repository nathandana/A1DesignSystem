import { listComments } from '../backlogStore'
import { runPersonaOnItem, reviewOne } from './runPersona'
import type { BacklogComment, BacklogItem } from '../types'
import type { Persona, PersonaItemOutcome, PersonaQuestion } from './types'

const BRIDGE_HOST = 'http://127.0.0.1:4318'
// Codex may take longer than a normal browser request, especially on the first local
// invocation. Keep this just above the bridge's 120-second process limit.
const REQUEST_TIMEOUT_MS = 135_000

function bridgeHost(): string {
  try {
    return localStorage.getItem('a1-codex-bridge-host') || BRIDGE_HOST
  } catch {
    return BRIDGE_HOST
  }
}

function clean(value: unknown, max = 400): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

export function normalizeQuestion(value: unknown, index: number): PersonaQuestion | null {
  if (!value || typeof value !== 'object') return null
  const record = value as Record<string, unknown>
  const text = clean(record.text, 500)
  if (!text) return null
  const options = Array.isArray(record.options)
    ? record.options.map((option) => clean(option, 160)).filter(Boolean).slice(0, 4)
    : undefined
  return {
    key: clean(record.key, 80) || `codex-question-${index + 1}`,
    text,
    ...(options?.length ? { options, allowOther: record.allowOther !== false } : {}),
  }
}

export function normalizeQuestions(value: unknown, max = 2): PersonaQuestion[] {
  if (!Array.isArray(value)) return []
  const seen = new Set<string>()
  const texts = new Set<string>()
  return value
    .map((question, index) => normalizeQuestion(question, index))
    .filter((question): question is PersonaQuestion => {
      if (!question || seen.has(question.key) || texts.has(question.text.toLowerCase())) return false
      seen.add(question.key)
      texts.add(question.text.toLowerCase())
      return true
    })
    .slice(0, max)
}

export function commentPayload(comments: BacklogComment[]) {
  return comments
    .filter((comment) => comment.kind === 'question' || comment.kind === 'answer' || comment.kind === 'comment')
    .slice(-20)
    .map((comment) => ({
      kind: comment.kind,
      body: clean(comment.body, 1200),
      questionKey: typeof comment.meta?.questionKey === 'string' ? comment.meta.questionKey : undefined,
    }))
}

export function ticketPayload(item: BacklogItem) {
  return {
    ref: `A1-${item.number}`,
    title: item.title,
    description: item.description || '',
    type: item.type,
    status: item.status,
    priority: item.priority,
    complexity: item.complexity,
    scope: { kind: item.scopeKind, ref: item.scopeRef, label: item.scopeLabel },
    votes: item.voteCount,
  }
}

export class CodexBridgeError extends Error {
  code: string

  constructor(message: string, code = 'CODEX_BRIDGE_ERROR') {
    super(message)
    this.name = 'CodexBridgeError'
    this.code = code
  }
}

/** Ask the local bridge for better questions. Throws so callers can use the heuristic fallback. */
export async function askCodexProductOwnerQuestions(
  item: BacklogItem,
  relatedItems: BacklogItem[] = [],
  onStatus?: (status: 'connecting' | 'thinking' | 'validating' | 'applying' | 'complete' | 'fallback') => void,
): Promise<PersonaQuestion[]> {
  const comments = await listComments(item.id)
  onStatus?.('connecting')
  const controller = new AbortController()
  const thinkingTimer = window.setTimeout(() => onStatus?.('thinking'), 700)
  const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const response = await fetch(`${bridgeHost()}/codex/backlog/product-owner-questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        ticket: ticketPayload(item),
        comments: commentPayload(comments),
        relatedItems: relatedItems.filter((candidate) => candidate.id !== item.id).slice(0, 20).map(ticketPayload),
      }),
    })
    if (!response.ok) throw new CodexBridgeError(`CODEX_BRIDGE_HTTP_${response.status}`, `HTTP_${response.status}`)
    onStatus?.('validating')
    const payload = await response.json()
    if (!payload?.ok) throw new CodexBridgeError(clean(payload?.error) || 'CODEX_BRIDGE_REJECTED')
    return normalizeQuestions(payload.result?.questions)
  } catch (error) {
    if (error instanceof CodexBridgeError) throw error
    throw new CodexBridgeError(error instanceof Error ? error.message : 'CODEX_BRIDGE_UNREACHABLE', 'UNREACHABLE')
  } finally {
    window.clearTimeout(thinkingTimer)
    window.clearTimeout(timer)
  }
}

/** Review one ticket with Codex-generated questions and deterministic field decisions. */
export async function runPersonaOnItemWithCodex(
  persona: Persona,
  item: BacklogItem,
  items: BacklogItem[] = [],
  onStatus?: (status: 'connecting' | 'thinking' | 'validating' | 'applying' | 'complete' | 'fallback') => void,
): Promise<PersonaItemOutcome & { source?: 'codex' | 'fallback' }> {
  const deterministic = persona.evaluate(item, { items })
  if (!deterministic) return runPersonaOnItem(persona, item, items)

  try {
    const questions = await askCodexProductOwnerQuestions(item, items, onStatus)
    onStatus?.('applying')
    const result = await reviewOne(persona, item, {
      items,
      // A valid empty response should not erase the deterministic PO's useful question
      // bank; it means Codex found no better wording, not that clarification is complete.
      verdict: { ...deterministic, questions: questions.length ? questions : deterministic.questions },
      reviewId: `${persona.id}:codex`,
      policyRevision: 1,
    })
    onStatus?.('complete')
    return { ...result, source: 'codex' }
  } catch {
    onStatus?.('fallback')
    return { ...(await runPersonaOnItem(persona, item, items)), source: 'fallback' }
  }
}
