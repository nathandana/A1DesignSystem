# Publishing A1 Labs

Labs has its own Netlify project, separate from A1 Web:

- Project: `a1design-labs`
- Project ID: `92a835d6-4240-4984-aef3-bc744f9d81db`
- Dashboard: https://app.netlify.com/projects/a1design-labs
- Production domain: `https://labs.a1design.app`
- Repository: `nathandana/A1DesignSystem`, production branch `main`
- Base directory: repository root (empty setting)
- Package directory: `apps/a1-labs`
- Configuration: `apps/a1-labs/netlify.toml`
- Publish directory: `apps/a1-labs/dist`
- Node: 24

The package directory matters: it selects the Labs configuration instead of the
root `netlify.toml`, which belongs to A1 Web. Keep each project separate. This
follows [Netlify's monorepo setup](https://docs.netlify.com/build/configure-builds/monorepos/).

## Build and deploy

From the repository root, install dependencies with `npm ci`. With the Netlify
CLI installed and signed into the `nathandana` team:

```sh
npm run deploy:a1-labs:preview
npm run deploy:a1-labs
```

The first command creates a draft URL; the second publishes to the production
domain. Both pin the Labs project ID and select the Labs workspace. Netlify runs
`npm test --workspace=a1-labs && npm run build:a1-labs` before uploading. The root
build command regenerates the shared tokens before building Vite.

For a new checkout, linking is optional for these explicit commands. To link for
other CLI operations, use `netlify link --filter a1-labs --id
92a835d6-4240-4984-aef3-bc744f9d81db`. The local `.netlify/state.json` is ignored;
never copy an A1 Web link or deploy from its output directory.

No Labs API keys or environment secrets are required. Experiments are local
simulations. Only the generated `dist` is uploaded, not repository source or
local environment files. `public/_redirects` supplies the SPA fallback and static
assets retain priority. Only content-hashed `/assets/*` get immutable caching;
HTML revalidates.

## Initial setup status — Oct. 12, 2026

The project is linked to GitHub/main. Automatic builds are deliberately stopped
until this branch, including its package configuration, is merged to main.
After merging, enable builds in the Labs project's continuous deployment settings
and trigger its first Git-based deployment. Do not enable them against a main
branch that still lacks the Labs configuration: it could use the A1 Web config.
CLI draft and production deploys work while automatic builds are stopped.

The Labs domain is assigned and has its own managed NETLIFY DNS record pointing
to `a1design-labs.netlify.app`. The existing `*.a1design.app` certificate covers
it. HTTPS is required. No changes to the apex site or other subdomains are needed.
A draft deployment is preparation, not a production release.

## Verify a release

Check the gallery, `/about`, `/release-notes` and direct experiment routes on the
draft URL. Check preview images, a lazy-loaded experiment and an iframe-based
viewport. Reload a deep route to verify the SPA fallback. After production
publishing, repeat the route checks on `labs.a1design.app` and confirm the current
version in release notes. Keep changelog, package and lockfile versions in sync.
Rollback by republishing the previous successful Labs deploy in Netlify.

Initial verified draft: https://6accda1f7e136c3f40f7bd7d--a1design-labs.netlify.app
(version 0.73.2). All 52 registered direct routes and preview assets returned
successfully. Browser checks passed for deep-route reload, the mobile-table
iframe, a lazy-loaded experiment, release notes and mobile layout, with no page
errors. The token + production build and all 165 Labs tests passed.

## Production release — Oct. 12, 2026

Published the verified 0.73.2 draft unchanged to https://labs.a1design.app at
9:06 a.m. Eastern. Production deploy ID: `6accda1f7e136c3f40f7bd7d`.
The gallery, About, release notes, direct experiment reload, iframe preview,
lazy-loaded experiment, updated images and HTTP-to-HTTPS redirect were checked
on the live domain. Automatic GitHub builds remain stopped until merge; this
does not affect the published site.
