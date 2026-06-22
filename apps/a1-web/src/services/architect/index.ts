/**
 * Virtual Information Architect — barrel.
 *
 * A local, deterministic IA reviewer (no API calls) that audits a navigation model against
 * IA heuristics and reports findings + suggestions. Read-only by nature; the dev-only panel
 * lets a developer file any finding as a backlog ticket.
 */
export { informationArchitect, auditNav } from './architect';
export { getMainMenu } from './mainMenu';
export { HEURISTICS } from './heuristics';
export type {
  ArchitectProfile, ArchitectReport, Finding, Heuristic, NavModel, NavNode, Severity,
} from './types';
export { SEVERITY_ORDER } from './types';
