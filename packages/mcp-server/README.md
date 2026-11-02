# A1 Design System — MCP server

A remote [Model Context Protocol](https://modelcontextprotocol.io/) server that exposes the A1 Design
System's component registry, design tokens, design rules, and page-definition contract to AI coding
agents — inside this repo or in any other project consuming `@gtivr4/a1-design-system-react`.

It's a **stateless Streamable HTTP** endpoint: one JSON-RPC 2.0 request in, one response out, no
session state. The MCP function uses a generated static index whose freshness is checked on every deploy. Temporary previews use a separate Netlify Blobs store and retrieval/cleanup functions.

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
| Check index freshness | `npm run build:mcp-index:check` |
| Check pattern manifests and tests | `npm run patterns:check && npm run test:patterns` |
| Verify deployed contract parity | `npm run patterns:verify-mcp -- <endpoint-url>` |
| Local dev server | `npm run dev:mcp-server` (fixed port `5190`) |

The dev server needs a **fresh** `build/json/tokens.json` and `index.json` — run
`npm run build:tokens && npm run build:mcp-index` first if either is stale.

## Tools

| Tool | Purpose |
|---|---|
| `get_react_setup` | npm installation, package metadata and the canonical React setup guide, including CSS, fonts, PostCSS, themes and examples |
| `get_json_model` | Copy-ready page or project starter plus a structural JSON Schema generated from the current component type registry |
| `create_preview` | Validate JSON and store a temporary rendered preview; returns a 30-day URL, expiry and diagnostics without saving a workspace project |
| `validate_json` | Shared page/project validation with stable codes, JSON Pointer paths, errors and advisory warnings; never changes or saves input |
| `list_components` | Coverage list (React/Native/Pure/Web Components/Figma), filterable by category or package. Patterns (`packages/react/src/patterns/`) appear under the `Patterns` category |
| `get_component` | Full detail for one component: coverage, structured `.d.ts` props, and the relevant components.md excerpt |
| `get_pattern` | Versioned manifest, props schema, ordered areas, locked props, policies, empty starter, populated examples and migrations |
| `validate_patterns` | Shared structured pattern diagnostics without mutating input (not whole-page validation) |
| `migrate_pattern` | Explicit proposed legacy migration; conflicts/future versions retain source |
| `search_tokens` | Substring search over token dotted-paths and CSS variable names |
| `get_token` | Exact token lookup by path or CSS var, including its value under every theme that overrides it |
| `list_themes` | Theme id/name/description/selectors |
| `list_rules` | Design rules from `system/rules/*.yaml`, filterable by component or `applies_to` category |
| `list_page_types` | The locked page-definition `ComponentType` registry |

## Resources

| URI | Content |
|---|---|
| `a1://docs/react-setup` | `packages/react/guidelines/setup.md`, the same setup guide shipped in the npm package |
| `a1://docs/pattern-contracts` | Generated reference from `system/patterns/*.json` |
| `a1://docs/json-validation` | Validation request/result contract, repair workflow, sources and limits |
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
- **Pattern parity is tested.** `tests/patterns/mcp.test.mjs` calls the function handler and checks discovery, diagnostics and migrations. The postdeploy parity script checks the actual HTTP endpoint. Token/theme parser behavior is outside this focused suite.
- **JSON validation is shared.** `get_json_model` exposes generated page/project envelopes; `get_component` includes the JSON prop schema alongside the React API. Use `get_pattern` for governed starters, then `validate_json` for the whole document. A1 Web imports and page editing call the same validator. Rendered layout and runtime accessibility require separate checks.

## Install the React library

Call `get_react_setup` with `{}` to get the npm install command, package page,
React peer requirements and complete setup instructions. Clients that support
resources can also read `a1://docs/react-setup`. MCP initialization points agents
to this tool, and `get_component` links back to the setup resource.

The guide is indexed directly from the React package's canonical setup document;
package name, source version and peer requirements come from its manifest. It
covers CSS import order, fonts, PostCSS custom media, Vite/Next.js, themes,
providers and a minimal React page. `sourceVersion` is the indexed repository
version, not a live npm lookup. Use the returned `npm view` command before
pinning a version that may not have been published yet.

## Validate generated JSON

Read the model, generate JSON, then call `validate_json` with
`{ "kind": "page", "document": { "schemaVersion": "1.1.0", "page": { ... } } }`.
Use `kind: "project"` for a project bundle. `document` also accepts JSON text;
malformed text returns diagnostics. Optional `contractVersion: "1.1.0"` pins the
validator contract; unsupported pins are rejected explicitly.

Results contain `valid`, `contractVersion`, `errors` and `warnings`, returned as
both MCP `structuredContent` and JSON text. Each diagnostic includes a stable
`code`, a JSON Pointer `path` and a readable `message`, plus allowed values or
pattern recovery details where applicable. Repair errors and revalidate; warnings
are advisory. No JSON is modified, persisted, executed or published.

The shared core lives in `system/json-model/validate.js`. Run
`npm run build:json-contract` after changing page/project declarations, React
props, adapter config or formal patterns, then `npm run build:mcp-index`.
`npm run json-contract:check` and `npm run test:json-validation` verify freshness
and MCP/editor parity. See [the full contract and limitations](../react/ai/json-validation.md).

## Formal pattern generation

Author contracts under `system/patterns/`, then run `npm run build:patterns` and
`npm run build:mcp-index`. Index schema `0.2.0` adds `patterns`; existing component
discovery remains compatible and `get_component` includes the matching contract.
Do not hand-edit the generated artifacts. Netlify and release CI reject stale
artifacts. See [implementation and release checks](../react/ai/pattern-contract-recommendations.md).

## Create rendered previews

After `validate_json`, call `create_preview` with the same arguments. Valid input
returns `previewUrl`, `previewId` and `expiresAt` alongside diagnostics. Open the
URL to inspect real A1 rendering; revised JSON creates a new snapshot and URL.
This tool writes temporary storage and advertises `readOnlyHint: false`.

For non-MCP clients, `POST https://mcp.a1design.app/previews` accepts the same
body. `GET /previews/:id` retrieves the snapshot until expiry. Anyone with the
link can view it for 30 days. The isolated viewer cannot read signed-in A1
workspace storage. Creation does not import or publish a project. Anyone can
choose **Edit as project** from the trusted banner: guests edit a browser-local
copy, while signed-in viewers use their workspace. Expired links
return 410; an hourly function removes expired records.

Deploy both sites together. MCP `A1_PREVIEW_APP_URL` defaults to
`https://a1design.app`; viewer `VITE_A1_PREVIEW_API_URL` defaults to
`https://mcp.a1design.app`. Blobs uses the Netlify site environment automatically.
See [preview contracts, limits, local setup and standards review](../react/ai/json-validation.md#temporary-rendered-previews).

Netlify API references: [Blobs](https://docs.netlify.com/build/data-and-storage/netlify-blobs/)
and [function configuration](https://docs.netlify.com/build/functions/api/).

## Design context

Read `a1://docs/design` for the generated A1 design vocabulary and rationale. It is identical to [design.md](../../design.md) and the [public download](https://a1design.app/design.md). The [Design with A1 guide](https://a1design.app/design-with-a1) covers React-first setup and direct JSON workflows. Regenerate after tokens or rationale change with `npm run build:tokens && npm run build:design-md && npm run build:mcp-index`.
