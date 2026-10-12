# Labs mobile data tables

Ways to show a data table on a phone, previewed in a real device-sized
viewport (the shared `ResponsivePreviewFrame`, an iframe, so A1 breakpoints
apply). Below the md breakpoint (641 px) the chosen mobile pattern shows; from
md up, every pattern shows the standard A1 Data Table. Not a published A1
component. Follow the
[Labs isolation contract](labs-contributing.md#isolate-experiments-and-prepare-them-for-a1).

## Patterns

| Pattern | Built with | What it shows |
| --- | --- | --- |
| Cards | A1 DataTable `mobileLayout="cards"` | One card per product listing every field, with the table's sort control and pages |
| Compact list | A1 List `variant="divider"`, Paragraph, MessageBadge | Name with inline status and price, followed by a compact summary line (“28 in stock · reorder at 4 · $305 cost”) |
| Compact list with labels | Same compact List composition | A visible field label beside every value, including product, status and price |
| Compact list with legend | A1 Card, List, Paragraph | Field names in a separate legend card above the list, in reading order; no numeric markers. Values keep screen-reader labels |
| Scrolling table | A1 DataTable `mobileLayout="table"`, `scrollable` | A real table that scrolls sideways |
| Frozen first column | Same, plus scoped sticky CSS | The product column stays in place while the rest scrolls under it |
| Expandable rows (exploratory) | A1 Accordion (`subtext`), DefinitionList | Name with price and status; opens to show every field |
| Pick a column (exploratory) | A1 SelectField, DataTable | Product plus one chosen column, so nothing scrolls |
| Grouped (exploratory) | Heading, compact list | Compact items under sticky group headings (category, or stock status for the simple data). The grouped field is left out of each summary |

## Data

`table-data.js` (pure, tested) builds two datasets from the shared Labs
inventory (Small: 10 by default; configurable through 1,000 products):

- **Simple:** 3 columns (Product, In stock, Price).
- **Complex:** 11 columns (Product, SKU, Category, Supplier, In stock,
  Reorder at, Price, Unit cost, Margin, Last updated, Status).

Columns carry `format` (cell text) and `inline` (phrasing for summary lines).
Dates use AP style (“Sept. 3, 2026”). `groupRows` sorts groups
alphabetically.

## Files

- `MobileTablesExperiment.jsx` — the device preview and configuration
  (viewport, pattern, data).
  - **Viewports:** the same presets as the other Labs previews: Phone 390,
    Landscape phone 740, Tablet 820, Laptop 1280, Desktop 1600. Only Phone is
    below md, so only Phone shows the mobile pattern.
- `MobileTablePatterns.jsx` — `MOBILE_PATTERNS`, `toTableColumns` and
  `ResponsiveInventory`. Both the mobile pattern and the standard table are
  rendered, and CSS picks one.
- `mobile-tables.css` — scoped rules for:
  - the md switch, written with the `--bp-md-up` custom media from the
    breakpoint tokens;
  - the frozen first column (sticky, with the page surface and a hairline
    edge);
  - sticky group headings.

## Findings

- A1 DataTable already offers cards and a scrolling table, but no **frozen
  column**. It also has no compact list or expandable-row mode; those are built
  from A1 List, Accordion and DefinitionList here.
- The complex table needs sideways scrolling even on a tablet (820 px), since
  11 columns don't fit. A frozen column would help there too.

## Recorded checks — Oct. 11, 2026

- At 390 px, all seven patterns render with both datasets and the page doesn't
  overflow. The scrolling tables scroll (complex data). The frozen column
  stays put while the next column scrolls 300 px.
- Phone (390 px) shows the mobile pattern. Landscape phone (740), Tablet (820),
  Laptop (1280) and Desktop (1600) show the standard table.
- Axe flags `region` only while an icon-only viewport button's A1 Tooltip is
  showing, a known A1 Tooltip issue.
- Axe reported no violations; no console errors.
- Not yet done: a screen-reader review of each pattern, and touch scrolling on
  a device.

See [Shared sample data](labs-sample-data.md). This module now only owns column/formatting adapters; product enrichments come from the shared inventory.

## Compact variants — Oct. 11, 2026

The three compact-list treatments share `CompactItem` and `CompactList`.
`compact-labels` adds explicit field labels; `compact-legend` puts field names
in an A1 Card above the list without numbering. Derive labels and legend order
from the selected dataset (Product, Status, Price, then the remaining fields).
In legend mode, retain visually hidden field names beside each value so screen
readers do not need to memorize the legend. Status is next to the product title
in all compact rows, including Grouped. Wrap naturally on narrow screens.
Keep choice secondary labels to a few words; longer explanations belong here.
Both new variants support simple/complex datasets and all shared dataset sizes,
then switch to the standard table from md. No additional CSS or tokens.

Validation: both schemas, status placement, unnumbered legend, desktop table
fallback and focused axe checks passed; manual screen-reader review remains open.
