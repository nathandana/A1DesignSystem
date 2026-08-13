# A1 Design System — MCP server

A remote [Model Context Protocol](https://modelcontextprotocol.io/) server that exposes the A1 Design
System's component registry, design tokens, design rules, and page-definition contract to AI coding
agents — inside this repo or in any other project consuming `@gtivr4/a1-design-system-react`.

It's a **stateless Streamable HTTP** endpoint: one JSON-RPC 2.0 request in, one response out, no
session state. Deployed as a single Netlify Function backed by a static index rebuilt on every deploy.

## Why this exists

Agent Rules #1–#2 in the repo's `CLAUDE.md` say "use the system first" and "do not invent values."
Today that means an agent has to load and parse `packages/react/ai/*.md` by hand. This server gives
any MCP-aware agent structured tools instead — `get_component("Card")` instead of grepping a 3,000-line
markdown file for the right blockquote.

## Architecture

```
scripts/build-index.mjs   Reads across the monorepo, writes index.json (build time)
  lib/parse-tokens.mjs      build/json/tokens.json -> flattened { path, cssVar, value }[]
  lib/parse-themes.mjs      system/themes/*/theme.json + overrides -> per-theme token deltas
  lib/parse-rules.mjs       system/rules/*.yaml -> the same Rule shape as apps/a1-web's ruleStore.ts
  lib/parse-components.mjs  components.md tables/sections + component .d.ts files (TS compiler API)
  lib/parse-page-types.mjs  apps/a1-web/src/editor/pageTypes.ts ComponentType union
  lib/docs.mjs               full text of a1-agent-brief.md + page-definition-standard.md

netlify/functions/mcp.mjs  Loads index.json once per cold start, serves the MCP JSON-RPC surface
netlify.toml               Netlify site config (build command, functions dir, /mcp redirect)
public/index.html          Minimal status/landing page (the site's `publish` directory)
```

`index.json` is a **build artifact**, not hand-edited — regenerate it any time components.md, a
component's `.d.ts`, tokens, themes, rules, or the page-definition contract changes.

## Commands

Run from the repo root (see `packages/react/ai/quick-orientation.md`):

| Task | Command |
|---|---|
| Rebuild the static index | `npm run build:mcp-index` |
| Local dev server | `npm run dev:mcp-server` (fixed port `5190`) |

The dev server needs a **fresh** `build/json/tokens.json` and `index.json` — run
`npm run build:tokens && npm run build:mcp-index` first if either is stale.

## Tools

| Tool | Purpose |
|---|---|
| `list_components` | Coverage list (React/Native/Pure/Web Components/Figma), filterable by category or package |
| `get_component` | Full detail for one component: coverage, structured `.d.ts` props, and the relevant components.md excerpt |
| `search_tokens` | Substring search over token dotted-paths and CSS variable names |
| `get_token` | Exact token lookup by path or CSS var, including its value under every theme that overrides it |
| `list_themes` | Theme id/name/description/selectors |
| `list_rules` | Design rules from `system/rules/*.yaml`, filterable by component or `applies_to` category |
| `list_page_types` | The locked page-definition `ComponentType` registry |

## Resources

| URI | Content |
|---|---|
| `a1://docs/agent-brief` | `packages/react/ai/a1-agent-brief.md`, full text |
| `a1://docs/page-definition-standard` | `packages/react/ai/page-definition-standard.md`, full text |

## Connecting a client

```
claude mcp add --transport http a1-design http://127.0.0.1:5190/mcp   # local dev
claude mcp add --transport http a1-design https://mcp.a1design.app/mcp  # deployed
```

## Scope notes / known limitations

- **Token theme resolution is a lookup, not the build pipeline.** `get_token`'s per-theme values come
  from resolving `{alias}` references in each theme's DTCG override file against the base token list —
  not from running `system/theme-config.mjs`/`system/build-themes.mjs`. It's accurate for the vast
  majority of tokens but isn't guaranteed to match the generated CSS byte-for-byte in every edge case.
- **Component matching is name-based, not manually curated.** `get_component` matches a
  components.md display name to its `.d.ts` export by exact match, then by a prefix/suffix heuristic
  (see `DISPLAY_NAME_ALIASES` in `scripts/lib/parse-components.mjs` for the couple of manual
  exceptions). One component, **Inline** (kbd/mark — CSS-only, no JS export), legitimately has no
  matched props.
- **No auth.** Everything served is already-published, non-sensitive documentation, so the endpoint is
  public and unauthenticated. Revisit if usage patterns ever call for a shared-secret header.
- **No automated tests yet.** The parsers were verified by hand against the generated `index.json`
  (see the build order in the implementation plan). A `vitest` suite around `scripts/lib/*.mjs` is a
  reasonable follow-up if this grows.
