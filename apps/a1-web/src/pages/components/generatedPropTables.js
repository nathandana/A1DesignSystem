// Generated from packages/react/src/components/**/*.d.ts.
// Update by regenerating this file when package prop declarations change.

export const GENERATED_PROP_TABLES = {
  "accordion": [
    {
      "title": "Accordion",
      "rows": [
        {
          "id": "label",
          "name": "label",
          "type": "string",
          "description": "Trigger label text"
        },
        {
          "id": "subtext",
          "name": "subtext",
          "type": "React.ReactNode",
          "description": "Secondary information shown in the trigger, **below** the label. It only shows while the accordion is collapsed (a glanceable summary, e.g. the applied settings) and is hidden when open. Truncates with an ellipsis."
        },
        {
          "id": "open",
          "name": "open",
          "type": "boolean",
          "description": "Controlled open state"
        },
        {
          "id": "defaultOpen",
          "name": "defaultOpen",
          "type": "boolean",
          "description": "Initial open state (uncontrolled). Default: false"
        },
        {
          "id": "onChange",
          "name": "onChange",
          "type": "(open: boolean) => void",
          "description": "Called with the next boolean when the trigger is clicked"
        },
        {
          "id": "size",
          "name": "size",
          "type": "\"sm\" | \"md\" | \"lg\"",
          "description": "Size — affects trigger text size and padding. Default: \"md\""
        },
        {
          "id": "divider",
          "name": "divider",
          "type": "boolean",
          "description": "Show a divider under the trigger/header (it stays attached to the header, not the bottom of the open panel). Default: false"
        },
        {
          "id": "disabled",
          "name": "disabled",
          "type": "boolean",
          "description": "Prevent the accordion from being toggled. Default: false"
        },
        {
          "id": "className",
          "name": "className",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "No description in the package type declaration."
        }
      ]
    }
  ],
  "autocomplete": [
    {
      "title": "Autocomplete Option",
      "rows": [
        {
          "id": "value",
          "name": "value",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "label",
          "name": "label",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "swatch",
          "name": "swatch",
          "type": "string",
          "description": "A CSS colour rendered as a swatch beside the option (and on the selected value / chip). In `variant=\"color\"` the swatch defaults to `value` when omitted."
        },
        {
          "id": "icon",
          "name": "icon",
          "type": "string",
          "description": "A Material Symbols glyph name rendered beside the option / chip / selected value."
        },
        {
          "id": "group",
          "name": "group",
          "type": "string",
          "description": "Group name. When any option has a `group`, the listbox renders a sticky heading before each group's options. Options are ordered by each group's first appearance."
        }
      ]
    },
    {
      "title": "Autocomplete",
      "rows": [
        {
          "id": "options",
          "name": "options",
          "type": "(string | AutocompleteOption)[]",
          "description": "Suggestion list. Pass strings or `{ value, label }` objects."
        },
        {
          "id": "value",
          "name": "value",
          "type": "string | string[]",
          "description": "Selected value — a string in single mode, a string[] in multi mode."
        },
        {
          "id": "onChange",
          "name": "onChange",
          "type": "(value: string | string[]) => void",
          "description": "Called with the new value (string, or string[] when `multiple`)."
        },
        {
          "id": "multiple",
          "name": "multiple",
          "type": "boolean",
          "description": "Allow selecting more than one option (renders removable chips). Default: false"
        },
        {
          "id": "allowCreate",
          "name": "allowCreate",
          "type": "boolean",
          "description": "Allow creating a value not in `options` (\"Add …\"). Default: false"
        },
        {
          "id": "onCreate",
          "name": "onCreate",
          "type": "(value: string) => void",
          "description": "Called with the created value when an `allowCreate` option is chosen."
        },
        {
          "id": "variant",
          "name": "variant",
          "type": "\"default\" | \"color\"",
          "description": "Visual variant. \"color\" renders a colour swatch beside each option / chip / the selected value (swatch defaults to the option `value`). Default: \"default\""
        },
        {
          "id": "label",
          "name": "label",
          "type": "React.ReactNode",
          "description": "Field label."
        },
        {
          "id": "hint",
          "name": "hint",
          "type": "React.ReactNode",
          "description": "Helper text shown below the control."
        },
        {
          "id": "error",
          "name": "error",
          "type": "React.ReactNode",
          "description": "Error message; styles the control and replaces the hint."
        },
        {
          "id": "size",
          "name": "size",
          "type": "\"compact\" | \"default\" | \"comfortable\"",
          "description": "Size scale, matching the field family. Default: \"default\""
        },
        {
          "id": "required",
          "name": "required",
          "type": "boolean",
          "description": "No description in the package type declaration."
        },
        {
          "id": "disabled",
          "name": "disabled",
          "type": "boolean",
          "description": "No description in the package type declaration."
        },
        {
          "id": "id",
          "name": "id",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "name",
          "name": "name",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "className",
          "name": "className",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "emptyText",
          "name": "emptyText",
          "type": "React.ReactNode",
          "description": "Text shown when no options match. Default: \"No matches\""
        },
        {
          "id": "createLabel",
          "name": "createLabel",
          "type": "(query: string) => React.ReactNode",
          "description": "Label for the create option, given the current query."
        },
        {
          "id": "maxVisible",
          "name": "maxVisible",
          "type": "number",
          "description": "Cap the number of options rendered in the listbox (for very large lists like an icon picker). Excess options are hidden behind a \"keep typing\" footer."
        },
        {
          "id": "moreText",
          "name": "moreText",
          "type": "(shown: number) => React.ReactNode",
          "description": "Footer text shown when the list is capped by `maxVisible`, given the shown count."
        },
        {
          "id": "aria-label",
          "name": "aria-label",
          "type": "string",
          "description": "No description in the package type declaration."
        }
      ]
    }
  ],
  "badge": [
    {
      "title": "Badge",
      "rows": [
        {
          "id": "status",
          "name": "status",
          "type": "\"neutral\" | \"info\" | \"success\" | \"warn\" | \"error\"",
          "description": "Semantic status colour. Default: \"neutral\""
        },
        {
          "id": "subtle",
          "name": "subtle",
          "type": "boolean",
          "description": "Reduce background opacity for a softer appearance. Default: false"
        },
        {
          "id": "size",
          "name": "size",
          "type": "\"sm\" | \"md\" | \"lg\"",
          "description": "Size. Default: \"md\""
        },
        {
          "id": "icon",
          "name": "icon",
          "type": "string | null",
          "description": "Override the default status icon. Pass `null` to suppress the icon entirely."
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "No description in the package type declaration."
        }
      ]
    }
  ],
  "banner": [
    {
      "title": "Banner",
      "rows": [
        {
          "id": "variant",
          "name": "variant",
          "type": "\"inline\" | \"system\" | \"calendar\"",
          "description": "Layout style. \"inline\" sits within content; \"system\" spans full width; \"calendar\" shows a date callout in place of the status icon. Default: \"inline\""
        },
        {
          "id": "status",
          "name": "status",
          "type": "\"neutral\" | \"info\" | \"success\" | \"warn\" | \"error\"",
          "description": "Semantic status colour. Default: \"neutral\""
        },
        {
          "id": "title",
          "name": "title",
          "type": "string",
          "description": "Bold title text shown before the body"
        },
        {
          "id": "eyebrow",
          "name": "eyebrow",
          "type": "string",
          "description": "Small overline label shown above the title. Calendar variant only."
        },
        {
          "id": "date",
          "name": "date",
          "type": "Date | string | { month: string | number; day: string | number }",
          "description": "Date shown in the calendar callout. Accepts a Date, an ISO date string, or `{ month, day }` for full control of the displayed month/day. Calendar variant only."
        },
        {
          "id": "icon",
          "name": "icon",
          "type": "string",
          "description": "Override the default status icon with any Material Symbols name"
        },
        {
          "id": "action",
          "name": "action",
          "type": "React.ReactNode",
          "description": "Action element (e.g. a Button) rendered at the trailing end"
        },
        {
          "id": "onDismiss",
          "name": "onDismiss",
          "type": "() => void",
          "description": "Called when the dismiss button is clicked. Omit to hide the dismiss button."
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "No description in the package type declaration."
        }
      ]
    }
  ],
  "bleed": [
    {
      "title": "Bleed",
      "rows": [
        {
          "id": "as",
          "name": "as",
          "type": "React.ElementType",
          "description": "Underlying element. Default: \"div\""
        },
        {
          "id": "space",
          "name": "space",
          "type": "SpacingToken | \"none\"",
          "description": "Base bleed amount applied to all axes when no axis-specific value is set. Default: 16"
        },
        {
          "id": "block",
          "name": "block",
          "type": "SpacingToken | \"none\"",
          "description": "Block-axis (top/bottom) bleed override. Default: \"none\""
        },
        {
          "id": "inline",
          "name": "inline",
          "type": "SpacingToken",
          "description": "Inline-axis (left/right) bleed override. Falls back to `space`."
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "No description in the package type declaration."
        }
      ]
    }
  ],
  "blockquote": [
    {
      "title": "Blockquote",
      "rows": [
        {
          "id": "variant",
          "name": "variant",
          "type": "\"border\" | \"filled\" | \"feature\" | \"minimal\" | \"accent\" | \"pull\" | \"ruled\"",
          "description": "Visual style variant. Default: \"border\" border — left accent border, subtle background filled — filled neutral surface feature — large centered text with accent bar, for pullquotes minimal — no decoration, plain text accent — filled action-colour background with inverse text pull — centred editorial with curly quotes ruled — top + bottom horizontal rules, centred"
        },
        {
          "id": "cite",
          "name": "cite",
          "type": "string",
          "description": "Attribution text rendered as a `<figcaption>`"
        },
        {
          "id": "citeUrl",
          "name": "citeUrl",
          "type": "string",
          "description": "URL that the cite text links to"
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "No description in the package type declaration."
        }
      ]
    }
  ],
  "bottom-drawer": [
    {
      "title": "Bottom Drawer Item",
      "rows": [
        {
          "id": "id",
          "name": "id",
          "type": "string",
          "description": "Unique identifier for the item."
        },
        {
          "id": "label",
          "name": "label",
          "type": "string",
          "description": "Display label shown below the icon."
        },
        {
          "id": "icon",
          "name": "icon",
          "type": "string",
          "description": "Material Symbols icon name."
        },
        {
          "id": "href",
          "name": "href",
          "type": "string",
          "description": "Navigate to this URL — renders an <a> element."
        },
        {
          "id": "onClick",
          "name": "onClick",
          "type": "() => void",
          "description": "Click handler — used when no href is provided; renders a <button>."
        },
        {
          "id": "active",
          "name": "active",
          "type": "boolean",
          "description": "Marks this item as the currently active destination."
        },
        {
          "id": "badge",
          "name": "badge",
          "type": "number",
          "description": "Numeric badge count shown on the icon (capped at 99+)."
        },
        {
          "id": "disabled",
          "name": "disabled",
          "type": "boolean",
          "description": "Disables the item."
        }
      ]
    },
    {
      "title": "Bottom Drawer",
      "rows": [
        {
          "id": "items",
          "name": "items",
          "type": "BottomDrawerItem[]",
          "description": "Up to 5 navigation items. Additional items beyond 5 are silently ignored."
        },
        {
          "id": "aria-label",
          "name": "aria-label",
          "type": "string",
          "description": "Accessible name for the nav element."
        }
      ]
    }
  ],
  "bottom-sheet": [
    {
      "title": "Bottom Sheet",
      "rows": [
        {
          "id": "title",
          "name": "title",
          "type": "string",
          "description": "First line shown in the header — the only content visible when collapsed."
        },
        {
          "id": "detents",
          "name": "detents",
          "type": "number[]",
          "description": "Expanded heights as fractions of the viewport height (0–1), smallest first. The collapsed state (header only) is always available as snap index 0. Default: [0.5, 0.92]."
        },
        {
          "id": "detent",
          "name": "detent",
          "type": "number",
          "description": "Controlled snap index. 0 = collapsed, then one index per `detents` entry."
        },
        {
          "id": "defaultDetent",
          "name": "defaultDetent",
          "type": "number",
          "description": "Uncontrolled initial snap index. Default: 1 (the first detent)."
        },
        {
          "id": "onDetentChange",
          "name": "onDetentChange",
          "type": "(index: number) => void",
          "description": "Called with the next snap index when the detent changes."
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "No description in the package type declaration."
        }
      ]
    }
  ],
  "breadcrumb": [
    {
      "title": "Breadcrumb Item",
      "rows": [
        {
          "id": "label",
          "name": "label",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "href",
          "name": "href",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "onClick",
          "name": "onClick",
          "type": "() => void",
          "description": "No description in the package type declaration."
        }
      ]
    },
    {
      "title": "Breadcrumb",
      "rows": [
        {
          "id": "items",
          "name": "items",
          "type": "BreadcrumbItem[]",
          "description": "Ordered list of breadcrumb items. The last item is treated as the current page (non-interactive). All previous items render as links or buttons."
        },
        {
          "id": "backLabel",
          "name": "backLabel",
          "type": "string",
          "description": "Label for the back link shown in narrow containers. Defaults to \"Back\"."
        }
      ]
    }
  ],
  "button": [
    {
      "title": "Button",
      "rows": [
        {
          "id": "as",
          "name": "as",
          "type": "React.ElementType",
          "description": "Underlying element or component to render. Default: \"button\""
        },
        {
          "id": "variant",
          "name": "variant",
          "type": "\"primary\" | \"secondary\" | \"tertiary\" | \"destructive\" | \"success\"",
          "description": "Visual style. Default: \"primary\""
        },
        {
          "id": "size",
          "name": "size",
          "type": "\"sm\" | \"md\" | \"lg\"",
          "description": "Size. Default: \"md\""
        },
        {
          "id": "icon",
          "name": "icon",
          "type": "string",
          "description": "Material Symbols icon name to show alongside the label"
        },
        {
          "id": "iconPosition",
          "name": "iconPosition",
          "type": "\"start\" | \"end\"",
          "description": "Whether the icon appears before or after the label. Default: \"start\""
        },
        {
          "id": "fullWidth",
          "name": "fullWidth",
          "type": "boolean",
          "description": "Stretch the button to fill the width of its container. When false the button uses its natural content width. Default: false"
        },
        {
          "id": "loading",
          "name": "loading",
          "type": "boolean",
          "description": "Show a loading spinner (replacing the icon) and make the button inert (disabled + aria-busy). Use while an action is in progress, e.g. submitting a form. Default: false"
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "No description in the package type declaration."
        }
      ]
    }
  ],
  "button-container": [
    {
      "title": "Button Container",
      "rows": [
        {
          "id": "align",
          "name": "align",
          "type": "\"start\" | \"center\" | \"end\"",
          "description": "Horizontal alignment of buttons. Default: \"start\""
        },
        {
          "id": "size",
          "name": "size",
          "type": "\"sm\" | \"md\" | \"lg\"",
          "description": "Default size passed to child Button elements that do not set their own size."
        },
        {
          "id": "fillButtons",
          "name": "fillButtons",
          "type": "boolean",
          "description": "When true, Button children stretch to fill remaining row space while IconButton children keep their natural square size. Always renders as a row — does not collapse to column on narrow containers. Default: false"
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "No description in the package type declaration."
        }
      ]
    }
  ],
  "calendar": [
    {
      "title": "Calendar Month",
      "rows": [
        {
          "id": "year",
          "name": "year",
          "type": "number",
          "description": "Full calendar year, e.g. 2026"
        },
        {
          "id": "month",
          "name": "month",
          "type": "number",
          "description": "1-indexed month: 1 = January … 12 = December"
        }
      ]
    },
    {
      "title": "Calendar",
      "rows": [
        {
          "id": "variant",
          "name": "variant",
          "type": "\"scroll\" | \"paginated\"",
          "description": "Display mode. - `\"scroll\"` — renders all months vertically; parent container controls scrolling (default). - `\"paginated\"` — shows one month at a time with prev/next buttons and month/year selects."
        },
        {
          "id": "initialMonth",
          "name": "initialMonth",
          "type": "Date | CalendarMonth",
          "description": "Month to centre the scroll position on at mount (scroll) or the initial month shown (paginated). Accepts a `Date` object or `{ year, month }` (month is 1-indexed). Defaults to the current month."
        },
        {
          "id": "monthsToShow",
          "name": "monthsToShow",
          "type": "number",
          "description": "Total number of months to render. Only applies to `variant=\"scroll\"`. Default: 13"
        },
        {
          "id": "highlightToday",
          "name": "highlightToday",
          "type": "boolean",
          "description": "Highlight today's date with the action colour. Default: true"
        },
        {
          "id": "dimPast",
          "name": "dimPast",
          "type": "boolean",
          "description": "Apply a background tint to dates before today. Default: true"
        },
        {
          "id": "todayButton",
          "name": "todayButton",
          "type": "boolean",
          "description": "Show a \"Today\" button in the paginated nav bar that jumps to the current month. Disabled automatically when already on the current month. Only applies to `variant=\"paginated\"`. Default: false"
        },
        {
          "id": "selectable",
          "name": "selectable",
          "type": "boolean",
          "description": "Enables date selection. When false (default), the calendar is display-only — no click handlers, hover effects, or keyboard interaction on day cells. Pass `selectedDate` or `defaultSelectedDate` alongside this prop. Default: false"
        },
        {
          "id": "selectedDate",
          "name": "selectedDate",
          "type": "Date | null",
          "description": "The currently selected date (controlled). Pass `null` to clear the selection. Omit entirely to use uncontrolled mode with `defaultSelectedDate`."
        },
        {
          "id": "defaultSelectedDate",
          "name": "defaultSelectedDate",
          "type": "Date | null",
          "description": "Initial selected date for uncontrolled mode. Ignored when `selectedDate` is provided."
        },
        {
          "id": "onChange",
          "name": "onChange",
          "type": "(date: Date) => void",
          "description": "Called with the new `Date` whenever the user clicks a selectable day."
        },
        {
          "id": "minDate",
          "name": "minDate",
          "type": "Date",
          "description": "Earliest selectable date (inclusive). Days before this are disabled."
        },
        {
          "id": "maxDate",
          "name": "maxDate",
          "type": "Date",
          "description": "Latest selectable date (inclusive). Days after this are disabled."
        }
      ]
    }
  ],
  "canvas": [
    {
      "title": "Node Connector",
      "rows": [
        {
          "id": "id",
          "name": "id",
          "type": "string",
          "description": "Unique identifier"
        },
        {
          "id": "from",
          "name": "from",
          "type": "string",
          "description": "Source node id"
        },
        {
          "id": "to",
          "name": "to",
          "type": "string",
          "description": "Target node id"
        },
        {
          "id": "direction",
          "name": "direction",
          "type": "CanvasEdgeDirection",
          "description": "Which end(s) carry arrowheads (default `\"to\"`)"
        },
        {
          "id": "variant",
          "name": "variant",
          "type": "CanvasEdgeVariant",
          "description": "Line style (default `\"solid\"`)"
        },
        {
          "id": "weight",
          "name": "weight",
          "type": "CanvasEdgeWeight",
          "description": "Stroke weight (default `\"normal\"`)"
        },
        {
          "id": "label",
          "name": "label",
          "type": "string",
          "description": "Optional label rendered at the midpoint of the connector"
        },
        {
          "id": "curved",
          "name": "curved",
          "type": "boolean",
          "description": "Override the canvas-level `edgeStyle` for this connector. `true` = curved, `false` = straight."
        }
      ]
    },
    {
      "title": "Canvas",
      "rows": [
        {
          "id": "children",
          "name": "children",
          "type": "ReactNode",
          "description": "`Node` and `NodeConnector` elements as direct children. ```jsx <Canvas aria-label=\"Graph\"> <Node id=\"a\" x={100} y={100} label=\"Tokens\" color=\"info\" /> <Node id=\"b\" x={300} y={100} label=\"React\" color=\"success\" /> <NodeConnector id=\"e1\" from=\"a\" to=\"b\" /> </Canvas> ```"
        },
        {
          "id": "mode",
          "name": "mode",
          "type": "CanvasMode",
          "description": "Interaction mode. - `\"view\"` (default) — pan and zoom only. - `\"edit\"` — nodes are draggable; clicking empty canvas adds a node (`onAddNode`); each node shows a connect button to draw new connectors (`onAddEdge`)."
        },
        {
          "id": "onNodeMove",
          "name": "onNodeMove",
          "type": "(id: string, x: number, y: number) => void",
          "description": "Called in edit mode with the moved node's id and new center position."
        },
        {
          "id": "onDeleteNode",
          "name": "onDeleteNode",
          "type": "(id: string) => void",
          "description": "Called when the user selects \"Delete\" from a node's context menu. Only shown when provided (edit mode). Remove the node from your state."
        },
        {
          "id": "onDuplicateNode",
          "name": "onDuplicateNode",
          "type": "(id: string) => void",
          "description": "Called when the user selects \"Duplicate\" from a node's context menu. Only shown when provided (edit mode). Create a copy of the node in your state."
        },
        {
          "id": "onAddNode",
          "name": "onAddNode",
          "type": "(x: number, y: number) => void",
          "description": "Called in edit mode when the user clicks empty canvas space (no pan occurred). Receives the click position in canvas coordinates (center of the new node). Add a new node at that position in your state."
        },
        {
          "id": "onAddEdge",
          "name": "onAddEdge",
          "type": "(fromId: string, toId: string) => void",
          "description": "Called in edit mode when the user draws a connector between two nodes using the connect button on a node. Add the new edge in your state."
        },
        {
          "id": "nodeMenuItems",
          "name": "nodeMenuItems",
          "type": "(nodeId: string) => Array<{ id: string; label?: string; icon?: string; variant?: string; disabled?: boolean; onClick?: () => void } | { type: 'divider'; id: string } | { type: 'group'; id: string; label: string }>",
          "description": "Returns custom context menu items for a right-clicked node. Items use the `ContextMenuEntry` shape from the A1 ContextMenu component. Shown before the built-in \"Duplicate\" and \"Delete\" items (edit mode only)."
        },
        {
          "id": "canvasMenuItems",
          "name": "canvasMenuItems",
          "type": "Array<{ id: string; label?: string; icon?: string; variant?: string; disabled?: boolean; onClick?: () => void } | { type: 'divider'; id: string }>",
          "description": "Extra context menu items shown when right-clicking the canvas background (appended below the built-in zoom / fit / reset items)."
        },
        {
          "id": "showGrid",
          "name": "showGrid",
          "type": "boolean",
          "description": "Show the dot grid (default `true`)"
        },
        {
          "id": "background",
          "name": "background",
          "type": "CanvasBackground",
          "description": "Background surface token (default `\"panel\"`). - `\"panel\"` — standard panel surface. - `\"page\"` — page background. - `\"raised\"` — elevated surface. Pair with `inverse` for a dark/inverse canvas."
        },
        {
          "id": "inverse",
          "name": "inverse",
          "type": "boolean",
          "description": "Apply the inverse color scheme — dark surface with inverse text. Mirrors the `inverse` prop on `Section`. Default `false`."
        },
        {
          "id": "showControls",
          "name": "showControls",
          "type": "boolean",
          "description": "Show the zoom controls overlay (default `true`)"
        },
        {
          "id": "edgeStyle",
          "name": "edgeStyle",
          "type": "CanvasEdgeStyle",
          "description": "Default edge rendering shape for all edges (default `\"straight\"`). Individual `<NodeConnector curved>` overrides this per connector."
        },
        {
          "id": "defaultAnchorSnap",
          "name": "defaultAnchorSnap",
          "type": "CanvasNodeAnchorSnap",
          "description": "Canvas-wide anchor snap default for all nodes. Per-node `anchorSnap` overrides this when set. - `'cardinal'` — exits only from N, E, S, W face centers (90°) - `'octagonal'` — exits from all 8 directions including diagonals (45°) - `undefined` — free angle toward the target (default) Does not affect `edgeStyle=\"elbow\"` edges."
        },
        {
          "id": "snapToGrid",
          "name": "snapToGrid",
          "type": "boolean",
          "description": "When `true`, node positions snap to the nearest grid increment while dragging in `mode=\"edit\"` (default `false`)."
        },
        {
          "id": "gridSpacing",
          "name": "gridSpacing",
          "type": "number",
          "description": "Grid cell size in pixels (default `16`). Applies to the visual grid overlay and to snap-to-grid when `snapToGrid` is enabled. Suggested values: `1`, `4`, `8`, `16`."
        },
        {
          "id": "defaultZoom",
          "name": "defaultZoom",
          "type": "number",
          "description": "Initial zoom level (default `1`)"
        },
        {
          "id": "defaultPan",
          "name": "defaultPan",
          "type": "{ x: number; y: number }",
          "description": "Initial pan offset in pixels (default `{ x: 0, y: 0 }`)"
        },
        {
          "id": "traceConnections",
          "name": "traceConnections",
          "type": "boolean",
          "description": "When `true`, clicking an already-selected node toggles a transitive connection trace — all connectors reachable from that node are highlighted and the rest are dimmed. Click the node again to dismiss. Default `false`."
        },
        {
          "id": "draggableNodes",
          "name": "draggableNodes",
          "type": "boolean",
          "description": "When `true`, nodes are draggable (grab cursor, position updates via `onNodeMove`) without enabling full `mode=\"edit\"` (no connect buttons, no double-click-to-add). Ignored when `mode=\"edit\"` (edit mode always implies draggable). Default `false`."
        },
        {
          "id": "highlightConnections",
          "name": "highlightConnections",
          "type": "boolean",
          "description": "When `true` and a node is selected, connectors directly attached to that node are highlighted and all others are dimmed. Ignored when `traceConnections` is active. Default `false`."
        },
        {
          "id": "onSelectionChange",
          "name": "onSelectionChange",
          "type": "(id: string | null) => void",
          "description": "Called when the selected node changes. Fires with the node id when a node is selected, or `null` when the selection is cleared."
        },
        {
          "id": "onEdgeSelect",
          "name": "onEdgeSelect",
          "type": "(id: string | null) => void",
          "description": "Called when a connector is clicked. Fires with the connector id when selected, or `null` when selection is cleared."
        },
        {
          "id": "aria-label",
          "name": "aria-label",
          "type": "string",
          "description": "Accessible label for the canvas region (required)"
        }
      ]
    }
  ],
  "card": [
    {
      "title": "Card",
      "rows": [
        {
          "id": "as",
          "name": "as",
          "type": "React.ElementType",
          "description": "Underlying element. Default: \"div\""
        },
        {
          "id": "variant",
          "name": "variant",
          "type": "\"default\" | \"navigation\"",
          "description": "Visual and semantic card variant. Navigation cards make the entire card interactive. Default: \"default\""
        },
        {
          "id": "href",
          "name": "href",
          "type": "string",
          "description": "Destination for navigation cards. When `variant=\"navigation\"` is set, the card renders as an anchor by default."
        },
        {
          "id": "bare",
          "name": "bare",
          "type": "boolean",
          "description": "Remove the card border and background. Default: false"
        },
        {
          "id": "icon",
          "name": "icon",
          "type": "string",
          "description": "Material Symbols icon name. Used by `iconDisplay` to render the icon."
        },
        {
          "id": "iconDisplay",
          "name": "iconDisplay",
          "type": "\"none\" | \"default\" | \"hero\"",
          "description": "Controls how the icon is displayed. - `\"default\"` — small tokenised icon block above card content; scales with the card container (sm/md/lg). - `\"hero\"` — full-bleed coloured header area at the top of the card. - `\"none\"` — icon is not rendered. Default: `\"default\"` (when `icon` is provided)."
        },
        {
          "id": "heroColor",
          "name": "heroColor",
          "type": "\"action\" | \"neutral\" | \"info\" | \"success\" | \"warn\" | \"error\" | (string & {})",
          "description": "Background colour of the hero block when `iconDisplay=\"hero\"`. Accepts a semantic colour role or any valid CSS colour value. Default: \"action\""
        },
        {
          "id": "heroBadge",
          "name": "heroBadge",
          "type": "React.ReactNode",
          "description": "Badge label overlaid on the hero (only renders when `iconDisplay=\"hero\"`)."
        },
        {
          "id": "heroBadgeStatus",
          "name": "heroBadgeStatus",
          "type": "\"neutral\" | \"info\" | \"success\" | \"warn\" | \"error\"",
          "description": "Status colour of the hero badge. Default: \"neutral\""
        },
        {
          "id": "heroBadgePosition",
          "name": "heroBadgePosition",
          "type": "| \"top-start\" | \"top-center\" | \"top-end\" | \"middle-start\" | \"middle-center\" | \"middle-end\" | \"bottom-start\" | \"bottom-center\" | \"bottom-end\"",
          "description": "Placement of the hero badge on a 3×3 grid (\"{top|middle|bottom}-{start|center|end}\"). Default: \"top-end\""
        },
        {
          "id": "status",
          "name": "status",
          "type": "\"neutral\" | \"info\" | \"success\" | \"warn\" | \"error\"",
          "description": "Renders a coloured status stripe down the card's inline-start edge, coloured from the tokenized `component.card.status.*` palette (warn/success are two ramp steps lighter than the status background so a thin stripe still reads as amber/green). The stripe is decorative: status must NOT be conveyed by colour alone. Pair it with `statusLabel` (or status text the card carries or sits within) — see the `card-status-not-color-only` rule (WCAG 2.1 SC 1.4.1, Level A). Default: undefined (no stripe)."
        },
        {
          "id": "statusLabel",
          "name": "statusLabel",
          "type": "React.ReactNode",
          "description": "Optional badge label shown at the top of the card content, tinted to match `status`. Only renders when `status` is set."
        },
        {
          "id": "statusPulse",
          "name": "statusPulse",
          "type": "boolean",
          "description": "Subtly pulses the status stripe to signal in-progress / ongoing work. Respects `prefers-reduced-motion` (the stripe stays static). Only applies when `status` is set. Default: false."
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "No description in the package type declaration."
        }
      ]
    }
  ],
  "checkbox-group": [
    {
      "title": "Checkbox Option",
      "rows": [
        {
          "id": "value",
          "name": "value",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "label",
          "name": "label",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "hint",
          "name": "hint",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "disabled",
          "name": "disabled",
          "type": "boolean",
          "description": "No description in the package type declaration."
        }
      ]
    },
    {
      "title": "Checkbox Group",
      "rows": [
        {
          "id": "label",
          "name": "label",
          "type": "string",
          "description": "Group legend"
        },
        {
          "id": "hint",
          "name": "hint",
          "type": "string",
          "description": "Helper text"
        },
        {
          "id": "error",
          "name": "error",
          "type": "string",
          "description": "Error message"
        },
        {
          "id": "size",
          "name": "size",
          "type": "\"comfortable\" | \"default\" | \"compact\"",
          "description": "Size density. Inherits from parent `Fieldset` when omitted. Default: \"default\""
        },
        {
          "id": "required",
          "name": "required",
          "type": "boolean",
          "description": "No description in the package type declaration."
        },
        {
          "id": "disabled",
          "name": "disabled",
          "type": "boolean",
          "description": "No description in the package type declaration."
        },
        {
          "id": "inline",
          "name": "inline",
          "type": "boolean",
          "description": "Render checkboxes side by side. Default: false"
        },
        {
          "id": "name",
          "name": "name",
          "type": "string",
          "description": "Input name attribute shared by all checkboxes"
        },
        {
          "id": "options",
          "name": "options",
          "type": "CheckboxOption[]",
          "description": "Array of checkbox options"
        },
        {
          "id": "value",
          "name": "value",
          "type": "string[]",
          "description": "Controlled selected values"
        },
        {
          "id": "defaultValue",
          "name": "defaultValue",
          "type": "string[]",
          "description": "Default selected values (uncontrolled)"
        },
        {
          "id": "onChange",
          "name": "onChange",
          "type": "(value: string[]) => void",
          "description": "Called with the full updated array of selected values on change"
        },
        {
          "id": "id",
          "name": "id",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "className",
          "name": "className",
          "type": "string",
          "description": "No description in the package type declaration."
        }
      ]
    }
  ],
  "choice-group": [
    {
      "title": "Choice Group Section",
      "rows": [
        {
          "id": "label",
          "name": "label",
          "type": "string",
          "description": "Section heading displayed above the section's tiles"
        },
        {
          "id": "options",
          "name": "options",
          "type": "ChoiceOption[]",
          "description": "Options in this section"
        }
      ]
    },
    {
      "title": "Choice Option",
      "rows": [
        {
          "id": "value",
          "name": "value",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "label",
          "name": "label",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "subtext",
          "name": "subtext",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "icon",
          "name": "icon",
          "type": "string",
          "description": "Material Symbols icon name. Mutually exclusive with swatch — swatch takes precedence."
        },
        {
          "id": "swatch",
          "name": "swatch",
          "type": "string",
          "description": "CSS color value rendered as a filled circle swatch instead of an icon. Accepts any CSS color including custom properties, e.g. \"var(--semantic-color-action-background)\"."
        },
        {
          "id": "iconOnly",
          "name": "iconOnly",
          "type": "boolean",
          "description": "Visually hide this tile's label/subtext, showing only the icon. The label is still rendered for screen readers. Requires `icon` to be set. Default: false"
        },
        {
          "id": "disabled",
          "name": "disabled",
          "type": "boolean",
          "description": "No description in the package type declaration."
        }
      ]
    },
    {
      "title": "Choice Group",
      "rows": [
        {
          "id": "label",
          "name": "label",
          "type": "string",
          "description": "Group legend"
        },
        {
          "id": "hint",
          "name": "hint",
          "type": "string",
          "description": "Helper text — hidden when error or success is present"
        },
        {
          "id": "error",
          "name": "error",
          "type": "string",
          "description": "Error message"
        },
        {
          "id": "success",
          "name": "success",
          "type": "string",
          "description": "Success message — shown instead of hint when present, hidden if error is also present"
        },
        {
          "id": "size",
          "name": "size",
          "type": "\"compact\" | \"default\" | \"comfortable\"",
          "description": "Tile size density — affects only padding and child element sizes. Default: \"default\""
        },
        {
          "id": "columns",
          "name": "columns",
          "type": "number | Partial<Record<\"xs\" | \"sm\" | \"md\" | \"lg\" | \"xl\", number>>",
          "description": "Column count. Pass a number for a fixed count at all breakpoints, or a breakpoint object for responsive behaviour, e.g. `{ xs: 1, sm: 2, md: 3 }`. Omit (default) for automatic fill based on tile min-width."
        },
        {
          "id": "multiple",
          "name": "multiple",
          "type": "boolean",
          "description": "Allow multiple selections (checkbox semantics). When false, only one option may be selected at a time (radio semantics). Default: false"
        },
        {
          "id": "inlineIcon",
          "name": "inlineIcon",
          "type": "boolean",
          "description": "Place each tile's icon to the left of the label and subtext instead of above the content block. Has no effect on tiles with no icon. Default: false"
        },
        {
          "id": "hideIndicator",
          "name": "hideIndicator",
          "type": "boolean",
          "description": "Hide the radio/checkbox selection indicator from all tiles. Selection state is still communicated via border, background, and the accessible input. Useful for compact configuration controls. Default: false"
        },
        {
          "id": "iconOnly",
          "name": "iconOnly",
          "type": "boolean",
          "description": "Visually hide the label and subtext, showing only the icon. The label is still rendered in the DOM for screen readers. Requires each option to have both `icon` and `label`. Default: false"
        },
        {
          "id": "required",
          "name": "required",
          "type": "boolean",
          "description": "No description in the package type declaration."
        },
        {
          "id": "name",
          "name": "name",
          "type": "string",
          "description": "Input name attribute. Defaults to the group id."
        },
        {
          "id": "options",
          "name": "options",
          "type": "ChoiceOption[]",
          "description": "Flat list of options. Use sections instead for grouped options with headings."
        },
        {
          "id": "sections",
          "name": "sections",
          "type": "ChoiceGroupSection[]",
          "description": "Options divided into labeled sections with a divider between each group. When provided, options is ignored."
        },
        {
          "id": "value",
          "name": "value",
          "type": "string | string[] | null",
          "description": "Controlled value. String for single-select; string[] for multi-select. Pass undefined to use uncontrolled mode."
        },
        {
          "id": "defaultValue",
          "name": "defaultValue",
          "type": "string | string[] | null",
          "description": "Default value for uncontrolled mode. Default: null / []"
        },
        {
          "id": "onChange",
          "name": "onChange",
          "type": "(value: string | string[]) => void",
          "description": "Called with the selected value (string or string[]) on change"
        },
        {
          "id": "id",
          "name": "id",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "className",
          "name": "className",
          "type": "string",
          "description": "No description in the package type declaration."
        }
      ]
    }
  ],
  "circular-progress": [
    {
      "title": "Circular Progress",
      "rows": [
        {
          "id": "value",
          "name": "value",
          "type": "number",
          "description": "Current value. Combined with max to compute the filled arc length. Ignored when indeterminate is true. Default: 0"
        },
        {
          "id": "max",
          "name": "max",
          "type": "number",
          "description": "Maximum value. Default: 100"
        },
        {
          "id": "size",
          "name": "size",
          "type": "\"xs\" | \"sm\" | \"md\" | \"lg\" | \"xl\"",
          "description": "Circle diameter. xs renders the smallest ring (no inner content — children are placed inline after the ring instead). Default: \"md\""
        },
        {
          "id": "indeterminate",
          "name": "indeterminate",
          "type": "boolean",
          "description": "Shows a continuously rotating arc instead of a value-based fill. Removes aria-valuenow so assistive technology announces an indeterminate state. Default: false"
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "Content centered inside the ring for sm / md / lg sizes. For xs, children are rendered inline after the ring. Always pass aria-label on the root element for an accessible name since this content receives aria-hidden=\"true\"."
        },
        {
          "id": "className",
          "name": "className",
          "type": "string",
          "description": "Additional CSS class names applied to the root element."
        }
      ]
    }
  ],
  "code": [
    {
      "title": "Code",
      "rows": [
        {
          "id": "variant",
          "name": "variant",
          "type": "\"inline\" | \"block\"",
          "description": "Code presentation. Inline keeps minimal padding for prose; block renders a preformatted block. Default: \"inline\""
        },
        {
          "id": "wrapping",
          "name": "wrapping",
          "type": "boolean",
          "description": "Allow long inline snippets or block code to wrap. Default: false"
        },
        {
          "id": "copyCode",
          "name": "copyCode",
          "type": "boolean",
          "description": "Show a small tertiary copy button at the bottom-left of the code block. Default: false"
        },
        {
          "id": "copyText",
          "name": "copyText",
          "type": "string",
          "description": "Text copied to the clipboard. Defaults to the rendered text children."
        },
        {
          "id": "editable",
          "name": "editable",
          "type": "boolean",
          "description": "Render the block as an editable textarea initialized from children. Only meaningful in block mode. Default: false"
        },
        {
          "id": "onChangeValue",
          "name": "onChangeValue",
          "type": "(value: string) => void",
          "description": "Called with the current string value whenever the editable textarea changes."
        },
        {
          "id": "collapsible",
          "name": "collapsible",
          "type": "boolean",
          "description": "Cap a long read-only block to `collapsedLines` with a fade + Show more/less toggle (the toggle appears only when the content overflows). Block, non-editable only. Default: false"
        },
        {
          "id": "collapsedLines",
          "name": "collapsedLines",
          "type": "number",
          "description": "Approximate number of lines shown when collapsed. Default: 14"
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "No description in the package type declaration."
        }
      ]
    }
  ],
  "context-menu": [
    {
      "title": "Context Menu Item Entry",
      "rows": [
        {
          "id": "type",
          "name": "type",
          "type": "'item'",
          "description": "Default entry type — a clickable menu item."
        },
        {
          "id": "id",
          "name": "id",
          "type": "string",
          "description": "Unique identifier for this entry."
        },
        {
          "id": "label",
          "name": "label",
          "type": "string",
          "description": "Display label."
        },
        {
          "id": "icon",
          "name": "icon",
          "type": "string",
          "description": "Material Symbols icon name shown before the label."
        },
        {
          "id": "shortcut",
          "name": "shortcut",
          "type": "string",
          "description": "Keyboard shortcut hint shown after the label (e.g. \"⌦\", \"⌘Z\")."
        },
        {
          "id": "variant",
          "name": "variant",
          "type": "'default' | 'destructive'",
          "description": "Visual variant. `destructive` uses error colors to signal a dangerous action. Default: \"default\""
        },
        {
          "id": "active",
          "name": "active",
          "type": "boolean",
          "description": "Highlights this item as the currently active/selected option."
        },
        {
          "id": "disabled",
          "name": "disabled",
          "type": "boolean",
          "description": "Prevents interaction."
        },
        {
          "id": "onClick",
          "name": "onClick",
          "type": "() => void",
          "description": "Called when the item is clicked. The menu closes automatically after."
        }
      ]
    },
    {
      "title": "Context Menu Divider Entry",
      "rows": [
        {
          "id": "type",
          "name": "type",
          "type": "'divider'",
          "description": "No description in the package type declaration."
        },
        {
          "id": "id",
          "name": "id",
          "type": "string",
          "description": "No description in the package type declaration."
        }
      ]
    },
    {
      "title": "Context Menu Group Entry",
      "rows": [
        {
          "id": "type",
          "name": "type",
          "type": "'group'",
          "description": "No description in the package type declaration."
        },
        {
          "id": "id",
          "name": "id",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "label",
          "name": "label",
          "type": "string",
          "description": "Label shown as a non-interactive section heading."
        }
      ]
    },
    {
      "title": "Context Menu",
      "rows": [
        {
          "id": "open",
          "name": "open",
          "type": "boolean",
          "description": "Controls visibility. Default: false"
        },
        {
          "id": "x",
          "name": "x",
          "type": "number",
          "description": "Horizontal position in viewport pixels (typically event.clientX)."
        },
        {
          "id": "y",
          "name": "y",
          "type": "number",
          "description": "Vertical position in viewport pixels (typically event.clientY)."
        },
        {
          "id": "items",
          "name": "items",
          "type": "ContextMenuEntry[]",
          "description": "Menu entries — items, dividers, and group headings."
        },
        {
          "id": "onClose",
          "name": "onClose",
          "type": "() => void",
          "description": "Called when the menu should close (outside click or Escape key)."
        },
        {
          "id": "aria-label",
          "name": "aria-label",
          "type": "string",
          "description": "Accessible name for the menu. Default: \"Context menu\""
        }
      ]
    }
  ],
  "data-table": [
    {
      "title": "Data Table Column",
      "rows": [
        {
          "id": "key",
          "name": "key",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "label",
          "name": "label",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "type",
          "name": "type",
          "type": "\"text\" | \"number\" | \"currency\" | \"date\" | \"badge\" | \"avatar\" | \"link\" | \"actions\"",
          "description": "No description in the package type declaration."
        },
        {
          "id": "align",
          "name": "align",
          "type": "\"start\" | \"center\" | \"end\"",
          "description": "No description in the package type declaration."
        },
        {
          "id": "width",
          "name": "width",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "sortable",
          "name": "sortable",
          "type": "boolean",
          "description": "No description in the package type declaration."
        },
        {
          "id": "sortAccessor",
          "name": "sortAccessor",
          "type": "(row: Record<string, unknown>) => unknown",
          "description": "No description in the package type declaration."
        },
        {
          "id": "searchAccessor",
          "name": "searchAccessor",
          "type": "(row: Record<string, unknown>) => unknown",
          "description": "No description in the package type declaration."
        },
        {
          "id": "searchMatcher",
          "name": "searchMatcher",
          "type": "(row: Record<string, unknown>, query: string) => boolean",
          "description": "Custom matcher for built-in search. Return true when this row should match the normalized query."
        },
        {
          "id": "statusMap",
          "name": "statusMap",
          "type": "Record<string, \"neutral\" | \"info\" | \"success\" | \"warn\" | \"error\">",
          "description": "No description in the package type declaration."
        },
        {
          "id": "currencySymbol",
          "name": "currencySymbol",
          "type": "string",
          "description": "No description in the package type declaration."
        }
      ]
    },
    {
      "title": "Data Table Sort State",
      "rows": [
        {
          "id": "key",
          "name": "key",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "direction",
          "name": "direction",
          "type": "\"asc\" | \"desc\"",
          "description": "No description in the package type declaration."
        }
      ]
    },
    {
      "title": "Data Table Filter",
      "rows": [
        {
          "id": "key",
          "name": "key",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "label",
          "name": "label",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "type",
          "name": "type",
          "type": "\"single\" | \"multi\"",
          "description": "No description in the package type declaration."
        },
        {
          "id": "options",
          "name": "options",
          "type": "Array<{ value: string; label: string }>",
          "description": "No description in the package type declaration."
        }
      ]
    },
    {
      "title": "Data Table",
      "rows": [
        {
          "id": "columns",
          "name": "columns",
          "type": "DataTableColumn[]",
          "description": "No description in the package type declaration."
        },
        {
          "id": "rows",
          "name": "rows",
          "type": "Record<string, unknown>[]",
          "description": "No description in the package type declaration."
        },
        {
          "id": "size",
          "name": "size",
          "type": "\"comfortable\" | \"default\" | \"compact\"",
          "description": "Cell spacing density. Omit (default) to auto-select density based on the available container width."
        },
        {
          "id": "zebra",
          "name": "zebra",
          "type": "boolean",
          "description": "Alternate row shading. Default: false"
        },
        {
          "id": "scrollable",
          "name": "scrollable",
          "type": "boolean",
          "description": "Enable horizontal scroll on the table. Default: false"
        },
        {
          "id": "caption",
          "name": "caption",
          "type": "string",
          "description": "Accessible caption for the table"
        },
        {
          "id": "page",
          "name": "page",
          "type": "number",
          "description": "Controlled current page (1-based)"
        },
        {
          "id": "defaultPage",
          "name": "defaultPage",
          "type": "number",
          "description": "Uncontrolled initial page. Default: 1"
        },
        {
          "id": "pageSize",
          "name": "pageSize",
          "type": "number",
          "description": "Number of rows per page for built-in pagination"
        },
        {
          "id": "totalPages",
          "name": "totalPages",
          "type": "number",
          "description": "Total page count for server-side pagination"
        },
        {
          "id": "totalRows",
          "name": "totalRows",
          "type": "number",
          "description": "Total row count for server-side row counter"
        },
        {
          "id": "onPageChange",
          "name": "onPageChange",
          "type": "(page: number) => void",
          "description": "Called when the active page changes"
        },
        {
          "id": "sort",
          "name": "sort",
          "type": "DataTableSortState | null",
          "description": "Controlled sort state"
        },
        {
          "id": "defaultSort",
          "name": "defaultSort",
          "type": "DataTableSortState",
          "description": "Uncontrolled initial sort state"
        },
        {
          "id": "onSortChange",
          "name": "onSortChange",
          "type": "(sort: DataTableSortState | null) => void",
          "description": "Called when sort changes"
        },
        {
          "id": "filters",
          "name": "filters",
          "type": "DataTableFilter[]",
          "description": "No description in the package type declaration."
        },
        {
          "id": "filterValue",
          "name": "filterValue",
          "type": "Record<string, unknown>",
          "description": "No description in the package type declaration."
        },
        {
          "id": "defaultFilterValue",
          "name": "defaultFilterValue",
          "type": "Record<string, unknown>",
          "description": "No description in the package type declaration."
        },
        {
          "id": "onFilterChange",
          "name": "onFilterChange",
          "type": "(value: Record<string, unknown>) => void",
          "description": "No description in the package type declaration."
        },
        {
          "id": "searchValue",
          "name": "searchValue",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "defaultSearchValue",
          "name": "defaultSearchValue",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "onSearchChange",
          "name": "onSearchChange",
          "type": "(value: string) => void",
          "description": "No description in the package type declaration."
        },
        {
          "id": "searchColumn",
          "name": "searchColumn",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "defaultSearchColumn",
          "name": "defaultSearchColumn",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "onSearchColumnChange",
          "name": "onSearchColumnChange",
          "type": "(column: string) => void",
          "description": "No description in the package type declaration."
        },
        {
          "id": "searchableColumns",
          "name": "searchableColumns",
          "type": "Array<{ key: string; label: string; searchAccessor?: (row: Record<string, unknown>) => unknown; searchMatcher?: (row: Record<string, unknown>, query: string) => boolean }>",
          "description": "Searchable columns can provide a custom matcher for built-in search."
        },
        {
          "id": "selectable",
          "name": "selectable",
          "type": "boolean",
          "description": "Enable row selection. Default: false"
        },
        {
          "id": "selectedRowIds",
          "name": "selectedRowIds",
          "type": "(string | number)[]",
          "description": "No description in the package type declaration."
        },
        {
          "id": "defaultSelectedRowIds",
          "name": "defaultSelectedRowIds",
          "type": "(string | number)[]",
          "description": "No description in the package type declaration."
        },
        {
          "id": "onSelectedRowIdsChange",
          "name": "onSelectedRowIdsChange",
          "type": "(ids: string[]) => void",
          "description": "No description in the package type declaration."
        },
        {
          "id": "onDeleteSelected",
          "name": "onDeleteSelected",
          "type": "(rows: Record<string, unknown>[], ids: string[]) => void",
          "description": "No description in the package type declaration."
        },
        {
          "id": "getRowId",
          "name": "getRowId",
          "type": "(row: Record<string, unknown>, index: number) => string | number",
          "description": "No description in the package type declaration."
        },
        {
          "id": "emptyTitle",
          "name": "emptyTitle",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "emptyDescription",
          "name": "emptyDescription",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "emptyIcon",
          "name": "emptyIcon",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "notices",
          "name": "notices",
          "type": "Array<{ content: React.ReactNode; afterRow?: number }>",
          "description": "Custom full-width no-padding rows inserted into the table body. Each entry specifies `content` (ReactNode) and an optional `afterRow` index (0-based, default 0 = before all data rows). Multiple entries with the same `afterRow` stack in order."
        }
      ]
    }
  ],
  "definition-list": [
    {
      "title": "Definition List Item",
      "rows": [
        {
          "id": "id",
          "name": "id",
          "type": "React.Key",
          "description": "Stable key for this label/value pair. Falls back to label or index."
        },
        {
          "id": "label",
          "name": "label",
          "type": "React.ReactNode",
          "description": "Label rendered in the `<dt>`."
        },
        {
          "id": "value",
          "name": "value",
          "type": "React.ReactNode",
          "description": "Value rendered in the `<dd>`."
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "Alternate value content for JSX object-literal ergonomics."
        },
        {
          "id": "copyValue",
          "name": "copyValue",
          "type": "boolean",
          "description": "Enables or disables the copy button for this item. Defaults to the list-level copyValue prop."
        },
        {
          "id": "copyText",
          "name": "copyText",
          "type": "string",
          "description": "Exact text copied to the clipboard. Defaults to the rendered text value when it can be inferred."
        },
        {
          "id": "copyLabel",
          "name": "copyLabel",
          "type": "string",
          "description": "Accessible label for this item's copy button. Defaults to the list-level copyLabel."
        },
        {
          "id": "copiedLabel",
          "name": "copiedLabel",
          "type": "string",
          "description": "Accessible label shown after this item's value is copied. Defaults to the list-level copiedLabel."
        },
        {
          "id": "valueHeadingProps",
          "name": "valueHeadingProps",
          "type": "Omit<HeadingProps, \"children\" | \"className\">",
          "description": "Heading props for this item's value. Overrides the list-level valueHeadingProps."
        }
      ]
    },
    {
      "title": "Definition List",
      "rows": [
        {
          "id": "items",
          "name": "items",
          "type": "DefinitionListItem[]",
          "description": "Label/value pairs to render as `<dt>` and `<dd>` groups."
        },
        {
          "id": "direction",
          "name": "direction",
          "type": "DefinitionListDirection",
          "description": "Pair layout direction. Default: \"row\""
        },
        {
          "id": "size",
          "name": "size",
          "type": "DefinitionListSize",
          "description": "Spacing and body text size. Default: \"md\""
        },
        {
          "id": "labelWidth",
          "name": "labelWidth",
          "type": "DefinitionListLabelWidth",
          "description": "Row label sizing. \"auto\" lets each label hug content; \"fixed\" aligns values on a responsive label column. Only applies when direction=\"row\". Default: \"auto\""
        },
        {
          "id": "copyValue",
          "name": "copyValue",
          "type": "boolean",
          "description": "Show copy buttons for copyable text values. Can be overridden per item. Default: false"
        },
        {
          "id": "copyLabel",
          "name": "copyLabel",
          "type": "string",
          "description": "Accessible label for copy buttons. Default: \"Copy value\""
        },
        {
          "id": "copiedLabel",
          "name": "copiedLabel",
          "type": "string",
          "description": "Accessible label used after a copy succeeds. Default: \"Copied\""
        },
        {
          "id": "valueHeadingProps",
          "name": "valueHeadingProps",
          "type": "Omit<HeadingProps, \"children\" | \"className\">",
          "description": "Render values with Heading, including Heading type and size support. Can be overridden per item."
        }
      ]
    }
  ],
  "dialog": [
    {
      "title": "Dialog",
      "rows": [
        {
          "id": "open",
          "name": "open",
          "type": "boolean",
          "description": "Whether the dialog is visible. Default: false"
        },
        {
          "id": "onClose",
          "name": "onClose",
          "type": "() => void",
          "description": "Called when the user closes the dialog (Escape, close button, or backdrop click). Omit to hide the close button."
        },
        {
          "id": "title",
          "name": "title",
          "type": "string",
          "description": "Dialog title shown in the header"
        },
        {
          "id": "footer",
          "name": "footer",
          "type": "React.ReactNode",
          "description": "Footer content — wrapped in a right-aligned `ButtonContainer`"
        },
        {
          "id": "status",
          "name": "status",
          "type": "\"success\" | \"error\" | \"warn\" | \"info\" | \"neutral\"",
          "description": "Status variant — renders a full-bleed colored hero area at the top with a status icon. \"success\" | \"error\" | \"warn\" | \"info\" | \"neutral\""
        },
        {
          "id": "icon",
          "name": "icon",
          "type": "string",
          "description": "Override the icon shown in the hero area. Defaults to the status icon when `status` is set."
        },
        {
          "id": "size",
          "name": "size",
          "type": "\"sm\" | \"md\" | \"lg\" | \"xl\"",
          "description": "Dialog width. \"sm\" (440px) for short confirmations, \"md\" (560px, default) for standard content, \"lg\" (720px) and \"xl\" (920px) for wide, content-rich dialogs (e.g. multi-tab detail views). Every size stays capped at the viewport width. Default: \"md\""
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "No description in the package type declaration."
        }
      ]
    }
  ],
  "divider": [
    {
      "title": "Divider",
      "rows": [
        {
          "id": "orientation",
          "name": "orientation",
          "type": "Orientation | Partial<Record<Breakpoints, Orientation>>",
          "description": "Line orientation. Responsive object syntax supported. Default: \"horizontal\""
        },
        {
          "id": "variant",
          "name": "variant",
          "type": "\"subtle\" | \"strong\" | \"accent\"",
          "description": "Color tone. Default: \"subtle\""
        },
        {
          "id": "lineStyle",
          "name": "lineStyle",
          "type": "\"solid\" | \"dashed\" | \"dotted\"",
          "description": "Border pattern. Default: \"solid\""
        },
        {
          "id": "size",
          "name": "size",
          "type": "\"xs\" | \"sm\" | \"md\" | \"lg\"",
          "description": "Line thickness. Default: \"xs\""
        },
        {
          "id": "space",
          "name": "space",
          "type": "\"none\" | \"xs\" | \"sm\" | \"md\" | \"lg\" | \"xl\" | \"xxl\"",
          "description": "Block-axis margin (space above and below for horizontal, left/right for vertical). Default: \"sm\""
        },
        {
          "id": "decorative",
          "name": "decorative",
          "type": "boolean",
          "description": "Whether this divider is purely decorative (no semantic role). Default: true"
        }
      ]
    }
  ],
  "empty-state": [
    {
      "title": "Empty State",
      "rows": [
        {
          "id": "scale",
          "name": "scale",
          "type": "\"page\" | \"section\" | \"card\"",
          "description": "Visual scale — matches the container this empty state lives in. Default: \"section\" page = largest (h1), section = medium (h2), card = compact (h3)"
        },
        {
          "id": "icon",
          "name": "icon",
          "type": "string",
          "description": "Material Symbols icon name shown above the title. Default: \"inbox\""
        },
        {
          "id": "title",
          "name": "title",
          "type": "string",
          "description": "Primary message"
        },
        {
          "id": "description",
          "name": "description",
          "type": "string",
          "description": "Supporting description text"
        },
        {
          "id": "action",
          "name": "action",
          "type": "React.ReactNode",
          "description": "Action element (e.g. a Button)"
        }
      ]
    }
  ],
  "field-row": [
    {
      "title": "Field Row",
      "rows": [
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "Lays out multiple field components side by side in a single row."
        }
      ]
    }
  ],
  "fieldset": [
    {
      "title": "Fieldset",
      "rows": [
        {
          "id": "legend",
          "name": "legend",
          "type": "string",
          "description": "`<legend>` text for the field group"
        },
        {
          "id": "size",
          "name": "size",
          "type": "\"comfortable\" | \"default\" | \"compact\"",
          "description": "Size density applied to all child fields via context. Individual fields can override this."
        },
        {
          "id": "labelPosition",
          "name": "labelPosition",
          "type": "\"above\" | \"before\"",
          "description": "Label position applied to all child fields via context. Individual fields can override this."
        },
        {
          "id": "markRequired",
          "name": "markRequired",
          "type": "boolean",
          "description": "Show a \"* Required field\" note below the legend. Only shown for \"default\" and \"compact\" sizes (comfortable fields show inline badges). Default: false"
        },
        {
          "id": "surface",
          "name": "surface",
          "type": "boolean",
          "description": "Add a subtle surface background to the fieldset. Default: false"
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "No description in the package type declaration."
        }
      ]
    }
  ],
  "figure": [
    {
      "title": "Figure",
      "rows": [
        {
          "id": "src",
          "name": "src",
          "type": "string",
          "description": "Image source URL"
        },
        {
          "id": "alt",
          "name": "alt",
          "type": "string",
          "description": "Image alt text. Pass \"\" for decorative images."
        },
        {
          "id": "caption",
          "name": "caption",
          "type": "React.ReactNode",
          "description": "Caption text or React node rendered as `<figcaption>`"
        },
        {
          "id": "captionSrOnly",
          "name": "captionSrOnly",
          "type": "boolean",
          "description": "Render caption visually hidden (screen-reader only). Default: false"
        },
        {
          "id": "captionPosition",
          "name": "captionPosition",
          "type": "\"start\" | \"center\"",
          "description": "Caption alignment. Default: \"start\""
        },
        {
          "id": "radius",
          "name": "radius",
          "type": "\"none\" | \"sm\" | \"md\" | \"lg\"",
          "description": "Border radius on the image. Default (no prop) is square, same as \"none\"."
        },
        {
          "id": "size",
          "name": "size",
          "type": "\"3xs\" | \"2xs\" | \"xs\" | \"sm\" | \"md\" | \"lg\" | \"xl\" | \"xxl\"",
          "description": "Constrain figure width."
        },
        {
          "id": "align",
          "name": "align",
          "type": "\"none\" | \"start\" | \"center\" | \"end\"",
          "description": "Horizontal alignment of the figure. Default: \"none\" (normal flow)."
        },
        {
          "id": "aspectRatio",
          "name": "aspectRatio",
          "type": "\"16:9\" | \"4:3\" | \"3:2\" | \"1:1\" | \"2:3\" | \"3:4\" | \"9:16\" | \"21:9\"",
          "description": "Fix the image to a set aspect ratio, cropping to fill via `object-fit: cover`. Omit for the image's natural ratio."
        },
        {
          "id": "crop",
          "name": "crop",
          "type": "| \"center\" | \"top\" | \"bottom\" | \"left\" | \"right\" | \"top-left\" | \"top-right\" | \"bottom-left\" | \"bottom-right\"",
          "description": "Crop focal point used when the image is cropped (i.e. when `aspectRatio` or a fixed height applies). Maps to `object-position`. Default: \"center\""
        },
        {
          "id": "cropRect",
          "name": "cropRect",
          "type": "{ x: number; y: number; width: number; height: number }",
          "description": "Freeform crop: a sub-rectangle of the image to show, expressed as fractions (0–1) of the natural image — `{ x, y, width, height }` where x/y is the top-left corner. Applied non-destructively (CSS only); the image is never modified. Takes precedence over `aspectRatio` / `crop` when set."
        },
        {
          "id": "marginTop",
          "name": "marginTop",
          "type": "\"sm\" | \"md\" | \"lg\"",
          "description": "Top margin."
        },
        {
          "id": "marginBottom",
          "name": "marginBottom",
          "type": "\"sm\" | \"md\" | \"lg\"",
          "description": "Bottom margin."
        },
        {
          "id": "bleed",
          "name": "bleed",
          "type": "boolean | SpacingToken",
          "description": "Pull the figure outside its container padding using `Bleed`. Pass `true` for symmetric bleed or a numeric spacing token for inline-only."
        },
        {
          "id": "placeholder",
          "name": "placeholder",
          "type": "boolean",
          "description": "Show a tokenized placeholder pattern when `src` is missing or fails to load (e.g. a deleted image). Default: true. Set false to render the bare `<img>`."
        },
        {
          "id": "placeholderIcon",
          "name": "placeholderIcon",
          "type": "string",
          "description": "Material Symbols icon shown in the placeholder. Default: \"image\""
        },
        {
          "id": "className",
          "name": "className",
          "type": "string",
          "description": "Extra class names on the `<figure>` element"
        },
        {
          "id": "imgClassName",
          "name": "imgClassName",
          "type": "string",
          "description": "Extra class names on the `<img>` element"
        },
        {
          "id": "imgStyle",
          "name": "imgStyle",
          "type": "React.CSSProperties",
          "description": "Inline styles for the `<img>` element"
        }
      ]
    }
  ],
  "grid": [
    {
      "title": "Grid",
      "rows": [
        {
          "id": "columns",
          "name": "columns",
          "type": "number | Partial<Record<Breakpoints, number>>",
          "description": "Number of columns. Pass a number for a fixed count, or a responsive object."
        },
        {
          "id": "gap",
          "name": "gap",
          "type": "GapKey",
          "description": "Gap applied to both row and column. Semantic token (\"sm\"–\"xxl\") or numeric spacing value."
        },
        {
          "id": "rowGap",
          "name": "rowGap",
          "type": "GapKey",
          "description": "Row gap override. Falls back to `gap`."
        },
        {
          "id": "columnGap",
          "name": "columnGap",
          "type": "GapKey",
          "description": "Column gap override. Falls back to `gap`."
        },
        {
          "id": "layout",
          "name": "layout",
          "type": "\"default\" | \"bento\"",
          "description": "Grid layout preset. Default: \"default\""
        },
        {
          "id": "autoRows",
          "name": "autoRows",
          "type": "string",
          "description": "CSS value for `grid-auto-rows`"
        },
        {
          "id": "alignItems",
          "name": "alignItems",
          "type": "\"start\" | \"center\" | \"end\" | \"stretch\"",
          "description": "Cross-axis (vertical) alignment of items within their row. Omit to inherit the grid default (\"stretch\" = equal-height items filling the row height)."
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "No description in the package type declaration."
        }
      ]
    },
    {
      "title": "Grid Item",
      "rows": [
        {
          "id": "span",
          "name": "span",
          "type": "ColSpan | Partial<Record<Breakpoints, ColSpan>>",
          "description": "Column span. Pass a number, \"full\", or a responsive object."
        },
        {
          "id": "rowSpan",
          "name": "rowSpan",
          "type": "number | Partial<Record<Breakpoints, number>>",
          "description": "Row span. Pass a number or a responsive object."
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "No description in the package type declaration."
        }
      ]
    }
  ],
  "heading": [
    {
      "title": "Heading",
      "rows": [
        {
          "id": "as",
          "name": "as",
          "type": "\"h1\" | \"h2\" | \"h3\" | \"h4\" | \"h5\" | \"h6\" | \"p\" | \"span\"",
          "description": "HTML heading level. Default: \"h2\""
        },
        {
          "id": "type",
          "name": "type",
          "type": "\"heading\" | \"display\"",
          "description": "Typography type — drives the available size scale. \"heading\" uses the text hierarchy scale; \"display\" uses the larger editorial scale. Default: \"heading\""
        },
        {
          "id": "size",
          "name": "size",
          "type": "HeadingSize | DisplaySize | Partial<Record<Breakpoints, HeadingSize | DisplaySize>>",
          "description": "Size within the active type scale. Responsive object syntax supported. Heading sizes: xs | sm | md | lg | xl | xxl Display sizes: sm | md | lg | xl | xxl | jumbo | xJumbo"
        },
        {
          "id": "color",
          "name": "color",
          "type": "\"default\" | \"muted\" | \"accent\"",
          "description": "Text colour. Default: \"default\""
        },
        {
          "id": "margin",
          "name": "margin",
          "type": "\"sm\" | \"md\" | \"lg\"",
          "description": "Add bottom margin. Useful when followed by body text."
        },
        {
          "id": "textWrap",
          "name": "textWrap",
          "type": "\"balance\"",
          "description": "Apply text-wrap. \"balance\" distributes line lengths evenly — best for short headings."
        },
        {
          "id": "align",
          "name": "align",
          "type": "\"left\" | \"center\" | \"right\" | \"start\" | \"end\"",
          "description": "Horizontal text alignment. \"start\"/\"end\" are logical aliases for LTR/RTL-safe alignment."
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "No description in the package type declaration."
        }
      ]
    },
    {
      "title": "Heading Mark",
      "rows": [
        {
          "id": "variant",
          "name": "variant",
          "type": "\"highlight\" | \"underline\"",
          "description": "Visual decoration style. Default: \"highlight\""
        },
        {
          "id": "underlineStyle",
          "name": "underlineStyle",
          "type": "\"swoop\" | \"wave\" | \"sketch\"",
          "description": "Underline style (only applies when variant=\"underline\"). Default: \"swoop\""
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "No description in the package type declaration."
        }
      ]
    }
  ],
  "icon": [
    {
      "title": "Icon",
      "rows": [
        {
          "id": "name",
          "name": "name",
          "type": "string",
          "description": "Material Symbols name, or a registered custom icon as `custom:<name>`."
        },
        {
          "id": "size",
          "name": "size",
          "type": "\"xs\" | \"sm\" | \"md\" | \"lg\" | \"xl\" | \"jumbo\" | \"xJumbo\"",
          "description": "Icon size. \"md\" (default) inherits font-size from the parent. \"xs\"=16px, \"sm\"=20px, \"md\"=inherit, \"lg\"=32px, \"xl\"=40px, \"jumbo\"=64px, \"xJumbo\"=96px"
        },
        {
          "id": "color",
          "name": "color",
          "type": "\"muted\" | \"accent\" | \"inverse\" | \"success\" | \"error\" | \"warn\" | \"info\"",
          "description": "Icon color. Omit to inherit the current text color. Status values map to semantic status background tokens."
        },
        {
          "id": "weight",
          "name": "weight",
          "type": "number",
          "description": "Variable font weight axis (100–700). Default is set via CSS token `--a1-icon-weight`."
        },
        {
          "id": "grade",
          "name": "grade",
          "type": "number",
          "description": "Grade axis — adjusts visual weight without changing size (-25–200). Default is set via CSS token `--a1-icon-grade`."
        },
        {
          "id": "opticalSize",
          "name": "opticalSize",
          "type": "20 | 24 | 40 | 48",
          "description": "Optical size axis — adjusts detail level (20, 24, 40, 48). Default is set via CSS token `--a1-icon-opsz`."
        },
        {
          "id": "fill",
          "name": "fill",
          "type": "boolean",
          "description": "Fill the icon shape. Default: false"
        }
      ]
    },
    {
      "title": "Custom Icon Font Registration",
      "rows": [
        {
          "id": "fontUrl",
          "name": "fontUrl",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "mappings",
          "name": "mappings",
          "type": "Record<string, number>",
          "description": "No description in the package type declaration."
        },
        {
          "id": "fontFamily",
          "name": "fontFamily",
          "type": "string",
          "description": "No description in the package type declaration."
        }
      ]
    }
  ],
  "icon-button": [
    {
      "title": "Icon Button",
      "rows": [
        {
          "id": "as",
          "name": "as",
          "type": "React.ElementType",
          "description": "Element or component to render as. Use `as=\"a\"` (with `href`) to render the icon button as a navigation link while keeping its visual styling. Default: \"button\""
        },
        {
          "id": "icon",
          "name": "icon",
          "type": "string",
          "description": "Material Symbols icon name"
        },
        {
          "id": "label",
          "name": "label",
          "type": "string",
          "description": "Accessible label (used as `aria-label` and visible tooltip)"
        },
        {
          "id": "variant",
          "name": "variant",
          "type": "\"tertiary\" | \"secondary\" | \"destructive\" | \"success\"",
          "description": "Visual style. Default: \"tertiary\""
        },
        {
          "id": "size",
          "name": "size",
          "type": "\"sm\" | \"md\" | \"lg\"",
          "description": "Button size. \"sm\" is a 24×24px target (the WCAG 2.2 AA minimum) for dense toolbars; \"lg\" matches Button's large touch target (3.5rem) and icon size. Default: \"md\""
        },
        {
          "id": "href",
          "name": "href",
          "type": "string",
          "description": "Link target when rendered with `as=\"a\"`."
        },
        {
          "id": "disabled",
          "name": "disabled",
          "type": "boolean",
          "description": "No description in the package type declaration."
        },
        {
          "id": "onClick",
          "name": "onClick",
          "type": "React.MouseEventHandler<HTMLButtonElement>",
          "description": "No description in the package type declaration."
        }
      ]
    }
  ],
  "inline-editable": [
    {
      "title": "Inline Editable",
      "rows": [
        {
          "id": "value",
          "name": "value",
          "type": "string",
          "description": "Current text value (controlled)."
        },
        {
          "id": "onChange",
          "name": "onChange",
          "type": "(value: string) => void",
          "description": "Called with the new value as the user types."
        },
        {
          "id": "multiline",
          "name": "multiline",
          "type": "boolean",
          "description": "Edit in a `<textarea>` instead of a single-line `<input>`. Default: false"
        },
        {
          "id": "disabled",
          "name": "disabled",
          "type": "boolean",
          "description": "Prevents entering edit mode and removes the interactive affordances. Default: false"
        },
        {
          "id": "seamless",
          "name": "seamless",
          "type": "boolean",
          "description": "Edit the text in place via `contentEditable` instead of a boxed field. The element inherits all typography (font, size, colour, line-height, alignment, wrapping) from the surrounding component, so editing never resizes or restyles the text — ideal for making any heading, paragraph, label, or button text live-editable. Only a focus ring is added. Default: false"
        },
        {
          "id": "placeholder",
          "name": "placeholder",
          "type": "string",
          "description": "Text shown in the display state when there is no value and no `children`."
        },
        {
          "id": "className",
          "name": "className",
          "type": "string",
          "description": "Class applied to the wrapper in the display state."
        },
        {
          "id": "inputClassName",
          "name": "inputClassName",
          "type": "string",
          "description": "Class applied to the `<input>` / `<textarea>` in the edit state."
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "Display content rendered in the read state; falls back to `placeholder` when omitted."
        }
      ]
    }
  ],
  "inset": [
    {
      "title": "Inset",
      "rows": [
        {
          "id": "as",
          "name": "as",
          "type": "React.ElementType",
          "description": "Underlying element. Default: \"div\""
        },
        {
          "id": "space",
          "name": "space",
          "type": "SpacingToken",
          "description": "Base padding applied to all axes when no axis-specific value is set. Default: 16"
        },
        {
          "id": "block",
          "name": "block",
          "type": "SpacingToken",
          "description": "Block-axis (top/bottom) padding override. Falls back to `space`."
        },
        {
          "id": "inline",
          "name": "inline",
          "type": "SpacingToken",
          "description": "Inline-axis (left/right) padding override. Falls back to `space`."
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "No description in the package type declaration."
        }
      ]
    }
  ],
  "link": [
    {
      "title": "Link",
      "rows": [
        {
          "id": "size",
          "name": "size",
          "type": "\"xs\" | \"sm\" | \"md\" | \"lg\" | \"xl\"",
          "description": "Font size. Inherits from context when omitted."
        },
        {
          "id": "weight",
          "name": "weight",
          "type": "\"normal\" | \"medium\" | \"semibold\" | \"bold\"",
          "description": "Font weight override."
        },
        {
          "id": "icon",
          "name": "icon",
          "type": "string",
          "description": "Material Symbols icon name to show alongside the link text."
        },
        {
          "id": "iconPosition",
          "name": "iconPosition",
          "type": "\"start\" | \"end\"",
          "description": "Position of the icon relative to the text. Default: \"start\""
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "No description in the package type declaration."
        }
      ]
    }
  ],
  "list": [
    {
      "title": "List",
      "rows": [
        {
          "id": "as",
          "name": "as",
          "type": "\"ul\" | \"ol\"",
          "description": "Underlying element — \"ol\" switches to ordered variant automatically. Default: \"ul\""
        },
        {
          "id": "size",
          "name": "size",
          "type": "ListSize | Partial<Record<Breakpoints, ListSize>>",
          "description": "Font size. Responsive object syntax supported. Default: \"md\""
        },
        {
          "id": "color",
          "name": "color",
          "type": "\"default\" | \"muted\"",
          "description": "Text colour. Default: \"default\""
        },
        {
          "id": "icon",
          "name": "icon",
          "type": "string | null",
          "description": "Material Symbols icon name applied to all list items. Setting `icon` automatically switches `variant` to \"icon\"."
        },
        {
          "id": "variant",
          "name": "variant",
          "type": "\"unordered\" | \"ordered\" | \"icon\" | \"divider\"",
          "description": "List style. Auto-detected from `as` and `icon` when not set. \"divider\" renders items separated by horizontal rules."
        },
        {
          "id": "marginBottom",
          "name": "marginBottom",
          "type": "\"sm\" | \"md\" | \"lg\"",
          "description": "Bottom margin."
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "No description in the package type declaration."
        }
      ]
    },
    {
      "title": "List Item",
      "rows": [
        {
          "id": "icon",
          "name": "icon",
          "type": "string | null",
          "description": "Per-item icon override. Pass `null` to suppress the list-level icon for this item. Omit to inherit from the parent `List`."
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "No description in the package type declaration."
        }
      ]
    }
  ],
  "menu": [
    {
      "title": "Menu",
      "rows": [
        {
          "id": "open",
          "name": "open",
          "type": "boolean",
          "description": "Whether the menu is open"
        },
        {
          "id": "onClose",
          "name": "onClose",
          "type": "() => void",
          "description": "Called when the menu should close"
        },
        {
          "id": "anchorRef",
          "name": "anchorRef",
          "type": "React.RefObject<HTMLElement>",
          "description": "Ref to the trigger element — used to position the menu below it"
        },
        {
          "id": "aria-label",
          "name": "aria-label",
          "type": "string",
          "description": "Accessible label for the menu `dialog` element"
        },
        {
          "id": "className",
          "name": "className",
          "type": "string",
          "description": "Additional CSS class names for the menu dialog"
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "No description in the package type declaration."
        }
      ]
    },
    {
      "title": "Menu Section",
      "rows": [
        {
          "id": "label",
          "name": "label",
          "type": "string",
          "description": "Optional section label shown above the items"
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "No description in the package type declaration."
        }
      ]
    },
    {
      "title": "Menu Item",
      "rows": [
        {
          "id": "icon",
          "name": "icon",
          "type": "string",
          "description": "Material Symbols icon name shown before the label"
        },
        {
          "id": "shortcut",
          "name": "shortcut",
          "type": "string",
          "description": "Keyboard shortcut hint displayed at the trailing end"
        },
        {
          "id": "variant",
          "name": "variant",
          "type": "\"default\" | \"destructive\"",
          "description": "Visual style. Default: \"default\""
        },
        {
          "id": "active",
          "name": "active",
          "type": "boolean",
          "description": "Marks this item as the current page. Adds a left-border indicator and aria-current=\"page\"."
        },
        {
          "id": "disabled",
          "name": "disabled",
          "type": "boolean",
          "description": "No description in the package type declaration."
        },
        {
          "id": "href",
          "name": "href",
          "type": "string",
          "description": "Renders as an anchor `<a>` when provided"
        },
        {
          "id": "onClick",
          "name": "onClick",
          "type": "React.MouseEventHandler",
          "description": "No description in the package type declaration."
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "No description in the package type declaration."
        }
      ]
    }
  ],
  "node": [
    {
      "title": "Node",
      "rows": [
        {
          "id": "id",
          "name": "id",
          "type": "string",
          "description": "Unique identifier — required when used inside `<Canvas>` so edges can reference it. Optional when used standalone."
        },
        {
          "id": "x",
          "name": "x",
          "type": "number",
          "description": "Center X position in canvas space (pixels) — used by Canvas for positioning."
        },
        {
          "id": "y",
          "name": "y",
          "type": "number",
          "description": "Center Y position in canvas space (pixels) — used by Canvas for positioning."
        },
        {
          "id": "label",
          "name": "label",
          "type": "string",
          "description": "Primary label displayed inside the node"
        },
        {
          "id": "sublabel",
          "name": "sublabel",
          "type": "string",
          "description": "Optional secondary label shown below the main label"
        },
        {
          "id": "title",
          "name": "title",
          "type": "string",
          "description": "Native tooltip shown on hover — use for full token names or supplementary context"
        },
        {
          "id": "shape",
          "name": "shape",
          "type": "CanvasNodeShape",
          "description": "Node shape. `circle` (default) and `square` / `squircle` are square. `rectangle` is wider than it is tall."
        },
        {
          "id": "color",
          "name": "color",
          "type": "CanvasNodeColor",
          "description": "Color variant (default `\"neutral\"`)"
        },
        {
          "id": "size",
          "name": "size",
          "type": "CanvasNodeSize",
          "description": "T-shirt size (default `\"md\"`). Scales both the node dimensions and the label font size. - `xs` — 40px / 80×36px rect - `sm` — 60px / 96×44px rect - `md` — 80px / 128×56px rect (default) - `lg` — 120px / 160×72px rect - `xl` — 160px / 200×88px rect"
        },
        {
          "id": "subtle",
          "name": "subtle",
          "type": "boolean",
          "description": "When true, uses a tinted surface instead of the full status background (default `false`)"
        },
        {
          "id": "backgroundColor",
          "name": "backgroundColor",
          "type": "string",
          "description": "Custom background color for the node (any valid CSS color: hex, rgb, hsl, `var(--token)`). When set, overrides the `color` / `subtle` token-based background and border color. Use `foregroundColor` alongside it if the default text color doesn't have enough contrast."
        },
        {
          "id": "foregroundColor",
          "name": "foregroundColor",
          "type": "string",
          "description": "Custom text (foreground) color. Only meaningful when `backgroundColor` is also set. Accepts any valid CSS color value."
        },
        {
          "id": "anchorSnap",
          "name": "anchorSnap",
          "type": "CanvasNodeAnchorSnap",
          "description": "Constrains where connectors may exit/enter this node. Overrides the Canvas-level `defaultAnchorSnap` when set. - `'cardinal'` — only N, E, S, W (90° increments) - `'octagonal'` — N, NE, E, SE, S, SW, W, NW (45° increments) - `undefined` — inherits Canvas `defaultAnchorSnap` or uses free angle (default) Does not affect `edgeStyle=\"elbow\"` edges, which always use cardinal exits."
        }
      ]
    }
  ],
  "notification": [
    {
      "title": "Notification",
      "rows": [
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "Element the badge is anchored to"
        },
        {
          "id": "count",
          "name": "count",
          "type": "number",
          "description": "Numeric count displayed in the badge"
        },
        {
          "id": "label",
          "name": "label",
          "type": "string",
          "description": "Short text label — used when count is not set"
        },
        {
          "id": "dot",
          "name": "dot",
          "type": "boolean",
          "description": "Show a dot with no content. Default: false"
        },
        {
          "id": "status",
          "name": "status",
          "type": "\"neutral\" | \"error\" | \"success\" | \"warn\" | \"info\"",
          "description": "Visual status colour. Default: \"neutral\" neutral | error | success | warn | info"
        },
        {
          "id": "position",
          "name": "position",
          "type": "\"top-right\" | \"top-left\" | \"bottom-right\" | \"bottom-left\"",
          "description": "Badge anchor position. Default: \"top-right\""
        },
        {
          "id": "max",
          "name": "max",
          "type": "number",
          "description": "Count above this value shows as {max}+. Default: 99"
        }
      ]
    }
  ],
  "number-field": [
    {
      "title": "Number Field",
      "rows": [
        {
          "id": "prefix",
          "name": "prefix",
          "type": "string",
          "description": "Non-editable prefix rendered before the value at full input size and color (e.g. \"$\")."
        },
        {
          "id": "unit",
          "name": "unit",
          "type": "string",
          "description": "Non-editable unit label rendered after the value at smaller, muted size (e.g. \"lbs\", \"km\", \"ft\")."
        }
      ]
    }
  ],
  "page-layout": [
    {
      "title": "Page Layout",
      "rows": [
        {
          "id": "header",
          "name": "header",
          "type": "React.ReactNode",
          "description": "Top header slot — rendered in a `<header>` landmark"
        },
        {
          "id": "footer",
          "name": "footer",
          "type": "React.ReactNode",
          "description": "Bottom footer slot — rendered in a `<footer>` landmark"
        },
        {
          "id": "sidebar",
          "name": "sidebar",
          "type": "React.ReactNode",
          "description": "Side navigation panel — rendered in an `<aside>` landmark"
        },
        {
          "id": "sidebarPlacement",
          "name": "sidebarPlacement",
          "type": "\"start\" | \"end\"",
          "description": "Which side the sidebar occupies. Default: \"start\""
        },
        {
          "id": "aside",
          "name": "aside",
          "type": "React.ReactNode",
          "description": "Supplemental content panel (e.g. a table of contents)"
        },
        {
          "id": "asidePlacement",
          "name": "asidePlacement",
          "type": "\"start\" | \"end\"",
          "description": "Which side the aside occupies. Default: \"end\""
        },
        {
          "id": "stickyHeader",
          "name": "stickyHeader",
          "type": "boolean",
          "description": "Keep the header fixed at the top while content scrolls. Default: false"
        },
        {
          "id": "viewportHeight",
          "name": "viewportHeight",
          "type": "boolean",
          "description": "Constrain the layout to 100vh. Default: false"
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "Main content"
        }
      ]
    }
  ],
  "page-nav": [
    {
      "title": "Page Nav Section",
      "rows": [
        {
          "id": "id",
          "name": "id",
          "type": "string",
          "description": "Unique ID that matches the `id` on the corresponding heading/section element"
        },
        {
          "id": "label",
          "name": "label",
          "type": "string",
          "description": "Label shown in the nav"
        },
        {
          "id": "level",
          "name": "level",
          "type": "1 | 2",
          "description": "Heading nesting level for indentation. Default: 1"
        }
      ]
    },
    {
      "title": "Page Nav",
      "rows": [
        {
          "id": "sections",
          "name": "sections",
          "type": "PageNavSection[]",
          "description": "List of page sections to link to"
        },
        {
          "id": "label",
          "name": "label",
          "type": "string",
          "description": "Accessible label for the `<nav>` and the visible heading. Default: \"On this page\""
        }
      ]
    }
  ],
  "pagination": [
    {
      "title": "Pagination",
      "rows": [
        {
          "id": "page",
          "name": "page",
          "type": "number",
          "description": "Current page number (1-based)"
        },
        {
          "id": "totalPages",
          "name": "totalPages",
          "type": "number",
          "description": "Total number of pages"
        },
        {
          "id": "onChange",
          "name": "onChange",
          "type": "(page: number) => void",
          "description": "Called with the new page number when a page button is clicked"
        },
        {
          "id": "siblings",
          "name": "siblings",
          "type": "number",
          "description": "How many page numbers to show on each side of the current page. Default: 1"
        },
        {
          "id": "size",
          "name": "size",
          "type": "\"sm\" | \"md\" | \"lg\"",
          "description": "Size of the pagination buttons. Default: \"md\""
        }
      ]
    }
  ],
  "paragraph": [
    {
      "title": "Paragraph",
      "rows": [
        {
          "id": "as",
          "name": "as",
          "type": "React.ElementType",
          "description": "Underlying element. Default: \"p\""
        },
        {
          "id": "size",
          "name": "size",
          "type": "ParagraphSize | Partial<Record<Breakpoints, ParagraphSize>>",
          "description": "Font size. Responsive object syntax supported. Default: \"md\""
        },
        {
          "id": "color",
          "name": "color",
          "type": "\"default\" | \"muted\"",
          "description": "Text colour. Default: \"default\""
        },
        {
          "id": "textWrap",
          "name": "textWrap",
          "type": "\"balance\"",
          "description": "Apply text-wrap. \"balance\" distributes line lengths evenly — use for short intro copy."
        },
        {
          "id": "align",
          "name": "align",
          "type": "\"left\" | \"center\" | \"right\" | \"start\" | \"end\"",
          "description": "Horizontal text alignment. \"start\"/\"end\" are logical aliases for LTR/RTL-safe alignment."
        },
        {
          "id": "weight",
          "name": "weight",
          "type": "\"regular\" | \"medium\" | \"semibold\" | \"bold\"",
          "description": "Font weight. Omit to inherit the body default."
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "No description in the package type declaration."
        }
      ]
    }
  ],
  "radio-group": [
    {
      "title": "Radio Option",
      "rows": [
        {
          "id": "value",
          "name": "value",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "label",
          "name": "label",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "hint",
          "name": "hint",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "disabled",
          "name": "disabled",
          "type": "boolean",
          "description": "No description in the package type declaration."
        }
      ]
    },
    {
      "title": "Radio Group",
      "rows": [
        {
          "id": "label",
          "name": "label",
          "type": "string",
          "description": "Group legend"
        },
        {
          "id": "hint",
          "name": "hint",
          "type": "string",
          "description": "Helper text"
        },
        {
          "id": "error",
          "name": "error",
          "type": "string",
          "description": "Error message"
        },
        {
          "id": "size",
          "name": "size",
          "type": "\"comfortable\" | \"default\" | \"compact\"",
          "description": "Size density. Inherits from parent `Fieldset` when omitted. Default: \"default\""
        },
        {
          "id": "required",
          "name": "required",
          "type": "boolean",
          "description": "No description in the package type declaration."
        },
        {
          "id": "disabled",
          "name": "disabled",
          "type": "boolean",
          "description": "No description in the package type declaration."
        },
        {
          "id": "inline",
          "name": "inline",
          "type": "boolean",
          "description": "Render radios side by side. Default: false"
        },
        {
          "id": "name",
          "name": "name",
          "type": "string",
          "description": "Input name attribute shared by all radios"
        },
        {
          "id": "options",
          "name": "options",
          "type": "RadioOption[]",
          "description": "Array of radio options"
        },
        {
          "id": "value",
          "name": "value",
          "type": "string | null",
          "description": "Controlled selected value"
        },
        {
          "id": "defaultValue",
          "name": "defaultValue",
          "type": "string | null",
          "description": "Default selected value (uncontrolled). Default: null"
        },
        {
          "id": "onChange",
          "name": "onChange",
          "type": "(value: string) => void",
          "description": "Called with the selected value string on change"
        },
        {
          "id": "id",
          "name": "id",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "className",
          "name": "className",
          "type": "string",
          "description": "No description in the package type declaration."
        }
      ]
    }
  ],
  "search-field": [
    {
      "title": "Search Field",
      "rows": [
        {
          "id": "onChange",
          "name": "onChange",
          "type": "React.ChangeEventHandler<HTMLInputElement>",
          "description": "Called on every keystroke (native change event)."
        },
        {
          "id": "onClear",
          "name": "onClear",
          "type": "() => void",
          "description": "Called after the clear button empties the field."
        },
        {
          "id": "onSearch",
          "name": "onSearch",
          "type": "(value: string) => void",
          "description": "Called with the current value when Enter is pressed."
        },
        {
          "id": "clearLabel",
          "name": "clearLabel",
          "type": "string",
          "description": "Accessible label for the clear button. Default: the `field.clearSearch` label (\"Clear search\")."
        }
      ]
    }
  ],
  "section": [
    {
      "title": "Section",
      "rows": [
        {
          "id": "as",
          "name": "as",
          "type": "React.ElementType",
          "description": "Underlying element. Default: \"section\""
        },
        {
          "id": "padding",
          "name": "padding",
          "type": "ResponsivePadding",
          "description": "Block padding scale. Responsive object syntax supported. Default: \"md\""
        },
        {
          "id": "surface",
          "name": "surface",
          "type": "\"page\" | \"panel\" | \"raised\"",
          "description": "Background surface treatment"
        },
        {
          "id": "gap",
          "name": "gap",
          "type": "\"xs\" | \"sm\" | \"md\" | \"lg\" | \"xl\"",
          "description": "Gap between direct children"
        },
        {
          "id": "gradient",
          "name": "gradient",
          "type": "\"accent\" | \"highlight\" | \"info\" | \"success\" | \"warn\"",
          "description": "Gradient overlay colour"
        },
        {
          "id": "gradientPosition",
          "name": "gradientPosition",
          "type": "\"top\" | \"top-right\" | \"right\" | \"bottom-right\" | \"bottom\" | \"bottom-left\" | \"left\" | \"top-left\" | \"center\"",
          "description": "Gradient origin. Default: \"center\""
        },
        {
          "id": "inverse",
          "name": "inverse",
          "type": "boolean",
          "description": "Apply inverse (dark) colour scheme to this section"
        },
        {
          "id": "contentWidth",
          "name": "contentWidth",
          "type": "\"xs\" | \"sm\" | \"md\" | \"lg\" | \"xl\" | \"2xl\"",
          "description": "Constrain inner content to a max-width and centre it"
        },
        {
          "id": "height",
          "name": "height",
          "type": "\"screen\" | \"hero\"",
          "description": "Force a specific height. \"hero\" fills 90svh minus the sticky header height and vertically centres content."
        },
        {
          "id": "align",
          "name": "align",
          "type": "ResponsiveAlignment",
          "description": "Horizontal layout alignment for direct children. Responsive object syntax supported."
        },
        {
          "id": "borderSize",
          "name": "borderSize",
          "type": "\"xs\" | \"sm\" | \"md\" | \"lg\"",
          "description": "Border thickness. Uses the same size tokens as Divider. Omit for no border."
        },
        {
          "id": "borderStyle",
          "name": "borderStyle",
          "type": "\"solid\" | \"dashed\" | \"dotted\"",
          "description": "Border pattern. Uses the same line styles as Divider. Default: \"solid\""
        },
        {
          "id": "borderVariant",
          "name": "borderVariant",
          "type": "\"subtle\" | \"strong\" | \"accent\"",
          "description": "Border color tone. Uses the same variants as Divider. Default: \"subtle\""
        },
        {
          "id": "borderSides",
          "name": "borderSides",
          "type": "\"all\" | (\"top\" | \"right\" | \"bottom\" | \"left\")[]",
          "description": "Which sides the border is drawn on (requires `borderSize`). `\"all\"` (default) draws all four sides; pass an array to draw only those sides, e.g. `[\"top\", \"bottom\"]`. An empty array draws no border."
        },
        {
          "id": "radius",
          "name": "radius",
          "type": "\"none\" | \"sm\" | \"md\" | \"lg\" | \"xl\"",
          "description": "Border radius scale."
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "No description in the package type declaration."
        }
      ]
    }
  ],
  "segmented-control": [
    {
      "title": "Segment Option",
      "rows": [
        {
          "id": "value",
          "name": "value",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "label",
          "name": "label",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "icon",
          "name": "icon",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "ariaLabel",
          "name": "ariaLabel",
          "type": "string",
          "description": "No description in the package type declaration."
        }
      ]
    },
    {
      "title": "Segmented Control",
      "rows": [
        {
          "id": "options",
          "name": "options",
          "type": "(string | SegmentOption)[]",
          "description": "Option list. Pass strings or `{ value, label, icon }` objects."
        },
        {
          "id": "value",
          "name": "value",
          "type": "string",
          "description": "Currently selected value (controlled)"
        },
        {
          "id": "onChange",
          "name": "onChange",
          "type": "(value: string) => void",
          "description": "Called with the new value when an option is selected"
        },
        {
          "id": "fullWidth",
          "name": "fullWidth",
          "type": "boolean",
          "description": "Stretch to fill the container width. Default: false"
        },
        {
          "id": "size",
          "name": "size",
          "type": "\"sm\" | \"md\" | \"lg\"",
          "description": "Height scale. Default: \"md\""
        },
        {
          "id": "labelMode",
          "name": "labelMode",
          "type": "\"all\" | \"selected\" | \"none\"",
          "description": "Label display. `\"all\"` (default) shows every option's label. `\"selected\"` shows the label only on the selected option; the rest render icon-only (using each option's `ariaLabel`/`label` for its accessible name). Options without an icon always show their label so they never render blank. \"none\" hides every label (fully icon-only)."
        }
      ]
    }
  ],
  "select": [
    {
      "title": "Select Field",
      "rows": [
        {
          "id": "label",
          "name": "label",
          "type": "string",
          "description": "Visible label text"
        },
        {
          "id": "hint",
          "name": "hint",
          "type": "string",
          "description": "Helper text shown below the field"
        },
        {
          "id": "error",
          "name": "error",
          "type": "string",
          "description": "Error message — replaces hint and marks the field invalid"
        },
        {
          "id": "size",
          "name": "size",
          "type": "\"comfortable\" | \"default\" | \"compact\"",
          "description": "Size density. Inherits from parent `Fieldset` when omitted. Default: \"default\""
        },
        {
          "id": "labelPosition",
          "name": "labelPosition",
          "type": "\"above\" | \"before\"",
          "description": "Label position. Inherits from parent `Fieldset` when omitted. Default: \"above\""
        },
        {
          "id": "required",
          "name": "required",
          "type": "boolean",
          "description": "No description in the package type declaration."
        },
        {
          "id": "disabled",
          "name": "disabled",
          "type": "boolean",
          "description": "No description in the package type declaration."
        },
        {
          "id": "inputOverlay",
          "name": "inputOverlay",
          "type": "React.ReactNode",
          "description": "Element rendered inside the field control"
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "`<option>` elements"
        }
      ]
    }
  ],
  "side-nav": [
    {
      "title": "Side Nav",
      "rows": [
        {
          "id": "header",
          "name": "header",
          "type": "React.ReactNode | ((collapsed: boolean) => React.ReactNode)",
          "description": "Header slot. Pass a render function to receive the current `collapsed` state: `header={(collapsed) => <Logo collapsed={collapsed} />}`"
        },
        {
          "id": "footer",
          "name": "footer",
          "type": "React.ReactNode | ((collapsed: boolean) => React.ReactNode)",
          "description": "Footer slot — hidden when collapsed"
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "`SideNavItem` and `SideNavGroup` elements"
        },
        {
          "id": "open",
          "name": "open",
          "type": "boolean",
          "description": "Controls overlay visibility on xs/sm/md viewports. Default: false"
        },
        {
          "id": "onClose",
          "name": "onClose",
          "type": "() => void",
          "description": "Called when the scrim, Escape key, or close button is triggered"
        },
        {
          "id": "defaultCollapsed",
          "name": "defaultCollapsed",
          "type": "boolean",
          "description": "Initial collapsed state for lg/xl (uncontrolled). Default: false"
        },
        {
          "id": "collapsed",
          "name": "collapsed",
          "type": "boolean",
          "description": "Controlled collapsed state for lg/xl"
        },
        {
          "id": "onCollapsedChange",
          "name": "onCollapsedChange",
          "type": "(collapsed: boolean) => void",
          "description": "Called with next boolean when collapsed state changes"
        },
        {
          "id": "collapseButtonPlacement",
          "name": "collapseButtonPlacement",
          "type": "\"header\" | \"footer\"",
          "description": "Where the desktop collapse toggle appears. Default: \"header\""
        },
        {
          "id": "placement",
          "name": "placement",
          "type": "\"start\" | \"end\"",
          "description": "Side of the layout the nav occupies. Default: \"start\""
        },
        {
          "id": "className",
          "name": "className",
          "type": "string",
          "description": "No description in the package type declaration."
        }
      ]
    },
    {
      "title": "Side Nav Group",
      "rows": [
        {
          "id": "icon",
          "name": "icon",
          "type": "string",
          "description": "Material Symbols icon (recommended for collapsed state)"
        },
        {
          "id": "label",
          "name": "label",
          "type": "string",
          "description": "Trigger label"
        },
        {
          "id": "defaultOpen",
          "name": "defaultOpen",
          "type": "boolean",
          "description": "Initial expanded state (uncontrolled). Default: false"
        },
        {
          "id": "open",
          "name": "open",
          "type": "boolean",
          "description": "Controlled expanded state"
        },
        {
          "id": "onOpenChange",
          "name": "onOpenChange",
          "type": "(open: boolean) => void",
          "description": "Called with next boolean when toggled"
        },
        {
          "id": "className",
          "name": "className",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "No description in the package type declaration."
        }
      ]
    },
    {
      "title": "Side Nav Item",
      "rows": [
        {
          "id": "as",
          "name": "as",
          "type": "React.ElementType",
          "description": "Underlying element. Default: \"a\""
        },
        {
          "id": "icon",
          "name": "icon",
          "type": "string",
          "description": "Material Symbols icon name"
        },
        {
          "id": "label",
          "name": "label",
          "type": "string",
          "description": "Visible label (also used as tooltip when collapsed)"
        },
        {
          "id": "badge",
          "name": "badge",
          "type": "string | number",
          "description": "Badge count shown next to the label"
        },
        {
          "id": "active",
          "name": "active",
          "type": "boolean",
          "description": "Mark as the current page. Default: false"
        },
        {
          "id": "className",
          "name": "className",
          "type": "string",
          "description": "No description in the package type declaration."
        }
      ]
    }
  ],
  "slider": [
    {
      "title": "Slider",
      "rows": [
        {
          "id": "value",
          "name": "value",
          "type": "number",
          "description": "Controlled value (in the value domain — a detent value when `detents` is set)."
        },
        {
          "id": "defaultValue",
          "name": "defaultValue",
          "type": "number",
          "description": "Uncontrolled initial value. Defaults to the first detent, or `min`."
        },
        {
          "id": "onChange",
          "name": "onChange",
          "type": "(value: number) => void",
          "description": "Called with the new value on every change."
        },
        {
          "id": "min",
          "name": "min",
          "type": "number",
          "description": "Minimum (continuous mode). Default: 0"
        },
        {
          "id": "max",
          "name": "max",
          "type": "number",
          "description": "Maximum (continuous mode). Default: 100"
        },
        {
          "id": "step",
          "name": "step",
          "type": "number",
          "description": "Step granularity (continuous mode). Default: 1"
        },
        {
          "id": "detents",
          "name": "detents",
          "type": "SliderDetent[]",
          "description": "Optional snap stops. Pass numbers, or `{ value, label }` to show labels under the track (e.g. `[{value:0,label:'None'},{value:1,label:'XS'},…]`). The thumb snaps between detents and the keyboard moves one detent at a time."
        },
        {
          "id": "label",
          "name": "label",
          "type": "React.ReactNode",
          "description": "Visible field label rendered above the control and associated with it (also the accessible name). Sized to match the field family per `size`. Use `aria-label` / `aria-labelledby` instead for an invisible name."
        },
        {
          "id": "size",
          "name": "size",
          "type": "\"compact\" | \"default\" | \"comfortable\"",
          "description": "Density, matching the field family. Default: \"default\". Scales the label, detent labels, track, and thumb so a Slider sits naturally beside fields."
        },
        {
          "id": "variant",
          "name": "variant",
          "type": "\"default\" | \"subtle\"",
          "description": "Selection colour. \"default\" uses the action colour; \"subtle\" uses neutrals for the fill, thumb, and active detent. Default: \"default\""
        },
        {
          "id": "showValue",
          "name": "showValue",
          "type": "boolean",
          "description": "Show the floating value bubble while dragging/focused. Default: true"
        },
        {
          "id": "valuePosition",
          "name": "valuePosition",
          "type": "\"above\" | \"below\"",
          "description": "Preferred bubble side; it flips to stay in the viewport. Default: \"above\""
        },
        {
          "id": "formatValue",
          "name": "formatValue",
          "type": "(value: number) => React.ReactNode",
          "description": "Format the bubble + `aria-valuetext`. Defaults to the detent label or the number."
        },
        {
          "id": "bubbleLabel",
          "name": "bubbleLabel",
          "type": "React.ReactNode | ((value: number, detent: { value: number; label?: React.ReactNode; icon?: string } | null) => React.ReactNode)",
          "description": "An alternate label shown in the value bubble (visual only — `aria-valuetext` is unchanged). A node is used as-is; a function receives the current value and the active detent. When omitted, the bubble keeps its current content (the formatted value, detent label/icon, or the raw value). Useful for a longer spoken-out size name (e.g. \"Small\") while the detent stays \"SM\"."
        },
        {
          "id": "disabled",
          "name": "disabled",
          "type": "boolean",
          "description": "Disable the slider. Default: false"
        },
        {
          "id": "name",
          "name": "name",
          "type": "string",
          "description": "Form field name."
        },
        {
          "id": "id",
          "name": "id",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "className",
          "name": "className",
          "type": "string",
          "description": "No description in the package type declaration."
        }
      ]
    }
  ],
  "snackbar": [
    {
      "title": "Snackbar",
      "rows": [
        {
          "id": "open",
          "name": "open",
          "type": "boolean",
          "description": "Controls visibility — renders nothing when false. Default: false"
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "Message content displayed inside the snackbar."
        },
        {
          "id": "actionLabel",
          "name": "actionLabel",
          "type": "string",
          "description": "Label for the optional action button. Both `actionLabel` and `onAction` must be provided to show the button."
        },
        {
          "id": "onAction",
          "name": "onAction",
          "type": "() => void",
          "description": "Called when the action button is clicked. Both `actionLabel` and `onAction` must be provided to show the button."
        },
        {
          "id": "onClose",
          "name": "onClose",
          "type": "() => void",
          "description": "Called when the dismiss icon button is clicked. Omit to hide the dismiss button."
        },
        {
          "id": "position",
          "name": "position",
          "type": "'bottom' | 'bottom-left' | 'bottom-right' | 'top' | 'top-left' | 'top-right'",
          "description": "Snackbar position. Default: \"bottom\""
        },
        {
          "id": "role",
          "name": "role",
          "type": "string",
          "description": "ARIA role. Default: \"status\" (aria-live=\"polite\")."
        },
        {
          "id": "className",
          "name": "className",
          "type": "string",
          "description": "No description in the package type declaration."
        }
      ]
    }
  ],
  "spacer": [
    {
      "title": "Spacer",
      "rows": [
        {
          "id": "size",
          "name": "size",
          "type": "SpacerSize | Partial<Record<Breakpoints, SpacerSize>>",
          "description": "Space height. Responsive object syntax supported. xs=8px · sm=16px · md=24px · lg=40px · xl=64px · xxl=96px Default: \"md\""
        }
      ]
    }
  ],
  "stack": [
    {
      "title": "Stack",
      "rows": [
        {
          "id": "as",
          "name": "as",
          "type": "React.ElementType",
          "description": "Underlying element. Default: \"div\""
        },
        {
          "id": "direction",
          "name": "direction",
          "type": "Direction | Partial<Record<Breakpoints, Direction>>",
          "description": "Flex direction. Responsive object syntax supported. Default: \"column\""
        },
        {
          "id": "gap",
          "name": "gap",
          "type": "SemanticGap | SpacingToken",
          "description": "Gap between children. Use a semantic token (\"xs\"–\"lg\") or a numeric spacing value. Default: 16"
        },
        {
          "id": "align",
          "name": "align",
          "type": "Align",
          "description": "Align-items. Default: \"stretch\""
        },
        {
          "id": "justify",
          "name": "justify",
          "type": "Justify | Partial<Record<Breakpoints, Justify>>",
          "description": "Justify-content. Responsive object syntax supported. Default: \"start\""
        },
        {
          "id": "wrap",
          "name": "wrap",
          "type": "boolean",
          "description": "Allow children to wrap. Default: false"
        },
        {
          "id": "grow",
          "name": "grow",
          "type": "boolean",
          "description": "Make this Stack grow to fill available space in a parent flex container (flex: 1 1 auto; min-inline-size: 0). Use when this Stack is one child in a row alongside fixed-width siblings (e.g. a field beside a button). Default: false"
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "No description in the package type declaration."
        }
      ]
    }
  ],
  "status-bar": [
    {
      "title": "Status Bar",
      "rows": [
        {
          "id": "value",
          "name": "value",
          "type": "number",
          "description": "Current value. Combined with max to compute the fill percentage. Ignored when indeterminate is true. Default: 0"
        },
        {
          "id": "max",
          "name": "max",
          "type": "number",
          "description": "Maximum value. Default: 100"
        },
        {
          "id": "label",
          "name": "label",
          "type": "React.ReactNode",
          "description": "Label displayed adjacent to the bar. Accepts any ReactNode — plain string, bold/inline markup, or composed components. Also provides the accessible name for the progressbar via aria-labelledby."
        },
        {
          "id": "labelPosition",
          "name": "labelPosition",
          "type": "\"above\" | \"below\" | \"before\" | \"after\"",
          "description": "Position of the label relative to the bar. \"above\" and \"below\" use a column layout; \"before\" and \"after\" use a row layout and are RTL-aware (\"before\" = inline-start side). Default: \"above\""
        },
        {
          "id": "size",
          "name": "size",
          "type": "\"sm\" | \"md\" | \"lg\"",
          "description": "Bar height. Default: \"md\""
        },
        {
          "id": "indeterminate",
          "name": "indeterminate",
          "type": "boolean",
          "description": "Shows an animated loading sweep instead of a value-based fill. Removes aria-valuenow so assistive technology announces an indeterminate state. After 3 seconds a pause/resume button appears. Default: false"
        },
        {
          "id": "className",
          "name": "className",
          "type": "string",
          "description": "Additional CSS class names applied to the root element."
        }
      ]
    }
  ],
  "step-tracker": [
    {
      "title": "Step Tracker",
      "rows": [
        {
          "id": "steps",
          "name": "steps",
          "type": "number",
          "description": "Total number of steps."
        },
        {
          "id": "currentStep",
          "name": "currentStep",
          "type": "number",
          "description": "1-indexed position of the current step. Default: 1."
        },
        {
          "id": "align",
          "name": "align",
          "type": "\"left\" | \"center\" | \"right\" | \"full\"",
          "description": "Horizontal alignment of the tracker within its container. \"left\" | \"center\" | \"right\" — groups items together. \"full\" — active pill expands to fill remaining space. Default: \"left\"."
        }
      ]
    }
  ],
  "sticky-actions": [
    {
      "title": "Sticky Actions",
      "rows": [
        {
          "id": "contentWidth",
          "name": "contentWidth",
          "type": "\"xs\" | \"sm\" | \"md\" | \"lg\" | \"xl\" | \"2xl\"",
          "description": "Constrains the inner content to the same max-widths as Section's contentWidth prop. Match this to the contentWidth of the Section above so buttons align with page content. \"xs\" = 28.5rem · \"sm\" = 40rem · \"md\" = 50rem · \"lg\" = 60rem · \"xl\" = 70rem · \"2xl\" = 90rem"
        },
        {
          "id": "className",
          "name": "className",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "children",
          "name": "children",
          "type": "ReactNode",
          "description": "No description in the package type declaration."
        }
      ]
    }
  ],
  "switch": [
    {
      "title": "Switch",
      "rows": [
        {
          "id": "label",
          "name": "label",
          "type": "string",
          "description": "Visible label text"
        },
        {
          "id": "hint",
          "name": "hint",
          "type": "string",
          "description": "Helper text shown below the switch"
        },
        {
          "id": "error",
          "name": "error",
          "type": "string",
          "description": "Error message"
        },
        {
          "id": "size",
          "name": "size",
          "type": "\"comfortable\" | \"default\" | \"compact\"",
          "description": "Size density. Inherits from parent `Fieldset` when omitted. Default: \"default\""
        },
        {
          "id": "labelPosition",
          "name": "labelPosition",
          "type": "\"start\" | \"end\"",
          "description": "Position of the label relative to the toggle. Default: \"end\""
        },
        {
          "id": "disabled",
          "name": "disabled",
          "type": "boolean",
          "description": "No description in the package type declaration."
        },
        {
          "id": "checked",
          "name": "checked",
          "type": "boolean",
          "description": "Controlled checked state"
        },
        {
          "id": "defaultChecked",
          "name": "defaultChecked",
          "type": "boolean",
          "description": "Initial checked state (uncontrolled). Default: false"
        },
        {
          "id": "onChange",
          "name": "onChange",
          "type": "(checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void",
          "description": "Called with (checked, event) when the value changes"
        },
        {
          "id": "id",
          "name": "id",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "name",
          "name": "name",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "value",
          "name": "value",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "className",
          "name": "className",
          "type": "string",
          "description": "No description in the package type declaration."
        }
      ]
    }
  ],
  "tabs": [
    {
      "title": "Tabs",
      "rows": [
        {
          "id": "value",
          "name": "value",
          "type": "string",
          "description": "Currently active tab value (controlled)"
        },
        {
          "id": "onChange",
          "name": "onChange",
          "type": "(value: string) => void",
          "description": "Called with the new value when a tab is clicked"
        },
        {
          "id": "variant",
          "name": "variant",
          "type": "\"line\" | \"pills\" | \"segment\" | \"progress\" | \"folder\"",
          "description": "Visual style. Default: \"line\" line — underline indicator pills — filled pill buttons segment — segmented control style progress — step-progress indicator folder — browser-tab style folders"
        },
        {
          "id": "level",
          "name": "level",
          "type": "1 | 2",
          "description": "Heading level for accessibility. Tabs at level 1 sit above level 2 tabs. Default: 1"
        },
        {
          "id": "size",
          "name": "size",
          "type": "\"compact\"",
          "description": "Size variant. Default: undefined (standard)"
        },
        {
          "id": "equalHeight",
          "name": "equalHeight",
          "type": "boolean",
          "description": "Keep every panel mounted, stacked in one cell, so the panel area always reserves the **tallest** panel's height — switching tabs won't change the container height. Opt-in (default `false`); use inside a Dialog/overlay so it doesn't resize and move its targets. On a page, leave it off so tabs size to the active panel. Default: false"
        },
        {
          "id": "labelMode",
          "name": "labelMode",
          "type": "\"all\" | \"selected\"",
          "description": "Label display. `\"all\"` (default) shows every tab's label at all breakpoints. `\"selected\"` shows the label only on the **active** tab; inactive tabs render **icon-only** (the label stays in the DOM for the accessible name). Pair with a `Tab` `icon` so inactive tabs aren't blank, and give **every** `Tab` a label. Mirrors `ToolbarGroup`'s `labelMode`. Default: \"all\""
        },
        {
          "id": "className",
          "name": "className",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "No description in the package type declaration."
        }
      ]
    },
    {
      "title": "Tab List",
      "rows": [
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "No description in the package type declaration."
        }
      ]
    },
    {
      "title": "Tab",
      "rows": [
        {
          "id": "value",
          "name": "value",
          "type": "string",
          "description": "Value identifier — must match the corresponding `TabPanel` value"
        },
        {
          "id": "count",
          "name": "count",
          "type": "number",
          "description": "Badge count shown next to the label"
        },
        {
          "id": "icon",
          "name": "icon",
          "type": "string",
          "description": "Material Symbols icon name"
        },
        {
          "id": "iconPosition",
          "name": "iconPosition",
          "type": "\"start\" | \"end\" | \"above\"",
          "description": "Icon placement relative to the label. Default: \"start\""
        },
        {
          "id": "status",
          "name": "status",
          "type": "\"completed\" | \"error\" | \"warn\"",
          "description": "Status indicator (used in \"progress\" variant)"
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "No description in the package type declaration."
        }
      ]
    },
    {
      "title": "Tab Panel",
      "rows": [
        {
          "id": "value",
          "name": "value",
          "type": "string",
          "description": "Value identifier — panel renders only when this matches the active `Tabs` value"
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "No description in the package type declaration."
        }
      ]
    }
  ],
  "text-field": [
    {
      "title": "Text Field",
      "rows": [
        {
          "id": "label",
          "name": "label",
          "type": "string",
          "description": "Visible label text"
        },
        {
          "id": "hint",
          "name": "hint",
          "type": "string",
          "description": "Helper text shown below the field"
        },
        {
          "id": "error",
          "name": "error",
          "type": "string",
          "description": "Error message — replaces hint and marks the field invalid"
        },
        {
          "id": "size",
          "name": "size",
          "type": "\"comfortable\" | \"default\" | \"compact\"",
          "description": "Size density. Inherits from parent `Fieldset` when omitted. Default: \"default\""
        },
        {
          "id": "labelPosition",
          "name": "labelPosition",
          "type": "\"above\" | \"before\"",
          "description": "Label position. Inherits from parent `Fieldset` when omitted. Default: \"above\""
        },
        {
          "id": "required",
          "name": "required",
          "type": "boolean",
          "description": "No description in the package type declaration."
        },
        {
          "id": "disabled",
          "name": "disabled",
          "type": "boolean",
          "description": "No description in the package type declaration."
        },
        {
          "id": "readOnly",
          "name": "readOnly",
          "type": "boolean",
          "description": "No description in the package type declaration."
        },
        {
          "id": "autoComplete",
          "name": "autoComplete",
          "type": "string",
          "description": "Autofill hint forwarded to the native input, e.g. \"email\", \"current-password\", \"tel\", \"postal-code\", \"cc-number\", \"off\". Improves browser and password-manager autofill."
        },
        {
          "id": "inputOverlay",
          "name": "inputOverlay",
          "type": "React.ReactNode",
          "description": "Element rendered inside the field control (e.g. a unit suffix)"
        }
      ]
    }
  ],
  "textarea": [
    {
      "title": "Textarea Field",
      "rows": [
        {
          "id": "label",
          "name": "label",
          "type": "string",
          "description": "Visible label text"
        },
        {
          "id": "hint",
          "name": "hint",
          "type": "string",
          "description": "Helper text shown below the field"
        },
        {
          "id": "error",
          "name": "error",
          "type": "string",
          "description": "Error message — replaces hint and marks the field invalid"
        },
        {
          "id": "size",
          "name": "size",
          "type": "\"comfortable\" | \"default\" | \"compact\"",
          "description": "Size density. Inherits from parent `Fieldset` when omitted. Default: \"default\""
        },
        {
          "id": "labelPosition",
          "name": "labelPosition",
          "type": "\"above\" | \"before\"",
          "description": "Label position. Inherits from parent `Fieldset` when omitted. Default: \"above\""
        },
        {
          "id": "required",
          "name": "required",
          "type": "boolean",
          "description": "No description in the package type declaration."
        },
        {
          "id": "disabled",
          "name": "disabled",
          "type": "boolean",
          "description": "No description in the package type declaration."
        },
        {
          "id": "readOnly",
          "name": "readOnly",
          "type": "boolean",
          "description": "No description in the package type declaration."
        },
        {
          "id": "rows",
          "name": "rows",
          "type": "\"sm\" | \"md\" | \"lg\" | \"xl\" | number",
          "description": "Initial visible row height. Pass a number for exact rows or a size token. sm=2 · md=4 · lg=8 · xl=12. Default: \"md\""
        },
        {
          "id": "maxLength",
          "name": "maxLength",
          "type": "number",
          "description": "Maximum character count"
        },
        {
          "id": "showCount",
          "name": "showCount",
          "type": "boolean",
          "description": "Show a character counter. Auto-enabled when `maxLength` is set. Default: false"
        }
      ]
    }
  ],
  "toolbar": [
    {
      "title": "Toolbar",
      "rows": [
        {
          "id": "aria-label",
          "name": "aria-label",
          "type": "string",
          "description": "Accessible name for the toolbar (ignored when `label` is set)."
        },
        {
          "id": "label",
          "name": "label",
          "type": "React.ReactNode",
          "description": "Optional visible caption rendered above the bar, styled to match the compact ChoiceGroup label. When set it also provides the toolbar's accessible name."
        },
        {
          "id": "overlay",
          "name": "overlay",
          "type": "boolean",
          "description": "Lift the bar into a floating, elevated surface (shadow + border) for a toolbar that hovers over page content (e.g. a selection formatting bar). The consumer is responsible for positioning. Default: false"
        },
        {
          "id": "fullWidth",
          "name": "fullWidth",
          "type": "boolean",
          "description": "Stretch the bar to fill its container, with the tools growing to share the available width (dividers keep their natural size). When false the bar is `fit-content` wide. Default: false"
        },
        {
          "id": "children",
          "name": "children",
          "type": "React.ReactNode",
          "description": "No description in the package type declaration."
        }
      ]
    },
    {
      "title": "Toolbar Toggle",
      "rows": [
        {
          "id": "icon",
          "name": "icon",
          "type": "string",
          "description": "Material Symbols icon name."
        },
        {
          "id": "swatch",
          "name": "swatch",
          "type": "string",
          "description": "A colour swatch (any CSS color) shown inside the tool."
        },
        {
          "id": "label",
          "name": "label",
          "type": "string",
          "description": "Accessible name (and tooltip); shown as text when `showLabel`."
        },
        {
          "id": "pressed",
          "name": "pressed",
          "type": "boolean",
          "description": "Pressed (on) state."
        },
        {
          "id": "onChange",
          "name": "onChange",
          "type": "(pressed: boolean) => void",
          "description": "Called with the next pressed state when clicked."
        },
        {
          "id": "showLabel",
          "name": "showLabel",
          "type": "ToolbarShowLabel",
          "description": "Show the label as visible text; boolean or a responsive breakpoint object. Default: false"
        },
        {
          "id": "disabled",
          "name": "disabled",
          "type": "boolean",
          "description": "No description in the package type declaration."
        }
      ]
    },
    {
      "title": "Toolbar Button",
      "rows": [
        {
          "id": "icon",
          "name": "icon",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "swatch",
          "name": "swatch",
          "type": "string",
          "description": "A colour swatch (any CSS color) shown inside the tool."
        },
        {
          "id": "label",
          "name": "label",
          "type": "string",
          "description": "Accessible name (and tooltip); shown as text when `showLabel`."
        },
        {
          "id": "showLabel",
          "name": "showLabel",
          "type": "ToolbarShowLabel",
          "description": "Show the label as visible text; boolean or a responsive breakpoint object. Default: false"
        }
      ]
    },
    {
      "title": "Toolbar Menu Item",
      "rows": [
        {
          "id": "value",
          "name": "value",
          "type": "string | number",
          "description": "No description in the package type declaration."
        },
        {
          "id": "label",
          "name": "label",
          "type": "React.ReactNode",
          "description": "No description in the package type declaration."
        },
        {
          "id": "icon",
          "name": "icon",
          "type": "string",
          "description": "Material Symbols icon name shown beside the menu item."
        },
        {
          "id": "disabled",
          "name": "disabled",
          "type": "boolean",
          "description": "No description in the package type declaration."
        }
      ]
    },
    {
      "title": "Toolbar Menu",
      "rows": [
        {
          "id": "icon",
          "name": "icon",
          "type": "string",
          "description": "Button icon. Defaults to the active item's icon when `value` matches one."
        },
        {
          "id": "label",
          "name": "label",
          "type": "string",
          "description": "Accessible name (and tooltip); shown as text when `showLabel`."
        },
        {
          "id": "value",
          "name": "value",
          "type": "string | number",
          "description": "Currently selected value — marks the matching item active."
        },
        {
          "id": "onChange",
          "name": "onChange",
          "type": "(value: string | number) => void",
          "description": "Called with the chosen item value."
        },
        {
          "id": "items",
          "name": "items",
          "type": "ToolbarMenuItem[]",
          "description": "No description in the package type declaration."
        },
        {
          "id": "showLabel",
          "name": "showLabel",
          "type": "ToolbarShowLabel",
          "description": "Show the label as visible text; boolean or a responsive breakpoint object. Default: false"
        },
        {
          "id": "disabled",
          "name": "disabled",
          "type": "boolean",
          "description": "No description in the package type declaration."
        },
        {
          "id": "aria-label",
          "name": "aria-label",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "className",
          "name": "className",
          "type": "string",
          "description": "No description in the package type declaration."
        }
      ]
    },
    {
      "title": "Toolbar Group Option",
      "rows": [
        {
          "id": "value",
          "name": "value",
          "type": "string | number",
          "description": "No description in the package type declaration."
        },
        {
          "id": "label",
          "name": "label",
          "type": "React.ReactNode",
          "description": "No description in the package type declaration."
        },
        {
          "id": "icon",
          "name": "icon",
          "type": "string",
          "description": "Material Symbols icon name (rendered instead of the label in icon-only mode)."
        },
        {
          "id": "swatch",
          "name": "swatch",
          "type": "string",
          "description": "A colour swatch (any CSS color) shown inside the option."
        },
        {
          "id": "showLabel",
          "name": "showLabel",
          "type": "boolean",
          "description": "Override visible label rendering for this option."
        },
        {
          "id": "overflowPriority",
          "name": "overflowPriority",
          "type": "number",
          "description": "Optional sort priority for visible buttons when `ToolbarGroup overflow` is on. Lower numbers stay visible first; the overflow menu still uses `options` order."
        },
        {
          "id": "disabled",
          "name": "disabled",
          "type": "boolean",
          "description": "No description in the package type declaration."
        }
      ]
    },
    {
      "title": "Toolbar Group",
      "rows": [
        {
          "id": "value",
          "name": "value",
          "type": "string | number",
          "description": "No description in the package type declaration."
        },
        {
          "id": "onChange",
          "name": "onChange",
          "type": "(value: string | number) => void",
          "description": "Called with the newly selected option value."
        },
        {
          "id": "options",
          "name": "options",
          "type": "ToolbarGroupOption[]",
          "description": "No description in the package type declaration."
        },
        {
          "id": "columns",
          "name": "columns",
          "type": "number",
          "description": "Lay the options out as a `columns`-wide grid (e.g. 3 for a 3×3 picker)."
        },
        {
          "id": "overflow",
          "name": "overflow",
          "type": "boolean",
          "description": "When true on a non-grid group, keep as many options visible as fit in the available inline space and move the rest into an icon-only overflow menu. Options stay in their original order. Default: false"
        },
        {
          "id": "showLabels",
          "name": "showLabels",
          "type": "ToolbarShowLabel",
          "description": "Show option labels as text; boolean or a responsive breakpoint object. Default: false (icon-only)"
        },
        {
          "id": "labelMode",
          "name": "labelMode",
          "type": "\"all\" | \"selected\"",
          "description": "`\"all\"` (default) honours `showLabels` for every option. `\"selected\"` shows the label only on the currently selected option; the rest render icon/swatch-only and a `\"none\"`/empty value falls back to the standard none icon. Use it for a swatch picker where only the chosen swatch is named (e.g. Section surface/gradient)."
        },
        {
          "id": "aria-label",
          "name": "aria-label",
          "type": "string",
          "description": "No description in the package type declaration."
        },
        {
          "id": "disabled",
          "name": "disabled",
          "type": "boolean",
          "description": "No description in the package type declaration."
        },
        {
          "id": "className",
          "name": "className",
          "type": "string",
          "description": "No description in the package type declaration."
        }
      ]
    }
  ],
  "tree-menu": [
    {
      "title": "Tree Item",
      "rows": [
        {
          "id": "id",
          "name": "id",
          "type": "string",
          "description": "Unique identifier for this node."
        },
        {
          "id": "label",
          "name": "label",
          "type": "string",
          "description": "Display label."
        },
        {
          "id": "icon",
          "name": "icon",
          "type": "string",
          "description": "Material Symbols icon name."
        },
        {
          "id": "href",
          "name": "href",
          "type": "string",
          "description": "Renders the item as an `<a>` when provided; otherwise a `<button>`."
        },
        {
          "id": "disabled",
          "name": "disabled",
          "type": "boolean",
          "description": "Prevents interaction and applies a muted style. Default: false"
        },
        {
          "id": "children",
          "name": "children",
          "type": "TreeItem[]",
          "description": "Nested child items — supports unlimited depth."
        }
      ]
    },
    {
      "title": "Tree Menu",
      "rows": [
        {
          "id": "items",
          "name": "items",
          "type": "TreeItem[]",
          "description": "Tree data. Supports any depth of nesting."
        },
        {
          "id": "selectedId",
          "name": "selectedId",
          "type": "string | null",
          "description": "ID of the currently selected item (controlled)."
        },
        {
          "id": "onSelect",
          "name": "onSelect",
          "type": "(id: string) => void",
          "description": "Called with the id of the item the user activates."
        },
        {
          "id": "defaultExpandedIds",
          "name": "defaultExpandedIds",
          "type": "string[]",
          "description": "IDs of items that are expanded on initial render (uncontrolled)."
        },
        {
          "id": "expandedIds",
          "name": "expandedIds",
          "type": "string[]",
          "description": "IDs of currently expanded items (controlled)."
        },
        {
          "id": "onExpandedChange",
          "name": "onExpandedChange",
          "type": "(ids: string[]) => void",
          "description": "Called with the new array of expanded IDs when expansion changes."
        },
        {
          "id": "showExpandControls",
          "name": "showExpandControls",
          "type": "boolean",
          "description": "Renders \"Expand all\" and \"Collapse all\" buttons above the tree. Default: false"
        },
        {
          "id": "onHoverChange",
          "name": "onHoverChange",
          "type": "(id: string | null) => void",
          "description": "Called with the id of the item the user is hovering, or null when hover ends."
        },
        {
          "id": "onItemContextMenu",
          "name": "onItemContextMenu",
          "type": "(id: string, event: React.MouseEvent) => void",
          "description": "Called when the user right-clicks a tree item label. Fires with the item id and the originating mouse event."
        },
        {
          "id": "draggable",
          "name": "draggable",
          "type": "boolean",
          "description": "Enables drag-and-drop reordering and reparenting of items. Default: false"
        },
        {
          "id": "onMove",
          "name": "onMove",
          "type": "(params: { draggedId: string; targetId: string; position: 'before' | 'into' | 'after' }) => void",
          "description": "Called when the user drops a dragged item onto a target. Only fires when `draggable` is true. - `position: \"before\"` — insert before the target. - `position: \"after\"` — insert after the target. - `position: \"into\"` — make the dragged item the last child of the target (branch nodes only)."
        },
        {
          "id": "aria-label",
          "name": "aria-label",
          "type": "string",
          "description": "Accessible name for the tree. Required when no visible label references the tree."
        },
        {
          "id": "aria-labelledby",
          "name": "aria-labelledby",
          "type": "string",
          "description": "ID of an element that labels the tree."
        },
        {
          "id": "className",
          "name": "className",
          "type": "string",
          "description": "No description in the package type declaration."
        }
      ]
    }
  ]
}
