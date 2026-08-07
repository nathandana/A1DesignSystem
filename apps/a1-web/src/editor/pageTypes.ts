/**
 * A1 page-definition types — the contract for the JSON/TypeScript-driven page
 * editor proof of concept.
 *
 * The JSON page definition is the source of truth: a layout-first tree of A1
 * component nodes that the renderer (`pageRenderer.tsx`) maps to real A1 React
 * components. These types are intentionally small but shaped to grow toward the
 * full editor (visual editing, JSON editing, code import/export, wired actions)
 * without breaking the contract.
 *
 * Stability note: `ComponentType` names match the exported A1 React component
 * names exactly. The casing is part of the contract and is treated as locked.
 */

/**
 * Names of the A1 components the renderer is allowed to instantiate.
 *
 * These MUST match the exported A1 React component names exactly — do not
 * normalise to lowercase or to HTML tag names. To allow a new component, add it
 * here AND register the real component in `componentRegistry.ts`; the registry
 * is typed against this union so the two stay in sync.
 */
export type ComponentType =
  | "PageLayout"
  | "Section"
  | "SectionSeparator"
  | "Stack"
  | "Grid"
  | "GridItem"
  | "Cluster"
  | "Canvas"
  | "Card"
  | "Bleed"
  | "Inset"
  | "Spacer"
  | "ButtonContainer"
  | "Heading"
  | "Paragraph"
  | "Blockquote"
  | "Code"
  | "Divider"
  | "Inline"
  | "List"
  | "ListItem"
  | "Icon"
  | "Figure"
  | "Link"
  | "Button"
  | "ActionTiles"
  | "ChipGroup"
  | "IconButton"
  | "Switch"
  | "SegmentedControl"
  | "Banner"
  | "MessageBadge"
  | "MessageEmptyState"
  | "Notification"
  | "Snackbar"
  | "StatusBar"
  | "CircularProgress"
  | "StepTracker"
  | "TextField"
  | "SearchField"
  | "TextareaField"
  | "SelectField"
  | "Autocomplete"
  | "NumberField"
  | "DateField"
  | "TimeField"
  | "PhoneField"
  | "ZipField"
  | "CreditCardField"
  | "InlineEditable"
  | "Fieldset"
  | "CheckboxGroup"
  | "RadioGroup"
  | "ChoiceGroup"
  | "Stat"
  | "LineChart"
  | "BarChart"
  | "AreaChart"
  | "ComposedChart"
  | "PieChart"
  | "ScatterChart"
  | "RadarChart"
  | "RadialBarChart"
  | "FunnelChart"
  | "TreemapChart"
  | "SankeyChart"
  | "SunburstChart"
  | "DefinitionList"
  | "Pagination"
  | "Calendar"
  | "Node"
  | "Breadcrumb"
  | "SideNav"
  | "TopHeader"
  | "BottomDrawer"
  | "BottomSheet"
  | "StickyActions"
  | "Accordion"
  | "Dialog"
  | "Menu"
  | "ContextMenu"
  | "Slider"
  | "Toolbar"
  | "Tabs"
  | "FieldRow"
  | "PageNav"
  | "TreeMenu"
  | "DataTable"
  | "Slot"
  | "Outlet";

/**
 * A value that may vary by breakpoint. Mirrors A1's responsive object syntax
 * (e.g. `size={{ xs: 'lg', md: 'xl' }}`). Reserved for future use — most A1
 * props already accept responsive objects directly inside `ComponentProps`.
 */
export type ResponsiveDefinition<T> =
  | T
  | Partial<Record<"xs" | "sm" | "md" | "lg" | "xl", T>>;

/**
 * Props passed straight through to the underlying A1 component.
 *
 * Kept open (`Record<string, unknown>`) for the PoC so a definition can use the
 * full, real prop surface of each A1 component without the type system blocking
 * valid props. A future iteration can replace this with a per-component
 * discriminated union keyed on `ComponentNode["type"]`.
 */
export type ComponentProps = Record<string, unknown>;

/**
 * Tokenized utility classes applied by the editor outside the component prop API.
 * The accepted keys are component-scoped by `utilityRegistry.ts`, so a component
 * can opt into spacing, width, or future utility families without pretending
 * those utilities are native component props.
 */
export interface UtilityDefinition {
  padding?: string;
  paddingBlock?: string;
  paddingInline?: string;
  margin?: string;
  marginBlock?: string;
  marginInline?: string;
  gap?: string;
  maxWidth?: string;
  minWidth?: string;
}

/**
 * A Link embedded in a Heading or Paragraph fallback string. Ranges use UTF-16
 * string offsets, matching JavaScript strings and Figma TextNode ranges.
 */
export interface InlineLinkDefinition {
  /** Inclusive character offset within `fallback`. */
  start: number;
  /** Exclusive character offset within `fallback`. */
  end: number;
  /** Optional visual and navigation props forwarded to the inline A1 Link. */
  props?: {
    href?: string;
    target?: string;
    rel?: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    weight?: "normal" | "medium" | "semibold" | "bold";
    icon?: string;
    iconPosition?: "start" | "end";
  };
}

/**
 * Text content for a node. Supports a localization key plus direct fallback
 * text. The renderer resolves `textKey` through the A1 labels helper and shows
 * `fallback` when no localized value is registered.
 */
export interface ContentDefinition {
  /** Localization key resolved via the A1 labels system, e.g. `"editor.example.hero.title"`. */
  textKey?: string;
  /** Literal text shown when `textKey` has no registered/localized value. Always provided. */
  fallback: string;
  /** Optional A1 Link ranges rendered inline inside Heading or Paragraph text. */
  inlineLinks?: InlineLinkDefinition[];
}

/**
 * Accessibility metadata for a node. The renderer maps these onto ARIA
 * attributes / accessible names on the rendered component. Optional — set only
 * when a node needs an explicit name, relationship, or role beyond its
 * semantic defaults.
 */
export interface A11yDefinition {
  /** Accessible name (maps to `aria-label`). */
  label?: string;
  /** ID reference for `aria-labelledby`. */
  labelledBy?: string;
  /** ID reference for `aria-describedby`. */
  describedBy?: string;
  /** Explicit ARIA role override. */
  role?: string;
}

/**
 * A future-facing action descriptor. Actions are NOT executed by the current
 * renderer — the shape is reserved so the editor can wire behaviour later
 * without changing the page-definition contract.
 *
 * Future-supported action types:
 * - `navigate`     → go to an in-app page (`target` = route)
 * - `openDialog`   → open a dialog (`target` = dialog id)
 * - `appAction`    → trigger a named app-level action (`target` = action name)
 * - `submitForm`   → submit a form (`target` = form id)
 * - `externalLink` → open an external URL (`target` = url)
 */
export interface ActionDefinition {
  type: "navigate" | "openDialog" | "appAction" | "submitForm" | "externalLink";
  /** Route, dialog id, app-action name, form id, or URL — depends on `type`. */
  target?: string;
  /** Arbitrary parameters for the future action handler. */
  params?: Record<string, unknown>;
}

/**
 * Map of event name → action. Reserved for future wiring. The current renderer
 * ignores this (see the TODO in `pageRenderer.tsx`).
 */
export interface ActionMap {
  onClick?: ActionDefinition;
  onSubmit?: ActionDefinition;
}

/**
 * A single renderable component instance in the page tree.
 *
 * `type` selects an A1 component from the registry; `props` are forwarded to it;
 * `content` supplies primary text; `children` nests further nodes.
 */
export interface ComponentNode {
  /** Stable id — used as the React key and as a future editor selection handle. */
  id: string;
  /** A1 component name. Must exist in the component registry, or the renderer shows a fallback. */
  type: ComponentType;
  /**
   * Custom display name for the editor's layers tree (set via inline rename).
   * Overrides the auto-derived label (pattern name → text content → type).
   * Editor metadata only — the renderer ignores it.
   */
  name?: string;
  /** Props forwarded to the A1 component. */
  props?: ComponentProps;
  /** Tokenized utility classes applied only when accepted by this component type. */
  utilities?: UtilityDefinition;
  /**
   * Responsive prop overrides. Reserved — A1 props in `props` already accept
   * responsive objects inline, so this is for future editor ergonomics.
   */
  responsive?: Record<string, ResponsiveDefinition<unknown>>;
  /**
   * Whether this node is rendered at each viewport breakpoint. Values cascade
   * from xs through xl like other A1 responsive objects; omitted means visible.
   */
  visibility?: ResponsiveDefinition<boolean>;
  /** Primary text content (resolved through the labels helper). */
  content?: ContentDefinition;
  /** Accessibility metadata mapped onto the component. */
  a11y?: A11yDefinition;
  /** Future action wiring — ignored by the current renderer. */
  actions?: ActionMap;
  /**
   * Pattern governance carried on a node instantiated from a pattern. When the
   * renderer is asked to enforce locks, a locked node can't be deleted/moved,
   * locked props are read-only, and locked text isn't editable. Absent on
   * ordinary page nodes.
   */
  lock?: { node?: boolean; props?: string[]; content?: boolean };
  /**
   * Set on the root node when a pattern is inserted into a page, so the layers
   * tree and configurator show the pattern's name and a pattern icon instead of
   * the underlying component type.
   */
  patternInstance?: { id: string; name: string };
  /**
   * The id of the source node in the pattern this node was instantiated from.
   * Lets the instance be reconciled against its pattern (locked props/content
   * pulled forward, incompatibilities detected) even after ids are freshened.
   */
  patternNodeId?: string;
  /**
   * Data repeat (A1-94): which dataset this node repeats over. The renderer renders
   * one copy of the node per selected row; `{{ key.column }}` bindings inside each
   * copy resolve to that row. The string form is the dataset binding key; the object
   * form adds `limit` (max rows) and `random` (seeded random selection). Absent on
   * ordinary nodes.
   */
  repeat?:
    | string
    | { dataset: string; limit?: number | null; random?: boolean };
  /**
   * Data-driven collections (A1-94): fills a component's array prop (e.g.
   * DefinitionList `items`, ChoiceGroup `options`) from a dataset, keyed by the prop
   * name. Each binding picks a dataset + mode (`rows` / `fields` / `distinct`) + an
   * optional column-to-field map. A node field (not props) so it survives configurator
   * round-trips. Expanded by the renderer.
   */
  collections?: Record<
    string,
    {
      dataset: string;
      mode: "rows" | "fields" | "distinct";
      column?: string;
      map?: Record<string, string>;
      limit?: number | null;
      random?: boolean;
    }
  >;
  /** Nested child nodes. */
  children?: ComponentNode[];
}

/** A named area inside the layout that holds an ordered list of nodes. */
export interface PageRegion {
  /** Stable region id — used as the React key. */
  id: string;
  /** Human/editor-facing region name. */
  name?: string;
  /** The node tree rendered inside this region. */
  nodes: ComponentNode[];
}

/**
 * The top-level, layout-first container for a page. `type` is an A1 layout
 * component (e.g. `"PageLayout"`); `regions` hold the node trees rendered inside
 * it. Layout-first means the page starts from structure, not content.
 */
export interface PageLayoutDefinition {
  type: ComponentType;
  props?: ComponentProps;
  regions: PageRegion[];
}

/** Human/editor-facing metadata about the page. */
export interface PageMetadata {
  /** Stable page id. */
  id: string;
  /** Display name. */
  name: string;
  /** Short description of the page's purpose. */
  description?: string;
  /** Material Symbols icon name used for the page in project navigation. */
  icon?: string;
  /**
   * Detail page (A1-94): the binding key of a dataset this page shows details for.
   * When set, the page resolves `{{ key.column }}` bindings against the row whose
   * `__id` matches the `item` URL param (live), or `detailPreviewId` (in the editor).
   */
  detailDataset?: string;
  /** The dataset row `__id` to preview in the editor while designing a detail page. */
  detailPreviewId?: string;
}

/**
 * The full page definition: metadata + layout. This object is the source of
 * truth for the rendered page and for the strict JSON shown in the editor.
 */
export interface PageDefinition {
  /** Schema version of the page-definition format (semver). */
  schemaVersion: string;
  /** Page metadata plus the layout-first component tree. */
  page: PageMetadata & {
    layout: PageLayoutDefinition;
  };
}
