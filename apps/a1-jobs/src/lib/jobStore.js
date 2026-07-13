import { PERSONAL_PROFILE_DEFAULTS, PERSONAL_PROFILE_SEED_VERSION } from './personalProfile.js'

const LOCAL_USER_ID = 'local'
const APP_COLUMNS = 'id,title,company,status,priority,source_site,source_url,application_url,job_description,location,work_mode,salary_range,deadline,applied_at,next_action,next_action_at,fit_score,summary,notes,created_at,updated_at'

function userId(user) {
  return user?.id || LOCAL_USER_ID
}

async function localRequest(action, payload = {}) {
  const res = await fetch('/api/local-store', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, payload }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data.result
}

function personalProfileRow(user, current = {}) {
  return {
    user_id: userId(user),
    full_name: current.full_name || PERSONAL_PROFILE_DEFAULTS.fullName,
    email: current.email || user?.email || PERSONAL_PROFILE_DEFAULTS.email,
    phone: current.phone || null,
    location: current.location || PERSONAL_PROFILE_DEFAULTS.location,
    linkedin_url: current.linkedin_url || PERSONAL_PROFILE_DEFAULTS.linkedinUrl,
    portfolio_url: current.portfolio_url || PERSONAL_PROFILE_DEFAULTS.portfolioUrl,
    a1_url: current.a1_url || PERSONAL_PROFILE_DEFAULTS.a1Url,
    base_resume: current.base_resume?.text ? current.base_resume : PERSONAL_PROFILE_DEFAULTS.baseResume,
    preferences: {
      ...PERSONAL_PROFILE_DEFAULTS.preferences,
      ...(current.preferences ?? {}),
      personalProfileSeedVersion: PERSONAL_PROFILE_SEED_VERSION,
    },
  }
}

function shouldBackfillPersonalProfile(row) {
  if (!row) return false
  if (row.preferences?.personalProfileSeedVersion === PERSONAL_PROFILE_SEED_VERSION) return false
  return !row.full_name
    || !row.location
    || !row.linkedin_url
    || !row.portfolio_url
    || !row.a1_url
    || !row.base_resume?.text
}

export function applicationFromRow(row) {
  return {
    id: row.id,
    title: row.title,
    company: row.company,
    status: row.status,
    priority: row.priority,
    sourceSite: row.source_site ?? '',
    sourceUrl: row.source_url ?? '',
    applicationUrl: row.application_url ?? '',
    jobDescription: row.job_description ?? '',
    location: row.location ?? '',
    workMode: row.work_mode ?? '',
    salaryRange: row.salary_range ?? '',
    deadline: row.deadline ?? '',
    appliedAt: row.applied_at ?? '',
    nextAction: row.next_action ?? '',
    nextActionAt: row.next_action_at ?? '',
    fitScore: row.fit_score ?? null,
    summary: row.summary ?? {},
    notes: row.notes ?? '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function applicationToRow(input, user) {
  return {
    user_id: userId(user),
    title: input.title?.trim() || 'Untitled role',
    company: input.company?.trim() || 'Unknown company',
    status: input.status || 'lead',
    priority: input.priority || 'medium',
    source_site: input.sourceSite || null,
    source_url: input.sourceUrl || null,
    application_url: input.applicationUrl || null,
    job_description: input.jobDescription || null,
    location: input.location || null,
    work_mode: input.workMode || null,
    salary_range: input.salaryRange || null,
    deadline: input.deadline || null,
    applied_at: input.appliedAt || null,
    next_action: input.nextAction || null,
    next_action_at: input.nextActionAt || null,
    fit_score: Number.isFinite(input.fitScore) ? input.fitScore : null,
    summary: input.summary ?? {},
    notes: input.notes || null,
  }
}

function applicationPatchToRow(input) {
  const map = {
    title: 'title',
    company: 'company',
    status: 'status',
    priority: 'priority',
    sourceSite: 'source_site',
    sourceUrl: 'source_url',
    applicationUrl: 'application_url',
    jobDescription: 'job_description',
    location: 'location',
    workMode: 'work_mode',
    salaryRange: 'salary_range',
    deadline: 'deadline',
    appliedAt: 'applied_at',
    nextAction: 'next_action',
    nextActionAt: 'next_action_at',
    fitScore: 'fit_score',
    summary: 'summary',
    notes: 'notes',
  }
  const row = {}
  for (const [key, column] of Object.entries(map)) {
    if (Object.hasOwn(input, key)) row[column] = input[key] || null
  }
  if (Object.hasOwn(input, 'summary')) row.summary = input.summary ?? {}
  if (Object.hasOwn(input, 'fitScore')) row.fit_score = Number.isFinite(input.fitScore) ? input.fitScore : null
  return row
}

export async function listApplications(user) {
  const rows = await localRequest('listApplications', { userId: userId(user), columns: APP_COLUMNS })
  return (rows ?? []).map(applicationFromRow)
}

export async function createApplication(user, input) {
  const row = await localRequest('createApplication', {
    userId: userId(user),
    row: applicationToRow(input, user),
  })
  return applicationFromRow(row)
}

export async function updateApplication(user, id, patch) {
  const row = await localRequest('updateApplication', {
    userId: userId(user),
    id,
    row: applicationPatchToRow(patch),
  })
  return applicationFromRow(row)
}

export async function removeApplication(user, id) {
  await localRequest('removeApplication', { userId: userId(user), id })
}

export async function getProfile(user) {
  const row = await localRequest('getProfile', {
    userId: userId(user),
    defaults: personalProfileRow(user),
  })
  if (!shouldBackfillPersonalProfile(row)) return row
  return saveProfile(user, personalProfileRow(user, row))
}

export async function saveProfile(user, patch) {
  const row = {
    user_id: userId(user),
    full_name: patch.full_name ?? patch.fullName ?? null,
    email: patch.email ?? user?.email ?? null,
    phone: patch.phone ?? null,
    location: patch.location ?? null,
    linkedin_url: patch.linkedin_url ?? patch.linkedinUrl ?? null,
    portfolio_url: patch.portfolio_url ?? patch.portfolioUrl ?? null,
    a1_url: patch.a1_url ?? patch.a1Url ?? 'https://a1design.app',
    base_resume: patch.base_resume ?? patch.baseResume ?? {},
    preferences: patch.preferences ?? {},
  }
  return localRequest('saveProfile', { userId: userId(user), row })
}

export async function listRelated(user, table, applicationId) {
  return localRequest('listRelated', { userId: userId(user), table, applicationId })
}

export async function upsertDocument(user, input) {
  const row = {
    id: input.id && input.id !== 'draft' ? input.id : undefined,
    user_id: userId(user),
    application_id: input.applicationId ?? input.application_id ?? null,
    kind: input.kind || 'other',
    title: input.title || 'Document',
    content: input.content || '',
    format: input.format || 'markdown',
    version: input.version || 1,
    meta: input.meta ?? {},
  }
  return localRequest('upsertDocument', { userId: userId(user), row })
}

export async function exportResumePdf(input) {
  const res = await fetch('/api/export-resume-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data.result
}

export async function exportDocumentPdf(input) {
  const res = await fetch('/api/export-document-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data.result
}

export async function createEvent(user, input) {
  return localRequest('createEvent', {
    userId: userId(user),
    row: {
      user_id: userId(user),
      application_id: input.applicationId ?? null,
      kind: input.kind || 'note',
      label: input.label || 'Updated',
      notes: input.notes || null,
      event_at: input.eventAt || new Date().toISOString(),
      meta: input.meta ?? {},
    },
  })
}

export async function createContact(user, input) {
  return localRequest('createContact', {
    userId: userId(user),
    row: {
      user_id: userId(user),
      application_id: input.applicationId ?? null,
      name: input.name || 'New contact',
      company: input.company || null,
      role: input.role || null,
      relationship: input.relationship || null,
      source_url: input.sourceUrl || null,
      email: input.email || null,
      status: input.status || 'identified',
      notes: input.notes || null,
    },
  })
}

export async function createFormFillSession(user, input) {
  return localRequest('createFormFillSession', {
    userId: userId(user),
    row: {
      user_id: userId(user),
      application_id: input.applicationId,
      page_url: input.pageUrl,
      scan: input.scan ?? {},
      mapping: input.mapping ?? {},
      result: input.result ?? {},
      status: input.status || 'scanned',
    },
  })
}

export async function upsertAccount(user, input) {
  return localRequest('upsertAccount', {
    userId: userId(user),
    row: {
      id: input.id && input.id !== 'draft' ? input.id : undefined,
      user_id: userId(user),
      application_id: input.applicationId ?? input.application_id ?? null,
      site_name: input.siteName ?? input.site_name ?? null,
      login_url: input.loginUrl ?? input.login_url ?? null,
      username: input.username ?? null,
      email: input.email ?? null,
      password: input.password ?? null,
      notes: input.notes ?? null,
      meta: input.meta ?? {},
    },
  })
}

export async function removeAccount(user, id) {
  await localRequest('removeAccount', { userId: userId(user), id })
}

export async function logAiRun(user, input) {
  try {
    await localRequest('logAiRun', {
      userId: userId(user),
      row: {
        user_id: userId(user),
        application_id: input.applicationId ?? null,
        task: input.task,
        input_hash: input.inputHash ?? null,
        result: input.result ?? {},
        usage: input.usage ?? {},
      },
    })
  } catch (error) {
    console.warn('[a1-jobs] AI run log failed', error)
  }
}

export function subscribeJobs() {
  return () => {}
}
