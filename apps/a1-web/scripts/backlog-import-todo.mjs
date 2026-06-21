#!/usr/bin/env node
/**
 * One-off migration: import the repo-root TODO.md backlog into the Supabase backlog
 * tables (the published Backlog tool). Faithful + idempotent + reversible.
 *
 *   node --env-file-if-exists=apps/a1-web/.env apps/a1-web/scripts/backlog-import-todo.mjs [flags]
 *   (or: npm run backlog:import -- [flags])
 *
 * Flags:
 *   --dry-run        (default) parse + map, write backlog/todo-import-preview.json, print a
 *                    summary. Touches no database.
 *   --commit         insert the tickets. Skips any whose title already exists (idempotent).
 *                    Records inserted ids in backlog/todo-import-ids.json for --undo.
 *   --with-roadmap   also import the "Roadmap — larger themes / epics" bullets (skips ones
 *                    flagged as already shipped). Without it, only the P0–P3 checkbox tasks.
 *   --as=EMAIL       attribute imported tickets to this user (looked up in auth.users so they
 *                    appear in that person's "My queue → created by you"). Default: none.
 *   --undo           delete exactly the tickets recorded in backlog/todo-import-ids.json.
 *
 * Mapping: `P# · Effort` tag → priority (p0–p3) + complexity (xs–xl). P-band tasks → status
 * 'triaged' (already prioritised); roadmap epics → 'new'. Type → 'bug' when the title/desc reads
 * like a defect, else 'feature' (roadmap → feature). Scope → 'component' when the title's lead
 * word is a known component, else 'general'. Vocabularies mirror src/services/backlog/types.ts.
 */
import { createClient } from '@supabase/supabase-js'
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(HERE, '../../..')
const TODO_PATH = resolve(REPO_ROOT, 'TODO.md')
const OUT_DIR = resolve(REPO_ROOT, 'backlog')
const PREVIEW_PATH = resolve(OUT_DIR, 'todo-import-preview.json')
const IDS_PATH = resolve(OUT_DIR, 'todo-import-ids.json')

const flags = new Set(process.argv.slice(2).filter((a) => a.startsWith('--')))
const asArg = process.argv.slice(2).find((a) => a.startsWith('--as='))
const asEmail = asArg ? asArg.slice('--as='.length) : null
const COMMIT = flags.has('--commit')
const UNDO = flags.has('--undo')
const WITH_ROADMAP = flags.has('--with-roadmap')

const COMPONENT_LEADS = new Set([
  'card', 'button', 'iconbutton', 'icon button', 'split button', 'section', 'toolbar', 'accordion',
  'icon', 'icons', 'heading', 'figure', 'switch', 'code', 'list', 'tabs', 'grid', 'stack', 'slider',
  'segmented control', 'data table', 'datatable', 'select', 'inline', 'inline editable', 'page layout',
  'button container', 'dialog', 'menu', 'context menu', 'snackbar', 'banner', 'badge', 'breadcrumb',
  'side nav', 'sidenav', 'top header', 'topheader', 'bottom drawer', 'tree menu', 'calendar',
  'pagination', 'definition list', 'status bar', 'circular progress', 'step tracker', 'notification',
  'empty state', 'fieldset', 'field row', 'form fields', 'checkbox group', 'radio group',
  'choice group', 'textarea', 'autocomplete', 'divider', 'paragraph', 'blockquote', 'upload', 'filter',
])
const BUG_RE = /\b(bug|fix|broken|regression|doesn'?t work|still (accept|autofill)|incorrect)\b/i
const SHIPPED_RE = /already shipped|largely shipped|already built|already exists|_shipped_|\(shipped\)/i

function parseTodo(md) {
  const lines = md.split('\n')
  const out = []
  let section = null   // inbox | p0 | p1 | p2 | p3 | roadmap | null
  let subsection = null
  let cur = null
  const flush = () => { if (cur) { out.push(cur); cur = null } }

  for (const line of lines) {
    if (/^##\s+/.test(line)) {
      flush()
      const h = line.replace(/^##\s+/, '').toLowerCase()
      section = h.startsWith('inbox') ? 'inbox'
        : /^p0\b/.test(h) ? 'p0' : /^p1\b/.test(h) ? 'p1' : /^p2\b/.test(h) ? 'p2'
        : /^p3\b/.test(h) ? 'p3' : h.startsWith('roadmap') ? 'roadmap' : null
      subsection = null
      continue
    }
    if (/^###\s+/.test(line)) { flush(); subsection = line.replace(/^###\s+/, '').trim(); continue }
    if (!section) continue

    const checkbox = line.match(/^- \[[ x]\] (.*)$/)
    const roadmapBullet = line.match(/^- (\*\*.*)$/)
    if (section !== 'roadmap' && checkbox) { flush(); cur = { section, subsection, raw: checkbox[1] }; continue }
    if (section === 'roadmap' && roadmapBullet) { flush(); cur = { section, subsection, raw: roadmapBullet[1] }; continue }
    if (cur && /^\s+\S/.test(line)) { cur.raw += '\n' + line.replace(/^\s+/, '') } // continuation
  }
  flush()
  return out.map(toTicket).filter(Boolean)
}

function leadWord(title) {
  return title.split(/\s+[—–-]\s+|:\s+/)[0].trim().toLowerCase()
}

function toTicket({ section, subsection, raw }) {
  const titleM = raw.match(/^\*\*(.+?)\*\*/)
  if (!titleM) return null
  const title = titleM[1].trim()
  let rest = raw.slice(titleM[0].length)

  let priority = null, complexity = null
  const tag = rest.match(/`P([0-3])\s*·\s*(XS|S|M|L|XL)`/i)
  if (tag) { priority = 'p' + tag[1]; complexity = tag[2].toLowerCase(); rest = rest.replace(tag[0], '') }

  let description = rest.replace(/^\s*[—–-]\s*/, '').replace(/^[—–-]\s*/, '').trim()
  const shipped = section === 'roadmap' && SHIPPED_RE.test(description)
  const type = BUG_RE.test(`${title} ${description}`) ? 'bug' : 'feature'

  const lead = leadWord(title)
  const isComponent = COMPONENT_LEADS.has(lead)
  const scopeKind = isComponent ? 'component'
    : section === 'roadmap' ? 'general' : 'general'
  const scopeLabel = isComponent ? title.split(/\s+[—–-]\s+|:\s+/)[0].trim()
    : subsection ? subsection : null

  const status = (section === 'p2' || section === 'p3' || section === 'p0' || section === 'p1') ? 'triaged' : 'new'

  return {
    title,
    description: description || null,
    type,
    status,
    priority,
    complexity,
    scopeKind,
    scopeLabel,
    section,
    subsection: subsection || null,
    shipped,
  }
}

function getClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY
  if (!url || !key) {
    console.error('Missing SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY (see apps/a1-web/.env.example).')
    process.exit(1)
  }
  return createClient(url, key, { auth: { persistSession: false } })
}

function selectForImport(all) {
  return all.filter((t) => !t.shipped && (WITH_ROADMAP || t.section !== 'roadmap'))
}

function summary(tickets) {
  const by = (key) => tickets.reduce((m, t) => ((m[t[key] ?? '—'] = (m[t[key] ?? '—'] || 0) + 1), m), {})
  console.log(`  total:      ${tickets.length}`)
  console.log(`  by section: ${JSON.stringify(by('section'))}`)
  console.log(`  by type:    ${JSON.stringify(by('type'))}`)
  console.log(`  by priority:${JSON.stringify(by('priority'))}`)
  console.log(`  by status:  ${JSON.stringify(by('status'))}`)
  const scoped = tickets.filter((t) => t.scopeKind !== 'general').length
  console.log(`  scoped to a component: ${scoped}`)
}

async function main() {
  const md = readFileSync(TODO_PATH, 'utf8')
  const all = parseTodo(md)
  const skippedShipped = all.filter((t) => t.shipped).length
  mkdirSync(OUT_DIR, { recursive: true })

  if (UNDO) {
    if (!existsSync(IDS_PATH)) { console.error('Nothing to undo — no backlog/todo-import-ids.json.'); process.exit(1) }
    const ids = JSON.parse(readFileSync(IDS_PATH, 'utf8')).ids || []
    const sb = getClient()
    const { error } = await sb.from('backlog_items').delete().in('id', ids)
    if (error) { console.error('Undo failed:', error.message); process.exit(1) }
    console.log(`Deleted ${ids.length} imported tickets.`)
    writeFileSync(IDS_PATH, JSON.stringify({ ids: [], undoneAt: new Date().toISOString() }, null, 2))
    return
  }

  const tickets = selectForImport(all)

  if (!COMMIT) {
    writeFileSync(PREVIEW_PATH, JSON.stringify({ generatedAt: new Date().toISOString(), withRoadmap: WITH_ROADMAP, tickets }, null, 2))
    console.log(`DRY RUN — parsed ${all.length} TODO items (${skippedShipped} roadmap items flagged shipped, skipped).`)
    console.log(`Would import ${tickets.length} tickets${WITH_ROADMAP ? ' (incl. roadmap epics)' : ' (P-band tasks only; pass --with-roadmap to add epics)'}:`)
    summary(tickets)
    console.log(`\nFull preview written to backlog/todo-import-preview.json`)
    console.log(`Re-run with --commit to insert (idempotent — skips existing titles).`)
    return
  }

  // COMMIT
  const sb = getClient()

  // Optional attribution: look up the user id for --as=EMAIL.
  let createdBy = null, createdByEmail = asEmail || null
  if (asEmail) {
    try {
      const { data } = await sb.auth.admin.listUsers({ perPage: 1000 })
      const u = data?.users?.find((x) => x.email?.toLowerCase() === asEmail.toLowerCase())
      if (u) createdBy = u.id
      else console.warn(`Note: no auth user found for ${asEmail} — tickets will carry the email but no uid (won't appear in their queue).`)
    } catch (e) { console.warn('User lookup failed (need service-role key):', e.message) }
  }

  // Idempotency: skip titles already present.
  const { data: existing, error: exErr } = await sb.from('backlog_items').select('title')
  if (exErr) { console.error('Could not read existing tickets:', exErr.message); process.exit(1) }
  const seen = new Set((existing || []).map((r) => r.title))
  const fresh = tickets.filter((t) => !seen.has(t.title))
  const skippedDup = tickets.length - fresh.length

  if (!fresh.length) { console.log(`Nothing to insert — all ${tickets.length} titles already exist.`); return }

  const rows = fresh.map((t) => ({
    title: t.title, description: t.description, type: t.type, status: t.status,
    priority: t.priority, complexity: t.complexity, scope_kind: t.scopeKind,
    scope_label: t.scopeLabel, created_by: createdBy, created_by_email: createdByEmail,
  }))

  // Insert in chunks; collect the new ids for undo.
  const insertedIds = []
  for (let i = 0; i < rows.length; i += 100) {
    const chunk = rows.slice(i, i + 100)
    const { data, error } = await sb.from('backlog_items').insert(chunk).select('id,number')
    if (error) { console.error(`Insert failed at chunk ${i}:`, error.message); process.exit(1) }
    insertedIds.push(...(data || []).map((r) => r.id))
  }
  writeFileSync(IDS_PATH, JSON.stringify({ importedAt: new Date().toISOString(), ids: insertedIds }, null, 2))
  console.log(`Imported ${insertedIds.length} tickets (${skippedDup} skipped as duplicates).`)
  console.log(`Recorded ids in backlog/todo-import-ids.json — undo with: npm run backlog:import -- --undo`)
  summary(fresh)
}

main()
