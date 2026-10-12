# Labs billboard with actions

`/experiments/billboard-actions` is a portable A1 composition inspired by a
reference's two-column hierarchy, using original Labs content. It pairs a large
introductory message and supporting details with a separate action panel.

## Reusable composition

`apps/a1-labs/src/billboard-actions/ActionBillboard.jsx` uses only React and A1
Section, Grid, Stack, Card, Heading, Paragraph, Icon, ActionTiles and ActionTile.
It has no stylesheet, raw visual values, new tokens, routing or Labs dependency.
`BillboardActionsExperiment.jsx` owns all sample copy, destinations and controls,
and uses A1 Web's shared ResponsivePreviewFrame. Do not copy the preview frame
into the reusable composition.

| Input | Contract |
| --- | --- |
| `eyebrow`, `title`, `description` | Introductory content; heading names the section. |
| `callout` | Optional `{icon, label}` supporting message. |
| `features` | Optional array of `{id, icon, label}` highlights. |
| `panelTitle`, `panelDescription` | Action-panel heading and supporting copy. |
| `actions` | Array of `{id, icon, title, description?, href, target?}`. Host supplies real destinations. |
| `tone` | `accent` (default) or `neutral`. |
| `actionStyle` | `cards` (default) or `tiles`. |
| `showDetails` | Show action descriptions; defaults to true. |
| `stacked` | Force a single column; false by default. |
| `headingAs` | Main heading level, h1 by default; use h2 when embedding below a page title. |

The default Grid stacks at xs/sm and becomes two columns at A1 md (641px).
The headline scales through A1 display sizes. Existing Card accent semantics
own the intro's foreground colors; Section's surface prop references the same
semantic action-hover token. The action panel returns to normal page colors.
The neutral option uses a panel surface and a bare intro Card.

Cards use real whole-card links with static children and a trailing direction
icon. The first card has an info surface for emphasis. Action Tiles reuse A1's
side-icon stacked presentation. No nested interactive elements are introduced.
Links opening a new tab identify this in their accessible name and use
`rel="noreferrer"`. Heading IDs and the navigation label use React useId.

## Demo controls and behavior

The device toolbar offers Phone, Landscape phone, Tablet, Laptop and Desktop;
Laptop is the default. Configuration edits headline, introduction and panel
heading; chooses surface and action presentation; toggles descriptions and
stacked columns. Copy lives outside the iframe so device changes preserve it.
Empty heading drafts have meaningful fallbacks in the preview.

The three sample actions open the Labs canvas, A1 Web in a new tab, and Labs
release notes. Local links target the top-level page rather than navigating
inside the preview iframe. They perform navigation, not simulated submissions.

## Validation and promotion

Browser checks cover editable copy, both action presentations, description
visibility, actual link attributes, all five device widths, no horizontal
content overflow and focused structure/ARIA checks. Use the shared theme
settings for light/dark and alternate themes. This composition introduces no
animation; A1 retains ownership of hover/focus behavior.

CSS review: no custom CSS was added. The existing layout, surface, typography
and action APIs support this pattern without new system tokens or overrides.
This remains a Labs candidate; broader production content and assistive-
technology review belong to a future promotion.
