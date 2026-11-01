# Design with A1 — A1-2738

The public `/design-with-a1` page leads with the npm React workflow, then explains agent setup and the A1 JSON → validate → preview → project import path. It lives in Explore and global search and is available to guests. PageTitle sits flush with the page; the body is a separate constrained Section. Agent setup uses A1 Accordion and Code, including the existing clipboard feedback and keyboard behavior.

## Design document and maintenance

`design.md` at the repository root is generated using Google's alpha DESIGN.md format: YAML token values followed by the eight ordered rationale sections. A1's default light appearance is the documented snapshot; theme/mode overrides remain authoritative. It is a selected vocabulary, not an exhaustive token or component API. Never paste these literal values into application styling.

- Token input: `build/json/tokens.json`, generated from the canonical system sources by Style Dictionary. The generator reuses the MCP token reader.
- Authored rationale: [design-md-body.md](design-md-body.md).
- Generator: `scripts/build-design-md.mjs`.
- Output: root `design.md` and identical `apps/a1-web/public/design.md`.
- Additional public references: byte-for-byte copies of the canonical React setup guide and JSON agent brief, served as `/react-setup.md` and `/a1-agent-brief.md`. This gives clients without MCP usable context without maintaining another guide.
- MCP: `a1://docs/design` is discoverable in resources and initialization instructions.

After changing inputs, run:

```sh
npm run build:tokens
npm run build:design-md
npm run build:mcp-index
npm run design-md:check
npm run build:mcp-index:check
```

The web build and MCP index check reject stale generated downloads. The existing pattern-contract CI runs both checks. Google format verification: `npx @google/design.md lint design.md` (external CLI, not a runtime dependency).

## Sources

Agent-specific setup was checked against official documentation on Nov. 1, 2026. Recheck command syntax and context behavior when updating this page. A1's recommendation to request implementation and verification together is our workflow advice, not a vendor guarantee.

- [Google DESIGN.md specification](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md)
- [Codex MCP](https://developers.openai.com/codex/mcp) and [AGENTS.md](https://developers.openai.com/codex/guides/agents-md)
- [Claude Code MCP](https://code.claude.com/docs/en/mcp) and [project memory](https://code.claude.com/docs/en/memory)
- [Cursor MCP](https://cursor.com/docs/mcp) and [rules](https://cursor.com/docs/rules)
- [Gemini CLI MCP](https://geminicli.com/docs/tools/mcp-server/) and [GEMINI.md](https://geminicli.com/docs/cli/gemini-md/)

## Standards review

- Components: PageTitle, Section, Stack, Heading, Paragraph, Button, Link, Divider, Code and Accordion; no duplicated controls, new CSS, raw visual values or component API changes.
- Accessibility: native links/downloads, semantic article and labeled sections, one h1, heading order, system focus/accordion/copy behavior. Existing reduced-motion styles apply. Automated checks supplement, rather than replace, assistive-technology review.
- Interaction/state: static guide, existing accordion open/closed and clipboard feedback only. No new asynchronous data, auth state, error UI or custom interaction model.
- Copy: `system/labels/design-with-a1.json`, English descriptions and es/fr/de/pt/ja/zh/ar translations. Executable snippets, URLs, filenames and product brands remain literal identifiers. Technical downloadable documents retain their canonical English content.
- Architecture: one generator from existing resolved tokens plus authored rationale. Generated public guide copies avoid source drift. The new route uses existing navigation, access and search infrastructure.
- Responsive: Section's responsive padding and content width; Stack wrapping; Code wrapping. No custom breakpoints or CSS exceptions. Base and A1 light currently resolve to the same root appearance.
- Coverage: `tests/a1-web/design-with-a1.spec.js` checks navigation, breadcrumb, clipboard, download identity, public setup/JSON references, locale rendering, overflow, four theme selections and xs–xl. MCP integration checks resource discovery and identical contents. Google lint verifies the document format. Remote agent installations and a full screen-reader audit are not automated by these checks.
- Standards debt: no new design-system exceptions. Public reference files are intentionally generated English technical artifacts. Initially delivered uncommitted for review; included in the resumed Nov. 1 release.

## Verification recorded

Nov. 1, 2026: production-style web build passed; 3 focused browser tests passed, including 20 theme/breakpoint axe scans and all seven translated locales. The 30 pattern/MCP tests and 5 access-policy tests passed. Google DESIGN.md lint reported zero errors and zero warnings. Repository lint passed with 46 existing warnings and a clean CSS gate. Download parity and generator/MCP freshness checks passed. Desktop and mobile screenshots were inspected. No release or deployment was performed.
