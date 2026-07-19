// Shared, Figma-API-free audit primitives used by the A1:Figma plugin.

export const A1_SHARED_AUDIT_CORE_VERSION = '1.0.0';

export const A1_SHARED_AUDIT_SEVERITY = {
  blocker: { label: 'JSON blocker', weight: 15 },
  major: { label: 'Major translation issue', weight: 4 },
  minor: { label: 'Minor system hygiene', weight: 1 },
  advisory: { label: 'AutoFix suggestion', weight: 0.5 },
};

export function normalizeSharedAuditIssueKey(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/"[^"]+"/g, '"…"')
    .replace(/\b\d+(\.\d+)?\b/g, '#')
    .replace(/\s+/g, ' ')
    .trim();
}

export function createSharedAuditReport(auditedRoots = 0) {
  return {
    auditedRoots,
    nodeCount: 0,
    supportedComponents: 0,
    supportedTextStyles: 0,
    missingColorValues: 0,
    missingTextStyles: 0,
    unsupportedElements: 0,
    missingComponents: 0,
    autoFixOpportunities: 0,
    issues: [],
    issueItems: [],
    issueGroups: {},
    issueGroupCount: 0,
    warnings: [],
    ignoredLayers: 0,
  };
}

export function addSharedAuditIssue(report, issue = {}) {
  const text = String(issue.text || '').trim();
  if (!text) return null;
  const severity = A1_SHARED_AUDIT_SEVERITY[issue.severity] ? issue.severity : 'minor';
  const groupKey = issue.groupKey || `${severity}:${normalizeSharedAuditIssueKey(text)}`;
  const group = report.issueGroups[groupKey] || {
    key: groupKey,
    severity,
    category: issue.category || 'A1 compatibility',
    text,
    count: 0,
  };
  group.count += 1;
  if ((A1_SHARED_AUDIT_SEVERITY[severity]?.weight || 0) > (A1_SHARED_AUDIT_SEVERITY[group.severity]?.weight || 0)) group.severity = severity;
  report.issueGroups[groupKey] = group;
  report.issues.push(text);
  const item = {
    id: `audit-issue-${report.issueItems.length + 1}`,
    text,
    nodeId: issue.nodeId || '',
    nodeName: issue.nodeName || '',
    severity: group.severity,
    severityLabel: A1_SHARED_AUDIT_SEVERITY[group.severity]?.label || 'Issue',
    category: group.category,
    groupKey,
    metricKeys: Array.isArray(issue.metricKeys) ? issue.metricKeys : [],
  };
  report.issueItems.push(item);
  return item;
}

export function finalizeSharedAuditReport(report) {
  report.issueGroupCount = Object.keys(report.issueGroups || {}).length;
  const capBySeverity = { blocker: 45, major: 20, minor: 7, advisory: 3 };
  const totals = { blocker: 0, major: 0, minor: 0, advisory: 0 };
  for (const group of Object.values(report.issueGroups || {})) {
    const severity = A1_SHARED_AUDIT_SEVERITY[group.severity] ? group.severity : 'minor';
    const repeatFactor = 1 + Math.min(0.25, Math.log2(Math.max(1, group.count)) * 0.04);
    totals[severity] += A1_SHARED_AUDIT_SEVERITY[severity].weight * repeatFactor;
  }
  const deduction = Object.keys(totals).reduce((sum, key) => sum + Math.min(capBySeverity[key], totals[key]), 0);
  let score = Math.max(0, Math.min(100, Math.round(100 - deduction)));
  const coverage = (Number(report.supportedComponents) || 0) + (Number(report.supportedTextStyles) || 0);
  if (report.nodeCount && coverage === 0) score = Math.min(score, 55);
  else if (report.nodeCount && !report.supportedComponents && report.nodeCount > 8) score = Math.min(score, 82);
  report.score = score;
  report.grade = score >= 95 ? 'A' : score >= 85 ? 'B' : score >= 75 ? 'C' : score >= 65 ? 'D' : 'F';
  for (const item of report.issueItems) {
    const group = report.issueGroups[item.groupKey];
    if (group) item.groupCount = group.count;
  }
  report.metrics = [
    { label: 'A1 components', value: report.supportedComponents, passes: report.supportedComponents > 0, filterKey: 'a1-components' },
    { label: 'Color values', value: report.missingColorValues, passes: report.missingColorValues === 0, filterKey: 'color-values' },
    { label: 'Text styles', value: report.missingTextStyles, passes: report.missingTextStyles === 0, filterKey: 'text-styles' },
    { label: 'Element support', value: report.unsupportedElements, passes: report.unsupportedElements === 0, filterKey: 'element-support' },
    { label: 'Figma components', value: report.missingComponents, passes: report.missingComponents === 0, filterKey: 'figma-components' },
    { label: 'AutoFix', value: report.autoFixOpportunities, passes: report.autoFixOpportunities === 0, filterKey: 'autofix' },
  ];
  report.recommendations = [];
  if (report.autoFixOpportunities) report.recommendations.push('Run AutoFix to normalize supported A1 layers.');
  if (report.missingColorValues) report.recommendations.push('Bind raw fills and strokes to A1 color variables.');
  if (report.missingTextStyles) report.recommendations.push('Apply A1 text styles instead of detached typography.');
  if (report.unsupportedElements || report.missingComponents) report.recommendations.push('Replace unsupported layers with A1 components.');
  report.recommendations = report.recommendations.slice(0, 4);
  report.summary = `Audited ${report.nodeCount} layer${report.nodeCount === 1 ? '' : 's'} across ${report.auditedRoots} root${report.auditedRoots === 1 ? '' : 's'}; ${report.issueGroupCount} issue famil${report.issueGroupCount === 1 ? 'y' : 'ies'} scored.`;
  return report;
}
