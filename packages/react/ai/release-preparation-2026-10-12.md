# Release preparation — Oct. 12, 2026

## Scope and versions

Prepared on `release` after `b6631ca1` merged A1-2698. Includes the standalone
Labs app, shared component refinements and the portfolio changes already on
release. Other feature branches remain outside this release.

| Package | Previous | Prepared |
| --- | --- | --- |
| A1 Web | 0.33.0 | 0.34.0 |
| React | 0.32.0 | 0.33.0 |
| Pure CSS | 0.2.0 | 0.3.0 |
| MCP server | 0.1.1 | 0.1.2 |
| A1 Labs | 0.73.2 | 0.73.2 (already published) |

Root tooling, React Native, Web Components and ESLint package versions remain
unchanged; their runtime packages have no new changes. Package-lock workspace
versions match the package manifests. The MCP handshake reads its version from
the manifest, fixing its stale hardcoded 0.1.0 response.

Labs contains 52 registered experiments, of which 51 are visible in the gallery.
Fenex remains hidden. Public notes describe the visible gallery count.

## Release content

Completed changes are grouped into dated package changelog sections. A1 Web's
simplified notes and the new release newsletter describe the Labs launch,
pagination options, code accessibility and layout/control fixes. React has
separate public notes for 0.33.0. The outdated statement that A1 Web's Labs route
remains available is corrected: the date-of-birth studies live in standalone Labs.

## Validation

Completed checks:

- Clean locked dependency install (`npm ci`): passed.
- Labs unit tests: 165 passed.
- A1 Web unit tests: 48 passed.
- Figma plugin contract tests: 61 passed.
- Portfolio tests: 9 passed.
- ESLint rule tests: 4 passed.
- RSC compatibility, TypeScript declarations and package packing: passed.
- A1 Web, Labs, portfolio and Storybook production builds: passed.
- Keyboard/accessibility interaction suite: 49 passed.
- Focused axe scans: 20 DataTable and 9 Code stories passed with no automated
  violations. Color visualization passed after correcting the Canvas wrapper's
  missing group role.
- MCP initialization reports the package's 0.1.2 version.
- Package manifests, lockfile, changelog versions and blog metadata agree.

The first A1 Web gate passed 12 suites and failed the route sweep on 9 visual
comparisons, with one new article baseline also required. Reviewed 9 changed
baselines and the new article. Expected differences include current header
branding, button heights, toolbar selections and release content. The color
visualization capture exposed a lazy-scene timing issue and invalid labeled
wrapper; the test now waits for its selected token label and the wrapper has a
valid group role. No screenshot thresholds or accessibility checks were relaxed.

The final non-updating release gate passed all 13 suites, including all 273
production routes, the core-theme breakpoint matrix and article deep-link/history
checks. The final copy-only newsletter headline adjustment was then checked
with the blog index and article route gates (3 tests, including deep-link/history
coverage); both reviewed baselines were refreshed. Logs and reviewed captures are retained in
`/tmp/a1-release-prep-2026-10-12/`.

Lint retains 46 existing warnings and zero errors. Vite reports the existing
large A1 Web bundle warning. Automated accessibility checks do not replace a
manual assistive-technology review. No full repeated all-theme contrast sweep
was added.

## Publication and rollback

Published A1 Web 0.34.0 on Oct. 12, 2026:

- Release notes: https://a1design.app/releases
- Newsletter: https://a1design.app/blog/a1-034-labs-and-component-refinements
- Final Netlify deploy: `6acce5590061e5497fc09fcd`
- Immutable preview: https://6acce5590061e5497fc09fcd--a1designsystem.netlify.app

The production-context build was verified on its draft URL and promoted
unchanged. Live checks passed for A1 Web and React release notes, the blog index,
article direct links and reload, homepage, Button page, editor, missing public
project route, newsletter image and mobile layouts. No browser page errors were
observed. Netlify's published deployment ID was checked against the expected ID.
The final newsletter headline is “A1 0.34.0 opens Labs,” shortened after mobile
review to avoid awkward word breaks without changing component styling.

Website publication does not publish npm packages, create a GitHub release/tag
or merge release to main. Labs 0.73.2 remains live on its separate site.

React 0.33.0 was subsequently published to npm on Oct. 12, 2026 after a fresh
token build, RSC/declaration checks and tarball validation. The public registry
confirmed `latest` at 0.33.0 and matching tarball integrity. See
[npm releases](npm-releases.md) for the automatic release workflow and its
required publication checks.

The previous A1 Web production deployment is
`6ab6a1b144a3550008afb4ff` (main at `b8fc8fb9`). Restore that Netlify deployment to
roll back the website. Keep the release branch and package changelogs as the
source of the prepared package release.

No custom CSS is authored during release preparation.
