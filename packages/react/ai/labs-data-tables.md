# Labs table pagination position

`/experiments/data-tables` explores pagination placement and table scale using
A1 DataTable directly. It is distinct from the editable Data grid and the
phone-specific Mobile data tables experiment. No viewport wrapper or custom CSS.

## Configuration and ownership

- Position toolbar: pagination Above/Below/Both/Inline, default Below.
- Size toolbar: Small/Medium pagination buttons, default Medium.
- Type toolbar: inventory, team directory or invoices.
- Data set size: shared Small (10), Medium (100, default), Large (1,000) presets and an A1 Slider with 7/10/25/50/100/250/500/1,000 detents.
- Columns toolbar: 3, 5 or 8 columns.
- Density toolbar: responsive, compact, default or comfortable.
- Search and zebra-row switches.

A1's filter chips provide multi-select menus and the built-in mobile filter
menu. Available filters follow the visible categorical columns. Row selection,
the separate rows-per-page panel control and narrow-screen control are omitted.
The table retains its built-in rows-per-page menu (5, 7, 10, 25, 50), starting
at 10. Narrow screens use A1's default mobile cards.

DataTable owns search, filtering, sorting and current page. Changing placement,
button size or density preserves state. Changing the data set, columns or search
availability remounts the table to clear stale state. Filtering happens before
pagination. Typed columns include numbers, currency, dates and status badges.
All records are fictional, local and generated deterministically in
`src/data-tables/table-samples.js`. No custom CSS, motion, theme rules or tokens.

## Shared component contract

`DataTable.paginationSize` is `"sm" | "md"`, default `"sm"` for existing tables;
this experiment opts into `"md"`. No pagination CSS is overridden.

`DataTable.paginationPosition` is `"top" | "bottom" | "both" | "inline"`, default `"bottom"`.
Above/Below place the result count and controls before/after the rows. Both
renders that footer twice, before and after the rows. The copies share one
page/page-size state, so either updates both. Each `<nav>` gets a distinct name
("Pagination above table" / "Pagination below table") so screen-reader landmark
lists don't show two identical entries; `renderPagination` receives `placement`
and that `label` to apply to custom navigation. The count is not a live region,
so the duplicate is not announced twice. Inline
puts filters and page controls in an A1 `Stack direction="row" wrap`, aligned
at the bottom, with the result count below. They share a row when their content
fits and wrap in DOM order when it does not; there is no fixed breakpoint,
JavaScript size observer, duplicate control or CSS ordering. A table without
filters still shows the controls. Invalid positions retain bottom layout.
Except for Both, there is only one pager; a single page retains the existing result-count-only
behavior. Existing paging, sorting and selection contracts are unchanged.

Types, Storybook controls and the PaginationAbove, PaginationBoth and InlinePagination stories document the option.
A1 Web exposes it in the pagination configuration with helper text, generated
snippets and JSON import/export. The editor uses the same controls and forwards
the option in both real-data and sample-data paths. Pure HTML tables have no built-in pagination component; no native or Pure
JavaScript API is introduced.

## Validation

Focused checks cover both DOM placements, page retention when placement changes,
page boundaries, both pagination sizes, seven-row paging, A1 filtering and clear,
sorting/search before paging, each data type, slider detents, columns and mobile
cards. Human screen-reader review remains before promoting this composition as
a validated pattern. Do not repeat cross-theme contrast sweeps for routine changes.

Both was checked at 1600 and 390 pixels: one footer before and one after the
rows, distinct navigation names, page and rows-per-page changes from either copy
reflected in the other, and no horizontal page overflow.

Inline placement was checked at 1600, 1100 and 390 pixels: sharing a row on
wide screens, wrapping below the filters on narrower screens, retaining page
state and rendering exactly one pager without horizontal page overflow.

Inventory, directory and invoices come from [Shared sample data](labs-sample-data.md); local code only defines the columns.
