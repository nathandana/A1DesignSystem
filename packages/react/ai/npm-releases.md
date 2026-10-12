# npm releases

The release workflow is `.github/workflows/publish.yml`. Pushes to `release`
and `main` run it automatically; **Run workflow** can retry either branch.
Other branches cannot publish through this workflow. Runs are serialized to
prevent concurrent changes to npm's `latest` tag.

## Release contract

1. Bump each changed public package's version and update its changelog and
   package-lock workspace version before releasing. Never reuse a published
   version for changed package contents.
2. Push the prepared release and wait for **Publish to npm** to succeed. The
   existing A1 Web release gate must pass before publication. The publish job
   rebuilds tokens, checks RSC compatibility and declarations, validates the
   React tarball and runs the publication-script tests.
3. The workflow publishes React and React Native only. Private packages,
   including Pure CSS, and separately deployed apps are outside this npm job.
4. `scripts/publish-npm.mjs` publishes missing stable versions, verifies uploaded
   integrity and waits up to five minutes for public registry propagation.
   Already published versions must have the expected `latest` tag. Older reruns
   leave a newer `latest` untouched. Registry errors fail the job rather than
   masquerading as missing packages.
5. A release is not complete merely because the website is deployed or release
   notes are visible. Confirm the npm job summary and registry version for each
   changed public package before reporting it released.

## Authentication

Use npm trusted publishing (OIDC), scoped to GitHub repository
`nathandana/A1DesignSystem` and workflow filename `publish.yml`, for both
`@gtivr4/a1-design-system-react` and `@gtivr4/a1-design-system-react-native`.
The publish job grants `id-token: write` and installs npm 11.21.0. It does not
read the legacy GitHub `NPM_TOKEN` secret.

Both package trust relationships were configured and confirmed on Oct. 12,
2026, with direct-publish permission for this repository and workflow.
React Native's repository metadata is prepared in its Unreleased changes for
the next version bump; the existing 0.1.1 upload is not replaced.

Trusted publishing must allow direct `npm publish`. Configure or inspect it
with npm's package settings or `npm trust`; creating a trust relationship
requires the package maintainer's authentication/2FA. Do not copy local login
credentials into GitHub secrets. See [npm's trusted publishing documentation](https://docs.npmjs.com/trusted-publishers/).

## Recovery

- **Failed checks:** fix the actual failure, then rerun the workflow. Do not
  bypass the release gate or automatically accept visual baselines.
- **Authentication failure:** inspect the package's trusted publisher, repository,
  workflow filename and direct-publish permission. Retrying cannot fix a wrong
  trust configuration.
- **Registry delay/failure:** inspect npm and retry the failed job. Publication
  is safe to retry once a version exists; it will not upload that version again.
- **Wrong latest tag:** check the intended stable version before repairing it
  with `npm dist-tag add <package>@<version> latest`, then retry. Never move the
  tag backwards to satisfy an old run.

Useful checks from the repository root:

```sh
node --test scripts/publish-npm.test.mjs
npm view @gtivr4/a1-design-system-react version
npm view @gtivr4/a1-design-system-react-native version
```

`node scripts/publish-npm.mjs` is a publishing command, not a dry run.
