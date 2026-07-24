# A1:Figma Plugin Component Coverage Audit

This audit compares the checked-in A1 Figma library manifest with the A1:Figma plugin's actual capability registries:

| Source | File |
|---|---|
| Figma library manifest | `packages/figma/plugins/a1-json/a1-library-manifest.json` |
| JSON adapters | `packages/figma/plugins/a1-json/src/code.js` |
| Build/Add targets | `packages/figma/plugins/a1-json/src/ui.html` and `src/code.js` |
| Fix/Convert targets | `packages/figma/plugins/a1-json/src/ui.html` |
| Context panels | `packages/figma/plugins/a1-json/src/ui.html` |

## Latest refactor progress

The current plugin refactor is now represented in the release candidate work:

- The plugin is split into source modules for contracts, pure helpers, Figma adapters, and build-time bundling instead of relying on one hand-maintained monolith.
- The shared audit core now owns issue grouping, severity weighting, scoring, grades, metrics, and recommendations. The main plugin uses it for the audit report.
- Build/Fix and contextual controls are in place for Page Layout, Top Header, Link, Breadcrumb, Definition List, Button Container, Choice Group, Data Table, Badge, Icon Button, Dialog, and Menu.
- Responsive Grid and Stack controls include shared width/height fill behaviour; Choice Group exposes its embedded responsive Grid configuration.
- Trigger configuration is consolidated around Dialog/Menu targets, and connected targets are represented in the JSON bridge.
- The temporary A1:Audit widget POC has been removed for now; audit execution remains in the main A1:Figma plugin until a widget surface is revisited.

The main remaining coverage work is concentrated in the rows marked with conversion or context gaps below, plus keeping the checked-in Figma library manifest aligned with newly published components.

## Public component coverage matrix

Legend: ✓ = supported, — = missing/not supported, indirect = available under a different plugin label, native = represented by native Figma node rather than a library component.

| Component | In Figma manifest | JSON model | Add button | Convert path | Context menu | Notes / priority |
|---|---:|---:|---:|---:|---:|---|
| Page Layout | ✓ | ✓ | ✓ | ✓ | ✓ | Context now covers breakpoint preview; future page-link wiring remains planned. |
| Top Header | ✓ | ✓ | ✓ | — | ✓ | Context now covers logo/nav/action/login structure; medium conversion gap; future nav/menu/page linking remains planned. |
| Section | ✓ | ✓ | ✓ | ✓ | ✓ | Good coverage. |
| Stack | native | ✓ | ✓ | ✓ | ✓ | Good coverage; native auto-layout frame. |
| Grid | native | ✓ | ✓ | ✓ | ✓ | Good coverage; native Figma grid frame. |
| Divider | ✓ | ✓ | ✓ | — | — | Medium conversion/context gap. |
| Heading | style/native | ✓ | ✓ | ✓ | ✓ | Context is shared Text panel. |
| Paragraph / Body | style/native | ✓ | indirect | ✓ | ✓ | Add label is **Body**; JSON type is `Paragraph`. |
| Link | ✓ | ✓ | ✓ | ✓ | ✓ | Context now covers label, size, weight, and icon placement; future page/playground linking remains planned. |
| Breadcrumb | ✓ | ✓ | ✓ | — | ✓ | Add/export supported; context auto-syncs the Back Button variant from selected/imported instance width (`<480px` = back button, otherwise full trail). |
| Card | ✓ | ✓ | ✓ | ✓ | ✓ | Good coverage. |
| Figure | ✓ | ✓ | ✓ | ✓ | — | Context gap. |
| Blockquote | ✓ | ✓ | ✓ | — | — | Medium conversion/context gap. |
| Code | ✓ | ✓ | ✓ | — | — | Medium conversion/context gap. |
| Inline | ✓ | ✓ | ✓ | — | — | Medium conversion/context gap. |
| Definition List | ✓ | ✓ | ✓ | — | ✓ | Context now covers direction, size, and item count; conversion gap remains. |
| Empty State | ✓ | ✓ | ✓ | — | — | High conversion/context gap. |
| Badge | ✓ | ✓ | ✓ | — | ✓ | High conversion gap; context exists. |
| Banner | ✓ | ✓ | ✓ | — | — | High conversion/context gap. |
| Text Field | ✓ | ✓ | ✓ | ✓ | — | High context gap. |
| Search Field | ✓ | ✓ | ✓ | ✓ | — | High context gap. |
| Textarea | ✓ | ✓ | ✓ | ✓ | — | High context gap. |
| Select | ✓ | ✓ | ✓ | ✓ | — | High context gap. |
| Switch | ✓ | ✓ | ✓ | ✓ | — | Context gap. |
| Radio Group | ✓ | ✓ | ✓ | ✓ | — | High context gap. |
| Checkbox Group | ✓ | ✓ | ✓ | ✓ | — | High context gap. |
| Choice Group | ✓ | ✓ | ✓ | — | ✓ | Add-only target with selected context controls for label, single/multiple type, size, option count, required state, and the embedded Options-slot responsive Grid columns. No conversion path by design. |
| Button | ✓ | ✓ | ✓ | ✓ | ✓ | Good coverage. |
| Icon Button | ✓ | ✓ | ✓ | — | ✓ | Conversion gap; context exists. |
| Button Container | ✓ | ✓ | ✓ | ✓ | ✓ | Build/Fix supported; selected context is labeled Button Group and controls Align while auto-syncing the Button Slot preview from the 480px container-query width. |
| Segmented Control | ✓ | ✓ | ✓ | — | — | High conversion/context gap. |
| Tabs | ✓ | ✓ | ✓ | ✓ | — | High context gap. |
| Pagination | ✓ | ✓ | ✓ | ✓ | — | Context gap. |
| Menu | ✓ | ✓ | ✓ | — | ✓ | Conversion gap; context exists. |
| Tooltip | ✓ | ✓ | ✓ | — | — | Medium conversion/context gap. |
| Accordion | ✓ | ✓ | ✓ | — | — | Medium conversion/context gap. |
| Dialog | ✓ | ✓ | ✓ | — | ✓ | Conversion gap; context exists. |
| Bottom Sheet | — | ✓ | — | — | — | The current published A1 Figma file has no `Bottom Sheet` component/component set to import; Add is disabled until the component is published and keyed. |
| Chip | ✓ | ✓ | ✓ | — | — | High conversion/context gap. |
| Chip Group | ✓ | ✓ | ✓ | — | — | High conversion/context gap. |
| Data Table | ✓ | ✓ | ✓ | — | ✓ | High conversion gap; context exists. |
| Page Nav | ✓ | ✓ | ✓ | ✓ | — | Context gap. |
| Tree Menu | ✓ | ✓ | ✓ | ✓ | — | Context gap. |
| A1 Audit Report Card | ✓ | — | — | — | — | Internal/plugin-only; probably okay. |

## Implementation-only subcomponent coverage

These manifest entries should usually stay private. They are represented through parent JSON models unless the parent model becomes too lossy.

| Figma entry | Parent JSON model | Standalone Add | Standalone Convert | Dedicated Context | Notes |
|---|---|---:|---:|---:|---|
| Top Header Nav Item | `TopHeader` | — | — | — | Parent owns nav/action items. |
| Radio Option | `RadioGroup` | — | — | — | Parent owns options. |
| Checkbox Option | `CheckboxGroup` | — | — | — | Parent owns options. |
| Segmented Control Item | `SegmentedControl` | — | — | — | Parent owns items. |
| Tab / Tab Item | `Tabs` | — | — | — | Parent owns tab items. |
| Page Nav Item | `PageNav` | — | — | — | Parent owns sections. |
| Tree Menu Item | `TreeMenu` | — | — | — | Parent owns tree items. |
| Menu Item | `Menu` | — | — | — | Parent owns menu items. |
| Data Table Header Cell | `DataTable` | — | — | — | Parent owns columns. |
| Data Table Cell | `DataTable` | — | — | — | Parent owns rows/cells. |
| Data Table Column | `DataTable` | — | — | — | Parent owns columns; plugin clones columns internally when needed. |
| Choice Option | `ChoiceGroup` | — | — | — | Parent owns options. |
| Definition List Item | `DefinitionList` | ✓ | ✓ | — | Exposed as plugin target **Definition Item**; emits parent-compatible `DefinitionList` JSON. |

## A1 components present in a1-web/page JSON but not in the current Figma manifest

| Component | a1-web JSON/component registry | Current Figma manifest | Plugin JSON model | Add button | Convert path | Context menu | Notes |
|---|---:|---:|---:|---:|---:|---:|---|
| Section Separator | ✓ | — | — | — | — | — | High priority if generated page JSON includes it; recent render failures referenced this type. |
| Bleed | ✓ | — | — | — | — | — | Layout utility; may be metadata instead of a Figma component. |
| Inset | ✓ | — | — | — | — | — | Useful because plugin warnings already suggest Inset for frame padding. |
| Spacer | ✓ | — | — | — | — | — | Layout utility. |
| List / ListItem | ✓ | — | — | — | — | — | Public A1 component with no Figma bridge component. |
| Notification | ✓ | — | — | — | — | — | Feedback component. |
| Status Bar | ✓ | — | — | — | — | — | Feedback component. |
| Circular Progress | ✓ | — | — | — | — | — | Feedback/loading component. |
| Autocomplete | ✓ | — | — | — | — | — | Input component. |
| Fieldset | ✓ | — | — | — | — | — | Form grouping component. |
| Calendar | ✓ | — | — | — | — | — | Data/date component. |
| Side Nav | ✓ | — | — | — | — | — | Plugin pre-classifies sizing, but has no Figma asset bridge. |
| Bottom Drawer | ✓ | — | — | — | — | — | Naming mismatch with plugin's `Bottom Sheet`; verify whether intentional. |
| Sticky Actions | ✓ | — | — | — | — | — | Action/layout component. |
| Toolbar | ✓ | — | — | — | — | — | Important because plugin UI uses toolbar-style context controls. |

## Priority table

| Priority | Work | Components |
|---:|---|---|
| 1 | Close JSON/import gaps that can stop rendering | Section Separator; publish/key Bottom Sheet or keep it out of Add; List; Toolbar; Fieldset |
| 2 | Add missing Build/Add support for current Figma public components | — |
| 3 | Add highest-value Convert paths | Data Table; Badge; Banner; Empty State; Segmented Control; Definition List; Chip / Chip Group |
| 4 | Add highest-value context menus | field family; Radio Group; Checkbox Group; Tabs; Segmented Control; Banner; Empty State; Chip Group |

## Notes

| Note | Detail |
|---|---|
| Definition Item | `Definition List Item` appears as a Build/Fix target named **Definition Item**. It uses a special path rather than the generic add map, so it is not a missing Add button. |
| Body vs Paragraph | `Paragraph` is represented in the plugin UI as **Body**. This is probably correct for the plugin's mental model, but docs should continue to state that Body exports/imports as `Paragraph`. |
| Private children | Most implementation subcomponents should remain private unless a parent component's JSON model becomes too lossy. |
