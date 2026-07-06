/**
 * The a1-web **main menu** as a NavModel for the Virtual Information Architect to audit.
 *
 * This mirrors the top-level `navItems` built in `main.jsx` (TopHeader). The dynamic parts —
 * Foundations and Components — are read from the same source data the real menu uses
 * (`foundations`, `componentCategories`), so they never drift. The small static parts
 * (Explore, Editors) are reproduced here as a snapshot; if those menu sections change in
 * `main.jsx`, update this model to match.
 */
import { componentCategories } from '../../pages/components/data.js';
import { foundations } from '../../pages/foundations';
import type { NavModel, NavNode } from './types';

interface FoundationLike { id: string; title: string; icon?: string }
interface ComponentLike { id: string; title: string }
interface CategoryLike { id: string; title: string; icon?: string; components: ComponentLike[] }

const COMPONENT_ROUTE_SLUGS: Record<string, string> = {
  'action-tile': 'action-tiles',
  overlay: 'overlay-component',
};

function componentRouteSlug(componentId: string): string {
  return COMPONENT_ROUTE_SLUGS[componentId] ?? componentId;
}

const EXPLORE: NavNode = {
  id: 'explore',
  label: 'Explore',
  children: [
    { id: 'about', label: 'About', icon: 'info', href: '/about' },
    { id: 'accessibility', label: 'Accessibility', icon: 'accessibility', href: '/accessibility' },
    { id: 'features', label: 'Features', icon: 'star', href: '/features' },
    { id: 'get-started', label: 'Get started', icon: 'rocket_launch', href: '/get-started' },
    { id: 'releases', label: 'Releases', icon: 'new_releases', href: '/releases' },
  ],
};

/** Editor group — snapshot of the Editor submenu in main.jsx (user projects omitted). */
const EDITOR: NavNode = {
  id: 'editor',
  label: 'Editors',
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
  { label: 'Visualize', icon: 'visibility', ids: ['foundation-color-visualization', 'foundation-system-map'] },
  { label: 'Visual', icon: 'palette', ids: ['foundation-color', 'foundation-elevation', 'foundation-motion', 'foundation-shape', 'foundation-size', 'foundation-type-scale'] },
  { label: 'Content', icon: 'article', ids: ['foundation-iconography', 'foundation-labels'] },
  { label: 'Layout', icon: 'dashboard', ids: ['foundation-responsive', 'foundation-utilities', 'foundation-z-index'] },
  { label: 'Standards', icon: 'verified', ids: ['foundation-accessibility', 'foundation-prop-conventions'] },
];

function foundationsGroup(): NavNode {
  const byId = Object.fromEntries((foundations as FoundationLike[]).map((f) => [f.id, f]));
  return {
    id: 'foundations',
    label: 'Foundations',
    children: [
      { id: 'foundations', label: 'Overview', icon: 'foundation', href: '/foundations' },
      ...FOUNDATION_GROUPS.map(({ label, icon, ids }) => ({
        label,
        icon,
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
        children: cat.components.map((c) => ({ id: c.id, label: c.title, href: `/components/${componentRouteSlug(c.id)}` })),
      })),
    ],
  };
}

/** Build the main menu NavModel (reads live foundation/component data at call time). */
export function getMainMenu(): NavModel {
  return {
    id: 'main-menu',
    name: 'Main menu',
    items: [
      EXPLORE,
      foundationsGroup(),
      componentsGroup(),
      EDITOR,
    ],
  };
}
