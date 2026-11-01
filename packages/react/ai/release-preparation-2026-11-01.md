# Release preparation — Nov. 1, 2026

## Scope and versions

Prepared on `release` after integrating A1-2729 and A1-2731.

| Package | Previous published/prepared | Prepared |
| --- | --- | --- |
| A1 Web | 0.35.0 | 0.35.1 |
| React | 0.34.0 published | 0.34.1 |
| MCP server | 0.2.0 | 0.3.0 |
| Pure CSS | 0.4.0 | 0.4.0 |
| A1 Labs | 0.78.1 | 0.78.1 |
| React Native | 0.1.1 | 0.1.1 |

A1 Web 0.35.1 contains the post-release Home cleanup and the initial-breakpoint
List default for project overviews on xs and sm. MCP 0.3.0 adds the page/project
JSON authoring model and ChatGPT-compatible protocol and tool-schema discovery.
React 0.34.1 was already prepared on the integrated branch and remains pending
publication; its public changelog contains the page-title placement guidance.

The package lock agrees with the A1 Web and MCP manifests. Pure CSS, Labs and
React Native have no changes in this release and retain their versions.

## Validation completed

- Clean locked dependency install (`npm ci`): passed.
- Lint and A1 CSS gate: passed with zero errors and 46 existing warnings.
- A1 Web production build: passed with the existing large-chunk warning.
- Formal pattern and MCP tests: 28 passed.
- MCP index freshness: passed.
- Project initial-view tests: 3 passed.
- npm publication-script tests: 6 passed.
- Component history generation check: passed.
- React package, RSC compatibility and TypeScript checks: passed.
- Registry check: React is 0.34.0 and React Native is 0.1.1 before publication.

`npm ci` reports 82 audit findings: 2 low, 62 moderate, 15 high and 3 critical.
No forced dependency update was applied during release preparation.

## Browser gate follow-up

The local A1 Web gate completed 38 of 42 tests. The Overflow Menu matrix and
verification-label checks passed when rerun in isolation. The Custom Block
persistence fixture was corrected to clear the large sample-project seed data
before creating its isolated project; otherwise the fixture can exhaust the
browser storage quota before writing history.

The local runner then reported accelerated Playwright timeout accounting. The
289-route crawl reached route 104 with no visual or accessibility mismatches,
then hit its 30-minute test timeout. The isolated Custom Block test likewise
expired its poll before the editor's 10-second history throttle and 2.5-second
storage flush could complete in real time. Rerun `npm run release:a1-web:check`
on the stable macOS release runner before pushing or publishing. Do not accept
new visual baselines or relax accessibility thresholds for this follow-up.

## Publication

This preparation does not publish, deploy, tag or push. A release is ready to
publish only after the full A1 Web gate passes. Push `release`, wait for the
Publish workflow, verify React 0.34.1 on npm, and verify the deployed MCP with:

```sh
npm run patterns:verify-mcp -- https://mcp.a1design.app/mcp
```

No release-only CSS was added.
