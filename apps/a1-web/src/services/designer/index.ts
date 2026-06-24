/**
 * Virtual Designer — barrel.
 *
 * A local, deterministic design reviewer (no API calls) that audits a model of the design
 * system's foundations against design-craft heuristics and reports findings + suggestions.
 * Read-only by nature; the dev-only panel lets a developer file any finding as a backlog
 * ticket. First model: the token scales (`readDesignModel()` reads the live theme).
 */
export { virtualDesigner, auditDesign } from './designer';
export { readDesignModel } from './model';
export { HEURISTICS } from './heuristics';
// Composition review (project/page) — implemented; not yet wired to a target picker in the panel.
export { auditPage, auditProject } from './composition';
// Release-notes review — naming conflict scan across pages and patterns.
export { auditReleaseNotes } from './release';
export type { PageRef, PatternRef } from './release';
// Target enumeration and page-node readers for the panel's target picker.
export { listDesignTargets, readPageNodes, projectPagesWithNodes } from './targets';
export type { DesignTarget } from './targets';
export type {
  DesignerProfile, DesignReport, Finding, Heuristic, DesignModel, Scale, ScaleStep, Severity, DesignCategory,
  PageModel, PageHeuristic,
} from './types';
export { SEVERITY_ORDER } from './types';
