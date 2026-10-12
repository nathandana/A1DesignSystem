# Labs bulk actions

Selecting many rows of a configurable A1 `DataTable` (100 products by default, up to 1,000) and acting on them at
once. More bulk action styles can be added to `BULK_STYLES`. Not a published
A1 component. Follow the
[Labs isolation contract](labs-contributing.md#isolate-experiments-and-prepare-them-for-a1).

## The table and bar (all styles)

The A1 Data Table provides:

- selection (`selectable`, `selectedRowIds`, `onSelectedRowIdsChange`);
- sorting and pagination (10, 25 or 50 rows);
- the shared inventory (`sample-data/inventory.js`).

There is no search or filter control. The header checkbox selects every row
on the current page, and selection carries across pages and sorting.

The bulk action bar always stays above the table, so nothing jumps when the
selection changes:

- **Count and action:** it shows the selected count and one action,
  **Delete selected** (destructive). There is no Clear button; deselect with
  the checkboxes.
- **Disabled state:** Delete is disabled with `aria-disabled` (not `disabled`)
  while nothing is selected and while rows are leaving. It stays focusable, so
  focus stays on it after deleting.

**Deleting** removes the products from the data set itself, not just the
view. The deleted ids are saved in this browser's storage
(`a1-labs-bulk-actions-deleted`), so deleted products stay gone after a reload
until **Reset data**. Unreadable or blocked storage falls back to the full
inventory. The status line reports “2 products deleted. 125 products remain.”

**How it works:** A1 `DataTable` only shows its built-in bar while rows are
selected and has no option to keep it. The experiment therefore:

- draws its own bar using A1's bulk bar class names, so it looks identical;
- hides the table's built-in bar with one scoped rule;
- doesn't pass `onDeleteSelected`.

## Styles

| Style | When rows are deleted |
| --- | --- |
| Always-visible bar | They disappear at once |
| Animate away | Each deleted row tints with the error surface, slides `leaveDistance` and fades over `leaveDuration` (500 ms). Then the rows that stayed glide up from their old positions over `reflowDuration` (300 ms), and rows pulled in from the next page fade in |

**How Animate away works:**

- The selected rows' exit is CSS, keyed by `data-leaving` on the experiment
  root and `data-selected` on A1's rows and mobile cards.
- The glide-up is a FLIP with the Web Animations API. The rows that stay keep
  their order, so their positions before and after are matched by position.
- Only after the exit do the products leave the data set.
- Selection changes are ignored while rows leave.
- With reduced motion, rows are removed at once.

Tokens: `component.bulkActions` (`leaveDuration`, `reflowDuration`,
`leaveDistance`). Token story: Foundations/Tokens/Bulk actions.

## Switches

- **Offer to select all products (on by default).** Once every product on the
  page is selected (and more exist), the bar says “All 10 products on this
  page are selected.” and offers **Select all 100 products**. After that it
  says “All 100 products are selected.” and offers **Select only this page**.
  - The status line announces the scope.
  - The experiment controls `sort`, `page` and `pageSize`, and `pageRows`
    mirrors A1 DataTable's sort comparison, so it knows exactly which products
    are on screen.
  - `selectAllState` decides what to offer.
- **Select-all checkbox in the bar.** The page's select-all checkbox (checked,
  or mixed for a partial page) moves from the table header into the bar,
  beside the count, using A1's checkbox style. It selects or clears the
  current page.
  - The header checkbox is hidden with `visibility: hidden`, so the column
    doesn't shift.
  - The column keeps a screen-reader-only “Select” through generated text.
    Axe's best-practice `empty-table-header` rule still flags the column,
    because it ignores generated text.
  - It also gives the mobile card layout, which has no header, a select-all.
- **Zebra rows**, plus a density choice.

## Findings so far (to inform the next styles)

- **A1's default bar jumps and loses focus.** It appears and disappears with
  the selection, moving the table, and after Delete keyboard focus falls back
  to the page body. The always-visible bar fixes both.
  - **Promotion:** A1 `DataTable` should offer a persistent bar (for example
    `bulkActionBar="always"`) that uses `aria-disabled` actions, plus a slot
    for custom actions.
- **Only one built-in action.** A1 offers only Delete. There is no slot for
  other bulk actions (export, change category, adjust stock), which is one
  reason this experiment draws its own bar.
- **No confirmation or undo** for a destructive bulk delete.
- **Select all covers the current page only** in A1. The select-all switch
  explores the fix.
- **The select-all checkbox can't move.** A1 DataTable has no option to place
  it outside the header (for example `selectAllPlacement="bar"`), so hiding it
  leaves an empty column header.
- **A1 bugs found and fixed here:**
  - `zebra` never striped desktop rows (fixed in A1 DataTable CSS).
  - Secondary and tertiary buttons were 2px too tall at sm and md, which made
    the bar grow when a tertiary button appeared (fixed in A1 Button CSS).
- **Selected rows** are marked mainly by the checkbox; the row highlight is
  subtle.

## Files

- `apps/a1-labs/src/bulk-actions/BulkActionsExperiment.jsx` — the page, the
  always-visible bar, `BULK_STYLES`, Animate away (exit timing and FLIP
  glide-up) and configuration (style, density, zebra, reset).
- `bulk-model.js` — pure, tested functions:
  - `removeRows`, which matches ids as strings;
  - `mergeDeleted`;
  - `readDeleted` and `writeDeleted`, which are safe with bad or blocked
    storage;
  - `pageRows` and `selectAllState`.
- `bulk-actions.css` — scoped rules that:
  - hide the table's built-in bar;
  - hide the header checkbox and lay out the bar checkbox (when that switch is
    on);
  - lay out the scope message;
  - define the Animate away exit keyframes.

## Recorded checks — Oct. 11, 2026

- One bar, which never moves the table, now including when the select-all
  message appears.
- **Select all products:** after sorting by price and going to page 2,
  selecting the page highlights exactly the rows on screen. Select all 127,
  Select only this page and deleting all 127 work, and Reset restores them.
  With the switch off, nothing is offered.
- **Bar checkbox:** mixed for one row, checked for a full page, empty on page
  2; unchecking clears the page. It works on mobile cards (390 px, no
  overflow).
- **Animate away:** rows tint, slide and glide, with focus kept on Delete.
  Deletions persist until Reset.
- **Zebra** stripes every other row.
- Axe reported no violations, except the best-practice `empty-table-header`
  while the bar checkbox switch is on, and a `heading-order` issue from the
  A1 empty state's h3 after every product is deleted. No console errors.
- Not yet done: a screen-reader review, and other browsers.

See [Shared sample data](labs-sample-data.md) for Small/Medium/Large presets, intermediate counts and preserving deleted IDs across size changes.
