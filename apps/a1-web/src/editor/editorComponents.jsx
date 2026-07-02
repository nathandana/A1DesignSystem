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
import { DataTable, Grid, Icon, Paragraph, Section, Stack } from '@gtivr4/a1-design-system-react';
import { Preview as ActionTilesPreview } from '../pages/components/detail/action-tile.jsx';
import { Preview as ChipPreview } from '../pages/components/detail/chip.jsx';
import { Preview as BottomSheetPreview } from '../pages/components/detail/bottom-sheet.jsx';
import { Preview as CanvasPreview } from '../pages/components/detail/canvas.jsx';
import { Preview as ContextMenuPreview } from '../pages/components/detail/context-menu.jsx';
import { Preview as TabsPreview } from '../pages/components/detail/tabs.jsx';
import { Preview as ToolbarPreview } from '../pages/components/detail/toolbar.jsx';
import { Preview as DataTablePreview } from '../pages/components/detail/data-table.jsx';
import { Preview as DialogPreview } from '../pages/components/detail/dialog.jsx';
import { Preview as InlinePreview } from '../pages/components/detail/inline.jsx';
import { Preview as MenuPreview } from '../pages/components/detail/menu.jsx';
import { Preview as NotificationPreview } from '../pages/components/detail/notification.jsx';
import { Preview as PageLayoutPreview } from '../pages/components/detail/page-layout.jsx';
import { Preview as SideNavPreview } from '../pages/components/detail/side-nav.jsx';
import { Preview as SnackbarPreview } from '../pages/components/detail/snackbar.jsx';
import { Preview as TreeMenuPreview } from '../pages/components/detail/tree-menu.jsx';
import { getAllPatterns } from '../patterns/patternStore.js';

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
export const EditorBottomSheet = makeAdapter(BottomSheetPreview);
export const EditorCanvas = makeAdapter(CanvasPreview);
export const EditorContextMenu = makeAdapter(ContextMenuPreview);
export const EditorDialog = makeAdapter(DialogPreview);
export const EditorInline = makeAdapter(InlinePreview);
export const EditorMenu = makeAdapter(MenuPreview);
export const EditorNotification = makeAdapter(NotificationPreview);
export const EditorPageLayout = makeAdapter(PageLayoutPreview);
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
    const { columns, rows = [], size, ...rest } = config;
    return (
      <div className="a1-web-editor-adapter" {...dom}>
        <DataTable
          columns={columns}
          rows={rows}
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

export function EditorSlot({ label, allow, allowPatterns, min, max, columns, gap, children, ...rest }) {
  const kids = Array.isArray(children) ? children.filter(Boolean) : children;
  const filled = Array.isArray(kids) ? kids.length > 0 : !!kids;

  // The slot lays its items out with the Grid component; its columns/gap come
  // from the slot's (open or locked) grid props.
  if (filled) {
    return (
      <Grid className="a1-web-slot a1-web-slot--filled" columns={columns} gap={gap ?? 'md'} {...rest}>
        {children}
      </Grid>
    );
  }

  const countHint = slotCountHint(min, max);

  return (
    <Section
      className="a1-web-slot a1-web-slot--empty"
      as="div"
      borderSize="sm"
      borderStyle="dashed"
      borderVariant="accent"
      radius="md"
      padding="lg"
      gap="sm"
      align="center"
      {...rest}
    >
      <Stack direction="row" gap="xs" align="center" justify="center">
        <Icon name="add_circle" size="sm" color="accent" aria-hidden="true" />
        <Paragraph color="muted">{label || 'Blank area'}</Paragraph>
      </Stack>
      <Paragraph size="xs" color="muted">{slotAllowHint(allow, allowPatterns)}</Paragraph>
      {countHint && <Paragraph size="xs" color="muted">{countHint}</Paragraph>}
    </Section>
  );
}
