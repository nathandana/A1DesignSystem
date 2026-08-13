const HOST_KEY = 'a1-codex-bridge-host'
const DEFAULT_HOST = 'http://localhost:4318'
const LEGACY_SHARED_BRIDGE_HOSTS = new Set(['http://localhost:4317', 'http://127.0.0.1:4317'])

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

export interface FigmaHandoffResponse {
  ok: true
  id: string
  expiresAt: number
}

export interface PlaygroundHandoffResponse extends FigmaHandoffResponse {
  json: string
  /** True only for the Figma plugin's focused Live view. */
  live?: boolean
  /** Optional image bytes for the local Image Library. Never persisted in JSON. */
  assets?: FigmaBridgeImageAsset[]
}

export interface FigmaBridgeImageAsset {
  id: string
  name: string
  type: 'image/png' | 'image/jpeg' | 'image/gif'
  dataBase64: string
}

export interface FigmaPageSyncLinkRef {
  linkId: string
  projectId: string
  pageId: string
  mode?: 'manual' | 'live'
  figmaFileKey?: string
  figmaPageId?: string
  figmaRootNodeId?: string
}

export interface FigmaWorkspaceManifest {
  projects: Array<{
    id: string
    name: string
    pages: Array<{ id: string; title: string; json?: string; assets?: FigmaBridgeImageAsset[]; link: FigmaPageSyncLinkRef | null }>
  }>
}

export interface PageSyncHandoff extends FigmaHandoffResponse {
  link: FigmaPageSyncLinkRef
  json: string
  assets?: FigmaBridgeImageAsset[]
  baseHash?: string
  revision?: number
}

export interface PageSyncPayload {
  link: FigmaPageSyncLinkRef
  json: string
  assets?: FigmaBridgeImageAsset[]
  baseHash?: string
  revision?: number
}

export interface FigmaPageCreateHandoff {
  id: string
  projectId: string
  title: string
  json: string
  assets?: FigmaBridgeImageAsset[]
  figma: {
    linkId: string
    figmaFileKey?: string
    figmaPageId?: string
    figmaRootNodeId?: string
  }
}

export interface QueuedPlaygroundHandoff extends FigmaHandoffResponse {
  playgroundOpen: boolean
}

export function localCodexBridgeHost(): string {
  try {
    const savedHost = localStorage.getItem(HOST_KEY)
    return !savedHost || LEGACY_SHARED_BRIDGE_HOSTS.has(savedHost) ? DEFAULT_HOST : savedHost
  } catch {
    return DEFAULT_HOST
  }
}

export function isLocalBridgeFeatureEnabled(): boolean {
  if (typeof window === 'undefined') return false
  const hostname = window.location.hostname
  return hostname === 'localhost'
    || hostname === '127.0.0.1'
    || hostname === '::1'
    || hostname.endsWith('.localhost')
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

/** Queue valid A1 JSON for the locally open A1 Figma plugin to render. */
export async function queueFigmaHandoff(
  json: string,
  assets: FigmaBridgeImageAsset[] = [],
  timeoutMs = 20_000,
): Promise<FigmaHandoffResponse> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(`${localCodexBridgeHost()}/figma/handoff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
      body: JSON.stringify({ json, assets }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || data?.ok !== true || typeof data?.id !== 'string') {
      throw new Error(data?.error || `FIGMA_HANDOFF_HTTP_${res.status}`)
    }
    return data
  } finally {
    clearTimeout(timer)
  }
}

async function localBridgeRequest<T>(path: string, init: RequestInit = {}, timeoutMs = 20_000): Promise<T> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(`${localCodexBridgeHost()}${path}`, { ...init, signal: ctrl.signal })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || data?.ok !== true) throw new Error(data?.error || `LOCAL_BRIDGE_HTTP_${res.status}`)
    return data as T
  } finally {
    clearTimeout(timer)
  }
}

/** Register the locally open A1 workspace so the Figma plugin can choose a page. */
export function registerFigmaWorkspace(workspace: FigmaWorkspaceManifest): Promise<{ ok: true; expiresAt: number }> {
  return localBridgeRequest('/workspace/register', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(workspace),
  })
}

/** Queue one A1 page for the connected Figma plugin. */
export function queueFigmaPageSync(payload: PageSyncPayload): Promise<FigmaHandoffResponse> {
  return localBridgeRequest('/page-sync/to-figma', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  })
}

/** Poll a linked Figma page update; callers acknowledge only after committing it. */
export async function listenForFigmaPageSync(linkId?: string): Promise<PageSyncHandoff | null> {
  const suffix = linkId ? `?linkId=${encodeURIComponent(linkId)}` : ''
  const data = await localBridgeRequest<{ ok: true; handoff: PageSyncHandoff | null }>(`/page-sync/to-a1${suffix}`, {}, 10_000)
  return data.handoff?.id && data.handoff.json ? data.handoff : null
}

export function acknowledgeFigmaPageSync(id: string): Promise<{ ok: true }> {
  return localBridgeRequest('/page-sync/to-a1/ack', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }),
  }, 10_000)
}

/** Poll a Figma request to create a brand-new page in a local A1 project. */
export async function listenForFigmaPageCreate(): Promise<FigmaPageCreateHandoff | null> {
  const data = await localBridgeRequest<{ ok: true; handoff: FigmaPageCreateHandoff | null }>('/page-sync/create-a1', {}, 10_000)
  return data.handoff?.id && data.handoff.json ? data.handoff : null
}

export function acknowledgeFigmaPageCreate(id: string): Promise<{ ok: true }> {
  return localBridgeRequest('/page-sync/create-a1/ack', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }),
  }, 10_000)
}

/** Retrieve and consume a short-lived Figma-plugin payload for the Playground. */
export async function consumePlaygroundHandoff(id: string, timeoutMs = 10_000): Promise<PlaygroundHandoffResponse> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const host = localCodexBridgeHost()
    const res = await fetch(`${host}/playground/handoff?id=${encodeURIComponent(id)}`, { signal: ctrl.signal })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || data?.ok !== true || typeof data?.handoff?.json !== 'string') {
      throw new Error(data?.error || `PLAYGROUND_HANDOFF_HTTP_${res.status}`)
    }
    await fetch(`${host}/playground/handoff/ack`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
      body: JSON.stringify({ id }),
    })
    return data.handoff
  } finally {
    clearTimeout(timer)
  }
}

/** Poll for Figma plugin updates while the JSON Playground is open. */
export async function listenForPlaygroundHandoff(timeoutMs = 10_000): Promise<PlaygroundHandoffResponse | null> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(`${localCodexBridgeHost()}/playground/handoff?listen=1`, { signal: ctrl.signal })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || data?.ok !== true) throw new Error(data?.error || `PLAYGROUND_LISTEN_HTTP_${res.status}`)
    return data?.handoff && typeof data.handoff.id === 'string' && typeof data.handoff.json === 'string'
      ? data.handoff
      : null
  } finally {
    clearTimeout(timer)
  }
}

export async function acknowledgePlaygroundHandoff(id: string, timeoutMs = 10_000): Promise<void> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(`${localCodexBridgeHost()}/playground/handoff/ack`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
      body: JSON.stringify({ id }),
    })
    if (!res.ok) throw new Error(`PLAYGROUND_ACK_HTTP_${res.status}`)
  } finally {
    clearTimeout(timer)
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
