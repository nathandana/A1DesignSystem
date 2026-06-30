/**
 * Virtual Designer — types.
 *
 * A local, deterministic design reviewer (no API calls / model credits) in the same spirit
 * as the Virtual Information Architect: it reads a model of the design system's foundations
 * and reports craft findings against design heuristics it "knows by heart". Like the
 * architect, it is **read-only** — it advises (findings + concrete suggestions); a developer
 * files the ones worth doing as backlog tickets. It never changes anything.
 *
 * The first model it audits is the **token scales** (radius, spacing, type ramps) read from
 * the live theme. The engine is generic over any `DesignModel`, so later slices (component
 * states, contrast, elevation) can add scales/checks without reshaping this. Beyond tokens it
 * also reviews a project **page composition** (a `ComponentNode` tree).
 */
import type { ComponentNode } from '../../editor/pageTypes';

/** Finding severity, most-to-least urgent. `praise` records what the design gets right. */
export type Severity = 'critical' | 'warning' | 'suggestion' | 'praise';

export const SEVERITY_ORDER: Severity[] = ['critical', 'warning', 'suggestion', 'praise'];

/**
 * The design lens a finding belongs to — lets findings be grouped by concern (the same
 * lenses a senior designer reviews through), so the report reads as a structured critique.
 */
export type DesignCategory =
  | 'Spacing'
  | 'Sizing'
  | 'Radius'
  | 'Typography'
  | 'Hierarchy'
  | 'Color'
  | 'Elevation'
  | 'Motion'
  | 'Consistency'
  | 'Accessibility';

/** One ordered step in a token scale (e.g. radius "md" = 6px). */
export interface ScaleStep {
  /** Step name within the scale, e.g. 'sm' | 'md' | '16'. */
  key: string;
  /** The CSS custom property it came from, e.g. '--base-radius-md'. */
  token: string;
  /** Resolved value in px. */
  px: number;
}

/** An ordered token scale to audit (radius, spacing, a type ramp, …). */
export interface Scale {
  /** Stable id, e.g. 'radius' | 'spacing' | 'type-heading'. */
  id: string;
  /** Human name shown in findings, e.g. 'Radius', 'Heading type ramp'. */
  name: string;
  category: DesignCategory;
  /** What one unit is, for natural phrasing ("radius", "spacing step", "heading size"). */
  noun: string;
  /** Steps in intended order (smallest → largest). */
  steps: ScaleStep[];
}

/** The design model the Designer audits. */
export interface DesignModel {
  id: string;
  /** Human name shown in the report, e.g. 'Design tokens'. */
  name: string;
  scales: Scale[];
}

/** A single observation from one heuristic. */
export interface Finding {
  /** Unique id within a report. */
  id: string;
  /** The heuristic that produced it, e.g. "Heading vs body distinction". */
  heuristic: string;
  /** The lens it belongs to (filled in from the heuristic by the runner if absent). */
  category?: DesignCategory;
  /** The design principle in one line. */
  principle: string;
  severity: Severity;
  title: string;
  detail: string;
  /** Concrete, actionable recommendation (omitted for pure praise). */
  suggestion?: string;
  /** Token names the finding is about, for context. */
  nodes?: string[];
}

/** A heuristic: a named design principle plus a pure check over a DesignModel. */
export interface Heuristic {
  id: string;
  name: string;
  category: DesignCategory;
  principle: string;
  check(model: DesignModel): Finding[];
}

/** An ordered tree of component nodes to review (a page's composition). */
export interface PageModel {
  /** Stable id (the page id, or a project id for an aggregate). */
  id: string;
  /** Human name shown in the report, e.g. "Project / Page". */
  name: string;
  /** The page's root component nodes (children walked recursively). */
  nodes: ComponentNode[];
}

/** A composition heuristic: a named principle plus a pure check over a PageModel. */
export interface PageHeuristic {
  id: string;
  name: string;
  category: DesignCategory;
  principle: string;
  check(model: PageModel): Finding[];
}

/** The full audit of one model (token scales, or a page composition). */
export interface DesignReport {
  modelId: string;
  modelName: string;
  /** Findings, sorted most-urgent first. */
  findings: Finding[];
  /** Count per severity (always has every key, 0 when none). */
  counts: Record<Severity, number>;
  /** One-line description of what was examined, e.g. "4 scales · 31 steps" or "42 nodes". */
  subtitle: string;
}

/** Identity of the designer, mirroring the architect/persona profile shape. */
export interface DesignerProfile {
  id: string;
  name: string;
  role: string;
  icon: string;
  blurb: string;
}
