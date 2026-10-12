# Steps

`/experiments/steps` compares eight presentations of A1 progress tabs:
A1 default, Dots, Bars, Pills, Tiles, Chevrons, Vertical and Compact. The registry
places it in Controls and interaction, tagged Form pattern and Microinteraction.

## Reusable presentation

`src/steps/Steps.jsx` exports `Steps` with `items` (`id`, `label`, optional
`description`, `content`), selected `value`, `onChange`, completed ID array,
optional error ID, `treatment`, `descriptions` and an accessible `label`.
The host owns navigation and completion independently; selecting a step must
never mark it complete. Unknown treatments fall back to A1 default.

Use the real A1 `Tabs variant="progress"`, TabList, Tab and TabPanel throughout.
The default keeps A1's visual styling. Inactive panels remain mounted and hidden
through `equalHeight`, retaining form state and stable panel height. The adapter
adds the tablist name and orientation through its local ref because A1's current
TabList API does not expose these props. Keep native A1 arrow/Home/End navigation,
roving tab index, selected state and tab/panel relationships. Scroll only the
local step strip to reveal a selected step; never scroll the surrounding page.

Every step name includes its position and status. Decorative numbers and check
icons stay hidden from assistive technology. Compact visually hides inactive
labels without removing accessible names. The demo announces explicit completion
and reset; it does not announce every visual change. Error text explains how to
clear the simulated error. Completion never represents a real submission.

## Styling and configuration

`steps.css` is isolated beneath `a1-steps-study`; it opts the seven experimental
treatments into geometry and surface changes to A1 progress tabs. Do not put these
rules in global CSS or another experiment. Shared A1 controls are unchanged.
All sizing, spacing, typography, borders and palette use existing A1 tokens.
No new tokens or external dependencies are required. Reduced motion removes
transitions; forced colors preserves a selected outline and marker borders.

The page uses a ChoiceGroup for treatment, a Toolbar for 3/5/7 steps, a tile
description switch, simulated current-step error, Reset and Back/Complete actions.
Changing treatments retains the selected step and completed IDs. Changing count
retains shared IDs; a removed selected ID falls back to the first visible step.
Defaults: A1 default, five steps, Profile complete, Team selected, descriptions
on and no error. Preview capture: `--steps-only`.

## Validation

Run the Labs unit/build checks and `tests/steps.browser.mjs` with `LABS_ORIGIN`
pointing to the server. Cover all eight treatments, arrow/Home/End navigation,
completion versus visiting, reset, error blocking, count changes, mobile overflow,
reduced motion and focused axe (excluding contrast). Human screen-reader review
and a separate-host validation are still needed before promotion into A1.

Recorded Oct. 11, 2026: production build, Labs unit tests and focused steps
browser checks passed, including all eight treatments, completion, error
blocking, keyboard navigation, narrow widths, reduced motion and axe without
contrast scanning. The actual card preview and page screenshots were reviewed.
