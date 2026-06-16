import { useState } from 'react';
import { Paragraph, Section, Stack } from '../../index.js';
import { ContextMenu } from './ContextMenu.jsx';

const FILE_ITEMS = [
  { id: 'open', label: 'Open', icon: 'folder_open', onClick: () => {} },
  { id: 'rename', label: 'Rename', icon: 'edit', shortcut: 'F2', onClick: () => {} },
  { id: 'copy', label: 'Copy', icon: 'content_copy', shortcut: '⌘C', onClick: () => {} },
  { id: 'paste', label: 'Paste', icon: 'content_paste', shortcut: '⌘V', onClick: () => {} },
  { type: 'divider', id: 'sep1' },
  { id: 'delete', label: 'Delete', icon: 'delete', shortcut: '⌦', variant: 'destructive', onClick: () => {} },
];

const EDITOR_ITEMS = [
  { type: 'group', id: 'heading', label: 'Select element' },
  { id: 'heading-el', label: 'Heading', icon: 'title', active: true, onClick: () => {} },
  { id: 'section-el', label: 'Section', icon: 'crop_free', onClick: () => {} },
  { id: 'page-el', label: 'PageLayout', icon: 'web', onClick: () => {} },
  { type: 'divider', id: 'sep' },
  { id: 'delete', label: 'Delete Heading', icon: 'delete', shortcut: '⌦', variant: 'destructive', onClick: () => {} },
];

function Trigger({ children, items, label }) {
  const [menu, setMenu] = useState(null);
  return (
    <div
      onContextMenu={(e) => { e.preventDefault(); setMenu({ x: e.clientX, y: e.clientY }); }}
      style={{ cursor: 'context-menu' }}
    >
      <ContextMenu
        open={!!menu}
        x={menu?.x ?? 0}
        y={menu?.y ?? 0}
        items={items}
        onClose={() => setMenu(null)}
        aria-label={label}
      />
      {children}
    </div>
  );
}

const meta = {
  title: 'Overlay/ContextMenu',
  component: ContextMenu,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Right-click context menu portaled to document.body. Controlled via `open`, `x`, and `y` props set from the host element\'s `onContextMenu` handler. Closes on outside click or Escape.',
      },
    },
  },
  argTypes: {
    open: { control: 'boolean' },
    x: { control: 'number' },
    y: { control: 'number' },
  },
};

export default meta;

export const Default = {
  render: () => (
    <Trigger items={FILE_ITEMS} label="File actions">
      <Section padding="md" surface="panel" radius="md">
        <Paragraph color="muted">Right-click anywhere in this area to open the context menu.</Paragraph>
      </Section>
    </Trigger>
  ),
};

export const EditorStyle = {
  render: () => (
    <Trigger items={EDITOR_ITEMS} label="Element actions">
      <Section padding="md" surface="panel" radius="md">
        <Paragraph color="muted">Right-click to choose which overlapping element to select or delete.</Paragraph>
      </Section>
    </Trigger>
  ),
};

export const StaticPreview = {
  name: 'Static preview',
  render: () => (
    <Stack direction="row" gap="xl">
      <div style={{ position: 'relative', height: 280 }}>
        <ContextMenu
          open
          x={0}
          y={0}
          items={FILE_ITEMS}
          onClose={() => {}}
          aria-label="File actions"
        />
      </div>
      <div style={{ position: 'relative', height: 280 }}>
        <ContextMenu
          open
          x={0}
          y={0}
          items={EDITOR_ITEMS}
          onClose={() => {}}
          aria-label="Element actions"
        />
      </div>
    </Stack>
  ),
  parameters: { docs: { description: { story: 'Shows both menu variants side by side without needing a right-click.' } } },
};
