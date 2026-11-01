/**
 * Editor adapter components.
 *
 * A few A1 components are either compositional (Tabs, Toolbar — built from
 * sub-components) or render fixed sample data (DataTable, TreeMenu) rather than
 * accepting a single flat prop surface. The generic page renderer maps a node's
 * `type` to one registry component and forwards `node.props`, so for these the
 * node's `props` carry the component's *configurator config* and a thin adapter
 * reuses the matching detail-page `Preview` to render it.
 *
 * Each adapter also forwards the editor's injected selection props
 * (`data-editor-*`, `onClick`, `onContextMenu`, the drag handlers) onto a
 * wrapping element so canvas selection, hover outlines, and catalog drop still
 * work — the underlying Preview manages its own internal state.
 */
import { BottomSheet, Button, DataTable, Grid, Icon, Paragraph, Section, SplitButton, Stack } from '@gtivr4/a1-design-system-react';
import { Preview as ActionTilesPreview } from '../pages/components/detail/action-tile.jsx';
import { Preview as ChipPreview } from '../pages/components/detail/chip.jsx';
import { Preview as BottomSheetPreview } from '../pages/components/detail/bottom-sheet.jsx';
import { Preview as CanvasPreview } from '../pages/components/detail/canvas.jsx';
import { Preview as ContextMenuPreview } from '../pages/components/detail/context-menu.jsx';
import { Preview as TabsPreview } from '../pages/components/detail/tabs.jsx';
import { Preview as ToolbarPreview } from '../pages/components/detail/toolbar.jsx';
import { Preview as DataTablePreview, renderCompactPagination } from '../pages/components/detail/data-table.jsx';
import { Preview as VerificationDialogPreview } from '../pages/components/detail/verification-dialog.jsx';
import { Preview as DialogPreview } from '../pages/components/detail/dialog.jsx';
import { Preview as InlinePreview } from '../pages/components/detail/inline.jsx';
import { Preview as MenuPreview } from '../pages/components/detail/menu.jsx';
import { Preview as NotificationPreview } from '../pages/components/detail/notification.jsx';
import { Preview as PageLayoutPreview } from '../pages/components/detail/page-layout.jsx';
import { Preview as SideNavPreview } from '../pages/components/detail/side-nav.jsx';
import { Preview as SnackbarPreview } from '../pages/components/detail/snackbar.jsx';
import { Preview as TreeMenuPreview } from '../pages/components/detail/tree-menu.jsx';
import { getAllPatterns } from '../patterns/patternStore.js';
// Circular with pageRenderer (which imports the registry); only called at render time.
import { useEditorMode } from './pageRenderer';
import { SlotPlaceholder } from './SlotPlaceholder.jsx';

// Split the injected DOM/editor props (data-*, on*) from the config props the
// detail Preview understands.
function splitEditorProps(props) {
  const dom = {};
  const config = {};
  for (const [key, value] of Object.entries(props)) {
    if (key.startsWith('data-') || key.startsWith('on')) dom[key] = value;
    else config[key] = value;
  }
  return [dom, config];
}

function makeAdapter(Preview) {
  return function EditorComponentAdapter(props) {
    const [dom, config] = splitEditorProps(props);
    return (
      <div className="a1-web-editor-adapter" {...dom}>
        <Preview config={config} />
      </div>
    );
  };
}

export const EditorTabs = makeAdapter(TabsPreview);
export const EditorToolbar = makeAdapter(ToolbarPreview);
export const EditorTreeMenu = makeAdapter(TreeMenuPreview);
export const EditorActionTiles = makeAdapter(ActionTilesPreview);
export const EditorChipGroup = makeAdapter(ChipPreview);
export const EditorCanvas = makeAdapter(CanvasPreview);
export const EditorContextMenu = makeAdapter(ContextMenuPreview);
export const EditorVerificationDialog = makeAdapter(VerificationDialogPreview);
export const EditorDialog = makeAdapter(DialogPreview);
export const EditorInline = makeAdapter(InlinePreview);
export const EditorMenu = makeAdapter(MenuPreview);
export const EditorNotification = makeAdapter(NotificationPreview);
export function EditorBottomSheet(props) {
  const [dom, config] = splitEditorProps(props);
  const { children, detents, defaultDetent, title, ...rest } = config;
  if (children) {
    return (
      <div className="a1-web-editor-adapter" {...dom}>
        <BottomSheet
          title={typeof title === 'string' ? title : undefined}
          detents={Array.isArray(detents) ? detents : [0.5, 0.92]}
          defaultDetent={typeof defaultDetent === 'number' ? defaultDetent : 1}
          {...rest}
        >
          {children}
        </BottomSheet>
      </div>
    );
  }
  return (
    <div className="a1-web-editor-adapter" {...dom}>
      <BottomSheetPreview config={config} />
    </div>
  );
}
// Page Layout forwards real children (JSON page content) into the layout's
// main area — the generic adapter drops children, which would swallow a
// PageLayout node's entire page content.
export function EditorPageLayout(props) {
  const [dom, config] = splitEditorProps(props);
  const { children, ...rest } = config;
  return (
    <div className="a1-web-editor-adapter" {...dom}>
      <PageLayoutPreview config={rest}>{children}</PageLayoutPreview>
    </div>
  );
}
export const EditorSideNav = makeAdapter(SideNavPreview);
export const EditorSnackbar = makeAdapter(SnackbarPreview);

// DataTable: when the node supplies real `columns` (+ `rows`) — as a page
// definition does — render the real DataTable so the supplied data shows.
// Otherwise (a catalog-added table with only configurator config) fall back to
// the sample-data Preview.
const DATA_TABLE_SIZES = new Set(['comfortable', 'default', 'compact']);
export function EditorDataTable(props) {
  const [dom, config] = splitEditorProps(props);
  const hasRealData = Array.isArray(config.columns) && config.columns.length > 0;
  if (hasRealData) {
    const { columns, rows = [], size, paginationExample, ...rest } = config;
    return (
      <div className="a1-web-editor-adapter" {...dom}>
        <DataTable
          columns={columns}
          rows={rows}
          renderPagination={paginationExample === 'compact' ? renderCompactPagination : undefined}
          size={DATA_TABLE_SIZES.has(size) ? size : undefined}
          {...rest}
        />
      </div>
    );
  }
  return (
    <div className="a1-web-editor-adapter" {...dom}>
      <DataTablePreview config={config} />
    </div>
  );
}

// ── Slot ─────────────────────────────────────────────────────────────────────
// A pattern "blank area" — a constrained drop zone. While empty it renders as a
// dashed accent-bordered Section with a label and a hint of what it accepts;
// once filled it renders its children transparently (no border). The accepted
// component types / pattern ids are carried on `allow` / `allowPatterns` and
// enforced by the editor when adding into the slot.

// Build the "accepts" hint shown under the slot label.
function slotAllowHint(allow, allowPatterns) {
  const types = Array.isArray(allow) ? allow.filter(Boolean) : [];
  const patternIds = Array.isArray(allowPatterns) ? allowPatterns.filter(Boolean) : [];
  if (!types.length && !patternIds.length) return 'Accepts any component';
  const parts = [...types];
  if (patternIds.length) {
    const byId = new Map(getAllPatterns().map((p) => [p.pattern.id, p.pattern.name]));
    for (const id of patternIds) parts.push(byId.get(id) ?? id);
  }
  return `Accepts: ${parts.join(', ')}`;
}

// Build the "how many" hint from the min/max item counts.
function slotCountHint(min, max) {
  const hasMin = min != null && min !== '';
  const hasMax = max != null && max !== '';
  if (!hasMin && !hasMax) return null;
  const plural = (n) => `${n} item${Number(n) === 1 ? '' : 's'}`;
  if (hasMin && hasMax) return Number(min) === Number(max) ? plural(min) : `${min}–${max} items`;
  if (hasMax) return `Up to ${plural(max)}`;
  return `At least ${plural(min)}`;
}

// ── Outlet ─────────────────────────────────────────────────────────────────
// Marks where each page's content is injected into the shared layout. Renders a
// labeled placeholder in the layout editor; at page render the Outlet is
// replaced by the page's nodes (see projects/projectLayout.combinePageIntoLayout).
export function EditorOutlet({ children: _children, ...rest }) {
  return (
    <Section
      className="a1-web-outlet"
      as="div"
      borderSize="sm"
      borderStyle="dashed"
      borderVariant="accent"
      radius="md"
      padding="lg"
      gap="xs"
      align="center"
      {...rest}
    >
      <Stack direction="row" gap="xs" align="center" justify="center">
        <Icon name="article" size="sm" color="accent" aria-hidden="true" />
        <Paragraph color="muted">Page content</Paragraph>
      </Stack>
      <Paragraph size="xs" color="muted">Each page renders here, inside the shared layout.</Paragraph>
    </Section>
  );
}

// A Button node with `split` renders as a SplitButton: the button runs its own
// action and the caret opens `menuActions` (`{ id?, label, icon? }[]`), which
// page definitions carry as data. SplitButton has no link, `as` or full-width
// form, so those props apply only to a plain Button.
export function EditorButton({ split, menuActions, menuLabel, ...props }) {
  if (!split) return <Button {...props} />;
  const { as: _as, href: _href, fullWidth: _fullWidth, ...rest } = props;
  const actions = (Array.isArray(menuActions) ? menuActions : [])
    .filter((action) => action?.label)
    .map((action, index) => ({ id: action.id ?? `menu-action-${index + 1}`, label: action.label, icon: action.icon || undefined }));
  return <SplitButton {...rest} actions={actions} menuLabel={menuLabel || undefined} toggleLabel={menuLabel || undefined} />;
}

// `area`, `zone` and `rules` are pattern-area metadata (patternAreas.ts): a
// zone's placeholder shows the pattern's rule sentence instead of the generic
// accept/count hints. None of them belong on the DOM.
export function EditorSlot({ label, allow, allowPatterns, min, max, columns, gap, area: _area, zone: _zone, rules, children, ...rest }) {
  const editorMode = useEditorMode();
  const kids = Array.isArray(children) ? children.filter(Boolean) : children;
  const filled = Array.isArray(kids) ? kids.length > 0 : !!kids;

  // An empty blank area is an editing affordance; previews and prototypes show nothing.
  if (!filled && !editorMode) return null;

  // The slot lays its items out with the Grid component; its columns/gap come
  // from the slot's (open or locked) grid props.
  if (filled) {
    return (
      <Grid className="a1-web-slot a1-web-slot--filled" columns={columns} gap={gap ?? 'md'} {...rest}>
        {children}
      </Grid>
    );
  }

  return (
    <SlotPlaceholder
      label={label}
      hint={rules || slotAllowHint(allow, allowPatterns)}
      countHint={rules ? null : slotCountHint(min, max)}
      {...rest}
    />
  );
}
