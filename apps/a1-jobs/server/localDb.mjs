import { randomUUID } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DatabaseSync } from 'node:sqlite'

const __dirname = dirname(fileURLToPath(import.meta.url))
const defaultDbPath = resolve(__dirname, '../data/a1-jobs.sqlite')
const dbPath = process.env.A1_JOBS_DB_PATH || defaultDbPath

let db

const JSON_FIELDS = {
  job_profiles: ['base_resume', 'preferences'],
  job_applications: ['summary'],
  job_documents: ['meta'],
  job_messages: ['to_emails', 'summary', 'raw'],
  job_events: ['meta'],
  job_ai_runs: ['result', 'usage'],
  gmail_connections: ['scopes'],
  form_fill_sessions: ['scan', 'mapping', 'result'],
  job_accounts: ['meta'],
}

const TABLE_COLUMNS = {
  job_profiles: ['id', 'user_id', 'full_name', 'email', 'phone', 'location', 'linkedin_url', 'portfolio_url', 'a1_url', 'base_resume', 'preferences', 'created_at', 'updated_at'],
  job_applications: ['id', 'user_id', 'title', 'company', 'status', 'priority', 'source_site', 'source_url', 'application_url', 'job_description', 'location', 'work_mode', 'salary_range', 'deadline', 'applied_at', 'next_action', 'next_action_at', 'fit_score', 'summary', 'notes', 'created_at', 'updated_at'],
  job_searches: ['id', 'user_id', 'name', 'query', 'location', 'source_sites', 'filters', 'created_at', 'updated_at'],
  job_documents: ['id', 'user_id', 'application_id', 'kind', 'title', 'content', 'format', 'version', 'approved_at', 'exported_at', 'meta', 'created_at', 'updated_at'],
  job_contacts: ['id', 'user_id', 'application_id', 'name', 'company', 'role', 'relationship', 'source_url', 'email', 'status', 'notes', 'last_contacted_at', 'created_at', 'updated_at'],
  job_messages: ['id', 'user_id', 'application_id', 'provider', 'provider_message_id', 'thread_id', 'subject', 'from_email', 'to_emails', 'snippet', 'body', 'summary', 'direction', 'status', 'matched_confidence', 'received_at', 'raw', 'created_at', 'updated_at'],
  job_events: ['id', 'user_id', 'application_id', 'kind', 'label', 'notes', 'event_at', 'completed_at', 'meta', 'created_at', 'updated_at'],
  job_ai_runs: ['id', 'user_id', 'application_id', 'task', 'input_hash', 'result', 'usage', 'created_at'],
  gmail_connections: ['id', 'user_id', 'google_email', 'access_token_ciphertext', 'refresh_token_ciphertext', 'token_expires_at', 'scopes', 'history_id', 'last_synced_at', 'created_at', 'updated_at'],
  form_fill_sessions: ['id', 'user_id', 'application_id', 'page_url', 'scan', 'mapping', 'result', 'status', 'created_at', 'updated_at'],
  form_field_mappings: ['id', 'user_id', 'domain', 'ats', 'field_signature', 'target_key', 'confidence', 'notes', 'created_at', 'updated_at'],
  job_accounts: ['id', 'user_id', 'application_id', 'site_name', 'login_url', 'username', 'email', 'password', 'notes', 'meta', 'created_at', 'updated_at'],
}

export const LOCAL_USER = {
  id: 'local',
  email: 'local@a1-jobs',
}

function now() {
  return new Date().toISOString()
}

function encodeValue(table, key, value) {
  if (JSON_FIELDS[table]?.includes(key)) return JSON.stringify(value ?? defaultJsonValue(table, key))
  return value === undefined ? null : value
}

function decodeRow(table, row) {
  if (!row) return null
  const decoded = { ...row }
  for (const key of JSON_FIELDS[table] ?? []) {
    try {
      decoded[key] = decoded[key] ? JSON.parse(decoded[key]) : defaultJsonValue(table, key)
    } catch {
      decoded[key] = defaultJsonValue(table, key)
    }
  }
  return decoded
}

function decodeRows(table, rows) {
  return rows.map((row) => decodeRow(table, row))
}

function defaultJsonValue(table, key) {
  if (table === 'job_messages' && key === 'to_emails') return []
  if (table === 'gmail_connections' && key === 'scopes') return []
  return {}
}

function ensureDb() {
  if (db) return db
  mkdirSync(dirname(dbPath), { recursive: true })
  db = new DatabaseSync(dbPath)
  db.exec('pragma foreign_keys = on')
  db.exec('pragma journal_mode = wal')
  db.exec(`
    create table if not exists job_profiles (
      id text primary key,
      user_id text not null unique,
      full_name text,
      email text,
      phone text,
      location text,
      linkedin_url text,
      portfolio_url text,
      a1_url text not null default 'https://a1design.app',
      base_resume text not null default '{}',
      preferences text not null default '{}',
      created_at text not null,
      updated_at text not null
    );

    create table if not exists job_applications (
      id text primary key,
      user_id text not null,
      title text not null,
      company text not null,
      status text not null default 'lead',
      priority text not null default 'medium',
      source_site text,
      source_url text,
      application_url text,
      job_description text,
      location text,
      work_mode text,
      salary_range text,
      deadline text,
      applied_at text,
      next_action text,
      next_action_at text,
      fit_score integer,
      summary text not null default '{}',
      notes text,
      created_at text not null,
      updated_at text not null
    );

    create table if not exists job_searches (
      id text primary key,
      user_id text not null,
      name text not null,
      query text not null,
      location text,
      source_sites text not null default '[]',
      filters text not null default '{}',
      created_at text not null,
      updated_at text not null
    );

    create table if not exists job_documents (
      id text primary key,
      user_id text not null,
      application_id text,
      kind text not null,
      title text not null,
      content text not null default '',
      format text not null default 'markdown',
      version integer not null default 1,
      approved_at text,
      exported_at text,
      meta text not null default '{}',
      created_at text not null,
      updated_at text not null,
      foreign key(application_id) references job_applications(id) on delete cascade
    );

    create table if not exists job_contacts (
      id text primary key,
      user_id text not null,
      application_id text,
      name text not null,
      company text,
      role text,
      relationship text,
      source_url text,
      email text,
      status text not null default 'identified',
      notes text,
      last_contacted_at text,
      created_at text not null,
      updated_at text not null,
      foreign key(application_id) references job_applications(id) on delete set null
    );

    create table if not exists job_messages (
      id text primary key,
      user_id text not null,
      application_id text,
      provider text not null default 'gmail',
      provider_message_id text,
      thread_id text,
      subject text,
      from_email text,
      to_emails text not null default '[]',
      snippet text,
      body text,
      summary text not null default '{}',
      direction text not null default 'inbound',
      status text not null default 'new',
      matched_confidence real,
      received_at text,
      raw text not null default '{}',
      created_at text not null,
      updated_at text not null,
      unique(user_id, provider, provider_message_id)
    );

    create table if not exists job_events (
      id text primary key,
      user_id text not null,
      application_id text,
      kind text not null default 'note',
      label text not null,
      notes text,
      event_at text not null,
      completed_at text,
      meta text not null default '{}',
      created_at text not null,
      updated_at text not null,
      foreign key(application_id) references job_applications(id) on delete cascade
    );

    create table if not exists job_ai_runs (
      id text primary key,
      user_id text not null,
      application_id text,
      task text not null,
      input_hash text,
      result text not null default '{}',
      usage text not null default '{}',
      created_at text not null
    );

    create table if not exists gmail_connections (
      id text primary key,
      user_id text not null unique,
      google_email text not null,
      access_token_ciphertext text,
      refresh_token_ciphertext text,
      token_expires_at text,
      scopes text not null default '[]',
      history_id text,
      last_synced_at text,
      created_at text not null,
      updated_at text not null
    );

    create table if not exists form_fill_sessions (
      id text primary key,
      user_id text not null,
      application_id text,
      page_url text not null,
      scan text not null default '{}',
      mapping text not null default '{}',
      result text not null default '{}',
      status text not null default 'scanned',
      created_at text not null,
      updated_at text not null,
      foreign key(application_id) references job_applications(id) on delete cascade
    );

    create table if not exists form_field_mappings (
      id text primary key,
      user_id text not null,
      domain text not null,
      ats text,
      field_signature text not null,
      target_key text not null,
      confidence real,
      notes text,
      created_at text not null,
      updated_at text not null,
      unique(user_id, domain, field_signature)
    );

    create table if not exists job_accounts (
      id text primary key,
      user_id text not null,
      application_id text,
      site_name text,
      login_url text,
      username text,
      email text,
      password text,
      notes text,
      meta text not null default '{}',
      created_at text not null,
      updated_at text not null,
      foreign key(application_id) references job_applications(id) on delete cascade
    );

    create index if not exists job_applications_user_status_idx on job_applications (user_id, status, updated_at desc);
    create index if not exists job_documents_application_idx on job_documents (application_id, kind, updated_at desc);
    create index if not exists job_contacts_application_idx on job_contacts (application_id, updated_at desc);
    create index if not exists job_messages_application_idx on job_messages (application_id, received_at desc);
    create index if not exists job_messages_thread_idx on job_messages (user_id, thread_id);
    create index if not exists job_events_application_idx on job_events (application_id, event_at desc);
    create index if not exists job_accounts_application_idx on job_accounts (application_id, updated_at desc);
  `)
  return db
}

export function localUser() {
  return LOCAL_USER
}

export function dbFilePath() {
  return dbPath
}

function pick(table, input) {
  const row = {}
  for (const column of TABLE_COLUMNS[table]) {
    if (Object.hasOwn(input, column)) row[column] = encodeValue(table, column, input[column])
  }
  return row
}

export function insertRow(table, input) {
  const database = ensureDb()
  const timestamp = now()
  const row = {
    id: randomUUID(),
    created_at: timestamp,
    updated_at: timestamp,
    ...pick(table, input),
  }
  if (!row.id) row.id = randomUUID()
  if (TABLE_COLUMNS[table].includes('user_id') && !row.user_id) row.user_id = LOCAL_USER.id
  const columns = Object.keys(row).filter((column) => TABLE_COLUMNS[table].includes(column))
  const placeholders = columns.map((column) => `$${column}`)
  database.prepare(`insert into ${table} (${columns.join(', ')}) values (${placeholders.join(', ')})`)
    .run(Object.fromEntries(columns.map((column) => [`$${column}`, row[column]])))
  return getRow(table, row.id)
}

export function updateRow(table, id, input) {
  const database = ensureDb()
  const row = {
    ...pick(table, input),
  }
  if (TABLE_COLUMNS[table].includes('updated_at')) row.updated_at = now()
  const columns = Object.keys(row).filter((column) => TABLE_COLUMNS[table].includes(column))
  if (!columns.length) return getRow(table, id)
  const assignments = columns.map((column) => `${column} = $${column}`)
  database.prepare(`update ${table} set ${assignments.join(', ')} where id = $id`)
    .run({ ...Object.fromEntries(columns.map((column) => [`$${column}`, row[column]])), $id: id })
  return getRow(table, id)
}

export function getRow(table, id) {
  const row = ensureDb().prepare(`select * from ${table} where id = ?`).get(id)
  return decodeRow(table, row)
}

export function getOne(table, where, orderBy = '') {
  const { clause, params } = whereClause(where)
  const row = ensureDb().prepare(`select * from ${table}${clause}${orderBy ? ` order by ${orderBy}` : ''} limit 1`).get(params)
  return decodeRow(table, row)
}

export function listRows(table, where = {}, orderBy = 'updated_at desc') {
  const { clause, params } = whereClause(where)
  const rows = ensureDb().prepare(`select * from ${table}${clause}${orderBy ? ` order by ${orderBy}` : ''}`).all(params)
  return decodeRows(table, rows)
}

export function deleteRow(table, id) {
  ensureDb().prepare(`delete from ${table} where id = ?`).run(id)
}

export function upsertGmailConnection(input) {
  const existing = getOne('gmail_connections', { user_id: input.user_id || LOCAL_USER.id })
  if (existing) return updateRow('gmail_connections', existing.id, input)
  return insertRow('gmail_connections', input)
}

export function upsertGmailMessage(input) {
  const existing = getOne('job_messages', {
    user_id: input.user_id || LOCAL_USER.id,
    provider: input.provider || 'gmail',
    provider_message_id: input.provider_message_id,
  })
  if (existing) return updateRow('job_messages', existing.id, input)
  return insertRow('job_messages', input)
}

function whereClause(where = {}) {
  const entries = Object.entries(where).filter(([, value]) => value !== undefined)
  if (!entries.length) return { clause: '', params: {} }
  return {
    clause: ` where ${entries.map(([key]) => `${key} = $${key}`).join(' and ')}`,
    params: Object.fromEntries(entries.map(([key, value]) => [`$${key}`, value])),
  }
}

export function localDbInfo() {
  ensureDb()
  return { path: dbPath }
}
