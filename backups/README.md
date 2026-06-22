# Supabase backups

Daily `pg_dump` backups of the Supabase database(s) behind a1-web (projects, patterns,
themes, images metadata, edit history, and the backlog).

> ⚠️ Database dumps contain **user data** (emails, content, history). Keep them private —
> the dump files in this folder are git-ignored and must never be committed.

## How it runs

`.github/workflows/supabase-backup.yml` runs every day (07:17 UTC) and on manual dispatch.
It installs `pg_dump`, runs `scripts/backup-supabase.mjs`, and uploads the dumps as a
**private workflow artifact** (90-day retention). If S3 secrets are set it also copies them
to your bucket for longer retention.

## One-time setup (GitHub repo secrets)

Settings → Secrets and variables → Actions → **New repository secret**:

- **`SUPABASE_DB_URL`** (required) — the Supabase **Session pooler** connection string.
  Dashboard → Project Settings → Database → *Connection string* → **Session pooler**
  (port `5432`), then put the database password in place of `[YOUR-PASSWORD]`. Use the
  *session* pooler (not the transaction pooler on `6543`, and not the direct `db.<ref>`
  host, which is IPv6-only on the free tier and unreachable from GitHub runners). Append
  `?sslmode=require` if it isn't already on the URL.

  To back up **several** projects in one run, set **`SUPABASE_BACKUP_TARGETS`** instead — a
  JSON array: `[{"name":"a1","url":"postgres://..."},{"name":"other","url":"postgres://..."}]`.

- *(optional, for durable off-GitHub storage)* `BACKUP_S3_BUCKET`, `AWS_ACCESS_KEY_ID`,
  `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION` — when all are set, each run also `aws s3 cp`s
  the dumps to `s3://<bucket>/supabase/YYYY/MM/`.

## Run it locally

Needs `pg_dump` installed (`brew install libpq` then add it to PATH, or `brew install postgresql`).
Put `SUPABASE_DB_URL=...` in `apps/a1-web/.env.local`, then:

```
npm run backup:supabase            # writes backups/<name>-<timestamp>.dump
```

`BACKUP_DIR` (default `backups/`) and `BACKUP_KEEP_DAYS` (default 14; prunes older local dumps) are configurable.

## Restore

Custom-format dumps restore with `pg_restore` into any Postgres (e.g. a fresh Supabase
project or local Postgres):

```
pg_restore --clean --if-exists --no-owner --no-privileges \
  -d "postgres://postgres:[PASSWORD]@<host>:5432/postgres" supabase-<timestamp>.dump
```

Restore into a **scratch** database first to verify before touching production. To inspect
without restoring: `pg_restore --list supabase-<timestamp>.dump`.
