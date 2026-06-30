/**
 * Virtual Designer — target enumeration and page-node readers.
 *
 * `listDesignTargets()` returns every auditable target in order: the foundation token
 * scales first, then one entry per project (aggregate of all pages), then one entry
 * per page. The panel's SelectField maps these to the right `auditDesign` /
 * `auditProject` / `auditPage` call.
 *
 * `readPageNodes` and `projectPagesWithNodes` are the low-level readers that extract
 * ComponentNode trees from the localStorage-backed page JSON.
 */
import type { ComponentNode } from '../../editor/pageTypes';
import { loadProjects, loadPages, resolvePageJson } from '../../projects/projectStore';

// ── Target shape ──────────────────────────────────────────────────────────────

export interface DesignTarget {
  /** Opaque value used in the SelectField: 'tokens' | 'project:<id>' | 'page:<id>'. */
  value: string;
  /** Human label shown in the dropdown. */
  label: string;
  projectId?: string;
  projectName?: string;
}

// ── Target list ───────────────────────────────────────────────────────────────

/**
 * Returns every available design review target: tokens first, then one aggregate
 * entry per project, then one entry per page across all projects (sorted by project
 * then page order).
 */
export function listDesignTargets(): DesignTarget[] {
  const targets: DesignTarget[] = [{ value: 'tokens', label: 'Design tokens' }];

  const projects = loadProjects();
  for (const proj of projects) {
    const pages = loadPages(proj.id);
    if (!pages.length) continue;
    targets.push({ value: `project:${proj.id}`, label: `${proj.name} — all pages`, projectId: proj.id, projectName: proj.name });
    for (const pg of pages) {
      targets.push({
        value: `page:${pg.id}`,
        label: `${proj.name} / ${pg.title || 'Untitled'}`,
        projectId: proj.id,
        projectName: proj.name,
      });
    }
  }

  return targets;
}

// ── Page node readers ─────────────────────────────────────────────────────────

/**
 * Parse a page's stored JSON and return the flat ComponentNode list from all regions.
 * Returns [] if the page has no content or the JSON is malformed.
 */
export function readPageNodes(pageId: string): ComponentNode[] {
  const json = resolvePageJson(pageId);
  if (!json) return [];
  try {
    const def = JSON.parse(json);
    const regions: any[] = def?.page?.layout?.regions;
    if (!Array.isArray(regions)) return [];
    return regions.flatMap((r) => (Array.isArray(r.nodes) ? r.nodes : [])) as ComponentNode[];
  } catch {
    return [];
  }
}

/**
 * Return every page in a project with its parsed ComponentNode list, skipping pages
 * that have no content.
 */
export function projectPagesWithNodes(projectId: string): { id: string; title: string; nodes: ComponentNode[] }[] {
  return loadPages(projectId).map((pg) => ({
    id: pg.id,
    title: pg.title || 'Untitled',
    nodes: readPageNodes(pg.id),
  }));
}
