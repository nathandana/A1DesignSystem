# SCE workspace

Nathan Dana’s private design-system working hub. This is an independent project workspace, not an official SCE product. Built with the repository’s React, Vite, A1 components and tokens. The server runs on Node 24. The hosted workspace uses Supabase PostgreSQL and private PDF storage through Netlify Functions; SQLite remains available for isolated local use.

Project context, architecture, source coverage, setup, verification and deployment instructions are maintained in [the SCE workspace guide](../../packages/react/ai/sce-workspace.md).

App development changes are tracked in [changelog.md](changelog.md); workspace actions are not logged there.

Quick start, from the repository root:

```sh
npm run build --workspace=sce-hub
npm start --workspace=sce-hub
```

Open http://127.0.0.1:5191. The current local `.env` enables password-free owner access on this computer and connects to the same Supabase data as the hosted workspace. With `SCE_LOCAL_ACCESS=false`, sign in with your existing account. A fresh isolated SQLite workspace offers initial owner setup only on loopback in development, before an account exists; no default password exists. The original SQLite archive is retained in the ignored `apps/sce-hub/data/` directory. Source data and server credentials are never bundled into frontend assets.

The local workspace includes 732 guideline candidates, 70 source documents and the supplied audit PDF, with text indexed from all 13 pages. Live AI is disabled; the assistant includes a labeled fictional example. Published at https://sce.a1design.app on Netlify project `a1design-sce`. The owner signs in with their existing A1 Supabase account. See the workspace guide for deployment verification.
