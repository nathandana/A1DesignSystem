/**
 * The a1-web **main menu** as a NavModel for the Virtual Information Architect to audit.
 *
 * This mirrors the top-level `navItems` built in `main.jsx` (TopHeader). The dynamic parts —
 * Foundations and Components — are read from the same source data the real menu uses
 * (`foundations`, `componentCategories`), so they never drift. The small static parts
 * (Resources, Editor) are reproduced here as a snapshot; if those menu sections change in
 * `main.jsx`, update this model to match.
 */
import { componentCategories } from '../../pages/components/data.js';
import { foundations } from '../../pages/foundations';
import type { NavModel, NavNode } from './types';

interface FoundationLike { id: string; title: string; icon?: string }
interface ComponentLike { id: string; title: string }
interface CategoryLike { id: string; title: string; icon?: string; components: ComponentLike[] }

/** Resources group — snapshot of RESOURCE_PAGE_IDS / ICONS / PAGE_TITLES in main.jsx. */
const RESOURCES: NavNode = {
  id: 'resources',
  label: 'Resources',
  children: [
    { id: 'features', label: 'Features', icon: 'star', href: '/features' },
    { id: 'get-started', label: 'Get Started', icon: 'rocket_launch', href: '/get-started' },
    { id: 'help', label: 'Help', icon: 'help', href: '/help' },
    { id: 'backlog', label: 'Backlog', icon: 'task_alt', href: '/backlog' },
    { id: 'accessibility', label: 'Accessibility', icon: 'accessibility', href: '/accessibility' },
    { id: 'releases', label: 'Releases', icon: 'new_releases', href: '/releases' },
    { id: 'about', label: 'About', icon: 'info', href: '/about' },
  ],
};

/** Editor group — snapshot of the Editor submenu in main.jsx (user projects omitted). */
const EDITOR: NavNode = {
  id: 'editor',
  label: 'Editor',
  children: [
    {
      id: 'projects', label: 'Projects', icon: 'folder',
      children: [{ id: 'all-projects', label: 'All projects', icon: 'grid_view', href: '/editor' }],
    },
    { id: 'patterns', label: 'Patterns', icon: 'dashboard_customize', href: '/patterns' },
    { id: 'image-library', label: 'Image library', icon: 'photo_library', href: '/image-library' },
    { id: 'theme-editor', label: 'Theme', icon: 'palette', href: '/theme-editor' },
    { id: 'rules', label: 'Rules', icon: 'gavel', href: '/rules' },
  ],
};

const FOUNDATION_GROUPS = [
  { label: 'Visualize', ids: ['foundation-color-visualization', 'foundation-system-map'] },
  { label: 'Visual', ids: ['foundation-color', 'foundation-elevation', 'foundation-motion', 'foundation-shape', 'foundation-size', 'foundation-type-scale'] },
  { label: 'Content', ids: ['foundation-iconography', 'foundation-labels'] },
  { label: 'Layout', ids: ['foundation-responsive', 'foundation-utilities', 'foundation-z-index'] },
  { label: 'Standards', ids: ['foundation-accessibility', 'foundation-prop-conventions'] },
];

function foundationsGroup(): NavNode {
  const byId = Object.fromEntries((foundations as FoundationLike[]).map((f) => [f.id, f]));
  return {
    id: 'foundations',
    label: 'Foundations',
    children: [
      { id: 'foundations', label: 'Overview', icon: 'foundation', href: '/foundations' },
      ...FOUNDATION_GROUPS.map(({ label, ids }) => ({
        label,
        children: ids
          .map((id) => byId[id])
          .filter(Boolean)
          .sort((a, b) => a.title.localeCompare(b.title))
          .map((f) => ({ id: f.id, label: f.title, icon: f.icon, href: `/foundations/${f.id.slice('foundation-'.length)}` })),
      })),
    ],
  };
}

function componentsGroup(): NavNode {
  return {
    id: 'components',
    label: 'Components',
    children: [
      { id: 'components', label: 'Overview', icon: 'widgets', href: '/components' },
      ...(componentCategories as CategoryLike[]).map((cat) => ({
        id: cat.id,
        label: cat.title,
        icon: cat.icon,
        href: `/components/${cat.id}`,
        // Leaf component items carry no icon in the real menu — kept faithful here.
        children: cat.components.map((c) => ({ id: c.id, label: c.title, href: `/components/${c.id}` })),
      })),
    ],
  };
}

/** Build the main menu NavModel (reads live foundation/component data at call time). */
export function getMainMenu(): NavModel {
  return {
    id: 'main-menu',
    name: 'Main menu',
    items: [RESOURCES, foundationsGroup(), componentsGroup(), EDITOR],
  };
}
