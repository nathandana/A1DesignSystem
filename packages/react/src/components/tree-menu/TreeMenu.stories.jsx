import { useState } from 'react';
import { TreeMenu } from './TreeMenu.jsx';

const FILE_TREE = [
  {
    id: 'src',
    label: 'src',
    icon: 'folder',
    children: [
      {
        id: 'components',
        label: 'components',
        icon: 'folder',
        children: [
          { id: 'button', label: 'Button.jsx', icon: 'javascript' },
          { id: 'card', label: 'Card.jsx', icon: 'javascript' },
          { id: 'input', label: 'Input.jsx', icon: 'javascript' },
        ],
      },
      {
        id: 'pages',
        label: 'pages',
        icon: 'folder',
        children: [
          { id: 'home', label: 'Home.jsx', icon: 'javascript' },
          { id: 'settings', label: 'Settings.jsx', icon: 'javascript' },
        ],
      },
      { id: 'index', label: 'index.js', icon: 'javascript' },
    ],
  },
  {
    id: 'public',
    label: 'public',
    icon: 'folder',
    children: [
      { id: 'favicon', label: 'favicon.ico', icon: 'image' },
      { id: 'robots', label: 'robots.txt', icon: 'description' },
    ],
  },
  { id: 'package-json', label: 'package.json', icon: 'data_object' },
  { id: 'readme', label: 'README.md', icon: 'description' },
];

const NAV_TREE = [
  {
    id: 'foundations',
    label: 'Foundations',
    icon: 'foundation',
    children: [
      { id: 'tokens', label: 'Tokens', icon: 'token' },
      { id: 'themes', label: 'Themes', icon: 'palette' },
      { id: 'icons', label: 'Icons', icon: 'grid_view' },
    ],
  },
  {
    id: 'components',
    label: 'Components',
    icon: 'widgets',
    children: [
      {
        id: 'typography',
        label: 'Typography',
        children: [
          { id: 'heading', label: 'Heading' },
          { id: 'paragraph', label: 'Paragraph' },
          { id: 'list', label: 'List' },
        ],
      },
      {
        id: 'actions',
        label: 'Actions',
        children: [
          { id: 'button', label: 'Button' },
          { id: 'icon-button', label: 'Icon Button' },
        ],
      },
    ],
  },
  { id: 'releases', label: 'Releases', icon: 'new_releases' },
];

// ── Drag-and-drop helpers (used in the Draggable story) ───────────────────────

function extractItem(items, id) {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) {
      return [items[i], [...items.slice(0, i), ...items.slice(i + 1)]];
    }
    if (items[i].children?.length) {
      const [found, newChildren] = extractItem(items[i].children, id);
      if (found) {
        return [found, [...items.slice(0, i), { ...items[i], children: newChildren }, ...items.slice(i + 1)]];
      }
    }
  }
  return [null, items];
}

function insertItem(items, node, targetId, position) {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === targetId) {
      if (position === 'before') return [...items.slice(0, i), node, ...items.slice(i)];
      if (position === 'after')  return [...items.slice(0, i + 1), node, ...items.slice(i + 1)];
      // 'into': append as last child
      const children = [...(items[i].children ?? []), node];
      return [...items.slice(0, i), { ...items[i], children }, ...items.slice(i + 1)];
    }
    if (items[i].children?.length) {
      const newChildren = insertItem(items[i].children, node, targetId, position);
      if (newChildren !== items[i].children) {
        return [...items.slice(0, i), { ...items[i], children: newChildren }, ...items.slice(i + 1)];
      }
    }
  }
  return items;
}

function moveItem(items, draggedId, targetId, position) {
  if (draggedId === targetId) return items;
  const [extracted, remaining] = extractItem(items, draggedId);
  if (!extracted) return items;
  return insertItem(remaining, extracted, targetId, position);
}

// ─────────────────────────────────────────────────────────────────────────────

export default {
  title: 'Navigation/TreeMenu',
  component: TreeMenu,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    selectedId:          { control: 'text' },
    showExpandControls:  { control: 'boolean' },
    draggable:           { control: 'boolean' },
    defaultExpandedIds:  { control: false },
    expandedIds:         { control: false },
    onExpandedChange:    { control: false },
    onSelect:            { control: false },
    onMove:              { control: false },
    items:               { control: false },
  },
};

function Controlled({ items, defaultExpanded = [], defaultSelected = null, showExpandControls = false }) {
  const [selectedId, setSelectedId] = useState(defaultSelected);
  return (
    <div style={{ width: 260 }}>
      <TreeMenu
        items={items}
        selectedId={selectedId}
        onSelect={setSelectedId}
        defaultExpandedIds={defaultExpanded}
        showExpandControls={showExpandControls}
        aria-label="Navigation"
      />
    </div>
  );
}

export const FileExplorer = {
  render: () => (
    <Controlled
      items={FILE_TREE}
      defaultExpanded={['src', 'components']}
      defaultSelected="button"
    />
  ),
};

export const DocumentNavigation = {
  render: () => (
    <Controlled
      items={NAV_TREE}
      defaultExpanded={['components', 'typography']}
      defaultSelected="heading"
    />
  ),
};

export const NoIcons = {
  render: () => (
    <Controlled
      items={[
        {
          id: 'account',
          label: 'Account',
          children: [
            { id: 'profile', label: 'Profile' },
            { id: 'security', label: 'Security' },
            {
              id: 'billing',
              label: 'Billing',
              children: [
                { id: 'invoices', label: 'Invoices' },
                { id: 'payment', label: 'Payment methods' },
              ],
            },
          ],
        },
        { id: 'notifications', label: 'Notifications' },
        { id: 'integrations', label: 'Integrations' },
        { id: 'advanced', label: 'Advanced', disabled: true },
      ]}
      defaultExpanded={['account', 'billing']}
      defaultSelected="invoices"
    />
  ),
};

export const WithExpandControls = {
  render: () => (
    <Controlled
      items={NAV_TREE}
      showExpandControls
      aria-label="Navigation"
    />
  ),
};

const DRAGGABLE_ITEMS = [
  {
    id: 'hero', label: 'Hero section', icon: 'crop_free',
    children: [
      { id: 'hero-heading', label: 'Heading', icon: 'title' },
      { id: 'hero-para', label: 'Paragraph', icon: 'notes' },
      { id: 'hero-cta', label: 'Button', icon: 'smart_button' },
    ],
  },
  {
    id: 'content', label: 'Content section', icon: 'crop_free',
    children: [
      {
        id: 'card-grid', label: 'Card grid', icon: 'view_agenda',
        children: [
          { id: 'card-a', label: 'Card A', icon: 'article' },
          { id: 'card-b', label: 'Card B', icon: 'article' },
          { id: 'card-c', label: 'Card C', icon: 'article' },
        ],
      },
    ],
  },
  { id: 'footer', label: 'Footer', icon: 'web_asset' },
];

function DraggableWrapper() {
  const [items, setItems] = useState(DRAGGABLE_ITEMS);
  const [selectedId, setSelectedId] = useState(null);

  function handleMove({ draggedId, targetId, position }) {
    setItems((prev) => moveItem(prev, draggedId, targetId, position));
  }

  return (
    <div style={{ width: 280 }}>
      <TreeMenu
        items={items}
        selectedId={selectedId}
        onSelect={setSelectedId}
        defaultExpandedIds={['hero', 'content', 'card-grid']}
        draggable
        onMove={handleMove}
        aria-label="Page structure"
      />
    </div>
  );
}

export const Draggable = {
  render: () => <DraggableWrapper />,
};

export const DeepNesting = {
  render: () => (
    <Controlled
      items={[
        {
          id: 'l1',
          label: 'Level 1',
          icon: 'folder',
          children: [
            {
              id: 'l2',
              label: 'Level 2',
              icon: 'folder',
              children: [
                {
                  id: 'l3',
                  label: 'Level 3',
                  icon: 'folder',
                  children: [
                    {
                      id: 'l4',
                      label: 'Level 4',
                      icon: 'folder',
                      children: [
                        { id: 'l5', label: 'Deep item', icon: 'description' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ]}
      defaultExpanded={['l1', 'l2', 'l3', 'l4']}
      defaultSelected="l5"
    />
  ),
};

// ── Inline rename ─────────────────────────────────────────────────────────────

function renameItem(items, id, label) {
  return items.map((item) => {
    if (item.id === id) return { ...item, label };
    if (item.children?.length) return { ...item, children: renameItem(item.children, id, label) };
    return item;
  });
}

function RenamableWrapper() {
  const [items, setItems] = useState(DRAGGABLE_ITEMS);
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  return (
    <div style={{ width: 280 }}>
      <p style={{ margin: '0 0 12px', color: 'var(--semantic-color-text-muted)', fontSize: 14 }}>
        Double-click an item (or press F2, or right-click) to rename it inline. Enter or blur commits; Escape cancels.
      </p>
      <TreeMenu
        items={items}
        selectedId={selectedId}
        onSelect={setSelectedId}
        defaultExpandedIds={['hero', 'content', 'card-grid']}
        editingId={editingId}
        onRenameStart={setEditingId}
        onItemContextMenu={(id) => setEditingId(id)}
        onRenameCommit={(id, label) => { setItems((prev) => renameItem(prev, id, label)); setEditingId(null); }}
        onRenameCancel={() => setEditingId(null)}
        aria-label="Page structure"
      />
    </div>
  );
}

export const Renamable = {
  name: 'Inline rename',
  render: () => <RenamableWrapper />,
};
