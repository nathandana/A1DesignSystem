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
import { Preview as TabsPreview } from '../pages/components/detail/tabs.jsx';
import { Preview as ToolbarPreview } from '../pages/components/detail/toolbar.jsx';
import { Preview as DataTablePreview } from '../pages/components/detail/data-table.jsx';
import { Preview as TreeMenuPreview } from '../pages/components/detail/tree-menu.jsx';

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
export const EditorDataTable = makeAdapter(DataTablePreview);
export const EditorTreeMenu = makeAdapter(TreeMenuPreview);
