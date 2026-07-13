import { insertRow, updateRow, deleteRow, getOne, listRows, localDbInfo } from '../localDb.mjs'
import { json, options } from './_utils.mjs'

const RELATED_TABLES = new Set([
  'job_documents',
  'job_contacts',
  'job_messages',
  'job_events',
  'gmail_connections',
  'form_fill_sessions',
  'form_field_mappings',
  'job_accounts',
])

function userId(value) {
  return value || 'local'
}

function relatedOrder(table) {
  if (table === 'job_events') return 'event_at desc'
  if (table === 'job_messages') return 'received_at desc, updated_at desc'
  return 'updated_at desc'
}

function upsertProfile(row) {
  const existing = getOne('job_profiles', { user_id: row.user_id })
  return existing ? updateRow('job_profiles', existing.id, row) : insertRow('job_profiles', row)
}

function upsertDocument(row) {
  if (row.id) return updateRow('job_documents', row.id, row)
  return insertRow('job_documents', row)
}

function upsertAccount(row) {
  if (row.id) return updateRow('job_accounts', row.id, row)
  return insertRow('job_accounts', row)
}

function requireRelatedTable(table) {
  if (!RELATED_TABLES.has(table)) throw new Error(`Unsupported related table: ${table}`)
  return table
}

async function handle(action, payload = {}) {
  const uid = userId(payload.userId)
  switch (action) {
    case 'info':
      return localDbInfo()
    case 'listApplications':
      return listRows('job_applications', { user_id: uid }, 'updated_at desc')
    case 'createApplication':
      return insertRow('job_applications', { ...payload.row, user_id: uid })
    case 'updateApplication':
      return updateRow('job_applications', payload.id, payload.row)
    case 'removeApplication':
      deleteRow('job_applications', payload.id)
      return { ok: true }
    case 'getProfile': {
      const existing = getOne('job_profiles', { user_id: uid })
      return existing || insertRow('job_profiles', { ...payload.defaults, user_id: uid })
    }
    case 'saveProfile':
      return upsertProfile({ ...payload.row, user_id: uid })
    case 'listRelated': {
      const table = requireRelatedTable(payload.table)
      const where = { user_id: uid }
      if (payload.applicationId) where.application_id = payload.applicationId
      return listRows(table, where, relatedOrder(table))
    }
    case 'upsertDocument':
      return upsertDocument({ ...payload.row, user_id: uid })
    case 'createEvent':
      return insertRow('job_events', { ...payload.row, user_id: uid })
    case 'createContact':
      return insertRow('job_contacts', { ...payload.row, user_id: uid })
    case 'createFormFillSession':
      return insertRow('form_fill_sessions', { ...payload.row, user_id: uid })
    case 'upsertAccount':
      return upsertAccount({ ...payload.row, user_id: uid })
    case 'removeAccount':
      deleteRow('job_accounts', payload.id)
      return { ok: true }
    case 'logAiRun':
      return insertRow('job_ai_runs', { ...payload.row, user_id: uid })
    default:
      throw new Error(`Unknown local-store action: ${action}`)
  }
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return options()
  try {
    const body = event.body ? JSON.parse(event.body) : {}
    const result = await handle(body.action, body.payload)
    return json(200, { result })
  } catch (error) {
    return json(400, { error: error.message })
  }
}
