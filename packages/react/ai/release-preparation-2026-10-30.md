# Release preparation — Oct. 30, 2026

## Scope and versions

Prepared on `release`. The release includes the project canvas, formal patterns,
project component drag and drop, direct editing interactions, the Card action
zone, print and Word output, and the Labs experiments already staged on the
branch.

| Package | Previous | Prepared |
| --- | --- | --- |
| A1 Web | 0.34.0 | 0.35.0 |
| React | 0.33.0 | 0.34.0 |
| Pure CSS | 0.3.0 | 0.4.0 |
| MCP server | 0.1.2 | 0.2.0 |
| A1 Labs | 0.77.2 | 0.77.2 |
| React Native | 0.1.1 | 0.1.1 |

The package lock agrees with the prepared manifests. Labs already had dated
0.74.0 through 0.77.2 entries for its Oct. 30 work, so its version was not
advanced again.

## Release content

Completed changes are grouped into dated changelog sections for A1 Web 0.35.0,
React 0.34.0, Pure CSS 0.4.0 and MCP server 0.2.0. Public A1 Web and React notes
cover the project canvas, formal patterns, direct editing, drag and drop, project
organization and the Card action zone. The release newsletter is available at
`/blog/a1-035-project-canvas-and-patterns`.

Generated formal pattern contracts and the MCP index were refreshed. The MCP
index contains 102 components, 1,626 tokens, 13 themes, 152 rules and 98 page
types. The Sticky Note rule's invalid YAML scalar was corrected before index
generation.

## Validation

Completed checks:

- Clean locked dependency install (`npm ci`): passed.
- Labs tests: 165 passed.
- Word tests: 10 passed.
- Formal pattern tests: 26 passed.
- npm publication-script tests: 6 passed.
- React Server Component compatibility, TypeScript declarations and package
  packing: passed.
- Generated pattern, MCP index and history consistency checks: passed.
- Storybook and Labs production builds: passed.
- Focused accessibility scans passed for 36 Card stories, 2 Context Menu
  stories and 6 Inline Editable stories with no automated violations.
- Keyboard/accessibility interaction suite: 49 passed.
- Final A1 Web release gate: 42 passed, including all 289 production routes and
  the base, A1 Light, Accessible and Heritage theme matrix from xs through xl.

The initial A1 Web route gate identified five new routes without baselines and
six expected visual changes. The captures were reviewed before accepting them:
the new Sticky Note and help pages, the 0.35.0 newsletter, the updated Card demo,
related-article navigation, and the public blog and release listings. No visual
threshold or accessibility assertion was relaxed. A Tree Menu configurator test
was made deterministic by waiting for its controlled JSON field to settle after
the final removal; the product behavior was unchanged.

Lint completes with zero errors and 46 existing warnings. Vite retains the
existing large-chunk warning. `npm ci` reports 42 audit findings (13 low, 11
moderate, 15 high and 3 critical); no forced dependency rewrite was applied
during release preparation. Automated checks do not replace manual
assistive-technology review.

The deployed MCP verification remains a post-deployment check because it
requires a public endpoint. Run `npm run patterns:verify-mcp -- <deployed-url>`
after deployment.

## Publication and follow-up

No package, site, tag or GitHub release was published during preparation. The
work remains uncommitted for review.

After approval:

1. Commit the reviewed release files and visual baselines on `release`.
2. Publish through the trusted npm release workflow and confirm each prepared
   version and tarball integrity on the public registry.
3. Deploy A1 Web and Labs through their normal release workflows without
   including local build directories.
4. Smoke-test the release index, React notes, newsletter direct link and reload,
   Projects, Editor, Card configurator and Labs gallery at desktop and mobile
   widths.
5. Run the deployed MCP pattern verification command and record the immutable
   deployment IDs for rollback.

No custom release-only CSS was authored.
