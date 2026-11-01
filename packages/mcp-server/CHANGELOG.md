# @gtivr4/a1-design-system-mcp Changelog

## Unreleased

## 0.4.0 — 2026-11-01

- **Design context** (A1-2738) — added `a1://docs/design` and initialization guidance for the generated A1 design document. Web and MCP build checks reject stale design downloads.

- **React library setup** — added `get_react_setup` and `a1://docs/react-setup` with npm installation, manifest-derived React requirements and the canonical CSS/font/PostCSS/theme guide. Initialization and component responses point agents to setup; source versions are explicitly distinguished from published npm versions.

- **Rendered previews** (A1-2737 follow-up) — added `create_preview` and HTTP POST/GET preview endpoints backed by temporary Netlify Blobs snapshots. Creation revalidates JSON; responses include URL and expiry. Added hourly cleanup, read-time expiry, request limits and deployment configuration.
- **Page and project JSON validation** (A1-2737) — added read-only `validate_json` with structured results and JSON Pointer diagnostics, sharing the A1 Web validator. Discovery includes generated JSON prop schemas, validation guidance and the JSON-validation resource. Generated contracts and MCP/editor parity checks run before deployment.

- **JSON authoring model** (A1-2731) — added `get_json_model` for a copy-ready page definition or project bundle, paired with a structural JSON Schema whose component type enum comes from the current editor registry. Component props and governed pattern rules continue through the existing specialized MCP tools. MCP initialization now negotiates ChatGPT-supported protocol versions, and tool discovery advertises draft-07 schemas with read-only annotations.

- **Pattern tools on the MCP homepage** (A1-2729) — the landing page now identifies `get_pattern`, `validate_patterns`, `migrate_pattern` and the pattern-contract resource so agents can discover the pattern APIs without first reading the repository documentation.

## 0.2.0 — 2026-10-30

- **Patterns in the index** (A1-2720) — the `## Patterns` section of `components.md` is indexed as a category, and the `.d.ts` walker also reads `packages/react/src/patterns/`, so `list_components` / `get_component` cover `Page Title` with its props. The page-type registry picks up `PageTitle` automatically.

## 0.1.2 — 2026-10-12

- **Reported server version** — MCP initialization now reads the package version instead of reporting the original hardcoded 0.1.0.

- **Labs and shared component contracts** (A1-2698) — refreshed the static index with Labs token families, DataTable pagination configuration, TopHeader end content, StatusBar pause control, Code wrapping utilities and updated agent guidance.

## 0.1.1 — 2026-09-25

- **Custom block** (A1-2541) — Indexed the CustomBlock React API, usage rules, tokens and JSON authoring contract, including the last-resort and sandbox boundaries.

- **Initial release** — a remote [Model Context Protocol](https://modelcontextprotocol.io/) server exposing the A1 component registry, design tokens, theme overrides, `system/rules/*.yaml` design rules, and the page-definition `ComponentType` registry to AI coding agents as JSON-RPC tools and resources. A build-time indexer (`npm run build:mcp-index`) compiles a static `index.json` from `components.md`, each component's `.d.ts`, `build/json/tokens.json`, `system/themes/*`, `system/rules/*.yaml`, and `apps/a1-web/src/editor/pageTypes.ts`; a stateless Streamable HTTP Netlify Function serves it. Tools: `list_components`, `get_component`, `search_tokens`, `get_token`, `list_themes`, `list_rules`, `list_page_types`. Resources: `a1://docs/agent-brief`, `a1://docs/page-definition-standard`.
