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

Publication and hosted verification passed. The merge into main preserves the full release history; resulting checks and deployment statuses are tracked by PR #55. The release command now includes the dedicated fake-auth preview tests as well as standard browser, pattern and JSON tests. The fake-auth build never replaces the production build artifact.

## Reviewed changes and initial checks

The initial full browser pass completed all 291 routes and 46 of 48 test cases. It found unsupported Section `padding: xl` in two shipped examples; these now use `lg`, and every shipped editor example has contract regression coverage. The remaining failure was expected visual drift: Blog/release content and the new configurator tab pushed older Section, Breadcrumb and Line Chart references past the unchanged 2% threshold. Reviewed the rendered pages and refreshed only those five existing references. Added reviewed references for Design with A1 and the new release article. No accessibility or visual thresholds were loosened.

- React/RSC, declarations and tarball checks passed.
- Publication-script and configurator model tests passed.
- Component history freshness passed.
- Dedicated preview/import tests: 6 passed.
- npm trusted publishers verified for both public packages: `nathandana/A1DesignSystem`, `publish.yml`, direct and staged publishing allowed. The initial inspection made no changes; both trust records were later refreshed with the same repository, workflow and permissions to resolve npm’s identity-exchange rejection.
- Rollback deployment IDs before release: A1 Web `6ae4a8585f1560007e5c34a6`; MCP `6ae4a9951c8cb817d8e428d9`.
- Locked install retained the existing 82 npm audit findings; no forced dependency upgrades were introduced.

## Final local release gate

`npm run release:a1-web:check` passed on Nov. 1: repository lint (zero errors, 46 existing warnings), CSS gate, 30 pattern/MCP tests, 11 JSON validation/preview tests, 48 browser tests including all 291 production routes and the core-theme/breakpoint matrix, plus all 6 isolated preview/import tests. No test thresholds were relaxed. GitHub publication and hosted verification follow this prepared commit.

GitHub run `41341733572` also passed the full browser gate and package checks, but npm returned `ENEEDAUTH` despite npm 11.21.0 and an available GitHub OIDC identity. Added an early token-exchange check to expose the registry's underlying rejection without logging credentials. Website and MCP deployment candidates passed hosted discovery, validation, preview creation/retrieval and all 5 formal pattern contracts; production remains on the previous release pending publication.


## Published release

- Published source: `d9c9e9147af5e17589e5b3731ddf766fc9dc3047`. Subsequent changes add authentication diagnostics and this release record only.
- [Publish to npm run 41341733572](https://github.com/nathandana/A1DesignSystem/actions/runs/41341733572) passed on retry after refreshing both trusted-publisher records. React 0.34.1 is verified as `latest`; React Native remains 0.1.1. React tarball SHA-1: `59f8d2e53fe4dc1f100d6261f1f790aa08ee615e`.
- A1 Web production deploy: `6ae7985e726fbc49f699c1a3`.
- MCP production initially promoted verified candidate `6ae794643575e4e885787612`. The CLI’s separate production upload omitted custom function routes; promoting the tested candidate retained them. Main’s subsequent cloud build provides the final production deployment.
- Hosted checks passed: MCP 0.4.0 initialization, React 0.34.1 setup, exact public/MCP design.md agreement, valid and invalid JSON diagnostics, MCP and HTTP preview creation, stored snapshot retrieval, sandboxed preview rendering, guest import visibility, Home/Design with A1/Button/Editor routes, and all 5 formal pattern contracts.
- [PR #55](https://github.com/nathandana/A1DesignSystem/pull/55) integrates release into main with a merge commit. Wait for its main-branch checks and production deployments before reporting completion.
- No CSS was authored during release preparation; visual references were reviewed without relaxing thresholds.

## Deployment recovery notes

The local Netlify CLI selected the repository-root website configuration when targeting the MCP workspace. An isolated source snapshot with the MCP configuration at its root and an explicit package base allowed packaging. Dependency symlinks must not stand in for deployed dependency files. Preserve the generated function manifest, including custom routes and schedules; verify `/previews/:id`, not only `/mcp`, before promoting a candidate. The ordinary Netlify cloud build correctly resolves the committed MCP configuration.


## Preview import follow-up — A1 Web 0.39.0

Publish A1 Web 0.39.0, MCP 0.5.1 and React 0.34.2 together. This release removes
capitalization enforcement from JSON validation and JavaScript/CSS lint, retains
structural and pattern checks, adds persistent copyable preview-import diagnostics,
and simplifies the translated starter prompt. PageTitle flush placement is now a
catalog rule exposed by the Rules editor and MCP. React's patch publishes the
updated package guidance; component APIs and tokens are unchanged.

The supplied snapshot validates unchanged after removing casing checks. Focused
browser coverage verifies import, error reporting, clipboard/navigation, editor
persistence, locales, themes, breakpoints and accessibility. Full release checks,
GitHub publication and hosted verification are required before completion.

Rollback references before publication: A1 Web `6ae7f6d821b62469853f5ec3` and MCP
`6ae7f6d853804580a273e755`. No database migration is required.


The 0.39.0 local release gate passed: lint with zero errors and one existing
Storybook warning, 30 pattern/MCP tests, 18 JSON tests, 49 main browser tests
including all 291 routes, and 19 preview/import tests. No visual baselines or
thresholds changed. React RSC/declaration checks, tarball validation and all six
publication-script tests also passed. Publication and hosted checks follow.
