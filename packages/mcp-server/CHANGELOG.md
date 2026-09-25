# @gtivr4/a1-design-system-mcp Changelog

## Unreleased

## 0.1.1 — 2026-09-25

- **Custom block** (A1-2541) — Indexed the CustomBlock React API, usage rules, tokens and JSON authoring contract, including the last-resort and sandbox boundaries.

- **Initial release** — a remote [Model Context Protocol](https://modelcontextprotocol.io/) server exposing the A1 component registry, design tokens, theme overrides, `system/rules/*.yaml` design rules, and the page-definition `ComponentType` registry to AI coding agents as JSON-RPC tools and resources. A build-time indexer (`npm run build:mcp-index`) compiles a static `index.json` from `components.md`, each component's `.d.ts`, `build/json/tokens.json`, `system/themes/*`, `system/rules/*.yaml`, and `apps/a1-web/src/editor/pageTypes.ts`; a stateless Streamable HTTP Netlify Function serves it. Tools: `list_components`, `get_component`, `search_tokens`, `get_token`, `list_themes`, `list_rules`, `list_page_types`. Resources: `a1://docs/agent-brief`, `a1://docs/page-definition-standard`.
