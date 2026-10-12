# Labs timeline

A reference timeline image rebuilt as an interface: four yearly milestones on
a coloured axis. The content is invented sample copy (the history of
Fieldnote, a fictional reading app), not the reference's. It is not a published A1 component. Follow the
[Labs isolation contract](labs-contributing.md#isolate-experiments-and-prepare-them-for-a1).

## Connectors

The connector shape is kept from the original. Each milestone's connector runs
along the axis from the previous badge (the first from the edge), wraps a
quarter arc around its own badge (radius = badge radius + `arcGap`) and turns
sharply into a straight stem ending at a hollow node beside the milestone's
details.

- **Horizontal:** milestones alternate above and below the axis; the year sits
  on the other side of the badge. Details can run into the neighbouring
  columns, which are empty on that side.
- **Vertical:** the axis runs down the inline start; every stem turns towards
  details after it, with the year as an eyebrow above the title (A1 eyebrow
  pattern: small muted Paragraph). A centred, alternating vertical layout
  was tried and rejected because the half-width columns were too narrow on
  phones.
- `layout="auto"` is horizontal when the container is at least
  `horizontalMinWidth` (960 px) wide. A forced horizontal timeline in a narrow
  container scrolls sideways in a focusable, labelled region.

## Files and API

- `apps/a1-labs/src/timeline/Timeline.jsx` — `Timeline` (`milestones`,
  `layout`, `horizontalMinWidth`, `headingLevel`). Milestones are
  `{ id, year, title, items?, icon?, tone? }`; `tone` is `accent`, `info`,
  `success`, `warn`, `error` or `neutral`. Layout is CSS grid (subgrid rows or
  columns) so text wraps freely; an SVG draws the connectors from measured
  positions and is re-measured with ResizeObserver. Depends only on React and A1
  Heading, Paragraph and Icon.
- `timeline-geometry.js` — pure path builders (`horizontalConnector`,
  `verticalConnector`), `sideOf` and `resolveOrientation`, unit-tested in
  `tests/timeline.test.mjs`; supports right-to-left.
- `timeline-data.js` — sample milestones (invented content, sentence case).
- `TimelineExperiment.jsx` — the Labs page: shared responsive preview (Laptop by
  default) and a Layout toolbar (Auto, Horizontal, Vertical).

## Tokens and colour

`component.timeline`: `lineWidth`, `badgeSize`, `arcGap`, `nodeSize`,
`nodeGap`, `stemMin`, `stemMinInline`, `columnMin`, `rowGap`, `yearGap`. Tones
use the live `action.background` and `status.*.background` roles (neutral uses
`text.muted`), which follow theme and light/dark. The chart series tokens were
tried first but are fixed at build time, with near-black success and warn values
in the base theme. Badges use `surface.raised` with `shadow.md`.

## Content and accessibility

- The milestones are an ordered list; each has a `time` year, a heading and a
  list of points. Badges and connectors are `aria-hidden`.
- Sample copy is sentence case; a unit test checks it.

## Recorded checks — Oct. 11, 2026

- Laptop (horizontal), tablet and phone (vertical) and forced horizontal on a
  phone, in light and dark: axe reported no violations, no details overflowed,
  no console errors. Geometry unit tests pass.
- Not yet done: a screen-reader review, other browsers and every theme.
