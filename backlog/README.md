# Backlog — local sync & triage

This folder is the bridge between the **a1-web Backlog tool** (a lightweight, Supabase-backed
ticket tracker) and the repo, so an agent or dev can triage, enrich, and implement tickets locally.

The Backlog UI lives at `?page=backlog` in a1-web. Anyone signed in can file a ticket (the global
"flag" button in the header, or the pre-scoped button in the editor / component pages / theme editor),
suggest a priority, complexity, and type (bug / feature / chore), vote, and discuss. Tickets carry a
human ref **`A1-<n>`** and move through: `new → triaged → accepted → in_progress → done → released`
(plus terminal `wont_fix` / `duplicate`).

## Setup (one-time)

Add a **service-role** key to `apps/a1-web/.env` (server-side only — never commit it, never ship it
to the browser):

```
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service role key from Supabase → Project Settings → API>
```

(The schema must already be applied — run `apps/a1-web/supabase/schema.sql` in the Supabase SQL editor.)

## Workflow

```
npm run backlog:pull     # write backlog/tickets.json + backlog/BACKLOG.md from Supabase
# …an agent or you edit backlog/tickets.json…
npm run backlog:push     # apply the edits back to Supabase, then re-pull
```

- **`BACKLOG.md`** is read-only (generated) — a scannable digest grouped by status then priority.
- **`tickets.json`** is the file you edit. For each ticket you may change:
  `title`, `description`, `type`, `status`, `priority` (`p0`–`p3`), `complexity` (`xs`–`xl`),
  and `scopeKind` / `scopeRef` / `scopeLabel`. Set **`newComment`** to a string to post a reply to the
  ticket's thread on the next push (it clears after pushing).
- `push` only writes fields that actually changed, logs each change, then re-pulls so the local files
  reflect the new state.

## Triaging as an agent

A typical pass: `pull`, read `BACKLOG.md`, then for each `new` ticket — set a `priority` and
`complexity`, sharpen the `description`, add a `newComment` with any clarifying question, and move it to
`triaged` (or `accepted` once it's ready to build). Pick up `accepted` tickets to implement; move them
to `in_progress`, then `done`, and `released` once shipped. `push` when finished.

When you ship a ticket, **reference its `A1-<n>` in the changelog entry** — put `(A1-<n>)` right after
the entry's bold lead title (e.g. `- **Help page — PageNav** (A1-106) — …`) in the affected
`CHANGELOG.md`, so the changelog ties back to the backlog. (See invariant 9a in
`packages/react/ai/project-workflows.md`.)

> `backlog/tickets.json` and `backlog/BACKLOG.md` are git-ignored — they're a working cache of the DB,
> not source. This README is the only tracked file in here.
