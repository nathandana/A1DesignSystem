# Labs sample data

`apps/a1-labs/src/sample-data/` owns reusable, fictional record sets for Labs.
Use these instead of copying a generator into an experiment or importing another
experiment's private sample data. They contain no personal data or live API calls.

## API and sizes

```js
import { createDataset } from './sample-data/datasets.js'

const products = createDataset('inventory', 'medium')
const people = createDataset('directory', 'large')
const invoices = createDataset('invoices', 250)
const requests = createDataset('requests', 1000)
```

| Preset | Items |
| --- | ---: |
| Small | 10 |
| Medium | 100 |
| Large | 1,000 |

`DATASET_SIZES`, `DATASET_COUNTS`, `MAX_ITEMS` and `datasetCount` live in
`sizes.js`. Generators accept a preset or any integer count from 0–1,000;
zero supports empty-state tests. Invalid types/counts throw `RangeError`, never
silently truncate. The shared `DatasetSize` configuration uses A1 ToolbarGroup
presets and a detented Slider at 7, 10, 25, 50, 100, 250, 500 and 1,000. The
visible count and slider value text expose the exact size. Other counts are
available to code, not as additional UI controls. Medium is the table/grid
starting size; Mobile data tables starts Small.

Every call returns fresh records. The same type, count and seed return the same
data; increasing a count retains all earlier rows and IDs. Inventory supports
an optional seed through `buildInventory(size, seed = 2026)`. Default numeric
inventory IDs and the first 320 products preserve the previous generator's order,
so existing bulk-deletion storage remains valid. Additional series have unique
names and SKUs through 1,000 products. Dates are fixed ISO dates, not today's date;
experiments own display formatting. Invoice due dates follow issue dates.

Inventory provides product, SKU, category, stock, price, status, supplier,
reorder threshold, cost, margin, warehouse and update date. Directory records
provide names, teams, statuses, roles, locations, fictional example.com email
addresses, projects and join dates. Invoices provide number, client, amount,
status, dates, owner and line-item count. Requests provide reference, request,
team, status and amount. `stockStatus` and `STATUS_TONES` are the single stock
status vocabulary (In stock, Low stock, Out of stock; low means fewer than five).

## Audit and consolidation — Oct. 11, 2026

| Existing source | Result |
| --- | --- |
| Data grid `inventory.js` | Moved to shared sample-data; fixed its silent 320-item ceiling; expanded to 1,000 |
| Bulk actions' private grid import and status mapper | Uses shared inventory and status tones directly |
| Mobile tables' supplier/cost/status generation | Uses shared records; retains local column definitions, AP-style dates and presentation helpers |
| Table pagination position's inventory generator | Removed duplicate products/status thresholds; now uses the same inventory as the other three studies |
| Table pagination position's people/invoices | Moved into `createDataset`; retains local column configuration |
| Pagination types' `makeRecords` | Moved into the shared requests set; standardized the former 5,000 maximum to 1,000 |
| Long/required forms and verification journey | Keep local question schemas, prefilled answers and simulated API scenarios; these model workflows, not extensible row data |
| Connected nodes, reordering, timeline | Keep their authored graph/list/milestone scenarios; relationships/order are intrinsic to the experiment |
| Chat, thinking, automation, loaders, slides and visual effects | Keep authored conversation/rule/page content and procedural graphics; these aren't general record collections |

The five consumers are Data grid, Bulk actions, Mobile data tables, Table
pagination position and Pagination types. Reusable experiment cores still take
rows through props; configuration and fixture creation belong to the demo host.
A1 Web/Storybook's standalone component examples were not rewritten; this audit
consolidates Labs' extended data sources without changing published components.

## State and migration

- Grid edits stay in memory across size changes, including temporarily hidden
  rows. Selection clears on size changes. Reset restores the complete inventory;
  edit counts and totals describe the visible set.
- Bulk deletion IDs survive size changes and reloads. Changing size clears
  selection and returns to page one; it never resurrects deleted IDs. Reset
  restores all products. Size/reset controls are disabled during an exit animation.
- Table pagination position remounts its table when the dataset/schema changes,
  clearing stale filtering/paging. Pagination types resets the page when count
  changes and retains search/filter state. Mobile table configuration resets the
  presentation on size/schema changes.
- Internal imports of `data-grid/inventory.js`, `tableRows` and `makeRecords`
  must move to `sample-data/`. No experiment routes or public A1 APIs changed.
- Historic changelog entries and recorded earlier validation counts remain as
  history; the current defaults and limits are defined here.

## Validation and extension

Add future general record types here with stable unique IDs, deterministic
prefixes, complete column values and fictional content. Keep table columns,
formatters, UI state and CSS out of the generators. Extend the unit tests for
all three presets, boundary/invalid counts, uniqueness, fresh returned objects,
relationships and prefix stability. Do not introduce another size vocabulary.

The shared configuration adds no CSS. Unit tests cover all four sets through
1,000, invalid counts, cross-study inventory consistency and dates. Browser
checks cover presets in all five hosts, 1,000-row paging/grid counts, edit and
deletion preservation, direct jumps/filtering and narrow layout. Focused axe
checks cover the slider; no repeated theme contrast sweep or manual screen-reader
review was performed.
