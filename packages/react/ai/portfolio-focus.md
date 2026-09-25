# Portfolio content focus

The portfolio has an editorial classification layer for future UX and design
systems presentations. It does not enable audience switching, analytics,
automatic hiding, redirects or access restrictions. Current content stays visible.

## Contract

Any content record can carry `focus`:

```js
{ id: "research", focus: ["ux"] }
{ id: "tokens", focus: ["ds"] }
{ id: "accessibility", focus: ["ux", "ds"] }
```

Use lowercase `ux` and `ds` as the canonical values. Both means relevant to either
presentation, not uncategorized. Omitted focus inherits an explicitly supplied
parent focus; without a parent, it defaults to both. Empty arrays and unknown
metadata values are errors. Do not classify content by parsing its title or tags.

A selected audience is separate from a content classification. The utility
accepts `systems` as a selection alias for `ds`, keeping compatibility with the
proposed `?audience=systems` URLs and existing résumé key. `all`, absent values
and unknown selection values show all content. Metadata itself only accepts
`ux` and `ds`.

## Sources and integration

All paths below are relative to `examples/portfolio/`:

- `utils/focus.js`: validation, selection normalization, filtering and DOM helpers.
- `data/portfolioFocus.js`: page classifications, legacy route aliases and
  named inline content classifications.
- `data/caseStudies.js`: each study gets its focus from the page registry, keeping
  its card and page aligned.
- `data/resumeVersions.js`: systems and UX versions carry their own focus;
  experience entries and skill categories inherit it when rendered.
- `data/testimonials.js`: each quote has an explicit editorial classification.
- `data/processSteps.js`: steps are shared. The current inline Process page
  inherits its shared page classification; it does not render this data array.
- `App.jsx`: the existing page wrapper has `data-portfolio-page` and
  `data-portfolio-focus`. This covers original and alternate routes, including
  inline content that has no more specific annotation.
- Homepage project cards, alternate introduction and feature cards, the homepage
  featured quote, testimonials and résumé content carry more specific DOM tags.

Initial editorial choices: A1 and Fondue are DS; Transform and Filtering are
shared; Member Menu, Car Shopper and Composer are UX. General pages are shared.
These are editable relevance decisions, not claims that a project has no value
for another audience.

## Tag a page, item or arbitrary JSX block

Add new routes to `pageFocus`, and aliases to `pageFocusAliases`. Unknown pages
default to shared so adding a page never accidentally hides it.

For data, add `focus` directly to the object. For inline content, use a stable ID
in `contentFocus` and apply its attributes to the existing component:

```jsx
import { focusAttributes } from "../utils/focus.js";
import { contentFocus } from "../data/portfolioFocus.js";

<Card {...focusAttributes(contentFocus["alternate-ai-system"])}>
  {/* Existing content */}
</Card>
```

The same method works on a Section, Figure, link or other element that forwards
data attributes. No custom wrapper, component API or CSS is needed. Verify the
attribute reaches the DOM when using a different component.

For nested data, resolve inheritance explicitly:

```jsx
<Stack {...focusAttributes(job, resume.focus)}>{/* Job content */}</Stack>
```

DOM attributes do not automatically inherit in JavaScript or CSS. Use
`getElementFocus(element)` to inspect any rendered item: it finds the nearest
annotated ancestor, so a child's explicit classification overrides the page's.
If no ancestor is annotated, it returns both. The helper returns relevance,
not the visitor's current selection.

## Future site-wide selection

Use `filterByFocus(caseStudies, selectedFocus)` for collections and
`matchesFocus(item, selectedFocus, parentFocus)` for individual blocks. Filtering
preserves the authored order and original records. Example:

```js
const selectedStudies = filterByFocus(caseStudies, "ds");
const selectedResume = Object.values(resumeVersions).find((resume) =>
  matchesFocus(resume, "ds"),
);
```

When implementing the switch, keep its state at the portfolio App level. Resolve
the audience before rendering, carry it through links and browser history, and
use the same selection for homepage collections, navigation, testimonials,
résumé defaults and any tailored introductions. Let shared contact and education
content remain available. Provide alternate copy before removing the existing
DS-only introduction from the UX presentation.

Do not hide arbitrary parents with CSS attribute selectors: a shared child
cannot reappear inside a hidden parent. Filter at intentional content boundaries
and avoid empty grids or headings. Classification alone does not block a direct
case-study URL; decide direct-link behavior explicitly during audience work.

For deployment and analytics planning, see
[Audience-specific portfolios](../../../examples/portfolio/AUDIENCE-PORTFOLIOS.md).
Keep content relevance separate from the audience property on analytics events.

## Validation

From the repository root:

```sh
node --test examples/portfolio/tests/focus.test.js
npm run build --prefix examples/portfolio
```

Tests cover shared/inherited relevance, explicit overrides, invalid metadata,
selection aliases, filtering order, route aliases and existing data coverage.
Browser checks should verify `data-portfolio-focus` on page wrappers and individual
items, including both résumé variants. Tagging must not change visual layout.

The former alternate homepage is now `pages/HomePage.jsx` at `/`. `/alternate`
resolves to the same home page. Inline IDs beginning with `alternate-` remain
stable metadata IDs for the promoted content. The original homepage source is
archived in `pages/archive/HomePage.jsx`.
