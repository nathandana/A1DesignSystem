/**
 * Virtual Designer — release-notes review.
 *
 * `auditReleaseNotes` parses the recent changelog for context, then runs a duplicate-name
 * scan across all page titles and pattern names. Duplicates are a reliable signal that
 * something in the IA or naming conventions hasn't been settled yet.
 *
 * Pure and deterministic: same inputs → same report. No API calls.
 */
import type { DesignReport, Finding, Severity } from './types';
import { SEVERITY_ORDER } from './types';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PageRef {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
}

/** A pattern entry from getAllPatterns() — only the shape we consume. */
export interface PatternRef {
  pattern: { id: string; name: string };
}

// ── Changelog parser ──────────────────────────────────────────────────────────

/**
 * Extract `- **Title**` feature leads from the `## Unreleased` section and the
 * immediately following dated section (e.g. `## [0.14.0] — 2026-06-24`).
 */
function parseRecentEntries(text: string): string[] {
  // Split on section headings (## at the start of a line)
  const sections = text.split(/\n(?=## )/);
  const titles: string[] = [];
  let collected = 0;

  for (const section of sections) {
    const heading = section.match(/^## (.+)/)?.[1] ?? '';
    const isUnreleased = /^unreleased/i.test(heading);
    // A dated section has a version number or ISO date in the heading.
    const isDated = /\d{4}-\d{2}-\d{2}|\[\d+\.\d+/.test(heading);

    if (isUnreleased) {
      collected = 1;
    } else if (collected === 1 && isDated) {
      collected = 2; // grab the first dated section too, then stop
    } else if (collected === 2) {
      break;
    }

    if (collected === 0) continue;
    for (const m of section.matchAll(/^- \*\*([^*]+)\*\*/gm)) {
      titles.push(m[1].trim());
    }
    if (collected === 2) break;
  }

  return titles;
}

// ── Duplicate scan ────────────────────────────────────────────────────────────

/** Case-fold and strip punctuation so "Page Header" and "page-header" collide. */
function normalize(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function scanDuplicates(pages: PageRef[], patterns: PatternRef[]): Finding[] {
  const findings: Finding[] = [];

  // Group pages by normalized title to find cross-project duplicates.
  const byNorm = new Map<string, PageRef[]>();
  for (const page of pages) {
    const norm = normalize(page.title);
    if (!norm) continue;
    if (!byNorm.has(norm)) byNorm.set(norm, []);
    byNorm.get(norm)!.push(page);
  }

  for (const [norm, refs] of byNorm.entries()) {
    const projectIds = new Set(refs.map((r) => r.projectId));
    if (projectIds.size < 2) continue; // same-project duplicates are the editor's concern
    const labels = refs.map((r) => `"${r.title}" (${r.projectName})`);
    findings.push({
      id: `page-dupe-${norm}`,
      heuristic: 'Name uniqueness',
      category: 'Consistency',
      principle: 'Page titles should be unique across projects to avoid navigation ambiguity.',
      severity: 'suggestion',
      title: `Duplicate page title across ${projectIds.size} projects: "${refs[0].title}"`,
      detail: `"${refs[0].title}" appears in ${projectIds.size} different projects (${labels.join(', ')}). Duplicate names make it hard to tell pages apart in search, breadcrumbs, and navigation.`,
      suggestion: 'Add a qualifying word — project name, scope, or context — to make each title unique.',
      nodes: labels,
    });
  }

  // Build a lookup of normalized pattern names.
  const patternByNorm = new Map<string, PatternRef>();
  for (const pat of patterns) {
    const norm = normalize(pat.pattern.name);
    if (norm) patternByNorm.set(norm, pat);
  }

  // Flag any page whose title collides with a pattern name.
  for (const page of pages) {
    const norm = normalize(page.title);
    const matchPat = patternByNorm.get(norm);
    if (!matchPat) continue;
    findings.push({
      id: `page-pattern-clash-${page.id}`,
      heuristic: 'Name uniqueness',
      category: 'Consistency',
      principle: 'Page titles should not duplicate pattern names — it creates ambiguity about what is a reusable composition vs. a unique page.',
      severity: 'suggestion',
      title: `Page "${page.title}" shares its name with pattern "${matchPat.pattern.name}"`,
      detail: `The page "${page.title}" in project "${page.projectName}" normalises to the same name as the pattern "${matchPat.pattern.name}". Contributors and editors may not be able to tell whether they are working with a page or a governed pattern.`,
      suggestion: 'Rename the page or the pattern so the two are clearly distinct.',
      nodes: [`${page.title} (page, ${page.projectName})`, `${matchPat.pattern.name} (pattern)`],
    });
  }

  return findings;
}

// ── Runner ────────────────────────────────────────────────────────────────────

/**
 * Review the release notes by scanning for naming conflicts across pages and patterns.
 *
 * @param changelogText - Raw CHANGELOG.md content (import as `?raw`).
 * @param pageRefs      - Every page across all projects (id, title, projectId, projectName).
 * @param patternRefs   - Every pattern from getAllPatterns().
 */
export function auditReleaseNotes(
  changelogText: string,
  pageRefs: PageRef[],
  patternRefs: PatternRef[],
): DesignReport {
  const entries = parseRecentEntries(changelogText);
  const findings: Finding[] = scanDuplicates(pageRefs, patternRefs);

  if (!findings.length) {
    findings.push({
      id: 'release-notes-clean',
      heuristic: 'Name uniqueness',
      category: 'Consistency',
      principle: 'Page titles and pattern names should be unique across projects.',
      severity: 'praise',
      title: 'No naming conflicts found',
      detail: `Scanned ${pageRefs.length} page${pageRefs.length !== 1 ? 's' : ''} across projects and ${patternRefs.length} pattern${patternRefs.length !== 1 ? 's' : ''} — no duplicate page titles or page/pattern name clashes.`,
    });
  }

  findings.sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity));
  const counts = { critical: 0, warning: 0, suggestion: 0, praise: 0 } as Record<Severity, number>;
  for (const f of findings) counts[f.severity] += 1;

  return {
    modelId: 'release-notes',
    modelName: 'Release notes',
    findings,
    counts,
    subtitle: `${entries.length} recent entr${entries.length !== 1 ? 'ies' : 'y'} · ${patternRefs.length} pattern${patternRefs.length !== 1 ? 's' : ''} · ${pageRefs.length} page${pageRefs.length !== 1 ? 's' : ''}`,
  };
}
