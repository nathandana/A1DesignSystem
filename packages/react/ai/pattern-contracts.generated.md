# Pattern contracts

Generated from `system/patterns/*.json`. Edit those manifests, then run `npm run build:patterns`.

## Navigation tree

Type: `NavigationTree` · Version: `1.0.0` · Status: experimental.

A side navigation tree with optional search and categorized or A–Z views.

| Area | Kind | Destination | Rules |
| --- | --- | --- | --- |

Structured collection: **Navigation items** (`/props/items`). Any number of nested categories and items with globally unique IDs and visible labels.

Props schema and examples: [navigation-tree.json](../../../system/patterns/navigation-tree.json).

## Overflow menu

Type: `OverflowMenu` · Version: `1.0.0` · Status: experimental.

A more_vert icon button opens contextual actions. Any action can optionally require verification in a dialog.

| Area | Kind | Destination | Rules |
| --- | --- | --- | --- |

Structured collection: **Actions** (`/props/actions`). Ordered, uniquely identified menu actions with visible labels. Any action can require verification.

Props schema and examples: [overflow-menu.json](../../../system/patterns/overflow-menu.json).

## Overview card

Type: `OverviewCard` · Version: `1.0.0` · Status: experimental.

A parent-sized summary card with details, open content and constrained actions.

| Area | Kind | Destination | Rules |
| --- | --- | --- | --- |
| Content (`content`) | open | `children` | Between the details and the actions — a short paragraph, a progress bar or a chart. |
| Actions (`actions`) | zone | `actions` | Up to 2 small buttons, links or icon buttons. No primary button: cards repeat, and the page title holds the primary action. |


Props schema and examples: [overview-card.json](../../../system/patterns/overview-card.json).

## Page title

Type: `PageTitle` · Version: `1.0.0` · Status: experimental.

The standard page heading band with metadata, actions and open content.

| Area | Kind | Destination | Rules |
| --- | --- | --- | --- |
| Metadata (`meta`) | zone | `meta` | Up to 5 badges, shown small and subtle directly below the title. |
| Actions (`actions`) | zone | `actions` | Up to 4 buttons, split buttons, links, icon buttons, button groups, toolbars or segmented controls. One primary button, shown last. |
| Content (`content`) | open | `children` | Below the actions. Add a search field, tabs or filters. |


Props schema and examples: [page-title.json](../../../system/patterns/page-title.json).

## Verification dialog

Type: `VerificationDialog` · Version: `1.0.0` · Status: experimental.

Verify an action with a consequence message, optional content, Cancel and Confirm.

| Area | Kind | Destination | Rules |
| --- | --- | --- | --- |
| Content (`content`) | open | `children` | Optional supporting details between the message and the actions. |


Props schema and examples: [verification-dialog.json](../../../system/patterns/verification-dialog.json).
