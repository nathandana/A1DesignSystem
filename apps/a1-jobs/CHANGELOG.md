# A1 Jobs Changelog

## Unreleased

- Clarified the persistent local-only boundary: SQLite records and generated PDFs stay on the local machine and generated resume files are excluded from Git.
- Migrated A1 Jobs from Supabase auth/data to a local SQLite store served through the Vite `/api/local-store` endpoint.
- Added the first local jobs workspace: application dashboard, Codex-bridge assisted application drafts, Gmail communication hooks, and extension-assisted form autofill scaffolding.
- Added the companion Chrome extension for scanning external company/ATS application forms and filling reviewed field mappings without submitting.
- Added Nathan Dana personal profile defaults so candidate details are seeded once and reused from local storage.
- Added URL-first smart intake: public job URLs can be fetched through the Codex bridge, parsed into a job page, and expanded into editable overview, resume, cover letter, portfolio, and A1 notes.
- Added manual-check fallback for URL imports that are blocked, expired, filled, closed, unavailable, or unreadable; these create tracked leads with extension instructions.
- Changed the extension Job Page flow to start blank and require an explicit Scan page click before scraping and sending the active logged-in page to A1 Jobs.
- Replaced the primary Add job action with a URL dialog and added duplicate URL detection before creating new application records.
- Added live progress feedback for application package and interview prep generation, showing the current Codex, save, status, and refresh phase.
- Added resume PDF export for generated resume documents.
- Switched the app to a local-only runtime: Gmail handlers run through the Vite `/api/*` shim, extension permissions target localhost, and app-level Netlify deployment config was removed.
- Added original job URL, application URL, LinkedIn company search, and extension-assisted visible LinkedIn contact imports on job pages.
- Added a tabbed extension popup with a Job Page mode that reads the active rendered posting in-browser and imports it into A1 Jobs without bridge-side URL fetching.
