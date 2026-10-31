# Changelog

Tracks changes to the app’s code, features and interface only. Guideline decisions, metadata edits, uploads and other workspace actions do not belong here.

## 0.1.1 — Oct. 31, 2026

- Published to `sce.a1design.app` on Netlify with Supabase persistence.
- Added a Supabase PostgreSQL backend, private PDF storage and Netlify API deployment, with existing A1 account sign-in for the owner. Preserved record revisions and transactional conflict checks. Local development can use the same cloud data or an isolated SQLite workspace.
- Compressed large API responses for serverless exports and made the cloud PDF upload limit visible (4 MB).
- Isolated SCE's Supabase SDK dependencies while retaining the existing versions used by other apps.
- Added CI for the production build, server tests and isolated browser/accessibility checks.

- Placed every PageTitle flush against its page container, with no outer margins or inset wrapper. Body padding and demonstration notices now sit in a separate section below the title.

## 0.1.0 — Oct. 30, 2026

- Applied A1’s PageTitle pattern across workspace, record, visitor and sign-in pages, including functional breadcrumbs, metadata and page actions.

- Moved audit page navigation to the right and added A1 dividers between article sections.

- Removed the Activity page, recent-activity panel and event logging. Weekly drafts now link current records last updated during the selected week.

- Rebuilt Website audit as one readable source document with A1 Page Nav, semantic tables, source-page links and a compact PDF-versions disclosure.
- Removed Releases from active workflows and navigation, preserving historical records in archival storage.

- Moved action confirmations and recoverable errors to dismissible A1 snackbars; success feedback survives navigation and automatically dismisses.

- Removed the Print action, print styles and print-time theme switching.
- Kept section navigation selected for nested records and guideline dialogs, with functional A1 breadcrumbs and mobile parent links.

- Simplified guidelines to A1 table filters and a compact metadata/review dialog with Approve, Reject, Discuss and Cancel; removed the required rationale and multi-stage review interface.

- Rendered source Markdown as semantic A1 headings, lists, tables, links, quotes and code, with local document navigation and unchanged source records.

- Added optional password-free local access, restricted to loopback and disabled in production.
- Added an isolated SCE project workspace built with A1 components and tokens.
- Added private server-side access, owner/editor/reviewer/viewer roles, session revocation and durable SQLite migrations.
- Added source imports, canonical multi-tag guidelines, independent wording and decision histories, discussion, saved filters and bulk review.
- Added an editable dependency canvas with keyboard/list alternatives, stored layout, typed relationships and impact tracing.
- Added protected, versioned PDF uploads, indexing coverage, source summaries and linked findings.
- Added activity history, revision restoration, curated releases, on-demand New York weekly drafts, search, exports and fictional cited assistant examples.
- Added a public-demo allowlist that cannot expose real SCE records; private access remains the default.
- Prepared persistent-volume deployment configuration for sce.a1design.app. Publication and DNS changes are not performed.
