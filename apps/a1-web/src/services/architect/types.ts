/**
 * Virtual Information Architect — types.
 *
 * A local, deterministic IA reviewer (no API calls / model credits) in the same spirit as
 * the Virtual Team personas: it reads a navigation model and reports findings against
 * well-known information-architecture heuristics. Unlike the personas, the architect is
 * **read-only** — it advises (a report of findings + suggestions), it never changes anything.
 *
 * The engine is generic over any `NavModel`; `mainMenu.ts` provides the a1-web main menu as
 * the first thing to audit.
 */

/** One menu node. Mirrors the shape of a TopHeader / SideNav nav item. */
export interface NavNode {
  /** Stable id, when the source has one (used only for matching, not display). */
  id?: string;
  /** Visible label — the thing the architect actually evaluates. */
  label: string;
  /** Material Symbols icon name, when the item carries one. */
  icon?: string;
  /** Destination, when the item links somewhere. */
  href?: string;
  /** Child items for a grouped/expandable entry. */
  children?: NavNode[];
}

/** A navigation structure to audit (e.g. the main menu). */
export interface NavModel {
  id: string;
  /** Human name shown in the report, e.g. "Main menu". */
  name: string;
  items: NavNode[];
}

/**
 * Finding severity, most-to-least urgent. `praise` records what the IA gets right (an
 * architect notes strengths, not only problems).
 */
export type Severity = 'critical' | 'warning' | 'suggestion' | 'praise';

export const SEVERITY_ORDER: Severity[] = ['critical', 'warning', 'suggestion', 'praise'];

/**
 * The usability/IA lens a heuristic belongs to — lets findings be grouped by concern
 * (Nielsen-style heuristic categories), so the architect's report reads like a structured
 * evaluation rather than a flat list.
 */
export type HeuristicCategory =
  | 'Findability'
  | 'Hierarchy'
  | 'Clarity'
  | 'Consistency'
  | 'Recognition'
  | 'Scalability'
  | 'Content'
  | 'Accessibility';

/** A single observation from one heuristic. */
export interface Finding {
  /** Unique id within a report (the heuristic id, optionally suffixed). */
  id: string;
  /** The heuristic that produced it, e.g. "Home affordance". */
  heuristic: string;
  /** The lens it belongs to (filled in from the heuristic by the runner). */
  category?: HeuristicCategory;
  /** The IA principle in one line, e.g. "Every primary nav needs an obvious way home." */
  principle: string;
  severity: Severity;
  title: string;
  detail: string;
  /** Concrete, actionable recommendation (omitted for pure praise). */
  suggestion?: string;
  /** Labels of the nav nodes the finding is about, for context. */
  nodes?: string[];
}

/** A heuristic: a named IA principle plus a pure check over a NavModel. */
export interface Heuristic {
  id: string;
  name: string;
  category: HeuristicCategory;
  principle: string;
  check(nav: NavModel): Finding[];
}

/** The full audit of one NavModel. */
export interface ArchitectReport {
  navId: string;
  navName: string;
  /** Findings, sorted most-urgent first. */
  findings: Finding[];
  /** Count per severity (always has every key, 0 when none). */
  counts: Record<Severity, number>;
  /** Number of top-level groups. */
  topLevelCount: number;
  /** Deepest nesting level reached (1 = top level). */
  maxDepth: number;
  /** Total nodes considered. */
  nodeCount: number;
}

/** Identity of the architect, mirroring the persona profile shape. */
export interface ArchitectProfile {
  id: string;
  name: string;
  role: string;
  icon: string;
  blurb: string;
}
