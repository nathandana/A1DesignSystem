# A1-Web release checklist

Use this checklist for every A1-Web release. The npm publish workflow runs the
automated gate before it publishes packages.

## 1. Confirm the release scope

- Review the Unreleased section in `apps/a1-web/CHANGELOG.md`.
- Confirm every shipped backlog item includes its `A1-<number>` reference.
- Confirm migrations, environment-variable changes and rollback steps are
  documented when the release needs them.
- Use Node 24 and install the locked dependencies with `npm ci`.

## 2. Run the release gate

From the repository root, run:

```bash
npm run release:a1-web:check
```

The command lints the repository, builds A1-Web, then checks every registered
production route for all of the following:

- a successful document response with a visible app root and main landmark
- no uncaught browser error
- no critical or serious axe-core violation under WCAG 2.0, 2.1 and 2.2 A and
  AA rules
- no visual change above the 2% changed-pixel threshold

The suite also checks the Button documentation page in the default, Accessible
and Heritage themes at representative xs, sm, md, lg and xl viewport widths.
The default app theme includes the base and A1 Light token contracts.

If an intentional visual change needs new references, review the rendered
result first, then run:

```bash
npm run test:a1-web:update
npm run test:a1-web
```

Never accept a baseline only to make the test pass. Review the changed PNGs and
keep the accessibility gate green before continuing.

## 3. Update release content

- Move completed entries from Unreleased into a dated version section in
  `apps/a1-web/CHANGELOG.md`.
- Update `apps/a1-web/src/pages/publicReleaseNotes.md` with the simplified,
  customer-facing highlights.
- Add or update the release story in
  `apps/a1-web/src/pages/blogPosts.js`.
- Update `apps/a1-web/src/pages/publicReactReleaseNotes.md` when the React
  package changes.
- Check links, headings, dates, version numbers and sentence case.

## 4. Update versions

- Update `apps/a1-web/package.json`.
- Update each changed publishable package version.
- Refresh `package-lock.json` through npm so workspace metadata matches.
- Confirm the changelog, public release notes and blog use the same version and
  release date.

## 5. Release and verify

- Review the final diff and confirm generated build output is not included.
- Confirm Git Large File Storage stores new visual baseline PNGs.
- Let the publish workflow complete; publishing is blocked until the A1-Web
  baseline job passes.
- Smoke-test the hosted home page, one component page, one editor route and one
  public project route after deployment.
- Confirm monitoring, analytics and error reporting show no new release
  failures.
- Keep the previous release reference and rollback instructions available until
  the hosted smoke test passes.

Automated accessibility checks do not replace manual review. Before a major
release, also review keyboard order, focus visibility, screen reader
announcements, zoom, reduced motion and error recovery in the changed flows.
