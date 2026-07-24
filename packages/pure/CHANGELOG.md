# @a1/pure Changelog

## Unreleased

- **Segmented Control** — new scoped classes: `.a1-segmented` track (+ `.a1-segmented-small` 28px / `.a1-segmented-large` 56px / `.a1-segmented-full-width`) with `.a1-segment` options. Track heights sit on the 28/40/56 control-height standard (the token names the TOTAL height; segments derive theirs via `calc`). Selection styles from `aria-checked="true"` (radiogroup), `aria-selected="true"` (tablist), or the `.a1-segment-selected` modifier. All values from `--component-segmented-*` and semantic tokens. Demo page: `examples/a1-pure/segmented-control.html` (navigation updated across the example site). First consumer: the A1:Figma plugin's mode tabs.

- **Package release notes** — Pure CSS package changes are now tracked separately from the app and React package release notes so HTML/CSS consumers can review package-specific updates.

