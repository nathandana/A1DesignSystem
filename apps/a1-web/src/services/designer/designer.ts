/**
 * Virtual Designer — the profile + the audit runner.
 *
 * `auditDesign(model)` runs every design heuristic over a DesignModel and returns a sorted
 * DesignReport. It is pure and offline (no API / model credits), like the Virtual Team
 * personas, but read-only: the designer reports and suggests; it never mutates anything.
 * A developer files the findings worth doing as backlog tickets — "Virtual designers create
 * tickets, they don't do the work."
 */
import { HEURISTICS } from './heuristics';
import type { DesignModel, DesignReport, DesignerProfile, Severity } from './types';
import { SEVERITY_ORDER } from './types';

export const virtualDesigner: DesignerProfile = {
  id: 'virtual-designer',
  name: 'Virtual Designer',
  role: 'Product Designer',
  icon: 'design_services',
  blurb:
    "Reviews the design system with a senior product designer's eye — the small, high-leverage refinements that make an interface feel intentional. This first pass audits the token scales (radius, spacing, type) for ordering, redundancy, rhythm, and heading/body hierarchy. Read-only: it advises and files tickets, it never does the work.",
};

/** Run all heuristics over `model` and return a report sorted most-urgent first. */
export function auditDesign(model: DesignModel): DesignReport {
  // Each heuristic stamps its category onto the findings it produces (unless one is set).
  const findings = HEURISTICS.flatMap((h) => h.check(model).map((f) => ({ ...f, category: f.category ?? h.category })));

  findings.sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity));

  const counts = { critical: 0, warning: 0, suggestion: 0, praise: 0 } as Record<Severity, number>;
  for (const f of findings) counts[f.severity] += 1;

  const scaleCount = model.scales.length;
  const stepCount = model.scales.reduce((n, s) => n + s.steps.length, 0);
  return {
    modelId: model.id,
    modelName: model.name,
    findings,
    counts,
    subtitle: `${scaleCount} scale${scaleCount === 1 ? '' : 's'} · ${stepCount} steps examined`,
  };
}
