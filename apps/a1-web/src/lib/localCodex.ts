const HOST_KEY = 'a1-codex-bridge-host'
const DEFAULT_HOST = 'http://localhost:4317'

export type CodexReviewSeverity = 'info' | 'warn' | 'error'

export interface CodexReviewViolation {
  severity: CodexReviewSeverity
  rule: string
  nodeId: string
  message: string
  suggestedFix: string
}

export interface CodexPageReview {
  summary: string
  violations: CodexReviewViolation[]
  shouldBecomeGuidance: string[]
}

export interface CodexIconSuggestion {
  name: string
  reason: string
}

export interface CodexCustomIconCandidate {
  name: string
}

export interface CodexReviewResponse {
  ok: boolean
  result: CodexPageReview
  elapsedMs: number
  usage?: CodexUsage
  raw?: string
  events?: unknown[]
}

export interface CodexUsage {
  inputTokens: number | null
  outputTokens: number | null
  totalTokens: number | null
  reported: boolean
}

export function localCodexBridgeHost(): string {
  try {
    return localStorage.getItem(HOST_KEY) || DEFAULT_HOST
  } catch {
    return DEFAULT_HOST
  }
}

export function setLocalCodexBridgeHost(host: string): void {
  try {
    if (host.trim()) localStorage.setItem(HOST_KEY, host.trim())
    else localStorage.removeItem(HOST_KEY)
  } catch {
    /* ignore */
  }
}

export async function checkLocalCodexBridge(timeoutMs = 1500): Promise<boolean> {
  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), timeoutMs)
    const res = await fetch(`${localCodexBridgeHost()}/health`, { signal: ctrl.signal })
    clearTimeout(timer)
    if (!res.ok) return false
    const data = await res.json()
    return data?.ok === true
  } catch {
    return false
  }
}

export async function reviewPageWithCodex({
  definition,
  instruction,
  timeoutMs = 180000,
}: {
  definition: unknown
  instruction?: string
  timeoutMs?: number
}): Promise<CodexReviewResponse> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(`${localCodexBridgeHost()}/codex/review-page`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
      body: JSON.stringify({ definition, instruction }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || data?.ok === false) {
      throw new Error(data?.error || `CODEX_BRIDGE_HTTP_${res.status}`)
    }
    return data
  } finally {
    clearTimeout(timer)
  }
}

export async function suggestIconsWithCodex({
  description,
  count = 3,
  avoid = [],
  customIcons = [],
  timeoutMs = 180000,
}: {
  description: string
  count?: number
  avoid?: string[]
  customIcons?: CodexCustomIconCandidate[]
  timeoutMs?: number
}): Promise<{ icons: CodexIconSuggestion[]; elapsedMs: number; usage?: CodexUsage }> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(`${localCodexBridgeHost()}/codex/suggest-icons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
      body: JSON.stringify({ description, count, avoid, customIcons }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || data?.ok === false) {
      throw new Error(data?.error || `CODEX_BRIDGE_HTTP_${res.status}`)
    }
    const icons = Array.isArray(data?.result?.icons) ? data.result.icons : []
    return { icons, elapsedMs: Number(data?.elapsedMs ?? 0), usage: data?.usage }
  } finally {
    clearTimeout(timer)
  }
}
