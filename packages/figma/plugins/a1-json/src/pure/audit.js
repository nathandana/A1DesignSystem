export const WARNING_SUMMARY_LIMIT = 18;

export const AUDIT_SEVERITY = {
  blocker: { label: 'JSON blocker', weight: 15 },
  major: { label: 'Major translation issue', weight: 4 },
  minor: { label: 'Minor system hygiene', weight: 1 },
  advisory: { label: 'AutoFix suggestion', weight: 0.5 },
};

export function warningText(value) {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

export function compactWarnings(warnings, limit = WARNING_SUMMARY_LIMIT) {
  if (!Array.isArray(warnings)) return [];
  const counts = new Map();
  for (const warning of warnings) {
    const text = warningText(warning);
    if (!text) continue;
    counts.set(text, (counts.get(text) || 0) + 1);
  }
  const compacted = [...counts.entries()].map(([text, count]) =>
    count > 1 ? `${text} (${count}×)` : text);
  if (compacted.length <= limit) return compacted;
  const hidden = compacted.length - limit;
  return [
    ...compacted.slice(0, limit),
    `${hidden} additional unique warning${hidden === 1 ? '' : 's'} omitted. Run Audit for the full finding list.`,
  ];
}

export function compactWarningMessage(message) {
  if (typeof message !== 'string' || !message.includes('\n')) return message;
  return compactWarnings(message.split('\n')).join('\n');
}

export function normalizeAuditIssueKey(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/"[^"]+"/g, '"…"')
    .replace(/\b\d+(\.\d+)?\b/g, '#')
    .replace(/\s+/g, ' ')
    .trim();
}

export function auditIssueSeverity(issue) {
  const text = String(issue || '').toLowerCase();
  if (text.includes('missing figma component') || text.includes('visible placeholder')) return 'blocker';
  if (text.includes('unsupported') || text.includes('not portable a1 json') || text.includes('could not be translated') || text.includes('cannot be represented')) return 'major';
  if (text.includes('can be improved') || text.includes('autofix') || text.includes('nearest a1')) return 'advisory';
  return 'minor';
}

export function auditIssueBucket(report, text, options = {}) {
  if (!report.issueGroups || typeof report.issueGroups !== 'object') report.issueGroups = {};
  const severity = AUDIT_SEVERITY[options.severity] ? options.severity : auditIssueSeverity(text);
  const groupKey = options.groupKey || `${severity}:${normalizeAuditIssueKey(text)}`;
  if (!report.issueGroups[groupKey]) {
    report.issueGroups[groupKey] = {
      key: groupKey,
      severity,
      category: options.category || 'A1 compatibility',
      text,
      count: 0,
    };
  }
  const group = report.issueGroups[groupKey];
  group.count += 1;
  // If later calls mark the same issue family as more severe, keep the larger
  // impact. This prevents a broad family from being under-scored by an early
  // minor sample.
  if ((AUDIT_SEVERITY[severity]?.weight || 0) > (AUDIT_SEVERITY[group.severity]?.weight || 0)) group.severity = severity;
  return group;
}

export function auditScoreFromIssueGroups(report) {
  const groups = Object.values(report.issueGroups || {});
  const capBySeverity = { blocker: 45, major: 20, minor: 7, advisory: 3 };
  const totals = { blocker: 0, major: 0, minor: 0, advisory: 0 };
  for (const group of groups) {
    const severity = AUDIT_SEVERITY[group.severity] ? group.severity : 'minor';
    const weight = AUDIT_SEVERITY[severity].weight;
    // Repetition matters a little for confidence/scale, but not linearly:
    // ten identical text-color fixes should feel like one pattern, not ten
    // unrelated failures.
    const repeatFactor = 1 + Math.min(0.25, Math.log2(Math.max(1, group.count)) * 0.04);
    totals[severity] += weight * repeatFactor;
  }
  const deduction = Object.keys(totals).reduce((sum, severity) => sum + Math.min(capBySeverity[severity], totals[severity]), 0);
  return Math.max(0, Math.min(100, Math.round(100 - deduction)));
}

export function auditA1CoverageCount(report) {
  return (Number(report.supportedComponents) || 0) + (Number(report.supportedTextStyles) || 0);
}

export function auditCoverageScoreCap(report) {
  if (!report || !report.nodeCount) return 100;
  const coverage = auditA1CoverageCount(report);
  if (coverage === 0) return 55;
  if ((Number(report.supportedComponents) || 0) === 0 && report.nodeCount > 8) return 82;
  return 100;
}

export function auditGrade(score) {
  return score >= 95 ? 'A'
    : score >= 85 ? 'B'
      : score >= 75 ? 'C'
        : score >= 65 ? 'D'
          : 'F';
}

export function auditReportMetrics(report) {
  return [
    { label: 'A1 components', value: report.supportedComponents, passes: report.supportedComponents > 0, filterKey: 'a1-components' },
    { label: 'Color values', value: report.missingColorValues, passes: report.missingColorValues === 0, filterKey: 'color-values' },
    { label: 'Text styles', value: report.missingTextStyles, passes: report.missingTextStyles === 0, filterKey: 'text-styles' },
    { label: 'Element support', value: report.unsupportedElements, passes: report.unsupportedElements === 0, filterKey: 'element-support' },
    { label: 'Figma components', value: report.missingComponents, passes: report.missingComponents === 0, filterKey: 'figma-components' },
    { label: 'AutoFix', value: report.autoFixOpportunities, passes: report.autoFixOpportunities === 0, filterKey: 'autofix' },
  ];
}

export function auditReportRecommendations(report) {
  const recommendations = [];
  if (report.autoFixOpportunities) recommendations.push('Run AutoFix all to normalize supported text, Card, Stack, Grid, and Section issues.');
  if (report.missingColorValues) recommendations.push('Bind raw or broken fills/strokes to valid A1 color variables before export.');
  if (report.missingTextStyles) recommendations.push('Apply A1 text styles instead of detached typography.');
  if (report.unsupportedElements || report.missingComponents) recommendations.push('Replace unsupported layers with A1 components or add the missing component mapping.');
  return recommendations.slice(0, 4);
}

export function auditReportSummary(report) {
  const issueGroups = Number(report.issueGroupCount) || 0;
  return `Audited ${report.nodeCount} layer${report.nodeCount === 1 ? '' : 's'} across ${report.auditedRoots} root${report.auditedRoots === 1 ? '' : 's'}; ${issueGroups} issue famil${issueGroups === 1 ? 'y' : 'ies'} scored.`;
}

export function auditReportFindings(report) {
  const groups = Object.values(report.issueGroups || {});
  if (groups.length) {
    return groups
      .sort((a, b) => {
        const aWeight = AUDIT_SEVERITY[a.severity]?.weight || 0;
        const bWeight = AUDIT_SEVERITY[b.severity]?.weight || 0;
        if (aWeight !== bWeight) return bWeight - aWeight;
        return (b.count || 0) - (a.count || 0);
      })
      .slice(0, 8)
      .map((group) => {
        const label = AUDIT_SEVERITY[group.severity]?.label || 'Issue';
        const count = Number(group.count) || 1;
        const countSuffix = count > 1 ? ` (${count}× same pattern)` : '';
        return `${label}: ${group.text}${countSuffix}`;
      });
  }
  return (report.issues || []).slice(0, 8);
}
