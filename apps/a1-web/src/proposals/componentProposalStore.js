const STORAGE_KEY = 'a1-component-proposals-v1'
const EVENT_NAME = 'a1-component-proposals:change'

function readStorage() {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeStorage(items) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  window.dispatchEvent(new CustomEvent(EVENT_NAME))
}

function makeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `proposal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function listComponentProposals() {
  return readStorage().sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))
}

export function upsertComponentProposal(proposal) {
  const now = new Date().toISOString()
  const items = readStorage()
  const nextProposal = {
    ...proposal,
    id: proposal.id || makeId(),
    createdAt: proposal.createdAt || now,
    updatedAt: now,
  }
  const index = items.findIndex((item) => item.id === nextProposal.id)
  if (index >= 0) items[index] = nextProposal
  else items.unshift(nextProposal)
  writeStorage(items)
  return nextProposal
}

export function deleteComponentProposal(id) {
  writeStorage(readStorage().filter((item) => item.id !== id))
}

export function subscribeComponentProposals(callback) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener(EVENT_NAME, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(EVENT_NAME, callback)
    window.removeEventListener('storage', callback)
  }
}
