# a1-web

The documentation and component-explorer site for the **A1 Design System**. It renders the live React components, foundations (tokens, color, type, motion, etc.), per-component configurators, and the accessibility report — all driven by the same Style Dictionary tokens that ship in the packages.

## Running locally

Both commands are defined in the **repo root** `package.json` and use `--strictPort`, so they fail loudly if the port is taken rather than silently moving.

```bash
# From the repo root
npm run dev:a1-web     # → http://127.0.0.1:5177/
npm run storybook      # → http://127.0.0.1:6006/  (component stories)
npm run codex:bridge:a1-web  # optional local Codex bridge for Virtual PO + Build with AI (4318)
# A1_CODEX_MODEL=gpt-5.2 npm run codex:bridge:a1-web  # override the cheaper default
# A1_CODEX_REASONING_EFFORT=medium npm run codex:bridge:a1-web  # optional quality/latency tradeoff
```

The Virtual PO's checked-in question skill lives at
`src/services/backlog/personas/productOwnerSkill.md`. The bridge runs Codex in read-only
mode, accepts only local browser connections, and falls back to the deterministic reviewer
when it is not running. Build with AI sends the ticket, comments/Q&A, related tickets, and
manual direction to the virtual-engineer route; the bridge also loads the installed ponytail
skill so plans classify the work and omit irrelevant CSS guidance. The one-click engineer review
keeps the existing Build with AI plan, appends Codex guidance after it, and surfaces clarifying
questions inline for the next review.

This project uses **Node 24** (via nvm). If `npm` can't be found:

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && nvm use 24
```

> **Tokens first.** The app imports `build/css/tokens.css` directly. After any change under `system/tokens/` or `system/themes/`, rebuild before viewing:
> ```bash
> npm run build:tokens && npm run build:html-css
> ```

### App-local scripts

Run from `apps/a1-web/` (the root `dev:a1-web` script is preferred for the stable port):

| Script | What it does |
|--------|--------------|
| `npm run dev` | Vite dev server on `127.0.0.1:5177` |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build on `127.0.0.1:4177` |

## Access roles

Hosted access uses cumulative Guest, User, Editor and Administrator roles.
Signed-in roles come from trusted Supabase `app_metadata.role`; accounts without
an explicit role default to User. Apply
[`supabase/migrations/20260729_a1_405_user_access.sql`](supabase/migrations/20260729_a1_405_user_access.sql)
and
[`supabase/migrations/20260729_a1_405_user_management.sql`](supabase/migrations/20260729_a1_405_user_management.sql)
to existing workspaces before enabling role-based policies and administrator
user management.

The Administration page calls the same-origin Netlify function at
`/.netlify/functions/user-admin`. Configure `SUPABASE_URL` and
`SUPABASE_SERVICE_ROLE_KEY` through Netlify's environment-variable UI, with the
service key available only to Functions when scoped variables are supported.
Never add the service key to a `VITE_*` variable or the client bundle. The
function verifies the caller's Supabase session and Administrator role before
listing accounts, sending invitations or changing roles. Use Netlify Dev when
testing this function locally; the Vite-only development server does not host
Netlify functions. See
[`packages/react/ai/access-control.md`](../../packages/react/ai/access-control.md)
for the feature matrix, bootstrap guidance, enforcement boundaries and
remaining follow-ups.

## Architecture

A single-page app with **no router dependency** — navigation is driven by a `?page=` query param managed with the History API.

- **Entry:** [src/main.jsx](src/main.jsx) — mounts the `App`, owns global state (theme, color scheme, locale, reduced-motion, contrast, active page, component search, detail tab), and renders the `PageLayout` shell, `TopHeader`, and the settings `Menu`.
- **Shell:** Uses the design system's `PageLayout` with three slots:
  - `header` — `TopHeader` with Resources / Foundations / Components / Templates nav.
  - `sidebar` — the components nav, shown only on component routes (`getComponentsSidebar`).
  - `aside` — the right-hand configuration panel, shown only on a component detail page's **Configure** tab (`getComponentsAside`).
- **Themes:** Theme + color scheme are applied as classes on `<html>` and persisted to `localStorage`. Locale is wired through `LabelsProvider` using the JSON files in `system/labels/`.

### Routing model

`getPage()` reads `?page=` and validates it against the `PAGES` whitelist (falling back to `home`). Route IDs:

| Pattern | Example | Renders |
|---------|---------|---------|
| top-level | `?page=foundations` | a foundation/resource/overview page |
| category | `?page=components-typography` | `ComponentCategoryPage` |
| component | `?page=component-heading` | `ComponentDetailPage` |

### Component detail configurators

Each component detail page is backed by a **per-component module registry** in [src/pages/components/detail/](src/pages/components/detail/).

- [detail/index.js](src/pages/components/detail/index.js) — `getDetailModule(componentId)` merges a component-specific module over [generic.jsx](src/pages/components/detail/generic.jsx). Anything a module doesn't export falls back to the generic implementation.
- Each module exports four things:
  - `getDefaultConfig(component)` — the initial config object.
  - `Preview({ component, config })` — live render of the component from the config.
  - `Controls({ config, setConfig })` — the form in the Configure panel (uses `ChoiceGroup`, `SelectField`, `TextareaField`, etc.).
  - `Snippet({ config })` — the copy-pasteable JSX, rendered in a `<Code>` block.
- [ComponentDetailPage.jsx](src/pages/components/ComponentDetailPage.jsx) resolves the module, holds the config/display state, and `createPortal`s the `Controls` into the `#a1-web-config-aside-slot` mounted by the shell.

A component only needs a module when it wants bespoke controls — to add one, create `detail/<id>.jsx`, implement the exports you need, and register it in `detail/index.js`. Existing modules (heading, paragraph, blockquote, list, code, divider, …) are good templates.

## Directory layout

```
apps/a1-web/
├── index.html              Loads fonts + Material Symbols, mounts #root
├── vite.config.js
├── src/
│   ├── main.jsx            App shell, routing, global state, settings menu
│   ├── styles.css          App-specific styles (a1-web-* classes)
│   ├── pages/
│   │   ├── Home / Features / GetStarted / Templates / Projects / Releases / Accessibility
│   │   ├── foundations/    Token + foundation pages (color, type, motion, …)
│   │   └── components/
│   │       ├── ComponentsSidebar.jsx       Left nav (search + tree)
│   │       ├── ComponentDetailPage.jsx     Detail page + config portal
│   │       ├── ComponentCategoryPage.jsx   Category landing
│   │       ├── ComponentsOverviewPage.jsx  All-components landing
│   │       ├── data.js / utils.js          Registry + route helpers
│   │       └── detail/                      Per-component configurator modules
│   └── ...
└── CHANGELOG.md
```

## Conventions

- All visual values come from design tokens (CSS custom properties) — no hardcoded colors, spacing, or type values, even in app-only `a1-web-*` styles.
- Use A1 components and layout primitives (`Stack`, `Grid`, `Section`, `Card`) before writing custom layout CSS.
- The React package is the source of truth — this app consumes `@gtivr4/a1-design-system-react`; it does not redefine component behavior.
- See the root [CLAUDE.md](../../CLAUDE.md) and `packages/react/ai/` for the full system rules.
