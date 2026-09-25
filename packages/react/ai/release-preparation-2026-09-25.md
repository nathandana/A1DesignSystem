# Release preparation — Sept. 25, 2026

## Scope and versions

Prepared from `release` after portfolio merge `9e1cca14`.

| Package | Previous | Prepared |
| --- | --- | --- |
| A1 Web | 0.32.0 | 0.33.0 |
| React | 0.31.0 | 0.32.0 |
| Pure CSS | 0.1.0 | 0.2.0 |
| MCP server | 0.1.0 | 0.1.1 |

Root tooling, React Native, Web Components and ESLint package versions are
unchanged because this release does not add a runtime change to those packages.
The private portfolio has no package version; its source is included in release.

The release includes CustomBlock and its editor/showcase support, the HeadingMark
paint-inset fix, Figma component standards and bridge contracts, and the portfolio
case-study and hostname-audience updates. Garage Empire remains unmerged.

Package changelogs, A1 Web and React public notes, and the 0.33 release newsletter
are prepared. Package-lock workspace versions are synchronized. No npm package,
GitHub release or release tag is published by this preparation task. The portfolio
was already deployed separately in the preceding task.

## Validation

- Package packing, RSC compatibility and TypeScript declarations: passed.
- ESLint rule tests: passed (4).
- Figma plugin contract tests: passed (61).
- Portfolio audience/focus tests: passed (8); production build passed.
- Token/theme/color audit and app lint: passed in the release gate.
- MCP index rebuilt; component-history freshness check passed.
- Focused CustomBlock (3 stories) and HeadingMark (1 story) axe scans: passed.
- Keyboard/accessibility interaction suite: passed (49).
- Computed color contract across 16 theme modes: passed after starting Storybook.
- Final lint: passed with 46 existing warnings and zero errors.
- Storybook production build: passed.
- Full A1 Web route/interaction/accessibility gate: passed, 13 suites including
  273 routes, with snapshot updates disabled.

The first sweep found 85 missing and 37 mismatched screenshots (11 suites passed,
one route sweep failed). Review found expected navigation/Help changes plus a
real blog routing bug: initial canonicalization collapsed all article URLs to
the latest post. This preparation fixes that bug and same-route history updates,
and adds per-article URL/title assertions and a direct-link/history test.
Reviewed and refreshed 37 existing baselines and added 86 missing baselines,
including the new 0.33 newsletter. The corrected blog captures now show each
article’s own title and content. Screenshot thresholds and accessibility blockers
are unchanged. Both the refresh run and the subsequent non-updating release gate
passed. No component CSS was authored during release preparation.

## Readiness and limitations

Ready for review on the release branch. Lint retains 46 warnings with zero
errors. Vite reports the existing large app-bundle warning. Automated checks do
not substitute for a manual assistive-technology review or prove WCAG conformance
for arbitrary user-authored custom source.

Execution logs and visual review sheets are retained locally under
`/tmp/a1-release-prep/`. Generated app build output is excluded from the commit;
reviewed visual baselines and the rebuilt MCP index are included.
