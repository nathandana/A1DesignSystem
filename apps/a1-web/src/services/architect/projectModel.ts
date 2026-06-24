/**
 * Virtual Information Architect — project target enumeration.
 *
 * `listArchitectTargets()` returns every auditable target: the a1-web main menu first,
 * then one entry per project. The panel's SelectField maps these to `auditNav(getMainMenu())`
 * or `auditNav(projectNavModel(id))`.
 *
 * `projectNavModel` builds a `NavModel` from a project's flat `ProjectPage[]` list by
 * assembling the parentId/order hierarchy, so the IA heuristics (depth, breadth, naming,
 * home affordance) can be run on the project's page structure just like on the main menu.
 */
import { loadProjects, loadPages } from '../../projects/projectStore';
import type { NavModel, NavNode } from './types';

// ── Target shape ──────────────────────────────────────────────────────────────

export interface ArchitectTarget {
  /** Opaque SelectField value: 'menu' | 'project:<id>'. */
  value: string;
  /** Human label shown in the dropdown. */
  label: string;
  projectId?: string;
}

// ── Target list ───────────────────────────────────────────────────────────────

/**
 * Returns every available IA audit target: the main menu first, then one entry per
 * project (sorted by creation order).
 */
export function listArchitectTargets(): ArchitectTarget[] {
  const targets: ArchitectTarget[] = [{ value: 'menu', label: 'Main menu' }];
  for (const proj of loadProjects()) {
    if (!loadPages(proj.id).length) continue;
    targets.push({ value: `project:${proj.id}`, label: proj.name, projectId: proj.id });
  }
  return targets;
}

// ── Project nav model ─────────────────────────────────────────────────────────

/**
 * Build a `NavModel` from a project's flat page list using `parentId` and `order`.
 * Top-level pages (parentId null/undefined) become the root items; child pages nest
 * under their parent. The resulting tree mirrors what a real project nav would look like.
 */
export function projectNavModel(projectId: string): NavModel {
  const projects = loadProjects();
  const project = projects.find((p) => p.id === projectId);
  const pages = loadPages(projectId);

  // Group pages by their parent id.
  const byParent = new Map<string | null, typeof pages>();
  for (const pg of pages) {
    const key = pg.parentId ?? null;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key)!.push(pg);
  }
  // Sort within each group by the `order` field.
  for (const group of byParent.values()) {
    group.sort((a, b) => a.order - b.order);
  }

  function toNavNode(pg: (typeof pages)[number]): NavNode {
    return {
      id: pg.id,
      label: pg.title || 'Untitled',
      icon: pg.icon,
      children: (byParent.get(pg.id) ?? []).map(toNavNode),
    };
  }

  return {
    id: projectId,
    name: project?.name ?? 'Project',
    items: (byParent.get(null) ?? []).map(toNavNode),
  };
}
