/**
 * Build the auto-generated TopHeader `navItems` from a project's page hierarchy.
 *
 * - Level-1 pages become top-level header items.
 * - A level-1 page with children becomes a dropdown whose first entry links to
 *   the page itself (so it stays reachable), followed by its level-2 children.
 * - Level-2 pages with children nest a further submenu of level-3 pages.
 *
 * The nested-`items` shape mirrors the hand-authored navItems in `main.jsx`.
 */
import type { ProjectPage } from './projectStore';

export interface ProjectNavOptions {
  activePageId?: string | null;
  /** Navigate to a page (called on a plain left click). */
  onNavigate: (pageId: string) => void;
  /** Build the anchor href for a page (drives middle-click / open-in-new-tab). */
  hrefFor: (pageId: string) => string;
}

interface NavLeaf {
  icon?: string;
  label: string;
  href: string;
  active?: boolean;
  onClick: (e: MouseEvent) => void;
  items?: NavLeaf[];
}

export interface ProjectNavItem {
  id: string;
  label: string;
  active?: boolean;
  href?: string;
  onClick?: (e: MouseEvent) => void;
  items?: (NavLeaf | { divider: true })[];
}

function isPlainLeftClick(e: MouseEvent): boolean {
  return e.button === 0 && !e.metaKey && !e.altKey && !e.ctrlKey && !e.shiftKey;
}

function childrenOf(pages: ProjectPage[], parentId: string | null): ProjectPage[] {
  return pages.filter((p) => p.parentId === parentId).sort((a, b) => a.order - b.order);
}

function descendantIds(pages: ProjectPage[], id: string): string[] {
  const out: string[] = [];
  const walk = (parentId: string) => {
    for (const p of pages) if (p.parentId === parentId) { out.push(p.id); walk(p.id); }
  };
  walk(id);
  return out;
}

function isBranchActive(pages: ProjectPage[], id: string, activeId?: string | null): boolean {
  if (!activeId) return false;
  return id === activeId || descendantIds(pages, id).includes(activeId);
}

function linkProps(page: ProjectPage, opts: ProjectNavOptions) {
  return {
    href: opts.hrefFor(page.id),
    onClick: (e: MouseEvent) => {
      if (!isPlainLeftClick(e)) return; // let modifier/middle clicks open the href
      e.preventDefault();
      opts.onNavigate(page.id);
    },
  };
}

function menuItem(page: ProjectPage, pages: ProjectPage[], opts: ProjectNavOptions): NavLeaf {
  const kids = childrenOf(pages, page.id);
  const item: NavLeaf = {
    icon: page.icon || 'description',
    label: page.title || 'Untitled',
    active: page.id === opts.activePageId,
    ...linkProps(page, opts),
  };
  if (kids.length) item.items = kids.map((k) => menuItem(k, pages, opts));
  return item;
}

export function buildProjectNav(pages: ProjectPage[], opts: ProjectNavOptions): ProjectNavItem[] {
  return childrenOf(pages, null).map((root) => {
    const kids = childrenOf(pages, root.id);
    const link = linkProps(root, opts);
    const active = isBranchActive(pages, root.id, opts.activePageId);

    if (!kids.length) {
      return { id: root.id, label: root.title || 'Untitled', active, ...link };
    }

    return {
      id: root.id,
      label: root.title || 'Untitled',
      active,
      items: [
        { icon: root.icon || 'description', label: root.title || 'Untitled', active: root.id === opts.activePageId, ...link },
        { divider: true } as const,
        ...kids.map((k) => menuItem(k, pages, opts)),
      ],
    };
  });
}
