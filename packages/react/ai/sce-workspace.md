# SCE project workspace

`apps/sce-hub` is Nathan Dana’s independent SCE contract workspace. It is not an official SCE product. Keep changes isolated from the other applications. The brief calls for source review and traceable working records, not invented accomplishments or an assumed official architecture.

## Runtime and first use

Node 24 is required (`node:sqlite`). Install the existing monorepo dependencies with `npm ci`. From the repository root:

```sh
npm run build --workspace=sce-hub
npm start --workspace=sce-hub
```

Open `http://127.0.0.1:5191`. The current ignored `.env` selects the existing Supabase workspace and password-free loopback access. It shares data with the hosted app; no import or owner setup is needed. For a new isolated SQLite workspace, omit the cloud configuration and run `node apps/sce-hub/scripts/import-sce.mjs /Users/nathandana/SCE` before starting. With local access disabled, create an owner account with a password of at least 14 characters. There is no seeded password. First-owner creation is limited to loopback, nonproduction requests and an empty users table. Production does not permit first-owner creation through HTTP.

For development with hot reload, run the server with `SCE_ORIGIN=http://127.0.0.1:5190` and run `npm run dev --workspace=sce-hub` in a second terminal. Vite proxies `/api` to port 5191. Origin must match the browser address exactly. The `.env.example` contains configuration names, never credentials. `npm start --workspace=sce-hub` reads its local `.env`.

For temporary password-free use on this computer, set `SCE_LOCAL_ACCESS=true` in the ignored app `.env` and restart. This is enabled in the current local workspace at the user’s request. Requests receive a local owner identity without creating an account. The server must bind to loopback, checks the request host and remote address, retains same-origin write protection, and refuses this option in production. The interface labels this mode and hides sign-out and password management. Set it back to `false` and restart to restore normal sign-in.

Choose **SCE source material** or **Fictional demonstration** in the side navigation. These collections do not cross-link. The demo contains a checkbox review, typed dependency graph, decision and draft weekly summary. No demo content describes actual SCE outcomes.

## Source import and coverage

The source/PDF import and audit-formatting scripts below operate on local SQLite only. After the cloud migration, they modify the retained local archive, not the live Supabase workspace. Use the app's authenticated imports for live data; the migration script is only for an empty cloud destination.

The local importer reads the supplied SCE 1.7 export under `Figma Test/sce-design-system-docs`, preserving source node links, source version, occurrence references and the full Markdown page transcriptions. It selects nonhidden component descriptions and documentation paragraph layers as **unreviewed candidates**, not as established rules. Specimen labels and example text remain available in the source transcriptions. A candidate may still contain stale guidance or example copy; the UI identifies that limitation. Exact text repeated within a source section is consolidated while retaining occurrence IDs. Context tags inferred from literal words are editable and do not assert approval.

Initial local import: 732 guideline candidates, 70 source documents (62 page transcriptions and 8 catalogs/reference files), 1 audit report and 9 source-supported findings. The imported data lives in ignored `apps/sce-hub/data/workspace.sqlite`, never in Git or frontend assets. The local importer is idempotent. Source changes create new revisions and set `needsReview`, preserving prior decision and discussion history. The real dependency collection starts with two source-backed nodes: the identified Figma library and its documentation export, connected by a confirmed “documents” relationship. This does not infer an implementation stack or ownership.

The supplied `SEC.com Audit/SCE.com Initial Audit - 10:30:26.html` is a saved PDF-viewer page with text only for pages **1–5 of 13**. The initial importer reads inert text with Python’s HTML parser; it does not execute or serve the saved scripts. The nine priority-table findings come from that source. The subsequently supplied `SCE_website_audit_2026-10-30.pdf` is now stored as a protected attachment, with text indexed from **all 13 pages**. The earlier HTML import remains in revision history. These are the supplied audit’s findings, not a new evaluation or measured conformance score. File links, previews and extraction remain protected. Local source PDFs under `src/pdf/` are ignored by Git, denied by Vite and excluded from Docker build context.

To import a replacement original PDF into the existing report, install `pypdf` in a local Python environment and run:

```sh
python3 -m venv apps/sce-hub/data/pdf-tools
apps/sce-hub/data/pdf-tools/bin/pip install pypdf==6.21.4
node apps/sce-hub/scripts/import-pdf.mjs /absolute/path/to/report.pdf
```

The importer uses that local Python environment automatically, or `SCE_PDF_PYTHON` when configured. It preserves earlier versions, deduplicates identical PDF bytes and updates page coverage. The optional second argument selects a report ID; the default is `sce-audit`. The existing local installation is already configured with an ignored extractor shim and `.env`; neither contains source content in tracked files.

Browser imports accept pasted text, JSON and CSV; see `apps/sce-hub/examples/`. Preview validates every row before committing. Stable external IDs match source revisions; otherwise exact source/title/text matches are skipped. Duplicate handling either skips or revises source text, preserving prior decisions and flagging re-review. Full workspace exports are archival JSON, not guideline-import files. Database restoration is the full-fidelity restore path.

## Storage contract

Migration: `apps/sce-hub/server/migrations/001-workspace.sql`.

- `records`: stable ID, kind, collection, revision, JSON payload, timestamp, soft deletion. Kinds cover guidelines, sources, nodes, edges, reports, findings, weekly summaries, initiatives and saved views. Tags are reusable canonical strings with the groups Components, Patterns/tasks, Topics and Platforms/contexts. Links store record IDs, not copied content.
- `revisions`: immutable record snapshots with actor, timestamp and reason. Restoring editable details creates a new revision, retains decisions/discussion and flags changed guideline wording. Deleted records remain in protected historical exports; active views and search exclude them.
- `activity`: retired table retained solely to preserve existing database archives. New events are never written; it is not exposed through the workspace or export API.
- `attachments`: immutable PDF bytes, original safe filename, report reference, extraction status and searchable text. Adding a report version keeps every earlier attachment. Report deletion makes its attachments inaccessible without erasing history.
- `users`: unique email, name, role and scrypt password hash with individual salt.
- `sessions`: SHA-256 hash of a random bearer cookie, user reference and expiry. Cookies are HttpOnly, SameSite=Strict, expire after eight hours and are Secure in production.

Writes and history entries commit together in database transactions. Optimistic revision checks reject stale edits with HTTP 409. Local SQLite uses one serialized connection. Hosted PostgreSQL uses one pooled connection per warm function, async transaction scopes and advisory locks for concurrent record updates. Both retain optimistic revision checks.

## Review, dependencies and reporting

The Guidelines page shows one table with A1 DataTable’s built-in search, sorting and multi-select filter chips for decision, grouped tags and owner. Clicking a guideline, including a direct record link, opens an A1 dialog. The dialog shows Markdown guidance and source metadata, an owner field, four compact comma-separated tag fields and an optional AI-readiness disclosure. Its footer has exactly Approve, Reject, Discuss and Cancel. The first three atomically save permitted metadata and the decision through `/api/records/:id/review`; Cancel/Escape discard unsaved changes and restore focus. No rationale, confirmation, wording lifecycle, review queue, saved-view controls or bulk actions appear in this simplified flow. Existing stored history and the older APIs remain intact. Reviewers may decide but cannot edit metadata; viewers can read and cancel.

Guidelines use exactly `Approved`, `Rejected` and `Needs further discussion`, with `null` representing Unreviewed. Decisions capture actor, time and the revision reviewed. Earlier decisions may include a rationale; the compact review flow does not require or invent one. Wording edits do not silently approve or erase decisions. Multi-value AI readiness is descriptive; enforcement mechanisms are recorded separately.

Canvas uses existing A1 Canvas, Node and NodeConnector with an accessible list, node selector, numeric position controls, pan/zoom/fit, automatic grid layout and saved views. Nodes and edges are ordinary versioned records. Impact exploration follows feeds/affects forward; it reverses consumes, implements, documents and owns to trace from dependencies to their consumers, implementations, documentation and owners. It includes proposed and uncertain relationships and explicitly disclaims completeness. Positions save explicitly; unsaved layout changes can be discarded.

Weekly generation uses Monday–Sunday calendar dates in America/New_York, including DST boundaries. It creates editable drafts linking current records whose latest update falls in the selected week, excluding weekly notes, retired releases and saved views. These are current snapshots, not a complete change history: a later update moves a record out of earlier-week results. No activity events or event IDs are generated. Drafts identify missing outcome evidence. Weekly notes require explicit publication. Editing published notes returns them to Draft. Publication does not make the workspace public and never sends a message.

## Readable website audit

The audit route and direct report links open `src/audit.jsx` as a single document. The supplied 13-page PDF is presented in its 10 source sections, with restored paragraphs, inline emphasis/code, seven semantic evidence tables and original reference links. A1 Page Nav provides section selection and reading progress, with a sticky right-hand column on tablet/desktop and mobile pills below the measured app header. Section scroll offsets account for the mobile bar. A1 typography, a bounded reading measure and A1 dividers between article sections keep long passages readable. Static audit tables use existing A1 table styles without sorting, pagination or result counts.

`readingDocument` is stored only in the protected report payload, with its source PDF hash and attachment ID. Each section retains page references; the original PDF remains available from the header and section source links. PDF uploads, previews and version downloads are grouped under “Source PDF and versions.” Reports without a matching formatted representation fall back to their summary and available source pages, without inventing structure or findings.

Regenerate the reading representation for the supplied PDF layout using:

```sh
node apps/sce-hub/scripts/format-audit.mjs /absolute/path/to/the/imported-audit.pdf
```

The optional second argument selects the report ID (default `sce-audit`). This uses the local pypdf environment described above. `format-audit.py` reconstructs the supplied report’s text layout and hyperlinks; it is not a general PDF authoring or OCR tool. Review a materially different PDF layout before using its formatted output. The script verifies the PDF matches the imported attachment and creates a revision only when formatting changes. It never rewrites the original extracted pages, PDF bytes or findings.

Releases have been removed from navigation, page routes, creation, publication, active records/search, public demo and weekly-generation inputs. Old release records and history remain in full archival exports/backups. Direct access to a retired release returns 404. The old `#releases` route redirects to Overview. Weekly summaries remain supported.

## Access, search and optional AI

Owner manages collaborator accounts and demo sharing clearance. Editors edit records and publish workspace notes. Reviewers record decisions and comments. Viewers read and export. All authenticated members can read the private workspace; there is no per-record compartmentalization among members. Revocation deletes sessions through the user foreign key. Password changes invalidate all previous sessions.

Every API and PDF route requires authentication except session metadata, local first-owner setup, sign-in and the explicitly enabled public demonstration. Mutations require an exact trusted Origin. Responses use `no-store`, `noindex`, `nosniff`, no-referrer and a restrictive CSP. Imported Markdown renders as semantic React elements; embedded HTML remains escaped. External links permit only HTTP(S). Login attempts are throttled in memory; a production reverse proxy can add distributed rate limits if needed.

Search is computed against current authorized records and extracted attachment text. It includes original/proposed wording, tags, comments, decisions, sources, node/relationship labels, report summaries/findings, indexed pages and weekly notes. It excludes deleted records immediately and never queries history for public snippets. An uploaded PDF is indexed only when the configured extractor succeeds with nonempty text. Otherwise the exact unavailable/failed/OCR-needed state is shown. The Docker runtime includes Poppler `pdftotext`; local installations can configure `SCE_PDFTOTEXT` with an executable accepting `-layout input.pdf -`. The supplied optional `scripts/extract-pdf.py` supports those arguments when invoked with a Python environment containing `pypdf`. Extraction has a timeout and bounded output. Image-only PDFs need OCR outside this release.

Real AI processing is not implemented or enabled. `/api/ask` returns an unavailable response; no provider secrets are accepted or sent. The assistant page is a clearly labeled fictional example that links its current example guideline revision. Adding live retrieval requires a separate, owner-authorized provider integration, permission-filtered retrieval and citations, limits, cancellation and tests. Imported documents remain evidence, never instructions.

The optional public route is disabled unless `SCE_PUBLIC_DEMO=true` is explicitly configured by the owner. Even then, it serves only individually cleared **demo** records: approved current guidelines, published notes and eligible graph/initiative records. Real SCE records, sources, reports, findings, discussions, private linked records, attachments and audit logs are excluded. Any content edit removes clearance. The owner can inspect `/api/visitor` through Settings without enabling public access. A public visitor uses `/#visitor`. Do not change visibility during deployment.

## Backup and restoration

```sh
node apps/sce-hub/scripts/backup.mjs
```

The backup uses SQLite `VACUUM INTO` for a consistent standalone database containing all records, revisions, users and PDF bytes. It is confidential and created with mode 0600. Move encrypted backups to owner-approved storage; no backup service is configured. To restore, stop the server, preserve the current database and WAL/SHM files in a separate backup directory, then replace `workspace.sqlite` with the chosen backup and restart. Never copy a live SQLite database file alone or leave an unrelated WAL beside a restored file. Migrations apply on startup. Browser exports deliberately omit account hashes and sessions; they do not replace this backup.

## Deployment for sce.a1design.app

The user authorized publishing on Oct. 31, 2026 and selected Supabase. Netlify serves the frontend and `sce-api` function; the existing A1 Supabase project `pszmkbfvyjkifbyututo` holds SCE in a separate, unexposed `sce` database schema and private `sce-private-reports` bucket. The dedicated `sce_app` login has access only to SCE tables. Browser anon/authenticated roles have no schema privileges or bucket policies. The function uses server-only credentials, parameterized queries and verified TLS with Supabase’s public CA.

Published Oct. 31, 2026: https://sce.a1design.app, production deploy `6ae61d823aaa5bf5015a7a46`. Public DNS resolves the custom domain, and Netlify has issued HTTPS coverage. The hosted API passed private access, session, workspace, search, byte-identical PDF, concurrent stale-write, revision history, rollback and full export checks on the verified preview before promotion.

Netlify project: `a1design-sce`, ID `f6553f37-d981-4bc4-aef9-9aedf00189a4`. The custom domain is `sce.a1design.app`; Netlify manages its DNS entry in `a1design.app`. Do not deploy with another A1 site's ID or root configuration. Pin `--filter sce-hub` and use absolute paths for `--dir` and `--functions` (relative flags were resolved against the selected workspace and omitted the function).

```sh
npm run build --workspace=sce-hub
netlify deploy --filter sce-hub --no-build --prod \
  --dir /Users/nathandana/Sites/A1DesignSystem/apps/sce-hub/dist \
  --functions /Users/nathandana/Sites/A1DesignSystem/apps/sce-hub/netlify/functions \
  --skip-functions-cache
```

The cloud runtime is `server/app.mjs` plus `postgres-store.mjs` and `cloud.mjs`; it never imports SQLite. `local-app.mjs` supplies the optional SQLite adapter. Set `SCE_DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` and exact HTTPS `SCE_ORIGIN` in Netlify. Never use a `VITE_` prefix for secrets or print/recommit ignored runtime configuration. The Node HTTP adapter uses `serverless-http`; the large JSON export is gzip-compressed to stay within buffered function response limits. Cloud PDF uploads are limited to 4 MB and the UI displays that limit. Existing extracted text and the formatted PDF document were migrated; new hosted uploads visibly report indexing unavailable when no extractor is present.

The owner row references Nathan’s existing A1 Supabase user. Login verifies that account’s password through Supabase Auth and issues a separate HttpOnly, Secure SCE session; other A1 users do not automatically gain SCE access. Owner password changes remain in A1. Workspace collaborator accounts retain their own roles and password controls. The public demo stays disabled. Password-free access remains loopback-only and is rejected in production.

Migration source: local SQLite, 830 total stored records (including archived/deleted records), 841 revisions and one byte-identical 314,558-byte PDF. `scripts/migrate-supabase.mjs` refuses to overwrite a nonempty cloud database. All original record payloads and revision numbers were compared after import. Historical activity rows stay in local backups and are not imported. Local `.env` now selects Supabase, so subsequent local and hosted edits use the same data; the original SQLite file and consistent backup remain available as archives.

The earlier Docker/Caddy files remain an optional Node hosting alternative, not the selected production target. Supabase backups must cover the `sce` schema and private bucket; the SQLite backup script only snapshots the retained local archive after this switch.

`node --env-file=apps/sce-hub/data/cloud/runtime.env apps/sce-hub/scripts/verify-cloud.mjs` checks the cloud backend with short-lived server-created test sessions, creates isolated verification records, checks atomic rollback and stale writes, and removes its test data. Set `SCE_VERIFY_URL` to a deploy URL to exercise the hosted API. Runtime configuration stays ignored; the verification script never prints session credentials.

## Checks

`.github/workflows/sce-hub.yml` runs these checks for relevant pull requests and changes pushed to `release` or `main`, without live credentials or source data.

```sh
npm run build --workspace=sce-hub
npm test --workspace=sce-hub
npx playwright test --config apps/sce-hub/playwright.config.mjs
```

The browser suite runs against a temporary isolated database, uses fictional test accounts and deletes it at shutdown. It covers import preview, combined A1 table filters, dialog decisions and metadata persistence, cancellation/focus restoration, direct guideline links, metadata search, PDF upload/preview, audit Page Nav, retired-release boundaries, weekly generation, persisted map positions, dialog focus, AI-unavailable demonstration, visitor preview, responsive overflow and axe checks. Server tests cover role boundaries, unauthenticated data/PDF/export access, CSRF, duplicate/source revision behavior, stale writes, public allowlists, deleted content, extraction failure, graph integrity, DST boundaries, persistence and removal of activity logging without deleting archival rows. Automated checks do not establish full WCAG conformance; manual screen-reader and production browser/hosting checks remain separate.

## Markdown rendering

`src/Markdown.jsx` renders CommonMark and GitHub-flavored Markdown with `react-markdown` and `remark-gfm`, mapped to A1 typography, lists, blockquotes, code and data tables. Source transcriptions, guideline wording/discussions, summaries, findings and notes use this renderer. Textareas and archival exports preserve the exact Markdown; Original PDF extracted text, source identifiers and history JSON remain unchanged; the audit has a separate formatted reading representation. Relative `.md` links resolve through imported records’ `localPath` within the current collection. Fragment links scroll within the rendered document without triggering the app router. Raw HTML is escaped, unsafe URL schemes cannot become links, and images render their alt text without remote requests. No source content is rewritten or approved by rendering it.

Every page title uses the shared A1 `PageTitle` pattern, including sign-in, visitor preview and record pages. The local `ui.jsx` adapter only supplies route breadcrumbs, content width and the focusable heading target; it does not recreate or override the pattern’s layout. The local `Page` composition places the title directly at the top and side edges of the page with no margins, parent padding or preceding gap. Its separate body Section owns responsive padding and demonstration notices. Preserve the title’s internal padding; do not nest it inside the body Section. Metadata uses the pattern’s badge row and actions follow its one-primary-last policy.

The active side-navigation section follows record type, including direct guideline links and dialogs. A1 Breadcrumb links point to real hash routes while preserving the current collection; the last item is noninteractive. The guideline dialog’s parent breadcrumb closes it through the same discard/focus-restoration path as Cancel. Mobile breadcrumbs use A1’s parent/back treatment.

Action confirmations use the shared `Feedback` wrapper around A1 Snackbar. Success messages appear at the bottom for six seconds, pause on hover/focus and can be dismissed. Each announcement has a new ID so repeated messages reset the lifetime; navigation does not erase success feedback. Recoverable errors use persistent dismissible snackbars, including inside dialogs so they remain available in the native modal layer. The global error snackbar retains Reload workspace. Durable source/visibility notices and loading state stay in context.

## App changelog

Maintain `apps/sce-hub/changelog.md` for changes to the app’s implementation, features and interface only. Never append guideline decisions, metadata edits, uploads or other in-app actions. The Activity page and overview feed are removed; the old `#activity` route redirects to Overview. Record revisions remain available for restoration and conflict checks. Existing activity rows are retained only in database backups, not actively read or appended.

## Styling and maintenance

Verified locally on Oct. 30, 2026: production frontend build; 14 server/model test groups; three browser tests covering the end-to-end workflow, Markdown rendering/security and the audit document navigation; axe scans on the overview, guideline detail, audit, weekly summaries, search, settings and canvas; overflow checks at 375, 640, 900, 1200 and 1600 pixels; and guideline checks in accessible, heritage and dark themes. The browser suite also checks mobile navigation, dialog Escape/focus restoration and persisted map positions. Source import reruns produced no duplicate records, and a consistent SQLite backup was created successfully. An isolated copy of the real database verified 13-page indexing, later-page search, byte-identical authenticated PDF downloads, unauthenticated denial and successful upload extraction. Vite denies direct access to source PDFs, SQLite files and local environment files. Cloud deployment checks are recorded in the deployment section; live AI remains disabled.

Use A1 layout and interaction components first. `src/styles.css` only provides source-text wrapping, preview geometry, skip link and native-file-input support; visual values resolve to existing tokens. The app has no Print action, print-specific styles or print-time theme switching. No shared component APIs or theme tokens are changed. Product text uses sentence case. Preserve verbatim original source wording even when it differs from A1 copy conventions.
