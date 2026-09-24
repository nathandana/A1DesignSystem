# A1 Design System — Quick Orientation

## Build commands

| Task | Command |
|------|---------|
| Token + theme + html-css rebuild | `npm run build:tokens && npm run build:html-css` |
| Theme rebuild only | `npm run build:themes` |
| Color-token inventory + validation | `npm run tokens:audit:check` |
| Update computed color contract | `npm run tokens:contract:update` |
| Check computed color contract | `npm run tokens:contract:check` |
| Verify react npm tarball (imports, entry points, guidelines sync) | `npm run pack:check` |
| Regenerate component History from the maintenance log | `npm run history:generate` (`:check` to verify freshness) |
| Full QA (axe + visual + report) | `npm run test:qa` |
| Update visual baselines | `npm run test:qa:update` |
| A1-Web route baseline | `npm run test:a1-web` |
| Update A1-Web route baselines | `npm run test:a1-web:update` |
| A1-Web release gate | `npm run release:a1-web:check` |
| Storybook dev | `npm run storybook` |
| a1-web dev | `npm run dev:a1-web` |
| General dev server | `npm run dev` |
| Rebuild the MCP server's static index | `npm run build:mcp-index` |
| MCP server local dev | `npm run dev:mcp-server` |

## Stable local ports

Use the root scripts for bookmarkable local URLs. They all use `--strictPort`, so the command fails if the reserved port is busy instead of silently moving to another port.

| App/site | Command | URL |
|----------|---------|-----|
| Examples index | `npm run dev` | `http://127.0.0.1:5176/` |
| a1-web | `npm run dev:a1-web` | `http://127.0.0.1:5177/` |
| a1-web local bridge (Codex + Figma handoff) | `npm run codex:bridge:a1-web` | `http://127.0.0.1:4318/` |
| Tesla A1 | `npm run dev:tesla-a1` | `http://127.0.0.1:5188/` |
| Tesla A1 proxy-backed app | `npm run serve:tesla-a1` | `http://127.0.0.1:5189/` |
| Storybook | `npm run storybook` | `http://127.0.0.1:6006/` |
| Priority Guide | `npm run dev:priority-guide` | `http://127.0.0.1:5178/examples/priority-guide/` |
| Cat Stack Cafe | `npm run dev:cat-stack-cafe` | `http://127.0.0.1:5179/examples/cat-stack-cafe/` |
| Theme Editor | `npm run dev:theme-editor` | `http://127.0.0.1:5180/examples/theme-editor/` |
| Catlympics | `npm run dev:catlympics` | `http://127.0.0.1:5181/examples/cat-lympics/` |
| MCP server | `npm run dev:mcp-server` | `http://127.0.0.1:5190/mcp` |

Always run `npm run build:tokens && npm run build:html-css` after any change to `system/tokens/` or `system/themes/` before testing or committing.

## Key file locations

| What | Where |
|------|-------|
| Token source files | `system/tokens/` |
| Theme source files | `system/themes/` |
| React components | `packages/react/src/components/{name}/` |
| BEM classes (generated — edit `componentCss()` in `scripts/build-html-css.mjs`) | `packages/pure/dist/a1-base.css` |
| Hand-authored pure classes | `packages/pure/dist/a1-pure.css` |
| Pure example site | `examples/a1-pure/` |
| Color scheme switching (dark mode, inverse) | `packages/react/src/color-scheme.css` |
| Component registry | `packages/react/ai/components.md` |
| a1-web app | `apps/a1-web/src/` |
| Accessibility report data | `reports/a11y.json` |
| MCP server (remote, agent-facing design-system API) | `packages/mcp-server/` |

## Node version

This project uses Node v24 via nvm. If commands fail to find `npm`, run:

```
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && nvm use 24
```


## Portfolio homepage

Run `npm run dev`, then open
`http://127.0.0.1:5176/examples/portfolio/`. Standalone deployments use
`/`. The former alternate design is now `pages/HomePage.jsx`; `/alternate` remains
a compatible alias. The original source is preserved in `pages/archive/HomePage.jsx`.
Open it directly; it uses the unchanged portfolio sidebar, mobile
navigation and shared footer. Build with
`npm run build --prefix examples/portfolio`.

The page follows the broad content structure of https://nabauer.com/ while using
Nathan Dana's existing content, case-study assets and demo files. The placeholder
writing section has been removed. The page uses existing A1 components and the portfolio's Dispatch
theme; no custom CSS or component contracts were added.

### Reference site robots inspection — Sept. 22, 2026

- https://nabauer.com/robots.txt returns HTTP 200 with `User-agent: *`, `Allow: /`
  and `Sitemap: https://nabauer.com/sitemap.xml`. It has no disallow rules or
  crawler-specific AI restrictions.
- The homepage includes `<meta name="robots" content="index, follow">` and a
  self-referencing canonical URL. Its inspected HTTP response has no
  `X-Robots-Tag` header.
- The sitemap returns XML listing the homepage, work, articles and other pages,
  with modification dates, change frequencies and priorities.
- HTML contains Next.js assets and rendered page content; the HTTP server header
  identifies Cloudflare. This supports Next.js behind Cloudflare, but does not
  establish the origin hosting service.
- These are crawler directives, not access controls or a guarantee of indexing.
  This inspection does not establish how every individual crawler is treated.

The local portfolio currently has no dedicated robots.txt or sitemap.xml and no
robots meta tag in its HTML entry point. Its Netlify catch-all rewrites unmatched
paths to index.html, so absent static robots/sitemap files can receive the SPA
HTML instead. This is a source-configuration observation, not a live-domain
check. No crawler configuration was changed for this alternate-page request.

### Primary case studies and archives

Transform, A1 and Fondue now render their promoted alternate designs at the
existing primary URLs: `/case-studies/transform`, `/case-studies/a1` and
`/case-studies/fondue`. Prefix these paths with
`http://127.0.0.1:5176/examples/portfolio` for local development.

Primary source files are `examples/portfolio/studies/TransformStudy.jsx`,
`A1Study.jsx` and `FondueStudy.jsx`. The original implementations are preserved
in `examples/portfolio/studies/archive/` with corrected relative imports. Archives
are source snapshots, not published pages or navigation entries.

Existing `*-alternate` URLs and `fondue-alternate-2` remain compatible aliases
through `data/caseStudyAliases.js`. They resolve to the canonical study for
rendering, titles, navigation selection and focus metadata. New internal links
use the primary URLs. The promoted homepage is at `/`; `/alternate` remains a compatible alias.

The promoted pages retain their content, figures, overview cards and numbered
sections. Transform includes the supplied TruCare Cloud determinations example;
Fondue includes its component inventory and preventive care example.

### Audience-specific portfolio setup

See [the portfolio audience guide](../../../examples/portfolio/AUDIENCE-PORTFOLIOS.md)
for the proposed Netlify subdomain redirects, audience selection, application
attribution and PostHog overlap reporting. This is an implementation guide;
audience rendering and analytics are not enabled by the documentation change.

### Portfolio UX/DS content classification

See [portfolio-focus.md](portfolio-focus.md) for the content metadata contract,
page registry, inline annotations, inheritance and future filtering helpers.
Run `node --test examples/portfolio/tests/focus.test.js` for the contract checks.
