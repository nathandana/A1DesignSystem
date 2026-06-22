#!/usr/bin/env node
/**
 * Supabase backup — `pg_dump` every configured database to BACKUP_DIR.
 *
 * Targets (in priority order):
 *   - SUPABASE_BACKUP_TARGETS — JSON array of { "name": "...", "url": "postgres://..." }
 *                               (back up several projects/databases in one run)
 *   - SUPABASE_DB_URL          — a single connection string (name defaults to "supabase")
 *
 * Use the Supabase **Session pooler** connection string (Dashboard → Project Settings →
 * Database → Connection string → "Session pooler", port 5432) and include the DB password.
 * The session pooler works with pg_dump over IPv4 — the direct `db.<ref>.supabase.co` host
 * is IPv6-only on the free tier, which GitHub runners can't reach. Append `?sslmode=require`
 * if your URL doesn't already force SSL.
 *
 * Env:
 *   BACKUP_DIR        output directory (default ./backups)
 *   BACKUP_KEEP_DAYS  prune local *.dump older than N days (default 14; 0 = keep all)
 *
 * Requires the `pg_dump` binary (postgresql-client) on PATH; its major version must be >=
 * the server's. Produces compressed custom-format dumps (.dump) — restore with `pg_restore`.
 *
 * Usage: node scripts/backup-supabase.mjs     (or: npm run backup:supabase)
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, readdirSync, statSync, unlinkSync } from 'node:fs'
import { resolve } from 'node:path'

function fail(msg) { console.error(`✗ ${msg}`); process.exit(1) }
const pad = (n) => String(n).padStart(2, '0')

// ── Resolve targets ───────────────────────────────────────────────────────────
let targets = []
if (process.env.SUPABASE_BACKUP_TARGETS) {
  try {
    targets = JSON.parse(process.env.SUPABASE_BACKUP_TARGETS)
      .map((t, i) => ({ name: t.name || `db${i + 1}`, url: t.url }))
  } catch (e) { fail(`SUPABASE_BACKUP_TARGETS is not valid JSON: ${e.message}`) }
} else if (process.env.SUPABASE_DB_URL) {
  targets = [{ name: 'supabase', url: process.env.SUPABASE_DB_URL }]
}
targets = targets.filter((t) => t.url)
if (!targets.length) {
  fail('No backup targets. Set SUPABASE_DB_URL (Session-pooler connection string) or SUPABASE_BACKUP_TARGETS.')
}

// ── Verify pg_dump ──────────────────────────────────────────────────────────────
let pgVersion
try { pgVersion = execFileSync('pg_dump', ['--version'], { encoding: 'utf8' }).trim() }
catch { fail('pg_dump not found on PATH. Install the postgresql-client package (the CI workflow does this for you).') }

const outDir = resolve(process.env.BACKUP_DIR || 'backups')
mkdirSync(outDir, { recursive: true })

const d = new Date()
const ts = `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}-${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}`

console.log(`Supabase backup · ${pgVersion} · ${targets.length} target(s) · → ${outDir}`)
let failures = 0
for (const t of targets) {
  const file = resolve(outDir, `${t.name}-${ts}.dump`)
  process.stdout.write(`  • ${t.name} … `)
  try {
    // Custom format: compressed and restorable selectively with pg_restore.
    execFileSync('pg_dump', ['--format=custom', '--no-owner', '--no-privileges', '--file', file, t.url],
      { stdio: ['ignore', 'ignore', 'inherit'] })
    console.log(`ok (${(statSync(file).size / 1e6).toFixed(2)} MB) → ${file}`)
  } catch (e) {
    failures += 1
    console.log('FAILED')
    console.error(`    ${e.message || e}`)
  }
}

// ── Prune old local dumps ───────────────────────────────────────────────────────
const keepDays = process.env.BACKUP_KEEP_DAYS === undefined ? 14 : Number(process.env.BACKUP_KEEP_DAYS)
if (keepDays > 0) {
  const cutoff = Date.now() - keepDays * 86_400_000
  for (const f of readdirSync(outDir)) {
    if (!f.endsWith('.dump')) continue
    const p = resolve(outDir, f)
    if (statSync(p).mtimeMs < cutoff) { unlinkSync(p); console.log(`  pruned old backup ${f}`) }
  }
}

if (failures) fail(`${failures} of ${targets.length} backup(s) failed.`)
console.log('✓ Backup complete.')
