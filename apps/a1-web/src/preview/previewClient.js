import { validateJson } from '../editor/jsonValidation.js'
import { PREVIEW_ID } from '../../../../system/json-model/preview-contract.js'

const api = (import.meta.env.VITE_A1_PREVIEW_API_URL || 'https://mcp.a1design.app').replace(/\/$/, '')

export async function loadPreview(id, signal) {
  if (!PREVIEW_ID.test(id)) throw new Error('missing')
  const response = await fetch(`${api}/previews/${id}`, { credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer', signal })
  if (!response.ok) throw new Error(response.status === 410 ? 'expired' : response.status === 404 ? 'missing' : 'unavailable')
  const data = await response.json()
  // Existing snapshots retain their authored content until expiry. New content
  // policies gate creation and import, not viewing an already shared snapshot.
  // Structural, reference and pattern errors still block rendering.
  const invalidStructure = validateJson(data).errors.some(error => error.code !== 'RULE_VIOLATION')
  if (invalidStructure || !Number.isFinite(Date.parse(data.expiresAt))) throw new Error('invalid')
  if (Date.parse(data.expiresAt) <= Date.now()) throw new Error('expired')
  return data
}

export function beginPreviewImport(previewId, userId = null) {
  const nonce = crypto.randomUUID()
  sessionStorage.setItem(`a1-preview-import-${nonce}`, JSON.stringify({ previewId, userId, createdAt: Date.now() }))
  return `/projects?importPreview=${nonce}`
}

export function readPreviewImport(nonce) {
  if (!nonce || !/^[a-f0-9-]{36}$/.test(nonce)) return null
  try {
    const value = JSON.parse(sessionStorage.getItem(`a1-preview-import-${nonce}`))
    return value && (value.userId === null || typeof value.userId === 'string') && PREVIEW_ID.test(value.previewId) && Date.now() - value.createdAt < 300_000 ? value : null
  } catch { return null }
}

export function consumePreviewImport(nonce) {
  sessionStorage.removeItem(`a1-preview-import-${nonce}`)
}
