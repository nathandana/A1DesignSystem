# Audience-specific portfolios

## Hostname selection

- `nathan.a1design.app` renders UX design.
- Every other hostname renders Design systems, including
  `nathandana.a1design.app`, Netlify previews and localhost.

Selection happens before the first render from `window.location.hostname`.
There is no audience or résumé selector. Query parameters and session storage
cannot override the hostname. Legacy `audience` parameters are removed from
internal URLs; referral parameters and hash anchors remain intact.

Both domains serve the same portfolio build. Keep the UX hostname intact;
do not redirect it to the Design systems hostname. Direct case-study URLs
remain accessible regardless of which collection includes the project.

## Content

Design systems leads with Fondue, Transform, A1 and Filtering. UX leads with
Member Menu, Car Shopper, Composer, Filtering and Transform. Homepage copy,
navigation, About title, document title, testimonials and résumé follow the
hostname selection. Contact and education remain shared. Existing claims are
retained in the case studies.

## Implementation and checks

- `utils/audience.js`: exact hostname matching and legacy query cleanup.
- `data/portfolioAudiences.js`: copy and project ordering.
- `App.jsx`: selection and page rendering.
- `utils/routing.js`: same-host internal links.
- `pages/ResumePage.jsx`: audience-matched résumé without a switch.

Run `node --test examples/portfolio/tests/*.test.js` and
`npm run build --prefix examples/portfolio`. Browser checks should cover both
hostnames, query/storage override attempts, deep links, résumé selection,
referral parameters and the absence of selectors.

## Hosting

Netlify project: `nathandana-portfolio`.
Primary domain: `nathandana.a1design.app`.
UX alias: `nathan.a1design.app`.
Both use the portfolio SPA fallback. Audience selection requires no redirects
or analytics. No analytics SDK or visitor tracking is enabled by this feature.

The UX alias and managed DNS record were configured Sept. 25, 2026. Both
hostnames serve the production deploy `6ab69bb42565eaedde570eba` over HTTPS.
