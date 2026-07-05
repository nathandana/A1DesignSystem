/**
 * Priority Guides: content-first alignment documents (problem, audience, goals,
 * and a priority-ranked content hierarchy) authored in the a1-web Priority Guide
 * editor. Device-local (localStorage), seeded once from the bundled example
 * guides, and folded into the shared cloud-sync envelope (see projects/cloudSync.js).
 *
 * A guide follows the priority-guide schema (schema.json), extended with two
 * optional links so a guide can be attached to a project and one of its pages —
 * which is what "convert to page / wireframe" targets.
 */
import clinic from './seeds/clinic.json';
import incident from './seeds/incident.json';
import library from './seeds/library.json';
import trail from './seeds/trail.json';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface GuideContextDetail {
  label: string;
  value: string;
  checkable?: boolean;
  checked?: boolean;
}

export interface GuideLeafItem {
  kind?: 'item';
  type?: string;
  componentType?: string;
  title: string;
  content: string;
  annotations?: string[];
  links?: string[];
  linkedGuideId?: string;
}

export interface GuideGroupItem {
  kind: 'group';
  type?: string;
  componentType: 'Section' | 'Card' | 'Button container';
  title: string;
  content: string;
  annotations?: string[];
  children: GuideLeafItem[];
}

export type GuideItem = GuideLeafItem | GuideGroupItem;

export interface PriorityGuide {
  id: string;
  title: string;
  tab?: string;
  icon?: string;
  context: string;
  pageType?: string;
  problemStatement: string;
  audience: string;
  userGoal: string;
  businessGoal: string;
  contextDetails?: GuideContextDetail[];
  items: GuideItem[];
  /** Project this guide belongs to (a1-web project id), if attached. */
  projectId?: string | null;
  /** Page within that project this guide converts to / from, if attached. */
  pageId?: string | null;
  createdAt?: number;
  updatedAt?: number;
}

export function isGuideGroup(item: GuideItem): item is GuideGroupItem {
  return (item as GuideGroupItem).kind === 'group' || Array.isArray((item as GuideGroupItem).children);
}

// ── Seeds ─────────────────────────────────────────────────────────────────────

const SEED_GUIDES: PriorityGuide[] = [clinic, library, incident, trail] as unknown as PriorityGuide[];
/** Ids of the bundled example guides — used to distinguish seeds from user work. */
export const SEED_GUIDE_IDS: readonly string[] = SEED_GUIDES.map((g) => g.id);

// ── Storage ───────────────────────────────────────────────────────────────────

const KEY = 'a1-priority-guides';
const SEEDED_KEY = 'a1-priority-guides-seeded';

type Listener = () => void;
const listeners = new Set<Listener>();
export function subscribeGuides(fn: Listener): () => void { listeners.add(fn); return () => listeners.delete(fn); }
function notify(): void { for (const fn of listeners) fn(); }

function clone<T>(value: T): T {
  return typeof structuredClone === 'function' ? structuredClone(value) : JSON.parse(JSON.stringify(value));
}

function uid(): string {
  return `guide_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/** Lowercase, hyphenated slug from a title (matches the schema `id` pattern). */
export function slugify(input: string): string {
  const base = (input || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return base || 'guide';
}

function read(): PriorityGuide[] {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as PriorityGuide[]) : [];
    return Array.isArray(list) ? list : [];
  } catch { return []; }
}

function write(list: PriorityGuide[]): void {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* ignore quota */ }
  notify();
}

/**
 * On first run (and only once), copy the bundled example guides into the store so
 * the editor opens with real content to explore. The seeded flag lets a user delete
 * all seeds without them reappearing, and keeps cloud-synced empties from re-seeding.
 */
function ensureSeeded(): void {
  if (localStorage.getItem(SEEDED_KEY)) return;
  const existing = read();
  if (existing.length === 0) {
    const now = Date.now();
    write(SEED_GUIDES.map((g) => ({ ...clone(g), projectId: null, pageId: null, createdAt: now, updatedAt: now })));
  }
  try { localStorage.setItem(SEEDED_KEY, '1'); } catch { /* ignore */ }
}

// ── Public API ────────────────────────────────────────────────────────────────

export function loadGuides(): PriorityGuide[] {
  ensureSeeded();
  return read().slice().sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
}

export function getGuide(id: string): PriorityGuide | null {
  ensureSeeded();
  return read().find((g) => g.id === id) ?? null;
}

/** Create a guide from a partial. Ensures a unique slug id. */
export function createGuide(partial: Partial<PriorityGuide>): PriorityGuide {
  ensureSeeded();
  const list = read();
  const used = new Set(list.map((g) => g.id));
  let id = partial.id?.trim() || slugify(partial.title || '');
  if (used.has(id)) { let n = 2; while (used.has(`${id}-${n}`)) n += 1; id = `${id}-${n}`; }
  const now = Date.now();
  const guide: PriorityGuide = {
    id,
    title: partial.title?.trim() || 'Untitled guide',
    tab: partial.tab,
    icon: partial.icon,
    context: partial.context ?? '',
    pageType: partial.pageType,
    problemStatement: partial.problemStatement ?? '',
    audience: partial.audience ?? '',
    userGoal: partial.userGoal ?? '',
    businessGoal: partial.businessGoal ?? '',
    contextDetails: partial.contextDetails,
    items: partial.items ?? [],
    projectId: partial.projectId ?? null,
    pageId: partial.pageId ?? null,
    createdAt: now,
    updatedAt: now,
  };
  write([guide, ...list]);
  return guide;
}

/** Replace a guide by id (merges patch over the stored guide). */
export function updateGuide(id: string, patch: Partial<PriorityGuide>): PriorityGuide | null {
  const list = read();
  const idx = list.findIndex((g) => g.id === id);
  if (idx === -1) return null;
  const next: PriorityGuide = { ...list[idx], ...patch, id, updatedAt: Date.now() };
  const copy = list.slice();
  copy[idx] = next;
  write(copy);
  return next;
}

export function deleteGuide(id: string): void {
  write(read().filter((g) => g.id !== id));
}

export function duplicateGuide(id: string): PriorityGuide | null {
  const source = getGuide(id);
  if (!source) return null;
  const { id: _drop, createdAt: _c, updatedAt: _u, ...rest } = source;
  return createGuide({ ...clone(rest), title: `${source.title} copy`, pageId: null });
}

// ── Cloud-sync bridge (see projects/cloudSync.js) ─────────────────────────────

/** Serialize all guides for the shared-state envelope. */
export function exportGuides(): PriorityGuide[] {
  return read();
}

/** Restore guides from an envelope. Replaces the local set; marks seeded so the
 *  seeds don't re-appear on an intentionally-empty synced workspace. */
export function importGuides(list: unknown): void {
  if (!Array.isArray(list)) return;
  try { localStorage.setItem(SEEDED_KEY, '1'); } catch { /* ignore */ }
  write(list as PriorityGuide[]);
}
