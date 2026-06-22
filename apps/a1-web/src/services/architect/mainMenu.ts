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
    { id: 'features', label: 'Features', icon: 'star', href: '/?page=features' },
    { id: 'get-started', label: 'Get Started', icon: 'rocket_launch', href: '/?page=get-started' },
    { id: 'help', label: 'Help', icon: 'help', href: '/?page=help' },
    { id: 'backlog', label: 'Backlog', icon: 'task_alt', href: '/?page=backlog' },
    { id: 'accessibility', label: 'Accessibility', icon: 'accessibility', href: '/?page=accessibility' },
    { id: 'releases', label: 'Releases', icon: 'new_releases', href: '/?page=releases' },
    { id: 'about', label: 'About', icon: 'info', href: '/?page=about' },
  ],
};

/** Editor group — snapshot of the Editor submenu in main.jsx (user projects omitted). */
const EDITOR: NavNode = {
  id: 'editor',
  label: 'Editor',
  children: [
    {
      id: 'projects', label: 'Projects', icon: 'folder',
      children: [{ id: 'all-projects', label: 'All projects', icon: 'grid_view', href: '/?page=editor' }],
    },
    { id: 'patterns', label: 'Patterns', icon: 'dashboard_customize', href: '/?page=patterns' },
    { id: 'image-library', label: 'Image library', icon: 'photo_library', href: '/?page=image-library' },
    { id: 'theme-editor', label: 'Theme', icon: 'palette', href: '/?page=theme-editor' },
    { id: 'rules', label: 'Rules', icon: 'gavel', href: '/?page=rules' },
  ],
};

function foundationsGroup(): NavNode {
  return {
    id: 'foundations',
    label: 'Foundations',
    children: [
      { id: 'foundations', label: 'Overview', icon: 'foundation', href: '/?page=foundations' },
      ...(foundations as FoundationLike[]).map((f) => ({
        id: f.id, label: f.title, icon: f.icon, href: `/?page=${f.id}`,
      })),
    ],
  };
}

function componentsGroup(): NavNode {
  return {
    id: 'components',
    label: 'Components',
    children: [
      { id: 'components', label: 'Overview', icon: 'widgets', href: '/?page=components' },
      ...(componentCategories as CategoryLike[]).map((cat) => ({
        id: cat.id,
        label: cat.title,
        icon: cat.icon,
        href: `/?page=components-${cat.id}`,
        // Leaf component items carry no icon in the real menu — kept faithful here.
        children: cat.components.map((c) => ({ id: c.id, label: c.title, href: `/?page=component-${c.id}` })),
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
