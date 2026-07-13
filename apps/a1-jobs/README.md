# A1 Jobs

Local-only job-application workspace for A1 job search workflows.

## Local run

1. Copy `.env.example` to `.env.local`.
2. Start the local app:

```sh
npm run dev:a1-jobs
```

3. Start the local A1 Codex bridge for AI tasks:

```sh
npm run codex:bridge:jobs
```

The app runs at `http://127.0.0.1:5186/`. It is not meant to be deployed.

## Local data

The workspace is persistent on this machine. Data is stored in SQLite at:

```sh
apps/a1-jobs/data/a1-jobs.sqlite
```

Override with `A1_JOBS_DB_PATH` in `.env.local`. The `apps/a1-jobs/data/` folder is local-only and should stay out of git.

`npm run dev:a1-jobs` includes a local `/api/*` shim. Jobs, documents, contacts, events, Gmail state, and form-fill sessions all use the SQLite store.

Generated resumes and other application PDFs are written to `apps/a1-jobs/resumes/`. The database, generated PDFs, OAuth tokens, and local environment file are intentionally excluded from Git. Nothing in this app requires a deployment or Supabase connection.

## Gmail setup

Gmail connect needs server-side values in `apps/a1-jobs/.env.local`:

```sh
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_OAUTH_STATE_SECRET=
TOKEN_ENCRYPTION_KEY=
GOOGLE_OAUTH_REDIRECT_URI=http://127.0.0.1:5186/api/google-oauth-callback
```

Generate local secrets with `openssl rand -base64 32`. Add the redirect URI above to the Google OAuth client, then restart `npm run dev:a1-jobs`.

The primary Add job flow is a URL dialog. Choose **Add job**, paste a public job or application URL, and start. The local Codex bridge reads the posting, checks for duplicate jobs, creates the job page, and drafts the overview, resume, cover letter, portfolio note, and A1 note.

If a URL cannot be read, or the page appears filled, closed, expired, or unavailable, A1 Jobs creates a manual-check lead instead of dropping the workflow. Open the original URL in Chrome, then use the extension's **Job page** tab to send the rendered page into A1 Jobs.

## Browser autofill

Load `apps/a1-jobs-extension` as an unpacked Chrome extension. The extension is scoped to the local app at `http://127.0.0.1:5186/` or `http://localhost:5186/`.

The extension tabs support:

- Reading the active browser job page and sending that rendered page text into A1 Jobs as a new job.
- Scanning application forms and filling reviewed field mappings from this app.
- Scanning visible LinkedIn profile cards from a company, people, or search page.

It never clicks submit, scrolls LinkedIn, bypasses login, or sends messages.
