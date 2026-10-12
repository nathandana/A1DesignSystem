# Tabs

Labs `/experiments/tabs` compares eight treatments on the real A1 Tabs:
A1 default, Folder tabs, Bold selected, Pills, Outline, Raised, Top rail and
Bookmarks. Configuration shows one treatment at a time, defaults to A1 with
icons, and offers optional counts and compact sizing. Active view state survives
configuration changes. It renders directly in the workspace.

## Implementation and promotion

`apps/a1-labs/src/tabs/StyledTabs.jsx` exports the controlled `StyledTabs` core
and `TAB_TREATMENTS`. Inputs are `items` (id, label, icon, count, content), `value`,
`onChange`, `treatment`, `icons`, `counts`, `size` and accessible `label`.
The host owns demonstration copy and configuration. Unknown treatments fall
back to A1. No routing, preview frame or Labs settings enter the core.

All treatments use the line variant's built-in scrolling, roving tab stop,
arrow/Home/End navigation and panel relationships. The adapter supplies a named
tablist and a focusable active panel. Panels size naturally to their content.
Selected tabs and labelled panels expose changes without a live region.
Do not disable the current tab or remove keyboard focus to suppress hover.
A1's current tab does not call `onChange` when reselected and has no hover or
pressed visual state, including its count. Inactive tabs retain hover feedback.

`tabs.css` is scoped to `.a1-tabs-study`. The A1 default has no visual overrides;
other styles are explicitly opted in. Geometry uses existing spacing/radius,
component-tab, semantic surface/border/action/text and shadow tokens. Folder
selection uses **neutral** text, count and surfaces that join the content sheet.
The selected tab has no bottom border. Overlap the strip and sheet by the border
width so the sheet’s top border does not leave a visible seam beneath selection;
keep the rest of the sheet border visible.
Retain the theme focus ring for keyboard users.

Custom CSS exists for the requested visual research, not to patch the shell.
Keep it beside the reusable core, without imports from other experiments.
Reduced motion disables tab transitions; shared A1 tab scrolling reads the live
preference and scrolls instantly. Forced colors preserve a selection outline.
This remains a Labs candidate; promotion needs standalone-host validation and
normal A1 integration, not just copying the demonstration page.

## Checks

All eight treatments were checked with pointer selection, unchanged selected
hover, arrow/Home/End keys and Tab into the panel. Checked icons/counts, compact
size, neutral folder selection, light/dark appearance, mobile horizontal
scrolling without page overflow, reduced motion and forced-color availability.
A focused axe check excluding contrast found no violations. No manual screen
reader session or broad theme contrast sweep was performed.
