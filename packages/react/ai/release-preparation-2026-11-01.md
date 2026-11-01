# Release — Nov. 1, 2026

## Scope

Release integrates A1-2729 (Home and mobile project defaults), A1-2731 (MCP JSON discovery), A1-2732 (configurator presentation editor), A1-2737 (shared validation, previews and project import), React npm setup through MCP, and A1-2738 (Design with A1 and generated design.md).

| Package | Previous published | Target |
| --- | --- | --- |
| A1 Web | 0.35.0 | 0.36.0 |
| React | 0.34.0 | 0.34.1 |
| MCP | 0.2.0 | 0.4.0 |
| React Native | 0.1.1 | 0.1.1 (unchanged) |

The earlier 0.35.1/0.3.0 preparation was not completed; its changes are included in these targets. The npm registry confirms React 0.34.1 is unpublished before this release. Pure CSS and Labs are unchanged.

## Deployment and rollback

No database migration is required. MCP uses Netlify Blobs for isolated, expiring preview snapshots. The scheduled cleanup removes expired snapshots hourly. `A1_PREVIEW_APP_URL` optionally overrides the default `https://a1design.app`; the app defaults to the production MCP URL. Preview import uses existing Supabase authentication and project storage policies.

Deploy MCP and A1 Web from the same verified release. Keep prior Netlify deploy IDs to restore both sites together if needed. Already published npm versions cannot be overwritten; use a new patch for package corrections. Follow [npm releases](npm-releases.md), including the required release-to-main merge after publication and hosted verification.

## Verification and publication

In progress. Record final gate, npm workflow, hosted smoke and main synchronization evidence here before completion. The release command now includes the dedicated fake-auth preview tests as well as standard browser, pattern and JSON tests. The fake-auth build never replaces the production build artifact.

## Reviewed changes and initial checks

The initial full browser pass completed all 291 routes and 46 of 48 test cases. It found unsupported Section `padding: xl` in two shipped examples; these now use `lg`, and every shipped editor example has contract regression coverage. The remaining failure was expected visual drift: Blog/release content and the new configurator tab pushed older Section, Breadcrumb and Line Chart references past the unchanged 2% threshold. Reviewed the rendered pages and refreshed only those five existing references. Added reviewed references for Design with A1 and the new release article. No accessibility or visual thresholds were loosened.

- React/RSC, declarations and tarball checks passed.
- Publication-script and configurator model tests passed.
- Component history freshness passed.
- Dedicated preview/import tests: 6 passed.
- npm trusted publishers verified for both public packages: `nathandana/A1DesignSystem`, `publish.yml`, direct and staged publishing allowed. No trust configuration was changed.
- Rollback deployment IDs before release: A1 Web `6ae4a8585f1560007e5c34a6`; MCP `6ae4a9951c8cb817d8e428d9`.
- Locked install retained the existing 82 npm audit findings; no forced dependency upgrades were introduced.

## Final local release gate

`npm run release:a1-web:check` passed on Nov. 1: repository lint (zero errors, 46 existing warnings), CSS gate, 30 pattern/MCP tests, 11 JSON validation/preview tests, 48 browser tests including all 291 production routes and the core-theme/breakpoint matrix, plus all 6 isolated preview/import tests. No test thresholds were relaxed. GitHub publication and hosted verification follow this prepared commit.
