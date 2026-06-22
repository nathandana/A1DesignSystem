/**
 * The Virtual Information Architect's knowledge — IA heuristics it "knows by heart",
 * each encoded as a pure check over a NavModel. Deterministic and offline: the same menu
 * always produces the same findings.
 *
 * Add a heuristic by pushing a `{ id, name, principle, check }` onto `HEURISTICS`. Keep each
 * check focused on one principle and returning concrete, actionable findings.
 */
import type { Finding, Heuristic, NavModel, NavNode } from './types';

// ── Shared helpers ────────────────────────────────────────────────────────────

/** Depth-first walk with the node's depth (1 = top level) and parent. */
function walk(
  nodes: NavNode[],
  fn: (node: NavNode, depth: number, parent: NavNode | null) => void,
  depth = 1,
  parent: NavNode | null = null,
): void {
  for (const n of nodes) {
    fn(n, depth, parent);
    if (n.children?.length) walk(n.children, fn, depth + 1, n);
  }
}

/** Direct children that are real entries (a leaf or a group), ignoring nothing here —
 *  callers pre-strip dividers when building the model. */
function kids(node: NavNode): NavNode[] {
  return node.children ?? [];
}

/** Leaf children only (no further nesting). */
function leafKids(node: NavNode): NavNode[] {
  return kids(node).filter((c) => !c.children?.length);
}

/** Total leaf destinations beneath a node (recursive). */
function countLeaves(node: NavNode): number {
  let n = 0;
  for (const c of kids(node)) n += c.children?.length ? countLeaves(c) : 1;
  return n;
}

function words(label: string): string[] {
  return label.trim().split(/\s+/).filter(Boolean);
}

function isAllCaps(label: string): boolean {
  // Has an uppercase letter and no lowercase letter (detection only — no casing transform).
  // Skip short single tokens (FAQ, API, ID, ZIP) — legitimate acronyms, not shouted words.
  const upper = /[A-Z]/.test(label) && !/[a-z]/.test(label);
  if (!upper) return false;
  const isShortAcronym = !/\s/.test(label) && label.replace(/[^A-Za-z]/g, '').length <= 4;
  return !isShortAcronym;
}

/** Title Case = 2+ words where 2+ start uppercase (so "Get Started", not "Get started"). */
function isTitleCase(label: string): boolean {
  const w = words(label);
  if (w.length < 2) return false;
  const capped = w.filter((x) => /^[A-Z]/.test(x));
  return capped.length >= 2;
}

// Purpose buckets used to spot a group that mixes unrelated kinds of destination.
const BUCKET_RX: { bucket: string; rx: RegExp }[] = [
  { bucket: 'marketing', rx: /\b(feature|features|pricing|tour|get started|why|product)\b/i },
  { bucket: 'support', rx: /\b(help|support|faq|contact|docs|documentation|guide)\b/i },
  { bucket: 'meta', rx: /\b(about|release|releases|changelog|accessibility|legal|privacy|terms|status)\b/i },
  { bucket: 'tool', rx: /\b(backlog|editor|library|theme|themes|rules|patterns|playground|console|settings)\b/i },
];

function bucketOf(label: string): string | null {
  for (const { bucket, rx } of BUCKET_RX) if (rx.test(label)) return bucket;
  return null;
}

const HOME_RX = /\b(home|dashboard|landing)\b/i;
const UTILITY_RX = /\b(resource|resources|help|support|about|setting|settings|release|releases|legal|privacy|terms|account|accessibility|faq|contact|status)\b/i;

// ── Heuristics ────────────────────────────────────────────────────────────────

const homeAffordance: Heuristic = {
  id: 'home-affordance',
  name: 'Home affordance',
  category: 'Findability',
  principle: 'Primary navigation needs an obvious, explicit way back to the start.',
  check(nav) {
    const hasHome = nav.items.some((n) => HOME_RX.test(n.label) || (n.id ? HOME_RX.test(n.id) : false));
    if (hasHome) {
      return [{
        id: 'home-affordance', heuristic: this.name, principle: this.principle, severity: 'praise',
        title: 'A Home entry is present',
        detail: 'The menu offers an explicit way back to the start, so users are never stranded.',
      }];
    }
    return [{
      id: 'home-affordance', heuristic: this.name, principle: this.principle, severity: 'suggestion',
      title: 'No explicit Home item in the primary menu',
      detail:
        'The menu has no Home/landing entry. Relying on the wordmark alone to return home is a known findability gap — not everyone knows the logo is clickable, and there is no label or icon to signal it.',
      suggestion: 'Add a Home item (Material Symbols `home`) as the first entry in the menu, pointing at the landing page.',
    }];
  },
};

const primaryBeforeUtility: Heuristic = {
  id: 'primary-before-utility',
  name: 'Ordering — primary before utility',
  category: 'Hierarchy',
  principle: 'Lead with primary task destinations; push utility/meta content toward the end.',
  check(nav) {
    const firstUtility = nav.items.findIndex((n) => UTILITY_RX.test(n.label));
    const firstPrimary = nav.items.findIndex((n) => !UTILITY_RX.test(n.label) && !HOME_RX.test(n.label));
    if (firstUtility >= 0 && firstPrimary >= 0 && firstUtility < firstPrimary) {
      const util = nav.items[firstUtility];
      return [{
        id: 'primary-before-utility', heuristic: this.name, principle: this.principle, severity: 'warning',
        title: `Utility section "${util.label}" is listed before primary destinations`,
        detail:
          `"${util.label}" reads as utility/meta content, yet it sits ahead of the primary task areas. ` +
          'Menus are scanned left-to-right (and top-down); the first slots carry the most weight and should go to what users come to do.',
        suggestion: `Order by importance: lead with the primary destinations and move "${util.label}" toward the end of the menu.`,
        nodes: [util.label],
      }];
    }
    return [];
  },
};

const topLevelCount: Heuristic = {
  id: 'top-level-count',
  name: 'Top-level count',
  category: 'Hierarchy',
  principle: "Keep top-level choices within roughly 7±2 (Miller's law) to limit scanning cost.",
  check(nav) {
    const n = nav.items.length;
    if (n > 7) {
      return [{
        id: 'top-level-count', heuristic: this.name, principle: this.principle, severity: 'warning',
        title: `${n} top-level groups — above the comfortable limit`,
        detail: `There are ${n} top-level entries. Beyond ~7 the menu is slower to scan and harder to hold in memory.`,
        suggestion: 'Consolidate related groups so the top level sits at 7 or fewer.',
      }];
    }
    return [{
      id: 'top-level-count', heuristic: this.name, principle: this.principle, severity: 'praise',
      title: `${n} top-level groups — within the 7±2 guideline`,
      detail: `${n} top-level entries is comfortable to scan and remember.`,
    }];
  },
};

const groupSize: Heuristic = {
  id: 'group-size',
  name: 'Group size (chunking)',
  category: 'Hierarchy',
  principle: 'A flat list longer than ~10 items is hard to scan — chunk it into sub-groups.',
  check(nav) {
    const out: Finding[] = [];
    walk(nav.items, (node) => {
      const leaves = leafKids(node);
      // Only flag groups whose children are mostly flat leaves (not already sub-grouped).
      if (leaves.length > 10 && leaves.length === kids(node).length) {
        out.push({
          id: `group-size-${node.id ?? node.label}`, heuristic: this.name, principle: this.principle,
          severity: 'suggestion',
          title: `"${node.label}" lists ${leaves.length} items in one flat group`,
          detail: `"${node.label}" has ${leaves.length} sibling items with no sub-grouping, so users must scan a long undifferentiated list.`,
          suggestion: `Split "${node.label}" into smaller labelled sub-groups so related items cluster together.`,
          nodes: [node.label],
        });
      }
    });
    return out;
  },
};

const groupCohesion: Heuristic = {
  id: 'group-cohesion',
  name: 'Group cohesion',
  category: 'Findability',
  principle: 'A group should collect one kind of thing — not a grab-bag of unrelated purposes.',
  check(nav) {
    const out: Finding[] = [];
    walk(nav.items, (node) => {
      const cs = kids(node);
      if (cs.length < 3) return;
      const buckets = new Set<string>();
      for (const c of cs) { const b = bucketOf(c.label); if (b) buckets.add(b); }
      if (buckets.size >= 3) {
        out.push({
          id: `group-cohesion-${node.id ?? node.label}`, heuristic: this.name, principle: this.principle,
          severity: 'suggestion',
          title: `"${node.label}" mixes several unrelated purposes`,
          detail:
            `"${node.label}" spans ${buckets.size} different kinds of destination (${[...buckets].join(', ')}). ` +
            'A catch-all group weakens information scent — users cannot predict what they will find inside.',
          suggestion: `Regroup "${node.label}" by purpose (e.g. learn/marketing vs. support vs. about/meta), or promote the most-used items out of it.`,
          nodes: [node.label],
        });
      }
    });
    return out;
  },
};

const labelCasing: Heuristic = {
  id: 'label-casing',
  name: 'Label casing',
  category: 'Consistency',
  principle: 'Menu labels are sentence case — never uppercase, never Title Case (an A1 system law).',
  check(nav) {
    const allCaps: string[] = [];
    const titleCase: string[] = [];
    walk(nav.items, (node) => {
      if (isAllCaps(node.label)) allCaps.push(node.label);
      else if (isTitleCase(node.label)) titleCase.push(node.label);
    });
    const out: Finding[] = [];
    if (allCaps.length) {
      out.push({
        id: 'label-casing-caps', heuristic: this.name, principle: this.principle, severity: 'critical',
        title: `${allCaps.length} label${allCaps.length === 1 ? '' : 's'} in ALL CAPS`,
        detail: `Uppercase labels (${allCaps.join(', ')}) break the never-uppercase law — screen readers may spell them out and localized strings break.`,
        suggestion: 'Rewrite these labels in sentence case.',
        nodes: allCaps,
      });
    }
    if (titleCase.length) {
      out.push({
        id: 'label-casing-title', heuristic: this.name, principle: this.principle, severity: 'suggestion',
        title: `${titleCase.length} label${titleCase.length === 1 ? '' : 's'} in Title Case`,
        detail: `A1 labels are sentence case, but ${titleCase.map((l) => `"${l}"`).join(', ')} ${titleCase.length === 1 ? 'is' : 'are'} Title Case.`,
        suggestion: `Use sentence case — e.g. "${titleCase[0]}" → "${sentenceCase(titleCase[0])}".`,
        nodes: titleCase,
      });
    }
    if (!out.length) {
      out.push({
        id: 'label-casing-ok', heuristic: this.name, principle: this.principle, severity: 'praise',
        title: 'All labels are sentence case',
        detail: 'Labels follow the sentence-case law consistently.',
      });
    }
    return out;
  },
};

const labelLength: Heuristic = {
  id: 'label-length',
  name: 'Label length',
  category: 'Clarity',
  principle: 'Menu labels should be terse (a word or two) so the menu stays scannable.',
  check(nav) {
    const long: string[] = [];
    walk(nav.items, (node) => {
      if (words(node.label).length > 3 || node.label.length > 24) long.push(node.label);
    });
    if (!long.length) return [];
    return [{
      id: 'label-length', heuristic: this.name, principle: this.principle, severity: 'suggestion',
      title: `${long.length} label${long.length === 1 ? '' : 's'} longer than a menu label should be`,
      detail: `${long.map((l) => `"${l}"`).join(', ')} ${long.length === 1 ? 'is' : 'are'} long for a menu — long labels slow scanning and wrap awkwardly on narrow screens.`,
      suggestion: 'Shorten to one or two words; move any detail into the destination page.',
      nodes: long,
    }];
  },
};

const duplicateLabels: Heuristic = {
  id: 'duplicate-labels',
  name: 'Duplicate sibling labels',
  category: 'Consistency',
  principle: 'Sibling items must have distinct labels, or users cannot tell them apart.',
  check(nav) {
    const out: Finding[] = [];
    const groups: NavNode[] = [];
    walk(nav.items, (node) => { if (node.children?.length) groups.push(node); });
    groups.push({ label: nav.name, children: nav.items });
    for (const g of groups) {
      const seen = new Map<string, number>();
      for (const c of kids(g)) seen.set(c.label.toLowerCase(), (seen.get(c.label.toLowerCase()) ?? 0) + 1);
      const dupes = [...seen.entries()].filter(([, n]) => n > 1).map(([l]) => l);
      if (dupes.length) {
        out.push({
          id: `duplicate-labels-${g.id ?? g.label}`, heuristic: this.name, principle: this.principle,
          severity: 'warning',
          title: `Duplicate labels under "${g.label}"`,
          detail: `Items share the same label (${dupes.join(', ')}) within "${g.label}", which is ambiguous.`,
          suggestion: 'Give each sibling a distinct, specific label.',
          nodes: dupes,
        });
      }
    }
    return out;
  },
};

const depth: Heuristic = {
  id: 'depth',
  name: 'Navigation depth',
  category: 'Findability',
  principle: 'Keep the menu to about three levels — deeper trees hurt findability.',
  check(nav) {
    let max = 1;
    walk(nav.items, (_n, d) => { if (d > max) max = d; });
    if (max > 3) {
      return [{
        id: 'depth', heuristic: this.name, principle: this.principle, severity: 'warning',
        title: `Menu nests ${max} levels deep`,
        detail: `The deepest branch reaches level ${max}. Past three levels, users lose the thread and items get buried.`,
        suggestion: 'Flatten the deepest branches or surface buried items closer to the top.',
      }];
    }
    return [{
      id: 'depth', heuristic: this.name, principle: this.principle, severity: 'praise',
      title: `Max depth is ${max} level${max === 1 ? '' : 's'}`,
      detail: `The menu stays within the three-level guideline, so destinations remain easy to reach.`,
    }];
  },
};

const topLevelIcons: Heuristic = {
  id: 'top-level-icons',
  name: 'Top-level scannability (icons)',
  category: 'Recognition',
  principle: 'Consistent icons on top-level groups speed recognition and scanning.',
  check(nav) {
    const withIcon = nav.items.filter((n) => n.icon).length;
    if (withIcon === 0 && nav.items.length > 0) {
      return [{
        id: 'top-level-icons', heuristic: this.name, principle: this.principle, severity: 'suggestion',
        title: 'Top-level groups have no icons',
        detail: 'None of the top-level groups carry an icon, so the menu is text-only and slower to scan by shape. (Their child items do use icons, which makes the bare top level stand out.)',
        suggestion: 'Add a recognizable icon to each top-level group — including a `home` icon if you add a Home item — applied consistently across all of them.',
      }];
    }
    if (withIcon > 0 && withIcon < nav.items.length) {
      const missing = nav.items.filter((n) => !n.icon).map((n) => n.label);
      return [{
        id: 'top-level-icons', heuristic: this.name, principle: this.principle, severity: 'suggestion',
        title: 'Icons on top-level groups are inconsistent',
        detail: `Some top-level groups have icons and some don't (${missing.join(', ')} lack one). Mixed iconography reads as unfinished and slows scanning.`,
        suggestion: 'Use icons on all top-level groups or none — keep it consistent.',
        nodes: missing,
      }];
    }
    return [];
  },
};

// Catch-all labels that name a container, not its contents.
const VAGUE_LABELS = new Set([
  'details', 'detail', 'more', 'information', 'info', 'explore', 'manage', 'misc',
  'miscellaneous', 'other', 'others', 'stuff', 'options', 'general', 'items', 'content',
  'things', 'data', 'view',
]);

const vagueLabels: Heuristic = {
  id: 'vague-labels',
  name: 'Naming clarity',
  category: 'Clarity',
  principle: 'Labels should name what users will find — avoid vague catch-alls like "Details" or "More".',
  check(nav) {
    const hits: string[] = [];
    walk(nav.items, (node) => { if (VAGUE_LABELS.has(node.label.trim().toLowerCase())) hits.push(node.label); });
    if (!hits.length) return [];
    return [{
      id: 'vague-labels', heuristic: this.name, principle: this.principle, severity: 'suggestion',
      title: `${hits.length} vague label${hits.length === 1 ? '' : 's'}`,
      detail: `${hits.map((l) => `"${l}"`).join(', ')} ${hits.length === 1 ? 'tells' : 'tell'} users little about the destination — they have to click to find out what is inside.`,
      suggestion: 'Rename to describe the actual content or task (e.g. "Details" → "Order details", "Manage" → "Manage members").',
      nodes: hits,
    }];
  },
};

const redundancy: Heuristic = {
  id: 'redundancy',
  name: 'Redundant labels',
  category: 'Consistency',
  principle: 'A label that appears in several places should mean the same thing — or be renamed to differentiate.',
  check(nav) {
    // label -> the distinct parent sections it appears under.
    const places = new Map<string, { label: string; parents: Set<string> }>();
    walk(nav.items, (node, _d, parent) => {
      const key = node.label.trim().toLowerCase();
      const where = parent ? parent.label : nav.name;
      if (!places.has(key)) places.set(key, { label: node.label, parents: new Set() });
      places.get(key)!.parents.add(where);
    });
    const out: Finding[] = [];
    for (const { label, parents } of places.values()) {
      if (parents.size >= 2) {
        const where = [...parents];
        out.push({
          id: `redundancy-${label.toLowerCase()}`, heuristic: this.name, principle: this.principle,
          severity: 'suggestion',
          title: `"${label}" appears under ${parents.size} different sections`,
          detail:
            `"${label}" shows up under ${where.join(', ')}. The same label for different destinations erodes predictability — users cannot tell which "${label}" they need from the label alone.`,
          suggestion: `Differentiate them (e.g. "${where[0]} ${label.toLowerCase()}" / "${where[1]} ${label.toLowerCase()}"), or consolidate if they are genuinely the same thing.`,
          nodes: [label],
        });
      }
    }
    return out;
  },
};

const scalability: Heuristic = {
  id: 'scalability',
  name: 'Scalability',
  category: 'Scalability',
  principle: 'The structure should hold up as features grow — a section with dozens of items needs search or an index, not an ever-longer list.',
  check(nav) {
    const out: Finding[] = [];
    walk(nav.items, (node) => {
      const leaves = countLeaves(node);
      if (leaves > 30) {
        out.push({
          id: `scalability-${node.id ?? node.label}`, heuristic: this.name, principle: this.principle,
          severity: 'suggestion',
          title: `"${node.label}" already holds ${leaves} destinations`,
          detail:
            `"${node.label}" contains ${leaves} leaf destinations. A menu branch this large is slow to scan today and will not scale gracefully as more are added.`,
          suggestion: `Give "${node.label}" a searchable index page (or in-menu filter) so it scales, rather than growing the menu list itself.`,
          nodes: [node.label],
        });
      }
    });
    return out;
  },
};

// ── Helpers used in suggestions ────────────────────────────────────────────────

/** Sentence-case a Title-Case label (lowercase every word after the first). */
function sentenceCase(label: string): string {
  const w = words(label);
  return w.map((word, i) => (i === 0 ? word : word.toLowerCase())).join(' ');
}

// ── Registry ──────────────────────────────────────────────────────────────────

export const HEURISTICS: Heuristic[] = [
  homeAffordance,
  primaryBeforeUtility,
  topLevelCount,
  groupSize,
  groupCohesion,
  vagueLabels,
  redundancy,
  scalability,
  labelCasing,
  labelLength,
  duplicateLabels,
  depth,
  topLevelIcons,
];
