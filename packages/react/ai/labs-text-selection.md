# Labs text selection

`/experiments/text-selection` compares the unstyled browser selection with eight
scoped CSS `::selection` treatments. The side panel changes one class on the
study root; the user creates and clears the selection through normal browser
interaction. There is no Range registration, Custom Highlight API, persistence,
or selection-management UI.

Six treatments use existing semantic theme tokens:

- Action solid: action background and foreground
- Action subtle: action surface and accent text
- Information: information surface and text
- Success: success surface and text
- Warning: warning surface and text
- Error: error surface and text

Two additional treatments use the dedicated highlighted color ramp:

- Highlight ramp · subtle: `base.color.highlighted.100` background with `.900` text
- Highlight ramp · obvious: `base.color.highlighted.400` background with `.1000` text

The canvas contains two real-world documents: a product release update on the
default surface and a resolved service notice in an inverse section. Headings,
paragraphs, links, lists, inline code, actions and an A1 TextareaField provide a
range of native selectable content. Because `::selection` applies to selection
inside form controls, the TextareaField needs no special JavaScript treatment.

Default deliberately has no local selection CSS. The eight custom selectors are
scoped below `.a1-selection-study`, so they cannot change selection colors in
Labs navigation or configuration surfaces. The experiment owns no new token or
shared component API.
