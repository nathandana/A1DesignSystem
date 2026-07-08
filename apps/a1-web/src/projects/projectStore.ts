/**
 * Project store — the data layer for the editor's Projects feature.
 *
 * A **Project** groups an isolated set of **pages** into a small site. Each page
 * has nav metadata (title, icon, description) plus a place in a hierarchy
 * (`parentId` + `order`). The hierarchy is the single source of truth: a page's
 * **level** (1–3) is the depth of its `parentId` chain, never stored, and capped
 * at 3 so the generated TopHeader has at most three menu levels.
 *
 * Page *content* is unchanged — it still lives under `a1-editor-versions-${id}` /
 * `a1-editor-history-${id}` keyed by the globally-unique page id. The project's
 * page list is what scopes a page to one project, which is what makes projects
 * isolated from one another.
 *
 * Everything persists as JSON in localStorage via the shared (gzip-compressed)
 * storage helpers.
 */
import { readStored, writeStored } from '../editor/storage';
import { EDITOR_EXAMPLES, makeBlankPage } from '../editor/examples/index';
import type { PageDefinition } from '../editor/pageTypes';
import { LAYOUT_DOC_ID, defaultLayoutDefinition } from './projectLayout';
import {
  restaurantProject,
  restaurantPages,
  restaurantContent,
  RESTAURANT_PROJECT_ID,
  RESTAURANT_SEED_FLAG,
} from './sampleRestaurant';
import {
  vehicleProject,
  vehiclePages,
  vehicleContent,
  VEHICLE_PROJECT_ID,
  VEHICLE_PROJECT_SEED_FLAG,
} from './sampleVehicles';

export interface Project {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  /** Optional project-level theme applied to project pages/prototypes only. */
  theme?: string;
  /** Free-form project metadata (e.g. SEO `metaTitle` / `metaDescription`). */
  meta?: Record<string, string>;
  /** Per-project label overrides. Key = dot-notation label path; value = map of locale code → translation string. */
  labelOverrides?: Record<string, Record<string, string>>;
  /** Archived projects are hidden from the projects list (soft delete). Restorable. */
  archived?: boolean;
  /** Primary navigation style for the project's prototype: an auto TopHeader
   *  (default) or a left sidebar (SideNav + TreeMenu from the page hierarchy). */
  navStyle?: 'header' | 'sidebar';
  /** Stable standalone prototype path metadata. Local/workspace publish only. */
  published?: {
    slug: string;
    publishedAt: number;
    updatedAt: number;
  };
  createdAt: number;
  updatedAt: number;
}

export interface ProjectPage {
  id: string;
  title: string;
  icon?: string;
  description?: string;
  parentId: string | null;
  order: number;
}

export const MAX_LEVEL = 3;

const PROJECTS_KEY = 'a1-projects';
const ACTIVE_PROJECT_KEY = 'a1-active-project';
const pagesKey = (projectId: string) => `a1-project-${projectId}-pages`;
const layoutKey = (projectId: string) => `a1-project-${projectId}-layout`;
const versionsKey = (pageId: string) => `a1-editor-versions-${pageId}`;
const historyKey = (pageId: string) => `a1-editor-history-${pageId}`;

function uid(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    || 'project';
}

function uniquePublishedSlug(projects: Project[], projectId: string, name: string): string {
  const base = slugify(name);
  const used = new Set(
    projects
      .filter((project) => project.id !== projectId)
      .map((project) => project.published?.slug)
      .filter((slug): slug is string => !!slug),
  );
  if (!used.has(base)) return base;
  let suffix = 2;
  while (used.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}

// ── Projects ────────────────────────────────────────────────────────────────

export function loadProjects(): Project[] {
  migrate();
  ensureSampleProjects();
  try {
    const raw = readStored(PROJECTS_KEY);
    // Archived projects are soft-deleted — hidden from the active list.
    return raw ? (JSON.parse(raw) as Project[]).filter((p) => !p.archived) : [];
  } catch {
    return [];
  }
}

/** Every archived (soft-deleted) project, for the "Archived" list. */
export function loadArchivedProjects(): Project[] {
  return loadProjectsRaw().filter((p) => p.archived);
}

/** Soft-delete a project: hide it from the active list, keep its data. Restorable. */
export function archiveProject(id: string): void {
  const projects = loadProjectsRaw().map((p) =>
    p.id === id ? { ...p, archived: true, updatedAt: Date.now() } : p);
  saveProjects(projects);
}

/** Restore an archived project back to the active list. */
export function unarchiveProject(id: string): void {
  const projects = loadProjectsRaw().map((p) => {
    if (p.id !== id) return p;
    const { archived: _archived, ...rest } = p;
    return { ...rest, updatedAt: Date.now() };
  });
  saveProjects(projects);
}

export function saveProjects(projects: Project[]): void {
  writeStored(PROJECTS_KEY, JSON.stringify(projects));
}

export function createProject(input: { name: string; description?: string; icon?: string; theme?: string; navStyle?: 'header' | 'sidebar' }): Project {
  const now = Date.now();
  const project: Project = {
    id: uid('proj'),
    name: input.name.trim() || 'Untitled project',
    description: input.description?.trim() || undefined,
    icon: input.icon || 'folder',
    theme: input.theme || undefined,
    navStyle: input.navStyle && input.navStyle !== 'header' ? input.navStyle : undefined,
    createdAt: now,
    updatedAt: now,
  };
  // Use the raw list (incl. archived) so a create never drops archived projects.
  const projects = loadProjectsRaw();
  saveProjects([...projects, project]);
  savePages(project.id, []);
  return project;
}

export function updateProject(id: string, patch: Partial<Omit<Project, 'id' | 'createdAt'>>): Project[] {
  // Raw list so updates preserve archived projects (and can target one).
  const projects = loadProjectsRaw().map((p) =>
    p.id === id ? { ...p, ...patch, updatedAt: Date.now() } : p,
  );
  saveProjects(projects);
  return projects;
}

/** Publish a project to a stable local/workspace prototype URL (`/p/{slug}`). */
export function publishProject(id: string): Project[] {
  const projects = loadProjectsRaw();
  const now = Date.now();
  const next = projects.map((project) => {
    if (project.id !== id) return project;
    const slug = project.published?.slug ?? uniquePublishedSlug(projects, project.id, project.name);
    return {
      ...project,
      published: {
        slug,
        publishedAt: project.published?.publishedAt ?? now,
        updatedAt: now,
      },
      updatedAt: now,
    };
  });
  saveProjects(next);
  return next;
}

/** Remove the stable published URL while keeping project content intact. */
export function unpublishProject(id: string): Project[] {
  const projects = loadProjectsRaw().map((project) => {
    if (project.id !== id) return project;
    const { published: _published, ...rest } = project;
    return { ...rest, updatedAt: Date.now() };
  });
  saveProjects(projects);
  return projects;
}

export function getPublishedProjectBySlug(slug: string | null | undefined): Project | null {
  if (!slug) return null;
  return loadProjects().find((project) => project.published?.slug === slug) ?? null;
}

export function getPublishedProjectPath(project: Project, pageId?: string | null): string {
  const slug = project.published?.slug;
  if (!slug) return '';
  return `/p/${encodeURIComponent(slug)}${pageId ? `/${encodeURIComponent(pageId)}` : ''}`;
}

/** The project's image & illustration style note (used to seed AI image prompts). */
export function getProjectImageStyle(id: string | null | undefined): string | undefined {
  if (!id) return undefined;
  return loadProjects().find((p) => p.id === id)?.meta?.imageStyle || undefined;
}

/** Delete a project and (optionally) every page's stored content. */
export function deleteProject(id: string, { purgeContent = true } = {}): Project[] {
  purgeProjectStorage(id, { purgeContent });
  const projects = loadProjectsRaw().filter((p) => p.id !== id);
  saveProjects(projects);
  return projects;
}

/** Duplicate a project, copying every page's metadata and content into new ids. */
export function duplicateProject(id: string): Project | null {
  const source = loadProjects().find((p) => p.id === id);
  if (!source) return null;
  const copy = createProject({ name: `${source.name} copy`, description: source.description, icon: source.icon, theme: source.theme });
  const idMap = new Map<string, string>();
  const srcPages = loadPages(id);
  srcPages.forEach((p) => idMap.set(p.id, uid('page')));
  const newPages: ProjectPage[] = srcPages.map((p) => ({
    ...p,
    id: idMap.get(p.id)!,
    parentId: p.parentId ? idMap.get(p.parentId)! ?? null : null,
  }));
  newPages.forEach((np, i) => seedPageContent(np.id, resolvePageJson(srcPages[i].id), np.title));
  savePages(copy.id, newPages);
  return copy;
}

export function getActiveProjectId(): string | null {
  try { return readStored(ACTIVE_PROJECT_KEY); } catch { return null; }
}

export function setActiveProjectId(id: string | null): void {
  if (id) writeStored(ACTIVE_PROJECT_KEY, id);
  else try { localStorage.removeItem(ACTIVE_PROJECT_KEY); } catch { /* ignore */ }
}

// ── Shared layout (project chrome) ────────────────────────────────────────────

export { LAYOUT_DOC_ID } from './projectLayout';

/** The project's shared-layout definition JSON, seeding a default the first time. */
export function loadProjectLayout(projectId: string): string {
  try {
    const raw = readStored(layoutKey(projectId));
    if (raw) return raw;
  } catch { /* ignore */ }
  const name = loadProjects().find((p) => p.id === projectId)?.name ?? 'My project';
  const json = JSON.stringify(defaultLayoutDefinition(name), null, 2);
  try { writeStored(layoutKey(projectId), json); } catch { /* ignore */ }
  return json;
}

export function saveProjectLayout(projectId: string, json: string): void {
  writeStored(layoutKey(projectId), json);
  touchProject(projectId);
}

// ── Pages ──────────────────────────────────────────────────────────────────

export function loadPages(projectId: string): ProjectPage[] {
  try {
    const raw = readStored(pagesKey(projectId));
    return raw ? (JSON.parse(raw) as ProjectPage[]) : [];
  } catch {
    return [];
  }
}

export function savePages(projectId: string, pages: ProjectPage[]): void {
  writeStored(pagesKey(projectId), JSON.stringify(reindex(pages)));
  touchProject(projectId);
}

/** Create a new page in the project, seeding blank content. `parentId`/`afterId`
 *  place it in the tree; the depth is clamped so it never exceeds level 3. */
export function addPage(
  projectId: string,
  { parentId = null, afterId = null, title = 'Untitled' }:
    { parentId?: string | null; afterId?: string | null; title?: string } = {},
): { pages: ProjectPage[]; page: ProjectPage } {
  const pages = loadPages(projectId);
  let resolvedParent = parentId;
  // Never create a page deeper than the max level.
  if (resolvedParent && getLevel(pages, resolvedParent) >= MAX_LEVEL) {
    resolvedParent = pages.find((p) => p.id === resolvedParent)?.parentId ?? null;
  }
  const siblings = childrenOf(pages, resolvedParent);
  const afterIndex = afterId ? siblings.findIndex((p) => p.id === afterId) : siblings.length - 1;
  const order = afterIndex >= 0 ? siblings[afterIndex].order + 0.5 : siblings.length;
  const page: ProjectPage = { id: uid('page'), title, parentId: resolvedParent, order };
  seedPageContent(page.id, null, title);
  const next = reindex([...pages, page]);
  savePages(projectId, next);
  return { pages: next, page };
}

/** Duplicate a page (and its content) as a sibling directly after it. */
export function duplicatePage(projectId: string, pageId: string): { pages: ProjectPage[]; page: ProjectPage } | null {
  const pages = loadPages(projectId);
  const source = pages.find((p) => p.id === pageId);
  if (!source) return null;
  const page: ProjectPage = {
    ...source,
    id: uid('page'),
    title: `${source.title} copy`,
    order: source.order + 0.5,
  };
  seedPageContent(page.id, resolvePageJson(pageId), page.title);
  const next = reindex([...pages, page]);
  savePages(projectId, next);
  return { pages: next, page };
}

export function updatePage(projectId: string, pageId: string, patch: Partial<Omit<ProjectPage, 'id'>>): ProjectPage[] {
  const next = loadPages(projectId).map((p) => (p.id === pageId ? { ...p, ...patch } : p));
  savePages(projectId, next);
  return next;
}

/** Delete a page and all of its descendants; returns the remaining pages plus
 *  the ids that were removed (so the caller can purge content / pick a new
 *  active page). */
export function deletePage(projectId: string, pageId: string): { pages: ProjectPage[]; removedIds: string[] } {
  const pages = loadPages(projectId);
  const removedIds = [pageId, ...getDescendantIds(pages, pageId)];
  const removed = new Set(removedIds);
  const next = reindex(pages.filter((p) => !removed.has(p.id)));
  savePages(projectId, next);
  removedIds.forEach(purgePageContent);
  return { pages: next, removedIds };
}

// ── Hierarchy helpers ─────────────────────────────────────────────────────────

function childrenOf(pages: ProjectPage[], parentId: string | null): ProjectPage[] {
  return pages.filter((p) => p.parentId === parentId).sort((a, b) => a.order - b.order);
}

/** Reassign sequential integer `order` within each sibling group. */
function reindex(pages: ProjectPage[]): ProjectPage[] {
  const byParent = new Map<string | null, ProjectPage[]>();
  for (const p of pages) {
    const group = byParent.get(p.parentId) ?? [];
    group.push(p);
    byParent.set(p.parentId, group);
  }
  const result: ProjectPage[] = [];
  for (const group of byParent.values()) {
    group.sort((a, b) => a.order - b.order).forEach((p, i) => result.push({ ...p, order: i }));
  }
  return result;
}

function getLevel(pages: ProjectPage[], id: string): number {
  let level = 1;
  let current = pages.find((p) => p.id === id);
  while (current?.parentId) {
    level += 1;
    current = pages.find((p) => p.id === current!.parentId);
    if (level >= MAX_LEVEL) break;
  }
  return level;
}

export const getPageLevel = getLevel;

export function getDescendantIds(pages: ProjectPage[], id: string): string[] {
  const out: string[] = [];
  const walk = (parentId: string) => {
    for (const p of pages) {
      if (p.parentId === parentId) { out.push(p.id); walk(p.id); }
    }
  };
  walk(id);
  return out;
}

/** Number of levels occupied by the subtree rooted at `id` (a leaf = 1). */
function subtreeHeight(pages: ProjectPage[], id: string): number {
  const children = pages.filter((p) => p.parentId === id);
  if (!children.length) return 1;
  return 1 + Math.max(...children.map((c) => subtreeHeight(pages, c.id)));
}

/** True if placing `id`'s subtree under `parentId` (null = root) stays within
 *  the max level. */
function fitsUnder(pages: ProjectPage[], id: string, parentId: string | null): boolean {
  const parentDepth = parentId ? getLevel(pages, parentId) : 0;
  return parentDepth + subtreeHeight(pages, id) <= MAX_LEVEL;
}

/** Flatten the tree into document (pre-order) order with computed levels. */
function flatten(pages: ProjectPage[]): { page: ProjectPage; level: number }[] {
  const out: { page: ProjectPage; level: number }[] = [];
  const walk = (parentId: string | null, level: number) => {
    for (const p of childrenOf(pages, parentId)) {
      out.push({ page: p, level });
      walk(p.id, level + 1);
    }
  };
  walk(null, 1);
  return out;
}

/**
 * Apply a drag-and-drop move from TreeMenu. `position` is relative to `targetId`:
 * `into` makes it the last child of target; `before`/`after` make it a sibling.
 * Returns the new page list, or `null` if the move is invalid (onto itself, into
 * its own descendant, or it would exceed the max level).
 */
export function applyPageMove(
  pages: ProjectPage[],
  { draggedId, targetId, position }: { draggedId: string; targetId: string; position: 'before' | 'into' | 'after' },
): ProjectPage[] | null {
  if (draggedId === targetId) return null;
  const dragged = pages.find((p) => p.id === draggedId);
  const target = pages.find((p) => p.id === targetId);
  if (!dragged || !target) return null;
  if (getDescendantIds(pages, draggedId).includes(targetId)) return null;

  const newParentId = position === 'into' ? targetId : target.parentId;
  if (!fitsUnder(pages, draggedId, newParentId)) return null;

  // Rebuild the destination sibling group with the dragged page spliced in.
  const detached = pages.filter((p) => p.id !== draggedId);
  const siblings = childrenOf(detached, newParentId);
  let insertAt = siblings.length;
  if (position !== 'into') {
    const targetIdx = siblings.findIndex((p) => p.id === targetId);
    insertAt = position === 'before' ? targetIdx : targetIdx + 1;
  }
  const reordered = [...siblings];
  reordered.splice(insertAt, 0, { ...dragged, parentId: newParentId });
  reordered.forEach((p, i) => { p.order = i; });

  const others = detached.filter((p) => p.parentId !== newParentId);
  return reindex([...others, ...reordered]);
}

/** Re-parent a page so its derived level becomes `level` (1–3), by indenting
 *  under the nearest preceding page at `level-1`, or outdenting to root. Returns
 *  the new list, or the input unchanged if the level isn't reachable here. */
export function setPageLevel(pages: ProjectPage[], id: string, level: number): ProjectPage[] {
  const clamped = Math.max(1, Math.min(MAX_LEVEL, level));
  if (clamped === getLevel(pages, id)) return pages;

  let newParentId: string | null = null;
  if (clamped > 1) {
    const flat = flatten(pages);
    const selfIdx = flat.findIndex((e) => e.page.id === id);
    if (selfIdx === -1) return pages;
    const descendants = new Set(getDescendantIds(pages, id));
    let candidate: ProjectPage | null = null;
    for (let i = selfIdx - 1; i >= 0; i -= 1) {
      const entry = flat[i];
      if (entry.page.id === id || descendants.has(entry.page.id)) continue;
      if (entry.level === clamped - 1) { candidate = entry.page; break; }
    }
    if (!candidate) return pages; // no valid parent at that depth before this page
    newParentId = candidate.id;
  }

  if (!fitsUnder(pages, id, newParentId)) return pages;
  const moved = pages.map((p) => (p.id === id ? { ...p, parentId: newParentId, order: Number.MAX_SAFE_INTEGER } : p));
  return reindex(moved);
}

/** Levels (1–3) this page can validly move to, for enabling/disabling the Level
 *  control in the page editor. */
export function availableLevels(pages: ProjectPage[], id: string): number[] {
  const out: number[] = [];
  const flat = flatten(pages);
  const selfIdx = flat.findIndex((e) => e.page.id === id);
  const descendants = new Set(getDescendantIds(pages, id));
  for (let level = 1; level <= MAX_LEVEL; level += 1) {
    if (level === 1) {
      if (fitsUnder(pages, id, null)) out.push(level);
      continue;
    }
    // Need a preceding page at level-1 that isn't self/descendant, and the
    // subtree must still fit under it.
    let ok = false;
    for (let i = selfIdx - 1; i >= 0; i -= 1) {
      const entry = flat[i];
      if (entry.page.id === id || descendants.has(entry.page.id)) continue;
      if (entry.level === level - 1 && fitsUnder(pages, id, entry.page.id)) { ok = true; break; }
    }
    if (ok || level === getLevel(pages, id)) out.push(level);
  }
  return out;
}

// ── TreeMenu projection ───────────────────────────────────────────────────────

export interface PageTreeItem {
  id: string;
  label: string;
  icon: string;
  children?: PageTreeItem[];
}

/** Project the flat page list into nested TreeMenu items. Pages below the max
 *  level expose a (possibly empty) `children` array so they accept drop-into;
 *  level-3 pages are leaves. */
export function pagesToTreeItems(pages: ProjectPage[]): PageTreeItem[] {
  const build = (parentId: string | null, level: number): PageTreeItem[] =>
    childrenOf(pages, parentId).map((p) => {
      const kids = build(p.id, level + 1);
      const canHoldChildren = level < MAX_LEVEL;
      return {
        id: p.id,
        label: p.title || 'Untitled',
        icon: p.icon || 'description',
        children: kids.length ? kids : canHoldChildren ? [] : undefined,
      };
    });
  return build(null, 1);
}

// ── Page content seeding / resolution ──────────────────────────────────────────

function seedPageContent(pageId: string, json: string | null, title: string): void {
  const content = json ?? JSON.stringify(makeBlankPage(pageId, title), null, 2);
  const versionId = uid('v');
  writeStored(versionsKey(pageId), JSON.stringify({
    versions: [{ id: versionId, label: 'Base', json: content }],
    activeVersionId: versionId,
  }));
}

function purgePageContent(pageId: string): void {
  try {
    localStorage.removeItem(versionsKey(pageId));
    localStorage.removeItem(historyKey(pageId));
  } catch { /* ignore */ }
}

function purgeProjectStorage(id: string, { purgeContent = true } = {}): void {
  if (purgeContent) {
    for (const page of loadPages(id)) purgePageContent(page.id);
  }
  try {
    localStorage.removeItem(pagesKey(id));
    localStorage.removeItem(layoutKey(id));
  } catch { /* ignore */ }
}

/** Resolve a page's latest JSON from its history, then versions, then a built-in
 *  example, then a blank page. (A lean local copy of EditorPreviewPage's resolver
 *  so the store needn't import the heavy preview page.) */
export function resolvePageJson(pageId: string): string | null {
  try {
    const raw = readStored(historyKey(pageId));
    if (raw) {
      const parsed = JSON.parse(raw) as { entries: { json: string }[]; index: number };
      const entry = parsed.entries?.[parsed.index] ?? parsed.entries?.[parsed.entries.length - 1];
      if (entry?.json) return entry.json;
    }
  } catch { /* ignore */ }
  try {
    const raw = readStored(versionsKey(pageId));
    if (raw) {
      const parsed = JSON.parse(raw) as { versions: { id: string; json: string }[]; activeVersionId: string };
      const active = parsed.versions?.find((v) => v.id === parsed.activeVersionId) ?? parsed.versions?.[0];
      if (active?.json) return active.json;
    }
  } catch { /* ignore */ }
  const example = EDITOR_EXAMPLES.find((e) => e.id === pageId);
  if (example) return JSON.stringify(example.definition, null, 2);
  return null;
}

/**
 * Commit a page definition outside the mounted editor while preserving its undo
 * history. Used by local virtual teammates that preview a project-wide change
 * before applying it. The next editor open sees this entry as the current state.
 */
export function commitPageJson(pageId: string, json: string, label: string): void {
  const current = resolvePageJson(pageId);
  if (current === json) return;

  type Entry = { id: string; json: string; label: string; timestamp: number };
  let entries: Entry[] = [];
  let index = -1;

  try {
    const raw = readStored(historyKey(pageId));
    if (raw) {
      const parsed = JSON.parse(raw) as { entries?: Entry[]; index?: number };
      if (Array.isArray(parsed.entries) && parsed.entries.length) {
        entries = parsed.entries;
        index = typeof parsed.index === 'number'
          ? Math.max(0, Math.min(parsed.index, entries.length - 1))
          : entries.length - 1;
      }
    }
  } catch { /* start a fresh history below */ }

  if (!entries.length && current) {
    entries = [{ id: uid('h'), json: current, label: 'Initial state', timestamp: Date.now() }];
    index = 0;
  }

  const next = [
    ...entries.slice(0, index + 1),
    { id: uid('h'), json, label: label.trim() || 'Updated page', timestamp: Date.now() },
  ];
  const capped = next.slice(-50);
  writeStored(historyKey(pageId), JSON.stringify({ entries: capped, index: capped.length - 1 }));
}

// ── Backup export / import ─────────────────────────────────────────────────────

/** Serialise every project and its pages' latest JSON into one plain-text
 *  backup. Page/project metadata is JSON-encoded on marker lines so the importer
 *  can round-trip it exactly. */
export function exportAllText(): string {
  // Include archived projects so a backup/sync never loses them.
  const projects = loadProjectsRaw();
  const parts: string[] = [
    'A1 Editor — projects export',
    `Generated: ${new Date().toISOString()}`,
    `Projects: ${projects.length}`,
    '',
  ];
  for (const proj of projects) {
    parts.push(`##### PROJECT ${JSON.stringify({ id: proj.id, name: proj.name, description: proj.description ?? '', icon: proj.icon ?? 'folder', theme: proj.theme ?? '', archived: proj.archived ?? false, navStyle: proj.navStyle ?? '', published: proj.published ?? null })} #####`);
    for (const pg of loadPages(proj.id)) {
      parts.push(`===== PAGE ${JSON.stringify({ id: pg.id, title: pg.title, icon: pg.icon ?? '', description: pg.description ?? '', parentId: pg.parentId, order: pg.order })} =====`);
      parts.push(resolvePageJson(pg.id) ?? '(no content)');
    }
  }
  return parts.join('\n');
}

/** Inverse of {@link exportAllText}: recreate projects, pages, and page content
 *  from a backup file. Manual imports upsert by id; cloud hydration passes
 *  `replaceProjects` so projects missing from the shared bundle are removed
 *  locally instead of being merged back in after deletion. */
export function importAllText(
  text: string,
  { replaceProjects = false }: { replaceProjects?: boolean } = {},
): { projects: number; pages: number } {
  const projMatches = [...text.matchAll(/^##### PROJECT (.*) #####$/gm)];
  if (!projMatches.length) return { projects: 0, pages: 0 };

  const existingProjects = loadProjectsRaw();
  const existingPages = replaceProjects
    ? new Map(existingProjects.map((project) => [project.id, loadPages(project.id)]))
    : new Map<string, ProjectPage[]>();
  const importedProjectIds = new Set<string>();
  const byId = new Map<string, Project>(replaceProjects ? [] : existingProjects.map((p) => [p.id, p]));
  let pageCount = 0;

  projMatches.forEach((pm, i) => {
    let meta: { id: string; name?: string; description?: string; icon?: string; theme?: string; archived?: boolean; navStyle?: string; published?: Project['published'] | null };
    try { meta = JSON.parse(pm[1]); } catch { return; }
    importedProjectIds.add(meta.id);
    const bodyStart = (pm.index ?? 0) + pm[0].length;
    const bodyEnd = i + 1 < projMatches.length ? (projMatches[i + 1].index ?? text.length) : text.length;
    const body = text.slice(bodyStart, bodyEnd);

    const pageMatches = [...body.matchAll(/^===== PAGE (.*) =====$/gm)];
    const pages: ProjectPage[] = [];
    pageMatches.forEach((gm, j) => {
      let pmeta: { id: string; title?: string; icon?: string; description?: string; parentId?: string | null; order?: number };
      try { pmeta = JSON.parse(gm[1]); } catch { return; }
      const start = (gm.index ?? 0) + gm[0].length;
      const end = j + 1 < pageMatches.length ? (pageMatches[j + 1].index ?? body.length) : body.length;
      const json = body.slice(start, end).trim();
      if (json && json !== '(no content)') {
        const vId = uid('v-import');
        writeStored(versionsKey(pmeta.id), JSON.stringify({ versions: [{ id: vId, label: 'Imported', json }], activeVersionId: vId }));
        writeStored(historyKey(pmeta.id), JSON.stringify({ entries: [{ id: uid('h-import'), json, label: 'Imported', timestamp: Date.now() }], index: 0 }));
      }
      pages.push({
        id: pmeta.id,
        title: pmeta.title || 'Untitled',
        icon: pmeta.icon || undefined,
        description: pmeta.description || undefined,
        parentId: pmeta.parentId ?? null,
        order: pmeta.order ?? j,
      });
      pageCount += 1;
    });

    if (replaceProjects) {
      const importedPageIds = new Set(pages.map((page) => page.id));
      for (const oldPage of existingPages.get(meta.id) ?? []) {
        if (!importedPageIds.has(oldPage.id)) purgePageContent(oldPage.id);
      }
    }

    const now = Date.now();
    const existing = existingProjects.find((project) => project.id === meta.id);
    byId.set(meta.id, {
      id: meta.id,
      name: meta.name || existing?.name || 'Imported project',
      description: meta.description || existing?.description || undefined,
      icon: meta.icon || existing?.icon || 'folder',
      theme: meta.theme || existing?.theme || undefined,
      // Preserve soft-delete + nav style across export/import (and cloud sync),
      // else an archived project reappears on the next hydrate.
      archived: meta.archived ?? existing?.archived ?? undefined,
      navStyle: (meta.navStyle as Project['navStyle']) || existing?.navStyle || undefined,
      published: meta.published ?? existing?.published ?? undefined,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    });
    writeStored(pagesKey(meta.id), JSON.stringify(reindex(pages)));
  });

  if (replaceProjects) {
    for (const project of existingProjects) {
      if (!importedProjectIds.has(project.id)) purgeProjectStorage(project.id);
    }
    if (!importedProjectIds.has(getActiveProjectId() ?? '')) setActiveProjectId(null);
  }

  saveProjects([...byId.values()]);
  return { projects: projMatches.length, pages: pageCount };
}

// ── Upload a project from a single JSON object ──────────────────────────────────

interface NormalizedImportPage {
  key: string;
  title: string;
  icon?: string;
  description?: string;
  parentKey: string | null;
  definitionJson: string | null;
}
interface NormalizedImport {
  name: string;
  description?: string;
  icon?: string;
  theme?: string;
  pages: NormalizedImportPage[];
}

function isPageDefinition(data: any): boolean {
  return !!data && typeof data === 'object' && !!data.page && typeof data.page === 'object' && !!data.page.layout;
}

/** Accept either a **project bundle** (`{ name?, description?, icon?, pages: [...] }`,
 *  each page `{ id?, title?, icon?, description?, parentId?, definition }`) or a
 *  single **page definition** (`{ page: { … } }`, wrapped as a one-page project). */
function normalizeImport(data: any): NormalizedImport | null {
  if (!data || typeof data !== 'object') return null;

  if (isPageDefinition(data)) {
    return {
      name: (typeof data.page.name === 'string' && data.page.name.trim()) || 'Imported page',
      description: typeof data.page.description === 'string' ? data.page.description : undefined,
      pages: [{
        key: '#0',
        title: (typeof data.page.name === 'string' && data.page.name.trim()) || 'Page',
        parentKey: null,
        definitionJson: JSON.stringify(data, null, 2),
      }],
    };
  }

  if (Array.isArray(data.pages)) {
    return {
      name: (typeof data.name === 'string' && data.name.trim()) || 'Imported project',
      description: typeof data.description === 'string' ? data.description : undefined,
      icon: typeof data.icon === 'string' ? data.icon : undefined,
      theme: typeof data.theme === 'string' ? data.theme : undefined,
      pages: data.pages.map((p: any, i: number): NormalizedImportPage => ({
        key: (typeof p?.id === 'string' && p.id) || `#${i}`,
        title: (typeof p?.title === 'string' && p.title.trim()) || `Page ${i + 1}`,
        icon: typeof p?.icon === 'string' ? p.icon : undefined,
        description: typeof p?.description === 'string' ? p.description : undefined,
        parentKey: typeof p?.parentId === 'string' ? p.parentId : null,
        definitionJson: p?.definition != null
          ? (typeof p.definition === 'string' ? p.definition : JSON.stringify(p.definition, null, 2))
          : null,
      })),
    };
  }

  return null;
}

function checkImportNodes(
  nodes: any[],
  path: string,
  errors: string[],
  warnings: string[],
  knownTypes?: Set<string>,
): void {
  nodes.forEach((n, i) => {
    const p = `${path} › node ${i}`;
    if (!n || typeof n !== 'object') { errors.push(`${p} is not an object.`); return; }
    if (typeof n.type !== 'string') errors.push(`${p} is missing a string "type".`);
    else if (knownTypes && knownTypes.size && !knownTypes.has(n.type)) {
      warnings.push(`${p}: "${n.type}" is not a known A1 component — it will render a visible fallback.`);
    }
    if (n.children != null) {
      if (!Array.isArray(n.children)) errors.push(`${p}.children must be an array.`);
      else checkImportNodes(n.children, p, errors, warnings, knownTypes);
    }
  });
}

const FIGURE_ASPECT_RATIOS = new Set(['16:9', '4:3', '3:2', '1:1', '2:3', '3:4', '9:16', '21:9']);

/**
 * Consistency lint for a single page definition — non-blocking design-quality
 * warnings (not structural errors). Covers the rules that keep generated pages
 * consistent: no per-page TopHeader in a project (auto-generated), top-level
 * sections need a contentWidth and non-zero, matching padding, cards belong in a
 * Grid, and card images need a valid, consistent aspectRatio.
 */
function lintDefinition(def: any): string[] {
  const warnings: string[] = [];
  const regions = def?.page?.layout?.regions;
  if (!Array.isArray(regions)) return warnings;

  const walk = (nodes: any[], parentType: string | null): void => {
    if (!Array.isArray(nodes)) return;
    const cardSiblings = nodes.filter((n) => n?.type === 'Card').length;
    for (const n of nodes) {
      if (!n || typeof n !== 'object') continue;
      const id = typeof n.id === 'string' ? n.id : n.type;

      if (n.type === 'TopHeader') {
        warnings.push(`remove the TopHeader node "${id}" — projects auto-generate the top nav from the page hierarchy (this creates a duplicate header).`);
      }
      if (n.type === 'Card' && parentType !== 'Grid' && cardSiblings >= 2) {
        warnings.push(`card "${id}": multiple sibling cards should be wrapped in a Grid.`);
      }
      if (n.type === 'Figure') {
        const ar = n.props?.aspectRatio;
        if (ar != null && !FIGURE_ASPECT_RATIOS.has(ar)) {
          warnings.push(`Figure "${id}": aspectRatio "${ar}" is invalid — use one of ${[...FIGURE_ASPECT_RATIOS].join(', ')}.`);
        }
        if (parentType === 'Card' && ar == null) {
          warnings.push(`card image "${id}": set a consistent aspectRatio (e.g. "4:3") on card images.`);
        }
      }
      if (Array.isArray(n.children)) walk(n.children, n.type);
    }
  };

  for (const region of regions) {
    const top: any[] = Array.isArray(region?.nodes) ? region.nodes : [];
    walk(top, null);

    // Top-level sections = the page's primary outer elements.
    const sections = top.filter((n) => n?.type === 'Section');
    let prevPad: unknown;
    let prevId: string | undefined;
    for (const s of sections) {
      const id = typeof s.id === 'string' ? s.id : 'Section';
      const pad = s.props?.padding;
      if (s.props?.contentWidth == null) {
        warnings.push(`Section "${id}": a primary (top-level) section should set a contentWidth.`);
      }
      if (pad == null || pad === 'none' || pad === 0) {
        warnings.push(`Section "${id}": sections should generally have non-zero padding.`);
      }
      if (prevPad != null && pad != null && String(prevPad) !== String(pad)) {
        warnings.push(`adjacent sections "${prevId}" and "${id}" use different padding ("${prevPad}" vs "${pad}") — neighboring sections should match.`);
      }
      prevPad = pad;
      prevId = id;
    }
  }
  return warnings;
}

/**
 * Validate a parsed JSON object for {@link importProjectJson}. Returns blocking
 * `errors` (clear these before importing) and non-blocking `warnings` (unknown
 * component types + consistency lint, which still import and render). Pass the
 * set of valid component `type` names (registry keys) to enable type warnings.
 */
export function validateProjectImport(
  data: unknown,
  knownTypes?: Set<string>,
): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (data == null || typeof data !== 'object') {
    errors.push('Expected a JSON object — a project bundle ({ "name", "pages": [ … ] }) or a single page definition ({ "page": { … } }).');
    return { errors, warnings };
  }
  const norm = normalizeImport(data);
  if (!norm) {
    errors.push('Unrecognised shape. Provide "pages": [ … ] for a project, or a "page" definition for a single page.');
    return { errors, warnings };
  }
  if (norm.pages.length === 0) errors.push('A project needs at least one page.');

  norm.pages.forEach((pg, i) => {
    const label = `Page ${i + 1}${pg.title ? ` ("${pg.title}")` : ''}`;
    if (!pg.definitionJson) return; // a blank page is allowed
    let def: any;
    try { def = JSON.parse(pg.definitionJson); } catch (e: any) {
      errors.push(`${label}: definition is not valid JSON (${e.message}).`); return;
    }
    const regions = def?.page?.layout?.regions;
    if (!Array.isArray(regions)) { errors.push(`${label}: missing page.layout.regions array.`); return; }
    regions.forEach((r: any, ri: number) => {
      if (!Array.isArray(r?.nodes)) { errors.push(`${label}: region ${ri} has no "nodes" array.`); return; }
      checkImportNodes(r.nodes, `${label} › region ${ri}`, errors, warnings, knownTypes);
    });
    for (const w of lintDefinition(def)) warnings.push(`${label}: ${w}`);
  });

  return { errors, warnings };
}

/** Create a brand-new project (and its pages + content) from a parsed JSON
 *  object — a project bundle or a single page definition. Validate first with
 *  {@link validateProjectImport}; this throws only if the shape is unusable. */
export function importProjectJson(data: unknown): Project {
  const norm = normalizeImport(data);
  if (!norm) throw new Error('Invalid project JSON.');

  const project = createProject({ name: norm.name, description: norm.description, icon: norm.icon, theme: norm.theme });

  const keyToId = new Map<string, string>();
  norm.pages.forEach((p) => keyToId.set(p.key, uid('page')));

  const pages: ProjectPage[] = norm.pages.map((p, i) => ({
    id: keyToId.get(p.key)!,
    title: p.title,
    icon: p.icon,
    description: p.description,
    parentId: p.parentKey != null ? (keyToId.get(p.parentKey) ?? null) : null,
    order: i,
  }));

  norm.pages.forEach((p, i) => seedPageContent(pages[i].id, p.definitionJson, pages[i].title));
  savePages(project.id, reindex(pages));
  return project;
}

/** Serialise a single project as a **project bundle** JSON string — the same
 *  shape {@link importProjectJson} accepts, so a downloaded file round-trips.
 *  Each page's `definition` is the parsed page-definition object; `id`/`parentId`
 *  are preserved so the hierarchy survives re-import. */
export function exportProjectJson(projectId: string): string | null {
  const project = loadProjects().find((p) => p.id === projectId);
  if (!project) return null;
  const bundle = {
    name: project.name,
    description: project.description,
    icon: project.icon,
    theme: project.theme,
    pages: loadPages(projectId).map((pg) => {
      const json = resolvePageJson(pg.id);
      let definition: unknown;
      if (json) { try { definition = JSON.parse(json); } catch { definition = json; } }
      return {
        id: pg.id,
        title: pg.title,
        icon: pg.icon,
        description: pg.description,
        parentId: pg.parentId,
        definition,
      };
    }),
  };
  return JSON.stringify(bundle, null, 2);
}

// ── Project mutation bookkeeping ───────────────────────────────────────────────

function touchProject(projectId: string): void {
  const projects = loadProjectsRaw();
  const next = projects.map((p) => (p.id === projectId ? { ...p, updatedAt: Date.now() } : p));
  saveProjects(next);
}

// loadProjects() runs migrate(); use the raw reader inside save paths to avoid
// re-entering migration.
function loadProjectsRaw(): Project[] {
  try {
    const raw = readStored(PROJECTS_KEY);
    return raw ? (JSON.parse(raw) as Project[]) : [];
  } catch {
    return [];
  }
}

// ── Sample project seeding ─────────────────────────────────────────────────────

let sampleSeeded = false;

/** Seed (or refresh) the bundled "Ember & Oak" sample restaurant project once per
 *  flag version. Runs even for users who already have projects (a one-time flag,
 *  not the migration guard). Bumping `RESTAURANT_SEED_FLAG` re-runs this so sample
 *  updates (e.g. new Figure aspect ratios) reach existing installs; it overwrites
 *  the sample pages' content and tree but leaves other projects untouched. */
function ensureSampleProjects(): void {
  if (sampleSeeded) return;
  sampleSeeded = true;

  const samples = [
    {
      flag: RESTAURANT_SEED_FLAG,
      projectId: RESTAURANT_PROJECT_ID,
      project: restaurantProject,
      pages: restaurantPages,
      content: restaurantContent,
    },
    {
      flag: VEHICLE_PROJECT_SEED_FLAG,
      projectId: VEHICLE_PROJECT_ID,
      project: vehicleProject,
      pages: vehiclePages,
      content: vehicleContent,
    },
  ];

  for (const sample of samples) {
    try {
      if (localStorage.getItem(sample.flag)) continue;
    } catch {
      continue;
    }

    // (Re)write each sample page's content to the latest bundled definition,
    // clearing stale edit history so the refreshed Base content wins.
    for (const page of sample.pages) {
      const content = sample.content[page.id];
      if (!content) continue;
      const versionId = uid('v');
      writeStored(
        versionsKey(page.id),
        JSON.stringify({ versions: [{ id: versionId, label: 'Base', json: JSON.stringify(content, null, 2) }], activeVersionId: versionId }),
      );
      try { localStorage.removeItem(historyKey(page.id)); } catch { /* ignore */ }
    }

    const projects = loadProjectsRaw();
    writeStored(pagesKey(sample.projectId), JSON.stringify(sample.pages));
    if (!projects.some((project) => project.id === sample.projectId)) {
      const now = Date.now();
      saveProjects([...projects, { ...sample.project, createdAt: now, updatedAt: now }]);
    }
    try { localStorage.setItem(sample.flag, '1'); } catch { /* ignore */ }
  }
}

// ── One-time migration ────────────────────────────────────────────────────────

let migrated = false;

/** Seed the first run: the 3 built-in examples become an "A1 Showcase" project,
 *  and any legacy flat user pages become a "My pages" project, so nothing that
 *  existed before Projects is lost. */
function migrate(): void {
  if (migrated) return;
  migrated = true;
  try {
    if (localStorage.getItem(PROJECTS_KEY)) return; // already migrated
  } catch {
    return;
  }
  const now = Date.now();
  const projects: Project[] = [];

  const showcaseId = 'proj-showcase';
  const showcasePages: ProjectPage[] = EDITOR_EXAMPLES.map((e, i) => ({
    id: e.id,
    title: e.label,
    icon: e.icon,
    parentId: null,
    order: i,
  }));
  writeStored(pagesKey(showcaseId), JSON.stringify(showcasePages));
  projects.push({
    id: showcaseId,
    name: 'A1 Showcase',
    description: 'Sample pages bundled with the editor.',
    icon: 'widgets',
    createdAt: now,
    updatedAt: now,
  });

  let legacy: { id: string; label: string }[] = [];
  try { legacy = JSON.parse(readStored('a1-editor-user-pages') ?? '[]'); } catch { /* ignore */ }
  if (legacy.length) {
    const myId = 'proj-my-pages';
    const myPages: ProjectPage[] = legacy.map((p, i) => ({
      id: p.id,
      title: p.label || 'Untitled',
      parentId: null,
      order: i,
    }));
    writeStored(pagesKey(myId), JSON.stringify(myPages));
    projects.push({
      id: myId,
      name: 'My pages',
      description: 'Pages you created before Projects.',
      icon: 'draft',
      createdAt: now,
      updatedAt: now,
    });
  }

  writeStored(PROJECTS_KEY, JSON.stringify(projects));
}

export type { PageDefinition };
