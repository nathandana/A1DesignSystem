# Labs data grid

An editable inventory with Small (10), Medium (100, default) and Large (1,000) presets built on A1's experimental `DataGrid`: the
react-data-grid library (Comcast, `7.0.0-beta.59`) themed with A1 tokens in
`packages/react/src/components/data-grid/`. The wrapper is unchanged and still
unpublished: it isn't exported from the package, and Storybook and a1-web
already use it. Follow the
[Labs isolation contract](labs-contributing.md#isolate-experiments-and-prepare-them-for-a1).

## What it shows

- **Editing:** double-click a cell or press Enter to edit Product, SKU,
  Category, In stock and Price.
  - Number columns accept values like `30` or `$1,200`.
  - An invalid or negative value keeps the old one, and a status message says
    why (for example “In stock needs a whole number of 0 or more”).
- **Selection:** a checkbox column, with a count of selected rows.
- **Sorting:** multi-column, number-aware sorting (react-data-grid leaves the
  sorting itself to the app). Headers expose `aria-sort`.
- **Resizing** and **freezing** the Product column.
- **Totals row:** product count, total stock and total stock value. Price has
  no total, because unit prices don't add up to anything meaningful.
- **Display:** Status is an A1 `MessageBadge` (in stock, low stock, out of
  stock), and Stock value is calculated.
- **Density:** compact, default or comfortable rows from the field height
  tokens (32, 40 and 52 px).
- **Up to 1,000 products:** generated the same way every time (`sample-data/inventory.js`). Up to
  15 rows show at once; the grid scrolls and virtualizes the rest, keeping the
  header and totals row in view.
- **Edit tracking and Reset:** a count of edited cells, and a button that
  restores the data.

## Files

- `apps/a1-labs/src/data-grid/grid-model.js` — pure, tested functions:
  - `sortRows`.
  - `acceptEdits`: number coercion, rejection and keeping the original row
    order when cells are edited while sorted.
  - `totals` and `changedCells`.
- `sample-data/inventory.js` — `buildInventory(size = 'medium', seed)`: invented furniture
  and homeware (material × item) with unique ids, names and SKUs, a mix of
  in-stock, low and out-of-stock items, and prices in steps of 5. Tested for
  uniqueness and repeatability.
- `DataGridExperiment.jsx` — the page. It is lazy-loaded, so react-data-grid
  stays out of the main Labs bundle.
- `data-grid-lab.css` — scoped: grid height for up to 15 rows, right-aligned
  tabular numbers, badge alignment and bold totals.

Labs now lists `react-data-grid` (`7.0.0-beta.59`, exact) as a dependency,
matching a1-web.

## Evaluation notes

- **Strengths:** a real `role="grid"` with keyboard navigation between cells,
  inline editing, selection, multi-sort, resizing, frozen columns, summary rows
  and virtualization. The A1 token theme carries through, including dark mode
  and A1 badges inside cells.
- **App responsibilities:** sorting, validation and formatting are left to the
  app.
- **Limits:**
  - It's a beta release, the API is unstable, and it adds a third-party
    dependency.
  - Its rows use `display: contents`, so row-level measurement and styling
    happen per cell.
  - It scrolls horizontally on narrow screens. A1 `DataTable` instead switches
    to cards on mobile.
- **Compared with A1 `DataTable`:** that table is the governed, published
  read-and-light-edit table, with search, filters, pagination and mobile
  cards. The grid suits spreadsheet-style bulk editing. The experiment no
  longer shows the table.

## Recorded checks — Oct. 11, 2026

- Sorting, editing (a rejected value with its message, then a valid one) and
  selecting two rows all work, with live updates to the status and totals.
- Compact rows are 32 px, and every column fits at desktop width.
- 127 rows: `aria-rowcount` is 129 and about 22 rows are rendered at a time.
  Scrolling to the end keeps the totals visible. Editing the last row's price,
  moving down 20 rows with the arrow keys and sorting by price all work.
- Axe reported no violations in either view. At 390 px the page doesn't
  overflow (the grid scrolls inside itself). No console errors.
- Not yet done: a screen-reader review of editing, and other browsers.

See [Shared sample data](labs-sample-data.md) for the size slider and edit-preservation contract.
