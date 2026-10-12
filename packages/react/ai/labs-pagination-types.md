# Labs pagination types

`/experiments/pagination-types` is a separate long-table navigation study.
`/experiments/data-tables` remains the Table pagination position study.

## Presentations

Only the configured treatment is shown; A1 default is selected initially.

- **A1 default:** the actual A1 Pagination with numbered pages and ellipses.
- **Compact:** Previous, Page x of y, Next. Sequential browsing with less space.
- **First and last:** adds explicit boundary shortcuts for sorted record sets.
- **Page selector:** a native page menu with row ranges. Useful for modest page
  counts; the menu gets cumbersome at hundreds of pages.
- **Jump to page:** numeric entry and explicit Go/Enter, with validation and
  previous/next controls. For revisiting known, distant pages.
- **Numbered with jump:** A1 page links plus direct entry, for mixed browsing.

The panel also controls Above/Below placement and the shared data-size presets and slider (7–1,000). Default: 100 fictional service requests, 10 per page, below.
The table offers 10/25/50/100 rows per page, A1 search and filter chips, sorting
and mobile cards. The DataTable omits `size` to use A1’s responsive density,
which adjusts to the available container width. No selection, real API, infinite scrolling or animation.

## Source guidance and tradeoffs

- [GOV.UK pagination](https://design-system.service.gov.uk/components/pagination/):
  number/ellipsis navigation, adapting to available space, filtering and sorting
  the full data set before pagination, first-page resets and hiding unnecessary
  pagination. Below-table placement is the initial comparison baseline.
- [Carbon pagination](https://www.carbondesignsystem.com/building-blocks/core/components/pagination/guidelines):
  data-table navigation with page sizes, item ranges, current/total pages and
  previous/next controls. Its page-selection pattern informs the menu variant.

These are A1 compositions inspired by that guidance, not replicas or a claim
that every treatment is best for every table. Show the tradeoff alongside the
chosen variant and test with the intended audience before promotion.

## Implementation and accessibility

- `pagination-model.js`: deterministic records, variant descriptions and strict
  whole-number page validation. Invalid, fractional, empty or out-of-range entry
  does not navigate.
- `PaginationVariants`: controlled inputs `variant`, `page`, `totalPages`,
  `pageSize`, `totalRows`, `size`, `onChange`. Reusable outside Labs; no shell,
  theme storage, routing or private styles. Uses A1 buttons, fields and Stack.
- `PageJump` owns only draft input/error state, updates when page bounds change,
  supports Enter and puts focus on invalid input with an associated alert.
- DataTable performs filtering and sorting before slicing. These operations and
  page-size changes reset to the first page. Presentation/placement switches
  preserve page state. Boundary controls are disabled; no wrapping from last
  page to first. Each presentation has one labeled navigation landmark.
- Page changes announce the current page and record range via a polite, atomic,
  visually hidden live region. Focus stays on the initiating control.
- No new CSS or visual tokens. Existing A1 controls provide focus, theme and
  reduced-motion behavior. There is no experiment motion to disable.

## Shared render callback

`DataTable.renderPagination(context)` replaces only page navigation. It receives
`page`, `totalPages`, `pageSize`, `totalRows`, `rowStart`, `rowEnd`, `size` and
`onChange`. The host retains filtering, sorting, page sizes, placement and result
count. The callback is called only when there is more than one page. Omitting
it preserves the default A1 navigation. It must supply accessible navigation and
use the supplied callback to change pages; do not duplicate paging calculations.

React types and the CustomPagination story document the contract. A1 Web has an
A1/Custom example control with helper text and a copyable callback snippet.
The editor stores `paginationExample: "compact"` as a serializable demonstration
choice and maps it to the callback for both sample and real data. Functions are
never saved in JSON or evaluated from user strings. Production React consumers
may provide their own callback; Labs variants are not imported into A1 Web.
No Native or Pure DataTable callback API is introduced.

## Validation and promotion

Unit tests cover strict jump validation and stable large-data IDs. Browser tests
cover default A1, every treatment, retained page across variants, boundaries,
selector/direct jumps, errors, search and sorting, page-size resets, placement,
mobile widths and a focused axe check excluding contrast. Record actual results
in the handoff. Human screen-reader review and an isolated host review remain
before declaring the full experimental patterns validated for promotion.

Recorded checks — Oct. 11, 2026: 149 Labs unit tests, both pagination browser
suites, Labs and A1 Web builds, and React type checks passed. The focused axe
scan reported no violations with contrast excluded. All six treatments fit the
390-pixel viewport; the desktop hybrid and default gallery preview were reviewed.

Service requests now come from [Shared sample data](labs-sample-data.md), with Small/Medium/Large presets and 7/10/25/50/100/250/500/1,000 size stops.
