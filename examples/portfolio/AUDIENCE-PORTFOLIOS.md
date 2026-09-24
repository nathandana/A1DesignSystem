# Audience-specific portfolios on Netlify

This is an implementation guide, not an enabled feature. The portfolio currently
has a promoted homepage at `/` (`/alternate` remains an alias), but it does not yet select content by
audience or track visitors with PostHog. No DNS, Netlify or analytics settings
were changed when this guide was added.

## Recommended setup

Use one deployed portfolio, two entry subdomains and one analytics project.
Replace `yourdomain.com` in the examples with your actual domain.

| Entry link | Destination | Audience |
|---|---|---|
| `systems.yourdomain.com` | `portfolio.yourdomain.com/?audience=systems` | Design systems |
| `ux.yourdomain.com` | `portfolio.yourdomain.com/?audience=ux` | UX design |

Both versions run from the same application and destination hostname. The
`audience` parameter selects content; the analytics visitor ID connects visits.
Do not use the audience value as a visitor ID.

## 1. Configure the domains

In the portfolio site's Netlify domain settings:

1. Set `portfolio.yourdomain.com` as the primary custom domain.
2. Add `systems.yourdomain.com` and `ux.yourdomain.com` as domain aliases.
3. Configure each subdomain's DNS using the records Netlify provides. If using
   external DNS, add the required records at that provider.
4. Wait for domain verification and HTTPS certificates, then enable HTTPS.

DNS points hosts at Netlify. The redirect rules below choose the destination
path and audience. Netlify requires redirect source domains to be assigned to
the site. See [Netlify's domain redirect documentation](https://docs.netlify.com/manage/routing/redirects/redirect-options/#domain-level-redirects).

## 2. Add audience redirects

Edit `examples/portfolio/netlify.toml`. Keep its existing build settings. Insert
these rules **before** the existing `/*` rewrite. Root links open the alternate
homepage; deep links keep their path.

```toml
[[redirects]]
  from = "https://systems.yourdomain.com/"
  to = "https://portfolio.yourdomain.com/?audience=systems"
  status = 302
  force = true

[[redirects]]
  from = "https://ux.yourdomain.com/"
  to = "https://portfolio.yourdomain.com/?audience=ux"
  status = 302
  force = true

[[redirects]]
  from = "https://systems.yourdomain.com/*"
  to = "https://portfolio.yourdomain.com/:splat?audience=systems"
  status = 302
  force = true

[[redirects]]
  from = "https://ux.yourdomain.com/*"
  to = "https://portfolio.yourdomain.com/:splat?audience=ux"
  status = 302
  force = true

# Keep the existing SPA fallback last, with no force setting.
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Use temporary redirects while evaluating the audience setup. The `force` setting
makes the host redirect apply even when a static file matches. If HTTP is not
being upgraded to HTTPS, add equivalent HTTP source rules. Avoid adding a
catch-all redirect on the destination hostname back to an entry hostname.

Netlify uses the first matching rule. Query parameters normally pass through
302 redirects; verify that application references and UTM parameters survive
these rules, including when the destination already supplies `audience`.
[Netlify redirect options](https://docs.netlify.com/manage/routing/redirects/redirect-options/)

## 3. Implement audience selection

Suggested changes inside `examples/portfolio/`:

| File | Responsibility |
|---|---|
| `data/portfolioAudiences.js` (new) | Approved copy, study order and résumé destination for each audience |
| `utils/audience.js` (new) | Validate audience keys and resolve the selected audience |
| `App.jsx` | Own audience state and update it during navigation and browser history changes |
| `utils/routing.js` | Include the selected audience in internal page links |
| `pages/HomePage.jsx` | Render the selected headline, introduction and project order |
| `pages/ResumePage.jsx` | Offer the appropriate résumé, once both versions exist |

Use an explicit selection order:

1. A valid URL value (`systems` or `ux`) wins.
2. Otherwise, reuse a valid selection in `sessionStorage` for this tab.
3. Otherwise, show the existing general portfolio.

Ignore unknown values and handle unavailable storage without breaking rendering.
Read the URL before the first render to avoid briefly showing the wrong version.
Keep audience context in React state and internal URLs, so copied links reproduce
what the visitor saw. A new explicit audience must override the saved selection.

The current `getRoutePath()` returns paths without query parameters, and
`navigate()` uses those paths in `history.pushState()`. Update both link creation
and navigation together. Update audience state on `popstate` even when the
pathname stays the same: `/?audience=systems` and
`/?audience=ux` are different presentations of the same route.
Use `URL` and `URLSearchParams` when composing URLs, retaining hash anchors.
Only decorate internal portfolio links, not mail links or external destinations.

| Content | Design systems | UX design |
|---|---|---|
| Introduction | Systems strategy, design engineering and adoption | User problems, product strategy and interaction design |
| Featured work | Fondue, Transform and A1 | Select existing projects with the strongest product UX evidence |
| Case-study emphasis | Tokens, components, governance and accessibility | Research, workflows, decisions and outcomes |
| Résumé | Systems-focused version | UX-focused version |

Reuse the existing A1 components and case-study assets. Keep factual claims
consistent across versions. Do not invent research or outcomes to fill the UX
presentation. Add tailored case-study introductions only where supported by the
existing content. Keep the original routes available.

## 4. Add one analytics project

Create one PostHog project for the portfolio. Follow its current
[JavaScript installation guide](https://posthog.com/docs/libraries/js) to install
`posthog-js`, initialize it once and configure its project token and regional
API host. Install the dependency in the package used by this site's actual
Netlify build; the example has its own `package.json` and is not a root workspace.

Suggested Vite environment names are `VITE_POSTHOG_KEY` and
`VITE_POSTHOG_HOST`. Set them for the production build and keep local/preview
traffic separate. Vite exposes these values to the browser: use the public
project token, never a personal API key.

Resolve audience before sending the first page-view event. Choose one page-view
strategy. For this app's custom history router, explicit tracking after route
and audience changes makes the event context clear; disable automatic page-view
capture if using that approach. Avoid duplicate initial events and duplicate
captures during React development checks.

Define these events:

| Event | When | Event properties |
|---|---|---|
| `portfolio_viewed` | Initial load, route change or audience switch | `audience`, `page`, `application_ref`, `entry_source` |
| `case_study_viewed` | A case study opens | Same context plus `study_id` |
| `resume_download_clicked` | A résumé download link is clicked | Same context plus `resume_variant` |
| `contact_clicked` | A contact action is clicked | Same context plus `method` |

A download click records intent, not proof the file was saved. Record audience
on **each event** so switching versions does not overwrite historical attribution.
Use `general` for the unsegmented presentation. Store source and application
reference separately from audience, and distinguish the first entry source from
the current visit's source. Set and document an attribution lifetime, such as
the current tab session, instead of carrying an old application reference forever.

Retain the SDK's anonymous visitor identifier across audience switches. Do not
reset analytics or identify a visitor as `systems`, `ux` or an application
reference. Since all tracked pages use the destination hostname, shared cookies
across the entry subdomains are unnecessary. Track landing events on the final
page; a redirect response does not run your client analytics.

## 5. Track visits to both versions

Create a dashboard with:

- Unique visitors broken down by the event's `audience` value.
- Case studies viewed, grouped by audience and study.
- Résumé and contact clicks by audience.
- A cohort of visitors who performed `portfolio_viewed` with `audience=systems`
  **and** `portfolio_viewed` with `audience=ux` within the same reporting window.

Use an AND cohort for overlap regardless of order. A systems-to-UX funnel alone
would miss people who saw UX first. PostHog also offers paths and funnels to
explore navigation. See [PostHog insights](https://posthog.com/docs/product-analytics/insights).

This identifies returning browsers, not necessarily named people. Another device,
private browsing, cleared storage or blocked analytics can split or hide visits.
A named visitor requires an explicit identity source, such as information they
submit, and an appropriate identity-linking implementation.

For application attribution, share an opaque reference:

```text
https://systems.yourdomain.com/?ref=application-042&utm_source=application&utm_medium=resume
```

Keep the mapping between `application-042` and the application in your own
records. Do not put names or email addresses in the URL. Forwarded links and
link scanners mean a hit does not prove the intended recipient read the site.
Explain analytics in the site's privacy information and honor the site's consent
and opt-out choices when initializing tracking.

## 6. Verify before sharing

1. Implement content selection and analytics before distributing audience links.
2. Run `npm run dev` from the repository root. Check both:
   - `http://127.0.0.1:5176/examples/portfolio/?audience=systems`
   - `http://127.0.0.1:5176/examples/portfolio/?audience=ux`
3. Verify the general homepage, invalid audience values, refreshes, direct case
   links, Back/Forward navigation and switching audiences on the same route.
4. Check each variant at mobile and desktop widths with the existing themes.
5. Build using `npm run build --prefix examples/portfolio`.
6. Deploy the implementation, then verify the actual custom-domain redirects.
   Vite does not execute Netlify redirect rules. For example:

   ```sh
   curl -I 'https://systems.yourdomain.com/'
   curl -I 'https://ux.yourdomain.com/'
   curl -I 'https://systems.yourdomain.com/case-studies/transform-alternate?ref=application-042'
   ```

7. Confirm the response's `Location` has the expected host, path, audience and
   reference. Check HTTP-to-HTTPS handling and conflicting audience parameters.
8. In one browser, visit both versions. Confirm events carry different audience
   values but the same anonymous visitor ID, and appear in the overlap cohort.
9. Check résumé and contact events, then confirm opting out does not prevent the
   audience-specific content from working.

The Markdown file itself is repository documentation. The current build does
not publish it as a portfolio page.
