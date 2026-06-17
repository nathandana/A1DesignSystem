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
import {
  restaurantProject,
  restaurantPages,
  restaurantContent,
  RESTAURANT_PROJECT_ID,
  RESTAURANT_SEED_FLAG,
} from './sampleRestaurant';

export interface Project {
  id: string;
  name: string;
  description?: string;
  icon?: string;
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
const versionsKey = (pageId: string) => `a1-editor-versions-${pageId}`;
const historyKey = (pageId: string) => `a1-editor-history-${pageId}`;

function uid(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ── Projects ────────────────────────────────────────────────────────────────

export function loadProjects(): Project[] {
  migrate();
  ensureSampleProjects();
  try {
    const raw = readStored(PROJECTS_KEY);
    return raw ? (JSON.parse(raw) as Project[]) : [];
  } catch {
    return [];
  }
}

export function saveProjects(projects: Project[]): void {
  writeStored(PROJECTS_KEY, JSON.stringify(projects));
}

export function createProject(input: { name: string; description?: string; icon?: string }): Project {
  const now = Date.now();
  const project: Project = {
    id: uid('proj'),
    name: input.name.trim() || 'Untitled project',
    description: input.description?.trim() || undefined,
    icon: input.icon || 'folder',
    createdAt: now,
    updatedAt: now,
  };
  const projects = loadProjects();
  saveProjects([...projects, project]);
  savePages(project.id, []);
  return project;
}

export function updateProject(id: string, patch: Partial<Omit<Project, 'id' | 'createdAt'>>): Project[] {
  const projects = loadProjects().map((p) =>
    p.id === id ? { ...p, ...patch, updatedAt: Date.now() } : p,
  );
  saveProjects(projects);
  return projects;
}

/** Delete a project and (optionally) every page's stored content. */
export function deleteProject(id: string, { purgeContent = true } = {}): Project[] {
  if (purgeContent) {
    for (const page of loadPages(id)) purgePageContent(page.id);
  }
  try { localStorage.removeItem(pagesKey(id)); } catch { /* ignore */ }
  const projects = loadProjects().filter((p) => p.id !== id);
  saveProjects(projects);
  return projects;
}

/** Duplicate a project, copying every page's metadata and content into new ids. */
export function duplicateProject(id: string): Project | null {
  const source = loadProjects().find((p) => p.id === id);
  if (!source) return null;
  const copy = createProject({ name: `${source.name} copy`, description: source.description, icon: source.icon });
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

// ── Backup export / import ─────────────────────────────────────────────────────

/** Serialise every project and its pages' latest JSON into one plain-text
 *  backup. Page/project metadata is JSON-encoded on marker lines so the importer
 *  can round-trip it exactly. */
export function exportAllText(): string {
  const projects = loadProjects();
  const parts: string[] = [
    'A1 Editor — projects export',
    `Generated: ${new Date().toISOString()}`,
    `Projects: ${projects.length}`,
    '',
  ];
  for (const proj of projects) {
    parts.push(`##### PROJECT ${JSON.stringify({ id: proj.id, name: proj.name, description: proj.description ?? '', icon: proj.icon ?? 'folder' })} #####`);
    for (const pg of loadPages(proj.id)) {
      parts.push(`===== PAGE ${JSON.stringify({ id: pg.id, title: pg.title, icon: pg.icon ?? '', description: pg.description ?? '', parentId: pg.parentId, order: pg.order })} =====`);
      parts.push(resolvePageJson(pg.id) ?? '(no content)');
    }
  }
  return parts.join('\n');
}

/** Inverse of {@link exportAllText}: recreate projects, pages, and page content
 *  from a backup file (upserting by id). Returns the counts imported. */
export function importAllText(text: string): { projects: number; pages: number } {
  const projMatches = [...text.matchAll(/^##### PROJECT (.*) #####$/gm)];
  if (!projMatches.length) return { projects: 0, pages: 0 };

  const byId = new Map<string, Project>(loadProjectsRaw().map((p) => [p.id, p]));
  let pageCount = 0;

  projMatches.forEach((pm, i) => {
    let meta: { id: string; name?: string; description?: string; icon?: string };
    try { meta = JSON.parse(pm[1]); } catch { return; }
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

    const now = Date.now();
    const existing = byId.get(meta.id);
    byId.set(meta.id, {
      id: meta.id,
      name: meta.name || existing?.name || 'Imported project',
      description: meta.description || existing?.description || undefined,
      icon: meta.icon || existing?.icon || 'folder',
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    });
    writeStored(pagesKey(meta.id), JSON.stringify(reindex(pages)));
  });

  saveProjects([...byId.values()]);
  return { projects: projMatches.length, pages: pageCount };
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
  try {
    if (localStorage.getItem(RESTAURANT_SEED_FLAG)) return;
  } catch {
    return;
  }
  // (Re)write each sample page's content to the latest bundled definition, and
  // clear any stale edit history so the refreshed Base content is what loads
  // (resolvePageJson / EditorPage prefer history over versions).
  for (const page of restaurantPages) {
    const content = restaurantContent[page.id];
    if (!content) continue;
    const versionId = uid('v');
    writeStored(
      versionsKey(page.id),
      JSON.stringify({ versions: [{ id: versionId, label: 'Base', json: JSON.stringify(content, null, 2) }], activeVersionId: versionId }),
    );
    try { localStorage.removeItem(historyKey(page.id)); } catch { /* ignore */ }
  }
  const projects = loadProjectsRaw();
  writeStored(pagesKey(RESTAURANT_PROJECT_ID), JSON.stringify(restaurantPages));
  if (!projects.some((p) => p.id === RESTAURANT_PROJECT_ID)) {
    const now = Date.now();
    saveProjects([...projects, { ...restaurantProject, createdAt: now, updatedAt: now }]);
  }
  try { localStorage.setItem(RESTAURANT_SEED_FLAG, '1'); } catch { /* ignore */ }
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
