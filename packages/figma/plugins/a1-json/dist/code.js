const A1_BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl'];
const A1_BREAKPOINT_WIDTHS = { xs: 480, sm: 640, md: 1024, lg: 1440, xl: 1600 };

function resolveBreakpointVisibility(value) {
  if (typeof value === 'boolean') {
    return Object.fromEntries(A1_BREAKPOINTS.map((breakpoint) => [breakpoint, value]));
  }
  let current = true;
  const resolved = {};
  for (const breakpoint of A1_BREAKPOINTS) {
    if (value && typeof value === 'object' && !Array.isArray(value) && typeof value[breakpoint] === 'boolean') {
      current = value[breakpoint];
    }
    resolved[breakpoint] = current;
  }
  return resolved;
}

function compactBreakpointVisibility(value) {
  const resolved = resolveBreakpointVisibility(value);
  const compact = {};
  let previous = true;
  for (const breakpoint of A1_BREAKPOINTS) {
    if (resolved[breakpoint] !== previous) {
      compact[breakpoint] = resolved[breakpoint];
      previous = resolved[breakpoint];
    }
  }
  return Object.keys(compact).length ? compact : null;
}

function normalizeResponsiveColumns(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const out = {};
  for (const key of A1_BREAKPOINTS) {
    const columns = value[key];
    if (Number.isInteger(columns) && columns > 0) out[key] = columns;
  }
  return Object.keys(out).length > 0 ? out : null;
}

function formatResponsiveGridColumns(columns) {
  const responsiveColumns = normalizeResponsiveColumns(columns);
  if (!responsiveColumns) return '';
  return `{${A1_BREAKPOINTS
    .filter((breakpoint) => Number.isInteger(responsiveColumns[breakpoint]) && responsiveColumns[breakpoint] > 0)
    .map((breakpoint) => `${breakpoint}:${responsiveColumns[breakpoint]}`)
    .join(', ')}}`;
}

function stripResponsiveGridColumnsName(name) {
  // The dash separator is optional: hand-authored names like "Grid {xs:2}"
  // must strip too, or re-syncing metadata accumulates suffix groups.
  return String(name || 'Grid')
    .replace(/\s*(?:[-–—]\s*)?\{\s*(?:(?:['"]?(?:xs|sm|md|lg|xl)['"]?)\s*:\s*\d+\s*,?\s*)+\}\s*$/i, '')
    .trim() || 'Grid';
}

function parseResponsiveGridColumnsName(name) {
  const match = String(name || '').match(/\{\s*([^{}]+)\s*\}\s*$/);
  if (!match) return null;
  const columns = {};
  for (const part of match[1].split(',')) {
    const pair = part.trim().match(/^['"]?(xs|sm|md|lg|xl)['"]?\s*:\s*(\d+)$/i);
    if (!pair) return null;
    const breakpoint = pair[1].toLowerCase();
    const value = Number(pair[2]);
    if (!Number.isInteger(value) || value < 1) return null;
    columns[breakpoint] = value;
  }
  return normalizeResponsiveColumns(columns);
}

function responsiveGridName(baseName, columns) {
  const suffix = formatResponsiveGridColumns(columns);
  return suffix ? `${stripResponsiveGridColumnsName(baseName)} - ${suffix}` : stripResponsiveGridColumnsName(baseName);
}

function responsiveColumnsAt(value, breakpoint) {
  const columns = normalizeResponsiveColumns(value);
  if (!columns) return null;
  const targetIndex = Math.max(0, A1_BREAKPOINTS.indexOf(breakpoint));
  let inherited = null;
  for (let index = 0; index <= targetIndex; index += 1) {
    const key = A1_BREAKPOINTS[index];
    if (Number.isInteger(columns[key]) && columns[key] > 0) inherited = columns[key];
  }
  if (inherited !== null) return inherited;
  for (const key of A1_BREAKPOINTS) {
    if (Number.isInteger(columns[key]) && columns[key] > 0) return columns[key];
  }
  return null;
}

function responsiveGridItemSpanAt(value, breakpoint, fullSpan = null) {
  const normalize = (candidate) => {
    if (candidate === 'full') return Number.isInteger(fullSpan) && fullSpan > 0 ? fullSpan : null;
    return Number.isInteger(candidate) && candidate > 0 ? candidate : null;
  };
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const targetIndex = Math.max(0, A1_BREAKPOINTS.indexOf(breakpoint));
    let inherited = null;
    for (let index = 0; index <= targetIndex; index += 1) {
      const key = A1_BREAKPOINTS[index];
      const candidate = normalize(value[key]);
      if (candidate !== null) inherited = candidate;
    }
    if (inherited !== null) return inherited;
    for (const key of A1_BREAKPOINTS) {
      const candidate = normalize(value[key]);
      if (candidate !== null) return candidate;
    }
    return null;
  }
  return normalize(value);
}

function breakpointForWidth(width, fallback = 'md') {
  if (typeof width !== 'number' || !Number.isFinite(width) || width <= 0) return fallback;
  return A1_BREAKPOINTS.reduce((nearest, breakpoint) => {
    const nearestWidth = A1_BREAKPOINT_WIDTHS[nearest] || width;
    const candidateWidth = A1_BREAKPOINT_WIDTHS[breakpoint] || width;
    return Math.abs(candidateWidth - width) < Math.abs(nearestWidth - width) ? breakpoint : nearest;
  }, fallback);
}

function collectAuthoredBreakpoints(value, found = new Set()) {
  if (Array.isArray(value)) {
    for (const item of value) collectAuthoredBreakpoints(item, found);
    return found;
  }
  if (!value || typeof value !== 'object') return found;
  const keys = Object.keys(value);
  const responsiveKeys = keys.filter((key) => A1_BREAKPOINTS.includes(key));
  if (responsiveKeys.length > 0 && responsiveKeys.length === keys.length) {
    for (const key of responsiveKeys) found.add(key);
  }
  for (const item of Object.values(value)) collectAuthoredBreakpoints(item, found);
  return found;
}

// Shared, Figma-API-free audit primitives used by the A1:Figma plugin.

const A1_SHARED_AUDIT_CORE_VERSION = '1.0.0';

const A1_SHARED_AUDIT_SEVERITY = {
  blocker: { label: 'JSON blocker', weight: 15 },
  major: { label: 'Major translation issue', weight: 4 },
  minor: { label: 'Minor system hygiene', weight: 1 },
  advisory: { label: 'AutoFix suggestion', weight: 0.5 },
};

function normalizeSharedAuditIssueKey(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/"[^"]+"/g, '"…"')
    .replace(/\b\d+(\.\d+)?\b/g, '#')
    .replace(/\s+/g, ' ')
    .trim();
}

function createSharedAuditReport(auditedRoots = 0) {
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

function addSharedAuditIssue(report, issue = {}) {
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

function finalizeSharedAuditReport(report) {
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

const WARNING_SUMMARY_LIMIT = 18;

// Reusable implementation assets that are valid only inside their public A1
// parent component. Audit counts them as A1 coverage without presenting them
// as standalone JSON bridge targets.
const AUDIT_SUPPORTED_PRIVATE_COMPONENTS = new Set([
  'Checkbox Option',
  'Choice Option',
  'Definition List Item',
  'Icon',
  'Menu Item',
  'Nav icon',
  'Page Nav Item',
  'Radio Option',
  'Segmented Control Item',
  'Tab',
  'Tab Item',
  'Top Header Nav Item',
]);

const AUDIT_SEVERITY = {
  blocker: { label: 'JSON blocker', weight: 15 },
  major: { label: 'Major translation issue', weight: 4 },
  minor: { label: 'Minor system hygiene', weight: 1 },
  advisory: { label: 'AutoFix suggestion', weight: 0.5 },
};

function warningText(value) {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function compactWarnings(warnings, limit = WARNING_SUMMARY_LIMIT) {
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

function compactWarningMessage(message) {
  if (typeof message !== 'string' || !message.includes('\n')) return message;
  return compactWarnings(message.split('\n')).join('\n');
}

function normalizeAuditIssueKey(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/"[^"]+"/g, '"…"')
    .replace(/\b\d+(\.\d+)?\b/g, '#')
    .replace(/\s+/g, ' ')
    .trim();
}

function auditIssueSeverity(issue) {
  const text = String(issue || '').toLowerCase();
  if (text.includes('missing figma component') || text.includes('visible placeholder')) return 'blocker';
  if (text.includes('unsupported') || text.includes('not portable a1 json') || text.includes('could not be translated') || text.includes('cannot be represented')) return 'major';
  if (text.includes('can be improved') || text.includes('autofix') || text.includes('nearest a1')) return 'advisory';
  return 'minor';
}

function auditIssueBucket(report, text, options = {}) {
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

function auditScoreFromIssueGroups(report) {
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

function auditA1CoverageCount(report) {
  return (Number(report.supportedComponents) || 0) + (Number(report.supportedTextStyles) || 0);
}

function auditCoverageScoreCap(report) {
  if (!report || !report.nodeCount) return 100;
  const coverage = auditA1CoverageCount(report);
  if (coverage === 0) return 55;
  if ((Number(report.supportedComponents) || 0) === 0 && report.nodeCount > 8) return 82;
  return 100;
}

function auditGrade(score) {
  return score >= 95 ? 'A'
    : score >= 85 ? 'B'
      : score >= 75 ? 'C'
        : score >= 65 ? 'D'
          : 'F';
}

function auditReportMetrics(report) {
  return [
    { label: 'A1 components', value: report.supportedComponents, passes: report.supportedComponents > 0, filterKey: 'a1-components' },
    { label: 'Color values', value: report.missingColorValues, passes: report.missingColorValues === 0, filterKey: 'color-values' },
    { label: 'Text styles', value: report.missingTextStyles, passes: report.missingTextStyles === 0, filterKey: 'text-styles' },
    { label: 'Element support', value: report.unsupportedElements, passes: report.unsupportedElements === 0, filterKey: 'element-support' },
    { label: 'Figma components', value: report.missingComponents, passes: report.missingComponents === 0, filterKey: 'figma-components' },
    { label: 'AutoFix', value: report.autoFixOpportunities, passes: report.autoFixOpportunities === 0, filterKey: 'autofix' },
  ];
}

function auditReportRecommendations(report) {
  const recommendations = [];
  if (report.autoFixOpportunities) recommendations.push('Run AutoFix all to normalize supported text, Card, Stack, Grid, and Section issues.');
  if (report.missingColorValues) recommendations.push('Bind raw or broken fills/strokes to valid A1 color variables before export.');
  if (report.missingTextStyles) recommendations.push('Apply A1 text styles instead of detached typography.');
  if (report.unsupportedElements || report.missingComponents) recommendations.push('Replace unsupported layers with A1 components or add the missing component mapping.');
  return recommendations.slice(0, 4);
}

function auditReportSummary(report) {
  const issueGroups = Number(report.issueGroupCount) || 0;
  return `Audited ${report.nodeCount} layer${report.nodeCount === 1 ? '' : 's'} across ${report.auditedRoots} root${report.auditedRoots === 1 ? '' : 's'}; ${issueGroups} issue famil${issueGroups === 1 ? 'y' : 'ies'} scored.`;
}

function auditReportFindings(report) {
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

function canonicalKey(key) {
  return String(key || '').replace(/#.*$/, '').trim().toLowerCase().replace(/[\s_-]+/g, '');
}

function compactKey(key) {
  return canonicalKey(key).replace(/[^a-z0-9]+/g, '');
}

function componentNameCandidatesForAliases(name, aliasesByName = {}) {
  const base = String(name || '').trim();
  const aliases = aliasesByName[base] || [];
  const compact = base.replace(/\s+/g, '');
  const spaced = base.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
  return [...new Set([base, ...aliases, compact, spaced].filter(Boolean))];
}

function figmaComponentNameMatchesForAliases(actualName, requestedName, aliasesByName = {}) {
  const actual = String(actualName || '').trim();
  if (!actual) return false;
  const actualKey = canonicalKey(actual);
  const actualCompact = compactKey(actual);
  const parts = actual.split(/[\\/›>]+/).map((part) => part.trim()).filter(Boolean);
  const partKeys = parts.map(canonicalKey);
  const partCompacts = parts.map(compactKey);
  return componentNameCandidatesForAliases(requestedName, aliasesByName).some((candidate) => {
    const candidateKey = canonicalKey(candidate);
    const candidateCompact = compactKey(candidate);
    return actualKey === candidateKey
      || actualCompact === candidateCompact
      || partKeys.includes(candidateKey)
      || partCompacts.includes(candidateCompact);
  });
}

const CARD_ICON_DISPLAYS = ['none', 'default', 'hero'];
const CARD_HERO_COLORS = ['action', 'neutral', 'info', 'success', 'warn', 'error'];

function normalizeCardOption(value, options, fallback) {
  const normalized = typeof value === 'string' ? value.trim().toLowerCase() : '';
  return options.includes(normalized) ? normalized : fallback;
}

function normalizeCardIconDisplay(value) {
  return normalizeCardOption(value, CARD_ICON_DISPLAYS, 'default');
}

function normalizeCardHeroColor(value) {
  return normalizeCardOption(value, CARD_HERO_COLORS, 'action');
}

const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function bytesToBase64(bytes) {
  let encoded = '';
  for (let index = 0; index < bytes.length; index += 3) {
    const first = bytes[index];
    const hasSecond = index + 1 < bytes.length;
    const hasThird = index + 2 < bytes.length;
    const second = hasSecond ? bytes[index + 1] : 0;
    const third = hasThird ? bytes[index + 2] : 0;
    const chunk = (first << 16) | (second << 8) | third;
    encoded += BASE64_ALPHABET[(chunk >> 18) & 63];
    encoded += BASE64_ALPHABET[(chunk >> 12) & 63];
    encoded += hasSecond ? BASE64_ALPHABET[(chunk >> 6) & 63] : '=';
    encoded += hasThird ? BASE64_ALPHABET[chunk & 63] : '=';
  }
  return encoded;
}

function base64ToBytes(value) {
  let encoded = String(value || '').replace(/\s/g, '');
  if (!encoded) return new Uint8Array(0);
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(encoded) || encoded.slice(0, -2).includes('=')) {
    throw new Error('Invalid base64 image data.');
  }
  if (encoded.length % 4 === 1) throw new Error('Invalid base64 image data.');
  while (encoded.length % 4 !== 0) encoded += '=';

  const padding = encoded.endsWith('==') ? 2 : encoded.endsWith('=') ? 1 : 0;
  const bytes = new Uint8Array((encoded.length / 4) * 3 - padding);
  let offset = 0;
  for (let index = 0; index < encoded.length; index += 4) {
    const first = BASE64_ALPHABET.indexOf(encoded[index]);
    const second = BASE64_ALPHABET.indexOf(encoded[index + 1]);
    const third = encoded[index + 2] === '=' ? 0 : BASE64_ALPHABET.indexOf(encoded[index + 2]);
    const fourth = encoded[index + 3] === '=' ? 0 : BASE64_ALPHABET.indexOf(encoded[index + 3]);
    if (first < 0 || second < 0 || third < 0 || fourth < 0) throw new Error('Invalid base64 image data.');
    const chunk = (first << 18) | (second << 12) | (third << 6) | fourth;
    if (offset < bytes.length) bytes[offset++] = (chunk >> 16) & 255;
    if (offset < bytes.length) bytes[offset++] = (chunk >> 8) & 255;
    if (offset < bytes.length) bytes[offset++] = chunk & 255;
  }
  return bytes;
}

const A1_IMAGE_REF_PATTERN = /^a1img:\/\/([A-Za-z0-9_-]{1,120})$/;

function a1ImageIdFromRef(src) {
  if (typeof src !== 'string') return '';
  return src.match(A1_IMAGE_REF_PATTERN)?.[1] || '';
}

function publicA1ImageUrl(src, publicBaseUrl) {
  const id = a1ImageIdFromRef(src);
  const base = typeof publicBaseUrl === 'string' ? publicBaseUrl.replace(/\/+$/, '') : '';
  return id && base ? `${base}/${encodeURIComponent(id)}` : '';
}

const ICON_SIZES = ['xs', 'sm', 'md', 'lg', 'xl', 'jumbo', 'xJumbo'];
const ICON_SIZE_PIXELS = { xs: 16, sm: 20, md: 24, lg: 32, xl: 40, jumbo: 64, xJumbo: 96 };
const ICON_COLORS = ['muted', 'accent', 'inverse', 'success', 'error', 'warn', 'info'];

const ICON_COLOR_VARIABLE_NAMES = {
  default: 'color/text/default',
  muted: 'color/text/muted',
  accent: 'color/text/accent',
  inverse: 'color/text/inverse',
  success: 'color/status/success/background',
  error: 'color/status/error/background',
  warn: 'color/status/warn/background',
  info: 'color/status/info/background',
};

function normalizeIconSize(value) {
  const normalized = String(value || '').trim();
  if (!normalized) return 'md';
  if (normalized.toLowerCase() === 'xjumbo') return 'xJumbo';
  return ICON_SIZES.includes(normalized) ? normalized : 'md';
}

function normalizeIconColor(value) {
  const normalized = String(value || '').trim().toLowerCase();
  return ICON_COLORS.includes(normalized) ? normalized : '';
}

function iconNameProp(props = {}) {
  if (typeof props.name === 'string' && props.name.trim()) return props.name.trim();
  if (typeof props.icon === 'string' && props.icon.trim()) return props.icon.trim();
  return 'star';
}

function iconColorFromVariableName(value) {
  const normalized = String(value || '').trim().toLowerCase().replaceAll(' ', '');
  if (!normalized) return '';
  return Object.entries(ICON_COLOR_VARIABLE_NAMES)
    .find(([, variableName]) => {
      const candidate = variableName.toLowerCase().replaceAll(' ', '');
      return normalized === candidate || normalized.endsWith(candidate);
    })?.[0] || '';
}

function componentId(type, instanceOrId) {
  const nodeId = typeof instanceOrId === 'string'
    ? instanceOrId
    : instanceOrId && typeof instanceOrId.id === 'string'
      ? instanceOrId.id
      : '';
  return `${kebabComponentType(type)}-${nodeId.replace(/[^a-zA-Z0-9]+/g, '-')}`;
}

function kebabComponentType(type) {
  return String(type || 'component')
    .replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
    .replace(/^-/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'component';
}

function slugifyOptionValue(label, usedValues) {
  const used = usedValues && typeof usedValues.has === 'function' && typeof usedValues.add === 'function'
    ? usedValues
    : new Set();
  const base = String(label || 'option')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'option';
  let value = base;
  let index = 2;
  while (used.has(value)) value = `${base}-${index++}`;
  used.add(value);
  return value;
}

// Accept a single node, an array of nodes, or a full page definition / project
// bundle. A node with a type is always kept: supported types render as their
// Figma component. Recursion stops at component nodes because importers own
// their slots.
function collectSupportedNodes(value, found = []) {
  if (Array.isArray(value)) {
    for (const item of value) collectSupportedNodes(item, found);
    return found;
  }
  if (!value || typeof value !== 'object') return found;
  if (typeof value.type === 'string') {
    found.push(value);
    return found;
  }
  for (const key of ['children', 'nodes', 'regions', 'layout', 'page', 'pages', 'definition']) {
    if (value[key]) collectSupportedNodes(value[key], found);
  }
  return found;
}

function addDefaultTemplateWithId(value, id) {
  if (Array.isArray(value)) return value.map((item) => addDefaultTemplateWithId(item, id));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, addDefaultTemplateWithId(entry, id)]));
  }
  return typeof value === 'string' ? value.replaceAll('$id', id) : value;
}

function pageTitleFromFigmaFrame(frameOrName) {
  const rawName = typeof frameOrName === 'string' ? frameOrName : frameOrName && frameOrName.name;
  const name = String(rawName || '').trim();
  const linkedTitle = name.match(/^A1\s*·\s*.+?\s*\/\s*(.+)$/);
  return (linkedTitle ? linkedTitle[1] : name) || 'Untitled';
}

// A raw Figma frame exports as a `{ nodes }` bundle, while an A1 Page Layout
// instance already provides the complete page layout contract.
function pageLayoutForPageExport(node) {
  if (node && node.type === 'PageLayout') return node;
  return {
    type: 'PageLayout',
    regions: [{ id: 'main', name: 'Main', nodes: Array.isArray(node && node.nodes) ? node.nodes : [] }],
  };
}

/**
 * Figma component source resolution.
 *
 * This module deliberately keeps the current lookup strategy intact. It owns
 * the Figma-node details so the controller can ask for a source without
 * knowing whether it came from a local component set, a standalone component,
 * or an imported component instance.
 */

function sourceComponentSet(node) {
  try {
    if (!node) return null;
    if (node.type === 'COMPONENT_SET') return node;
    if (node.type === 'COMPONENT') return node.parent && node.parent.type === 'COMPONENT_SET' ? node.parent : null;
    if (node.type === 'INSTANCE') {
      const main = node.mainComponent;
      return main && main.parent && main.parent.type === 'COMPONENT_SET' ? main.parent : null;
    }
  } catch {
    return null;
  }
  return null;
}

function sourceStandaloneComponent(node) {
  try {
    if (!node) return null;
    if (node.type === 'COMPONENT') return node.parent && node.parent.type === 'COMPONENT_SET' ? null : node;
    if (node.type === 'INSTANCE') {
      const main = node.mainComponent;
      return main && (!main.parent || main.parent.type !== 'COMPONENT_SET') ? main : null;
    }
  } catch {
    return null;
  }
  return null;
}

function keyMatchesConfiguredComponentSetName(key, name) {
  if (!key) return false;
  const expected = configuredLibraryKeyForName(A1_FIGMA_COMPONENT_SET_KEYS, name);
  return expected ? key === expected : A1_FIGMA_COMPONENT_SET_KEY_VALUES.has(key);
}

function keyMatchesConfiguredComponentName(key, name) {
  if (!key) return false;
  const expected = configuredLibraryKeyForName(A1_FIGMA_COMPONENT_KEYS, name);
  return expected ? key === expected : A1_FIGMA_COMPONENT_KEY_VALUES.has(key);
}

function sourceMatchesA1ComponentSetName(source, name) {
  const set = sourceComponentSet(source);
  return Boolean(set && figmaComponentNameMatches(set.name, name) && keyMatchesConfiguredComponentSetName(localPublishedKey(set), name));
}

function sourceMatchesA1StandaloneComponentName(source, name) {
  const component = sourceStandaloneComponent(source);
  return Boolean(component && figmaComponentNameMatches(component.name, name) && keyMatchesConfiguredComponentName(localPublishedKey(component), name));
}

function sourceMatchesA1ComponentName(source, name) {
  return sourceMatchesA1ComponentSetName(source, name) || sourceMatchesA1StandaloneComponentName(source, name);
}

function findComponentSet(name) {
  const page = figma.currentPage;
  if (!page) return null;
  const local = page.findOne((node) =>
    node.type === 'COMPONENT_SET'
    && figmaComponentNameMatches(node.name, name)
    && sourceMatchesA1ComponentSetName(node, name));
  if (local) return local;
  const importedInstance = page.findOne((node) => {
    if (node.type !== 'INSTANCE') return false;
    try {
      const main = node.mainComponent;
      const set = main && main.parent && main.parent.type === 'COMPONENT_SET' ? main.parent : null;
      return Boolean(set && sourceMatchesA1ComponentSetName(set, name));
    } catch {
      return false;
    }
  });
  if (!importedInstance || importedInstance.type !== 'INSTANCE') return null;
  try {
    const main = importedInstance.mainComponent;
    return main && main.parent && main.parent.type === 'COMPONENT_SET' ? main.parent : null;
  } catch {
    return null;
  }
}

function findComponent(name) {
  const page = figma.currentPage;
  if (!page) return null;
  const local = page.findOne((node) =>
    node.type === 'COMPONENT'
    && figmaComponentNameMatches(node.name, name)
    && sourceMatchesA1StandaloneComponentName(node, name));
  if (local) return local;
  const importedInstance = page.findOne((node) => {
    if (node.type !== 'INSTANCE') return false;
    try {
      const main = node.mainComponent;
      return Boolean(main && sourceMatchesA1StandaloneComponentName(main, name));
    } catch {
      return false;
    }
  });
  if (!importedInstance || importedInstance.type !== 'INSTANCE') return null;
  try {
    return importedInstance.mainComponent || null;
  } catch {
    return null;
  }
}

function findComponentSource(name) {
  const set = findComponentSet(name);
  if (set) return set.defaultVariant;
  if (A1_COMPONENT_SET_ONLY_NAMES.has(name)) return null;
  return findComponent(name);
}

function componentSourceFromImported(imported) {
  if (!imported) return null;
  if (imported.type === 'COMPONENT_SET') return imported.defaultVariant || imported.children[0] || null;
  if (imported.type === 'COMPONENT') {
    return imported.parent && imported.parent.type === 'COMPONENT_SET'
      ? imported.parent.defaultVariant || imported
      : imported;
  }
  return null;
}

/** Shared Figma component-property reads and queued writes. */

function plainKey(key) {
  return key.split('#')[0];
}

function readProperties(instance) {
  const out = {};
  const props = instance.componentProperties || {};
  for (const key of Object.keys(props)) out[plainKey(key)] = props[key];
  return out;
}

function componentSetName(instanceNode) {
  try {
    const main = instanceNode && instanceNode.mainComponent;
    const set = main && main.parent && main.parent.type === 'COMPONENT_SET' ? main.parent : null;
    return set ? set.name : main ? main.name : '';
  } catch {
    return '';
  }
}

function componentProperty(instance, name, type) {
  const wanted = canonicalKey(name);
  const raw = instance.componentProperties || {};
  for (const key of Object.keys(raw)) {
    if (canonicalKey(key) !== wanted) continue;
    if (type && raw[key].type !== type) continue;
    return { key, property: raw[key] };
  }
  return null;
}

function componentPropertyFromNames(instance, names, type) {
  const wanted = new Set((names || []).map(canonicalKey).filter(Boolean));
  const raw = instance.componentProperties || {};
  for (const key of Object.keys(raw)) {
    if (!wanted.has(canonicalKey(key))) continue;
    if (type && raw[key].type !== type) continue;
    return { key, property: raw[key] };
  }
  return null;
}

function iconSwapProperty(instance) {
  const named = componentPropertyFromNames(instance, ICON_SWAP_PROPERTY_NAMES, 'INSTANCE_SWAP');
  if (named) return named;
  let raw = {};
  try {
    raw = instance.componentProperties || {};
  } catch {
    return null;
  }
  const candidates = Object.keys(raw)
    .filter((key) => raw[key] && raw[key].type === 'INSTANCE_SWAP')
    .filter((key) => {
      const name = canonicalKey(key);
      return name.includes('icon') || name.includes('glyph') || name.includes('symbol');
    });
  if (candidates.length === 1) return { key: candidates[0], property: raw[candidates[0]] };
  const allSwaps = Object.keys(raw).filter((key) => raw[key] && raw[key].type === 'INSTANCE_SWAP');
  return allSwaps.length === 1 ? { key: allSwaps[0], property: raw[allSwaps[0]] } : null;
}

function iconTextProperty(instance) {
  const named = componentPropertyFromNames(instance, ICON_SWAP_PROPERTY_NAMES, 'TEXT');
  if (named) return named;
  let raw = {};
  try {
    raw = instance.componentProperties || {};
  } catch {
    return null;
  }
  const candidates = Object.keys(raw)
    .filter((key) => raw[key] && raw[key].type === 'TEXT')
    .filter((key) => {
      const name = canonicalKey(key);
      return name.includes('icon') || name.includes('glyph') || name.includes('symbol');
    });
  return candidates.length === 1 ? { key: candidates[0], property: raw[candidates[0]] } : null;
}

function iconSwapPropertyValue(instance) {
  const found = iconSwapProperty(instance);
  return found ? found.property.value : undefined;
}

function iconTextPropertyValue(instance) {
  const found = iconTextProperty(instance);
  return found ? found.property.value : undefined;
}

function iconTextLayerValue(instance) {
  const text = materialIconTextLayer(nestedIconInstance(instance, 'Icon') || instance);
  try {
    return text && typeof text.characters === 'string' ? text.characters.trim() : '';
  } catch {
    return '';
  }
}

function iconNameFromTextValue(value) {
  return materialIconNameCandidate(value) || '';
}

function iconNameFromEditableText(instance) {
  return iconNameFromTextValue(iconTextPropertyValue(instance)) ||
    iconNameFromTextValue(iconTextLayerValue(instance));
}

function queueIconSwapProperty(instance, assignments, materialIcon) {
  const found = iconSwapProperty(instance);
  if (!found || !materialIcon) return false;
  assignments[found.key] = materialIcon.id;
  return true;
}

function queueIconTextProperty(instance, assignments, iconName) {
  const found = iconTextProperty(instance);
  if (!found || !iconName) return false;
  assignments[found.key] = iconName;
  return true;
}

function componentPropertyValue(instance, name, type) {
  const found = componentProperty(instance, name, type);
  return found ? found.property.value : undefined;
}

function queueComponentProperty(instance, assignments, name, value, type, warnings, description) {
  const found = componentProperty(instance, name, type);
  if (!found) {
    warnings.push(`${description || name} could not be applied — no matching Figma property was found.`);
    return;
  }
  assignments[found.key] = value;
}

function queueOptionalComponentProperty(instance, assignments, name, value, type) {
  const found = componentProperty(instance, name, type);
  if (!found) return false;
  assignments[found.key] = value;
  return true;
}

function applyQueuedProperties(instance, assignments, warnings, description) {
  if (Object.keys(assignments).length === 0) return;
  try {
    instance.setProperties(assignments);
  } catch (error) {
    warnings.push(`${description || 'Component properties'} could not be applied: ${error.message}`);
  }
}

/** Figma variable collections, modes, and shared gap-variable bindings. */

function localCollection(name) {
  const collections = figma.variables.getLocalVariableCollections();
  const exact = collections.find((collection) => collection.name === name);
  if (exact) return exact;
  const requestedCanonical = canonicalKey(name);
  const loose = collections.find((collection) => canonicalKey(collection.name) === requestedCanonical);
  if (loose) return loose;
  if (requestedCanonical === 'color') {
    return collections.find((collection) => {
      const modeNames = collection.modes.map((mode) => canonicalKey(mode.name));
      return modeNames.includes('light') && modeNames.includes('dark');
    }) || null;
  }
  return null;
}

function collectionModeByName(collection, modeName) {
  const requested = canonicalKey(modeName);
  return collection && collection.modes
    ? collection.modes.find((entry) => canonicalKey(entry.name) === requested) || null
    : null;
}

function collectionHasModes(collection, modeNames) {
  if (!collection || !Array.isArray(collection.modes)) return false;
  const available = collection.modes.map((mode) => canonicalKey(mode.name));
  return modeNames.every((modeName) => available.includes(canonicalKey(modeName)));
}

function variableModeNodes(root) {
  if (!root) return [];
  const liveRoot = root.type === 'INSTANCE' ? currentInstance(root) : root;
  let descendants = [];
  try {
    descendants = liveRoot.findAll((node) => node.type === 'FRAME' || node.type === 'INSTANCE');
  } catch {
    descendants = [];
  }
  return [liveRoot].concat(descendants).filter(Boolean);
}

function resolvedCollectionsForRoot(root) {
  const collections = [];
  const seen = new Set();
  for (const node of variableModeNodes(root)) {
    let modes = {};
    try {
      modes = node.resolvedVariableModes || node.explicitVariableModes || {};
    } catch {
      modes = {};
    }
    for (const collectionId of Object.keys(modes)) {
      if (seen.has(collectionId)) continue;
      seen.add(collectionId);
      try {
        const collection = figma.variables.getVariableCollectionById(collectionId);
        if (collection) collections.push(collection);
      } catch {
        // Some remote or stale collection handles may not resolve synchronously.
      }
    }
  }
  return collections;
}

function collectionForRoot(root, name) {
  const requested = canonicalKey(name);
  const resolved = resolvedCollectionsForRoot(root);
  const exact = resolved.find((collection) => collection.name === name)
    || resolved.find((collection) => canonicalKey(collection.name) === requested);
  if (exact) return exact;
  if (requested === 'color') {
    const colorCollection = resolved.find((collection) => collectionHasModes(collection, ['Light', 'Dark']));
    if (colorCollection) return colorCollection;
  }
  return localCollection(name);
}

function collectionModeName(collection, modeId) {
  const mode = collection.modes.find((entry) => entry.modeId === modeId);
  return mode ? mode.name : null;
}

function explicitCollectionMode(root, collectionName) {
  const collection = collectionForRoot(root, collectionName);
  if (!collection) return null;
  for (const node of variableModeNodes(root)) {
    try {
      const modes = node.explicitVariableModes || {};
      if (modes[collection.id]) return collectionModeName(collection, modes[collection.id]);
    } catch {
      // A component variant swap can leave an internal frame/instance handle
      // stale until Figma completes the document-change turn.
    }
  }
  return null;
}

function applyCollectionMode(target, collectionName, wantedModeName) {
  const collection = collectionForRoot(target, collectionName);
  if (!collection) return false;
  const mode = collectionModeByName(collection, wantedModeName);
  if (!mode) return false;
  try {
    target.setExplicitVariableModeForCollection(collection, mode.modeId);
    return true;
  } catch {
    return false;
  }
}

function applyCollectionModeToTree(root, collectionName, wantedModeName) {
  const collection = collectionForRoot(root, collectionName);
  if (!collection || !root) return false;
  const mode = collectionModeByName(collection, wantedModeName);
  if (!mode) return false;
  const nodes = variableModeNodes(root);
  const liveRoot = nodes[0] || null;
  let rootApplied = false;
  for (const node of nodes) {
    try {
      node.setExplicitVariableModeForCollection(collection, mode.modeId);
      if (node === liveRoot) rootApplied = true;
    } catch {
      // Some descendants are stale or do not accept explicit modes; keep going.
    }
  }
  return rootApplied;
}

function clearCollectionMode(root, collectionName) {
  const collection = collectionForRoot(root, collectionName);
  if (!collection || !root) return false;
  let cleared = false;
  for (const node of variableModeNodes(root)) {
    try {
      const modes = node.explicitVariableModes || {};
      if (!modes[collection.id]) continue;
      node.clearExplicitVariableModeForCollection(collection);
      cleared = true;
    } catch {
      // Ignore stale inner Section layers and continue clearing the rest.
    }
  }
  return cleared;
}

function pushGapVariableWarning(warnings, message) {
  if (!warnings || gapVariableWarnings.has(message)) return;
  gapVariableWarnings.add(message);
  warnings.push(message);
}

function localFloatVariables() {
  try {
    if (typeof figma.variables.getLocalVariables === 'function') {
      return figma.variables.getLocalVariables('FLOAT');
    }
  } catch {
    return [];
  }
  return [];
}

async function importConfiguredFloatVariable(name) {
  if (!figma.variables || typeof figma.variables.importVariableByKeyAsync !== 'function') return null;
  try {
    const stored = await readClientComponentKeyRegistry();
    const map = { ...A1_FIGMA_FLOAT_VARIABLE_KEYS, ...stored.variables.float };
    const key = configuredVariableKeyForName(map, name);
    return key ? await figma.variables.importVariableByKeyAsync(key) : null;
  } catch {
    return null;
  }
}

async function ensureGapFloatVariable(gap, warnings) {
  const value = nearestStackGap(Number(gap));
  const name = STACK_GAP_VARIABLE_NAMES[value] || `gap/${value}`;
  const variable = localFloatVariables().find((candidate) => candidate && candidate.name === name);
  if (variable) return variable;
  const imported = await importConfiguredFloatVariable(name);
  if (imported) return imported;
  if (!localCollection('Spacing')) {
    pushGapVariableWarning(warnings, 'Spacing variable collection was not found. The plugin will not create local variables, so Stack/Grid gaps were normalized with pixel values only.');
  } else {
    pushGapVariableWarning(warnings, `Spacing variable "${name}" was not found. The plugin will not create local variables, so ${value}px was used directly.`);
  }
  return null;
}

async function bindGapProperty(node, property, value, warnings, label) {
  const gap = nearestStackGap(Number(value));
  try {
    node[property] = gap;
  } catch (error) {
    warnings.push(`${label || property} could not be set to ${gap}px: ${error.message}`);
    return gap;
  }
  if (gap === 0) return gap;
  const variable = await ensureGapFloatVariable(gap, warnings);
  if (!variable) return gap;
  try {
    node.setBoundVariable(property, variable);
  } catch (error) {
    warnings.push(`${label || property} could not be bound to ${variable.name}: ${error.message}`);
  }
  return gap;
}

function propertyHasBoundVariable(node, property) {
  try {
    const bound = node && node.boundVariables && node.boundVariables[property];
    if (Array.isArray(bound)) return bound.some((entry) => entry && entry.id);
    return Boolean(bound && bound.id);
  } catch {
    return false;
  }
}

function gapNeedsVariableBinding(value) {
  return nearestStackGap(Number(value)) !== 0;
}

/** Shared text, font, color-token, and text suggestion helpers. */

function looseNameMatch(candidateName, requestedName) {
  const candidate = String(candidateName || '');
  const requested = String(requestedName || '');
  if (!candidate || !requested) return false;
  const candidateCanonical = canonicalKey(candidate);
  const requestedCanonical = canonicalKey(requested);
  if (candidateCanonical === requestedCanonical || candidateCanonical.endsWith(requestedCanonical)) return true;
  const candidateCompact = compactKey(candidate);
  const requestedCompact = compactKey(requested);
  return candidateCompact === requestedCompact || candidateCompact.endsWith(requestedCompact);
}

// ── Free Figma text → Heading / Paragraph ──────────────────────────────────
// Figma deliberately models ordinary editorial copy as text layers with local
// styles instead of component instances. These helpers make that convention
// serializable without treating text inside an A1 component as a separate node.
const HEADING_SIZES = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
const DISPLAY_SIZES = ['sm', 'md', 'lg', 'xl', 'xxl', 'jumbo', 'xjumbo'];
const PARAGRAPH_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
const HEADING_FONT_SIZES = { xs: 18, sm: 20, md: 24, lg: 28, xl: 32, xxl: 40 };
const DISPLAY_FONT_SIZES = { sm: 24, md: 28, lg: 32, xl: 40, xxl: 56, jumbo: 72, xjumbo: 96 };
const PARAGRAPH_FONT_SIZES = { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 };

function nearestTextSize(scale, fontSize, fallback) {
  if (typeof fontSize !== 'number') return fallback;
  return Object.keys(scale).reduce((nearest, size) =>
    Math.abs(scale[size] - fontSize) < Math.abs(scale[nearest] - fontSize) ? size : nearest, fallback);
}

function nearestTextSizeDistance(scale, fontSize, fallback) {
  const size = nearestTextSize(scale, fontSize, fallback);
  return typeof fontSize === 'number' ? Math.abs(scale[size] - fontSize) : Infinity;
}

function inferredTextFamily(fontSize, likelyHeading) {
  if (!likelyHeading) return 'body';
  // Figma Display and Heading are separate A1 families. When there is no
  // local A1 style to tell us which one it is, choose Display only when its
  // scale is genuinely closer; ties retain Heading's semantic default.
  const headingDistance = nearestTextSizeDistance(HEADING_FONT_SIZES, fontSize, 'md');
  const displayDistance = nearestTextSizeDistance(DISPLAY_FONT_SIZES, fontSize, 'md');
  return displayDistance < headingDistance ? 'display' : 'heading';
}

function textFontStyleName(text) {
  try {
    if (!text || text.fontName === figma.mixed) return '';
    return String(text.fontName && text.fontName.style || '');
  } catch {
    return '';
  }
}

function textLayerPlainContent(text) {
  try {
    return typeof text.characters === 'string' ? text.characters.trim() : '';
  } catch {
    return '';
  }
}

function textLooksLikeShortTitle(text) {
  const content = textLayerPlainContent(text);
  if (!content) return false;
  const lines = content.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length > 2 || content.length > 90) return false;
  return !/[.!?]\s*$/.test(content);
}

function textLayerNameSuggestsHeading(text) {
  try {
    return /\b(heading|headline|title|display|hero|h[1-6])\b/i.test(String(text && text.name || ''));
  } catch {
    return false;
  }
}

function textLooksLikeHeading(text, fontSize) {
  if (typeof fontSize !== 'number') return textLayerNameSuggestsHeading(text);
  if (textLayerNameSuggestsHeading(text)) return true;
  if (fontSize >= 24) return true;
  const shortTitle = textLooksLikeShortTitle(text);
  if (fontSize >= 20 && shortTitle) return true;
  if (fontSize >= 18 && shortTitle && /medium|semi|demi|bold|black/i.test(textFontStyleName(text))) return true;
  return false;
}

function textStyleName(text) {
  if (!text.textStyleId || text.textStyleId === figma.mixed) return '';
  const style = figma.getStyleById(text.textStyleId);
  return style && style.type === 'TEXT' ? style.name : '';
}

function textAlignment(text) {
  const alignment = text.textAlignHorizontal;
  if (alignment === 'CENTER') return 'center';
  if (alignment === 'RIGHT') return 'right';
  return 'left';
}

function conversionTextAlignment(text, warnings, label = 'Converted text') {
  try {
    if (text.textAlignHorizontal === 'CENTER') return 'center';
    if (text.textAlignHorizontal === 'RIGHT') return 'right';
    if (text.textAlignHorizontal === 'LEFT') return 'left';
    if (text.textAlignHorizontal === 'JUSTIFIED') {
      warnings.push(`${label} uses justified text alignment, which A1 Heading/Body does not support; left alignment was used.`);
    }
  } catch {
    // Fall through to the default alignment below.
  }
  return 'left';
}

function textColorTokenFromVariable(variable) {
  // `canonicalKey` intentionally keeps `/` for component/style paths. Color
  // variables use that separator (`color/text/accent`), so normalize it before
  // matching semantic token suffixes.
  const name = variable && canonicalKey(variable.name).replaceAll('/', '');
  if (name && name.endsWith('textdefault')) return 'default';
  if (name && name.endsWith('textmuted')) return 'muted';
  if (name && name.endsWith('textaccent')) return 'accent';
  return null;
}

function isLinkColorVariable(variable) {
  const name = variable && canonicalKey(variable.name);
  return Boolean(name && (name === canonicalKey('link/color') || name.endsWith(canonicalKey('link/color'))));
}

function visibleSolidTextPaint(text) {
  return Array.isArray(text.fills)
    ? text.fills.find((entry) => entry && entry.type === 'SOLID' && entry.visible !== false)
    : null;
}

function firstSolidTextPaint(text) {
  const direct = visibleSolidTextPaint(text);
  if (direct) return direct;
  if (!text || !text.characters || typeof text.getRangeFills !== 'function') return null;
  try {
    const fills = text.getRangeFills(0, text.characters.length);
    const rangePaint = Array.isArray(fills)
      ? fills.find((entry) => entry && entry.type === 'SOLID' && entry.visible !== false)
      : null;
    if (rangePaint) return rangePaint;
    // A mixed range can decline to expose a single fill array. Any single
    // character supplies a valid paint carrier for the full AutoFix binding.
    for (let index = 0; index < text.characters.length; index += 1) {
      const characterFills = text.getRangeFills(index, index + 1);
      const characterPaint = Array.isArray(characterFills)
        ? characterFills.find((entry) => entry && entry.type === 'SOLID' && entry.visible !== false)
        : null;
      if (characterPaint) return characterPaint;
    }
    return null;
  } catch {
    return null;
  }
}

function textColorToken(text) {
  const paint = visibleSolidTextPaint(text);
  const variableId = paint && paint.boundVariables && paint.boundVariables.color && paint.boundVariables.color.id;
  const variable = variableId && figma.variables.getVariableById(variableId);
  // The JSON model deliberately carries the component's semantic color prop
  // (`color: "muted"`), never a rendered color. This maps to the Figma
  // `color/text/muted` variable and lets every A1 renderer resolve its own
  // theme. Figma's variable path includes the `color/` namespace, so match its
  // semantic suffix rather than assuming a shortened variable name.
  return textColorTokenFromVariable(variable);
}

function textUsesLinkColor(text) {
  const paint = visibleSolidTextPaint(text);
  return paintUsesLinkColor(paint);
}

function paintUsesLinkColor(paint) {
  const variableId = paint && paint.boundVariables && paint.boundVariables.color && paint.boundVariables.color.id;
  return Boolean(variableId && isLinkColorVariable(figma.variables.getVariableById(variableId)));
}

function isBluePaint(paint) {
  const color = paint && paint.color;
  return Boolean(color && color.b > color.g && color.b > color.r);
}

function isBlackPaint(paint) {
  const color = paint && paint.color;
  return Boolean(color && color.r === 0 && color.g === 0 && color.b === 0);
}

function isBlueUnderlinedText(text) {
  if (!text || text.textDecoration !== 'UNDERLINE') return false;
  if (textUsesLinkColor(text)) return true;
  // A manually-authored blue or blue-violet underline is an intentional link
  // cue. The AutoFix below replaces it with the A1 Link style and token rather
  // than preserving a raw paint value in JSON.
  return isBluePaint(visibleSolidTextPaint(text));
}

function inlineLinkRanges(text) {
  if (!text || !text.characters || typeof text.getRangeTextDecoration !== 'function' || typeof text.getRangeFills !== 'function') return [];
  const ranges = [];
  let open = null;
  const close = (end) => {
    if (!open) return;
    ranges.push({ start: open.start, end, needsFix: open.needsFix });
    open = null;
  };

  for (let index = 0; index < text.characters.length; index += 1) {
    let isLink = false;
    let needsFix = true;
    try {
      const decoration = text.getRangeTextDecoration(index, index + 1);
      const fills = text.getRangeFills(index, index + 1);
      const paint = Array.isArray(fills) ? fills.find((entry) => entry && entry.type === 'SOLID' && entry.visible !== false) : null;
      // Within a Heading or Paragraph, an underline is the explicit authored
      // inline-link cue. The surrounding component owns typography; AutoFix
      // normalizes the range itself to Link's semantic color token.
      isLink = decoration === 'UNDERLINE';
      needsFix = !paintUsesLinkColor(paint);
    } catch {
      // Range inspection is unavailable for a transient mixed-text selection.
      // The layer can still export as ordinary Heading or Paragraph text.
      isLink = false;
    }
    if (isLink && !open) open = { start: index, needsFix };
    else if (isLink && open) open.needsFix = open.needsFix || needsFix;
    else close(index);
  }
  close(text.characters.length);
  return ranges;
}

function resolvedVariableColor(variable, modeId, seen = new Set()) {
  if (!variable || seen.has(variable.id)) return null;
  seen.add(variable.id);
  const values = variable.valuesByMode || {};
  const value = values[modeId] || values[Object.keys(values)[0]];
  if (value && typeof value.r === 'number' && typeof value.g === 'number' && typeof value.b === 'number') return value;
  if (value && value.type === 'VARIABLE_ALIAS' && value.id) {
    return resolvedVariableColor(figma.variables.getVariableById(value.id), modeId, seen);
  }
  return null;
}

function colorDistance(first, second) {
  const opacityA = first.opacity === undefined ? 1 : first.opacity;
  const opacityB = second.a === undefined ? 1 : second.a;
  return Math.hypot(first.color.r - second.r, first.color.g - second.g, first.color.b - second.b, opacityA - opacityB);
}

async function nearestTextColorToken(text, allowedTokens) {
  const paint = visibleSolidTextPaint(text);
  if (!paint || !paint.color) return null;
  const variables = await figma.variables.getLocalVariablesAsync('COLOR');
  let nearest = null;
  for (const variable of variables) {
    const token = textColorTokenFromVariable(variable);
    if (!token || !allowedTokens.includes(token)) continue;
    for (const modeId of Object.keys(variable.valuesByMode || {})) {
      const color = resolvedVariableColor(variable, modeId);
      if (!color) continue;
      const distance = colorDistance(paint, color);
      if (!nearest || distance < nearest.distance) nearest = { token, distance };
    }
  }
  return nearest && nearest.token;
}

function currentTextNode(text) {
  const current = text && resolveNodeById(text.id);
  return current && current.type === 'TEXT' ? current : text;
}

function headingElementForSize(size) {
  return ({ xs: 'h6', sm: 'h5', md: 'h4', lg: 'h3', xl: 'h2', xxl: 'h1' })[size] || 'h2';
}

function inferredLinkWeight(text) {
  if (!text || text.fontName === figma.mixed) return 'normal';
  const style = String(text.fontName.style || '').toLowerCase();
  if (/black|bold/.test(style)) return 'bold';
  if (/semibold|demi/.test(style)) return 'semibold';
  if (/medium/.test(style)) return 'medium';
  return 'normal';
}

function linkTextSuggestion(text) {
  const style = textStyleName(text).trim().toLowerCase();
  const styleMatch = /^link\/(xs|sm|md|lg|xl)\/(normal|medium|semibold|bold)$/.exec(style);
  const fontSize = text.fontSize === figma.mixed ? undefined : text.fontSize;
  const styleSize = styleMatch && styleMatch[1];
  const requestedSize = styleSize || nearestTextSize(PARAGRAPH_FONT_SIZES, fontSize, 'md');
  const requestedWeight = styleMatch ? styleMatch[2] : inferredLinkWeight(text);
  const hasCanonicalStyleSize = Boolean(styleMatch && typeof fontSize === 'number' && Math.abs(PARAGRAPH_FONT_SIZES[styleSize] - fontSize) < 0.01);
  const hasLinkColor = textUsesLinkColor(text);
  const issues = [];

  if (!styleMatch || !hasCanonicalStyleSize) {
    issues.push(`Blue underlined text looks like an A1 Link; Link/${requestedSize}/${requestedWeight} is the nearest match.`);
  }
  if (!hasLinkColor) issues.push('Its fill is not bound to the A1 link/color token.');
  if (!['LEFT', 'CENTER', 'RIGHT'].includes(text.textAlignHorizontal)) {
    issues.push('Its horizontal alignment is not supported by A1 Link text.');
  }

  return {
    type: 'Link',
    props: { size: requestedSize, weight: requestedWeight },
    issues,
    styleName: `link/${requestedSize}/${requestedWeight}`,
    color: 'link',
    align: textAlignment(text),
  };
}

function textSuggestion(text) {
  if (isBlueUnderlinedText(text)) return linkTextSuggestion(text);
  const style = textStyleName(text).trim().toLowerCase();
  const styleMatch = /^(heading|display|body)\/(xs|sm|md|lg|xl|xxl|jumbo|xjumbo)$/.exec(style);
  if (!styleMatch && auditA1TextStyleName(style)) {
    return {
      type: 'Paragraph',
      props: { size: 'md' },
      issues: [],
      styleName: style,
      color: textColorToken(text) || 'default',
      align: textAlignment(text),
    };
  }
  const fontSize = text.fontSize === figma.mixed ? undefined : text.fontSize;
  const likelyHeading = styleMatch
    ? styleMatch[1] !== 'body'
    : textLooksLikeHeading(text, fontSize);
  const family = styleMatch ? styleMatch[1] : inferredTextFamily(fontSize, likelyHeading);
  const scale = family === 'body' ? PARAGRAPH_FONT_SIZES : family === 'display' ? DISPLAY_FONT_SIZES : HEADING_FONT_SIZES;
  const allowed = family === 'body' ? PARAGRAPH_SIZES : family === 'display' ? DISPLAY_SIZES : HEADING_SIZES;
  const styleSize = styleMatch && allowed.includes(styleMatch[2]) ? styleMatch[2] : null;
  // A Figma text style can stay attached while its font size is locally
  // overridden. Treat the actual numeric size as authoritative so AutoFix
  // selects the nearest A1 option instead of reapplying the stale style size.
  const hasCanonicalStyleSize = styleSize && typeof fontSize === 'number' && Math.abs(scale[styleSize] - fontSize) < 0.01;
  const requestedSize = hasCanonicalStyleSize
    ? styleSize
    : nearestTextSize(scale, fontSize, family === 'body' ? 'md' : 'md');
  const detectedColor = textColorToken(text);
  const color = family === 'body' && detectedColor === 'accent' ? 'default' : detectedColor;
  const align = textAlignment(text);
  const issues = [];
  const inlineLinks = inlineLinkRanges(text);
  if (!styleMatch || !styleSize) {
    issues.push(`No A1 ${family === 'body' ? 'body' : family} text style is applied; ${family}/${requestedSize} is the nearest match.`);
  } else if (!hasCanonicalStyleSize) {
    const actualSize = typeof fontSize === 'number' ? `${fontSize}px` : 'mixed text sizes';
    issues.push(`Its font size (${actualSize}) does not match ${family}/${styleSize}; ${family}/${requestedSize} is the nearest A1 size.`);
  }
  if (!color) issues.push('Its fill is not bound to an A1 text color token.');
  if (family === 'body' && detectedColor === 'accent') issues.push('Paragraph does not support the A1 accent text color; default text color will be used.');
  if (!['LEFT', 'CENTER', 'RIGHT'].includes(text.textAlignHorizontal)) issues.push('Its horizontal alignment is not supported by A1 text components.');
  if (inlineLinks.some((link) => link.needsFix)) {
    issues.push('Blue underlined inline text looks like an A1 Link; AutoFix will bind each Link range to the link/color token.');
  }
  const props = family === 'body'
    ? { size: requestedSize, ...(color === 'muted' ? { color } : {}), ...(align !== 'left' ? { align } : {}) }
    : { as: family === 'display' ? 'h1' : headingElementForSize(requestedSize), type: family === 'display' ? 'display' : 'heading', size: requestedSize === 'xjumbo' ? 'xJumbo' : requestedSize, ...(color ? { color } : {}), ...(align !== 'left' ? { align } : {}) };
  return {
    type: family === 'body' ? 'Paragraph' : 'Heading',
    props,
    issues,
    styleName: `${family}/${requestedSize}`,
    color: color || 'default',
    align,
    inlineLinks,
  };
}

function exportTextNode(text) {
  // Figma can retain a selected-node handle across a fill-variable edit. Read
  // the current node again so manual color changes export the live binding.
  const current = currentTextNode(text);
  const suggestion = textSuggestion(current);
  const inlineLinks = suggestion.type === 'Link'
    ? []
    : (suggestion.inlineLinks || []).map(({ start, end }) => ({ start, end }));
  return {
    node: {
      id: componentId(suggestion.type, current),
      type: suggestion.type,
      props: suggestion.props,
      content: { fallback: current.characters, ...(inlineLinks.length ? { inlineLinks } : {}) },
    },
    warnings: suggestion.issues,
    review: suggestion.issues.length ? { issues: suggestion.issues, suggestion } : null,
  };
}

// ── Free auto-layout frames → Stack / Grid ────────────────────────────────
// Figma does not use a component instance for the general-purpose Stack. A
// normal authored auto-layout Frame is its counterpart. Component internals
// are deliberately excluded, while a frame placed in a native SLOT remains
// exportable: the slot is the component's editable content boundary.

/** Shared Figma auto-layout sizing reads and writes. */

function layoutWidthMode(node) {
  if (!node) return 'hug';
  try {
    if (node.layoutGrow > 0) return 'fill';
  } catch {
    // Non-auto-layout children may not expose layout grow.
  }
  try {
    if (node.layoutAlign === 'STRETCH') return 'fill';
  } catch {
    // Ignore unsupported sizing handles.
  }
  try {
    if (node.layoutSizingHorizontal === 'FILL') return 'fill';
  } catch {
    // Ignore unsupported sizing handles.
  }
  return 'hug';
}

function trySetLayoutProperty(node, property, value, warnings, label) {
  if (!node) return false;
  try {
    node[property] = value;
    return true;
  } catch (error) {
    if (warnings && label) warnings.push(`${label} could not be changed: ${error.message}`);
    return false;
  }
}

function syncAutoLayoutOwnSizingMode(node, axis, mode, warnings, label) {
  if (!node || !['HORIZONTAL', 'VERTICAL'].includes(node.layoutMode)) return;
  const property = axis === 'horizontal'
    ? (node.layoutMode === 'HORIZONTAL' ? 'primaryAxisSizingMode' : 'counterAxisSizingMode')
    : (node.layoutMode === 'VERTICAL' ? 'primaryAxisSizingMode' : 'counterAxisSizingMode');
  trySetLayoutProperty(node, property, mode, warnings, `${label} own ${axis} sizing`);
}

function syncLayoutWidthMode(node, widthMode, warnings, label = 'Layout') {
  const fill = widthMode === 'fill';
  const parent = node && node.parent;
  if (fill) {
    trySetLayoutProperty(node, 'layoutSizingHorizontal', 'FILL', warnings, `${label} width sizing`);
    if (parent && parent.layoutMode === 'HORIZONTAL') {
      trySetLayoutProperty(node, 'layoutGrow', 1, warnings, `${label} width fill`);
    }
    if (parent && ['VERTICAL', 'GRID'].includes(parent.layoutMode)) {
      trySetLayoutProperty(node, 'layoutAlign', 'STRETCH', warnings, `${label} width fill alignment`);
    }
    syncAutoLayoutOwnSizingMode(node, 'horizontal', 'FIXED', warnings, label);
    return;
  }
  trySetLayoutProperty(node, 'layoutSizingHorizontal', 'HUG', warnings, `${label} width sizing`);
  if (parent && parent.layoutMode === 'HORIZONTAL') {
    trySetLayoutProperty(node, 'layoutGrow', 0, warnings, `${label} width hug`);
  }
  if (parent && ['VERTICAL', 'GRID'].includes(parent.layoutMode)) {
    trySetLayoutProperty(node, 'layoutAlign', 'INHERIT', warnings, `${label} width hug alignment`);
  }
  syncAutoLayoutOwnSizingMode(node, 'horizontal', 'AUTO', warnings, label);
}

function layoutHeightMode(node) {
  if (!node) return 'hug';
  const parent = node.parent;
  try {
    if (parent && parent.layoutMode === 'VERTICAL' && node.layoutGrow > 0) return 'fill';
  } catch {
    // Ignore unsupported layout grow handles.
  }
  try {
    if (parent && parent.layoutMode === 'HORIZONTAL' && node.layoutAlign === 'STRETCH') return 'fill';
  } catch {
    // Ignore unsupported layout align handles.
  }
  try {
    if (node.layoutSizingVertical === 'FILL') return 'fill';
  } catch {
    // Ignore unsupported sizing handles.
  }
  return 'hug';
}

function syncLayoutHeightMode(node, heightMode, warnings, label = 'Layout') {
  const fill = heightMode === 'fill';
  const parent = node && node.parent;
  if (fill) {
    trySetLayoutProperty(node, 'layoutSizingVertical', 'FILL', warnings, `${label} height sizing`);
    if (parent && parent.layoutMode === 'VERTICAL') {
      trySetLayoutProperty(node, 'layoutGrow', 1, warnings, `${label} height fill`);
    }
    if (parent && parent.layoutMode === 'HORIZONTAL') {
      trySetLayoutProperty(node, 'layoutAlign', 'STRETCH', warnings, `${label} height fill alignment`);
    }
    syncAutoLayoutOwnSizingMode(node, 'vertical', 'FIXED', warnings, label);
    return;
  }
  trySetLayoutProperty(node, 'layoutSizingVertical', 'HUG', warnings, `${label} height sizing`);
  if (parent && parent.layoutMode === 'VERTICAL') {
    trySetLayoutProperty(node, 'layoutGrow', 0, warnings, `${label} height hug`);
  }
  if (parent && parent.layoutMode === 'HORIZONTAL') {
    trySetLayoutProperty(node, 'layoutAlign', 'INHERIT', warnings, `${label} height hug alignment`);
  }
  syncAutoLayoutOwnSizingMode(node, 'vertical', 'AUTO', warnings, label);
}

/** Shared slot and component-content accessors. */

function namedSlot(instance, name) {
  const wanted = canonicalKey(name);
  const names = wanted === 'contentslot'
    ? new Set(['contentslot', 'content', 'cardcontent', 'cardcontentslot'])
    : new Set([wanted]);
  try {
    const liveInstance = instance && instance.type === 'INSTANCE'
      ? currentInstance(instance)
      : instance;
    return liveInstance && liveInstance.findOne((node) => {
      try {
        if (!names.has(canonicalKey(node.name))) return false;
        return node.type === 'SLOT' || node.type === 'FRAME' || node.type === 'GROUP';
      } catch {
        return false;
      }
    }) || null;
  } catch {
    return null;
  }
}

function nativeSlot(instance, name) {
  const wanted = canonicalKey(name);
  const liveInstance = instance && instance.type === 'INSTANCE'
    ? currentInstance(instance)
    : instance;
  if (!liveInstance) return null;
  try {
    const slots = liveInstance.findAll((node) => {
      try {
        if (node.type !== 'SLOT' && node.type !== 'FRAME' && node.type !== 'GROUP') return false;
        if (canonicalKey(node.name) === wanted) return true;
        const refs = node.componentPropertyReferences || {};
        return Object.values(refs).some((value) => canonicalKey(String(value || '')).startsWith(wanted));
      } catch {
        return false;
      }
    });
    return slots.find((slot) => canonicalKey(slot.name) === wanted) || slots[0] || null;
  } catch {
    return namedSlot(liveInstance, name);
  }
}

function componentText(instance, name, fallback = '') {
  const value = componentPropertyValue(instance, name, 'TEXT');
  return typeof value === 'string' ? value : fallback;
}

function componentBoolean(instance, name, fallback = false) {
  const value = componentPropertyValue(instance, name, 'BOOLEAN');
  return typeof value === 'boolean' ? value : fallback;
}

/** Figma node resolution and shared selection geometry helpers. */

function resolveNodeById(id) {
  if (!id || typeof id !== 'string') return null;
  try {
    return figma.getNodeById(id) || null;
  } catch {
    return null;
  }
}

async function resolveNodeByIdAsync(id) {
  if (!id || typeof id !== 'string') return null;
  try {
    if (typeof figma.getNodeByIdAsync === 'function') return await figma.getNodeByIdAsync(id);
  } catch {
    return null;
  }
  return resolveNodeById(id);
}

function liveNode(node) {
  try {
    if (!node || typeof node.id !== 'string') return null;
    return resolveNodeById(node.id);
  } catch {
    return null;
  }
}

function safeParent(node) {
  try {
    return node && node.parent ? node.parent : null;
  } catch {
    return null;
  }
}

// Native instance sublayers can vanish between a findAll/findOne result and a
// later export pass. Reading `children` through this guard keeps one stale
// implementation layer from aborting the entire page export.
function safeChildren(node) {
  try {
    return node && node.children ? [...node.children] : [];
  } catch {
    return [];
  }
}

function stackFlowChildren(frame) {
  let children = [];
  try {
    children = frame && frame.children ? frame.children : [];
  } catch {
    return [];
  }
  return children
    .map(liveNode)
    .filter(Boolean)
    .filter((child) => {
      try {
        return child.layoutPositioning !== 'ABSOLUTE';
      } catch {
        return false;
      }
    });
}

// ── Variable-collection helpers (ContentWidth / Gap / Color modes) ──────────


function topLevelSelectionNodes(selection) {
  const nodes = (selection || [])
    .map(liveNode)
    .filter(Boolean)
    .filter((node) => !isAuditReportNode(node));
  const selectedIds = new Set(nodes.map((node) => node.id));
  return nodes.filter((node) => {
    try {
      if (node.type === 'PAGE' || !node.parent) return false;
      if (['COMPONENT', 'COMPONENT_SET', 'SLOT'].includes(node.type) || isComponentImplementationNode(node)) return false;
      for (let parent = node.parent; parent && parent.type !== 'PAGE'; parent = parent.parent) {
        if (selectedIds.has(parent.id)) return false;
      }
      return true;
    } catch {
      return false;
    }
  });
}

function commonParent(nodes) {
  if (!nodes.length) return null;
  const parent = nodes[0].parent;
  return nodes.every((node) => node.parent && node.parent.id === parent.id) ? parent : null;
}

function selectionBoundsInParent(nodes) {
  if (!nodes.length) return null;
  try {
    const minX = Math.min(...nodes.map((node) => node.x));
    const minY = Math.min(...nodes.map((node) => node.y));
    const maxX = Math.max(...nodes.map((node) => node.x + node.width));
    const maxY = Math.max(...nodes.map((node) => node.y + node.height));
    return { x: minX, y: minY, width: Math.max(1, maxX - minX), height: Math.max(1, maxY - minY) };
  } catch {
    return null;
  }
}


function selectedNodesInParentOrder(parent, nodes) {
  const ids = new Set(nodes.map((node) => node.id));
  try {
    return parent.children.filter((child) => ids.has(child.id));
  } catch {
    return nodes;
  }
}

// Atomic component adapter boundary.
//
// The controller still contains the legacy implementations while this first
// vertical slice is migrated. The registry and workflows now depend on these
// stable adapter functions, so each implementation can move here without a
// second rewrite of the dispatch layer.

function exportBadge(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};
  const status = componentPropertyValue(instance, 'Status', 'VARIANT');
  const subtle = componentPropertyValue(instance, 'Subtle', 'VARIANT');
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  if (BADGE_STATUSES.includes(status) && status !== 'neutral') props.status = status;
  if (subtle === 'true' || subtle === true) props.subtle = true;
  if (BADGE_SIZES.includes(size)) props.size = size;
  if (!componentBoolean(instance, 'Show icon', true)) props.icon = null;
  else {
    const defaultIcon = BADGE_DEFAULT_ICONS[BADGE_STATUSES.includes(status) ? status : 'neutral'];
    const iconName = iconNameFromInstance(instance) || iconNameFromEditableText(instance) || iconNameFromSwapValue(iconSwapPropertyValue(instance));
    if (iconName && iconName !== defaultIcon) props.icon = iconName;
    else if (!iconName) warnings.push('Badge icon is visible but its Material icon component could not be resolved.');
  }
  const node = { id: componentId('MessageBadge', instance), type: 'MessageBadge', content: { fallback: componentText(instance, 'Label', 'Badge') } };
  if (Object.keys(props).length > 0) node.props = props;
  return { node, warnings };
}

function badgeContextForSelection(instance) {
  instance = currentInstance(instance);
  const statusValue = componentPropertyValue(instance, 'Status', 'VARIANT');
  const status = BADGE_STATUSES.includes(statusValue) ? statusValue : 'neutral';
  const subtle = componentPropertyValue(instance, 'Subtle', 'VARIANT');
  const sizeValue = componentPropertyValue(instance, 'Size', 'VARIANT');
  const size = BADGE_SIZES.includes(sizeValue) ? sizeValue : 'md';
  const showIcon = componentBoolean(instance, 'Show icon', true);
  const defaultIcon = BADGE_DEFAULT_ICONS[status];
  const icon = iconNameFromInstance(instance) || iconNameFromEditableText(instance) || iconNameFromSwapValue(iconSwapPropertyValue(instance)) || defaultIcon;
  return {
    label: componentText(instance, 'Label', 'Badge'), status, statusOptions: BADGE_STATUSES,
    size, sizeOptions: BADGE_SIZES, subtle: subtle === 'true' || subtle === true ? 'true' : 'false',
    subtleOptions: ['false', 'true'], iconMode: showIcon ? 'show' : 'none', iconModeOptions: ['none', 'show'],
    icon, iconCustom: Boolean(icon && icon !== defaultIcon),
  };
}

async function applyBadge(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const assignments = {};
  const status = BADGE_STATUSES.includes(props.status) ? props.status : 'neutral';
  queueComponentProperty(instance, assignments, 'Status', status, 'VARIANT', warnings, 'Badge status');
  queueComponentProperty(instance, assignments, 'Subtle', props.subtle === true ? 'true' : 'false', 'VARIANT', warnings, 'Badge subtle');
  const size = BADGE_SIZES.includes(props.size) ? props.size : 'md';
  queueComponentProperty(instance, assignments, 'Size', size, 'VARIANT', warnings, 'Badge size');
  const hasIconProp = Object.prototype.hasOwnProperty.call(props, 'icon');
  const iconName = typeof props.icon === 'string' && props.icon.length > 0 ? props.icon : BADGE_DEFAULT_ICONS[status];
  const materialIcon = props.icon !== null ? await findMaterialIconComponentAsync(iconName, warnings) : null;
  let iconPropertyApplied = false;
  if (materialIcon) iconPropertyApplied = queueIconSwapProperty(instance, assignments, materialIcon);
  if (!iconPropertyApplied && props.icon !== null) iconPropertyApplied = queueIconTextProperty(instance, assignments, iconName);
  queueComponentProperty(instance, assignments, 'Show icon', props.icon !== null, 'BOOLEAN', warnings, 'Badge icon visibility');
  if (node.content && typeof node.content.fallback === 'string') queueComponentProperty(instance, assignments, 'Label', node.content.fallback, 'TEXT', warnings, 'Badge label');
  applyQueuedProperties(instance, assignments, warnings, 'Badge properties');
  if (props.icon !== null) {
    if (!materialIcon && hasIconProp && !iconPropertyApplied) warnings.push(`No Material icon component named "${iconName}" exists in this file — trying the editable Badge icon text fallback.`);
    await finalizeMaterialIconUpdate(instance, iconName, materialIcon, iconPropertyApplied, warnings, 'Badge Material icon');
  }
  if (props.size !== undefined && !BADGE_SIZES.includes(props.size)) warnings.push(`Badge size="${props.size}" is not available in Figma; md was used.`);
}

async function importBadge(node, warnings) {
  const instance = await createComponentInstance('Badge', warnings);
  await applyBadge(instance, node, warnings);
  return instance;
}

function exportSwitch(instance) {
  const props = {};
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  const checked = componentPropertyValue(instance, 'Checked', 'VARIANT');
  if (SWITCH_SIZES.includes(size) && size !== 'default') props.size = size;
  if (checked === 'true' || checked === true) props.defaultChecked = true;
  const label = componentText(instance, 'Label', namedTextValue(instance, 'Label')).trim();
  const hint = componentText(instance, 'Hint', namedTextValue(instance, 'Hint')).trim();
  const error = componentText(instance, 'Error', namedTextValue(instance, 'Error')).trim();
  const showHint = componentBoolean(instance, 'Show hint', false);
  const showError = componentBoolean(instance, 'Show error', false);
  if (label) props.label = label;
  if (showError && error) props.error = error;
  else if (showHint && hint) props.hint = hint;
  return { node: { id: componentId('Switch', instance), type: 'Switch', props }, warnings: [] };
}

async function applySwitch(instance, node, warnings) {
  const props = node.props || {};
  const live = currentInstance(instance);
  const assignments = {};
  const hint = typeof props.hint === 'string' ? props.hint : '';
  const error = typeof props.error === 'string' ? props.error : '';
  const showError = error.length > 0;
  const showHint = hint.length > 0 && !showError;
  queueComponentProperty(live, assignments, 'Size', SWITCH_SIZES.includes(props.size) ? props.size : 'default', 'VARIANT', warnings, 'Switch Size');
  queueComponentProperty(live, assignments, 'Checked', props.checked === true || props.defaultChecked === true ? 'true' : 'false', 'VARIANT', warnings, 'Switch Checked');
  queueComponentProperty(live, assignments, 'Label', typeof props.label === 'string' ? props.label : 'Enable option', 'TEXT', warnings, 'Switch Label');
  queueComponentProperty(live, assignments, 'Hint', hint || 'Supporting text', 'TEXT', warnings, 'Switch Hint');
  queueComponentProperty(live, assignments, 'Show hint', showHint, 'BOOLEAN', warnings, 'Switch Show hint');
  queueComponentProperty(live, assignments, 'Error', error || 'This setting requires attention.', 'TEXT', warnings, 'Switch Error');
  queueComponentProperty(live, assignments, 'Show error', showError, 'BOOLEAN', warnings, 'Switch Show error');
  applyQueuedProperties(live, assignments, warnings, 'Switch properties');
  if (props.checked !== undefined) warnings.push('Switch controlled checked state is represented as the current Figma Checked visual.');
}

async function importSwitch(node, warnings) {
  const instance = await createComponentInstance('Switch', warnings);
  await applySwitch(instance, node, warnings);
  return instance;
}

function exportTooltip(instance) {
  const props = {};
  const placement = componentPropertyValue(instance, 'Placement', 'VARIANT');
  if (TOOLTIP_PLACEMENTS.includes(placement) && placement !== 'top') props.placement = placement;
  return { node: { id: componentId('Tooltip', instance), type: 'Tooltip', props: { ...props, content: namedTextValue(instance, 'Content', 'Helpful supporting text') } }, warnings: ['Tooltip trigger content is runtime-only and is not included in the standalone Figma surface export.'] };
}

async function applyTooltip(instance, node, warnings) {
  const props = node.props || {};
  setVariant(instance, 'Placement', TOOLTIP_PLACEMENTS.includes(props.placement) ? props.placement : 'top', warnings, 'Tooltip');
  if (typeof props.content === 'string') await writeNamedText(instance, 'Content', props.content, warnings, 'Tooltip');
}

async function importTooltip(node, warnings) {
  const instance = await createComponentInstance('Tooltip', warnings);
  await applyTooltip(instance, node, warnings);
  warnings.push('Tooltip was rendered as its visual surface; add its trigger relationship in Figma manually.');
  return instance;
}

function codeTextValue(instance) {
  const direct = componentText(instance, 'Code',
    componentText(instance, 'Content',
      componentText(instance, 'Value',
        componentText(instance, 'Text', ''))));
  if (direct) return direct;
  try {
    const texts = currentInstance(instance).findAll((node) => node.type === 'TEXT' && node.visible !== false);
    const candidates = texts
      .map((text) => (typeof text.characters === 'string' ? text.characters : ''))
      .map((value) => value.trim())
      .filter(Boolean)
      .filter((value) => !/^(copy|show more|show less)$/i.test(value));
    return candidates.sort((a, b) => b.length - a.length)[0] || '';
  } catch {
    return '';
  }
}

function exportCode(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};
  const variant = componentPropertyValue(instance, 'Variant', 'VARIANT');
  if (variant === 'inline' || variant === 'block') props.variant = variant;
  const wrapping = componentBoolean(instance, 'Wrapping', undefined);
  if (typeof wrapping === 'boolean') props.wrapping = wrapping;
  const editable = componentBoolean(instance, 'Editable', undefined);
  if (typeof editable === 'boolean') props.editable = editable;
  const copyCode = componentBoolean(instance, 'Copy code', componentBoolean(instance, 'Copy Code', undefined));
  if (typeof copyCode === 'boolean') props.copyCode = copyCode;
  const copyText = componentText(instance, 'Copy text', componentText(instance, 'Copy Text', '')).trim();
  if (copyText) props.copyText = copyText;
  const collapsedLines = componentPropertyValue(instance, 'Collapsed lines', 'TEXT') || componentPropertyValue(instance, 'Collapsed Lines', 'TEXT');
  const numericCollapsedLines = Number(collapsedLines);
  if (Number.isFinite(numericCollapsedLines) && numericCollapsedLines > 0) props.collapsedLines = numericCollapsedLines;
  return { node: { id: componentId('Code', instance), type: 'Code', props, content: { fallback: codeTextValue(instance) || 'Code sample' } }, warnings };
}

async function applyCode(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const assignments = {};
  const variant = props.variant === 'inline' ? 'inline' : 'block';
  queueOptionalComponentProperty(instance, assignments, 'Variant', variant, 'VARIANT');
  if (props.wrapping !== undefined) queueOptionalComponentProperty(instance, assignments, 'Wrapping', props.wrapping === true, 'BOOLEAN');
  if (props.editable !== undefined) queueOptionalComponentProperty(instance, assignments, 'Editable', props.editable === true, 'BOOLEAN');
  if (props.copyCode !== undefined) {
    queueOptionalComponentProperty(instance, assignments, 'Copy code', props.copyCode === true, 'BOOLEAN')
      || queueOptionalComponentProperty(instance, assignments, 'Copy Code', props.copyCode === true, 'BOOLEAN')
      || queueOptionalComponentProperty(instance, assignments, 'Show copy', props.copyCode === true, 'BOOLEAN')
      || queueOptionalComponentProperty(instance, assignments, 'Show copy button', props.copyCode === true, 'BOOLEAN');
  }
  if (typeof props.copyText === 'string') {
    queueOptionalComponentProperty(instance, assignments, 'Copy text', props.copyText, 'TEXT')
      || queueOptionalComponentProperty(instance, assignments, 'Copy Text', props.copyText, 'TEXT');
  }
  if (props.collapsedLines !== undefined) {
    queueOptionalComponentProperty(instance, assignments, 'Collapsed lines', String(props.collapsedLines), 'TEXT')
      || queueOptionalComponentProperty(instance, assignments, 'Collapsed Lines', String(props.collapsedLines), 'TEXT');
  }
  const value = node.content && typeof node.content.fallback === 'string' ? node.content.fallback : typeof props.children === 'string' ? props.children : 'Code sample';
  const appliedTextProperty = queueOptionalComponentProperty(instance, assignments, 'Code', value, 'TEXT')
    || queueOptionalComponentProperty(instance, assignments, 'Content', value, 'TEXT')
    || queueOptionalComponentProperty(instance, assignments, 'Value', value, 'TEXT')
    || queueOptionalComponentProperty(instance, assignments, 'Text', value, 'TEXT');
  applyQueuedProperties(instance, assignments, warnings, 'Code properties');
  if (!appliedTextProperty) await writeFirstNamedText(instance, ['Code', 'Content', 'Value', 'Text'], value, warnings, 'Code text');
  for (const runtimeProp of ['onChangeValue', 'className', 'id']) {
    if (props[runtimeProp] !== undefined) warnings.push(`"${runtimeProp}" is a runtime prop with no Figma representation — ignored.`);
  }
}

async function importCode(node, warnings) {
  const instance = await createComponentInstance('Code', warnings);
  await applyCode(instance, node, warnings);
  return instance;
}

function inlineTextValue(instance) {
  const direct = componentText(instance, 'Markdown', componentText(instance, 'Content', componentText(instance, 'Value', componentText(instance, 'Text', ''))));
  if (direct) return direct;
  try {
    const texts = currentInstance(instance).findAll((node) => node.type === 'TEXT' && node.visible !== false);
    return texts.map((text) => (typeof text.characters === 'string' ? text.characters : '')).map((value) => value.trim()).filter(Boolean).sort((a, b) => b.length - a.length)[0] || '';
  } catch {
    return '';
  }
}

function inlineElementValue(value) {
  const normalized = String(value || '').trim();
  if (!normalized) return '';
  const compact = normalized.toLowerCase().replace(/\s+/g, '-');
  return INLINE_ELEMENTS.includes(compact) ? compact : '';
}

function exportInline(instance) {
  instance = currentInstance(instance);
  const props = {};
  const element = inlineElementValue(componentPropertyValue(instance, 'Inline element', 'VARIANT') || componentPropertyValue(instance, 'Element', 'VARIANT') || componentPropertyValue(instance, 'Type', 'VARIANT') || componentText(instance, 'Inline element', ''));
  if (element && element !== 'all') props.inlineElement = element;
  return { node: { id: componentId('Inline', instance), type: 'Inline', props, content: { fallback: inlineTextValue(instance) || 'Inline text' } }, warnings: [] };
}

async function applyInline(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const assignments = {};
  const requestedElement = typeof props.inlineElement === 'string' ? props.inlineElement : 'all';
  const element = INLINE_ELEMENTS.includes(requestedElement) ? requestedElement : 'all';
  queueOptionalComponentProperty(instance, assignments, 'Inline element', element, 'VARIANT')
    || queueOptionalComponentProperty(instance, assignments, 'Element', element, 'VARIANT')
    || queueOptionalComponentProperty(instance, assignments, 'Type', element, 'VARIANT');
  const value = node.content && typeof node.content.fallback === 'string' ? node.content.fallback : typeof props.children === 'string' ? props.children : 'Inline text';
  const appliedTextProperty = queueOptionalComponentProperty(instance, assignments, 'Markdown', value, 'TEXT')
    || queueOptionalComponentProperty(instance, assignments, 'Content', value, 'TEXT')
    || queueOptionalComponentProperty(instance, assignments, 'Value', value, 'TEXT')
    || queueOptionalComponentProperty(instance, assignments, 'Text', value, 'TEXT');
  applyQueuedProperties(instance, assignments, warnings, 'Inline properties');
  if (!appliedTextProperty) await writeFirstNamedText(instance, ['Markdown', 'Content', 'Value', 'Text'], value, warnings, 'Inline text');
  for (const runtimeProp of ['className', 'id']) {
    if (props[runtimeProp] !== undefined) warnings.push(`"${runtimeProp}" is a runtime prop with no Figma representation — ignored.`);
  }
}

async function importInline(node, warnings) {
  const instance = await createComponentInstance('Inline', warnings);
  await applyInline(instance, node, warnings);
  return instance;
}

function exportDivider(instance) {
  const warnings = [];
  const props = {};
  const orientation = componentPropertyValue(instance, 'Orientation', 'VARIANT');
  const variant = componentPropertyValue(instance, 'Variant', 'VARIANT');
  const lineStyle = componentPropertyValue(instance, 'Line style', 'VARIANT');
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  if (DIVIDER_ORIENTATIONS.includes(orientation) && orientation !== 'horizontal') props.orientation = orientation;
  if (DIVIDER_VARIANTS.includes(variant) && variant !== 'subtle') props.variant = variant;
  if (DIVIDER_LINE_STYLES.includes(lineStyle) && lineStyle !== 'solid') props.lineStyle = lineStyle;
  if (DIVIDER_SIZES.includes(size) && size !== 'xs') props.size = size;
  return {
    node: { id: componentId('Divider', instance), type: 'Divider', ...(Object.keys(props).length ? { props } : {}) },
    warnings,
  };
}

function staticDividerOrientation(value, warnings) {
  if (DIVIDER_ORIENTATIONS.includes(value)) return value;
  if (value && typeof value === 'object') warnings.push('Responsive Divider orientation has no static Figma representation; horizontal was used.');
  else if (value !== undefined) warnings.push(`Unsupported Divider orientation "${value}" was ignored.`);
  return 'horizontal';
}

function applyDivider(instance, node, warnings) {
  const props = node.props || {};
  const assignments = {};
  queueComponentProperty(instance, assignments, 'Orientation', staticDividerOrientation(props.orientation, warnings), 'VARIANT', warnings, 'Divider orientation');
  queueComponentProperty(instance, assignments, 'Variant', DIVIDER_VARIANTS.includes(props.variant) ? props.variant : 'subtle', 'VARIANT', warnings, 'Divider variant');
  queueComponentProperty(instance, assignments, 'Line style', DIVIDER_LINE_STYLES.includes(props.lineStyle) ? props.lineStyle : 'solid', 'VARIANT', warnings, 'Divider line style');
  queueComponentProperty(instance, assignments, 'Size', DIVIDER_SIZES.includes(props.size) ? props.size : 'xs', 'VARIANT', warnings, 'Divider size');
  applyQueuedProperties(instance, assignments, warnings, 'Divider properties');
  for (const runtimeProp of ['space', 'decorative', 'className', 'id']) {
    if (props[runtimeProp] !== undefined) warnings.push(`"${runtimeProp}" has no Figma representation — ignored.`);
  }
}

async function importDivider(node, warnings) {
  const instance = await createComponentInstance('Divider', warnings);
  applyDivider(instance, node, warnings);
  return instance;
}

/** Shared, runtime-safe helpers used by the A1 exporter and Dev Mode codegen. */

const A1_BUTTON_VARIANTS = ['primary', 'secondary', 'tertiary', 'destructive', 'success'];
const A1_BUTTON_SIZES = ['sm', 'md', 'lg'];

function plainComponentKey(key) {
  return String(key || '').split('#')[0].toLowerCase().replace(/[\s_-]+/g, '');
}

function componentValue(properties, names, fallback) {
  const wanted = (Array.isArray(names) ? names : [names]).map(plainComponentKey);
  for (const [key, entry] of Object.entries(properties || {})) {
    if (!wanted.includes(plainComponentKey(key))) continue;
    if (entry && typeof entry === 'object' && 'value' in entry) return entry.value;
    return entry;
  }
  return fallback;
}

function textComponentValue(properties, names, fallback = '') {
  const value = componentValue(properties, names, fallback);
  return typeof value === 'string' ? value : fallback;
}

function sanitizeA1Id(prefix, id) {
  return `${prefix}-${String(id || 'selection').replace(/[^a-z0-9]+/gi, '-')}`;
}

/**
 * Serialize the canonical Button contract. The main plugin supplies resolved
 * icon/action data; Dev Mode supplies the same values directly from the node.
 */
function buttonNodeFromFigma({ id, properties = {}, label, iconName, fullWidth = false }) {
  const props = {};
  const variant = componentValue(properties, ['Variant'], 'primary');
  const size = componentValue(properties, ['Size'], 'md');
  const state = componentValue(properties, ['State'], 'default');
  const iconPosition = componentValue(properties, ['IconPosition', 'Icon position'], 'start');
  const showIcon = componentValue(properties, ['Show icon', 'ShowIcon'], false) === true ||
    componentValue(properties, ['Show icon', 'ShowIcon'], false) === 'true';

  if (A1_BUTTON_VARIANTS.includes(variant) && variant !== 'primary') props.variant = variant;
  if (A1_BUTTON_SIZES.includes(size) && size !== 'md') props.size = size;
  if (state === 'disabled') props.disabled = true;
  if (state === 'loading') props.loading = true;
  if (fullWidth === true) props.fullWidth = true;
  if (showIcon && iconName) {
    props.icon = iconName;
    if (iconPosition === 'end') props.iconPosition = 'end';
  }

  const content = typeof label === 'string' && label.trim() ? label.trim() : 'Button';
  const node = { id: sanitizeA1Id('button', id), type: 'Button', content: { fallback: content } };
  if (Object.keys(props).length) node.props = props;
  return node;
}


// A1 Design System – Component JSON (proof of concept, A1-1651)
//
// Two-way bridge between A1 Figma components and the A1 page-definition JSON
// used by the a1-web editor (apps/a1-web/src/editor/pageTypes.ts):
//
//   Export — select an A1 component instance and emit it as a page-definition
//   ComponentNode. Import — paste page-definition JSON and render every
//   supported node as an instance of the matching Figma component.
//
// Supported component sets: Button, Icon Button, Button Container, Link, Card, Banner,
// Badge, Chip, Chip Group, Figure, Definition List, Blockquote, Section, Bottom Sheet, Text Field, Search Field,
// Textarea, Select, Switch, Segmented Control, Tabs, Accordion, Tooltip, Pagination,
// Empty State, Divider, Menu, Dialog, Radio Group, Checkbox Group, Page Nav,
// Top Header, and Page Layout,
// plus standalone A1-styled text
// exported as Heading, Paragraph, or (when blue and underlined) Link. Section
// is split in two on the Figma side (the Section set + a separate content-width
// carrier), so its exporter and importer translate contentWidth between the
// shapes. The exporters/importers are keyed by component-set name so additional
// public A1 assets can be added without touching the plumbing. Export runs
// automatically when the selection or the selected instance's configuration
// changes.
//
// Run via Plugins > Development > Import plugin from manifest.


// ─── A1 contract (packages/react/src/components/button/Button.d.ts) ─────────

const BUTTON_VARIANTS = ['primary', 'secondary', 'tertiary', 'destructive', 'success'];
const BUTTON_SIZES = ['sm', 'md', 'lg'];
const BUTTON_CONTEXT_STATES = ['default', 'disabled', 'loading'];
const BUTTON_CONTEXT_ICON_MODES = ['hide', 'show'];
const BUTTON_CONTEXT_WIDTH_MODES = ['hug', 'fill'];
const BUTTON_FULL_WIDTH_NAME_PATTERN = /\s*(?:[-–—]\s*)?\{\s*fullWidth\s*:\s*(true|false)\s*\}\s*$/i;
const GRID_CONTEXT_WIDTH_MODES = ['hug', 'fill'];
const ICON_BUTTON_VARIANTS = ['tertiary', 'secondary', 'destructive', 'success'];
const ICON_BUTTON_SIZES = ['sm', 'md', 'lg'];
const BUTTON_CONTAINER_ALIGNS = ['start', 'center', 'end'];
const BUTTON_CONTAINER_QUERY_WIDTH = 480;
const BUTTON_CONTAINER_DIRECTION_PROPERTY_NAMES = ['Direction', 'direction', 'containerWidth', 'Container Width', 'ContainerWidth'];
const BUTTON_CONTAINER_DIRECTION_VARIANTS = {
  inline: ['inline (>480)', 'Inline (>480)', 'inline', 'Inline', 'row', 'Row', 'horizontal', 'Horizontal', 'wide', 'Wide', 'lg', 'LG', 'xl', 'XL'],
  stacked: ['stacked (<480)', 'Stacked (<480)', 'stacked', 'Stacked', 'column', 'Column', 'vertical', 'Vertical', 'narrow', 'Narrow', 'xs', 'XS', 'sm', 'SM'],
};
// Figma-only inspection states that have no React prop (see
// packages/react/ai/figma-workflow.md, Button gap table).
const VISUAL_ONLY_STATES = ['hover', 'focus', 'pressed'];
// Known node id of the Button component set in the A1 Figma file; the name
// lookup below is the fallback for copies of the file.
const BUTTON_SET_ID = '123:701';

// Section (packages/react/src/components/section/Section.d.ts). In Figma the
// Section model is split in two: the Section component set carries the
// Surface/Padding variants, while contentWidth lives separately — either a
// nested content-width component instance or the ContentWidth variable
// collection's mode — so export/import translate between the two shapes.
const SECTION_SURFACES = ['page', 'panel', 'raised'];
const SECTION_PADDINGS = ['none', 'xs', 'sm', 'md', 'lg'];
const SECTION_WIDTHS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
const SECTION_CONTENT_WIDTH_PIXELS = { xs: 456, sm: 640, md: 800, lg: 960, xl: 1120, '2xl': 1440 };
const SECTION_GAPS = ['xs', 'sm', 'md', 'lg', 'xl'];
const NINE_POSITIONS = ['center', 'top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left', 'top-left'];
// TEXT documentation properties on the Figma Section component (see the
// Section table in figma-workflow.md) mapped to their React props. Values
// equal to the React default are omitted from the JSON.
const SECTION_TEXT_PROPS = {
  Gradient: { prop: 'gradient', allowed: ['accent', 'highlight', 'info', 'success', 'warn'] },
  GradientPosition: { prop: 'gradientPosition', allowed: NINE_POSITIONS, default: 'center' },
  Height: { prop: 'height', allowed: ['screen', 'hero'] },
  Align: { prop: 'align', allowed: ['left', 'center', 'right'] },
  BorderSize: { prop: 'borderSize', allowed: ['xs', 'sm', 'md', 'lg'] },
  BorderStyle: { prop: 'borderStyle', allowed: ['solid', 'dashed', 'dotted'], default: 'solid' },
  BorderVariant: { prop: 'borderVariant', allowed: ['subtle', 'strong', 'accent'], default: 'subtle' },
  Radius: { prop: 'radius', allowed: ['sm', 'md', 'lg', 'xl'], default: 'none' },
  BackgroundImage: { prop: 'backgroundImage' },
  BackgroundFit: { prop: 'backgroundFit', allowed: ['cover', 'contain', 'tile'], default: 'cover' },
  BackgroundPosition: { prop: 'backgroundPosition', allowed: NINE_POSITIONS, default: 'center' },
  BackgroundOverlay: { prop: 'backgroundOverlay', allowed: ['darken', 'lighten'] },
  BackgroundOverlayStrength: { prop: 'backgroundOverlayStrength', allowed: ['sm', 'md', 'lg'], default: 'md' },
};

const TEXT_FIELD_SIZES = ['comfortable', 'default', 'compact'];
const SWITCH_SIZES = ['comfortable', 'default', 'compact'];
const SEGMENTED_SIZES = ['sm', 'md', 'lg'];
const TABS_VARIANTS = ['line', 'pills', 'segment', 'progress', 'folder'];
const TABS_SIZES = ['default', 'compact'];
const TABS_LEVELS = [1, 2];
const TABS_LABEL_MODES = ['all', 'selected'];
const TABS_ITEMS_SLOT_NAME = 'Tabs';
const TAB_ICON_POSITIONS = ['start', 'end', 'above'];
const TAB_STATUSES = ['none', 'in-progress', 'completed', 'error', 'warn', 'warning'];
const ACCORDION_SIZES = ['sm', 'md', 'lg'];
const TOOLTIP_PLACEMENTS = ['top', 'right', 'bottom', 'left'];
const PAGINATION_SIZES = ['sm', 'md', 'lg'];
const PAGE_NAV_MAX_SECTIONS = 5;
const TREE_MENU_MAX_ITEMS = 12;
const TREE_MENU_ITEM_SET_NAMES = new Set(['Tree Menu Item', 'Tree Item', 'TreeMenu Item', 'TreeMenuItem']);
const TREE_MENU_VARIANTS = ['expanded', 'collapsed'];
const EMPTY_STATE_SCALES = ['page', 'section', 'card'];
const SELECT_SIZES = ['comfortable', 'default', 'compact'];
const SELECT_STATES = ['default', 'error', 'disabled'];
const DIVIDER_ORIENTATIONS = ['horizontal', 'vertical'];
const DIVIDER_VARIANTS = ['subtle', 'strong', 'accent'];
const DIVIDER_LINE_STYLES = ['solid', 'dashed', 'dotted'];
const DIVIDER_SIZES = ['xs', 'sm', 'md', 'lg'];
const GROUP_SIZES = ['comfortable', 'default', 'compact'];
const DIALOG_SIZES = ['sm', 'md', 'lg', 'xl'];
const DIALOG_STATUSES = ['none', 'success', 'error', 'warn', 'info', 'neutral'];
const CARD_SURFACES = ['default', 'accent'];
const CARD_VARIANTS = ['default', 'navigation', 'bare'];
const CARD_ICON_START_MIN_WIDTH = 640;
const BREADCRUMB_TRAIL_MIN_WIDTH = 480;
const BADGE_STATUSES = ['neutral', 'info', 'success', 'warn', 'error'];
const BADGE_SIZES = ['sm', 'md', 'lg'];
const BADGE_DEFAULT_ICONS = {
  neutral: 'info',
  info: 'info',
  success: 'check_circle',
  warn: 'warning',
  error: 'error',
};
const BLOCKQUOTE_VARIANTS = ['border', 'filled', 'feature', 'minimal', 'accent', 'pull', 'ruled'];
const BANNER_VARIANTS = ['inline', 'system', 'calendar'];
const BANNER_STATUSES = ['neutral', 'info', 'success', 'warn', 'error'];
const BANNER_DEFAULT_ICONS = {
  neutral: 'info',
  info: 'info',
  success: 'check_circle',
  warn: 'warning',
  error: 'error',
};
const DEFINITION_LIST_DIRECTIONS = ['row', 'column'];
const DEFINITION_LIST_SIZES = ['sm', 'md', 'lg'];
const LINK_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
const LINK_WEIGHTS = ['normal', 'medium', 'semibold', 'bold'];
const LINK_ICON_POSITIONS = ['start', 'end'];
const ICON_SWAP_PROPERTY_NAMES = [
  'Icon',
  'icon',
  'Material icon',
  'Material Icon',
  'Nav icon',
  'Leading icon',
  'Trailing icon',
  'Glyph',
  'Symbol',
];
// The Figma Figure asset intentionally uses a compact subset of React's
// larger size/ratio surface to avoid a 64-variant matrix.
const FIGURE_SIZES = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl'];
const FIGURE_ASPECT_RATIOS = ['16:9', '4:3', '1:1', '3:4', '9:16'];
// These are maximum widths, matching the React Figure size scale. The Figure
// itself remains flexible in an auto-layout parent; only its outer boundary is
// capped. Aspect ratios belong to the nested image, never to that boundary.
const FIGURE_MAX_WIDTHS = { '2xs': 128, xs: 192, sm: 320, md: 480, lg: 640, xl: 800 };
const FIGURE_RATIO_VALUES = { '16:9': 16 / 9, '4:3': 4 / 3, '1:1': 1, '3:4': 3 / 4, '9:16': 9 / 16 };
const TEXT_FIELD_VISUAL_STATES = ['hover', 'focus'];
const MENU_ITEM_VISUAL_STATES = ['hover', 'focus', 'pressed'];
const GROUP_SLOT_CONFIG = {
  RadioGroup: { slotName: 'Radio Items', min: 2, max: 20 },
  CheckboxGroup: { slotName: 'Checkbox Items', min: 1, max: 20 },
  TopHeader: { slotName: 'Nav Items', min: 0, max: 8 },
  TopHeaderActions: { slotName: 'Actions', min: 0, max: 6 },
  ChipGroup: { slotName: 'Chip slot', min: 1, max: 12 },
  Breadcrumb: { slotName: 'Items Slot', min: 1, max: 8 },
};
const STACK_DIRECTIONS = ['column', 'column-reverse', 'row', 'row-reverse'];
const STACK_CONTEXT_DIRECTIONS = ['column', 'row'];
const STACK_ALIGNS = ['stretch', 'start', 'center', 'end', 'baseline'];
const STACK_CONTEXT_ALIGNS = ['stretch', 'start', 'center', 'end'];
const STACK_JUSTIFIES = ['start', 'center', 'end', 'between', 'around', 'evenly'];
const STACK_CONTEXT_JUSTIFIES = ['start', 'center', 'end', 'between'];
const STACK_CONTEXT_GAPS = ['none', 'xs', 'sm', 'md', 'lg', 'xl'];
const STACK_CONTEXT_WIDTH_MODES = ['hug', 'fill'];
const STACK_GAPS = [0, 1, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 64, 96, 128];
const STACK_SEMANTIC_GAPS = { xs: 8, sm: 12, md: 16, lg: 24, xl: 40 };
const STACK_GAP_VARIABLE_NAMES = {
  0: 'gap/none',
  1: 'gap/1',
  2: 'gap/2',
  4: 'gap/4',
  6: 'gap/6',
  8: 'gap/xs',
  12: 'gap/sm',
  16: 'gap/md',
  20: 'gap/20',
  24: 'gap/lg',
  32: 'gap/32',
  40: 'gap/xl',
  64: 'gap/64',
  96: 'gap/96',
  128: 'gap/128',
};
const SECTION_GAP_PIXELS = { xs: 8, sm: 12, md: 16, lg: 24, xl: 40 };
const STACK_ALIGN_FROM_FIGMA = { MIN: 'start', CENTER: 'center', MAX: 'end', BASELINE: 'baseline' };
const STACK_ALIGN_TO_FIGMA = { start: 'MIN', center: 'CENTER', end: 'MAX', baseline: 'BASELINE' };
const STACK_JUSTIFY_FROM_FIGMA = { MIN: 'start', CENTER: 'center', MAX: 'end', SPACE_BETWEEN: 'between' };
const STACK_JUSTIFY_TO_FIGMA = { start: 'MIN', center: 'CENTER', end: 'MAX', between: 'SPACE_BETWEEN' };
const LOCAL_FIGMA_IMAGE_MAX_BYTES = 4_000_000;
const DETACHED_COMPONENT_NAMESPACE = 'a1_json';
const DETACHED_COMPONENT_KEY = 'componentName';
const DETACHED_BANNER_PROPS_KEY = 'bannerProps';
const GRID_RESPONSIVE_COLUMNS_KEY = 'gridResponsiveColumns';
const A1_BREAKPOINT_KEY = 'a1Breakpoint';
const A1_BREAKPOINT_VISIBILITY_KEY = 'a1BreakpointVisibility';
const ACTION_TRIGGER_TARGET_KEY = 'actionTriggerTarget';
const DIALOG_TRIGGER_TARGET_KEY = 'dialogTriggerTargetNodeId';
const LEGACY_BUTTON_DIALOG_TARGET_KEY = 'buttonDialogTargetNodeId';
const A1_ICON_NAME_KEY = 'iconName';
const A1_ICON_COLOR_KEY = 'iconColor';
const ACTION_TRIGGER_COMPONENT_NAMES = new Set(['Button', 'Icon Button']);
const ACTION_TRIGGER_TARGET_TYPES = new Set(['Dialog', 'Menu']);
const ACTION_TRIGGER_TARGET_CONFIG = {
  Dialog: { actionType: 'openDialog', addTarget: 'dialog', defaultLabel: 'Dialog' },
  Menu: { actionType: 'openMenu', addTarget: 'menu', defaultLabel: 'Menu' },
};
const ACTION_TRIGGER_TYPE_BY_ACTION = Object.fromEntries(
  Object.entries(ACTION_TRIGGER_TARGET_CONFIG).map(([targetType, config]) => [config.actionType, targetType])
);
const ACTION_TRIGGER_NAME_PATTERN = /\s*\{\s*trigger\s*[=:]\s*([^}]+?)\s*\}\s*$/i;
let activeActionTargetImportContext = null;
const A1_LIBRARY_MANIFEST_STORAGE_KEY = 'a1_figma_library_manifest_v1';
const A1_COMPONENT_KEY_REGISTRY_STORAGE_KEY = A1_LIBRARY_MANIFEST_STORAGE_KEY;
const INLINE_ELEMENTS = ['all', 'strong', 'b', 'em', 'i', 'u', 's', 'del', 'ins', 'mark', 'small', 'sub', 'sup', 'abbr', 'cite', 'q', 'time', 'code', 'kbd', 'samp', 'var', 'muted', 'accent'];
let localFigureAssets = new Map();
let activeRenderBreakpoint = '';
let clientComponentKeyRegistryPromise = null;
const gapVariableWarnings = new Set();

// One descriptor registry owns the public JSON type, Figma names/aliases, and
// behavior handlers. The legacy lookup maps below are generated from this list
// while adapter functions continue to live in this controller.
const COMPONENT_ADAPTERS = [
  { jsonType: 'Icon', import: importIcon, figma: [{ name: 'Icon', export: exportIcon, apply: applyIcon }], capabilities: { update: true, children: 'none' } },
  { jsonType: 'Button', import: importButton, figma: [{ name: 'Button', export: exportButton, apply: applyButton }], capabilities: { update: true, children: 'none' } },
  { jsonType: 'IconButton', import: importIconButton, figma: [{ name: 'Icon Button', aliases: ['IconButton'], export: exportIconButton, apply: applyIconButton }], capabilities: { update: true, children: 'none' } },
  { jsonType: 'ButtonContainer', import: importButtonContainer, figma: [{ name: 'Button Container', aliases: ['ButtonContainer', 'Button Group', 'ButtonGroup'], export: exportButtonContainer, apply: applyButtonContainer }], capabilities: { update: true, children: 'slot' } },
  { jsonType: 'Link', import: importLink, figma: [{ name: 'Link', export: exportLink, apply: applyLink }], capabilities: { update: true, children: 'none' } },
  { jsonType: 'Breadcrumb', import: importBreadcrumb, figma: [{ name: 'Breadcrumb', aliases: ['Bread Crumb'], export: exportBreadcrumb, apply: applyBreadcrumb }], capabilities: { update: true, children: 'none' } },
  { jsonType: 'Card', import: importCard, figma: [{ name: 'Card', export: exportCard, apply: applyCard }], capabilities: { update: true, children: 'slot' } },
  { jsonType: 'Banner', import: importBanner, figma: [{ name: 'Banner', export: exportBanner, apply: applyBanner }], capabilities: { update: true, children: 'slot' } },
  { jsonType: 'MessageBadge', import: importBadge, figma: [{ name: 'Badge', aliases: ['Message Badge', 'MessageBadge'], export: exportBadge, apply: applyBadge }], capabilities: { update: true, children: 'none' } },
  { jsonType: 'Figure', import: importFigure, figma: [{ name: 'Figure', export: exportFigure, apply: applyFigure }], capabilities: { update: true, children: 'none' } },
  { jsonType: 'DefinitionList', import: importDefinitionList, figma: [
    { name: 'Definition List', aliases: ['DefinitionList'], export: exportDefinitionList, apply: applyDefinitionList },
    { name: 'Definition List Item', aliases: ['DefinitionListItem'], export: exportDefinitionListItem },
  ], capabilities: { update: true, children: 'custom' } },
  { jsonType: 'Blockquote', import: importBlockquote, figma: [{ name: 'Blockquote', aliases: ['BlockQuote', 'Block Quote'], export: exportBlockquote, apply: applyBlockquote }], capabilities: { update: true, children: 'none' } },
  { jsonType: 'Code', import: importCode, figma: [{ name: 'Code', export: exportCode, apply: applyCode }], capabilities: { update: true, children: 'none' } },
  { jsonType: 'Inline', import: importInline, figma: [{ name: 'Inline', aliases: ['Inline Text', 'InlineText'], export: exportInline, apply: applyInline }], capabilities: { update: true, children: 'none' } },
  { jsonType: 'Section', import: importSection, figma: [{ name: 'Section', export: exportSection, apply: applySection }], capabilities: { update: true, children: 'slot' } },
  { jsonType: 'TextField', import: importTextField, figma: [{ name: 'Text Field', aliases: ['TextField'], export: exportTextField, apply: applyTextField }], capabilities: { update: true, children: 'none' } },
  { jsonType: 'SearchField', import: importSearchField, figma: [{ name: 'Search Field', aliases: ['SearchField'], export: exportSearchField, apply: applySearchField }], capabilities: { update: true, children: 'none' } },
  { jsonType: 'TextareaField', import: importTextarea, figma: [{ name: 'Textarea', aliases: ['Text Area', 'TextareaField', 'Textarea Field'], export: exportTextarea, apply: applyTextarea }], capabilities: { update: true, children: 'none' } },
  { jsonType: 'SelectField', import: importSelect, figma: [{ name: 'Select', aliases: ['SelectField', 'Select Field'], export: exportSelect, apply: applySelect }], capabilities: { update: true, children: 'none' } },
  { jsonType: 'Switch', import: importSwitch, figma: [{ name: 'Switch', export: exportSwitch, apply: applySwitch }], capabilities: { update: true, children: 'none' } },
  { jsonType: 'SegmentedControl', import: importSegmentedControl, figma: [{ name: 'Segmented Control', aliases: ['SegmentedControl'], export: exportSegmentedControl, apply: applySegmentedControl }], capabilities: { update: true, children: 'custom' } },
  { jsonType: 'Tabs', import: importTabs, figma: [{ name: 'Tabs', export: exportTabs, apply: applyTabs }], capabilities: { update: true, children: 'custom' } },
  { jsonType: 'Accordion', import: importAccordion, figma: [{ name: 'Accordion', export: exportAccordion, apply: applyAccordion }], capabilities: { update: true, children: 'slot' } },
  { jsonType: 'Tooltip', import: importTooltip, figma: [{ name: 'Tooltip', export: exportTooltip, apply: applyTooltip }], capabilities: { update: true, children: 'none' } },
  { jsonType: 'Pagination', import: importPagination, figma: [{ name: 'Pagination', export: exportPagination, apply: applyPagination }], capabilities: { update: true, children: 'none' } },
  { jsonType: 'MessageEmptyState', import: importEmptyState, figma: [{ name: 'Empty State', aliases: ['EmptyState', 'Message Empty State', 'MessageEmptyState'], export: exportEmptyState, apply: applyEmptyState }], capabilities: { update: true, children: 'none' } },
  { jsonType: 'Divider', import: importDivider, figma: [{ name: 'Divider', export: exportDivider, apply: applyDivider }], capabilities: { update: true, children: 'none' } },
  { jsonType: 'Menu', import: importMenu, figma: [{ name: 'Menu', export: exportMenu, apply: applyMenu }], capabilities: { update: true, children: 'custom' } },
  { jsonType: 'Dialog', import: importDialog, figma: [{ name: 'Dialog', export: exportDialog, apply: applyDialog }], capabilities: { update: true, children: 'slot' } },
  { jsonType: 'RadioGroup', import: importRadioGroup, figma: [{ name: 'Radio Group', aliases: ['RadioGroup'], export: exportRadioGroup, apply: applyRadioGroup }], capabilities: { update: true, children: 'custom' } },
  { jsonType: 'CheckboxGroup', import: importCheckboxGroup, figma: [{ name: 'Checkbox Group', aliases: ['CheckboxGroup'], export: exportCheckboxGroup, apply: applyCheckboxGroup }], capabilities: { update: true, children: 'custom' } },
  { jsonType: 'PageNav', import: importPageNav, figma: [{ name: 'Page Nav', aliases: ['PageNav'], export: exportPageNav, apply: applyPageNav }], capabilities: { update: true, children: 'custom' } },
  { jsonType: 'TreeMenu', import: importTreeMenu, figma: [{ name: 'Tree Menu', aliases: ['TreeMenu'], export: exportTreeMenu, apply: applyTreeMenu }], capabilities: { update: true, children: 'custom' } },
  { jsonType: 'TopHeader', import: importTopHeader, figma: [{ name: 'Top Header', aliases: ['TopHeader'], export: exportTopHeader, apply: applyTopHeader }], capabilities: { update: true, children: 'slot' } },
  { jsonType: 'PageLayout', import: importPageLayout, figma: [{ name: 'Page Layout', aliases: ['PageLayout'], export: exportPageLayout, apply: applyPageLayout }], capabilities: { update: true, children: 'slot' } },
  { jsonType: 'BottomSheet', import: importBottomSheet, figma: [{ name: 'Bottom Sheet', aliases: ['BottomSheet', 'Bottom Sheet Component'], export: exportBottomSheet, apply: applyBottomSheet }], capabilities: { update: true, children: 'slot' } },
  { jsonType: 'ChipGroup', import: importChipGroup, figma: [
    { name: 'Chip', export: exportChip, apply: applyChip },
    { name: 'Chip Group', aliases: ['ChipGroup'], export: exportChipGroup, apply: applyChipGroup },
  ], capabilities: { update: true, children: 'custom' } },
  { jsonType: 'DataTable', import: importDataTable, figma: [{ name: 'Data Table', aliases: ['DataTable'], export: exportDataTable, apply: applyDataTable }], capabilities: { update: true, children: 'custom' } },
  { jsonType: 'ChoiceGroup', import: importChoiceGroup, figma: [{ name: 'Choice Group', aliases: ['ChoiceGroup'], export: exportChoiceGroup, apply: applyChoiceGroup }], capabilities: { update: true, children: 'custom' } },
  { jsonType: 'Stack', import: importStack, figma: [], capabilities: { update: true, children: 'custom' } },
  { jsonType: 'Grid', import: importGrid, figma: [], capabilities: { update: true, children: 'custom' } },
  { jsonType: 'GridItem', import: importGridItem, figma: [], capabilities: { update: false, children: 'custom' } },
  { jsonType: 'Heading', import: importTextNode, figma: [], capabilities: { update: true, children: 'none' } },
  { jsonType: 'Paragraph', import: importTextNode, figma: [], capabilities: { update: true, children: 'none' } },
];

const FIGMA_LIBRARY_COMPONENT_ALIASES = {
  'Segmented Control Item': ['SegmentedControl Item', 'SegmentedControlItem'],
  Tab: ['Tabs Item'],
  'Tab Item': [],
  'Menu Item': ['MenuItem'],
  'Radio Option': ['RadioOption'],
  'Checkbox Option': ['CheckboxOption'],
  'Page Nav Item': ['PageNav Item', 'PageNavItem'],
  'Tree Menu Item': ['TreeMenu Item', 'TreeMenuItem', 'Tree Item', 'TreeItem'],
  'Top Header Nav Item': ['TopHeader Nav Item', 'TopHeaderNavItem'],
  'Data Table Header Cell': ['DataTable Header Cell', 'DataTableHeaderCell'],
  'Data Table Cell': ['DataTable Cell', 'DataTableCell'],
  'Data Table Column': ['DataTable Column', 'DataTableColumn'],
  'Choice Option': ['ChoiceOption'],
};

function componentRegistryFigmaEntries(adapters) {
  return adapters.flatMap((adapter) => (adapter.figma || []).map((entry) => ({ ...entry, adapter })));
}

function componentRegistryMap(adapters, field, keyField = 'name') {
  return componentRegistryFigmaEntries(adapters).reduce((map, entry) => {
    if (entry[field]) map[entry[keyField]] = entry[field];
    return map;
  }, {});
}

function componentRegistryImporters(adapters) {
  return adapters.reduce((map, adapter) => {
    if (adapter.import) map[adapter.jsonType] = adapter.import;
    return map;
  }, {});
}

function componentRegistryJsonTypes(adapters) {
  return componentRegistryFigmaEntries(adapters).reduce((map, entry) => {
    map[entry.name] = entry.adapter.jsonType;
    return map;
  }, {});
}

function componentRegistryAliases(adapters, helperAliases) {
  const map = {};
  for (const entry of componentRegistryFigmaEntries(adapters)) {
    map[entry.name] = [entry.name, ...(entry.aliases || [])];
  }
  for (const [name, aliases] of Object.entries(helperAliases)) {
    map[name] = [name, ...aliases];
  }
  return map;
}

const JSON_TYPE_BY_COMPONENT_NAME = componentRegistryJsonTypes(COMPONENT_ADAPTERS);
const FIGMA_COMPONENT_NAME_ALIASES = componentRegistryAliases(COMPONENT_ADAPTERS, FIGMA_LIBRARY_COMPONENT_ALIASES);
const SUPPORTED_COMPONENT_MESSAGE = `${componentRegistryFigmaEntries(COMPONENT_ADAPTERS)
  .filter((entry) => entry.export)
  .map((entry) => entry.name)
  .join(', ')}, Stack and Grid auto-layout frames, and standalone styled text`;

// Figma plugin runtimes can import published library assets by key, but they
// cannot reliably search enabled libraries by display name. Keep this manifest
// synced with packages/figma/plugins/a1-json/a1-library-manifest.json after the
// A1 Design System library is published so consumer files can import real A1
// components, text styles, and variables without creating local assets.
// The build injects packages/figma/plugins/a1-json/a1-library-manifest.json here
// so published library keys have one checked-in maintenance point.
const A1_FIGMA_LIBRARY_MANIFEST = {
  "schemaVersion": "1.0",
  "library": {
    "name": "A1 Design System",
    "fileKey": "zFjqo3SwHbkXwtCOoQCVMA",
    "updatedAt": "2026-07-18T00:00:00.000Z"
  },
  "imageLibrary": {
    "publicBaseUrl": "https://pszmkbfvyjkifbyututo.supabase.co/storage/v1/object/public/images/shared"
  },
  "componentSets": {
    "Page Layout": "d82ef3aba30e8b4d1d58e3a5ae5707560f541da3",
    "Top Header": "b29c94908da66c1e1470579729f621f4ac387ba2",
    "Top Header Nav Item": "42492a243fd3a676f5280e5b1e5c93a8f8acd473",
    "Section": "68dc12cd4b1ac196b3760d6a2ae4b08de7e6f3e3",
    "Stack": "",
    "Grid": "",
    "Divider": "1ee9483d2205bc0afa3f57c233eaedf63198c931",
    "Heading": "",
    "Paragraph": "",
    "Link": "a09495424aa0f98e80b1269a132278e125c403b5",
    "Breadcrumb": "339e622057b44581fc31a2a241ae4e4f798fe4c7",
    "Card": "7e852bd775ddad05b029273190deb4a53495d3c7",
    "Figure": "aff5652e13cb6683be4bd739418ef44cec3a7697",
    "Blockquote": "5974e12793486e3a14e7c7a2230a3cd0873fe220",
    "Code": "cb0598e67920bb5f48a232eb7e86be7f46cc2824",
    "Inline": "c3e535a37f3e9f3064c809ff6890139628a518ee",
    "Definition List": "f76746e1de219d521b602fc3f317dd03f114bb21",
    "Definition List Item": "ce961eccb8ad3774f4b5d2e152672bdf1a3b67c6",
    "Empty State": "6c1709cca520d7f8a2f3f9fecf5b3f851c78a835",
    "Badge": "75610ade739d2212122a3c527cc310f7fa5f03e7",
    "Banner": "9fb3f80af9b1ced16081e13f1bfc281f0d638430",
    "Text Field": "1cd82ac5885adeb99522d00339b419400eb8af78",
    "Search Field": "b31a09b374032f1136996829cf0401e3e2e1488b",
    "Textarea": "e5332238529186823e407d571c5b187005eee330",
    "Select": "69866387be40269a2e0c4562d5aa6ce2f99226fe",
    "Switch": "d36da4007002b002f37ad6ff696abea5003f8569",
    "Radio Group": "0de620856257bb4988362cbd1ea58f25d7d8e6d0",
    "Radio Option": "75223d565ebde535b58dca7c4056c535319be8c8",
    "Checkbox Group": "9ae5010b086c5b208591a578daeeec298b2365ec",
    "Checkbox Option": "5492be70b0bb91dad3621d7bd2e5590f239887f7",
    "Button": "da0f0db105c1ef1dbe698853a3832fe46e360e1f",
    "Icon Button": "57ac131e905e1128c07357880aef71b5ee4523f5",
    "Button Container": "de7e9b9a007d0e846c3e99d8d324d764cbe81868",
    "Segmented Control": "39d48c57f2b1b51339966db6b5298ba60612f227",
    "Segmented Control Item": "5fa75519b6e7cdaed489bc3d96ad827c7350c76f",
    "Tab": "226e1f976d34b7c07d1ab9d70847fcb61b47fc75",
    "Tab Item": "226e1f976d34b7c07d1ab9d70847fcb61b47fc75",
    "Page Nav Item": "114eb38f3b237c2bcebb63eca790051e1fbf81d1",
    "Tree Menu Item": "9cf319073738842be1669f336043ccd31f67ca68",
    "Pagination": "58ae0a1f6a3f31c19ee3d86bf5874fed431a8127",
    "Menu Item": "084d9c2f1bea89b00e7d027f2a7ca0a7c9e51fd9",
    "Tooltip": "bf8663c9aa7880b7083cf7604964c62622b33e69",
    "Accordion": "19499d1ef073b61a2f8b2e9967f647437ff6c41c",
    "Dialog": "8fa31267ebf46c2186f59b353745ba08e63c9fcd",
    "Chip": "80ef0f702d4be8336673e1dca8b203ded72d0edf",
    "Data Table Header Cell": "0306b31325e9efd0285ce4f3bb2cc83cd43ef93b",
    "Data Table Cell": "13afac0ac9aa20a04ca40da56b1f6e4d3a1a2455",
    "Data Table Column": "aef377be069ba905155831aaa99c64d04d700b77",
    "Choice Group": "90aed2b3167595ef51410e77d379d357af4b71d0",
    "Choice Option": "14ef0c68c313915551f530b138b8b7ea52de72c2",
    "Toolbar Tool": "459e1f506fe30cf07c7347ae090ea5ee283ba5f4",
    "Toolbar": "64fff55f29fbfa7a7707acfeab505d1df06bebce"
  },
  "components": {
    "Tabs": "5d546b02b22c470e9dfbe56681b6702f69a5f902",
    "Menu": "cc29ada43150ce4a2cf3a6830fbfea00b155e537",
    "Page Nav": "6717777701583a261a08ae2a5dda2002306ceed9",
    "Tree Menu": "85b776f9b30d2949efb84865445517993a3777ff",
    "A1 Audit Report Card": "2f8a918e426ceb3a1cd3587ce289c9ae636f3f3d",
    "Bottom Sheet": "",
    "Chip Group": "9dc343087a890bad29c827b48d451f2c83dead56",
    "Data Table": "7692c3348a16239621f71e7b58ae1fce7c794937",
    "Choice Group": "01023c8436a7328bde010c6e624a32a67ae37cfc",
    "Toolbar Divider": "60397e3ba5cc01b9d29d84095ceaefddb40a2c50"
  },
  "textStyles": {
    "Body/LG": "9f266ee604b73b55a38874edc7d625a577c9055b",
    "Body/MD": "eaff0648ee751d2317d6e98dad0a923600b61330",
    "Body/SM": "22a35ef10624899ae3799d84ec4d9f2c9f2bf0d1",
    "Breadcrumb/current": "d4965a8e0263e1c58493618bd868dcbb339116f8",
    "Button/lg": "0546dbf0291ae4f538897986bbfcf06b48f2e4a6",
    "Button/md": "54aa7319053e9a4d202df084a419bbdd713920f9",
    "Button/sm": "70b097c4740986ffea6d3fcd999f1e8da1c5442f",
    "Code/sm": "77df0cd55fa3cb8ccd6425a702a3e6ae8b34170b",
    "Data Table/Header": "db0b4f1dff9c5f8514fe42f9ff47149114489ae5",
    "Field/Label/LG": "d862402c7bcb64476bfcd8c6df2062dc7f97dc85",
    "Field/Label/MD": "f23c4eea472fdf87a020f05e24c8df9655d87367",
    "Field/Label/SM": "a8a66a560c8c76a39cccf9c315e191d5afbb9f1b",
    "Heading/MD": "4bb109513898fb957c3421b8518e77523510d04b",
    "Link/lg/bold": "dbbacce65241cd9d0999828f1da479dec64e1a21",
    "Link/lg/medium": "d82cc09fd07ef2d8bd510aa5c13cbaee2abd1fc8",
    "Link/lg/normal": "2cbd5a6943489d5c53dfdc4fd8cf5228cb425459",
    "Link/lg/semibold": "d1d21d92f06bec1e4cb5d5845f25917d22f58c8e",
    "Link/md/bold": "81738e242b2962648b3b5a944beed0f3a1328d36",
    "Link/md/medium": "2eb46c66b70625072718cd1e4b6f93eb23c15c7a",
    "Link/md/normal": "fcf2edf419640a25aaa3a1ee2a1dedabf15e0978",
    "Link/md/semibold": "f68c75c5420168d3abcd42eeb37cf65eade45266",
    "Link/sm/bold": "4bbaf80a1011b6f6e78b34222f6a00e384c67205",
    "Link/sm/medium": "c434bf775bda5adb44604e2de71a6e456265885a",
    "Link/sm/normal": "83d28cb3d2365bda739f329bc5f0865dbf17e083",
    "Link/sm/semibold": "c6cc901d9b82385fce2dadad5213b02388d73192",
    "Link/xl/bold": "652b808944f45409099c1a727591cd34769a332d",
    "Link/xl/medium": "a8c7c1f0da83774e3f4e1681a38568f3c0117b74",
    "Link/xl/normal": "acddcc23ece8debe9dbe38d4ceab946be076e2fc",
    "Link/xl/semibold": "2e7ab77f7ff258575ce4f27651c2c42dd40e0faf",
    "Link/xs/bold": "bbeab1475d9de523bc9b430fe44b476a3bb51dbb",
    "Link/xs/medium": "db82d3299fc6737932186903e252b6de6edb006a",
    "Link/xs/normal": "6b2e72b24d33c456edcd87e155bfd50497469a45",
    "Link/xs/semibold": "71961bf343161091e73d0a9b37210c9bc917ce40",
    "Menu/Section label": "ec7de2a34db9144b2a207b250e8c5f7861a0081d",
    "Nav/Stacked label": "ae86763616fb6acfc49f8a85dd72c48d69a64375",
    "Page Nav/Heading": "8e44127bd0bab0f77eafb2a23f3fc5613257b587",
    "Side Nav/Active label": "f67ba56ee8a7b4943265449e8bcce816bc08fe4f",
    "Tab/Label": "3123a295d5712a23364e54b3b763403ee4d3ef74",
    "Tab/Step number": "c060acb63f218ce854ef0e270030455618375c0a",
    "Top Header/Nav label": "5570777b3e535b46f2d936e522f08ab233fc87eb",
    "body/lg": "b7296d29c9a7af16269c9ee11e48b9f14277f42e",
    "body/md": "847de208310f51881fb2e22c44dbe2d0b21ccfa2",
    "body/sm": "496e9eb43f479d32e62e74c0902e49be9f711841",
    "body/xl": "ff20ec67b70091bf3bd7cbb84a72961bcc907b9c",
    "body/xs": "7c72a7fdc3a3f3f6806e528d2bbfd34ad642cc73",
    "display/jumbo": "0d590b8204c32a1b3089cd2f9aa8a221f2caafa0",
    "display/lg": "daffb3240d5ccd726171d31884b154d6f783eedd",
    "display/md": "8244c9eb661eae7bb09beda5d91e23a21ded43dc",
    "display/sm": "af6d910406fa13d132dc6af5e4c1bab62afa71a4",
    "display/xJumbo": "7bd1721c9fa6a4bd010fcf4575d255a8a64fe109",
    "display/xl": "0b46077fa81b5802422fddba1038daaf116fc445",
    "display/xxl": "79a0d7f1e71e83b1a59af12f572ae29a0176a999",
    "heading/lg": "8ba6eb9702d59588ed43ac9d7eb02d97c01ce724",
    "heading/md": "c89a84184412fbc98606ea7fdfbf55eaa0354976",
    "heading/sm": "992e824ed56da23e698a994f7c0c1a56f3d19878",
    "heading/xl": "971b1c66a45ead25eabf148687e54864b58b3be6",
    "heading/xs": "bb9c83ef68f2ffd22c8de3fb6976302a61ac743a",
    "Chip/sm": "43c2ffcd79447672a2e98d933e5e3c5cfc9e0dc0",
    "Chip/md": "5e726918966cecc92f43b9cf89a066744204ca5e",
    "Chip/lg": "12058f52531347fcff9524c8ebdf9f1f81a01c41",
    "Chip/Group label": "a64eb90649ceae389b918f354eb2fe9ef957be7a",
    "Choice/Label compact": "c0b444acc47b847cba2a005c1b62829385ece30a",
    "Choice/Label default": "9520fb4bcded3ad4a6245847b6ee3958f63bb66f",
    "Choice/Label comfortable": "898ccbf12d47e8d6e3a059cbf158cf23d22b120f",
    "Choice/Subtext compact": "2284bbadb088c89bc07619aa6d3fa6587433c490",
    "Toolbar/Label": "bc355f264958d27a99aa20d9877ae52e32690822"
  },
  "variables": {
    "color": {
      "color/action/background": "3f277dbe67e85b823751c90d7fa0c3ec4ef611a8",
      "color/action/foreground": "89d17f8c5f900cf7e75e948538d5db0216704f48",
      "color/action/surface": "50f7801da64a11585786be30393712bcb0d6266d",
      "color/link/default": "67b3fd5210a7d9c7d55db43a719f701c1a29e16f",
      "color/link/hover": "78682b349b3866b8dd16bb8fbb98e764e37ede46",
      "color/link/pressed": "c584501c8761fca3f271ac32e6f041ca8cf70307",
      "color/status/error/background": "438768f40d8a12c23bd3031f195b7dd21e60d12b",
      "color/status/error/foreground": "2b4cee86ef0a089f1ddf02825a583f95716af581",
      "color/status/error/surface": "3a4f95fb3237df1d9ae7473ad9271eaf7ac768ac",
      "color/status/info/background": "1e8e5b38f973b51860e47126387342b9556d9ce0",
      "color/status/info/foreground": "305962f80f8008a60c2ab328e5cdc06044c59db0",
      "color/status/info/surface": "b46c1f3bb93f409f666df337ada9570be033edce",
      "color/status/success/background": "6ebd0b497521eff5eb77d3c1726a15912003213b",
      "color/status/success/foreground": "b836341d2208f0480f0dcdf0fb94f7f34c06e58a",
      "color/status/success/surface": "23d328ab8fa62aabcfc807bf6bd552d29f31fec7",
      "color/status/warn/background": "e003ec1f6c101c4a53f9530aec2c632ddefe5e02",
      "color/status/warn/foreground": "80ad44038096ea17e1fd3001d0d03f4a4a433186",
      "color/status/warn/surface": "ae9858f4f633076793d2be14448dcbd086752634",
      "color/surface/inverse": "3f1975f024da4fd9b3ce48eb2a0997d617812065",
      "color/surface/raised": "aecd7a7a1468a32a21c00636db65c9c2559ed5a4",
      "color/text/accent": "9f8756c1a8aba0a090043e9c8055c755f359dcc3",
      "color/text/default": "caedd67fb36f8d52f47f9418468bd4e1e09905ca",
      "color/text/inverse": "68f1f69eb46ff2e4b46d39c8d73d0c59fa9478ae",
      "color/text/muted": "5c2fe7ec6ed7e0839e66052090870593adfdcb4c",
      "link/color": "e84b98b292b913379f6791354da2cc20aff43500",
      "color/surface/card": "5e2b1cb3c258958a8c8cdbd96845f03a8c9f68ee",
      "color/toolbar/selectedBackground": "430125c8611b30e9a54a0bdb42656e6f1fffbd75"
    },
    "float": {
      "gap/2": "3c0e7bcf606c9c8b58666c56a695e10875567492",
      "gap/32": "db75dd6d219d403a893fad87a79535e4d07d3108",
      "gap/4": "5c0cafd054616f28b0e1bd273dab171d7ff65e89",
      "gap/lg": "026fe530183b7e8b339f8124a80f5f9cffac0652",
      "gap/md": "a49ca80206b1fbd92a69d9f3f9e13beec16a44a4",
      "gap/none": "ca54a6f1de50bf862dd5d0d4cfdd675af9c7d5bc",
      "gap/sm": "29040c6ec3756256e4e581ab5b6ec468aa2eda27",
      "gap/xl": "eb6007078b1ede6229d22df313c125ce297f66a1",
      "gap/xs": "f4f06ed50620e3ac4dc0c18e0aed5880f3ad2b2c",
      "spacing/1": "56157c3a9493c8cddf0515fe26afd906faa84bad",
      "spacing/12": "85641d32fb01545a584ec1998a13f35c005a0949",
      "spacing/128": "a4ae61541798a66111b7cb96b700095386553fc3",
      "spacing/16": "df5aae6a41feeefae9531ff3c3714cd548f6d398",
      "spacing/2": "6d3fba326cbd90c0feb5f43b7281706229e6b44d",
      "spacing/20": "0901786c040daed6f954c94808ffc372004cbe8a",
      "spacing/24": "df00806ce0bc1fb98828382240878d06cb95d89e",
      "spacing/32": "cbb995b22a0f39f4c2605029d7d72e0a9c6b3f93",
      "spacing/4": "a7301a220a40ed552a5d85bd4f2778b175941b9c",
      "spacing/40": "f5ad410d19cec163e0506cfa641b61416b7717f2",
      "spacing/6": "b383a0d99d1c0004c62d49933222bac77e391bac",
      "spacing/64": "52f659fc3382d10105f5a051edfac3ea2743e437",
      "spacing/8": "9f65e2232c3b2956ff2be0832862b099b4d975f6",
      "spacing/96": "93f0aec4c9ab22bc8303593f4ec8f025627eab8d"
    }
  }
};
const A1_FIGMA_COMPONENT_SET_KEYS = A1_FIGMA_LIBRARY_MANIFEST.componentSets;
const A1_FIGMA_COMPONENT_KEYS = A1_FIGMA_LIBRARY_MANIFEST.components;
const A1_FIGMA_TEXT_STYLE_KEYS = A1_FIGMA_LIBRARY_MANIFEST.textStyles;
const A1_FIGMA_COLOR_VARIABLE_KEYS = A1_FIGMA_LIBRARY_MANIFEST.variables.color;
const A1_FIGMA_FLOAT_VARIABLE_KEYS = A1_FIGMA_LIBRARY_MANIFEST.variables.float;
const A1_FIGMA_IMAGE_LIBRARY_PUBLIC_BASE_URL = A1_FIGMA_LIBRARY_MANIFEST.imageLibrary?.publicBaseUrl || '';
const A1_COMPONENT_SET_ONLY_NAMES = new Set(Object.keys(A1_FIGMA_COMPONENT_SET_KEYS));
const A1_FIGMA_COMPONENT_SET_KEY_VALUES = new Set(Object.values(A1_FIGMA_COMPONENT_SET_KEYS).filter((value) => typeof value === 'string' && value.trim()));
const A1_FIGMA_COMPONENT_KEY_VALUES = new Set(Object.values(A1_FIGMA_COMPONENT_KEYS).filter((value) => typeof value === 'string' && value.trim()));

// ─── Shared helpers ──────────────────────────────────────────────────────────

// Component property keys carry a "#nodeId" suffix for TEXT / BOOLEAN /
// INSTANCE_SWAP properties ("Label#12:3"); variant properties are plain.
function componentNameCandidates(name) {
  return componentNameCandidatesForAliases(name, FIGMA_COMPONENT_NAME_ALIASES);
}

function figmaComponentNameMatches(actualName, requestedName) {
  return figmaComponentNameMatchesForAliases(actualName, requestedName, FIGMA_COMPONENT_NAME_ALIASES);
}

const libraryComponentSourceCache = new Map();

function libraryDescriptionTextValues(description) {
  const values = [];
  const add = (value) => {
    if (typeof value === 'string' && value.trim()) values.push(value.trim());
  };
  if (!description || typeof description !== 'object') return values;
  for (const key of [
    'name',
    'componentName',
    'componentSetName',
    'componentSet',
    'setName',
    'parentName',
    'libraryName',
    'sourceName',
    'description',
  ]) {
    const value = description[key];
    if (typeof value === 'string') add(value);
    else if (value && typeof value === 'object') add(value.name);
  }
  return values;
}

function libraryComponentNameScore(description, requestedName) {
  const requestedNames = componentNameCandidates(requestedName);
  const candidateNames = libraryDescriptionTextValues(description);
  let score = 0;
  for (const requested of requestedNames) {
    if (!requested) continue;
    const requestedKey = canonicalKey(requested);
    const requestedCompact = compactKey(requested);
    for (const rawName of candidateNames) {
      const candidate = String(rawName || '').trim();
      if (!candidate) continue;
      const candidateKey = canonicalKey(candidate);
      const candidateCompact = compactKey(candidate);
      if (candidate === requested || candidateKey === requestedKey || candidateCompact === requestedCompact) score = Math.max(score, 100);
      const parts = candidate.split(/[\\/›>]+/).map((part) => part.trim()).filter(Boolean);
      const partKeys = parts.map(canonicalKey);
      const partCompacts = parts.map(compactKey);
      if (partKeys[0] === requestedKey || partCompacts[0] === requestedCompact) score = Math.max(score, 95);
      if (partKeys[partKeys.length - 1] === requestedKey || partCompacts[partCompacts.length - 1] === requestedCompact) score = Math.max(score, 90);
      if (partKeys.includes(requestedKey) || partCompacts.includes(requestedCompact)) score = Math.max(score, 85);
      if (candidateKey.startsWith(`${requestedKey}/`) || candidateKey.startsWith(`${requestedKey},`) || candidateKey.startsWith(`${requestedKey}:`) || candidateCompact.startsWith(requestedCompact)) {
        score = Math.max(score, 80);
      }
    }
  }
  const libraryName = String(description && (description.libraryName || (description.library && description.library.name)) || '');
  if (score > 0 && /a1|A1 Design System/i.test(libraryName)) score += 5;
  return score;
}

function libraryDescriptionLooksLikeA1(description) {
  if (!description || typeof description !== 'object') return false;
  const key = typeof description.key === 'string' ? description.key.trim() : '';
  if (key && (A1_FIGMA_COMPONENT_SET_KEY_VALUES.has(key) || A1_FIGMA_COMPONENT_KEY_VALUES.has(key))) return true;
  const libraryName = String(description.libraryName || (description.library && description.library.name) || '').trim();
  return /\bA1\b|A1 Design System/i.test(libraryName);
}

function bestLibraryDescription(items, name) {
  return (items || [])
    .map((item) => ({ item, score: libraryComponentNameScore(item, name) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)[0]?.item || null;
}

function bestA1LibraryDescription(items, name) {
  return bestLibraryDescription((items || []).filter(libraryDescriptionLooksLikeA1), name);
}

function configuredLibraryKeyForName(map, name) {
  for (const candidate of componentNameCandidates(name)) {
    const direct = map[candidate];
    if (typeof direct === 'string' && direct.trim()) return direct.trim();
    const matchingName = Object.keys(map).find((key) => figmaComponentNameMatches(key, candidate));
    const matchingValue = matchingName ? map[matchingName] : '';
    if (typeof matchingValue === 'string' && matchingValue.trim()) return matchingValue.trim();
  }
  return '';
}

function errorMessage(error, fallback = 'Unknown error') {
  if (error && typeof error.message === 'string' && error.message) return error.message;
  if (typeof error === 'string' && error) return error;
  try {
    const text = JSON.stringify(error);
    return text && text !== 'undefined' ? text : fallback;
  } catch {
    return fallback;
  }
}

function configuredLibraryKeyNames(name) {
  return componentNameCandidates(name)
    .filter((candidate) => A1_FIGMA_COMPONENT_SET_KEYS[candidate] !== undefined || A1_FIGMA_COMPONENT_KEYS[candidate] !== undefined);
}

function hasConfiguredLibraryKeyForName(name) {
  return Boolean(
    configuredLibraryKeyForName(A1_FIGMA_COMPONENT_SET_KEYS, name)
    || configuredLibraryKeyForName(A1_FIGMA_COMPONENT_KEYS, name)
  );
}

function emptyLibraryManifest() {
  return {
    schemaVersion: '1.0',
    library: { ...A1_FIGMA_LIBRARY_MANIFEST.library },
    componentSets: {},
    components: {},
    textStyles: {},
    variables: { color: {}, float: {} },
  };
}

function normalizeLibraryManifest(value) {
  const out = emptyLibraryManifest();
  if (!value || typeof value !== 'object') return out;
  if (value.library && typeof value.library === 'object') out.library = { ...out.library, ...value.library };
  out.componentSets = value.componentSets && typeof value.componentSets === 'object' ? value.componentSets : {};
  out.components = value.components && typeof value.components === 'object' ? value.components : {};
  out.textStyles = value.textStyles && typeof value.textStyles === 'object' ? value.textStyles : {};
  const variables = value.variables && typeof value.variables === 'object' ? value.variables : {};
  out.variables = {
    color: variables.color && typeof variables.color === 'object' ? variables.color : {},
    float: variables.float && typeof variables.float === 'object' ? variables.float : {},
  };
  return out;
}

async function readClientComponentKeyRegistry() {
  if (!clientComponentKeyRegistryPromise) {
    clientComponentKeyRegistryPromise = figma.clientStorage.getAsync(A1_COMPONENT_KEY_REGISTRY_STORAGE_KEY)
      .then((value) => {
        const manifest = normalizeLibraryManifest(value);
        return manifest;
      })
      .catch(() => emptyLibraryManifest());
  }
  return clientComponentKeyRegistryPromise;
}

async function importConfiguredLibraryComponentSource(name) {
  const stored = await readClientComponentKeyRegistry();
  const setKey = configuredLibraryKeyForName({ ...stored.componentSets, ...A1_FIGMA_COMPONENT_SET_KEYS }, name);
  if (setKey && typeof figma.importComponentSetByKeyAsync === 'function') {
    let imported = null;
    try {
      imported = await figma.importComponentSetByKeyAsync(setKey);
    } catch (error) {
      throw new Error(`componentSets["${name}"] key ${setKey} could not be imported: ${errorMessage(error)}`);
    }
    return componentSourceFromImported(imported);
  }
  const componentKey = configuredLibraryKeyForName({ ...stored.components, ...A1_FIGMA_COMPONENT_KEYS }, name);
  if (componentKey && typeof figma.importComponentByKeyAsync === 'function') {
    let imported = null;
    try {
      imported = await figma.importComponentByKeyAsync(componentKey);
    } catch (error) {
      throw new Error(`components["${name}"] key ${componentKey} could not be imported: ${errorMessage(error)}`);
    }
    return imported && imported.type === 'COMPONENT' ? imported : componentSourceFromImported(imported);
  }
  return null;
}

async function importLibraryComponentSetSource(name) {
  if (!figma.teamLibrary
    || typeof figma.teamLibrary.getAvailableComponentSetsAsync !== 'function'
    || typeof figma.importComponentSetByKeyAsync !== 'function') {
    return null;
  }
  const componentSets = await figma.teamLibrary.getAvailableComponentSetsAsync();
  const description = bestA1LibraryDescription(componentSets, name);
  if (!description || !description.key) return null;
  const imported = await figma.importComponentSetByKeyAsync(description.key);
  return componentSourceFromImported(imported);
}

async function importLibraryComponentSource(name, warnings) {
  if (libraryComponentSourceCache.has(name)) return libraryComponentSourceCache.get(name);
  let source = null;
  try {
    source = await importConfiguredLibraryComponentSource(name);
    if (source) {
      libraryComponentSourceCache.set(name, source);
      return source;
    }
  } catch (error) {
    if (warnings) warnings.push(`Could not import "${name}" from the A1 manifest: ${error.message}`);
  }

  source = findComponentSource(name);
  if (source) {
    libraryComponentSourceCache.set(name, source);
    return source;
  }
  try {
    source = await importLibraryComponentSetSource(name);
    if (source && sourceMatchesA1ComponentName(source, name)) {
      libraryComponentSourceCache.set(name, source);
      return source;
    }
    if (!figma.teamLibrary || typeof figma.teamLibrary.getAvailableComponentsAsync !== 'function' || typeof figma.importComponentByKeyAsync !== 'function') {
      if (warnings) {
        const configuredNames = configuredLibraryKeyNames(name);
        const registryHint = configuredNames.length
          ? `The built-in A1 registry has no usable key for ${configuredNames.join(' / ')}.`
          : `The built-in A1 registry has no entry for "${name}".`;
        warnings.push(`Figma cannot search enabled component libraries by name in this runtime, so "${name}" was not imported. ${registryHint} Update the checked-in A1 registry when the published library changes.`);
      }
      libraryComponentSourceCache.set(name, null);
      return null;
    }
    const components = await figma.teamLibrary.getAvailableComponentsAsync();
    const description = bestA1LibraryDescription(components, name);
    if (!description || !description.key) {
      if (warnings) warnings.push(`No enabled Figma library component matched "${name}" (tried: ${componentNameCandidates(name).join(', ')}).`);
      libraryComponentSourceCache.set(name, null);
      return null;
    }
    const imported = await figma.importComponentByKeyAsync(description.key);
    source = componentSourceFromImported(imported);
    if (source && sourceMatchesA1ComponentName(source, name)) {
      libraryComponentSourceCache.set(name, source);
      return source;
    }
    if (source && hasConfiguredLibraryKeyForName(name)) {
      if (warnings) warnings.push(`Imported "${name}" did not match the A1 Design System manifest, so it was ignored.`);
      libraryComponentSourceCache.set(name, null);
      return null;
    }
    libraryComponentSourceCache.set(name, source || null);
    return source || null;
  } catch (error) {
    if (warnings) warnings.push(`Could not import "${name}" from enabled Figma libraries: ${error.message}`);
    libraryComponentSourceCache.set(name, null);
    return null;
  }
}

async function findComponentSourceAsync(name, warnings) {
  return importLibraryComponentSource(name, warnings);
}

function localPublishedKey(node) {
  if (!node || typeof node.key !== 'string') return '';
  const key = node.key.trim();
  return key && key !== 'undefined' ? key : '';
}

function findLocalComponentSetForRegistry(name) {
  const page = figma.currentPage;
  return page ? page.findOne((node) => node.type === 'COMPONENT_SET' && figmaComponentNameMatches(node.name, name)) : null;
}

function findLocalStandaloneComponentForRegistry(name) {
  const page = figma.currentPage;
  return page ? page.findOne((node) =>
    node.type === 'COMPONENT'
    && (!node.parent || node.parent.type !== 'COMPONENT_SET')
    && figmaComponentNameMatches(node.name, name)) : null;
}

async function buildLocalLibraryManifest() {
  const componentSets = {};
  const components = {};
  const textStyles = {};
  const colorVariables = {};
  const floatVariables = {};
  const missing = [];
  const names = [...new Set([
    ...Object.keys(A1_FIGMA_COMPONENT_SET_KEYS),
    ...Object.keys(A1_FIGMA_COMPONENT_KEYS),
    ...Object.keys(FIGMA_COMPONENT_NAME_ALIASES),
  ])].sort((a, b) => a.localeCompare(b));

  for (const name of names) {
    const set = findLocalComponentSetForRegistry(name);
    const setKey = localPublishedKey(set);
    if (setKey) {
      componentSets[name] = setKey;
      continue;
    }
    const component = findLocalStandaloneComponentForRegistry(name);
    const componentKey = localPublishedKey(component);
    if (componentKey) {
      components[name] = componentKey;
      continue;
    }
    missing.push(name);
  }

  try {
    const styles = await figma.getLocalTextStylesAsync();
    for (const style of styles) {
      const key = localPublishedKey(style);
      if (!key || !style.name) continue;
      textStyles[style.name] = key;
    }
  } catch {
    // Text styles are exported when the source file exposes published keys.
  }

  try {
    const variables = typeof figma.variables.getLocalVariablesAsync === 'function'
      ? [
        ...await figma.variables.getLocalVariablesAsync('COLOR'),
        ...await figma.variables.getLocalVariablesAsync('FLOAT'),
      ]
      : [];
    for (const variable of variables) {
      const key = localPublishedKey(variable);
      if (!key || !variable.name) continue;
      if (variable.resolvedType === 'COLOR') colorVariables[variable.name] = key;
      if (variable.resolvedType === 'FLOAT') floatVariables[variable.name] = key;
    }
  } catch {
    // Variables are exported when the source file exposes published keys.
  }

  return {
    schemaVersion: '1.0',
    library: {
      ...A1_FIGMA_LIBRARY_MANIFEST.library,
      updatedAt: new Date().toISOString(),
    },
    componentSets,
    components,
    textStyles,
    variables: {
      color: colorVariables,
      float: floatVariables,
    },
    missing,
  };
}

function formatLibraryManifest(registry) {
  const formatObject = (values) => {
    const entries = Object.keys(values || {})
      .sort((a, b) => a.localeCompare(b))
      .map((key) => [key, values[key]])
      .filter(([, value]) => typeof value === 'string' && value.trim())
      .reduce((out, [key, value]) => ({ ...out, [key]: value }), {});
    return entries;
  };
  return JSON.stringify({
    schemaVersion: registry.schemaVersion || '1.0',
    library: registry.library || A1_FIGMA_LIBRARY_MANIFEST.library,
    componentSets: formatObject(registry.componentSets),
    components: formatObject(registry.components),
    textStyles: formatObject(registry.textStyles),
    variables: {
      color: formatObject(registry.variables && registry.variables.color),
      float: formatObject(registry.variables && registry.variables.float),
    },
  }, null, 2);
}

async function handleExportComponentKeys() {
  const registry = await buildLocalLibraryManifest();
  await figma.clientStorage.setAsync(A1_COMPONENT_KEY_REGISTRY_STORAGE_KEY, registry);
  clientComponentKeyRegistryPromise = Promise.resolve(normalizeLibraryManifest(registry));
  const text = formatLibraryManifest(registry);
  const found = Object.keys(registry.componentSets).length + Object.keys(registry.components).length;
  const textStyleCount = Object.keys(registry.textStyles).length;
  const variableCount = Object.keys(registry.variables.color).length + Object.keys(registry.variables.float).length;
  const warnings = registry.missing.length
    ? [`${registry.missing.length} known A1 component names did not have published local keys in this file: ${registry.missing.slice(0, 12).join(', ')}${registry.missing.length > 12 ? ', …' : ''}`]
    : [];
  postPluginMessage({
    type: 'component-key-registry-result',
    text,
    warnings,
    message: `Exported A1 library manifest: ${found} component key${found === 1 ? '' : 's'}, ${textStyleCount} text style key${textStyleCount === 1 ? '' : 's'}, and ${variableCount} variable key${variableCount === 1 ? '' : 's'}.`,
  });
}

// Resolve an INSTANCE_SWAP value (a component id) to a Material Symbols name.
// Icon components are named after the glyph; variants inside an icon set are
// named "Prop=value", so prefer the parent set's name in that case.
function iconNameFromSwapValue(value) {
  if (!value || typeof value !== 'string') return null;
  const node = resolveNodeById(value);
  if (!node) return null;
  const materialName = materialIconNameFromSource(node);
  if (materialName) return materialName;
  const name = node.name.includes('=') && node.parent && node.parent.type === 'COMPONENT_SET'
    ? node.parent.name
    : node.name;
  return materialIconNameCandidate(name) || name.split('/').pop().trim() || null;
}

// Instance-swap properties can retain their set default after a variant
// replacement, while the visible child instance has the actual Material icon.
// Prefer that live child when exporting Badge (and retain the property lookup
// as a fallback for older asset versions).
function iconChildNameMatches(name, childName = 'Icon') {
  const wanted = canonicalKey(childName);
  const actual = canonicalKey(name);
  if (!wanted || !actual) return false;
  if (actual === wanted) return true;
  if (wanted === 'icon') return actual === 'navicon' || actual.endsWith('icon') || actual.includes('icon');
  return false;
}

function nestedIconInstance(instance, childName = 'Icon') {
  // Do not use `findOne` here. Figma can retain a just-replaced instance
  // sublayer in its native traversal; merely reading that proxy's `name`
  // throws outside the callback's normal try/catch. Re-fetch every descendant
  // by id before looking at it instead.
  const root = liveNode(instance);
  if (!root || !('children' in root)) return null;
  const queue = [...stackFlowChildren(root)];
  const visited = new Set();
  while (queue.length) {
    const candidate = liveNode(queue.shift());
    if (!candidate || visited.has(candidate.id)) continue;
    visited.add(candidate.id);
    try {
      if (candidate.type === 'INSTANCE' && iconChildNameMatches(candidate.name, childName)) return candidate;
      if ('children' in candidate) queue.push(...stackFlowChildren(candidate));
    } catch {
      // The sublayer changed during a variant swap. Skip only this icon.
    }
  }
  return null;
}

function iconNameFromInstance(instance, childName = 'Icon') {
  const icon = nestedIconInstance(instance, childName);
  if (!icon) return null;
  try {
    const component = icon.mainComponent;
    return materialIconNameFromSource(component, icon.name) || (component ? iconNameFromSwapValue(component.id) : null);
  } catch {
    return null;
  }
}

function materialIconTextLayer(root) {
  const current = liveNode(root);
  if (!current || !('children' in current)) return null;
  const queue = [...stackFlowChildren(current)];
  const visited = new Set();
  const textCandidates = [];
  while (queue.length) {
    const candidate = liveNode(queue.shift());
    if (!candidate || visited.has(candidate.id)) continue;
    visited.add(candidate.id);
    try {
      if (candidate.type === 'TEXT') {
        const name = canonicalKey(candidate.name || '');
        const font = candidate.fontName !== figma.mixed && candidate.fontName
          ? `${candidate.fontName.family || ''} ${candidate.fontName.style || ''}`
          : '';
        const iconNamed = name.includes('icon') || name.includes('glyph') || name.includes('symbol');
        const materialFont = /material\s+(symbols|icons)/i.test(font);
        if (materialFont || iconNamed) textCandidates.push({ text: candidate, materialFont, iconNamed });
      }
      if ('children' in candidate) queue.push(...stackFlowChildren(candidate));
    } catch {
      // Ignore stale instance internals during swaps.
    }
  }
  return textCandidates.find((candidate) => candidate.materialFont && candidate.iconNamed)?.text
    || textCandidates.find((candidate) => candidate.materialFont)?.text
    || textCandidates.find((candidate) => candidate.iconNamed)?.text
    || null;
}

async function applyMaterialIconText(root, iconName, warnings, description) {
  const text = materialIconTextLayer(nestedIconInstance(root, 'Icon') || root);
  if (!text || !iconName) return false;
  try {
    if (text.fontName !== figma.mixed) await figma.loadFontAsync(text.fontName);
    text.characters = iconName;
    return true;
  } catch (error) {
    warnings.push(`${description || 'Material icon text'} could not be updated: ${error.message}`);
    return false;
  }
}

async function finalizeMaterialIconUpdate(root, iconName, materialIcon, propertyApplied, warnings, description) {
  const current = currentInstance(root) || root;
  const iconSwapped = materialIcon
    ? swapNestedMaterialIconInstance(current, materialIcon, warnings, description)
    : false;
  const textUpdated = await applyMaterialIconText(current, iconName, warnings, description);
  if (!propertyApplied && !iconSwapped && !textUpdated) {
    warnings.push(`${description || 'Material icon'} could not be applied — no exposed icon swap/text property or editable nested icon text was found.`);
  }
  return propertyApplied || iconSwapped || textUpdated;
}

function swapMaterialIconInstance(iconInstance, materialIcon, warnings, description) {
  const icon = liveNode(iconInstance);
  if (!icon || icon.type !== 'INSTANCE' || !materialIcon) return false;
  try {
    icon.swapComponent(materialIcon);
    return true;
  } catch (error) {
    warnings.push(`${description || 'Material icon'} could not be swapped: ${error.message}`);
    return false;
  }
}

function swapNestedMaterialIconInstance(instance, materialIcon, warnings, description, childName = 'Icon', warnIfMissing = false) {
  const icon = nestedIconInstance(instance, childName);
  if (!icon) {
    if (warnIfMissing) warnings.push(`${description || 'Material icon'} could not be updated because the nested ${childName} instance was not found.`);
    return false;
  }
  return swapMaterialIconInstance(icon, materialIcon, warnings, description);
}

function findIconComponent(iconName) {
  const requested = materialIconNameCandidate(iconName);
  if (!requested) return null;
  const page = figma.currentPage;
  if (!page) return null;
  const direct = page.findOne((node) =>
    node.type === 'COMPONENT' &&
    (
      node.name === requested ||
      node.name.split('/').pop().trim() === requested ||
      sourceLooksLikeMaterialIcon(node, requested) ||
      materialIconNameCandidate(node.name) === requested
    ));
  if (direct && direct.type === 'COMPONENT') return direct;
  const set = page.findOne((node) =>
    node.type === 'COMPONENT_SET' &&
    (
      node.name === requested ||
      node.name.split('/').pop().trim() === requested ||
      (node.children || []).some((child) => child.type === 'COMPONENT' && sourceLooksLikeMaterialIcon(child, requested))
    ));
  if (!set || set.type !== 'COMPONENT_SET') return null;
  return set.children.find((child) => child.type === 'COMPONENT' && sourceLooksLikeMaterialIcon(child, requested))
    || set.defaultVariant
    || set.children[0]
    || null;
}

function sourcePageName(node) {
  try {
    for (let current = node; current; current = current.parent) {
      if (current.type === 'PAGE') return current.name || '';
    }
  } catch {
    return '';
  }
  return '';
}

function materialIconNameCandidate(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const parenthesized = raw.match(/\bicon\s*\(([^)]+)\)/i);
  const tail = parenthesized ? parenthesized[1] : raw.split('/').pop().trim();
  const variantValue = tail.match(/^[a-z][\w\s-]*=([^/]+)$/i);
  const normalized = (variantValue ? variantValue[1] : tail)
    .replace(/^Material Symbols?\s*[-:/]\s*/i, '')
    .trim();
  if (!normalized) return '';
  const key = canonicalKey(normalized);
  if (['icon', 'navicon', 'default', 'regular', 'outlined', 'filled', 'true', 'false'].includes(key)) return '';
  return normalized;
}

function materialIconNameFromSource(component, instanceName = '') {
  if (!component) return '';
  try {
    const set = component.parent && component.parent.type === 'COMPONENT_SET' ? component.parent : null;
    const pageName = canonicalKey(sourcePageName(set || component));
    const setName = set ? set.name : '';
    const componentName = component.name || '';
    const sourceKey = canonicalKey(`${pageName} ${setName} ${componentName}`);
    const iconSourceLike = /material|symbol|icon/.test(sourceKey);
    const nameCandidate = materialIconNameCandidate(setName)
      || materialIconNameCandidate(componentName)
      || materialIconNameCandidate(instanceName);
    return iconSourceLike && nameCandidate ? nameCandidate : '';
  } catch {
    return '';
  }
}

function sourceLooksLikeMaterialIcon(component, requestedName = '') {
  const name = materialIconNameFromSource(component, requestedName);
  if (!name) return false;
  return !requestedName || compactKey(name) === compactKey(requestedName);
}

async function findMaterialIconComponentAsync(iconName, warnings) {
  const requested = materialIconNameCandidate(iconName);
  if (!requested) return null;
  const local = findIconComponent(requested);
  if (local && (sourceLooksLikeMaterialIcon(local, requested) || materialIconNameCandidate(local.name) === requested)) return local;

  if (!figma.teamLibrary || typeof figma.teamLibrary.getAvailableComponentSetsAsync !== 'function') return local || null;

  try {
    if (typeof figma.importComponentSetByKeyAsync === 'function') {
      const sets = await figma.teamLibrary.getAvailableComponentSetsAsync();
      const description = bestA1LibraryDescription(sets, requested);
      if (description && description.key) {
        const imported = await figma.importComponentSetByKeyAsync(description.key);
        const source = componentSourceFromImported(imported);
        if (source && sourceLooksLikeMaterialIcon(source, requested)) return source;
      }
    }
    if (typeof figma.teamLibrary.getAvailableComponentsAsync === 'function' && typeof figma.importComponentByKeyAsync === 'function') {
      const components = await figma.teamLibrary.getAvailableComponentsAsync();
      const description = bestA1LibraryDescription(components, requested);
      if (description && description.key) {
        const imported = await figma.importComponentByKeyAsync(description.key);
        const source = componentSourceFromImported(imported);
        if (source && sourceLooksLikeMaterialIcon(source, requested)) return source;
      }
    }
  } catch (error) {
    if (warnings) warnings.push(`Material icon "${requested}" could not be imported from the A1 library: ${error.message}`);
  }
  return local || null;
}

function materialIconNameFromInstance(instance) {
  const live = liveNode(instance);
  if (!live || live.type !== 'INSTANCE') return '';
  try {
    const main = live.mainComponent;
    if (!main) return '';
    const instanceName = canonicalKey(live.name || '');
    const compactInstanceName = compactKey(live.name || '');
    const componentName = canonicalKey(componentSetName(live) || '');
    const mainName = canonicalKey(main.name || '');
    const materialSetLike = /material|symbol|icon/.test(componentName);
    const iconLayerLike = instanceName === 'icon'
      || instanceName.endsWith(' icon')
      || instanceName.includes('icon ')
      || compactInstanceName.startsWith('icon');
    const pageIconName = materialIconNameFromSource(main, live.name || '');
    if (pageIconName) return pageIconName;
    const layerIconName = iconLayerLike ? materialIconNameCandidate(live.name || '') : '';
    const iconName = layerIconName
      || iconNameFromSwapValue(main.id)
      || (materialSetLike || iconLayerLike ? (main.name || componentSetName(live) || live.name || '').split('/').pop().trim() : '');
    // A1 components consistently nest Material Symbols as layers named Icon,
    // Nav icon, etc. Standalone Material-symbol instances often expose the
    // glyph as the component/set name. Treat those as valid audit internals
    // without making arbitrary external component instances exportable.
    if ((iconLayerLike || materialSetLike) && iconName) return iconName;
    if ((iconLayerLike || materialSetLike) && (mainName === 'icon' || componentName === 'icon')) return 'icon';
  } catch {
    return '';
  }
  return '';
}

function iconPluginData(node, key) {
  try {
    return node && typeof node.getPluginData === 'function' ? node.getPluginData(key) : '';
  } catch {
    return '';
  }
}

function setIconPluginData(node, name, color = '') {
  try {
    if (!node || typeof node.setPluginData !== 'function') return;
    node.setPluginData(A1_ICON_NAME_KEY, name || '');
    node.setPluginData(A1_ICON_COLOR_KEY, color || '');
  } catch {
    // Plugin data improves round-tripping but never blocks a visible icon.
  }
}

function materialIconFontName(text) {
  try {
    if (!text || text.type !== 'TEXT' || text.fontName === figma.mixed) return null;
    return /material\s+(symbols|icons)/i.test(String(text.fontName && text.fontName.family || ''))
      ? text.fontName
      : null;
  } catch {
    return null;
  }
}

function materialIconNameFromTextNode(text) {
  const current = liveNode(text) || text;
  if (!current || current.type !== 'TEXT') return '';
  const taggedName = materialIconNameCandidate(iconPluginData(current, A1_ICON_NAME_KEY));
  if (taggedName) return taggedName;
  if (!materialIconFontName(current)) return '';
  try {
    return materialIconNameCandidate(current.characters);
  } catch {
    return '';
  }
}

function isMaterialIconTextNode(node) {
  return Boolean(materialIconNameFromTextNode(node));
}

function existingMaterialIconFontName() {
  try {
    const text = figma.currentPage.findOne((node) => node.type === 'TEXT' && Boolean(materialIconFontName(node)));
    return text && text.type === 'TEXT' ? materialIconFontName(text) : null;
  } catch {
    return null;
  }
}

async function loadMaterialIconFont() {
  const existing = existingMaterialIconFontName();
  let available = [];
  try {
    available = (await figma.listAvailableFontsAsync())
      .map((font) => font.fontName)
      .filter((fontName) => /material\s+(symbols|icons)/i.test(String(fontName && fontName.family || '')))
      .sort((first, second) => Number(second.family === 'Material Symbols Outlined') - Number(first.family === 'Material Symbols Outlined'));
  } catch {
    // The known Material font names below cover older Figma runtimes.
  }
  const candidates = [
    existing,
    ...available,
    { family: 'Material Symbols Outlined', style: 'Regular' },
    { family: 'Material Icons', style: 'Regular' },
  ].filter(Boolean);
  for (const fontName of candidates) {
    try {
      await figma.loadFontAsync(fontName);
      return fontName;
    } catch {
      // Try the next installed Material icon font.
    }
  }
  throw new Error('Material Symbols Outlined is unavailable in Figma. Install or enable the font, then render the Icon again.');
}

async function createMaterialIconTextNode(name) {
  const text = figma.createText();
  try {
    text.fontName = await loadMaterialIconFont();
    text.characters = name;
    text.textAutoResize = 'WIDTH_AND_HEIGHT';
    text.textAlignHorizontal = 'CENTER';
    text.textAlignVertical = 'CENTER';
    text.name = `Icon (${name})`;
    setIconPluginData(text, name);
    return text;
  } catch (error) {
    try { text.remove(); } catch { /* The failed text layer may already be unavailable. */ }
    throw error;
  }
}

// setProperties on a TEXT property re-renders the label, which requires the
// label's font to be loaded first.
async function loadInstanceFonts(instance) {
  const texts = instance.findAll((node) => node.type === 'TEXT');
  await Promise.all(texts
    .filter((text) => text.fontName !== figma.mixed)
    .map((text) => figma.loadFontAsync(text.fontName)));
}

function postPluginMessage(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    figma.ui.postMessage(payload);
    return;
  }
  const message = { ...payload };
  if (payload.type === 'selection') {
    const selection = figma.currentPage.selection;
    const target = selection.length === 1 ? liveNode(selection[0]) : null;
    const configurable = target && typeof target.getPluginData === 'function' && typeof target.setPluginData === 'function';
    message.breakpointVisibilityNodeId = configurable ? target.id : null;
    message.breakpointVisibility = configurable
      ? resolveBreakpointVisibility(readBreakpointVisibility(target))
      : null;
  }
  if (Array.isArray(message.warnings)) {
    const originalWarnings = message.warnings.map(warningText).filter(Boolean);
    const originalMessage = originalWarnings.join('\n');
    message.warnings = compactWarnings(originalWarnings);
    if (typeof message.message === 'string' && message.message === originalMessage) {
      message.message = message.warnings.join('\n');
    }
  }
  if (typeof message.message === 'string') message.message = compactWarningMessage(message.message);
  figma.ui.postMessage(message);
}

function postError(message) {
  postPluginMessage({ type: 'error', message });
}

function readBreakpointVisibility(node) {
  if (!node || typeof node.getPluginData !== 'function') return null;
  try {
    const raw = node.getPluginData(A1_BREAKPOINT_VISIBILITY_KEY);
    return raw ? compactBreakpointVisibility(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

function writeBreakpointVisibility(node, value) {
  if (!node || typeof node.setPluginData !== 'function') return null;
  const visibility = compactBreakpointVisibility(value);
  node.setPluginData(A1_BREAKPOINT_VISIBILITY_KEY, visibility ? JSON.stringify(visibility) : '');
  return visibility;
}

function handleSetBreakpointVisibility(message) {
  const selection = figma.currentPage.selection;
  const target = selection.length === 1 ? liveNode(selection[0]) : null;
  if (!target || target.id !== message.breakpointVisibilityNodeId || typeof target.setPluginData !== 'function') {
    postPluginMessage({
      type: 'breakpoint-visibility-result',
      outcome: 'selection-changed',
      warnings: [],
    });
    return;
  }
  const visibility = writeBreakpointVisibility(target, message.visibility);
  const resolved = resolveBreakpointVisibility(visibility);
  let previewBreakpoint = '';
  for (let current = target; current && !previewBreakpoint; current = current.parent) {
    previewBreakpoint = readBreakpointData(current);
  }
  if (A1_BREAKPOINTS.includes(previewBreakpoint)) {
    try {
      target.visible = resolved[previewBreakpoint] !== false;
    } catch {
      // Metadata remains authoritative if this layer cannot change visibility.
    }
  }
  postPluginMessage({
    type: 'breakpoint-visibility-result',
    breakpointVisibilityNodeId: target.id,
    breakpointVisibility: resolved,
    outcome: visibility ? 'updated' : 'reset',
    warnings: [],
  });
  postSelectionState();
  scheduleAutoExport();
  scheduleLivePreview();
  scheduleLinkedPagePreview();
}

function withBreakpointVisibility(sourceNode, result) {
  if (!result || !result.node || typeof result.node.type !== 'string') return result;
  const visibility = readBreakpointVisibility(sourceNode);
  return visibility
    ? { ...result, node: { ...result.node, visibility } }
    : result;
}

// The component-set name (or bare component name) an instance belongs to, if
// it has a registered exporter.
function registeredSetName(instanceNode) {
  try {
    const detachedName = instanceNode && typeof instanceNode.getSharedPluginData === 'function'
      ? instanceNode.getSharedPluginData(DETACHED_COMPONENT_NAMESPACE, DETACHED_COMPONENT_KEY)
      : '';
    if (detachedName && EXPORTERS[detachedName]) return detachedName;
  } catch {
    // A stale Figma node can reject plugin-data reads while an instance swaps.
  }
  const name = componentSetName(instanceNode);
  return EXPORTERS[name] ? name : null;
}

function isA1ComponentInstance(instanceNode, componentName) {
  const instance = liveNode(instanceNode);
  if (!instance || instance.type !== 'INSTANCE') return false;
  try {
    const detachedName = typeof instance.getSharedPluginData === 'function'
      ? instance.getSharedPluginData(DETACHED_COMPONENT_NAMESPACE, DETACHED_COMPONENT_KEY)
      : '';
    if (detachedName === componentName) return true;
  } catch {
    // Detached metadata is a convenience marker, not the source of truth.
  }

  const source = findComponentSource(componentName);
  if (!source) return false;
  try {
    const main = instance.mainComponent;
    if (!main) return false;
    if (main.id === source.id) return true;
    const mainSet = main.parent && main.parent.type === 'COMPONENT_SET' ? main.parent : null;
    const sourceSet = source.parent && source.parent.type === 'COMPONENT_SET' ? source.parent : null;
    return Boolean(mainSet && sourceSet && mainSet.id === sourceSet.id);
  } catch {
    return false;
  }
}

// Variable, text, and layout helpers are defined in src/figma/*.js.
// ── Free auto-layout frames → Stack / Grid ────────────────────────────────
// Figma does not use a component instance for the general-purpose Stack. A
// normal authored auto-layout Frame is its counterpart. Component internals
// are deliberately excluded, while a frame placed in a native SLOT remains
// exportable: the slot is the component's editable content boundary.
function isAutoLayoutFrame(node) {
  return Boolean(node && node.type === 'FRAME' && ['HORIZONTAL', 'VERTICAL'].includes(node.layoutMode));
}

function isGridFrame(node) {
  return Boolean(node && node.type === 'FRAME' && node.layoutMode === 'GRID' && !isComponentImplementationNode(node));
}

function isComponentImplementationNode(node) {
  try {
    for (let parent = node && node.parent; parent && parent.type !== 'PAGE'; parent = parent.parent) {
      if (parent.type === 'SLOT') return false;
      if (['INSTANCE', 'COMPONENT', 'COMPONENT_SET'].includes(parent.type)) return true;
    }
    return false;
  } catch {
    return true;
  }
}

function isStackFrame(node) {
  return isAutoLayoutFrame(node) && !isComponentImplementationNode(node);
}

function conversionSuggestion(target, primary = false) {
  return { target, label: CONVERT_TARGET_LABELS[target] || target, primary };
}

function uniqueConversionSuggestions(targets, primaryTarget = '', excludedTargets = []) {
  const seen = new Set();
  const excluded = new Set(excludedTargets.filter((target) => typeof target === 'string' && target));
  return targets
    .filter((target) => typeof target === 'string' && target)
    .filter((target) => !excluded.has(target))
    .filter((target) => {
      if (seen.has(target)) return false;
      seen.add(target);
      return true;
    })
    .map((target) => conversionSuggestion(target, target === primaryTarget));
}

function conversionRecommendationForSelection(selection) {
  const selected = topLevelSelectionNodes(selection || []);
  const target = selected.length === 1 ? liveNode(selected[0]) : null;
  if (!target) {
    return selected.length > 1 ? {
      title: 'Selection',
      reasoning: 'Multiple selected layers can be grouped into an A1 layout primitive.',
      suggestions: uniqueConversionSuggestions(['stack', 'button-container', 'grid', 'section', 'card'], 'stack'),
    } : null;
  }
  if (target.type === 'TEXT' && isMaterialIconTextNode(target)) return null;
  if (target.type === 'TEXT') {
    const suggestion = textSuggestion(target);
    const primary = suggestion.type === 'Heading' ? 'heading' : 'body';
    const isReady = !Array.isArray(suggestion.issues) || suggestion.issues.length === 0;
    if (isReady) {
      const currentTarget = primary;
      const alternateTargets = currentTarget === 'body' ? ['heading'] : ['body'];
      return {
        title: 'Text',
        reasoning: '',
        primaryFallback: false,
        suggestions: uniqueConversionSuggestions(alternateTargets),
      };
    }
    return {
      title: 'Text',
      reasoning: primary === 'heading'
        ? 'This text looks closest to semantic Heading typography.'
        : 'This text looks closest to semantic Body typography.',
      suggestions: uniqueConversionSuggestions([primary, primary === 'heading' ? 'body' : 'heading'], primary),
    };
  }
  if (isStackFrame(target)) {
    return {
      title: 'Auto layout',
      reasoning: 'This frame is already a Stack. Use the alternates when it is acting as a surface, section, full page, or multi-column layout.',
      primaryFallback: false,
      suggestions: uniqueConversionSuggestions(['stack', 'button-container', 'card', 'section', 'grid', 'page-layout'], 'stack', ['stack']),
    };
  }
  if (isGridFrame(target)) {
    return {
      title: 'Responsive Grid',
      reasoning: 'This frame is already a responsive Grid. Use the alternates when the layout intent is simpler or the frame is acting as a surface.',
      primaryFallback: false,
      suggestions: uniqueConversionSuggestions(['grid', 'stack', 'section', 'card', 'page-layout'], 'grid', ['grid']),
    };
  }
  if (target.type === 'FRAME' && target.parent && target.parent.type === 'PAGE') {
    return {
      title: 'Frame',
      reasoning: 'Top-level frames are usually page structure. Use Page when it represents a full screen, Section for page structure, Stack/Grid for layout primitives, or Card for a contained surface.',
      suggestions: uniqueConversionSuggestions(['section', 'page-layout', 'stack', 'grid', 'card'], 'section'),
    };
  }
  if (target.type === 'FRAME' || target.type === 'GROUP') {
    return {
      title: target.type === 'GROUP' ? 'Group' : 'Frame',
      reasoning: 'This selection can be converted into common A1 structure. Pick the option that best matches its visual role.',
      suggestions: uniqueConversionSuggestions(['section', 'card', 'stack', 'grid', 'button-container'], 'section'),
    };
  }
  return null;
}

function figmaNumber(value, fallback = 0) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) return numeric;
  }
  return fallback;
}

function nearestStackGap(value) {
  const numericValue = figmaNumber(value, NaN);
  if (!Number.isFinite(numericValue)) return 16;
  return STACK_GAPS.reduce((nearest, gap) =>
    Math.abs(gap - numericValue) < Math.abs(nearest - numericValue) ? gap : nearest, STACK_GAPS[0]);
}

function stackGapFromFigma(value, warnings) {
  if (STACK_GAPS.includes(value)) return value;
  const nearest = nearestStackGap(value);
  warnings.push(`itemSpacing=${value} is not in the A1 Stack spacing scale — nearest A1 gap (${nearest}) was exported.`);
  return nearest;
}

function stackGapToFigma(value, warnings) {
  if (typeof value === 'string' && STACK_SEMANTIC_GAPS[value] !== undefined) return STACK_SEMANTIC_GAPS[value];
  if (STACK_GAPS.includes(value)) return value;
  warnings.push(`gap=${JSON.stringify(value)} is not in the A1 Stack spacing scale — 16 was used.`);
  return 16;
}

function staticStackValue(value, allowed, fallback, name, warnings) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const responsiveValue = value.xs;
    if (allowed.includes(responsiveValue)) {
      warnings.push(`Responsive ${name} has no Figma representation — its xs value (${responsiveValue}) was used.`);
      return responsiveValue;
    }
    warnings.push(`Responsive ${name} has no Figma representation — ${fallback} was used.`);
    return fallback;
  }
  if (value === undefined) return fallback;
  if (allowed.includes(value)) return value;
  warnings.push(`${name}=${JSON.stringify(value)} is not supported — ${fallback} was used.`);
  return fallback;
}

function stripStackPropsName(name) {
  return String(name || 'Stack')
    .replace(/\s*[-–—]\s*\{\s*direction\s*:\s*(?:row|column|row-reverse|column-reverse)\s*,\s*wrap\s*:\s*(?:true|false)\s*\}\s*$/i, '')
    .trim() || 'Stack';
}

function stackPropsName(baseName, direction, wrap) {
  const appliedDirection = direction === 'row' ? 'row' : 'column';
  return `${stripStackPropsName(baseName)} - {direction:${appliedDirection}, wrap:${wrap ? 'true' : 'false'}}`;
}

function syncStackPropsName(frame) {
  if (!frame) return;
  const direction = frame.layoutMode === 'HORIZONTAL' ? 'row' : 'column';
  const wrap = frame.layoutMode === 'HORIZONTAL' && frame.layoutWrap === 'WRAP';
  try {
    frame.name = stackPropsName(frame.name || 'Stack', direction, wrap);
  } catch {
    // Ignore stale or immutable layer names.
  }
}

function stackGapControlValue(value) {
  const gap = nearestStackGap(value);
  if (gap === 0) return 'none';
  const semantic = Object.entries(STACK_SEMANTIC_GAPS)
    .find(([, semanticValue]) => semanticValue === gap);
  return semantic ? semantic[0] : 'md';
}

function stackGapControlToProp(value) {
  if (value === 'none') return 0;
  return STACK_CONTEXT_GAPS.includes(value) ? value : 'md';
}

function stackContextForSelection(frame) {
  const direction = frame.layoutMode === 'HORIZONTAL' ? 'row' : 'column';
  const align = stackUsesStretch(frame) ? 'stretch' : (STACK_ALIGN_FROM_FIGMA[frame.counterAxisAlignItems] || 'start');
  const justify = STACK_JUSTIFY_FROM_FIGMA[frame.primaryAxisAlignItems] || 'start';
  return {
    direction,
    directionOptions: STACK_CONTEXT_DIRECTIONS,
    gap: stackGapControlValue(frame.itemSpacing),
    gapOptions: STACK_CONTEXT_GAPS,
    justify: STACK_CONTEXT_JUSTIFIES.includes(justify) ? justify : 'start',
    justifyOptions: STACK_CONTEXT_JUSTIFIES,
    align: STACK_CONTEXT_ALIGNS.includes(align) ? align : 'stretch',
    alignOptions: STACK_CONTEXT_ALIGNS,
    wrapMode: frame.layoutMode === 'HORIZONTAL' && frame.layoutWrap === 'WRAP' ? 'wrap' : 'nowrap',
    wrapModeOptions: ['nowrap', 'wrap'],
    widthMode: layoutWidthMode(frame),
    widthModeOptions: STACK_CONTEXT_WIDTH_MODES,
    heightMode: layoutHeightMode(frame),
    heightModeOptions: STACK_CONTEXT_WIDTH_MODES,
  };
}

function stackUsesStretch(frame) {
  const flowChildren = stackFlowChildren(frame);
  return flowChildren.length > 0 && flowChildren.every((child) => {
    try {
      return child.layoutAlign === 'STRETCH';
    } catch {
      return false;
    }
  });
}

function hasStackPadding(frame) {
  return ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'].some((key) => figmaNumber(frame[key]) !== 0);
}

function firstVisibleSolidPaint(paints) {
  return Array.isArray(paints)
    ? paints.find((paint) => paint && paint.type === 'SOLID' && paint.visible !== false && (paint.opacity === undefined || paint.opacity > 0))
    : null;
}

function isNearWhite(paint) {
  const color = paint && paint.color;
  return Boolean(color && color.r >= 0.94 && color.g >= 0.94 && color.b >= 0.94);
}

// A deliberately conservative heuristic. An authored Card may use either a
// border or the common borderless white-surface treatment (the blue Figma
// selection outline is not an authored border), so require a second content
// item for the borderless form.
function cardSuggestion(frame) {
  if (!frame || frame.type !== 'FRAME' || isComponentImplementationNode(frame)) return null;
  const children = (() => {
    try { return [...frame.children]; } catch { return []; }
  })();
  const padding = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']
    .map((key) => figmaNumber(frame[key]));
  const hasPadding = padding.some((value) => value >= 4);
  const hasSurface = isNearWhite(firstVisibleSolidPaint(frame.fills));
  const hasBorder = Boolean(firstVisibleSolidPaint(frame.strokes)) && figmaNumber(frame.strokeWeight) > 0;
  const looksLikeBorderlessCard = !hasBorder && children.length >= 2;
  if (!children.length || !hasPadding || !hasSurface || (!hasBorder && !looksLikeBorderlessCard)) return null;

  return {
    issues: [
      `This padded white frame${hasBorder ? ' with a border' : ' with grouped content'} looks like an A1 Card.`,
      'AutoFix will try to replace the frame with the A1 Card component and move its existing content into the Card Content Slot.',
    ],
    fixes: ['convert to Card'],
  };
}

function pageLayoutCandidateHeader(frame) {
  if (!frame || frame.type !== 'FRAME') return null;
  try {
    return [...frame.children].find((child) => child && child.type === 'INSTANCE' && registeredSetName(child) === 'Top Header') || null;
  } catch {
    return null;
  }
}

function pageLayoutCandidateContent(frame, header) {
  try {
    return [...frame.children].filter((child) => child && child.id !== header?.id && child.visible !== false);
  } catch {
    return [];
  }
}

function pageLayoutSuggestion(frame) {
  if (!frame || frame.type !== 'FRAME' || isComponentImplementationNode(frame)) return null;
  const header = pageLayoutCandidateHeader(frame);
  if (!header) return null;
  const contentChildren = pageLayoutCandidateContent(frame, header);
  if (contentChildren.length === 0) return null;
  return {
    issues: [
      'This frame contains a Top Header and page content, so it looks like an A1 Page Layout.',
      'AutoFix will try to replace the frame with the A1 Page Layout component, apply the Top Header configuration, and move the remaining content into the Page Content Slot.',
    ],
    fixes: ['convert to Page Layout'],
  };
}

// Like textSuggestion, this only describes the closest portable A1 contract.
// A separate explicit action applies the safe Figma repairs; padding is
// intentionally review-only because removing it changes the frame's content
// box and should be modelled by an Inset in A1 instead.
function stackSuggestion(frame) {
  const issues = [];
  const fixes = [];
  const itemSpacing = figmaNumber(frame.itemSpacing);
  const counterAxisSpacing = figmaNumber(frame.counterAxisSpacing);
  const nearestGap = nearestStackGap(itemSpacing);
  if (!STACK_GAPS.includes(itemSpacing)) {
    issues.push(`Item spacing ${frame.itemSpacing} is outside the A1 Stack scale; ${nearestGap} is the nearest supported gap.`);
    fixes.push('item spacing');
  } else if (gapNeedsVariableBinding(itemSpacing) && !propertyHasBoundVariable(frame, 'itemSpacing')) {
    issues.push(`Item spacing ${frame.itemSpacing} uses an A1 value but is not bound to a Figma gap variable.`);
    fixes.push('item spacing variable');
  }
  if (frame.layoutWrap === 'WRAP' && frame.layoutMode !== 'HORIZONTAL') {
    issues.push('Figma wrapping is only supported by A1 Stack in a horizontal direction; wrapping will be turned off.');
    fixes.push('wrap direction');
  }
  if (frame.layoutWrap === 'WRAP' && counterAxisSpacing !== nearestGap) {
    issues.push(`Wrap row spacing ${frame.counterAxisSpacing} differs from the single A1 Stack gap; ${nearestGap} will be used for both.`);
    fixes.push('wrap row spacing');
  } else if (frame.layoutWrap === 'WRAP' && gapNeedsVariableBinding(counterAxisSpacing) && !propertyHasBoundVariable(frame, 'counterAxisSpacing')) {
    issues.push(`Wrap row spacing ${frame.counterAxisSpacing} uses an A1 value but is not bound to a Figma gap variable.`);
    fixes.push('wrap row spacing variable');
  }
  const flowChildren = stackFlowChildren(frame);
  const stretchedChildren = flowChildren.filter((child) => child.layoutAlign === 'STRETCH');
  if (stretchedChildren.length > 0 && stretchedChildren.length < flowChildren.length) {
    issues.push('Mixed child stretch settings cannot be represented by one Stack align value; the parent alignment will be used for all children.');
    fixes.push('child alignment');
  }
  if (hasStackPadding(frame)) {
    issues.push('Frame padding has no Stack prop. Keep it in Figma or move it to an A1 Inset after export.');
  }
  const align = stackUsesStretch(frame) ? 'stretch' : (STACK_ALIGN_FROM_FIGMA[frame.counterAxisAlignItems] || 'start');
  return { issues, fixes, nearestGap, align };
}

async function applyStackSuggestion(frame, suggestion, warnings) {
  await bindGapProperty(frame, 'itemSpacing', suggestion.nearestGap, warnings, 'Stack item spacing');
  if (frame.layoutWrap === 'WRAP') {
    if (frame.layoutMode !== 'HORIZONTAL') frame.layoutWrap = 'NO_WRAP';
    else await bindGapProperty(frame, 'counterAxisSpacing', suggestion.nearestGap, warnings, 'Stack wrap row spacing');
  }
  const flowChildren = stackFlowChildren(frame);
  const stretchedChildren = flowChildren.filter((child) => child.layoutAlign === 'STRETCH');
  if (stretchedChildren.length > 0 && stretchedChildren.length < flowChildren.length) {
    setStackChildrenAlignment(frame, suggestion.align, warnings);
  }
  syncStackPropsName(frame);
}

function exportStack(frame, ancestors = new Set()) {
  const warnings = [];
  const props = {};
  const direction = frame.layoutMode === 'HORIZONTAL' ? 'row' : 'column';
  const gap = stackGapFromFigma(frame.itemSpacing, warnings);
  const align = stackUsesStretch(frame) ? 'stretch' : (STACK_ALIGN_FROM_FIGMA[frame.counterAxisAlignItems] || 'start');
  const justify = STACK_JUSTIFY_FROM_FIGMA[frame.primaryAxisAlignItems] || 'start';

  if (direction !== 'column') props.direction = direction;
  if (gap !== 16) props.gap = gap;
  if (align !== 'stretch') props.align = align;
  if (justify !== 'start') props.justify = justify;
  if (frame.layoutMode === 'HORIZONTAL' && frame.layoutWrap === 'WRAP') props.wrap = true;
  if (typeof frame.layoutGrow === 'number' && frame.layoutGrow > 0) props.grow = true;

  if (hasStackPadding(frame)) {
    warnings.push('Frame padding has no Stack prop and was omitted; wrap the Stack in an Inset when that spacing is intentional.');
  }
  if (frame.layoutWrap === 'WRAP' && figmaNumber(frame.counterAxisSpacing) > 0 && figmaNumber(frame.counterAxisSpacing) !== figmaNumber(frame.itemSpacing)) {
    warnings.push('Figma wrap row spacing differs from item spacing; Stack has one gap value, so item spacing was used.');
  }

  if (ancestors.has(frame.id)) {
    warnings.push('A circular Stack child reference was skipped during export.');
  }
  const childAncestors = new Set(ancestors);
  childAncestors.add(frame.id);
  const children = ancestors.has(frame.id) ? [] : exportFreeContent(frame, warnings, childAncestors);
  return {
    node: {
      id: componentId('Stack', frame),
      type: 'Stack',
      ...(Object.keys(props).length ? { props } : {}),
      ...(children.length ? { children } : {}),
    },
    warnings,
  };
}

function gridGapFromFigma(value, axis, warnings) {
  const gap = stackGapFromFigma(value, warnings);
  if (!STACK_GAPS.includes(value)) {
    warnings[warnings.length - 1] = `${axis}=${value} is not in the A1 Grid spacing scale — nearest A1 gap (${gap}) was exported.`;
  }
  return gap;
}

function gridGapPropFromFigma(value, axis, warnings) {
  const gap = gridGapFromFigma(value, axis, warnings);
  const semantic = Object.entries(STACK_SEMANTIC_GAPS)
    .find(([, semanticValue]) => semanticValue === gap);
  return { value: gap, prop: semantic ? semantic[0] : gap };
}

function gridChildWarnings(frame, warnings) {
  if (frame.gridItemsPositioning && frame.gridItemsPositioning !== 'ROW_AUTO_FLOW') {
    warnings.push('Manual Figma grid placement is not represented by A1 Grid; children were exported in their layer order.');
  }
}

function gridItemSpanPropsFromFigmaChild(child, warnings) {
  const props = {};
  let columnSpan = NaN;
  let rowSpan = NaN;
  try {
    columnSpan = figmaNumber(child && child.gridColumnSpan, NaN);
  } catch (error) {
    if (warnings) warnings.push(`A Grid child span could not be read and was skipped: ${error.message}`);
  }
  try {
    rowSpan = figmaNumber(child && child.gridRowSpan, NaN);
  } catch (error) {
    if (warnings) warnings.push(`A Grid child row span could not be read and was skipped: ${error.message}`);
  }
  if (Number.isInteger(columnSpan) && columnSpan > 1) props.span = columnSpan;
  if (Number.isInteger(rowSpan) && rowSpan > 1) props.rowSpan = rowSpan;
  return props;
}

function gridItemHasSpanProps(props) {
  return props && Object.keys(props).length > 0;
}

function isGridItemBridgeFrame(node) {
  if (!node || typeof node !== 'object') return false;
  try {
    if (typeof node.getSharedPluginData === 'function' &&
      node.getSharedPluginData(DETACHED_COMPONENT_NAMESPACE, DETACHED_COMPONENT_KEY) === 'GridItem') {
      return true;
    }
  } catch {
    // Shared plugin data is an optimization only.
  }
  try {
    return typeof node.getPluginData === 'function' && node.getPluginData('a1-json-type') === 'GridItem';
  } catch {
    return false;
  }
}

function gridSuggestion(frame) {
  const issues = [];
  const fixes = [];
  const rawRowGap = figmaNumber(frame.gridRowGap, NaN);
  const rawColumnGap = figmaNumber(frame.gridColumnGap, NaN);
  const rowGap = nearestStackGap(rawRowGap);
  const columnGap = nearestStackGap(rawColumnGap);
  if (!STACK_GAPS.includes(rawRowGap)) {
    issues.push(`Grid row gap ${frame.gridRowGap} is outside the A1 spacing scale; ${rowGap} is the nearest supported gap.`);
    fixes.push('row gap');
  } else if (gapNeedsVariableBinding(rawRowGap) && !propertyHasBoundVariable(frame, 'gridRowGap')) {
    issues.push(`Grid row gap ${frame.gridRowGap} uses an A1 value but is not bound to a Figma gap variable.`);
    fixes.push('row gap variable');
  }
  if (!STACK_GAPS.includes(rawColumnGap)) {
    issues.push(`Grid column gap ${frame.gridColumnGap} is outside the A1 spacing scale; ${columnGap} is the nearest supported gap.`);
    fixes.push('column gap');
  } else if (gapNeedsVariableBinding(rawColumnGap) && !propertyHasBoundVariable(frame, 'gridColumnGap')) {
    issues.push(`Grid column gap ${frame.gridColumnGap} uses an A1 value but is not bound to a Figma gap variable.`);
    fixes.push('column gap variable');
  }
  return { issues, fixes, rowGap, columnGap };
}

async function applyGridSuggestion(frame, suggestion, warnings) {
  await bindGapProperty(frame, 'gridRowGap', suggestion.rowGap, warnings, 'Grid row gap');
  await bindGapProperty(frame, 'gridColumnGap', suggestion.columnGap, warnings, 'Grid column gap');
}

function syncResponsiveGridColumnsMetadata(frame, columns) {
  const responsiveColumns = normalizeResponsiveColumns(columns);
  if (!frame || !responsiveColumns) return null;
  try {
    frame.setPluginData(GRID_RESPONSIVE_COLUMNS_KEY, JSON.stringify(responsiveColumns));
  } catch {
    // Plugin data is a compatibility backup; the layer name is the visible source.
  }
  try {
    frame.name = responsiveGridName(frame.name || 'Grid', responsiveColumns);
  } catch {
    // Ignore stale or immutable layer names.
  }
  return responsiveColumns;
}

function defineResponsiveGridBreakpoints(frame, columns, sourceWidth, warnings, requestedColumns = null) {
  const count = Number(columns);
  if (!frame || !Number.isInteger(count) || count < 1) return null;
  const widthBreakpoint = breakpointForWidth(sourceWidth, count > 2 ? 'lg' : count > 1 ? 'md' : 'xs');
  const minBreakpoint = count > 2 ? 'lg' : count > 1 ? 'md' : 'xs';
  const minIndex = A1_BREAKPOINTS.indexOf(minBreakpoint);
  const widthIndex = A1_BREAKPOINTS.indexOf(widthBreakpoint);
  const currentBreakpoint = A1_BREAKPOINTS[Math.max(minIndex, widthIndex)] || minBreakpoint;
  const requested = normalizeResponsiveColumns(requestedColumns);
  const existing = requested || readResponsiveGridColumns(frame);
  const responsiveColumns = existing ? { ...existing } : {};
  if (!existing) {
    responsiveColumns.xs = 1;
    if (count > 2) responsiveColumns.md = Math.min(2, count);
  }
  responsiveColumns[currentBreakpoint] = count;
  const normalized = syncResponsiveGridColumnsMetadata(frame, responsiveColumns);
  try {
    frame.setPluginData(A1_BREAKPOINT_KEY, currentBreakpoint);
  } catch {
    // The visible name suffix still carries the responsive contract.
  }
  if (normalized && warnings) {
    warnings.push(`Grid breakpoints were defined as ${formatResponsiveGridColumns(normalized)}. Use Build to create or sync breakpoint frames.`);
  }
  return normalized;
}

function readBreakpointData(node) {
  if (!node) return '';
  try {
    if (node.type === 'INSTANCE') {
      const variantValue = componentPropertyValue(node, 'Breakpoint', 'VARIANT');
      if (A1_BREAKPOINTS.includes(variantValue)) return variantValue;
    }
  } catch {
    // Ignore stale instance handles.
  }
  try {
    if (typeof node.getPluginData === 'function') {
      const localValue = node.getPluginData(A1_BREAKPOINT_KEY);
      if (A1_BREAKPOINTS.includes(localValue)) return localValue;
      const legacyValue = node.getPluginData('a1-breakpoint');
      if (A1_BREAKPOINTS.includes(legacyValue)) return legacyValue;
    }
  } catch {
    // Ignore stale node handles.
  }
  try {
    if (typeof node.getSharedPluginData === 'function') {
      const sharedValue = node.getSharedPluginData(DETACHED_COMPONENT_NAMESPACE, A1_BREAKPOINT_KEY);
      if (A1_BREAKPOINTS.includes(sharedValue)) return sharedValue;
    }
  } catch {
    // Ignore stale node handles.
  }
  try {
    const match = typeof node.name === 'string' && node.name.match(/(?:^|[·\s/-])(xs|sm|md|lg|xl)$/i);
    if (match && A1_BREAKPOINTS.includes(match[1].toLowerCase())) return match[1].toLowerCase();
  } catch {
    // Ignore stale node handles.
  }
  return '';
}

function breakpointForNode(node, fallback = 'xs') {
  if (A1_BREAKPOINTS.includes(activeRenderBreakpoint)) return activeRenderBreakpoint;
  for (let current = node; current; current = current.parent) {
    const breakpoint = readBreakpointData(current);
    if (breakpoint) return breakpoint;
  }
  return A1_BREAKPOINTS.includes(fallback) ? fallback : 'xs';
}

function readResponsiveGridColumns(frame) {
  const nameColumns = parseResponsiveGridColumnsName(frame && frame.name);
  if (nameColumns) return nameColumns;
  try {
    const raw = frame.getPluginData(GRID_RESPONSIVE_COLUMNS_KEY);
    return raw ? normalizeResponsiveColumns(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

function gridWidthMode(frame) {
  return layoutWidthMode(frame);
}

function syncGridWidthMode(frame, widthMode, warnings) {
  syncLayoutWidthMode(frame, widthMode, warnings, 'Grid');
}

function gridHeightMode(frame) {
  return layoutHeightMode(frame);
}

function syncGridHeightMode(frame, heightMode, warnings) {
  syncLayoutHeightMode(frame, heightMode, warnings, 'Grid');
}

function gridExportId(frame) {
  try {
    const jsonId = frame.getPluginData('a1-json-id');
    if (jsonId) return jsonId;
  } catch {
    // Ignore stale grid handles.
  }
  const baseName = stripResponsiveGridColumnsName(frame && frame.name);
  if (baseName && baseName !== 'Grid') return baseName;
  return componentId('Grid', frame);
}

function exportGrid(frame, ancestors = new Set()) {
  const warnings = [];
  const props = {};
  const columns = figmaNumber(frame.gridColumnCount, NaN);
  const rowGap = gridGapPropFromFigma(figmaNumber(frame.gridRowGap, NaN), 'gridRowGap', warnings);
  const columnGap = gridGapPropFromFigma(figmaNumber(frame.gridColumnGap, NaN), 'gridColumnGap', warnings);
  const align = STACK_ALIGN_FROM_FIGMA[frame.counterAxisAlignItems] || 'stretch';

  const responsiveColumns = readResponsiveGridColumns(frame);
  if (responsiveColumns) {
    const breakpoint = breakpointForNode(frame);
    props.columns = { ...responsiveColumns };
    syncResponsiveGridColumnsMetadata(frame, props.columns);
    if (Number.isInteger(columns) && columns > 0 && columns !== responsiveColumnsAt(responsiveColumns, breakpoint)) {
      props.columns[breakpoint] = columns;
      syncResponsiveGridColumnsMetadata(frame, props.columns);
      warnings.push(`Grid columns were exported as a responsive object; the ${breakpoint} preview was updated to ${columns}.`);
    }
  } else if (Number.isInteger(columns) && columns > 0) props.columns = columns;
  else warnings.push('Figma Grid has no valid column count; A1 Grid will use its default columns.');
  if (rowGap.value === columnGap.value) {
    props.gap = rowGap.prop;
  } else {
    props.rowGap = rowGap.prop;
    props.columnGap = columnGap.prop;
  }
  if (align !== 'stretch') props.alignItems = align;
  if (hasStackPadding(frame)) {
    warnings.push('Frame padding has no Grid prop and was omitted; wrap the Grid in an A1 Inset when that spacing is intentional.');
  }
  gridChildWarnings(frame, warnings);

  if (ancestors.has(frame.id)) warnings.push('A circular Grid child reference was skipped during export.');
  const childAncestors = new Set(ancestors);
  childAncestors.add(frame.id);
  const children = ancestors.has(frame.id) ? [] : exportGridChildren(frame, warnings, childAncestors);
  return {
    node: {
      id: gridExportId(frame),
      type: 'Grid',
      ...(Object.keys(props).length ? { props } : {}),
      ...(children.length ? { children } : {}),
    },
    warnings,
  };
}

function exportNodeAsFreeContent(node, warnings, ancestors = new Set()) {
  const exported = [];
  const walk = (current, branchAncestors) => {
    try {
      if (!current) return;
      if (current.id && branchAncestors.has(current.id)) {
        warnings.push(`A circular child reference at "${current.name}" was skipped during export.`);
        return;
      }
      const componentName = registeredSetName(current);
      if (componentName) {
        const result = withBreakpointVisibility(current, EXPORTERS[componentName](current));
        exported.push(result.node);
        warnings.push(...result.warnings);
        return;
      }
      if (current.type === 'INSTANCE' && materialIconNameFromInstance(current)) {
        const result = withBreakpointVisibility(current, exportIcon(current));
        exported.push(result.node);
        warnings.push(...result.warnings);
        return;
      }
      if (current.type === 'TEXT' && isMaterialIconTextNode(current)) {
        const result = withBreakpointVisibility(current, exportIcon(current));
        exported.push(result.node);
        warnings.push(...result.warnings);
        return;
      }
      if (isGridItemBridgeFrame(current) && 'children' in current) {
        const nextAncestors = new Set(branchAncestors);
        if (current.id) nextAncestors.add(current.id);
        for (const child of current.children) walk(child, nextAncestors);
        return;
      }
      if (isStackFrame(current)) {
        const result = withBreakpointVisibility(current, exportStack(current, branchAncestors));
        exported.push(result.node);
        warnings.push(...result.warnings);
        return;
      }
      if (isGridFrame(current)) {
        const result = withBreakpointVisibility(current, exportGrid(current, branchAncestors));
        exported.push(result.node);
        warnings.push(...result.warnings);
        return;
      }
      if (current.type === 'TEXT') {
        const result = withBreakpointVisibility(current, exportTextNode(current));
        exported.push(result.node);
        warnings.push(...result.warnings);
        return;
      }
      if (readBreakpointVisibility(current) && 'children' in current) {
        exported.push(exportBreakpointVisibilityContainer(current, warnings, branchAncestors));
        return;
      }
      if ('children' in current) {
        const nextAncestors = new Set(branchAncestors);
        if (current.id) nextAncestors.add(current.id);
        for (const child of current.children) walk(child, nextAncestors);
      }
    } catch (error) {
      warnings.push(`A child Figma no longer exposes was skipped during export: ${error.message}`);
    }
  };
  walk(node, new Set(ancestors));
  return exported;
}

function exportBreakpointVisibilityContainer(frame, warnings, ancestors = new Set()) {
  const visibility = readBreakpointVisibility(frame);
  const childAncestors = new Set(ancestors);
  if (frame.id) childAncestors.add(frame.id);
  const children = [];
  for (const child of safeChildren(frame)) {
    children.push(...exportNodeAsFreeContent(child, warnings, childAncestors));
  }
  return {
    id: componentId('Stack', frame),
    type: 'Stack',
    ...(visibility ? { visibility } : {}),
    ...(children.length ? { children } : {}),
  };
}

function exportGridChildren(frame, warnings, ancestors = new Set()) {
  const exported = [];
  const parentAncestors = new Set(ancestors);
  if (frame.id) parentAncestors.add(frame.id);
  let children = [];
  try {
    children = frame.children || [];
  } catch (error) {
    warnings.push(`Grid children could not be read during export: ${error.message}`);
    return exported;
  }
  for (const child of children) {
    try {
      const childNodes = exportNodeAsFreeContent(child, warnings, parentAncestors);
      const spanProps = gridItemSpanPropsFromFigmaChild(child, warnings);
      if (gridItemHasSpanProps(spanProps) && childNodes.length > 0) {
        exported.push({
          id: componentId('GridItem', child),
          type: 'GridItem',
          props: spanProps,
          children: childNodes,
        });
      } else {
        exported.push(...childNodes);
      }
    } catch (error) {
      warnings.push(`A Grid child Figma no longer exposes was skipped during export: ${error.message}`);
    }
  }
  return exported;
}

function exportFreeContent(root, warnings, ancestors = new Set()) {
  const exported = [];
  const tabAttachments = [];
  const walk = (node, branchAncestors) => {
    try {
      if (!node) return;
      if (node.id && branchAncestors.has(node.id)) {
        warnings.push(`A circular child reference at "${node.name}" was skipped during export.`);
        return;
      }
      const tabName = tabAttachmentName(node);
      if (tabName) {
        const attachmentWarnings = [];
        tabAttachments.push({
          label: tabName,
          key: tabAttachmentKey(tabName),
          nodeName: node.name || tabName,
          children: exportNodeAsFreeContent(node, attachmentWarnings, branchAncestors),
        });
        warnings.push(...attachmentWarnings);
        return;
      }
      const componentName = registeredSetName(node);
      // A supported instance—or a deliberately detached Banner with editable
      // JSON slot content—owns its implementation layers. Export it as one
      // node before treating generic auto-layout frames as Stacks.
      if (componentName) {
        const result = withBreakpointVisibility(node, EXPORTERS[componentName](node));
        exported.push(result.node);
        warnings.push(...result.warnings);
        return;
      }
      if (node.type === 'INSTANCE' && materialIconNameFromInstance(node)) {
        const result = withBreakpointVisibility(node, exportIcon(node));
        exported.push(result.node);
        warnings.push(...result.warnings);
        return;
      }
      if (node.type === 'TEXT' && isMaterialIconTextNode(node)) {
        const result = withBreakpointVisibility(node, exportIcon(node));
        exported.push(result.node);
        warnings.push(...result.warnings);
        return;
      }
      if (isStackFrame(node)) {
        const result = withBreakpointVisibility(node, exportStack(node, branchAncestors));
        exported.push(result.node);
        warnings.push(...result.warnings);
        return;
      }
      if (isGridFrame(node)) {
        const result = withBreakpointVisibility(node, exportGrid(node, branchAncestors));
        exported.push(result.node);
        warnings.push(...result.warnings);
        return;
      }
      if (node.type === 'TEXT') {
        const result = withBreakpointVisibility(node, exportTextNode(node));
        exported.push(result.node);
        warnings.push(...result.warnings);
        return;
      }
      if (readBreakpointVisibility(node) && 'children' in node) {
        exported.push(exportBreakpointVisibilityContainer(node, warnings, branchAncestors));
        return;
      }
      if ('children' in node) {
        const nextAncestors = new Set(branchAncestors);
        if (node.id) nextAncestors.add(node.id);
        for (const child of node.children) walk(child, nextAncestors);
      }
    } catch (error) {
      warnings.push(`A child Figma no longer exposes was skipped during export: ${error.message}`);
    }
  };
  const liveRoot = liveNode(root);
  if (!liveRoot) {
    warnings.push('A Figma container disappeared during export and was skipped.');
    return exported;
  }
  const rootAncestors = new Set(ancestors);
  if (liveRoot.id) rootAncestors.add(liveRoot.id);
  const rootChildren = safeChildren(liveRoot);
  for (const child of rootChildren) walk(child, rootAncestors);
  const unusedAttachments = attachMarkedTabContent(exported, tabAttachments, warnings);
  for (const attachment of unusedAttachments) exported.push(...attachment.children);
  return exported;
}

function exportContainerNode(root) {
  const warnings = [];
  const children = exportFreeContent(root, warnings);
  if (children.length === 0) warnings.push('This container has no supported A1 instances or standalone text layers to export.');
  const visibility = readBreakpointVisibility(root);
  if (visibility) {
    return {
      node: {
        id: componentId('Stack', root),
        type: 'Stack',
        visibility,
        ...(children.length ? { children } : {}),
      },
      warnings,
    };
  }
  return {
    // A screen selection is an interchange bundle, not an invented layout
    // component. In particular, plain Heading and Paragraph nodes must land on
    // the A1 canvas without a synthetic Section (and its surface/padding).
    node: { nodes: children },
    warnings,
  };
}

function canExportContainer(node, ancestors = new Set()) {
  try {
    if (!node) return false;
    if (isStackFrame(node) || isGridFrame(node)) return true;
    if (!('children' in node)) return false;
    if (node.id && ancestors.has(node.id)) return false;
    const nextAncestors = new Set(ancestors);
    if (node.id) nextAncestors.add(node.id);
    return (node.children || []).some((child) => {
      try {
        return child.type === 'TEXT'
          || isStackFrame(child)
          || isGridFrame(child)
          || (child.type === 'INSTANCE' && Boolean(registeredSetName(child)))
          || (child.type === 'INSTANCE' && Boolean(materialIconNameFromInstance(child)))
          || canExportContainer(child, nextAncestors);
      } catch {
        // Ignore a transient sublayer that Figma removed during this change.
        return false;
      }
    });
  } catch {
    return false;
  }
}

function sectionPropertyCarriers(root) {
  const carriers = [root];
  let descendants = [];
  try {
    descendants = root.findAll((node) => node.type === 'INSTANCE');
  } catch {
    return carriers;
  }
  for (const instanceNode of descendants) {
    if (registeredSetName(instanceNode)) continue;
    try {
      // Force Figma to resolve the handle now. Replaced internal sublayers can
      // remain in findAll results for one document-change turn.
      void instanceNode.componentProperties;
      carriers.push(instanceNode);
    } catch {
      // The current Section root is enough; omit a stale internal carrier.
    }
  }
  return carriers;
}

// Find a component property by canonical name across the carriers. Returns
// { node, key, property } with the original key, usable with setProperties.
function findSectionProperty(carriers, names, type) {
  for (const node of carriers) {
    let raw;
    try {
      raw = node.componentProperties || {};
    } catch {
      continue;
    }
    for (const key of Object.keys(raw)) {
      if (!names.includes(canonicalKey(key))) continue;
      if (type && raw[key].type !== type) continue;
      return { node, key, property: raw[key] };
    }
  }
  return null;
}

// Set a variant property wherever it lives (outer set or an internal part —
// nested instance properties are settable as overrides).
function assignSectionVariant(carriers, names, value) {
  const found = findSectionProperty(carriers, names, 'VARIANT');
  if (!found) return false;
  try {
    found.node.setProperties({ [found.key]: value });
    return true;
  } catch (error) {
    return false;
  }
}

// ─── Export: Figma instance → page-definition node ──────────────────────────

function stripButtonFullWidthName(name) {
  return String(name || '').replace(BUTTON_FULL_WIDTH_NAME_PATTERN, '').trim();
}

function buttonNameWithFullWidthMetadata(name, fullWidth) {
  const base = stripButtonFullWidthName(name) || 'Button';
  return fullWidth ? `${base} - {fullWidth:true}` : base;
}

function buttonFullWidthFromName(name) {
  const match = String(name || '').match(BUTTON_FULL_WIDTH_NAME_PATTERN);
  return Boolean(match && match[1].toLowerCase() === 'true');
}

function buttonWidthMode(instance) {
  if (buttonFullWidthFromName(instance && instance.name)) return 'fill';
  try {
    return instance.layoutSizingHorizontal === 'FILL' ? 'fill' : 'hug';
  } catch {
    return 'hug';
  }
}

function syncButtonFullWidthMetadata(instance, widthMode, warnings) {
  const fullWidth = widthMode === 'fill';
  try {
    instance.name = buttonNameWithFullWidthMetadata(instance.name, fullWidth);
  } catch (error) {
    if (warnings) warnings.push(`Button fullWidth metadata could not be written to the layer name: ${error.message}`);
  }
  syncLayoutWidthMode(instance, fullWidth ? 'fill' : 'hug', warnings || [], 'Button');
}

function exportButton(instance) {
  const properties = readProperties(instance);
  const warnings = [];
  const state = properties.State && properties.State.value;
  const showIcon = properties['Show icon'] &&
    (properties['Show icon'].value === true || properties['Show icon'].value === 'true');
  let iconName = '';

  if (VISUAL_ONLY_STATES.includes(state)) {
    warnings.push(`State=${state} is a visual-only Figma state — no prop was emitted.`);
  }
  if (showIcon) {
    iconName = iconNameFromInstance(instance, 'Icon') ||
      iconNameFromEditableText(instance) ||
      iconNameFromSwapValue(iconSwapPropertyValue(instance) || (properties.Icon && properties.Icon.value));
    if (!iconName) {
      warnings.push('The icon instance could not be resolved to a component name — icon omitted.');
    }
  }

  const label = properties.Label && typeof properties.Label.value === 'string'
    ? properties.Label.value
    : 'Button';

  const node = buttonNodeFromFigma({
    id: instance.id,
    properties,
    label,
    iconName,
    fullWidth: buttonFullWidthFromName(instance.name),
  });
  applyActionTriggerAction(instance, node);
  return { node, warnings };
}

function buttonContextForSelection(instance) {
  const properties = readProperties(instance);
  const variant = properties.Variant && properties.Variant.value;
  const size = properties.Size && properties.Size.value;
  const state = properties.State && properties.State.value;
  const iconPosition = properties.IconPosition && properties.IconPosition.value;
  const showIcon = properties['Show icon'] &&
    (properties['Show icon'].value === true || properties['Show icon'].value === 'true');
  const label = properties.Label && typeof properties.Label.value === 'string'
    ? properties.Label.value
    : 'Button';
  const icon = iconNameFromInstance(instance, 'Icon') ||
    iconNameFromEditableText(instance) ||
    iconNameFromSwapValue(iconSwapPropertyValue(instance) || (properties.Icon && properties.Icon.value)) ||
    '';

  return {
    label,
    variant: BUTTON_VARIANTS.includes(variant) ? variant : 'primary',
    variantOptions: BUTTON_VARIANTS,
    size: BUTTON_SIZES.includes(size) ? size : 'md',
    sizeOptions: BUTTON_SIZES,
    state: BUTTON_CONTEXT_STATES.includes(state) ? state : 'default',
    stateOptions: BUTTON_CONTEXT_STATES,
    iconMode: showIcon ? 'show' : 'hide',
    iconModeOptions: BUTTON_CONTEXT_ICON_MODES,
    iconPosition: iconPosition === 'end' ? 'end' : 'start',
    iconPositionOptions: ['start', 'end'],
    widthMode: buttonWidthMode(instance),
    widthModeOptions: BUTTON_CONTEXT_WIDTH_MODES,
    icon,
    dialog: actionTriggerContext(instance, 'Dialog'),
    menu: actionTriggerContext(instance, 'Menu'),
  };
}

function actionTriggerTargetRecord(trigger) {
  try {
    if (!trigger || typeof trigger.getPluginData !== 'function') return '';
    const raw = trigger.getPluginData(ACTION_TRIGGER_TARGET_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        ACTION_TRIGGER_TARGET_TYPES.has(parsed.targetType) &&
        typeof parsed.nodeId === 'string' &&
        parsed.nodeId
      ) {
        return { targetType: parsed.targetType, nodeId: parsed.nodeId };
      }
    }
    const legacyDialog = trigger.getPluginData(DIALOG_TRIGGER_TARGET_KEY) ||
      trigger.getPluginData(LEGACY_BUTTON_DIALOG_TARGET_KEY);
    return typeof legacyDialog === 'string' && legacyDialog
      ? { targetType: 'Dialog', nodeId: legacyDialog }
      : manualActionTriggerTargetRecord(trigger);
  } catch {
    return manualActionTriggerTargetRecord(trigger);
  }
}

function actionTriggerTargetNodeId(trigger, targetType = '') {
  const record = actionTriggerTargetRecord(trigger);
  return record && (!targetType || record.targetType === targetType) ? record.nodeId : '';
}

function actionTriggerComponentName(trigger) {
  try {
    return trigger && trigger.type === 'INSTANCE' ? registeredSetName(trigger) : '';
  } catch {
    return '';
  }
}

function supportsActionTrigger(trigger) {
  return ACTION_TRIGGER_COMPONENT_NAMES.has(actionTriggerComponentName(trigger));
}

function actionTargetOptionLabel(target, index, targetType) {
  const title = componentText(target, targetType === 'Dialog' ? 'Title' : 'Label', '').trim();
  const name = typeof target.name === 'string' && target.name.trim() ? stripActionTriggerNameMetadata(target.name) : '';
  return title || name || `${targetType} ${index + 1}`;
}

function stripActionTriggerNameMetadata(name) {
  return String(name || '').replace(ACTION_TRIGGER_NAME_PATTERN, '').trim();
}

function actionTriggerNameMetadata(name) {
  const match = String(name || '').match(ACTION_TRIGGER_NAME_PATTERN);
  return match ? match[1].trim() : '';
}

function actionTargetNameWithTriggerMetadata(name, triggerName) {
  const base = stripActionTriggerNameMetadata(name);
  const trigger = String(triggerName || '').trim();
  return trigger ? `${base || 'Action target'} {trigger=${trigger}}` : base;
}

function normalizedActionTriggerName(value) {
  return canonicalKey(stripActionTriggerNameMetadata(value));
}

function actionTriggerDisplayNameFromSource(source) {
  if (!source || typeof source !== 'object') return '';
  const props = source.props && typeof source.props === 'object' ? source.props : {};
  if (typeof props.label === 'string' && props.label.trim()) return props.label.trim();
  if (source.content && typeof source.content === 'object' && typeof source.content.fallback === 'string' && source.content.fallback.trim()) {
    return source.content.fallback.trim();
  }
  if (typeof source.label === 'string' && source.label.trim()) return source.label.trim();
  if (typeof source.id === 'string' && source.id.trim()) return source.id.trim();
  if (typeof source.type === 'string' && source.type.trim()) return source.type.trim();
  return '';
}

function actionTriggerDisplayNameFromInstance(trigger) {
  try {
    const jsonId = trigger && typeof trigger.getPluginData === 'function' ? trigger.getPluginData('a1-json-id') : '';
    if (jsonId) return jsonId;
    const componentName = actionTriggerComponentName(trigger);
    const label = componentName === 'Button'
      ? componentText(trigger, 'Label', '')
      : componentName === 'Icon Button'
        ? componentText(trigger, 'Aria label', '')
        : '';
    if (label && label.trim()) return label.trim();
    return stripActionTriggerNameMetadata(trigger && trigger.name) || componentName || 'Trigger';
  } catch {
    return 'Trigger';
  }
}

function actionTriggerMatchNames(trigger) {
  const names = [];
  try {
    const componentName = actionTriggerComponentName(trigger);
    const jsonId = trigger && typeof trigger.getPluginData === 'function' ? trigger.getPluginData('a1-json-id') : '';
    if (jsonId) names.push(jsonId);
    if (componentName) names.push(componentId(componentName, trigger));
    if (trigger && typeof trigger.name === 'string') names.push(trigger.name);
    if (componentName === 'Button') names.push(componentText(trigger, 'Label', ''));
    if (componentName === 'Icon Button') names.push(componentText(trigger, 'Aria label', ''));
  } catch {
    // A manual metadata fallback is best-effort only.
  }
  return [...new Set(names.map(normalizedActionTriggerName).filter(Boolean))];
}

function manualActionTriggerTargetRecord(trigger) {
  const matchNames = actionTriggerMatchNames(trigger);
  if (matchNames.length === 0) return null;
  for (const targetType of ACTION_TRIGGER_TARGET_TYPES) {
    for (const target of actionTargetInstancesOnPage(targetType)) {
      const metadata = actionTriggerNameMetadata(target && target.name);
      if (metadata && matchNames.includes(normalizedActionTriggerName(metadata))) {
        return { targetType, nodeId: target.id };
      }
    }
  }
  return null;
}

function actionTargetInstancesOnPage(targetType) {
  try {
    return figma.currentPage.findAll((node) => {
      try {
        return node.type === 'INSTANCE' && registeredSetName(node) === targetType;
      } catch {
        return false;
      }
    });
  } catch {
    return [];
  }
}

function linkedActionTargetForTrigger(trigger, targetType = '') {
  const record = actionTriggerTargetRecord(trigger);
  if (!record || (targetType && record.targetType !== targetType)) return null;
  const targetNodeId = record.nodeId;
  if (!targetNodeId) return null;
  try {
    const target = liveNode(resolveNodeById(targetNodeId));
    return target && target.type === 'INSTANCE' && registeredSetName(target) === record.targetType
      ? target
      : null;
  } catch {
    return null;
  }
}

function actionTriggerContext(trigger, targetType) {
  const targets = actionTargetInstancesOnPage(targetType);
  const linked = linkedActionTargetForTrigger(trigger, targetType);
  const linkedId = linked ? linked.id : '';
  const linkedIndex = linked ? targets.findIndex((target) => target.id === linked.id) : -1;
  const options = targets.map((target, index) => ({
    nodeId: target.id,
    jsonId: componentId(targetType, target),
    label: actionTargetOptionLabel(target, index, targetType),
  }));
  return {
    targetNodeId: linkedId,
    targetJsonId: linked ? componentId(targetType, linked) : '',
    targetLabel: linked ? actionTargetOptionLabel(linked, linkedIndex, targetType) : '',
    options,
  };
}

function setActionTriggerTarget(trigger, targetType, targetNodeId) {
  try {
    const value = typeof targetNodeId === 'string' ? targetNodeId : '';
    if (value && ACTION_TRIGGER_TARGET_TYPES.has(targetType)) {
      trigger.setPluginData(ACTION_TRIGGER_TARGET_KEY, JSON.stringify({ targetType, nodeId: value }));
    } else if (actionTriggerTargetRecord(trigger)?.targetType === targetType) {
      trigger.setPluginData(ACTION_TRIGGER_TARGET_KEY, '');
    }
    trigger.setPluginData(DIALOG_TRIGGER_TARGET_KEY, '');
    trigger.setPluginData(LEGACY_BUTTON_DIALOG_TARGET_KEY, '');
  } catch {
    // Non-fatal: the visual trigger still exists; the relationship just cannot persist.
  }
}

function syncActionTargetTriggerNameMetadata(target, trigger) {
  try {
    if (!target || !trigger || typeof target.name !== 'string') return;
    target.name = actionTargetNameWithTriggerMetadata(target.name, actionTriggerDisplayNameFromInstance(trigger));
  } catch {
    // The saved plugin relationship is the source of truth; layer-name metadata is a manual affordance.
  }
}

function actionForLinkedTarget(trigger, exportedTargetNode = null) {
  const record = actionTriggerTargetRecord(trigger);
  if (!record) return null;
  const config = ACTION_TRIGGER_TARGET_CONFIG[record.targetType];
  if (!config) return null;
  if (exportedTargetNode && typeof exportedTargetNode.id === 'string') {
    return { type: config.actionType, target: exportedTargetNode.id };
  }
  const target = linkedActionTargetForTrigger(trigger, record.targetType);
  return target ? { type: config.actionType, target: componentId(record.targetType, target) } : null;
}

function applyActionTriggerAction(trigger, node) {
  const action = actionForLinkedTarget(trigger);
  if (!action || !node) return node;
  node.actions = {
    ...(node.actions || {}),
    onClick: action,
  };
  return node;
}

function nodeWithLinkedActionTargetExport(trigger, triggerNode, warnings) {
  const componentName = actionTriggerComponentName(trigger) || 'Component';
  const record = actionTriggerTargetRecord(trigger);
  if (!record) return triggerNode;
  const linkedTarget = linkedActionTargetForTrigger(trigger, record.targetType);
  if (!linkedTarget) {
    if (actionTriggerTargetNodeId(trigger)) warnings.push(`The ${componentName} has a saved ${record.targetType} link, but that ${record.targetType} no longer exists.`);
    return triggerNode;
  }
  const exporter = EXPORTERS[record.targetType];
  if (typeof exporter !== 'function') {
    warnings.push(`${record.targetType} cannot be exported as an action target yet.`);
    return triggerNode;
  }
  const targetResult = withBreakpointVisibility(linkedTarget, exporter(linkedTarget));
  warnings.push(...targetResult.warnings);
  const action = actionForLinkedTarget(trigger, targetResult.node);
  if (!action) return triggerNode;
  const linkedTrigger = {
    ...triggerNode,
    actions: {
      ...(triggerNode.actions || {}),
      onClick: action,
    },
  };
  warnings.push(`${componentName} is linked to ${record.targetType} "${actionTargetOptionLabel(linkedTarget, 0, record.targetType)}"; exported both nodes with a ${action.type} action.`);
  return {
    id: componentId('Stack', `${trigger.id}-${record.targetType.toLowerCase()}-link`),
    type: 'Stack',
    props: { gap: 'md' },
    children: [linkedTrigger, targetResult.node],
  };
}

function collectNodeIds(node, ids = new Set()) {
  if (!node || typeof node !== 'object') return ids;
  if (typeof node.id === 'string' && node.id) ids.add(node.id);
  for (const key of ['children', 'nodes', 'regions']) {
    if (Array.isArray(node[key])) node[key].forEach((child) => collectNodeIds(child, ids));
  }
  collectNodeIds(node.page, ids);
  collectNodeIds(node.layout, ids);
  return ids;
}

function collectOpenActionTargets(node, targets = new Map()) {
  if (Array.isArray(node)) {
    node.forEach((child) => collectOpenActionTargets(child, targets));
    return targets;
  }
  if (!node || typeof node !== 'object') return targets;
  const actions = node.actions && typeof node.actions === 'object' ? node.actions : null;
  const clickActions = [
    actions && actions.onClick && typeof actions.onClick === 'object' ? actions.onClick : null,
    node.action && typeof node.action === 'object' ? node.action : null,
  ].filter(Boolean);
  for (const action of clickActions) {
    if (ACTION_TRIGGER_TYPE_BY_ACTION[action.type] && typeof action.target === 'string' && action.target) {
      targets.set(action.target, ACTION_TRIGGER_TYPE_BY_ACTION[action.type]);
    }
  }
  for (const key of ['children', 'nodes', 'regions', 'props', 'actions']) {
    collectOpenActionTargets(node[key], targets);
  }
  collectOpenActionTargets(node.page, targets);
  collectOpenActionTargets(node.layout, targets);
  return targets;
}

function appendLinkedActionTargetNode(rootNode, targetNode) {
  if (!rootNode || !targetNode) return rootNode;
  const pageRegions = rootNode.page && rootNode.page.layout && rootNode.page.layout.regions;
  if (Array.isArray(pageRegions) && pageRegions[0] && Array.isArray(pageRegions[0].nodes)) {
    pageRegions[0].nodes.push(targetNode);
    return rootNode;
  }
  const layoutRegions = rootNode.layout && rootNode.layout.regions;
  if (Array.isArray(layoutRegions) && layoutRegions[0] && Array.isArray(layoutRegions[0].nodes)) {
    layoutRegions[0].nodes.push(targetNode);
    return rootNode;
  }
  if (Array.isArray(rootNode.regions) && rootNode.regions[0] && Array.isArray(rootNode.regions[0].nodes)) {
    rootNode.regions[0].nodes.push(targetNode);
    return rootNode;
  }
  if (Array.isArray(rootNode.nodes)) {
    rootNode.nodes.push(targetNode);
    return rootNode;
  }
  if (Array.isArray(rootNode.children) && rootNode.type !== 'TopHeader') {
    rootNode.children.push(targetNode);
    return rootNode;
  }
  return {
    id: componentId('Stack', `${rootNode.id || 'root'}-action-targets`),
    type: 'Stack',
    props: { gap: 'md' },
    children: [rootNode, targetNode],
  };
}

function includeOpenActionTargets(rootNode, warnings) {
  const targets = collectOpenActionTargets(rootNode);
  if (targets.size === 0) return rootNode;
  const existingIds = collectNodeIds(rootNode);
  let outputNode = rootNode;
  for (const [targetId, targetType] of targets.entries()) {
    if (existingIds.has(targetId)) continue;
    const target = actionTargetInstancesOnPage(targetType)
      .find((candidate) => componentId(targetType, candidate) === targetId);
    if (!target) {
      warnings.push(`An action targets ${targetType} "${targetId}", but that ${targetType} was not found on this Figma page.`);
      continue;
    }
    const exporter = EXPORTERS[targetType];
    if (typeof exporter !== 'function') {
      warnings.push(`${targetType} cannot be exported as an action target yet.`);
      continue;
    }
    const result = withBreakpointVisibility(target, exporter(target));
    warnings.push(...result.warnings);
    outputNode = appendLinkedActionTargetNode(outputNode, result.node);
    collectNodeIds(outputNode, existingIds);
    warnings.push(`Included linked ${targetType} "${actionTargetOptionLabel(target, 0, targetType)}" for open action.`);
  }
  return outputNode;
}

function exportIconButton(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};
  const variant = componentPropertyValue(instance, 'Variant', 'VARIANT');
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  const iconName = iconNameFromInstance(instance, 'Icon') ||
    iconNameFromEditableText(instance) ||
    iconNameFromSwapValue(iconSwapPropertyValue(instance));

  if (ICON_BUTTON_VARIANTS.includes(variant) && variant !== 'tertiary') props.variant = variant;
  if (ICON_BUTTON_SIZES.includes(size) && size !== 'md') props.size = size;
  if (iconName) props.icon = iconName;
  else {
    // The library asset's visible default is Material Symbols "star". Retain
    // that known visual fallback so the required React icon prop is never
    // omitted from an otherwise valid exported IconButton node.
    props.icon = 'star';
    warnings.push('Icon Button icon could not be resolved; exported the visible default Material icon "star".');
  }

  const label = componentText(instance, 'Aria label', 'Icon button');
  const node = {
    id: componentId('IconButton', instance),
    type: 'IconButton',
    props: { ...props, label },
  };
  applyActionTriggerAction(instance, node);
  return { node, warnings };
}

function iconButtonContextForSelection(instance) {
  instance = currentInstance(instance);
  const variant = componentPropertyValue(instance, 'Variant', 'VARIANT');
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  const icon = iconNameFromInstance(instance, 'Icon') ||
    iconNameFromEditableText(instance) ||
    iconNameFromSwapValue(iconSwapPropertyValue(instance)) ||
    'star';
  return {
    label: componentText(instance, 'Aria label', 'Icon button'),
    variant: ICON_BUTTON_VARIANTS.includes(variant) ? variant : 'tertiary',
    variantOptions: ICON_BUTTON_VARIANTS,
    size: ICON_BUTTON_SIZES.includes(size) ? size : 'md',
    sizeOptions: ICON_BUTTON_SIZES,
    icon,
    dialog: actionTriggerContext(instance, 'Dialog'),
    menu: actionTriggerContext(instance, 'Menu'),
  };
}

function exportLink(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  const weight = componentPropertyValue(instance, 'Weight', 'VARIANT');
  const iconPosition = componentPropertyValue(instance, 'Icon position', 'VARIANT');
  const showIcon = componentPropertyValue(instance, 'Show icon', 'BOOLEAN');

  if (LINK_SIZES.includes(size)) props.size = size;
  if (LINK_WEIGHTS.includes(weight)) props.weight = weight;
  if (showIcon === true) {
    const iconName = iconNameFromInstance(instance, 'Icon') || iconNameFromEditableText(instance) || iconNameFromSwapValue(iconSwapPropertyValue(instance));
    if (iconName) {
      props.icon = iconName;
      if (iconPosition === 'end') props.iconPosition = 'end';
    } else {
      warnings.push('Link icon is visible but its Material icon component could not be resolved.');
    }
  }

  const label = componentText(instance, 'Label', 'Link');
  return {
    node: {
      id: componentId('Link', instance),
      type: 'Link',
      ...(Object.keys(props).length ? { props } : {}),
      content: { fallback: label },
    },
    warnings,
  };
}

function linkContextForSelection(instance) {
  instance = currentInstance(instance);
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  const weight = componentPropertyValue(instance, 'Weight', 'VARIANT');
  const rawIconPosition = componentPropertyValue(instance, 'Icon position', 'VARIANT');
  const showIcon = componentPropertyValue(instance, 'Show icon', 'BOOLEAN') === true;
  const icon = iconNameFromInstance(instance, 'Icon') || iconNameFromEditableText(instance) || iconNameFromSwapValue(iconSwapPropertyValue(instance)) || '';
  return {
    label: componentText(instance, 'Label', 'Link'),
    size: LINK_SIZES.includes(size) ? size : 'md',
    sizeOptions: LINK_SIZES,
    weight: LINK_WEIGHTS.includes(weight) ? weight : 'normal',
    weightOptions: LINK_WEIGHTS,
    iconPosition: showIcon ? (rawIconPosition === 'end' ? 'end' : 'start') : 'none',
    iconPositionOptions: ['none', ...LINK_ICON_POSITIONS],
    icon,
  };
}

// Slot and component-content helpers are defined in src/figma/slots.js.
function normalizeCardSurface(value) {
  const normalized = typeof value === 'string' ? value.toLowerCase() : '';
  return CARD_SURFACES.includes(normalized) ? normalized : 'default';
}

function figmaCardSurface(value) {
  return normalizeCardSurface(value) === 'accent' ? 'Accent' : 'default';
}

function normalizeCardVariant(props = {}) {
  if (props.bare === true) return 'bare';
  return props.variant === 'navigation' ? 'navigation' : 'default';
}

function normalizeCardVariantValue(value) {
  const normalized = typeof value === 'string' ? value.toLowerCase() : '';
  if (normalized === 'navigation') return 'navigation';
  if (normalized === 'bare') return 'bare';
  return 'default';
}

function figmaCardVariant(value) {
  const normalized = normalizeCardVariantValue(value);
  if (normalized === 'navigation') return 'Navigation';
  if (normalized === 'bare') return 'Bare';
  return 'Default';
}

function cardIconInstance(instance) {
  const root = liveNode(currentInstance(instance));
  if (!root || !('children' in root)) return null;
  const queue = [...stackFlowChildren(root)];
  const visited = new Set();
  while (queue.length) {
    const candidate = liveNode(queue.shift());
    if (!candidate || visited.has(candidate.id)) continue;
    visited.add(candidate.id);
    try {
      if (candidate.type === 'INSTANCE' && componentSetName(candidate) === 'Card Icon') return candidate;
      if ('children' in candidate) queue.push(...stackFlowChildren(candidate));
    } catch {
      // Ignore stale native proxies; Card can replace its nested icon instance
      // while the plugin is reading selection state.
    }
  }
  return null;
}

function cardIconPositionForWidth(instance) {
  const width = Number(instance && instance.width);
  return Number.isFinite(width) && width >= CARD_ICON_START_MIN_WIDTH ? 'start' : 'top';
}

function syncCardIconPositionForWidth(instance, warnings = []) {
  let current = currentInstance(instance);
  if (!current || current.type !== 'INSTANCE') return current;
  if (componentPropertyValue(current, 'Show icon', 'BOOLEAN') !== true) return current;

  const cardPosition = cardIconPositionForWidth(current);
  const iconPosition = cardPosition === 'start' ? 'left' : 'top';
  const cardAssignments = {};
  const currentCardPosition = componentPropertyValue(current, 'iconPosition', 'VARIANT');
  if (currentCardPosition !== cardPosition) {
    queueComponentProperty(current, cardAssignments, 'iconPosition', cardPosition, 'VARIANT', warnings, 'Card icon position');
    applyQueuedProperties(current, cardAssignments, warnings, 'Card icon position');
    current = currentInstance(current);
  }

  const iconInstance = cardIconInstance(current);
  if (iconInstance && componentPropertyValue(iconInstance, 'position', 'VARIANT') !== iconPosition) {
    const iconAssignments = {};
    queueComponentProperty(iconInstance, iconAssignments, 'position', iconPosition, 'VARIANT', warnings, 'Card nested icon position');
    applyQueuedProperties(iconInstance, iconAssignments, warnings, 'Card nested icon position');
    current = currentInstance(current);
  }
  return current;
}

function exportCard(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};
  instance = syncCardIconPositionForWidth(instance, warnings);
  const surface = normalizeCardSurface(componentPropertyValue(instance, 'Surface', 'VARIANT'));
  if (CARD_SURFACES.includes(surface) && surface !== 'default') props.surface = surface;
  const variant = normalizeCardVariantValue(componentPropertyValue(instance, 'Variant', 'VARIANT'));
  if (variant === 'navigation') props.variant = 'navigation';
  if (variant === 'bare') props.bare = true;
  const showIcon = componentPropertyValue(instance, 'Show icon', 'BOOLEAN');
  if (showIcon === true) {
    const iconInstance = cardIconInstance(instance);
    const iconName = iconNameFromInstance(iconInstance || instance) ||
      iconNameFromEditableText(iconInstance || instance) ||
      iconNameFromSwapValue(iconSwapPropertyValue(iconInstance || instance)) ||
      iconNameFromSwapValue(iconSwapPropertyValue(instance));
    if (iconName) props.icon = iconName;
    else warnings.push('Card icon is visible but its swapped icon component could not be resolved.');
    const iconType = componentPropertyValue(iconInstance || instance, 'Type', 'VARIANT');
    const iconDisplay = iconType === 'Hero' ? 'hero' : 'default';
    if (iconDisplay !== 'default') props.iconDisplay = iconDisplay;
    if (iconDisplay === 'hero') {
      const heroColor = normalizeCardHeroColor(componentPropertyValue(iconInstance || instance, 'Color', 'VARIANT'));
      if (heroColor !== 'action') props.heroColor = heroColor;
    }
  }
  const slot = namedSlot(instance, 'Content Slot');
  const children = slot ? exportFreeContent(slot, warnings) : [];
  if (!slot) warnings.push('Card Content Slot was not found — children were not exported.');
  const node = { id: componentId('Card', instance), type: 'Card' };
  if (Object.keys(props).length > 0) node.props = props;
  if (children.length > 0) node.children = children;
  return { node, warnings };
}
function cardContextForSelection(instance) {
  instance = currentInstance(instance);
  instance = syncCardIconPositionForWidth(instance, []);
  const surface = normalizeCardSurface(componentPropertyValue(instance, 'Surface', 'VARIANT'));
  const variant = normalizeCardVariantValue(componentPropertyValue(instance, 'Variant', 'VARIANT'));
  const showIcon = componentPropertyValue(instance, 'Show icon', 'BOOLEAN');
  const iconInstance = cardIconInstance(instance);
  const iconType = componentPropertyValue(iconInstance || instance, 'Type', 'VARIANT');
  const iconDisplay = showIcon === true
    ? iconType === 'Hero' ? 'hero' : 'default'
    : 'none';
  const icon = iconNameFromInstance(iconInstance || instance) ||
    iconNameFromEditableText(iconInstance || instance) ||
    iconNameFromSwapValue(iconSwapPropertyValue(iconInstance || instance)) ||
    iconNameFromSwapValue(iconSwapPropertyValue(instance))
    || '';
  return {
    surface,
    surfaceOptions: CARD_SURFACES,
    variant,
    variantOptions: CARD_VARIANTS,
    iconDisplay,
    iconDisplayOptions: CARD_ICON_DISPLAYS,
    heroColor: normalizeCardHeroColor(componentPropertyValue(iconInstance || instance, 'Color', 'VARIANT')),
    heroColorOptions: CARD_HERO_COLORS,
    widthMode: layoutWidthMode(instance),
    heightMode: layoutHeightMode(instance),
    icon,
  };
}

function detachedBannerProps(node) {
  try {
    const raw = node.getSharedPluginData(DETACHED_COMPONENT_NAMESPACE, DETACHED_BANNER_PROPS_KEY);
    const value = raw ? JSON.parse(raw) : null;
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
}

function namedTextLayerValue(root, name, fallback = '') {
  try {
    const text = root.findOne((node) => node.type === 'TEXT' && node.name === name);
    return text && typeof text.characters === 'string' ? text.characters : fallback;
  } catch {
    return fallback;
  }
}

function namedTextLayerValueAny(root, names, fallback = '') {
  const wanted = new Set((names || []).map((name) => canonicalKey(name)));
  try {
    const text = root.findOne((node) =>
      node.type === 'TEXT'
      && node.visible !== false
      && wanted.has(canonicalKey(node.name || '')));
    return text && typeof text.characters === 'string' ? text.characters : fallback;
  } catch {
    return fallback;
  }
}

function exportBanner(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};
  const detached = instance.type !== 'INSTANCE';
  const savedProps = detached ? detachedBannerProps(instance) : {};
  const variant = detached ? (savedProps.variant || 'inline') : componentPropertyValue(instance, 'Variant', 'VARIANT');
  const status = detached ? (savedProps.status || 'neutral') : componentPropertyValue(instance, 'Status', 'VARIANT');
  if (BANNER_VARIANTS.includes(variant) && variant !== 'inline') props.variant = variant;
  if (BANNER_STATUSES.includes(status) && status !== 'neutral') props.status = status;

  if (variant !== 'calendar') {
    const defaultIcon = BANNER_DEFAULT_ICONS[BANNER_STATUSES.includes(status) ? status : 'neutral'];
    const iconName = iconNameFromInstance(instance, 'Status Icon')
      || iconNameFromSwapValue(iconSwapPropertyValue(instance));
    if (iconName && iconName !== defaultIcon) props.icon = iconName;
  }

  const title = (detached ? namedTextLayerValue(instance, 'Title', savedProps.title || '') : componentText(instance, 'Title', '')).trim();
  if (title) props.title = title;

  if (variant === 'calendar') {
    const eyebrow = (detached ? namedTextLayerValue(instance, 'Eyebrow', savedProps.eyebrow || '') : componentText(instance, 'Eyebrow', '')).trim();
    const savedDate = savedProps.date && typeof savedProps.date === 'object' ? savedProps.date : {};
    const month = (detached ? namedTextLayerValue(instance, 'Month', savedDate.month || '') : componentText(instance, 'Month', '')).trim();
    const day = (detached ? namedTextLayerValue(instance, 'Day', savedDate.day || '') : componentText(instance, 'Day', '')).trim();
    if (eyebrow) props.eyebrow = eyebrow;
    if (month || day) props.date = { ...(month ? { month } : {}), ...(day ? { day } : {}) };
  }

  const slot = namedSlot(instance, 'Content Slot');
  const children = slot ? exportFreeContent(slot, warnings) : [];
  if (!slot) warnings.push('Banner Content Slot was not found — children were not exported.');
  const node = { id: componentId('Banner', instance), type: 'Banner' };
  if (Object.keys(props).length > 0) node.props = props;
  if (children.length > 0) node.children = children;
  return { node, warnings };
}

function exportFigure(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = { src: componentText(instance, 'Source', '') };
  const alt = componentText(instance, 'Alt', '');
  const caption = componentText(instance, 'Caption', '');
  const showCaption = componentBoolean(instance, 'Show caption', true);
  if (alt) props.alt = alt;
  if (caption && showCaption) props.caption = caption;
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  const aspectRatio = componentPropertyValue(instance, 'Aspect ratio', 'VARIANT');
  // Preserve the explicitly selected compact Figure size as JSON. Omitting
  // `sm` makes the playground treat it as an unconstrained Figure instead of
  // retaining the Figma component's selected max-width.
  if (FIGURE_SIZES.includes(size)) props.size = size;
  if (FIGURE_ASPECT_RATIOS.includes(aspectRatio) && aspectRatio !== '16:9') props.aspectRatio = aspectRatio;
  return { node: { id: componentId('Figure', instance), type: 'Figure', props }, warnings };
}

function definitionItemText(value, fallback = '') {
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (value && typeof value === 'object' && typeof value.fallback === 'string') return value.fallback;
  return fallback;
}

function definitionItemFromFigma(item, index, warnings) {
  try {
    if (item.type === 'INSTANCE' && componentSetName(item) === 'Definition List Item') {
      const liveItem = currentInstance(item);
      const label = componentText(liveItem, 'Label', '');
      const value = componentText(liveItem, 'Value', '');
      if (label || value) {
        return {
          id: `definition-item-${liveItem.id.replace(/[^a-zA-Z0-9]+/g, '-')}`,
          label,
          value,
        };
      }
    }
    // Keep legacy frame rows readable after the new item component ships.
    const label = item.findOne((node) => node.type === 'TEXT' && canonicalKey(node.name) === 'label');
    const value = item.findOne((node) => node.type === 'TEXT' && canonicalKey(node.name) === 'value');
    if (label && value) {
      return {
        id: `definition-item-${item.id.replace(/[^a-zA-Z0-9]+/g, '-')}`,
        label: label.characters,
        value: value.characters,
      };
    }
  } catch {
    // A Figma instance replacement can briefly invalidate a slot child. The
    // outer export continues and reports the omitted row below.
  }
  warnings.push(`Definition item ${index + 1} is missing a Label or Value and was skipped.`);
  return null;
}

function exportDefinitionList(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};
  const direction = componentPropertyValue(instance, 'Direction', 'VARIANT');
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  if (DEFINITION_LIST_DIRECTIONS.includes(direction) && direction !== 'row') props.direction = direction;
  // Keep the explicit Figma choice, including the React default, so a designer's
  // selected size round-trips predictably through the bridge.
  if (DEFINITION_LIST_SIZES.includes(size)) props.size = size;
  const slot = namedSlot(instance, 'Items Slot');
  const items = slot
    ? slot.children.filter((child) => {
      try {
        return child.visible !== false && (
          (child.type === 'INSTANCE' && componentSetName(child) === 'Definition List Item') ||
          (child.type === 'FRAME' && canonicalKey(child.name) === 'definitionitem')
        );
      } catch {
        return false;
      }
    }).map((child, index) => definitionItemFromFigma(child, index, warnings)).filter(Boolean)
    : [];
  if (!slot) warnings.push('Definition List Items Slot was not found — items were not exported.');
  props.items = items;
  return { node: { id: componentId('DefinitionList', instance), type: 'DefinitionList', props }, warnings };
}

function definitionListContextForSelection(instance) {
  instance = currentInstance(instance);
  const exported = exportDefinitionList(instance);
  const props = exported.node.props || {};
  const items = Array.isArray(props.items) ? props.items : [];
  const direction = DEFINITION_LIST_DIRECTIONS.includes(props.direction) ? props.direction : 'row';
  const size = DEFINITION_LIST_SIZES.includes(props.size) ? props.size : 'md';
  const itemCount = Math.max(1, Math.min(10, items.length || 1));
  return {
    direction,
    directionOptions: DEFINITION_LIST_DIRECTIONS,
    size,
    sizeOptions: DEFINITION_LIST_SIZES,
    itemCount,
    itemCountOptions: Array.from({ length: 10 }, (_, index) => String(index + 1)),
  };
}

function exportDefinitionListItem(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};
  const direction = componentPropertyValue(instance, 'Direction', 'VARIANT');
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  if (DEFINITION_LIST_DIRECTIONS.includes(direction) && direction !== 'row') props.direction = direction;
  if (DEFINITION_LIST_SIZES.includes(size)) props.size = size;
  const item = definitionItemFromFigma(instance, 0, warnings);
  props.items = item ? [item] : [];
  return { node: { id: componentId('DefinitionList', instance), type: 'DefinitionList', props }, warnings };
}

function exportBlockquote(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};
  const variant = componentPropertyValue(instance, 'Variant', 'VARIANT');
  const cite = componentText(instance, 'Citation', '');
  const citeUrl = componentText(instance, 'Citation URL', '');
  const showCitation = componentBoolean(instance, 'Show citation', true);
  if (BLOCKQUOTE_VARIANTS.includes(variant) && variant !== 'border') props.variant = variant;
  if (cite && showCitation) props.cite = cite;
  if (citeUrl && showCitation) props.citeUrl = citeUrl;
  const node = {
    id: componentId('Blockquote', instance),
    type: 'Blockquote',
    content: { fallback: componentText(instance, 'Quote', 'Add a quote') },
  };
  if (Object.keys(props).length > 0) node.props = props;
  return { node, warnings };
}

// Export every registered descendant instance (e.g. Buttons inside a Section)
// as child nodes, skipping instances nested inside an already-exported one.
function exportRegisteredDescendants(root, warnings) {
  const exported = [];
  const covered = new Set();
  for (const instanceNode of root.findAll((n) => n.type === 'INSTANCE')) {
    const name = registeredSetName(instanceNode);
    if (!name) continue;
    let insideExported = false;
    for (let parent = instanceNode.parent; parent; parent = parent.parent) {
      if (covered.has(parent.id)) { insideExported = true; break; }
    }
    if (insideExported) continue;
    const result = withBreakpointVisibility(instanceNode, EXPORTERS[name](instanceNode));
    exported.push(result.node);
    for (const warning of result.warnings) warnings.push(warning);
    covered.add(instanceNode.id);
  }
  return exported;
}

// Section is the one registered component whose meaningful page content lives
// in a nested Section Content instance. Its real editable carrier is the
// `Section Content Slot` SLOT node — not the legacy `_content` frame assumed
// by the first bridge implementation. Export that slot with the same ordered
// traversal used for a selected frame: direct A1-styled text becomes
// Heading/Paragraph and registered instances (such as Buttons) keep their
// complete JSON props.
function sectionContentContainer(instance) {
  const isContentSlot = (node) => node.type === 'SLOT' && canonicalKey(node.name) === 'sectioncontentslot';
  const sectionContent = instance.findOne((node) =>
    node.type === 'INSTANCE' && componentSetName(node) === 'Section Content');
  if (sectionContent) {
    const slot = sectionContent.findOne(isContentSlot);
    if (slot) return slot;
  }
  // Keep compatibility with pre-slot library copies and detached legacy
  // instances, then accept a slot found directly under the selected root.
  return instance.findOne(isContentSlot)
    || instance.findOne((node) => node.type === 'FRAME' && node.name === '_content')
    || null;
}

function sectionGapCarrier(instance) {
  const content = sectionContentContainer(instance);
  if (content && ['HORIZONTAL', 'VERTICAL'].includes(content.layoutMode)) return content;
  const sectionContent = instance.findOne((node) =>
    node.type === 'INSTANCE' && componentSetName(node) === 'Section Content');
  if (sectionContent && ['HORIZONTAL', 'VERTICAL'].includes(sectionContent.layoutMode)) return sectionContent;
  return sectionContent && sectionContent.findOne((node) =>
    ['FRAME', 'SLOT'].includes(node.type) && ['HORIZONTAL', 'VERTICAL'].includes(node.layoutMode)) || null;
}

function nearestSectionGap(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 'md';
  return SECTION_GAPS.reduce((nearest, gap) =>
    Math.abs(SECTION_GAP_PIXELS[gap] - value) < Math.abs(SECTION_GAP_PIXELS[nearest] - value) ? gap : nearest, 'xs');
}

function sectionDeclaredGap(instance) {
  const carriers = sectionPropertyCarriers(instance);
  const variant = findSectionProperty(carriers, ['gap'], 'VARIANT');
  const mode = explicitCollectionMode(instance, 'Gap');
  if (variant && SECTION_GAPS.includes(variant.property.value)) return variant.property.value;
  return SECTION_GAPS.includes(mode) ? mode : null;
}

// Sections use semantic gap props. Their editable Figma content carrier may
// nevertheless have an arbitrary numeric itemSpacing, so normalize that value
// to the semantic gap that Section will actually serialize.
function sectionSuggestion(instance) {
  const carrier = sectionGapCarrier(instance);
  if (!carrier) return { issues: [], fixes: [], carrier: null, gap: null };
  const declaredGap = sectionDeclaredGap(instance);
  const nearestGap = nearestSectionGap(carrier.itemSpacing);
  const gap = declaredGap || nearestGap;
  const targetSpacing = SECTION_GAP_PIXELS[gap];
  const issues = [];
  const fixes = [];
  if (carrier.itemSpacing !== targetSpacing) {
    const source = declaredGap
      ? `Section gap="${declaredGap}"`
      : `Content spacing ${carrier.itemSpacing}`;
    issues.push(`${source} does not match the A1 Section gap scale; ${gap} (${targetSpacing}px) is the closest compatible value.`);
    fixes.push('content gap');
  }
  return { issues, fixes, carrier, gap };
}

function sectionVariantContextValue(instance, names, allowed, fallback, collectionName) {
  const carriers = sectionPropertyCarriers(instance);
  const found = findSectionProperty(carriers, names, 'VARIANT');
  if (found && allowed.includes(found.property.value)) return found.property.value;
  const mode = collectionName ? explicitCollectionMode(instance, collectionName) : null;
  if (allowed.includes(mode)) return mode;
  return fallback;
}

function sectionContextForSelection(instance) {
  const section = currentInstance(instance);
  const colorMode = explicitCollectionMode(section, 'Color');
  return {
    surface: sectionVariantContextValue(section, ['surface'], SECTION_SURFACES, 'page'),
    surfaceOptions: SECTION_SURFACES,
    inverse: colorMode === 'Dark',
    padding: sectionVariantContextValue(section, ['padding'], SECTION_PADDINGS, 'sm'),
    paddingOptions: SECTION_PADDINGS,
    contentWidth: sectionVariantContextValue(section, ['contentwidth', 'width'], SECTION_WIDTHS, 'lg', 'ContentWidth'),
    contentWidthOptions: SECTION_WIDTHS,
    gap: sectionVariantContextValue(section, ['gap'], SECTION_GAPS, 'md', 'Gap'),
    gapOptions: SECTION_GAPS,
    widthMode: layoutWidthMode(section),
    heightMode: layoutHeightMode(section),
  };
}

function syncSectionInverseMode(instance, inverse, warnings) {
  const section = currentInstance(instance);
  if (inverse === true) {
    const applied = applyCollectionModeToTree(section, 'Color', 'Dark');
    if (!applied) {
      const collections = resolvedCollectionsForRoot(section)
        .map((collection) => `${collection.name} (${collection.modes.map((mode) => mode.name).join(', ')})`);
      warnings.push(collections.length
        ? `inverse could not be applied — no resolved Color collection with a Dark mode accepted the mode write. Resolved collections: ${collections.join('; ')}.`
        : 'inverse could not be applied — no resolved Color collection was found on this Section.');
    }
    return;
  }
  clearCollectionMode(section, 'Color');
}

function syncSectionGapSpacing(instance, gap, warnings) {
  if (!SECTION_GAPS.includes(gap)) return;
  const carrier = sectionGapCarrier(currentInstance(instance));
  if (!carrier) return;
  trySetLayoutProperty(carrier, 'itemSpacing', SECTION_GAP_PIXELS[gap], warnings, 'Section content gap');
  try {
    if (carrier.layoutWrap === 'WRAP') {
      trySetLayoutProperty(carrier, 'counterAxisSpacing', SECTION_GAP_PIXELS[gap], warnings, 'Section wrap gap');
    }
  } catch {
    // Ignore unsupported wrap metadata on older Section content layers.
  }
}

function applySectionSuggestion(instance, suggestion, warnings) {
  if (!suggestion.carrier || !suggestion.gap) return;
  try {
    suggestion.carrier.itemSpacing = SECTION_GAP_PIXELS[suggestion.gap];
  } catch (error) {
    warnings.push(`Section content spacing could not be updated directly: ${error.message}`);
  }
  const carriers = sectionPropertyCarriers(instance);
  const applied = assignSectionVariant(carriers, ['gap'], suggestion.gap)
    || applyCollectionMode(instance, 'Gap', suggestion.gap);
  if (!applied) {
    warnings.push(`No Section Gap property or Gap mode was found; normalized the editable content spacing to ${suggestion.gap} only.`);
  }
}

function exportSectionChildren(instance, warnings) {
  const content = sectionContentContainer(instance);
  if (content) return exportFreeContent(content, warnings);

  // Older Section library instances may not yet expose the named content
  // frame. Retain the previous best-effort Button/component export instead of
  // silently producing an empty Section.
  warnings.push('Section Content Slot was not found — exported supported component descendants only.');
  return exportRegisteredDescendants(instance, warnings);
}

function exportSection(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};
  const carriers = sectionPropertyCarriers(instance);

  const surface = findSectionProperty(carriers, ['surface'], 'VARIANT');
  if (surface && SECTION_SURFACES.includes(surface.property.value)) {
    props.surface = surface.property.value;
  } else if (!surface) {
    warnings.push('No Surface property found on the Section or its parts — surface omitted.');
  }

  const padding = findSectionProperty(carriers, ['padding'], 'VARIANT');
  if (padding && SECTION_PADDINGS.includes(padding.property.value)) {
    // sm is the React/JSON default and is omitted from the JSON.
    if (padding.property.value !== 'sm') props.padding = padding.property.value;
  } else {
    warnings.push('No Padding property found on the Section or its parts — padding omitted.');
  }

  // contentWidth translation — the split half of the Figma Section model:
  // prefer a width variant on the Section or an internal part (e.g. the
  // "Section Content" component), then fall back to an explicit ContentWidth
  // variable mode on the instance or its inner frames.
  const width = findSectionProperty(carriers, ['contentwidth', 'width'], 'VARIANT');
  const modeWidth = explicitCollectionMode(instance, 'ContentWidth');
  if (width && SECTION_WIDTHS.includes(width.property.value)) {
    props.contentWidth = width.property.value;
  } else if (SECTION_WIDTHS.includes(modeWidth)) {
    props.contentWidth = modeWidth;
  } else {
    warnings.push('No content-width property or explicit ContentWidth mode found — contentWidth omitted.');
  }

  const gapVariant = findSectionProperty(carriers, ['gap'], 'VARIANT');
  const gapMode = explicitCollectionMode(instance, 'Gap');
  if (gapVariant && SECTION_GAPS.includes(gapVariant.property.value)) props.gap = gapVariant.property.value;
  else if (SECTION_GAPS.includes(gapMode)) props.gap = gapMode;
  else {
    const gapCarrier = sectionGapCarrier(instance);
    if (gapCarrier) {
      const detectedGap = nearestSectionGap(gapCarrier.itemSpacing);
      if (detectedGap !== 'md') props.gap = detectedGap;
      if (gapCarrier.itemSpacing !== SECTION_GAP_PIXELS[detectedGap]) {
        warnings.push(`Section content itemSpacing=${gapCarrier.itemSpacing} is not an A1 semantic gap; nearest gap="${detectedGap}" was exported.`);
      }
    }
  }

  // A1 inverse corresponds only to an explicitly applied Dark Color mode.
  // Other modes (including inherited/default modes) leave inverse absent.
  const colorMode = explicitCollectionMode(instance, 'Color');
  if (colorMode === 'Dark') {
    props.inverse = true;
  }

  // TEXT documentation properties (Gradient, Align, borders, background…).
  for (const key of Object.keys(SECTION_TEXT_PROPS)) {
    const def = SECTION_TEXT_PROPS[key];
    const found = findSectionProperty(carriers, [canonicalKey(key)], 'TEXT');
    const raw = found && typeof found.property.value === 'string' ? found.property.value.trim() : '';
    if (!raw || raw === def.default) continue;
    if (def.allowed && !def.allowed.includes(raw)) {
      warnings.push(`${key}="${raw}" is not a valid value — ignored.`);
      continue;
    }
    props[def.prop] = raw;
  }
  const sidesFound = findSectionProperty(carriers, ['bordersides'], 'TEXT');
  const sidesRaw = sidesFound && typeof sidesFound.property.value === 'string' ? sidesFound.property.value.trim() : '';
  if (sidesRaw && sidesRaw !== 'all') {
    let sides;
    try {
      sides = JSON.parse(sidesRaw);
    } catch (error) {
      sides = sidesRaw.split(/[\s,]+/);
    }
    if (Array.isArray(sides)) {
      sides = sides.filter((side) => ['top', 'right', 'bottom', 'left'].includes(side));
      if (sides.length > 0 && sides.length < 4) props.borderSides = sides;
    }
  }

  const children = exportSectionChildren(instance, warnings);
  const node = {
    id: 'section-' + instance.id.replace(/[^a-zA-Z0-9]+/g, '-'),
    type: 'Section',
  };
  if (Object.keys(props).length > 0) node.props = props;
  if (children.length > 0) node.children = children;
  return { node, warnings };
}

// Button Container is a responsive action layout in React. The Figma asset
// exposes its wide-layout alignment as an Align variant and carries its
// representative Button instances in a named frame. The frame is deliberately
// named like a slot so exported children remain ordered and easy to reconcile.
function buttonContainerSlot(instance) {
  return instance.findOne((node) =>
    (node.type === 'FRAME' || node.type === 'SLOT') && canonicalKey(node.name) === 'buttonslot') || null;
}

function buttonContainerCompactForWidth(instance) {
  const width = Number(instance && instance.width);
  return Number.isFinite(width) && width < BUTTON_CONTAINER_QUERY_WIDTH;
}

function buttonContainerDirectionForWidth(instance) {
  return buttonContainerCompactForWidth(instance) ? 'stacked' : 'inline';
}

function buttonContainerAlign(instance) {
  const align = componentPropertyValue(instance, 'Align', 'VARIANT');
  return BUTTON_CONTAINER_ALIGNS.includes(align) ? align : 'start';
}

function buttonContainerDirectionFromVariantValue(value) {
  const key = canonicalKey(value);
  for (const [direction, values] of Object.entries(BUTTON_CONTAINER_DIRECTION_VARIANTS)) {
    if (values.some((candidate) => canonicalKey(candidate) === key)) return direction;
  }
  return '';
}

function buttonContainerDirectionProperty(instance) {
  return componentPropertyFromNames(instance, BUTTON_CONTAINER_DIRECTION_PROPERTY_NAMES, 'VARIANT');
}

function preferredButtonContainerDirectionCandidates(direction, currentValue) {
  const candidates = BUTTON_CONTAINER_DIRECTION_VARIANTS[direction] || [];
  const current = String(currentValue || '');
  return Array.from(new Set([...candidates, current].filter(Boolean)));
}

function syncButtonContainerDirection(instance, direction, warnings = []) {
  let current = currentInstance(instance);
  const found = buttonContainerDirectionProperty(current);
  if (!found) return current;
  if (buttonContainerDirectionFromVariantValue(found.property.value) === direction) return current;
  const candidates = preferredButtonContainerDirectionCandidates(direction, found.property.value);
  let lastError = null;
  for (const candidate of candidates) {
    try {
      current.setProperties({ [found.key]: candidate });
      return currentInstance(current);
    } catch (error) {
      lastError = error;
    }
  }
  warnings.push(`Button Group direction could not be applied to the "${plainKey(found.key)}" variant property as ${direction}: ${lastError && lastError.message ? lastError.message : 'no matching variant value was accepted'}.`);
  return currentInstance(current);
}

function buttonContainerButtonChildren(instance) {
  const slot = buttonContainerSlot(currentInstance(instance));
  if (!slot || !('children' in slot)) return [];
  const isButton = (node) => node.type === 'INSTANCE' && registeredSetName(node) === 'Button';
  const direct = slot.children.filter(isButton);
  return direct.length > 0 || typeof slot.findAll !== 'function' ? direct : slot.findAll(isButton);
}

function buttonContainerAncestor(node) {
  for (let parent = node && node.parent; parent; parent = parent.parent) {
    const liveParent = liveNode(parent);
    if (liveParent && liveParent.type === 'INSTANCE' && registeredSetName(liveParent) === 'Button Container') {
      return liveParent;
    }
  }
  return null;
}

function syncButtonContainerSlotLayout(slot, compact, align, warnings) {
  if (!slot || slot.type !== 'FRAME') return;
  trySetLayoutProperty(slot, 'layoutMode', compact ? 'VERTICAL' : 'HORIZONTAL', warnings, 'Button Group responsive layout');
  trySetLayoutProperty(slot, 'layoutWrap', compact ? 'NO_WRAP' : 'WRAP', warnings, 'Button Group responsive wrap');
  trySetLayoutProperty(slot, 'primaryAxisAlignItems', align === 'center' ? 'CENTER' : align === 'end' ? 'MAX' : 'MIN', warnings, 'Button Group alignment');
  trySetLayoutProperty(slot, 'counterAxisAlignItems', compact ? 'STRETCH' : 'CENTER', warnings, 'Button Group cross-axis alignment');
}

function syncButtonContainerChildButtonSizing(button, compact, warnings, index) {
  if (!button || button.type !== 'INSTANCE') return;
  // A child Button owns its content height. Reset vertical Fill left by a
  // previous responsive pass before applying the breakpoint-specific width.
  syncLayoutHeightMode(button, 'hug', warnings, `Button Group child ${index}`);
  if (compact) {
    syncLayoutWidthMode(button, 'fill', warnings, `Button Group child ${index}`);
    return;
  }
  syncLayoutWidthMode(button, 'hug', warnings, `Button Group child ${index}`);
}

function syncButtonContainerForWidth(instance, warnings = []) {
  let current = currentInstance(instance);
  if (!current || current.type !== 'INSTANCE') return current;
  const direction = buttonContainerDirectionForWidth(current);
  current = syncButtonContainerDirection(current, direction, warnings);
  const compact = direction === 'stacked';
  const align = buttonContainerAlign(current);
  const slot = buttonContainerSlot(current);
  syncButtonContainerSlotLayout(slot, compact, align, warnings);
  buttonContainerButtonChildren(current).forEach((button, index) => {
    syncButtonContainerChildButtonSizing(button, compact, warnings, index + 1);
  });
  current = currentInstance(current);
  return current;
}

function buttonContainerContextForSelection(instance) {
  instance = currentInstance(instance);
  return {
    align: buttonContainerAlign(instance),
    alignOptions: BUTTON_CONTAINER_ALIGNS,
    direction: buttonContainerDirectionForWidth(instance),
    directionOptions: ['stacked', 'inline'],
    compact: buttonContainerDirectionForWidth(instance) === 'stacked',
    containerQueryWidth: BUTTON_CONTAINER_QUERY_WIDTH,
    buttonCount: buttonContainerButtonChildren(instance).length,
  };
}

function exportButtonContainer(instance) {
  const warnings = [];
  instance = syncButtonContainerForWidth(instance, warnings);
  const props = {};
  const align = componentPropertyValue(instance, 'Align', 'VARIANT');
  if (BUTTON_CONTAINER_ALIGNS.includes(align)) {
    if (align !== 'start') props.align = align;
  } else {
    warnings.push('No supported Align property was found on the Button Container — align was omitted.');
  }

  const liveInstance = currentInstance(instance);
  const slot = buttonContainerSlot(liveInstance);
  const children = slot ? exportFreeContent(slot, warnings) : [];
  if (!slot) warnings.push('Button Slot was not found — Button children were not exported.');

  const node = { id: componentId('ButtonContainer', instance), type: 'ButtonContainer' };
  if (Object.keys(props).length > 0) node.props = props;
  if (children.length > 0) node.children = children;
  return { node, warnings };
}

function exportTextField(instance) {
  const warnings = [];
  const props = {};
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  const state = componentPropertyValue(instance, 'State', 'VARIANT');
  const showLabel = componentPropertyValue(instance, 'Show label', 'BOOLEAN');
  const showHint = componentPropertyValue(instance, 'Show hint', 'BOOLEAN');
  const label = componentPropertyValue(instance, 'Label', 'TEXT');
  const value = componentPropertyValue(instance, 'Value', 'TEXT');
  const hint = componentPropertyValue(instance, 'Hint', 'TEXT');
  const error = componentPropertyValue(instance, 'Error', 'TEXT');

  if (TEXT_FIELD_SIZES.includes(size) && size !== 'default') props.size = size;
  if (showLabel !== false && typeof label === 'string' && label) props.label = label;
  if (typeof value === 'string' && value) props.defaultValue = value;
  if (state === 'required') props.required = true;
  if (state === 'disabled') props.disabled = true;
  if (state === 'readOnly') props.readOnly = true;
  if (state === 'error') {
    if (typeof error === 'string' && error) props.error = error;
    else warnings.push('State=error has no Error text — the error prop was omitted.');
  } else if (showHint !== false && typeof hint === 'string' && hint) {
    props.hint = hint;
  }
  if (TEXT_FIELD_VISUAL_STATES.includes(state)) {
    warnings.push(`State=${state} is a visual-only Figma state — no prop was emitted.`);
  }

  return {
    node: { id: componentId('TextField', instance), type: 'TextField', props },
    warnings,
  };
}

// These newer component sets intentionally keep editable copy in named text
// layers instead of adding a component-property matrix for every label. The
// bridge reads and writes those stable layer names, while variants continue to
// carry the semantic visual state.
function namedTextValue(instance, name, fallback = '') {
  return namedTextLayerValue(currentInstance(instance), name, fallback);
}

async function writeNamedText(instance, name, value, warnings, owner) {
  const live = currentInstance(instance);
  let text = null;
  try {
    text = live.findOne((node) => node.type === 'TEXT' && canonicalKey(node.name) === canonicalKey(name));
  } catch {
    text = null;
  }
  if (!text) {
    warnings.push(`${owner} ${name} text layer was not found — the value was not applied.`);
    return false;
  }
  try {
    if (text.fontName !== figma.mixed) await figma.loadFontAsync(text.fontName);
    text.characters = String(value || '');
    return true;
  } catch (error) {
    warnings.push(`${owner} ${name} could not be updated: ${error.message}`);
    return false;
  }
}

async function writeFirstNamedText(instance, names, value, warnings, owner) {
  const live = currentInstance(instance);
  let text = null;
  let matchedName = '';
  for (const name of names) {
    try {
      text = live.findOne((node) => node.type === 'TEXT' && canonicalKey(node.name) === canonicalKey(name));
      if (text) {
        matchedName = name;
        break;
      }
    } catch {
      text = null;
    }
  }
  if (!text) {
    warnings.push(`${owner} text layer was not found — tried ${names.join(', ')}.`);
    return false;
  }
  try {
    if (text.fontName !== figma.mixed) await figma.loadFontAsync(text.fontName);
    text.characters = String(value || '');
    return true;
  } catch (error) {
    warnings.push(`${owner} ${matchedName} could not be updated: ${error.message}`);
    return false;
  }
}

function setVariant(instance, name, value, warnings, owner) {
  const live = currentInstance(instance);
  const assignments = {};
  queueComponentProperty(live, assignments, name, value, 'VARIANT', warnings, `${owner} ${name}`);
  applyQueuedProperties(live, assignments, warnings, `${owner} properties`);
}

function exportSearchField(instance) {
  const props = {};
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  if (TEXT_FIELD_SIZES.includes(size) && size !== 'default') props.size = size;
  const label = namedTextValue(instance, 'Label').trim();
  const value = namedTextValue(instance, 'Value').trim();
  if (label) props.label = label;
  if (value) props.defaultValue = value;
  return { node: { id: componentId('SearchField', instance), type: 'SearchField', props }, warnings: [] };
}

async function applySearchField(instance, node, warnings) {
  const props = node.props || {};
  setVariant(instance, 'Size', TEXT_FIELD_SIZES.includes(props.size) ? props.size : 'default', warnings, 'Search Field');
  if (typeof props.label === 'string') await writeNamedText(instance, 'Label', props.label, warnings, 'Search Field');
  if (typeof props.defaultValue === 'string') await writeNamedText(instance, 'Value', props.defaultValue, warnings, 'Search Field');
  for (const key of ['value', 'onSearch', 'onClear', 'autoComplete', 'readOnly', 'disabled']) {
    if (props[key] !== undefined) warnings.push(`SearchField "${key}" is runtime-only and was not represented in Figma.`);
  }
}

async function importSearchField(node, warnings) {
  const instance = await createComponentInstance('Search Field', warnings);
  await applySearchField(instance, node, warnings);
  return instance;
}

function exportTextarea(instance) {
  const props = {};
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  if (TEXT_FIELD_SIZES.includes(size) && size !== 'default') props.size = size;
  const label = componentText(instance, 'Label', namedTextValue(instance, 'Label')).trim();
  const showValue = componentBoolean(instance, 'Show value', false);
  const value = componentText(instance, 'Value', namedTextValue(instance, 'Value'));
  const showHint = componentBoolean(instance, 'Show hint', false);
  const hint = componentText(instance, 'Hint', namedTextValue(instance, 'Hint')).trim();
  const showCount = componentBoolean(instance, 'Show count', false);
  const count = componentText(instance, 'Count', namedTextValue(instance, 'Count')).trim();
  const required = componentBoolean(instance, 'Required', false);
  if (label) props.label = label;
  if (required) props.required = true;
  if (showValue && value) props.defaultValue = value;
  if (showHint && hint) props.hint = hint;
  if (showCount) {
    props.showCount = true;
    const maximum = count.match(/\/\s*(\d+)\s*$/);
    if (maximum) props.maxLength = Number(maximum[1]);
  }
  return { node: { id: componentId('TextareaField', instance), type: 'TextareaField', props }, warnings: [] };
}

async function applyTextarea(instance, node, warnings) {
  const props = node.props || {};
  const live = currentInstance(instance);
  const assignments = {};
  const defaultValue = typeof props.defaultValue === 'string' ? props.defaultValue : '';
  const hasValue = defaultValue.length > 0;
  const hint = typeof props.hint === 'string' ? props.hint : '';
  const hasHint = hint.length > 0;
  const hasMaximum = Number.isFinite(props.maxLength) && props.maxLength >= 0;
  const showCount = props.showCount === true || hasMaximum;
  const count = hasMaximum ? `${defaultValue.length} / ${props.maxLength}` : String(defaultValue.length);

  queueComponentProperty(live, assignments, 'Size', TEXT_FIELD_SIZES.includes(props.size) ? props.size : 'default', 'VARIANT', warnings, 'Textarea Size');
  queueComponentProperty(live, assignments, 'Label', typeof props.label === 'string' ? props.label : 'Message', 'TEXT', warnings, 'Textarea Label');
  queueComponentProperty(live, assignments, 'Value', defaultValue, 'TEXT', warnings, 'Textarea Value');
  queueComponentProperty(live, assignments, 'Show value', hasValue, 'BOOLEAN', warnings, 'Textarea Show value');
  queueComponentProperty(live, assignments, 'Hint', hint || 'Supporting text', 'TEXT', warnings, 'Textarea Hint');
  queueComponentProperty(live, assignments, 'Show hint', hasHint, 'BOOLEAN', warnings, 'Textarea Show hint');
  queueComponentProperty(live, assignments, 'Count', count, 'TEXT', warnings, 'Textarea Count');
  queueComponentProperty(live, assignments, 'Show count', showCount, 'BOOLEAN', warnings, 'Textarea Show count');
  queueComponentProperty(live, assignments, 'Required', props.required === true, 'BOOLEAN', warnings, 'Textarea Required');
  applyQueuedProperties(live, assignments, warnings, 'Textarea properties');

  for (const key of ['value', 'rows', 'readOnly', 'disabled']) {
    if (props[key] !== undefined) warnings.push(`TextareaField "${key}" is not represented by the compact Figma component.`);
  }
}

async function importTextarea(node, warnings) {
  const instance = await createComponentInstance('Textarea', warnings);
  await applyTextarea(instance, node, warnings);
  return instance;
}

function segmentedLabels(instance) {
  try {
    return currentInstance(instance).findAll((node) => node.type === 'TEXT' && ['label', 'selectedlabel'].includes(canonicalKey(node.name)))
      .map((node) => node.characters).filter(Boolean);
  } catch {
    return [];
  }
}

function segmentedItemInstances(instance) {
  const current = currentInstance(instance);
  const slot = namedSlot(current, 'Content Slot');
  const root = slot || current;
  try {
    return stackFlowChildren(root).filter((child) => child.type === 'INSTANCE' && componentSetName(child) === 'Segmented Control Item');
  } catch {
    return [];
  }
}

function segmentedOptionLabel(option, fallback) {
  if (typeof option === 'string') return option;
  if (option && typeof option.label === 'string') return option.label;
  return fallback;
}

function segmentedOptionValue(option, label, usedValues) {
  if (option && typeof option === 'object' && typeof option.value === 'string' && option.value) {
    usedValues.add(option.value);
    return option.value;
  }
  return slugifyOptionValue(label, usedValues);
}

async function writeTextLayerValue(text, value, warnings, owner) {
  try {
    if (text.fontName !== figma.mixed) await figma.loadFontAsync(text.fontName);
    text.characters = String(value || '');
  } catch (error) {
    warnings.push(`${owner} ${text.name} could not be updated: ${error.message}`);
  }
}

function segmentedItemLabelColorVariable(item) {
  try {
    const label = currentInstance(item).findOne((node) => node.type === 'TEXT' && canonicalKey(node.name) === 'label');
    const paint = label && Array.isArray(label.fills) ? label.fills.find((entry) => entry && entry.type === 'SOLID') : null;
    const variableId = paint && paint.boundVariables && paint.boundVariables.color && paint.boundVariables.color.id;
    return variableId ? figma.variables.getVariableById(variableId) : null;
  } catch {
    return null;
  }
}

function bindSegmentedItemIconColor(item, warnings, owner) {
  const colorVariable = segmentedItemLabelColorVariable(item);
  if (!colorVariable) return;
  let live = currentInstance(item);
  const icon = live.findOne((node) => node.type === 'INSTANCE' && node.name === 'Icon');
  if (!icon) return;
  const paintNodes = icon.findAll((node) => 'fills' in node || 'strokes' in node);
  for (const paintNode of paintNodes) {
    try {
      if ('fills' in paintNode && Array.isArray(paintNode.fills) && paintNode.fills.length) {
        paintNode.fills = paintNode.fills.map((paint) => (
          paint && paint.type === 'SOLID'
            ? figma.variables.setBoundVariableForPaint({ ...paint }, 'color', colorVariable)
            : paint
        ));
      }
      if ('strokes' in paintNode && Array.isArray(paintNode.strokes) && paintNode.strokes.length) {
        paintNode.strokes = paintNode.strokes.map((paint) => (
          paint && paint.type === 'SOLID'
            ? figma.variables.setBoundVariableForPaint({ ...paint }, 'color', colorVariable)
            : paint
        ));
      }
    } catch (error) {
      warnings.push(`${owner} icon color could not be rebound: ${error.message}`);
    }
  }
}

function exportSegmentedControl(instance) {
  const props = {};
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  if (SEGMENTED_SIZES.includes(size) && size !== 'md') props.size = size;
  const values = new Set();
  const itemInstances = segmentedItemInstances(instance);
  const options = itemInstances.length
    ? itemInstances.map((item, index) => {
      const content = componentPropertyValue(item, 'Content', 'VARIANT');
      const showIcon = componentBoolean(item, 'Show icon', content === 'icon label' || content === 'icon only');
      const showLabel = componentBoolean(item, 'Show label', content !== 'icon only');
      const label = componentText(item, 'Label', namedTextLayerValue(item, 'Label', item.name || `Option ${index + 1}`)).trim() || `Option ${index + 1}`;
      const option = { value: slugifyOptionValue(label, values), label };
      if (showIcon) {
        const icon = iconNameFromInstance(item, 'Icon')
          || iconNameFromSwapValue(componentPropertyValue(item, 'Icon', 'INSTANCE_SWAP'))
          || componentText(item, 'Icon', namedTextLayerValue(item, 'Icon', '')).trim();
        if (icon) option.icon = icon;
        if (!showLabel) option.ariaLabel = label;
      }
      return option;
    })
    : segmentedLabels(instance).map((label) => ({ value: slugifyOptionValue(label, values), label }));
  if (options.length) {
    props.options = options;
    const selectedIndex = itemInstances.findIndex((item) => {
      const selected = componentPropertyValue(item, 'Selected', 'VARIANT');
      return selected === 'true' || selected === true;
    });
    props.value = options[selectedIndex >= 0 ? selectedIndex : 0].value;
    if (itemInstances.length) {
      const labelVisibility = itemInstances.map((item) => componentBoolean(item, 'Show label', componentPropertyValue(item, 'Content', 'VARIANT') !== 'icon only'));
      const iconCapable = options.some((option) => typeof option.icon === 'string' && option.icon);
      if (iconCapable && labelVisibility.every((visible) => visible === false)) props.labelMode = 'none';
      else if (iconCapable && selectedIndex >= 0 && labelVisibility.every((visible, index) => index === selectedIndex ? visible !== false : visible === false)) props.labelMode = 'selected';
    }
  }
  return { node: { id: componentId('SegmentedControl', instance), type: 'SegmentedControl', props }, warnings: [] };
}

async function applySegmentedControl(instance, node, warnings) {
  const props = node.props || {};
  const size = SEGMENTED_SIZES.includes(props.size) ? props.size : 'md';
  setVariant(instance, 'Size', size, warnings, 'Segmented Control');
  if (Array.isArray(props.options)) {
    const normalized = [];
    const usedValues = new Set();
    for (let index = 0; index < props.options.length; index += 1) {
      const option = props.options[index];
      const label = segmentedOptionLabel(option, `Option ${index + 1}`);
      normalized.push({
        label,
        value: segmentedOptionValue(option, label, usedValues),
        icon: option && typeof option === 'object' && typeof option.icon === 'string' ? option.icon : null,
      });
    }
    const selectedIndex = Math.max(0, normalized.findIndex((option) => option.value === props.value));
    const itemInstances = segmentedItemInstances(instance);
    if (itemInstances.length) {
      for (let index = 0; index < Math.min(itemInstances.length, normalized.length); index += 1) {
        const item = itemInstances[index];
        const option = normalized[index];
        const assignments = {};
        const hasIcon = Boolean(option.icon);
        const showLabel = props.labelMode === 'none'
          ? !hasIcon
          : props.labelMode === 'selected'
            ? index === selectedIndex || !hasIcon
            : true;
        const content = hasIcon ? (showLabel ? 'icon label' : 'icon only') : 'label';
        queueComponentProperty(item, assignments, 'Size', size, 'VARIANT', warnings, `Segmented Control option ${index + 1} size`);
        queueComponentProperty(item, assignments, 'Selected', index === selectedIndex ? 'true' : 'false', 'VARIANT', warnings, `Segmented Control option ${index + 1} selected`);
        if (componentProperty(item, 'Content', 'VARIANT')) queueComponentProperty(item, assignments, 'Content', content, 'VARIANT', warnings, `Segmented Control option ${index + 1} content`);
        queueComponentProperty(item, assignments, 'Label', option.label, 'TEXT', warnings, `Segmented Control option ${index + 1} label`);
        queueComponentProperty(item, assignments, 'Show label', showLabel, 'BOOLEAN', warnings, `Segmented Control option ${index + 1} label visibility`);
        queueComponentProperty(item, assignments, 'Show icon', hasIcon, 'BOOLEAN', warnings, `Segmented Control option ${index + 1} icon visibility`);
        if (hasIcon) {
          const icon = findIconComponent(option.icon);
          if (icon) queueComponentProperty(item, assignments, 'Icon', icon.id, 'INSTANCE_SWAP', warnings, `Segmented Control option ${index + 1} icon`);
          else warnings.push(`No Material icon component named "${option.icon}" exists in this file — option ${index + 1} keeps the default glyph.`);
        }
        applyQueuedProperties(item, assignments, warnings, `Segmented Control option ${index + 1} properties`);
        bindSegmentedItemIconColor(item, warnings, `Segmented Control option ${index + 1}`);
      }
      if (normalized.length !== itemInstances.length) warnings.push(`Segmented Control has ${itemInstances.length} editable options; JSON supplied ${normalized.length}. Use Render on canvas to change the option count.`);
    } else {
      const textLayers = currentInstance(instance).findAll((child) => child.type === 'TEXT' && ['label', 'selectedlabel'].includes(canonicalKey(child.name)));
      for (let index = 0; index < Math.min(textLayers.length, normalized.length); index += 1) {
        await writeTextLayerValue(textLayers[index], normalized[index].label, warnings, 'Segmented Control');
      }
      if (normalized.length !== textLayers.length) warnings.push(`Segmented Control has ${textLayers.length} editable options; JSON supplied ${normalized.length}. Use Render on canvas to change the option count.`);
      if (normalized.some((option) => option.icon)) warnings.push('This legacy Segmented Control asset has no item icon properties; option icons were not represented.');
    }
  }
}

async function importSegmentedControl(node, warnings) {
  const instance = await createComponentInstance('Segmented Control', warnings);
  await applySegmentedControl(instance, node, warnings);
  return instance;
}

function tabsItemsFromProps(props) {
  const source = Array.isArray(props.items) ? props.items : Array.isArray(props.tabs) ? props.tabs : [];
  const usedValues = new Set();
  return source
    .filter((item) => item && typeof item === 'object')
    .map((item, index) => {
      const label = typeof item.label === 'string' && item.label.trim() ? item.label.trim() : `Tab ${index + 1}`;
      const value = typeof item.id === 'string' && item.id
        ? item.id
        : typeof item.value === 'string' && item.value
          ? item.value
          : slugifyOptionValue(label, usedValues);
      usedValues.add(value);
      return {
        ...item,
        id: value,
        value,
        label,
      };
    });
}

function normalizedTabsVariant(value) {
  const raw = String(value || '').trim().toLowerCase();
  return TABS_VARIANTS.includes(raw) ? raw : '';
}

function tabAttachmentName(node) {
  try {
    const match = String(node && node.name ? node.name : '').match(/\{\s*tab\s*=\s*([^}]+?)\s*\}/i);
    return match ? match[1].trim() : '';
  } catch {
    return '';
  }
}

function tabAttachmentKey(value) {
  return compactKey(String(value || ''));
}

function tabItemMatchKeys(item) {
  const keys = new Set();
  for (const value of [item && item.id, item && item.value, item && item.label]) {
    const key = tabAttachmentKey(value);
    if (key) keys.add(key);
  }
  return keys;
}

function nodeIsDescendantOf(node, ancestor) {
  try {
    for (let current = node; current; current = current.parent) {
      if (current && ancestor && current.id === ancestor.id) return true;
      if (current.type === 'PAGE') break;
    }
  } catch {
    return false;
  }
  return false;
}

function attachMarkedTabContent(exportedNodes, attachments, warnings) {
  if (!attachments || attachments.length === 0) return [];
  const unused = new Set(attachments);
  const visit = (node) => {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'Tabs') {
      const props = node.props || {};
      const items = tabsItemsFromProps(props);
      if (items.length) {
        const nextItems = items.map((item) => {
          const keys = tabItemMatchKeys(item);
          const matches = attachments.filter((attachment) => keys.has(attachment.key));
          if (!matches.length) return item;
          const children = [];
          if (Array.isArray(item.children)) children.push(...item.children);
          for (const match of matches) {
            children.push(...match.children);
            unused.delete(match);
          }
          return { ...item, children };
        });
        node.props = { ...props, items: nextItems };
      }
    }
    if (Array.isArray(node.children)) node.children.forEach(visit);
    if (node.props && Array.isArray(node.props.items)) {
      node.props.items.forEach((item) => {
        if (item && Array.isArray(item.children)) item.children.forEach(visit);
      });
    }
  };
  exportedNodes.forEach(visit);
  for (const attachment of unused) {
    warnings.push(`No Tabs item matched {tab=${attachment.label}} on "${attachment.nodeName}" — exported that content in place instead.`);
  }
  return [...unused];
}

function tabsConnectedPanelCount(instance) {
  const itemKeys = new Set();
  for (const item of tabsItemInstances(instance)) {
    const label = componentText(item, 'Label', namedTextLayerValue(item, 'Label', item.name || '')).trim();
    for (const key of tabItemMatchKeys({ id: tabsItemValue(item, label, new Set()), label })) itemKeys.add(key);
  }
  if (!itemKeys.size) return 0;
  const seenMarkers = new Set();
  const countInScope = (scope) => {
    let count = 0;
    const check = (node) => {
      try {
        if (!node || node.id === instance.id || nodeIsDescendantOf(node, instance)) return;
        if (seenMarkers.has(node.id)) return;
        const key = tabAttachmentKey(tabAttachmentName(node));
        if (key && itemKeys.has(key)) {
          seenMarkers.add(node.id);
          count += 1;
        }
      } catch {
        // Ignore transient nodes while auditing.
      }
    };
    check(scope);
    try {
      if (scope && typeof scope.findAll === 'function') {
        for (const node of scope.findAll((candidate) => Boolean(tabAttachmentName(candidate)))) check(node);
      }
    } catch {
      return count;
    }
    return count;
  };
  try {
    for (let scope = instance && instance.parent; scope && scope.type !== 'PAGE'; scope = scope.parent) {
      const count = countInScope(scope);
      if (count > 0) return count;
    }
    return countInScope(figma.currentPage);
  } catch {
    return 0;
  }
}

function tabsSlotCandidates(instance) {
  const current = currentInstance(instance);
  if (!current) return [];
  try {
    return current.findAll((node) => {
      try {
        return node.type === 'SLOT' || node.type === 'FRAME' || node.type === 'GROUP';
      } catch {
        return false;
      }
    });
  } catch {
    return [];
  }
}

function slotHasTabItems(slot) {
  try {
    return slot.findAll((node) => node.type === 'INSTANCE' && ['Tab Item', 'Tab'].includes(componentSetName(node))).length > 0;
  } catch {
    return false;
  }
}

function tabsItemSlot(instance) {
  const current = currentInstance(instance);
  const exact = tabsSlotCandidates(current).find((slot) => {
    try {
      return canonicalKey(slot.name) === canonicalKey(TABS_ITEMS_SLOT_NAME) && typeof slot.appendChild === 'function';
    } catch {
      return false;
    }
  });
  if (exact) return exact;

  let firstItem = null;
  try {
    firstItem = current.findOne((node) => node.type === 'INSTANCE' && ['Tab Item', 'Tab'].includes(componentSetName(node)));
  } catch {
    firstItem = null;
  }
  if (firstItem && firstItem.parent && 'appendChild' in firstItem.parent) return firstItem.parent;

  const named = ['Tab Items', 'Tabs Items', 'Tab List', 'Tabs List', 'Tab Bar', 'Tabs Bar', 'Tab Slot', 'Tabs Slot', 'Items']
    .map((name) => nativeSlot(current, name) || namedSlot(current, name))
    .find(Boolean);
  if (named) return named;

  return tabsSlotCandidates(current).find((slot) => {
    const key = canonicalKey(slot.name);
    return slotHasTabItems(slot)
      || ((key.includes('tab') || key.includes('tabs')) && (key.includes('item') || key.includes('list') || key.includes('bar') || key.includes('nav')));
  }) || null;
}

function tabsItemInstances(instance) {
  const current = currentInstance(instance);
  const slot = tabsItemSlot(current);
  const root = slot || current;
  try {
    return root.findAll((node) => {
      try {
        return node.type === 'INSTANCE' && ['Tab Item', 'Tab'].includes(componentSetName(node));
      } catch {
        return false;
      }
    });
  } catch {
    return [];
  }
}

function tabsItemValue(item, label, usedValues) {
  try {
    const stored = item.getPluginData('a1-tab-value');
    if (stored) {
      usedValues.add(stored);
      return stored;
    }
  } catch {
    // Stored values are a convenience; labels are the visible source.
  }
  const value = componentText(item, 'Value', namedTextLayerValue(item, 'Value', '')).trim();
  if (value) {
    usedValues.add(value);
    return value;
  }
  return slugifyOptionValue(label, usedValues);
}

function tabItemSelected(item) {
  for (const name of ['Selected', 'Active']) {
    const found = componentProperty(item, name);
    if (!found) continue;
    const value = found.property.value;
    return value === true || value === 'true' || value === 'selected' || value === 'active';
  }
  return false;
}

function exportTabItem(item, index, usedValues, warnings) {
  const label = componentText(item, 'Label', namedTextLayerValue(item, 'Label', item.name || `Tab ${index + 1}`)).trim() || `Tab ${index + 1}`;
  const value = tabsItemValue(item, label, usedValues);
  const out = { id: value, label };
  const showIcon = componentBoolean(item, 'Show icon', false);
  if (showIcon) {
    const icon = iconNameFromInstance(item, 'Icon') || iconNameFromSwapValue(componentPropertyValue(item, 'Icon', 'INSTANCE_SWAP'));
    if (icon) out.icon = icon;
    else warnings.push(`Tab "${label}" shows an icon, but its Material icon could not be resolved.`);
    const iconPosition = componentPropertyValue(item, 'Icon position', 'VARIANT');
    if (TAB_ICON_POSITIONS.includes(iconPosition) && iconPosition !== 'start') out.iconPosition = iconPosition;
  }
  const showCount = componentBoolean(item, 'Show count', false);
  const count = componentText(item, 'Count', namedTextLayerValue(item, 'Count', '')).trim();
  if (showCount && count) out.count = count;
  const status = componentPropertyValue(item, 'Status', 'VARIANT');
  if (TAB_STATUSES.includes(status) && status !== 'none') out.status = status === 'warning' ? 'warn' : status;
  return out;
}

function exportTabs(instance) {
  const warnings = [];
  const props = {};
  const variant = normalizedTabsVariant(componentPropertyValue(instance, 'Variant', 'VARIANT'));
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  const level = Number(componentPropertyValue(instance, 'Level', 'VARIANT') || componentPropertyValue(instance, 'Level', 'TEXT'));
  const labelMode = componentPropertyValue(instance, 'Label mode', 'VARIANT');
  const equalHeight = componentPropertyValue(instance, 'Equal height', 'BOOLEAN');
  if (TABS_VARIANTS.includes(variant) && variant !== 'line') props.variant = variant;
  if (TABS_SIZES.includes(size) && size !== 'default') props.size = size;
  if (TABS_LEVELS.includes(level) && level !== 1) props.level = level;
  if (TABS_LABEL_MODES.includes(labelMode) && labelMode !== 'all') props.labelMode = labelMode;
  if (equalHeight === true) props.equalHeight = true;

  const usedValues = new Set();
  const items = tabsItemInstances(instance).map((item, index) => exportTabItem(item, index, usedValues, warnings));
  if (items.length) {
    props.items = items;
    const selectedIndex = tabsItemInstances(instance).findIndex(tabItemSelected);
    props.value = items[selectedIndex >= 0 ? selectedIndex : 0].id;
  } else {
    warnings.push('Tabs item slot was not found — exported an empty items array.');
    props.items = [];
  }

  return { node: { id: componentId('Tabs', instance), type: 'Tabs', props }, warnings };
}

async function reconcileTabsItemInstances(instance, requestedCount, warnings) {
  const current = currentInstance(instance);
  const slot = tabsItemSlot(current);
  let items = tabsItemInstances(current);
  const itemSource = await findComponentSourceAsync('Tab Item', warnings) || await findComponentSourceAsync('Tab', warnings);
  if (!slot || !itemSource) {
    if (requestedCount !== items.length) {
      warnings.push(`Tabs has ${items.length} editable tab item(s); JSON supplied ${requestedCount}. Add a Tab Item slot/component to let the plugin reconcile item count.`);
    }
    return items;
  }
  const wanted = Math.max(1, Math.min(requestedCount, 12));
  if (requestedCount > 12) warnings.push(`Tabs supports up to 12 Figma tab items; ${requestedCount - 12} additional JSON item(s) were not rendered.`);
  while (items.length < wanted) {
    const liveSlot = tabsItemSlot(currentInstance(instance));
    if (!liveSlot) break;
    liveSlot.appendChild(itemSource.createInstance());
    items = tabsItemInstances(currentInstance(instance));
  }
  while (items.length > wanted) {
    const liveItems = tabsItemInstances(currentInstance(instance));
    liveItems[liveItems.length - 1].remove();
    items = tabsItemInstances(currentInstance(instance));
  }
  return items;
}

function queueTabSelectedProperty(item, assignments, selected) {
  for (const name of ['Selected', 'Active']) {
    const found = componentProperty(item, name);
    if (!found) continue;
    assignments[found.key] = found.property.type === 'BOOLEAN' ? selected : selected ? 'true' : 'false';
    return true;
  }
  return false;
}

async function applyTabItem(item, tab, selected, index, warnings) {
  const live = currentInstance(item);
  const assignments = {};
  try {
    live.setPluginData('a1-tab-value', tab.id || tab.value || '');
  } catch {
    // Value plugin data is only used to make round-trips stable.
  }
  queueOptionalComponentProperty(live, assignments, 'Label', tab.label, 'TEXT');
  queueOptionalComponentProperty(live, assignments, 'Value', tab.id || tab.value || '', 'TEXT');
  queueTabSelectedProperty(live, assignments, selected);
  const icon = typeof tab.icon === 'string' && tab.icon ? tab.icon : '';
  queueOptionalComponentProperty(live, assignments, 'Show icon', Boolean(icon), 'BOOLEAN');
  if (icon) {
    const iconComponent = findIconComponent(icon);
    if (iconComponent) queueOptionalComponentProperty(live, assignments, 'Icon', iconComponent.id, 'INSTANCE_SWAP');
    else warnings.push(`No Material icon component named "${icon}" exists in this file — tab ${index + 1} keeps its default glyph.`);
  }
  const iconPosition = TAB_ICON_POSITIONS.includes(tab.iconPosition) ? tab.iconPosition : 'start';
  queueOptionalComponentProperty(live, assignments, 'Icon position', iconPosition, 'VARIANT');
  const count = tab.count === undefined || tab.count === null ? '' : String(tab.count);
  queueOptionalComponentProperty(live, assignments, 'Count', count, 'TEXT');
  queueOptionalComponentProperty(live, assignments, 'Show count', count !== '', 'BOOLEAN');
  const status = TAB_STATUSES.includes(tab.status) ? (tab.status === 'warning' ? 'warn' : tab.status) : 'none';
  queueOptionalComponentProperty(live, assignments, 'Status', status, 'VARIANT');
  applyQueuedProperties(live, assignments, warnings, `Tabs item ${index + 1} properties`);
  if (!componentProperty(live, 'Label', 'TEXT')) await writeNamedText(live, 'Label', tab.label, warnings, `Tabs item ${index + 1}`);
}

function tabsPanelChildrenForNode(node, activeValue) {
  const props = node.props || {};
  if (Array.isArray(props.panels)) {
    const panel = props.panels.find((entry) => entry && typeof entry === 'object' && (entry.id === activeValue || entry.value === activeValue));
    if (panel && Array.isArray(panel.children)) return panel.children;
  }
  const tabs = tabsItemsFromProps(props);
  const activeTab = tabs.find((tab) => tab.id === activeValue || tab.value === activeValue);
  if (activeTab && Array.isArray(activeTab.children)) return activeTab.children;
  return Array.isArray(node.children) ? node.children : [];
}

async function warnUnsupportedTabsPanelChildren(children, warnings) {
  if (!children.length) return;
  warnings.push('Tabs panel children are not represented in the current A1 Figma Tabs component; only Tab items were rendered.');
}

async function applyTabs(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const live = currentInstance(instance);
  const assignments = {};
  const variant = normalizedTabsVariant(props.variant) || 'line';
  const size = props.size === 'compact' ? 'compact' : 'default';
  const level = TABS_LEVELS.includes(Number(props.level)) ? Number(props.level) : 1;
  const labelMode = TABS_LABEL_MODES.includes(props.labelMode) ? props.labelMode : 'all';
  queueOptionalComponentProperty(live, assignments, 'Variant', variant, 'VARIANT');
  queueOptionalComponentProperty(live, assignments, 'Size', size, 'VARIANT');
  queueOptionalComponentProperty(live, assignments, 'Level', String(level), 'VARIANT')
    || queueOptionalComponentProperty(live, assignments, 'Level', String(level), 'TEXT');
  queueOptionalComponentProperty(live, assignments, 'Label mode', labelMode, 'VARIANT');
  queueOptionalComponentProperty(live, assignments, 'Equal height', props.equalHeight === true, 'BOOLEAN');
  applyQueuedProperties(live, assignments, warnings, 'Tabs properties');

  const tabs = tabsItemsFromProps(props);
  const items = await reconcileTabsItemInstances(instance, tabs.length || 1, warnings);
  const activeValue = typeof props.value === 'string' && props.value ? props.value : tabs[0]?.id || tabs[0]?.value || '';
  for (let index = 0; index < Math.min(items.length, tabs.length); index += 1) {
    await applyTabItem(items[index], tabs[index], tabs[index].id === activeValue || tabs[index].value === activeValue, index, warnings);
  }
  if (tabs.length === 0) warnings.push('Tabs JSON had no props.items array; the default Figma tab item was retained.');
  await warnUnsupportedTabsPanelChildren(tabsPanelChildrenForNode(node, activeValue), warnings);
  for (const key of ['onChange', 'className']) {
    if (props[key] !== undefined) warnings.push(`Tabs "${key}" is runtime-only and was not represented in Figma.`);
  }
}

async function importTabs(node, warnings) {
  const instance = await createComponentInstance('Tabs', warnings);
  await applyTabs(instance, node, warnings);
  return instance;
}

function exportAccordion(instance) {
  const props = {};
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  const open = componentPropertyValue(instance, 'Open', 'VARIANT');
  if (ACCORDION_SIZES.includes(size) && size !== 'md') props.size = size;
  if (open === 'true' || open === true) props.defaultOpen = true;
  const label = namedTextValue(instance, 'Label').trim();
  const subtext = namedTextValue(instance, 'Subtext').trim();
  if (label) props.label = label;
  if (subtext) props.subtext = subtext;
  const warnings = [];
  const slot = nativeSlot(instance, 'Content Slot');
  const children = slot ? exportFreeContent(slot, warnings) : [];
  if (!slot) warnings.push('Accordion Content Slot was not found — children were not exported.');
  return { node: { id: componentId('Accordion', instance), type: 'Accordion', props, ...(children.length ? { children } : {}) }, warnings };
}

async function applyAccordion(instance, node, warnings) {
  const props = node.props || {};
  setVariant(instance, 'Size', ACCORDION_SIZES.includes(props.size) ? props.size : 'md', warnings, 'Accordion');
  setVariant(instance, 'Open', props.open === true || props.defaultOpen === true ? 'true' : 'false', warnings, 'Accordion');
  if (typeof props.label === 'string') await writeNamedText(instance, 'Label', props.label, warnings, 'Accordion');
  if (typeof props.subtext === 'string') await writeNamedText(instance, 'Subtext', props.subtext, warnings, 'Accordion');
}

async function importAccordion(node, warnings) {
  const instance = await createComponentInstance('Accordion', warnings);
  await applyAccordion(instance, node, warnings);
  if (Array.isArray(node.children) && node.children.length) {
    const props = node.props || {};
    const shouldRemainCollapsed = props.open !== true && props.defaultOpen !== true;
    const slot = nativeSlot(instance, 'Content Slot');
    if (!slot && shouldRemainCollapsed) {
      setVariant(instance, 'Open', 'true', warnings, 'Accordion');
    }
    await replaceNativeSlotChildren(instance, 'Content Slot', node.children, warnings, 'Accordion');
    if (shouldRemainCollapsed) setVariant(instance, 'Open', 'false', warnings, 'Accordion');
  }
  return instance;
}

function exportPagination(instance) {
  const props = {};
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  if (PAGINATION_SIZES.includes(size) && size !== 'md') props.size = size;
  const labels = namedTextValue(instance, 'Label', '');
  const all = currentInstance(instance).findAll((node) => node.type === 'TEXT' && canonicalKey(node.name) === 'label').map((node) => node.characters);
  const pages = all.filter((value) => /^\\d+$/.test(value)).map(Number);
  props.page = pages[1] || pages[0] || 1;
  props.totalPages = pages.length ? Math.max(...pages) : 1;
  return { node: { id: componentId('Pagination', instance), type: 'Pagination', props }, warnings: labels ? [] : [] };
}

async function applyPagination(instance, node, warnings) {
  const props = node.props || {};
  setVariant(instance, 'Size', PAGINATION_SIZES.includes(props.size) ? props.size : 'md', warnings, 'Pagination');
  if (props.page !== undefined || props.totalPages !== undefined) warnings.push('Pagination page range is represented by editable visual labels; its item count is fixed in the Figma component.');
}

async function importPagination(node, warnings) {
  const instance = await createComponentInstance('Pagination', warnings);
  await applyPagination(instance, node, warnings);
  return instance;
}

function pageNavItemsContainer(instance) {
  const current = currentInstance(instance);
  try {
    const exact = current.findOne((node) => node.type === 'FRAME' && node.name === 'Items');
    if (exact) return exact;
  } catch {
    return null;
  }
  try {
    return current.findOne((node) =>
      node.type === 'FRAME'
      && canonicalKey(node.name).includes('items')
      && node.findOne((child) => child.type === 'INSTANCE' && componentSetName(child) === 'Page Nav Item'));
  } catch {
    return null;
  }
}

function pageNavItemInstances(instance) {
  const container = pageNavItemsContainer(instance);
  if (!container) return [];
  try {
    const direct = container.children.filter((node) => node.type === 'INSTANCE' && componentSetName(node) === 'Page Nav Item');
    return direct.length ? direct : container.findAll((node) => node.type === 'INSTANCE' && componentSetName(node) === 'Page Nav Item');
  } catch {
    return [];
  }
}

function pageNavSectionsFromProps(props) {
  const sections = Array.isArray(props.sections) ? props.sections : [];
  const used = new Set();
  return sections
    .filter((section) => section && typeof section === 'object')
    .map((section, index) => {
      const label = typeof section.label === 'string' && section.label.trim() ? section.label.trim() : `Section ${index + 1}`;
      const id = typeof section.id === 'string' && section.id.trim()
        ? section.id.trim()
        : slugifyOptionValue(label, used);
      used.add(id);
      return {
        id,
        label,
        level: Number(section.level) === 2 ? 2 : 1,
      };
    });
}

function exportPageNav(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};
  const label = namedTextValue(instance, 'On this page', '').trim();
  if (label && label !== 'On this page') props.label = label;

  const usedIds = new Set();
  const sections = [];
  const items = pageNavItemInstances(instance).filter((item) => item.visible !== false);
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const itemLabel = componentPropertyValue(item, 'Label', 'TEXT') || namedTextLayerValue(item, 'Section heading', item.name || `Section ${index + 1}`);
    const section = {
      id: slugifyOptionValue(itemLabel, usedIds),
      label: itemLabel,
    };
    const level = Number(componentPropertyValue(item, 'Level', 'VARIANT'));
    if (level === 2) section.level = 2;
    const state = componentPropertyValue(item, 'State', 'VARIANT');
    if (state === 'active') warnings.push(`Page Nav item "${itemLabel}" is visually active in Figma; active section is runtime-owned and was not exported.`);
    sections.push(section);
  }
  if (sections.length) props.sections = sections;
  else warnings.push('Page Nav items were not found — exported an empty sections array.');
  return { node: { id: componentId('PageNav', instance), type: 'PageNav', props }, warnings };
}

async function applyPageNav(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const label = typeof props.label === 'string' && props.label.trim() ? props.label.trim() : 'On this page';
  await writeNamedText(instance, 'On this page', label, warnings, 'Page Nav');

  const sections = pageNavSectionsFromProps(props);
  const items = pageNavItemInstances(instance);
  if (!items.length) {
    warnings.push('Page Nav Items frame was not found — sections were not applied.');
    return instance;
  }
  if (sections.length > items.length) {
    warnings.push(`Page Nav Figma component has ${items.length} editable item rows; ${sections.length - items.length} additional section(s) were not rendered. Add an item slot if Page Nav needs variable section counts.`);
  }
  const visibleCount = Math.min(Math.max(sections.length, 1), Math.min(items.length, PAGE_NAV_MAX_SECTIONS));
  for (let index = 0; index < items.length; index += 1) {
    const item = currentInstance(items[index]);
    const section = sections[index] || { label: `Section ${index + 1}`, level: 1 };
    try {
      item.visible = index < visibleCount;
    } catch {
      // Visibility overrides on instance children can be unavailable while Figma refreshes.
    }
    if (index >= visibleCount) continue;
    const assignments = {};
    queueComponentProperty(item, assignments, 'Label', section.label, 'TEXT', warnings, `Page Nav item ${index + 1} label`);
    queueComponentProperty(item, assignments, 'Level', String(section.level === 2 ? 2 : 1), 'VARIANT', warnings, `Page Nav item ${index + 1} level`);
    queueComponentProperty(item, assignments, 'State', index === 0 ? 'active' : 'default', 'VARIANT', warnings, `Page Nav item ${index + 1} state`);
    applyQueuedProperties(item, assignments, warnings, `Page Nav item ${index + 1} properties`);
  }
  for (const runtimeProp of ['activeId', 'onNavigate', 'className']) {
    if (props[runtimeProp] !== undefined) warnings.push(`PageNav "${runtimeProp}" is runtime-owned and was not represented in Figma.`);
  }
  return instance;
}

async function importPageNav(node, warnings) {
  const instance = await createComponentInstance('Page Nav', warnings);
  await applyPageNav(instance, node, warnings);
  return instance;
}

function isTreeMenuItemInstance(node) {
  try {
    if (!node || node.type !== 'INSTANCE') return false;
    const name = registeredSetName(node) || componentSetName(node);
    return TREE_MENU_ITEM_SET_NAMES.has(name);
  } catch {
    return false;
  }
}

function treeMenuItemInstances(instance) {
  try {
    return currentInstance(instance).findAll((node) => isTreeMenuItemInstance(node));
  } catch {
    return [];
  }
}

function treeMenuItemLabel(item, fallback) {
  return componentText(item, 'Label', '')
    || namedTextLayerValueAny(item, ['Label', 'Title', 'Name'], '')
    || fallback;
}

function treeMenuItemDepth(item) {
  const rawLevel = componentPropertyValue(item, 'Level', 'VARIANT')
    ?? componentPropertyValue(item, 'Level', 'TEXT');
  const rawDepth = componentPropertyValue(item, 'Depth', 'VARIANT')
    ?? componentPropertyValue(item, 'Depth', 'TEXT')
    ?? componentPropertyValue(item, 'Indent', 'VARIANT')
    ?? componentPropertyValue(item, 'Indent', 'TEXT');
  const parse = (value) => {
    if (value === undefined || value === null || value === '') return null;
    const match = String(value).match(/-?\d+/);
    if (!match) return null;
    return Math.max(0, Number(match[0]));
  };
  const level = parse(rawLevel);
  if (level !== null) return Math.max(0, level - 1);
  const depth = parse(rawDepth);
  return depth === null ? 0 : depth;
}

function treeMenuState(item) {
  return String(
    componentPropertyValue(item, 'State', 'VARIANT')
    ?? componentPropertyValue(item, 'Selected', 'VARIANT')
    ?? componentPropertyValue(item, 'Active', 'VARIANT')
    ?? '',
  ).toLowerCase();
}

function treeMenuItemExpanded(item) {
  for (const name of ['Expanded', 'Open']) {
    const bool = componentPropertyValue(item, name, 'BOOLEAN');
    if (typeof bool === 'boolean') return bool;
    const variant = componentPropertyValue(item, name, 'VARIANT');
    if (typeof variant === 'string') {
      const value = variant.toLowerCase();
      if (['true', 'yes', 'open', 'expanded'].includes(value)) return true;
      if (['false', 'no', 'closed', 'collapsed'].includes(value)) return false;
    }
  }
  return false;
}

function treeMenuNestedItemsFromFlat(flatItems) {
  const roots = [];
  const stack = [];
  for (const entry of flatItems) {
    const item = entry.item;
    const depth = Math.max(0, entry.depth || 0);
    while (stack.length > depth) stack.pop();
    if (stack.length === 0) roots.push(item);
    else {
      const parent = stack[stack.length - 1];
      parent.children = parent.children || [];
      parent.children.push(item);
    }
    stack[depth] = item;
  }
  return roots;
}

function cleanTreeMenuItem(item) {
  const cleaned = { ...item };
  if (Array.isArray(cleaned.children)) {
    cleaned.children = cleaned.children.map(cleanTreeMenuItem).filter(Boolean);
    if (cleaned.children.length === 0) delete cleaned.children;
  }
  return cleaned;
}

function flattenTreeMenuItems(items, depth = 0, out = []) {
  if (!Array.isArray(items)) return out;
  for (const raw of items) {
    if (!raw || typeof raw !== 'object') continue;
    const label = typeof raw.label === 'string' && raw.label.trim() ? raw.label.trim() : `Item ${out.length + 1}`;
    const item = {
      id: typeof raw.id === 'string' && raw.id.trim() ? raw.id.trim() : slugifyOptionValue(label, new Set(out.map((entry) => entry.item.id))),
      label,
    };
    if (typeof raw.icon === 'string' && raw.icon.trim()) item.icon = raw.icon.trim();
    if (typeof raw.href === 'string' && raw.href.trim()) item.href = raw.href.trim();
    if (raw.disabled === true) item.disabled = true;
    out.push({ depth, item });
    flattenTreeMenuItems(raw.children, depth + 1, out);
  }
  return out;
}

function exportTreeMenu(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};

  const variant = componentPropertyValue(instance, 'Variant', 'VARIANT')
    ?? componentPropertyValue(instance, 'Mode', 'VARIANT');
  if (TREE_MENU_VARIANTS.includes(variant) && variant !== 'expanded') props.variant = variant;
  const showExpandControls = componentPropertyValue(instance, 'Show expand controls', 'BOOLEAN')
    ?? componentPropertyValue(instance, 'Expand controls', 'BOOLEAN');
  if (showExpandControls === true) props.showExpandControls = true;
  const draggable = componentPropertyValue(instance, 'Draggable', 'BOOLEAN');
  if (draggable === true) props.draggable = true;

  const usedIds = new Set();
  const flatItems = [];
  const expandedIds = [];
  let selectedId = '';
  const itemRows = treeMenuItemInstances(instance).filter((item) => item.visible !== false);
  for (let index = 0; index < itemRows.length; index += 1) {
    const row = itemRows[index];
    const label = treeMenuItemLabel(row, `Item ${index + 1}`);
    const id = slugifyOptionValue(label, usedIds);
    const item = { id, label };
    const icon = iconNameFromInstance(row, 'Icon')
      || iconNameFromSwapValue(componentPropertyValue(row, 'Icon', 'INSTANCE_SWAP'));
    if (icon) item.icon = icon;
    const href = componentPropertyValue(row, 'Href', 'TEXT')
      || componentPropertyValue(row, 'URL', 'TEXT')
      || componentPropertyValue(row, 'Url', 'TEXT');
    if (typeof href === 'string' && href.trim()) item.href = href.trim();
    const state = treeMenuState(row);
    if (state.includes('disabled')) item.disabled = true;
    if (!selectedId && (state.includes('selected') || state.includes('active'))) selectedId = id;
    if (treeMenuItemExpanded(row)) expandedIds.push(id);
    flatItems.push({ depth: treeMenuItemDepth(row), item });
  }

  const items = treeMenuNestedItemsFromFlat(flatItems).map(cleanTreeMenuItem);
  if (items.length > 0) props.items = items;
  else warnings.push('No visible Tree Menu item rows were found — exported an empty items array.');
  if (selectedId) props.selectedId = selectedId;
  if (expandedIds.length > 0) props.expandedIds = expandedIds;
  return { node: { id: componentId('TreeMenu', instance), type: 'TreeMenu', props }, warnings };
}

function treeMenuItemsFromProps(props) {
  const items = Array.isArray(props.items) ? props.items : [];
  return flattenTreeMenuItems(items);
}

function applyTreeMenuItem(instance, entry, props, warnings, index) {
  const item = entry.item;
  const selected = typeof props.selectedId === 'string' && props.selectedId === item.id;
  const expanded = Array.isArray(props.expandedIds) && props.expandedIds.includes(item.id);
  const state = item.disabled === true ? 'disabled' : selected ? 'selected' : 'default';
  const assignments = {};
  queueComponentProperty(instance, assignments, 'Label', item.label, 'TEXT', warnings, `Tree Menu item ${index + 1} label`);
  queueOptionalComponentProperty(instance, assignments, 'State', state, 'VARIANT')
    || queueOptionalComponentProperty(instance, assignments, 'Selected', selected ? 'true' : 'false', 'VARIANT');
  queueOptionalComponentProperty(instance, assignments, 'Level', String(entry.depth + 1), 'VARIANT')
    || queueOptionalComponentProperty(instance, assignments, 'Depth', String(entry.depth), 'VARIANT')
    || queueOptionalComponentProperty(instance, assignments, 'Indent', String(entry.depth), 'VARIANT');
  queueOptionalComponentProperty(instance, assignments, 'Expanded', expanded, 'BOOLEAN')
    || queueOptionalComponentProperty(instance, assignments, 'Expanded', expanded ? 'true' : 'false', 'VARIANT')
    || queueOptionalComponentProperty(instance, assignments, 'Open', expanded, 'BOOLEAN')
    || queueOptionalComponentProperty(instance, assignments, 'Open', expanded ? 'true' : 'false', 'VARIANT');
  const icon = typeof item.icon === 'string' ? item.icon : '';
  queueOptionalComponentProperty(instance, assignments, 'Show icon', Boolean(icon), 'BOOLEAN');
  if (icon) {
    const iconComponent = findIconComponent(icon);
    if (iconComponent) queueOptionalComponentProperty(instance, assignments, 'Icon', iconComponent.id, 'INSTANCE_SWAP');
    else warnings.push(`No icon component named "${icon}" exists in this file — Tree Menu item "${item.label}" keeps the default glyph.`);
  }
  if (typeof item.href === 'string' && item.href) {
    queueOptionalComponentProperty(instance, assignments, 'Href', item.href, 'TEXT')
      || queueOptionalComponentProperty(instance, assignments, 'URL', item.href, 'TEXT')
      || warnings.push(`Tree Menu item "${item.label}" href is runtime-owned unless the Figma item exposes an Href/URL property.`);
  }
  applyQueuedProperties(instance, assignments, warnings, `Tree Menu item ${index + 1} properties`);
}

async function applyTreeMenu(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const assignments = {};
  queueOptionalComponentProperty(instance, assignments, 'Variant', TREE_MENU_VARIANTS.includes(props.variant) ? props.variant : 'expanded', 'VARIANT')
    || queueOptionalComponentProperty(instance, assignments, 'Mode', TREE_MENU_VARIANTS.includes(props.variant) ? props.variant : 'expanded', 'VARIANT');
  queueOptionalComponentProperty(instance, assignments, 'Show expand controls', props.showExpandControls === true, 'BOOLEAN')
    || queueOptionalComponentProperty(instance, assignments, 'Expand controls', props.showExpandControls === true, 'BOOLEAN');
  queueOptionalComponentProperty(instance, assignments, 'Draggable', props.draggable === true, 'BOOLEAN');
  applyQueuedProperties(instance, assignments, warnings, 'Tree Menu properties');

  const allItems = treeMenuItemsFromProps(props);
  const items = allItems.slice(0, TREE_MENU_MAX_ITEMS);
  const rows = treeMenuItemInstances(instance);
  if (allItems.length > TREE_MENU_MAX_ITEMS) {
    warnings.push(`Tree Menu supports ${TREE_MENU_MAX_ITEMS} imported item rows; additional JSON items were not rendered.`);
  }
  if (!rows.length) {
    if (items.length > 0) warnings.push('Tree Menu item rows were not found — item data was not applied to the Figma component.');
    return instance;
  }
  if (items.length > rows.length) {
    warnings.push(`Tree Menu Figma component has ${rows.length} editable item row${rows.length === 1 ? '' : 's'}; ${items.length - rows.length} additional JSON item(s) were not rendered.`);
  }
  for (let index = 0; index < rows.length; index += 1) {
    const row = currentInstance(rows[index]);
    const entry = items[index];
    try { row.visible = Boolean(entry); } catch { /* nested visibility can be locked */ }
    if (!entry) continue;
    applyTreeMenuItem(row, entry, props, warnings, index);
  }
  for (const runtimeProp of ['onSelect', 'onExpandedChange', 'onHoverChange', 'onItemContextMenu', 'onMove', 'editingId', 'onRenameStart', 'onRenameCommit', 'onRenameCancel']) {
    if (props[runtimeProp] !== undefined) warnings.push(`TreeMenu "${runtimeProp}" is runtime-owned and was not represented in Figma.`);
  }
  return instance;
}

async function importTreeMenu(node, warnings) {
  const instance = await createComponentInstance('Tree Menu', warnings);
  await applyTreeMenu(instance, node, warnings);
  return instance;
}

function exportEmptyState(instance) {
  instance = currentInstance(instance);
  const props = {};
  const scale = componentPropertyValue(instance, 'Scale', 'VARIANT');
  if (EMPTY_STATE_SCALES.includes(scale) && scale !== 'section') props.scale = scale;
  const iconName = iconNameFromInstance(instance, 'Icon') || iconNameFromSwapValue(componentPropertyValue(instance, 'Icon', 'INSTANCE_SWAP'));
  if (iconName && iconName !== 'inbox') props.icon = iconName;
  const title = namedTextValue(instance, 'Title').trim();
  const description = namedTextValue(instance, 'Description').trim();
  if (title) props.title = title;
  if (description) props.description = description;
  return { node: { id: componentId('MessageEmptyState', instance), type: 'MessageEmptyState', props }, warnings: [] };
}

async function applyEmptyState(instance, node, warnings) {
  const props = node.props || {};
  setVariant(instance, 'Scale', EMPTY_STATE_SCALES.includes(props.scale) ? props.scale : 'section', warnings, 'Empty State');
  const iconName = typeof props.icon === 'string' && props.icon.trim() ? props.icon.trim() : 'inbox';
  const icon = findIconComponent(iconName);
  if (icon) {
    const assignments = {};
    queueComponentProperty(currentInstance(instance), assignments, 'Icon', icon.id, 'INSTANCE_SWAP', warnings, 'Empty State icon');
    applyQueuedProperties(currentInstance(instance), assignments, warnings, 'Empty State properties');
  } else {
    warnings.push(`No Material icon component named "${iconName}" exists in this file — the Empty State inbox glyph was retained.`);
  }
  if (typeof props.title === 'string') await writeNamedText(instance, 'Title', props.title, warnings, 'Empty State');
  if (typeof props.description === 'string') await writeNamedText(instance, 'Description', props.description, warnings, 'Empty State');
}

async function importEmptyState(node, warnings) {
  const instance = await createComponentInstance('Empty State', warnings);
  await applyEmptyState(instance, node, warnings);
  return instance;
}

function exportSelect(instance) {
  const warnings = [];
  const props = {};
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  const state = componentPropertyValue(instance, 'State', 'VARIANT');
  const label = componentPropertyValue(instance, 'Label', 'TEXT');
  const hint = componentPropertyValue(instance, 'Hint', 'TEXT');
  const error = componentPropertyValue(instance, 'Error message', 'TEXT');
  const value = componentPropertyValue(instance, 'Value', 'TEXT');
  const showValue = componentPropertyValue(instance, 'Show value', 'BOOLEAN');
  const required = componentPropertyValue(instance, 'Required', 'BOOLEAN');

  if (SELECT_SIZES.includes(size) && size !== 'default') props.size = size;
  if (typeof label === 'string' && label) props.label = label;
  if (required === true) props.required = true;
  if (state === 'disabled') props.disabled = true;
  if (state === 'error') {
    if (typeof error === 'string' && error) props.error = error;
    else warnings.push('Select State=error has no Error message text — the error prop was omitted.');
  } else if (typeof hint === 'string' && hint) {
    props.hint = hint;
  }
  if (!SELECT_STATES.includes(state)) warnings.push(`Select State=${state || 'unknown'} is not represented by the current Figma bridge.`);
  if (showValue === true) {
    props.showValue = true;
    if (typeof value === 'string' && value) props.defaultValue = value;
    else warnings.push('Select Show value is enabled but its Value text is empty.');
  }

  return {
    node: { id: componentId('SelectField', instance), type: 'SelectField', props },
    warnings,
  };
}

function exportGroupOptions(instance, optionSetName, warnings) {
  const usedValues = new Set();
  const options = [];
  const selected = [];
  for (const optionInstance of instance.findAll((node) => node.type === 'INSTANCE' && componentSetName(node) === optionSetName)) {
    if (optionInstance.visible === false) continue;
    const label = componentPropertyValue(optionInstance, 'Label', 'TEXT') || 'Option';
    const value = slugifyOptionValue(label, usedValues);
    const option = { value, label };
    const hint = componentPropertyValue(optionInstance, 'Hint', 'TEXT');
    if (componentPropertyValue(optionInstance, 'Show hint', 'BOOLEAN') === true && typeof hint === 'string' && hint) option.hint = hint;
    if (componentPropertyValue(optionInstance, 'selected', 'VARIANT') === 'true') selected.push(value);
    const state = componentPropertyValue(optionInstance, 'state', 'VARIANT');
    if (state === 'hover') warnings.push(`Option "${label}" is in a visual-only hover state — no JSON prop was emitted.`);
    options.push(option);
  }
  return { options, selected };
}

function exportLegacyChoiceGroup(instance, type, optionSetName) {
  const warnings = [];
  const props = {};
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  const inline = componentPropertyValue(instance, 'Inline', 'VARIANT');
  const label = componentPropertyValue(instance, 'Label', 'TEXT');
  const hint = componentPropertyValue(instance, 'Helper', 'TEXT');
  const showHelper = componentPropertyValue(instance, 'Show helper', 'BOOLEAN');
  const required = componentPropertyValue(instance, 'Required', 'BOOLEAN');
  const { options, selected } = exportGroupOptions(instance, optionSetName, warnings);

  if (GROUP_SIZES.includes(size) && size !== 'default') props.size = size;
  if (inline === 'True') props.inline = true;
  if (typeof label === 'string' && label) props.label = label;
  if (typeof hint === 'string' && hint && showHelper !== false) props.hint = hint;
  if (required === true) props.required = true;
  if (options.length > 0) props.options = options;
  if (type === 'RadioGroup' && selected.length > 0) props.defaultValue = selected[0];
  if (type === 'CheckboxGroup' && selected.length > 0) props.defaultValue = selected;
  if (selected.length > 0) warnings.push('Option values are derived from visible option labels because the Figma component has no value property.');

  return { node: { id: componentId(type, instance), type, props }, warnings };
}

function exportRadioGroup(instance) {
  return exportLegacyChoiceGroup(instance, 'RadioGroup', 'Radio Option');
}

function exportCheckboxGroup(instance) {
  return exportLegacyChoiceGroup(instance, 'CheckboxGroup', 'Checkbox Option');
}

function exportMenuItem(instance, index, warnings) {
  const type = componentPropertyValue(instance, 'Type', 'VARIANT');
  if (type === 'Divider') return { id: `menu-divider-${index + 1}`, kind: 'divider' };
  const label = componentPropertyValue(instance, 'Label', 'TEXT') || (type === 'Menu Section' ? 'Section' : 'Menu item');
  if (type === 'Menu Section') return { id: `menu-section-${index + 1}`, kind: 'section', label };

  const item = { id: `menu-item-${index + 1}`, kind: 'item', label, icon: '', shortcut: '', destructive: false };
  const state = componentPropertyValue(instance, 'State', 'VARIANT');
  const showIcon = componentPropertyValue(instance, 'Show icon', 'BOOLEAN');
  const showShortcut = componentPropertyValue(instance, 'Show shortcut', 'BOOLEAN');
  if (showIcon === true) {
    const iconName = iconNameFromSwapValue(componentPropertyValue(instance, 'Icon', 'INSTANCE_SWAP'));
    if (iconName) item.icon = iconName;
    else warnings.push(`Menu item "${label}" has an icon that could not be resolved — icon omitted.`);
  }
  if (showShortcut === true) item.shortcut = componentPropertyValue(instance, 'Shortcut', 'TEXT') || '';
  if (state === 'destructive') item.destructive = true;
  if (state === 'active') item.active = true;
  if (state === 'disabled') item.disabled = true;
  if (MENU_ITEM_VISUAL_STATES.includes(state)) {
    warnings.push(`Menu item "${label}" is in a visual-only ${state} state — no state prop was emitted.`);
  }
  return item;
}

function exportMenu(instance) {
  const warnings = [];
  const items = menuItemInstances(instance)
    .filter((item) => item.visible !== false)
    .map((item, index) => exportMenuItem(item, index, warnings));
  const props = { items };
  if (items.length === 0) warnings.push('No visible Menu Item slot instances were found — exported an empty items array.');
  return { node: { id: componentId('Menu', instance), type: 'Menu', props }, warnings };
}

function menuContextForSelection(instance) {
  const rows = menuItemInstances(instance);
  const rowCount = rows.filter((row) => row.visible !== false).length;
  const maxRows = rows.length;
  return {
    rowCount,
    maxRows,
    rowCountOptions: maxRows > 0
      ? Array.from({ length: maxRows }, (_, index) => String(index + 1))
      : ['0'],
  };
}

function dialogBodySlot(instance) {
  return nativeSlot(instance, 'Body Slot')
    || nativeSlot(instance, 'Dialog Body Slot')
    || nativeSlot(instance, 'Content Slot')
    || nativeSlot(instance, 'Body')
    || namedSlot(instance, 'Body Slot')
    || namedSlot(instance, 'Dialog Body Slot')
    || namedSlot(instance, 'Content Slot')
    || namedSlot(instance, 'Body')
    || instance.findOne((node) => node.type === 'SLOT' && canonicalKey(node.name) === 'bodyslot');
}

const DIALOG_FOOTER_CONTAINER_KEYS = new Set([
  'footer',
  'footerslot',
  'dialogfooter',
  'dialogfooterslot',
  'footeractions',
  'dialogfooteractions',
  'footerbuttonslot',
  'footerbuttons',
  'actionslot',
  'actionsslots',
]);

function isDialogFooterContainer(node) {
  try {
    if (!node || !['SLOT', 'FRAME', 'GROUP'].includes(node.type)) return false;
    const key = canonicalKey(node.name || '');
    if (DIALOG_FOOTER_CONTAINER_KEYS.has(key)) return true;
    return key.includes('footer') && (key.includes('slot') || key.includes('action') || key.includes('button'));
  } catch {
    return false;
  }
}

function dialogFooterSlot(instance) {
  const live = currentInstance(instance);
  return nativeSlot(live, 'Footer Slot')
    || nativeSlot(live, 'Dialog Footer Slot')
    || nativeSlot(live, 'Footer Actions')
    || nativeSlot(live, 'Footer')
    || namedSlot(live, 'Footer Slot')
    || namedSlot(live, 'Dialog Footer Slot')
    || namedSlot(live, 'Footer Actions')
    || namedSlot(live, 'Footer')
    || live.findOne(isDialogFooterContainer);
}

function isDialogFooterButton(node) {
  try {
    return node.type === 'INSTANCE' && registeredSetName(node) === 'Button' && node.visible !== false;
  } catch {
    return false;
  }
}

function hasDialogFooterAncestor(node, root) {
  for (let parent = node && node.parent; parent; parent = parent.parent) {
    if (parent.id === root.id) return false;
    if (isDialogFooterContainer(parent)) return true;
  }
  return false;
}

function dialogFooterButtons(instance) {
  const live = currentInstance(instance);
  const buttons = [];
  const seen = new Set();
  const addButton = (button) => {
    if (!button || seen.has(button.id)) return;
    seen.add(button.id);
    buttons.push(button);
  };
  const scan = (root) => {
    if (!root) return;
    try {
      if ('children' in root) root.children.filter(isDialogFooterButton).forEach(addButton);
      if ('findAll' in root) root.findAll(isDialogFooterButton).forEach(addButton);
    } catch {
      // Figma can expose stale inherited slot descendants during instance edits.
    }
  };

  scan(dialogFooterSlot(live));
  try {
    live
      .findAll((node) => isDialogFooterButton(node) && hasDialogFooterAncestor(node, live))
      .forEach(addButton);
  } catch {
    // Treat unavailable descendants as no extra buttons.
  }
  return buttons;
}

function dialogSlotBodyText(instance) {
  const slot = dialogBodySlot(instance);
  // Figma's default body child is inherited from the main component and cannot
  // be read reliably through an instance slot. The bridge-created replacement
  // is an editable local TEXT node, so prefer it for a faithful export.
  const replacement = slot && slot.children.find((node) => node.type === 'TEXT' && !node.id.startsWith('I'));
  if (replacement && replacement.type === 'TEXT') return replacement.characters;
  try {
    const text = slot && slot.findOne((node) => node.type === 'TEXT' && node.visible !== false);
    if (text && typeof text.characters === 'string') return text.characters;
  } catch {
    // Slot descendants can be stale immediately after component property edits.
  }
  return namedTextLayerValueAny(instance, ['Body', 'Dialog Body', 'Description', 'Content'], '') || null;
}

function dialogBodyChildren(instance, warnings) {
  const slot = dialogBodySlot(instance);
  if (!slot) {
    warnings.push('Dialog Body Slot was not found — body children were not exported.');
    return [];
  }
  return exportFreeContent(slot, warnings);
}

function dialogBooleanPropertyValue(instance, names) {
  for (const name of names) {
    const value = componentPropertyValue(instance, name, 'BOOLEAN');
    if (typeof value === 'boolean') return value;
  }
  return undefined;
}

function dialogCloseLayerVisible(instance) {
  const live = currentInstance(instance);
  const closeKeys = new Set(['close', 'closebutton', 'closeicon', 'dialogclose', 'dialogclosebutton']);
  try {
    const closeLayer = live.findOne((node) => {
      try {
        if (!node || node.type === 'PAGE') return false;
        const key = canonicalKey(node.name || '');
        if (closeKeys.has(key)) return true;
        if (node.type !== 'INSTANCE') return false;
        const name = canonicalKey(componentSetName(node));
        if (name !== 'iconbutton' && name !== 'button') return false;
        const label = canonicalKey(componentText(node, 'Label', componentText(node, 'Accessible label', '')));
        const icon = canonicalKey(iconNameFromInstance(node) || componentText(node, 'Icon', ''));
        return closeKeys.has(label) || icon === 'close';
      } catch {
        return false;
      }
    });
    return closeLayer ? closeLayer.visible !== false : undefined;
  } catch {
    return undefined;
  }
}

function queueDialogBooleanProperty(instance, assignments, names, value, warnings, description) {
  for (const name of names) {
    if (queueOptionalComponentProperty(instance, assignments, name, value, 'BOOLEAN')) return true;
  }
  warnings.push(`${description} could not be applied — no matching Figma property was found.`);
  return false;
}

function exportDialog(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  const status = componentPropertyValue(instance, 'Status', 'VARIANT');
  const title = componentText(instance, 'Title', namedTextLayerValueAny(instance, ['Title', 'Dialog Title', 'Heading'], '')).trim();
  const bodyChildren = dialogBodyChildren(instance, warnings);
  const body = bodyChildren.length > 0 ? null : (dialogSlotBodyText(instance) || componentText(instance, 'Body', '')).trim();
  const showClose = dialogBooleanPropertyValue(instance, ['Show close', 'Show close button', 'Close button', 'Close']) ?? dialogCloseLayerVisible(instance);
  const showFooter = dialogBooleanPropertyValue(instance, ['Show footer', 'Show footer actions', 'Footer', 'Footer actions']);

  if (DIALOG_SIZES.includes(size) && size !== 'md') props.size = size;
  if (DIALOG_STATUSES.includes(status) && status !== 'none') props.status = status;
  if (title) props.title = title;
  if (body) props.body = body;
  if (showClose === false) props.showClose = false;
  if (showFooter === false) props.showFooter = false;
  const footerActions = dialogFooterButtons(instance)
    .filter((button) => button.visible !== false)
    .map((button) => {
      const result = exportButton(button);
      warnings.push(...result.warnings);
      return result.node;
    });
  if (footerActions.length > 0) props.footerActions = footerActions;
  if (showFooter !== false && footerActions.length === 0) {
    warnings.push('No visible Button instances were found in the Dialog footer slot.');
  }
  if (status && status !== 'none') {
    warnings.push('Figma uses the status default icon; a custom Dialog icon cannot be round-tripped.');
  }
  const node = { id: componentId('Dialog', instance), type: 'Dialog', props };
  if (bodyChildren.length > 0) {
    node.children = bodyChildren;
  }
  return { node, warnings };
}

function dialogContextForSelection(instance) {
  instance = currentInstance(instance);
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  const status = componentPropertyValue(instance, 'Status', 'VARIANT');
  const showClose = dialogBooleanPropertyValue(instance, ['Show close', 'Show close button', 'Close button', 'Close']) ?? dialogCloseLayerVisible(instance);
  const showFooter = dialogBooleanPropertyValue(instance, ['Show footer', 'Show footer actions', 'Footer', 'Footer actions']);
  return {
    title: componentText(instance, 'Title', namedTextLayerValueAny(instance, ['Title', 'Dialog Title', 'Heading'], 'Dialog')).trim() || 'Dialog',
    size: DIALOG_SIZES.includes(size) ? size : 'md',
    sizeOptions: DIALOG_SIZES,
    status: DIALOG_STATUSES.includes(status) ? status : 'none',
    statusOptions: DIALOG_STATUSES,
    showClose: showClose !== false,
    showFooter: showFooter !== false,
    booleanOptions: ['false', 'true'],
  };
}

function isExportableNode(node) {
  if (!node) return false;
  if (registeredSetName(node)) return true;
  if (node.type === 'INSTANCE' && materialIconNameFromInstance(node)) return true;
  if (node.type === 'TEXT' || isStackFrame(node) || isGridFrame(node) || canExportContainer(node)) return true;
  return false;
}

function topmostExportableNode() {
  const selection = figma.currentPage.selection;
  if (selection.length !== 1) return null;
  let topmost = null;
  let node = liveNode(selection[0]);
  const visited = new Set();
  while (node) {
    try {
      if (node.type === 'PAGE') break;
      if (node.id && visited.has(node.id)) break;
      if (node.id) visited.add(node.id);
      if (isExportableNode(node)) topmost = node;
      node = node.parent;
    } catch {
      // The remaining ancestor chain is unavailable until Figma settles.
      break;
    }
  }
  return topmost;
}

function postExportResult({ auto, live, componentName, node, warnings, textReview }) {
  const exportWarnings = Array.isArray(warnings) ? warnings : [];
  const exportedNode = includeOpenActionTargets(node, exportWarnings);
  postPluginMessage({
    type: live ? 'live-preview' : 'export-result',
    auto: Boolean(auto),
    componentName,
    json: JSON.stringify(exportedNode, null, 2),
    warnings: exportWarnings,
    ...(textReview ? { textReview } : {}),
  });
}

function runExport(auto, explicitTarget = null, live = false) {
  const selection = figma.currentPage.selection;
  if (!explicitTarget && selection.length !== 1) {
    if (!auto) postError('Select a single component instance to export.');
    return;
  }
  const target = liveNode(explicitTarget || selection[0]);
  if (!target) {
    if (!auto) postError('The selected layer changed before it could be exported. Select it again and retry.');
    return;
  }
  if (target.type === 'TEXT') {
    if (isMaterialIconTextNode(target)) {
      const { node, warnings } = withBreakpointVisibility(target, exportIcon(target));
      postExportResult({ auto, live, componentName: 'Icon', node, warnings });
      return;
    }
    const { node, warnings, review } = withBreakpointVisibility(target, exportTextNode(target));
    postExportResult({ auto, live, componentName: node.type, node, warnings, textReview: review });
    return;
  }
  if (isStackFrame(target)) {
    const { node, warnings } = withBreakpointVisibility(target, exportStack(target));
    postExportResult({ auto, live, componentName: 'Stack', node, warnings });
    return;
  }
  if (isGridFrame(target)) {
    const { node, warnings } = withBreakpointVisibility(target, exportGrid(target));
    postExportResult({ auto, live, componentName: 'Grid', node, warnings });
    return;
  }
  if (target.type === 'INSTANCE') {
    // A supported instance may itself contain text and Button slot content.
    // Export its component contract first; only unregistered frame/group
    // selections belong to the generic screen-content path below.
    const componentName = registeredSetName(target);
    if (componentName) {
      let { node, warnings } = withBreakpointVisibility(target, EXPORTERS[componentName](target));
      if (ACTION_TRIGGER_COMPONENT_NAMES.has(componentName)) {
        node = nodeWithLinkedActionTargetExport(target, node, warnings);
      }
      postExportResult({ auto, live, componentName, node, warnings });
      return;
    }
    const iconName = materialIconNameFromInstance(target);
    if (iconName) {
      const { node, warnings } = withBreakpointVisibility(target, exportIcon(target));
      postExportResult({ auto, live, componentName: 'Icon', node, warnings });
      return;
    }
  }
  if (canExportContainer(target)) {
    const { node, warnings } = exportContainerNode(target);
    postExportResult({ auto, live, componentName: 'Screen content', node, warnings });
    return;
  }
  if (target.type !== 'INSTANCE') {
    if (!auto) postError(`The selected layer ("${target.name}") is not a component instance or text layer.`);
    return;
  }
  const componentName = registeredSetName(target);
  if (!componentName) {
    const iconName = materialIconNameFromInstance(target);
    if (iconName) {
      const { node, warnings } = withBreakpointVisibility(target, exportIcon(target));
      postExportResult({ auto, live, componentName: 'Icon', node, warnings });
      return;
    }
    if (!auto) postError(`The selected component is not supported yet. Supported: ${SUPPORTED_COMPONENT_MESSAGE}.`);
    return;
  }
  const { node, warnings } = withBreakpointVisibility(target, EXPORTERS[componentName](target));
  const exportedNode = ACTION_TRIGGER_COMPONENT_NAMES.has(componentName)
    ? nodeWithLinkedActionTargetExport(target, node, warnings)
    : node;
  postExportResult({ auto, live, componentName, node: exportedNode, warnings });
}

function figureImageMime(bytes) {
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return 'image/png';
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (bytes.length >= 6 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return 'image/gif';
  return null;
}

async function sendSelectedFigureImageToPlayground() {
  const selection = figma.currentPage.selection;
  if (selection.length !== 1 || selection[0].type !== 'INSTANCE' || registeredSetName(selection[0]) !== 'Figure') {
    return postError('Select one Figure instance to send its image to the local Preview.');
  }
  const instance = currentInstance(selection[0]);
  const imageLayer = figureImageLayer(instance);
  const paint = imagePaintOn(imageLayer);
  if (!paint || !paint.imageHash) return postError('The selected Figure has no image fill to send.');
  const image = figma.getImageByHash(paint.imageHash);
  if (!image) return postError('The selected Figure image is unavailable.');
  const bytes = await image.getBytesAsync();
  if (bytes.byteLength === 0 || bytes.byteLength > LOCAL_FIGMA_IMAGE_MAX_BYTES) {
    return postError('The selected Figure image must be 4 MB or less for the local handoff.');
  }
  const type = figureImageMime(bytes);
  if (!type) return postError('The selected Figure image must be PNG, JPEG, or GIF for the local handoff.');
  const { node, warnings } = exportFigure(instance);
  const id = `figma_${paint.imageHash.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 96)}`;
  node.props.src = `a1img://${id}`;
  const sourceName = componentText(instance, 'Source', '').trim() || 'Figure image';
  postPluginMessage({
    type: 'figure-image-handoff',
    json: JSON.stringify(node, null, 2),
    asset: { id, name: sourceName.slice(0, 180), type, dataBase64: bytesToBase64(bytes) },
    warnings,
  });
}

// ─── Import: page-definition JSON → Figma instances ─────────────────────────

function setStackChildrenAlignment(frame, align, warnings) {
  for (const child of stackFlowChildren(frame)) {
    try {
      child.layoutAlign = align === 'stretch' ? 'STRETCH' : 'INHERIT';
    } catch (error) {
      warnings.push(`Could not set Stack child alignment: ${error.message}`);
    }
  }
}

function applyStackGrow(parent, child, sourceNode, warnings) {
  if (!sourceNode || sourceNode.type !== 'Stack' || !sourceNode.props || sourceNode.props.grow !== true) return;
  if (!parent || !['HORIZONTAL', 'VERTICAL'].includes(parent.layoutMode)) {
    warnings.push('Stack grow only applies inside a Figma auto-layout parent.');
    return;
  }
  try {
    child.layoutGrow = 1;
  } catch (error) {
    warnings.push(`Stack grow could not be applied: ${error.message}`);
  }
}

function fillImportedTextWidth(parent, child, sourceNode, warnings) {
  if (!sourceNode || !['Heading', 'Paragraph'].includes(sourceNode.type) || child.type !== 'TEXT') return;
  if (!parent) return;
  try {
    // Text is block content in A1. Stretch handles vertical auto-layout;
    // FILL handles Grid cells; grow is the horizontal-stack equivalent.
    if (parent.layoutMode === 'VERTICAL') {
      child.layoutAlign = 'STRETCH';
      child.layoutSizingHorizontal = 'FILL';
    }
    else if (parent.layoutMode === 'HORIZONTAL') child.layoutGrow = 1;
    // Figma accepts FILL for imported Grid children and resolves it to the
    // flexible track width, so text remains a true block in every layout.
    else if (parent.layoutMode === 'GRID') child.layoutSizingHorizontal = 'FILL';
    else return;
    child.textAutoResize = 'HEIGHT';
  } catch (error) {
    warnings.push(`Imported text could not be set to fill the parent width: ${error.message}`);
  }
}

// ── Fill vs hug sizing contract ──────────────────────────────────────────────
// Formalized in figma-workflow.md ("Sizing convention — fill vs hug"): these
// component types always FILL their container's inline axis when placed in an
// auto-layout or Grid parent. Divider is axis-dependent and handled by its own
// helper below. Everything in HUG_CONTENT_TYPES keeps its natural content size
// — Figma's default for a fresh instance — and must never be stretched.
const FILL_CONTAINER_TYPES = [
  'Stack', 'Grid', 'GridItem', 'Card', 'Banner', 'Blockquote', 'Figure', 'Accordion',
  'TextField', 'SearchField', 'SelectField', 'TextareaField',
  'RadioGroup', 'CheckboxGroup',
  'TopHeader', 'Section', 'MessageEmptyState', 'PageLayout', 'DataTable', 'ChipGroup', 'ChoiceGroup',
  'BottomSheet',
  // Not yet bridged — pre-classified so sizing is correct when importers land.
  'List', 'BottomDrawer', 'PageNav', 'TreeMenu',
  // Code is variant-dependent: block fills, inline hugs (guard below).
  'Code',
];
const HUG_CONTENT_TYPES = new Set([
  'Link', 'Button', 'IconButton', 'MessageBadge', 'Switch',
  'Pagination', 'SegmentedControl', 'Menu', 'DefinitionList',
  'Dialog', 'Tooltip',
  // Not yet bridged — pre-classified. SideNav is a fixed-width rail (280/52).
  'Inline', 'Breadcrumb', 'SideNav', 'Toolbar',
]);

function fillImportedContainerWidth(parent, child, sourceNode, warnings) {
  if (!sourceNode || HUG_CONTENT_TYPES.has(sourceNode.type)) return;
  if (!FILL_CONTAINER_TYPES.includes(sourceNode.type)) return;
  // Inline Code is a text chip; only the block variant is a filling panel.
  if (sourceNode.type === 'Code' && !(sourceNode.props && sourceNode.props.variant === 'block')) return;
  if (!parent || !['HORIZONTAL', 'VERTICAL', 'GRID'].includes(parent.layoutMode)) return;
  try {
    // Containers are block-level by default. In a Grid, FILL makes an item
    // occupy the available cell width; Figma rejects unsupported cases and
    // the warning preserves the imported layout rather than detaching it.
    if (parent.layoutMode === 'VERTICAL') {
      child.layoutAlign = 'STRETCH';
      child.layoutSizingHorizontal = 'FILL';
    }
    else if (parent.layoutMode === 'HORIZONTAL') child.layoutGrow = 1;
    // Grid children can use FILL after append; Figma resolves that against the
    // flexible track width, which keeps Cards and other block components full.
    else child.layoutSizingHorizontal = 'FILL';
  } catch (error) {
    warnings.push(`Imported ${sourceNode.type} could not be set to fill the parent width: ${error.message}`);
  }
}

function setNodeToFillParentWidth(node, label, warnings) {
  const parent = safeParent(node);
  if (!parent || parent.type === 'PAGE' || !['HORIZONTAL', 'VERTICAL', 'GRID'].includes(parent.layoutMode)) return;
  try {
    if (parent.layoutMode === 'VERTICAL') {
      node.layoutAlign = 'STRETCH';
      node.layoutSizingHorizontal = 'FILL';
    } else if (parent.layoutMode === 'HORIZONTAL') {
      node.layoutGrow = 1;
    } else {
      node.layoutSizingHorizontal = 'FILL';
    }
  } catch (error) {
    warnings.push(`${label || 'Converted component'} could not be set to fill the parent width: ${error.message}`);
  }
}

function fillImportedStackWidth(parent, child, sourceNode, warnings) {
  if (!sourceNode || sourceNode.type !== 'Stack' || child.type !== 'FRAME') return;
  if (!parent || !['HORIZONTAL', 'VERTICAL'].includes(parent.layoutMode)) return;
  try {
    // A1 Stacks are block-level layout primitives. In a vertical auto-layout,
    // stretch is Figma's Fill-container width. In a horizontal one, grow fills
    // the primary (width) axis instead.
    if (parent.layoutMode === 'VERTICAL') child.layoutAlign = 'STRETCH';
    else child.layoutGrow = 1;
  } catch (error) {
    warnings.push(`Imported Stack could not be set to fill the parent width: ${error.message}`);
  }
}

function fillImportedGridWidth(parent, child, sourceNode, warnings) {
  if (!sourceNode || sourceNode.type !== 'Grid' || child.type !== 'FRAME') return;
  if (!parent || !['HORIZONTAL', 'VERTICAL'].includes(parent.layoutMode)) return;
  try {
    if (parent.layoutMode === 'VERTICAL') child.layoutAlign = 'STRETCH';
    else child.layoutGrow = 1;
  } catch (error) {
    warnings.push(`Imported Grid could not be set to fill the parent width: ${error.message}`);
  }
}

function applyImportedGridItemSpan(parent, child, sourceNode, warnings) {
  if (!sourceNode || sourceNode.type !== 'GridItem') return;
  if (!parent || parent.layoutMode !== 'GRID') {
    warnings.push('GridItem span only applies when it is a direct child of an A1 Grid.');
    return;
  }
  const props = sourceNode.props || {};
  const breakpoint = breakpointForNode(parent);
  const columnCount = Number(parent.gridColumnCount);
  const span = responsiveGridItemSpanAt(props.span, breakpoint, Number.isInteger(columnCount) ? columnCount : null);
  const rowSpan = responsiveGridItemSpanAt(props.rowSpan, breakpoint);
  try {
    if (span !== null) child.gridColumnSpan = Math.max(1, Math.min(span, Number.isInteger(columnCount) && columnCount > 0 ? columnCount : span));
    if (rowSpan !== null) child.gridRowSpan = Math.max(1, rowSpan);
    child.layoutSizingHorizontal = 'FILL';
    if (child.type === 'TEXT') child.textAutoResize = 'HEIGHT';
  } catch (error) {
    warnings.push(`GridItem span could not be applied in Figma: ${error.message}`);
  }
}

function fillImportedButtonContainerWidth(parent, child, sourceNode, warnings) {
  if (!sourceNode || sourceNode.type !== 'ButtonContainer' || child.type !== 'INSTANCE') return;
  if (!parent || !['HORIZONTAL', 'VERTICAL'].includes(parent.layoutMode)) return;
  try {
    // Button Containers occupy the available layout width; their own alignment
    // still controls where the contained buttons sit inside that width.
    if (parent.layoutMode === 'VERTICAL') child.layoutAlign = 'STRETCH';
    else child.layoutGrow = 1;
  } catch (error) {
    warnings.push(`Imported Button Container could not be set to fill the parent width: ${error.message}`);
  }
}

function fillImportedDividerAxis(parent, child, sourceNode, warnings) {
  // A Divider fills along its own orientation: a horizontal rule fills the
  // available width; a vertical rule fills the available height of a row.
  if (!sourceNode || sourceNode.type !== 'Divider') return;
  if (!parent || !['HORIZONTAL', 'VERTICAL', 'GRID'].includes(parent.layoutMode)) return;
  const orientation = sourceNode.props && sourceNode.props.orientation === 'vertical' ? 'vertical' : 'horizontal';
  try {
    if (orientation === 'horizontal') {
      if (parent.layoutMode === 'VERTICAL') {
        child.layoutAlign = 'STRETCH';
        child.layoutSizingHorizontal = 'FILL';
      } else if (parent.layoutMode === 'HORIZONTAL') child.layoutGrow = 1;
      else child.layoutSizingHorizontal = 'FILL';
    } else if (parent.layoutMode === 'HORIZONTAL') {
      // Vertical divider in a row: stretch to the row height.
      child.layoutAlign = 'STRETCH';
    } else if (parent.layoutMode === 'GRID') {
      child.layoutSizingVertical = 'FILL';
    }
    // A vertical divider in a vertical stack keeps its natural height.
  } catch (error) {
    warnings.push(`Imported Divider could not be set to fill its ${orientation === 'vertical' ? 'height' : 'width'}: ${error.message}`);
  }
}

function appendImportedChild(parent, child, sourceNode, warnings) {
  try {
    parent.appendChild(child);
  } catch (error) {
    warnings.push(`Imported ${sourceNode && sourceNode.type ? sourceNode.type : 'node'} could not be attached to its parent: ${error.message}`);
    return;
  }
  const liveParent = liveNode(parent) || parent;
  const liveChild = liveNode(child) || child;
  try {
    fillImportedTextWidth(liveParent, liveChild, sourceNode, warnings);
    fillImportedContainerWidth(liveParent, liveChild, sourceNode, warnings);
    fillImportedStackWidth(liveParent, liveChild, sourceNode, warnings);
    fillImportedGridWidth(liveParent, liveChild, sourceNode, warnings);
    fillImportedButtonContainerWidth(liveParent, liveChild, sourceNode, warnings);
    fillImportedDividerAxis(liveParent, liveChild, sourceNode, warnings);
    applyImportedGridItemSpan(liveParent, liveChild, sourceNode, warnings);
    applyStackGrow(liveParent, liveChild, sourceNode, warnings);
  } catch (error) {
    warnings.push(`Imported ${sourceNode && sourceNode.type ? sourceNode.type : 'node'} was attached, but its layout adjustments were skipped because Figma returned a stale layer handle: ${error.message}`);
  }
}

async function createImportNoteLayer(node, message) {
  const type = node && typeof node.type === 'string' && node.type ? node.type : 'Unknown';
  const id = node && typeof node.id === 'string' && node.id ? node.id : '';
  const frame = figma.createFrame();
  frame.name = id ? `Import note · ${type} · ${id}` : `Import note · ${type}`;
  frame.layoutMode = 'VERTICAL';
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'FIXED';
  frame.itemSpacing = 6;
  frame.paddingLeft = 12;
  frame.paddingRight = 12;
  frame.paddingTop = 10;
  frame.paddingBottom = 10;
  frame.cornerRadius = 8;
  frame.fills = [{ type: 'SOLID', color: { r: 1, g: 0.972, b: 0.862 } }];
  frame.strokes = [{ type: 'SOLID', color: { r: 0.86, g: 0.61, b: 0.18 } }];
  frame.strokeWeight = 1;
  try { frame.resizeWithoutConstraints(360, 1); } catch { /* Auto layout will size the note. */ }

  const title = figma.createText();
  const body = figma.createText();
  const titleFont = title.fontName;
  const bodyFont = body.fontName;
  if (titleFont !== figma.mixed) await figma.loadFontAsync(titleFont);
  if (bodyFont !== figma.mixed) await figma.loadFontAsync(bodyFont);
  title.characters = `Missing Figma component: ${type}`;
  title.fontSize = 13;
  title.fills = [{ type: 'SOLID', color: { r: 0.22, g: 0.15, b: 0.03 } }];
  body.characters = id ? `${message}\nJSON id: ${id}` : message;
  body.fontSize = 11;
  body.fills = [{ type: 'SOLID', color: { r: 0.39, g: 0.28, b: 0.07 } }];
  try {
    title.textAutoResize = 'HEIGHT';
    body.textAutoResize = 'HEIGHT';
    title.layoutAlign = 'STRETCH';
    body.layoutAlign = 'STRETCH';
  } catch {
    // Text auto-resize can be fussy in older plugin runtimes; fixed width is fine.
  }
  frame.appendChild(title);
  frame.appendChild(body);
  if (typeof frame.setPluginData === 'function') {
    frame.setPluginData('a1-import-note', type);
    if (id) frame.setPluginData('a1-json-id', id);
  }
  return frame;
}

async function renderImportedNode(node, warnings) {
  const importer = IMPORTERS[node.type];
  if (!importer) {
    const message = `No Figma importer exists for A1 component type "${node.type}".`;
    warnings.push(message);
    return createImportNoteLayer(node, message);
  }
  let layer;
  try {
    layer = await importer(node, warnings);
  } catch (error) {
    const message = `"${node.type}" could not be created from the current Figma library: ${error.message}`;
    warnings.push(message);
    const note = await createImportNoteLayer(node, message);
    writeBreakpointVisibility(note, node.visibility);
    return note;
  }
  // JSON ids are stable authoring identifiers. Showing them in Figma's layer
  // list makes rendered compositions traceable and makes updates unambiguous.
  if (typeof node.id === 'string' && node.id.trim()) {
    layer.name = node.id;
    if (typeof layer.setPluginData === 'function') layer.setPluginData('a1-json-id', node.id);
  }
  writeBreakpointVisibility(layer, node.visibility);
  if (A1_BREAKPOINTS.includes(activeRenderBreakpoint)) {
    try {
      layer.visible = resolveBreakpointVisibility(node.visibility)[activeRenderBreakpoint] !== false;
    } catch {
      // The saved metadata still carries the contract if visibility is immutable.
    }
  }
  if (
    activeActionTargetImportContext &&
    node &&
    typeof node === 'object' &&
    typeof node.id === 'string' &&
    activeActionTargetImportContext.targetNodes.has(node.id)
  ) {
    layer.name = actionTargetNameWithTriggerMetadata(
      layer.name,
      activeActionTargetImportContext.triggerNames.get(node.id)
    );
  }
  if (activeActionTargetImportContext && node && typeof node.id === 'string') {
    activeActionTargetImportContext.renderedLayers.set(node.id, layer);
    if (activeActionTargetImportContext.targetNodes.has(node.id)) {
      activeActionTargetImportContext.targetLayers.set(node.id, layer);
    }
    const actions = node.actions && typeof node.actions === 'object' ? node.actions : null;
    const action = actions && actions.onClick && typeof actions.onClick === 'object'
      ? actions.onClick
      : node.action && typeof node.action === 'object'
        ? node.action
        : null;
    if (
      action &&
      ACTION_TRIGGER_TYPE_BY_ACTION[action.type] &&
      typeof action.target === 'string' &&
      action.target
    ) {
      activeActionTargetImportContext.pendingTriggers.push({ trigger: layer, action });
    }
  }
  if (node.type === 'Grid') {
    const responsiveColumns = normalizeResponsiveColumns(node.props && node.props.columns);
    if (responsiveColumns) syncResponsiveGridColumnsMetadata(layer, responsiveColumns);
  }
  return layer;
}

async function applyStack(frame, node, warnings) {
  const props = node.props || {};
  const direction = staticStackValue(props.direction, STACK_DIRECTIONS, 'column', 'direction', warnings);
  const align = staticStackValue(props.align, STACK_ALIGNS, 'stretch', 'align', warnings);
  const justify = staticStackValue(props.justify, STACK_JUSTIFIES, 'start', 'justify', warnings);
  const gap = stackGapToFigma(props.gap === undefined ? 16 : props.gap, warnings);
  const wrap = props.wrap === true;

  frame.layoutMode = direction === 'row' || direction === 'row-reverse' ? 'HORIZONTAL' : 'VERTICAL';
  await bindGapProperty(frame, 'itemSpacing', gap, warnings, 'Stack item spacing');
  frame.primaryAxisAlignItems = STACK_JUSTIFY_TO_FIGMA[justify] || 'MIN';
  // Figma has no parent-level STRETCH enum. It represents stretch through
  // each child plus a fixed cross axis on the frame.
  frame.counterAxisAlignItems = align === 'stretch' ? 'MIN' : (STACK_ALIGN_TO_FIGMA[align] || 'MIN');

  if (align === 'stretch') {
    try {
      frame.counterAxisSizingMode = 'FIXED';
    } catch (error) {
      warnings.push(`Stack stretch could not fix the cross axis: ${error.message}`);
    }
  } else {
    try {
      frame.counterAxisSizingMode = 'AUTO';
    } catch (error) {
      warnings.push(`Stack cross-axis sizing could not be applied: ${error.message}`);
    }
  }
  trySetLayoutProperty(frame, 'primaryAxisSizingMode', 'AUTO', warnings, 'Stack primary-axis sizing');
  setStackChildrenAlignment(frame, align, warnings);

  if (wrap && frame.layoutMode === 'HORIZONTAL') {
    trySetLayoutProperty(frame, 'layoutWrap', 'WRAP', warnings, 'Stack wrap');
    await bindGapProperty(frame, 'counterAxisSpacing', gap, warnings, 'Stack wrap row spacing');
  } else {
    trySetLayoutProperty(frame, 'layoutWrap', 'NO_WRAP', warnings, 'Stack wrap');
    if (wrap) warnings.push('Stack wrap is only representable by horizontal Figma auto layout; it was omitted for this direction.');
  }

  if (direction === 'row-reverse' || direction === 'column-reverse') {
    warnings.push(`direction="${direction}" has no Figma auto-layout equivalent; ${direction.replace('-reverse', '')} was used.`);
  }
  if (justify === 'around' || justify === 'evenly') {
    warnings.push(`justify="${justify}" has no Figma auto-layout equivalent; ${justify === 'evenly' ? 'between' : 'center'} was used.`);
    frame.primaryAxisAlignItems = justify === 'evenly' ? 'SPACE_BETWEEN' : 'CENTER';
  }
  return { align, wrap, direction };
}

async function importStack(node, warnings) {
  const frame = figma.createFrame();
  frame.name = 'Stack';
  frame.fills = [];
  frame.clipsContent = false;
  const { align } = await applyStack(frame, node, warnings);
  syncStackPropsName(frame);

  const children = [];
  collectSupportedNodes(node.children || [], children);
  if ((node.children || []).some((child) => child && typeof child === 'object' && child.type && !IMPORTERS[child.type])) {
    warnings.push('Unsupported Stack child types were not rendered.');
  }
  for (const childNode of children.filter((child) => !(
    activeActionTargetImportContext &&
    child &&
    typeof child === 'object' &&
    typeof child.id === 'string' &&
    activeActionTargetImportContext.targetNodes.has(child.id)
  ))) {
    const child = await renderImportedNode(childNode, warnings);
    appendImportedChild(frame, child, childNode, warnings);
  }
  setStackChildrenAlignment(frame, align, warnings);
  return frame;
}

function gridGapToFigma(value, property, warnings) {
  const gap = stackGapToFigma(value, warnings);
  if (!(typeof value === 'string' && STACK_SEMANTIC_GAPS[value] !== undefined) && !STACK_GAPS.includes(value)) {
    warnings[warnings.length - 1] = `${property}=${JSON.stringify(value)} is not in the A1 Grid spacing scale — 16 was used.`;
  }
  return gap;
}

async function applyGrid(frame, node, warnings) {
  const props = node.props || {};
  const responsiveColumns = normalizeResponsiveColumns(props.columns);
  const previewBreakpoint = responsiveColumns
    ? breakpointForNode(frame)
    : 'lg';
  const requestedColumns = responsiveColumns
    ? responsiveColumnsAt(responsiveColumns, previewBreakpoint)
    : props.columns;
  const columns = Number.isInteger(requestedColumns) && requestedColumns > 0 ? requestedColumns : 1;
  const defaultGap = props.gap === undefined ? 16 : gridGapToFigma(props.gap, 'gap', warnings);
  const rowGap = props.rowGap === undefined ? defaultGap : gridGapToFigma(props.rowGap, 'rowGap', warnings);
  const columnGap = props.columnGap === undefined ? defaultGap : gridGapToFigma(props.columnGap, 'columnGap', warnings);
  const align = staticStackValue(props.alignItems, ['stretch', 'start', 'center', 'end'], 'stretch', 'alignItems', warnings);

  if (requestedColumns !== undefined && columns === 1 && (!Number.isInteger(requestedColumns) || requestedColumns < 1)) {
    warnings.push(`Grid columns=${JSON.stringify(props.columns)} is not supported by Figma — 1 was used.`);
  }
  if (responsiveColumns) {
    syncResponsiveGridColumnsMetadata(frame, responsiveColumns);
    frame.setPluginData(A1_BREAKPOINT_KEY, previewBreakpoint);
    warnings.push(`Responsive Grid columns were rendered at the ${previewBreakpoint} preview (${columns} column${columns === 1 ? '' : 's'}); the full sparse columns object is stored on the frame for export.`);
  } else {
    frame.setPluginData(GRID_RESPONSIVE_COLUMNS_KEY, '');
    frame.setPluginData(A1_BREAKPOINT_KEY, '');
  }
  frame.layoutMode = 'GRID';
  frame.gridAutoTracks = 'ROWS';
  frame.gridItemsPositioning = 'ROW_AUTO_FLOW';
  frame.gridColumnCount = columns;
  await bindGapProperty(frame, 'gridRowGap', rowGap, warnings, 'Grid row gap');
  await bindGapProperty(frame, 'gridColumnGap', columnGap, warnings, 'Grid column gap');
  // Grid columns are flexible fractions by default, matching a full-width
  // A1 Grid once its parent assigns the frame available width.
  frame.gridColumnSizes.forEach((track) => {
    track.type = 'FLEX';
    track.value = 1;
  });
  frame.counterAxisAlignItems = align === 'stretch' ? 'MIN' : (STACK_ALIGN_TO_FIGMA[align] || 'MIN');
  try {
    frame.layoutSizingVertical = 'HUG';
  } catch (error) {
    warnings.push(`Grid height could not be set to Hug contents: ${error.message}`);
  }
  if (props.layout && props.layout !== 'default') warnings.push(`Grid layout="${props.layout}" has no dedicated Figma Grid representation.`);
  if (props.autoRows) warnings.push('Grid autoRows has no portable Figma representation.');
}

async function importGrid(node, warnings) {
  const frame = figma.createFrame();
  frame.name = 'Grid';
  frame.fills = [];
  frame.clipsContent = false;
  await applyGrid(frame, node, warnings);

  const children = [];
  collectSupportedNodes(node.children || [], children);
  if ((node.children || []).some((child) => child && typeof child === 'object' && child.type && !IMPORTERS[child.type])) {
    warnings.push('Unsupported Grid child types were not rendered.');
  }
  for (const childNode of children.filter((child) => !(
    activeActionTargetImportContext &&
    child &&
    typeof child === 'object' &&
    typeof child.id === 'string' &&
    activeActionTargetImportContext.targetNodes.has(child.id)
  ))) {
    const child = await renderImportedNode(childNode, warnings);
    appendImportedChild(frame, child, childNode, warnings);
  }
  return frame;
}

async function importGridItem(node, warnings) {
  const frame = figma.createFrame();
  frame.name = 'Grid Item';
  frame.fills = [];
  frame.clipsContent = false;
  frame.setPluginData('a1-json-type', 'GridItem');
  frame.setSharedPluginData(DETACHED_COMPONENT_NAMESPACE, DETACHED_COMPONENT_KEY, 'GridItem');
  await applyStack(frame, { props: { direction: 'column', gap: 'md', align: 'stretch' } }, warnings);

  const children = [];
  collectSupportedNodes(node.children || [], children);
  if ((node.children || []).some((child) => child && typeof child === 'object' && child.type && !IMPORTERS[child.type])) {
    warnings.push('Unsupported GridItem child types were not rendered.');
  }
  for (const childNode of children.filter((child) => !(
    activeActionTargetImportContext &&
    child &&
    typeof child === 'object' &&
    typeof child.id === 'string' &&
    activeActionTargetImportContext.targetNodes.has(child.id)
  ))) {
    const child = await renderImportedNode(childNode, warnings);
    appendImportedChild(frame, child, childNode, warnings);
  }
  return frame;
}

function findButtonSet() {
  const byId = resolveNodeById(BUTTON_SET_ID);
  if (byId && byId.type === 'COMPONENT_SET' && byId.name === 'Button') return byId;
  return findComponentSet('Button');
}

// Apply a Button node's props to an existing Button instance (used both when
// rendering a new instance and when updating the current selection).
async function applyButton(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const iconName = typeof props.icon === 'string' && props.icon.length > 0 ? props.icon : '';
  const raw = instance.componentProperties || {};
  const keyFor = (prefix) => Object.keys(raw).find((key) => plainKey(key) === prefix);
  const assignments = {};

  const variantKey = keyFor('Variant');
  if (variantKey) assignments[variantKey] = BUTTON_VARIANTS.includes(props.variant) ? props.variant : 'primary';
  const sizeKey = keyFor('Size');
  if (sizeKey) assignments[sizeKey] = BUTTON_SIZES.includes(props.size) ? props.size : 'md';
  const stateKey = keyFor('State');
  if (stateKey) assignments[stateKey] = props.disabled === true ? 'disabled' : props.loading === true ? 'loading' : 'default';
  const positionKey = keyFor('IconPosition');
  if (positionKey) assignments[positionKey] = props.iconPosition === 'end' ? 'end' : 'start';

  const labelKey = keyFor('Label');
  if (labelKey && node.content && typeof node.content.fallback === 'string') {
    assignments[labelKey] = node.content.fallback;
  }
  const showIconKey = keyFor('Show icon');
  if (showIconKey) assignments[showIconKey] = Boolean(iconName);
  let iconComponent = null;
  let iconPropertyApplied = false;
  if (iconName) {
    iconComponent = await findMaterialIconComponentAsync(iconName, warnings);
    if (iconComponent) iconPropertyApplied = queueIconSwapProperty(instance, assignments, iconComponent);
    if (!iconPropertyApplied) iconPropertyApplied = queueIconTextProperty(instance, assignments, iconName);
  }
  applyQueuedProperties(instance, assignments, warnings, 'Button properties');
  let current = currentInstance(instance);
  if (iconName) await finalizeMaterialIconUpdate(current, iconName, iconComponent, iconPropertyApplied, warnings, 'Button icon');
  current = currentInstance(current);
  syncButtonFullWidthMetadata(current, props.fullWidth === true ? 'fill' : 'hug', warnings);

  for (const runtimeProp of ['href', 'as']) {
    if (props[runtimeProp] !== undefined) {
      warnings.push(`"${runtimeProp}" is a runtime prop with no Figma representation — ignored.`);
    }
  }
}

async function importButton(node, warnings) {
  const instance = await createComponentInstance('Button', warnings);
  await applyButton(instance, node, warnings);
  return instance;
}

async function applyIconButton(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const assignments = {};
  const variant = ICON_BUTTON_VARIANTS.includes(props.variant) ? props.variant : 'tertiary';
  const size = ICON_BUTTON_SIZES.includes(props.size) ? props.size : 'md';
  const iconName = typeof props.icon === 'string' && props.icon.trim() ? props.icon.trim() : null;
  const label = typeof props.label === 'string' && props.label.trim() ? props.label : 'Icon button';
  let icon = null;
  let iconPropertyApplied = false;

  queueComponentProperty(instance, assignments, 'Variant', variant, 'VARIANT', warnings, 'Icon Button variant');
  queueComponentProperty(instance, assignments, 'Size', size, 'VARIANT', warnings, 'Icon Button size');
  queueComponentProperty(instance, assignments, 'Aria label', label, 'TEXT', warnings, 'Icon Button accessible label');
  if (iconName) {
    icon = await findMaterialIconComponentAsync(iconName, warnings);
    if (icon) iconPropertyApplied = queueIconSwapProperty(instance, assignments, icon);
    if (!iconPropertyApplied) iconPropertyApplied = queueIconTextProperty(instance, assignments, iconName);
  } else {
    warnings.push('Icon Button requires an "icon" prop; the default Figma glyph was retained.');
  }
  applyQueuedProperties(instance, assignments, warnings, 'Icon Button properties');
  if (iconName) await finalizeMaterialIconUpdate(instance, iconName, icon, iconPropertyApplied, warnings, 'Icon Button icon');

  for (const runtimeProp of ['disabled', 'as', 'href', 'target', 'rel', 'onClick', 'className', 'id']) {
    if (props[runtimeProp] !== undefined) {
      warnings.push(`"${runtimeProp}" is a runtime prop with no Figma representation — ignored.`);
    }
  }
}

async function importIconButton(node, warnings) {
  const instance = await createComponentInstance('Icon Button', warnings);
  await applyIconButton(instance, node, warnings);
  return instance;
}

async function applyLink(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const assignments = {};
  const size = LINK_SIZES.includes(props.size) ? props.size : 'md';
  const weight = LINK_WEIGHTS.includes(props.weight) ? props.weight : 'normal';
  const iconPosition = LINK_ICON_POSITIONS.includes(props.iconPosition) ? props.iconPosition : 'start';
  const iconName = typeof props.icon === 'string' && props.icon.trim() ? props.icon.trim() : null;
  let icon = null;
  let iconPropertyApplied = false;

  queueComponentProperty(instance, assignments, 'Size', size, 'VARIANT', warnings, 'Link size');
  queueComponentProperty(instance, assignments, 'Weight', weight, 'VARIANT', warnings, 'Link weight');
  queueComponentProperty(instance, assignments, 'Icon position', iconPosition, 'VARIANT', warnings, 'Link icon position');
  queueComponentProperty(instance, assignments, 'Show icon', Boolean(iconName), 'BOOLEAN', warnings, 'Link icon visibility');
  if (node.content && typeof node.content.fallback === 'string') {
    queueComponentProperty(instance, assignments, 'Label', node.content.fallback, 'TEXT', warnings, 'Link label');
  }
  if (iconName) {
    icon = await findMaterialIconComponentAsync(iconName, warnings);
    if (icon) iconPropertyApplied = queueIconSwapProperty(instance, assignments, icon);
    if (!iconPropertyApplied) iconPropertyApplied = queueIconTextProperty(instance, assignments, iconName);
  }
  applyQueuedProperties(instance, assignments, warnings, 'Link properties');
  if (iconName) await finalizeMaterialIconUpdate(instance, iconName, icon, iconPropertyApplied, warnings, 'Link icon');

  for (const runtimeProp of ['href', 'target', 'rel', 'as', 'onClick', 'className', 'id']) {
    if (props[runtimeProp] !== undefined) {
      warnings.push(`"${runtimeProp}" is a runtime prop with no Figma representation — ignored.`);
    }
  }
}

async function importLink(node, warnings) {
  const instance = await createComponentInstance('Link', warnings);
  await applyLink(instance, node, warnings);
  return instance;
}

function breadcrumbTextLayers(instance) {
  const live = currentInstance(instance);
  try {
    return live.findAll((node) => {
      if (node.type !== 'TEXT' || node.visible === false) return false;
      const name = canonicalKey(node.name || '');
      return !/(icon|chevron|separator|slash)/.test(name);
    });
  } catch {
    return [];
  }
}

function breadcrumbTextValues(instance) {
  const labels = [];
  try {
    for (const text of breadcrumbTextLayers(instance)) {
      const value = typeof text.characters === 'string' ? text.characters.trim() : '';
      if (!value) continue;
      if (labels.includes(value)) continue;
      labels.push(value);
    }
  } catch {
    // Stale nested handles can happen immediately after an instance swap.
  }
  return labels;
}

function normalizedBreadcrumbItems(items, fallbackLabels = []) {
  const usedIds = new Set();
  const rawItems = Array.isArray(items)
    ? items.filter((item) => item && typeof item === 'object')
    : fallbackLabels.map((label) => ({ label }));
  const normalized = rawItems
    .map((item, index) => {
      const label = typeof item.label === 'string' && item.label.trim()
        ? item.label.trim()
        : `Item ${index + 1}`;
      return {
        id: typeof item.id === 'string' && item.id.trim()
          ? item.id.trim()
          : slugifyOptionValue(label, usedIds),
        label,
        href: typeof item.href === 'string' && item.href ? item.href : undefined,
      };
    })
    .slice(0, GROUP_SLOT_CONFIG.Breadcrumb.max);
  if (normalized.length > 0) return normalized;
  return [
    { id: 'home', label: 'Home', href: '#' },
    { id: 'current-page', label: 'Current page' },
  ];
}

function breadcrumbBackButtonValueForWidth(instance) {
  const width = Number(instance && instance.width);
  return Number.isFinite(width) && width < BREADCRUMB_TRAIL_MIN_WIDTH ? 'True' : 'False';
}

function syncBreadcrumbBackButtonForWidth(instance, warnings = []) {
  let current = currentInstance(instance);
  if (!current || current.type !== 'INSTANCE') return current;
  const desired = breadcrumbBackButtonValueForWidth(current);
  if (componentPropertyValue(current, 'Back Button', 'VARIANT') === desired) return current;
  const assignments = {};
  queueComponentProperty(current, assignments, 'Back Button', desired, 'VARIANT', warnings, 'Breadcrumb responsive Back Button');
  applyQueuedProperties(current, assignments, warnings, 'Breadcrumb responsive Back Button');
  current = currentInstance(current);
  return current;
}

function exportBreadcrumb(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  instance = syncBreadcrumbBackButtonForWidth(instance, warnings);
  const props = {};
  const backLabel = componentText(instance, 'Back label', componentText(instance, 'Back Label', '')).trim();
  if (backLabel) props.backLabel = backLabel;

  const labels = [];
  for (let index = 1; index <= 8; index += 1) {
    const label = componentText(instance, `Item ${index}`, componentText(instance, `Label ${index}`, '')).trim();
    if (label) labels.push(label);
  }
  if (labels.length === 0) labels.push(...breadcrumbTextValues(instance));
  const filtered = labels.filter((label) => label && label !== backLabel);
  if (filtered.length > 0) {
    const usedIds = new Set();
    props.items = filtered.map((label, index) => {
      const item = {
        id: slugifyOptionValue(label, usedIds),
        label,
      };
      if (index < filtered.length - 1) item.href = '#';
      return item;
    });
  } else {
    warnings.push('Breadcrumb item labels could not be resolved from component properties or visible text layers.');
  }

  return { node: { id: componentId('Breadcrumb', instance), type: 'Breadcrumb', props }, warnings };
}

async function applyBreadcrumb(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const items = normalizedBreadcrumbItems(props.items, breadcrumbTextValues(instance));
  const assignments = {};
  const fallbackTextLayers = breadcrumbTextLayers(instance);
  if (['sm', 'md', 'lg', 'xl'].includes(props.container)) {
    queueOptionalComponentProperty(instance, assignments, 'Container', props.container, 'VARIANT');
  }
  if (typeof props.backLabel === 'string') {
    const backApplied = queueOptionalComponentProperty(instance, assignments, 'Back label', props.backLabel, 'TEXT')
      || queueOptionalComponentProperty(instance, assignments, 'Back Label', props.backLabel, 'TEXT');
    if (!backApplied) await writeNamedText(instance, 'Back label', props.backLabel, warnings, 'Breadcrumb back label');
  }
  const itemInstances = await reconcileGroupOptionInstances(instance, 'Breadcrumb', 'Breadcrumb Item', items.length, warnings);
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const position = index + 1;
    const itemInstance = itemInstances[index] ? currentInstance(itemInstances[index]) : null;
    if (itemInstance) {
      const itemAssignments = {};
      const type = index === items.length - 1 ? 'current' : (index === 0 ? 'link' : 'ancestor');
      const labelApplied = queueOptionalComponentProperty(itemInstance, itemAssignments, 'Label', item.label, 'TEXT')
        || queueOptionalComponentProperty(itemInstance, itemAssignments, `Item ${position}`, item.label, 'TEXT');
      queueOptionalComponentProperty(itemInstance, itemAssignments, 'Type', type, 'VARIANT');
      queueOptionalComponentProperty(itemInstance, itemAssignments, 'Show separator', index > 0, 'BOOLEAN');
      applyQueuedProperties(itemInstance, itemAssignments, warnings, `Breadcrumb item ${position} properties`);
      if (labelApplied) continue;
    }
    const applied = queueOptionalComponentProperty(instance, assignments, `Item ${position}`, item.label, 'TEXT')
      || queueOptionalComponentProperty(instance, assignments, `Label ${position}`, item.label, 'TEXT');
    if (!applied) {
      // Fall back to ordered visible text layers for simpler Breadcrumb assets.
      const text = fallbackTextLayers[index];
      if (text) {
        try {
          if (text.fontName !== figma.mixed) await figma.loadFontAsync(text.fontName);
          text.characters = item.label;
        } catch (error) {
          warnings.push(`Breadcrumb item ${position} text layer could not be updated: ${error.message}`);
        }
      } else {
        await writeNamedText(instance, `Item ${position}`, item.label, warnings, `Breadcrumb item ${position}`);
      }
    }
  }
  applyQueuedProperties(instance, assignments, warnings, 'Breadcrumb properties');
  syncBreadcrumbBackButtonForWidth(instance, warnings);
  for (const item of items) {
    if (item.href) warnings.push(`Breadcrumb href for "${item.label}" is runtime navigation — not represented in Figma.`);
  }
}

async function importBreadcrumb(node, warnings) {
  const instance = await createComponentInstance('Breadcrumb', warnings);
  await applyBreadcrumb(instance, node, warnings);
  return instance;
}

async function createComponentInstance(name, warnings) {
  const source = await findComponentSourceAsync(name, warnings);
  if (!source) throw new Error(`No "${name}" component was found. The plugin tried local A1 components, the built-in A1 library key registry, and enabled Figma libraries. Confirm the A1 Design System library is enabled for this file, or update the checked-in registry if the published component key changed.`);
  return source.createInstance();
}

function supportedChildren(children, warnings, owner) {
  const collected = [];
  collectSupportedNodes(children || [], collected);
  if ((children || []).some((child) => child && typeof child === 'object' && child.type && !IMPORTERS[child.type])) {
    warnings.push(`${owner} contains unsupported child types; those children will not render.`);
  }
  return collected.filter((node) => !(
    activeActionTargetImportContext &&
    node &&
    typeof node === 'object' &&
    typeof node.id === 'string' &&
    activeActionTargetImportContext.targetNodes.has(node.id)
  ));
}

async function replaceNativeSlotChildren(instance, slotName, children, warnings, owner) {
  const expected = supportedChildren(children, warnings, owner);
  let slot = namedSlot(currentInstance(instance), slotName);
  if (!slot) {
    warnings.push(`${owner} ${slotName} was not found — children were not rendered.`);
    return;
  }
  for (const child of [...slot.children]) {
    try {
      child.remove();
    } catch (error) {
      try {
        child.visible = false;
      } catch (visibilityError) {
        warnings.push(`${owner} slot placeholder could not be cleared: ${visibilityError.message}`);
      }
    }
  }
  for (const childNode of expected) {
    const child = await renderImportedNode(childNode, warnings);
    slot = namedSlot(currentInstance(instance), slotName);
    if (!slot) {
      warnings.push(`${owner} ${slotName} could not be refreshed — remaining children were not rendered.`);
      return;
    }
    appendImportedChild(slot, child, childNode, warnings);
  }
}

async function applyCard(instance, node, warnings) {
  const props = node.props || {};
  const assignments = {};
  const surface = normalizeCardSurface(props.surface);
  queueComponentProperty(instance, assignments, 'Surface', figmaCardSurface(surface), 'VARIANT', warnings, 'Card surface');
  const variant = normalizeCardVariant(props);
  queueComponentProperty(instance, assignments, 'Variant', figmaCardVariant(variant), 'VARIANT', warnings, 'Card variant');
  const iconName = typeof props.icon === 'string' && props.icon.length > 0 ? props.icon : null;
  const showIcon = Boolean(iconName) && props.iconDisplay !== 'none';
  queueComponentProperty(instance, assignments, 'Show icon', showIcon, 'BOOLEAN', warnings, 'Card icon visibility');
  applyQueuedProperties(instance, assignments, warnings, 'Card properties');

  const iconInstance = cardIconInstance(instance);
  let icon = null;
  let iconPropertyApplied = false;
  if (showIcon && iconInstance) {
    const iconAssignments = {};
    const iconDisplay = normalizeCardIconDisplay(props.iconDisplay);
    const iconType = iconDisplay === 'hero' ? 'Hero' : 'Default';
    const heroColor = normalizeCardHeroColor(props.heroColor);
    queueComponentProperty(iconInstance, iconAssignments, 'Type', iconType, 'VARIANT', warnings, 'Card icon display');
    queueComponentProperty(iconInstance, iconAssignments, 'Color', iconDisplay === 'hero' ? heroColor : 'action', 'VARIANT', warnings, 'Card hero color');
    icon = await findMaterialIconComponentAsync(iconName, warnings);
    if (icon) iconPropertyApplied = queueIconSwapProperty(iconInstance, iconAssignments, icon);
    if (!iconPropertyApplied) iconPropertyApplied = queueIconTextProperty(iconInstance, iconAssignments, iconName);
    applyQueuedProperties(iconInstance, iconAssignments, warnings, 'Card icon properties');
    await finalizeMaterialIconUpdate(iconInstance, iconName, icon, iconPropertyApplied, warnings, 'Card icon');
  } else if (showIcon) {
    const fallbackAssignments = {};
    icon = await findMaterialIconComponentAsync(iconName, warnings);
    if (icon) iconPropertyApplied = queueIconSwapProperty(instance, fallbackAssignments, icon);
    if (!iconPropertyApplied) iconPropertyApplied = queueIconTextProperty(instance, fallbackAssignments, iconName);
    applyQueuedProperties(instance, fallbackAssignments, warnings, 'Card icon properties');
    await finalizeMaterialIconUpdate(instance, iconName, icon, iconPropertyApplied, warnings, 'Card icon');
  }
  if (props.iconDisplay && !CARD_ICON_DISPLAYS.includes(props.iconDisplay)) {
    warnings.push(`Card iconDisplay="${props.iconDisplay}" is not supported; the default icon display was used.`);
  }
  if (props.heroColor && !CARD_HERO_COLORS.includes(props.heroColor)) {
    warnings.push(`Card heroColor="${props.heroColor}" is not supported; action was used.`);
  }
  syncCardIconPositionForWidth(instance, warnings);
}

async function importCard(node, warnings) {
  const instance = await createComponentInstance('Card', warnings);
  await applyCard(instance, node, warnings);
  await replaceNativeSlotChildren(instance, 'Content Slot', node.children, warnings, 'Card');
  return instance;
}

function bannerSlotChildren(node) {
  if (Array.isArray(node.children)) return node.children;
  const fallback = node && node.content && typeof node.content.fallback === 'string'
    ? node.content.fallback.trim()
    : '';
  return fallback
    ? [{ id: `${node.id || 'banner'}-content`, type: 'Paragraph', props: { size: 'sm', color: 'muted' }, content: { fallback } }]
    : [];
}

function calendarDateParts(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return { month: value.month == null ? '' : String(value.month), day: value.day == null ? '' : String(value.day) };
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return {
        month: parsed.toLocaleString('en-US', { month: 'short' }),
        day: String(parsed.getDate()),
      };
    }
  }
  return null;
}

async function applyBanner(instance, node, warnings) {
  if (instance.type !== 'INSTANCE') {
    warnings.push('This Banner was detached to host editable Content Slot children; rerender it to apply variant or status changes.');
    return;
  }
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const assignments = {};
  const hasIconProp = Object.prototype.hasOwnProperty.call(props, 'icon');
  const variant = BANNER_VARIANTS.includes(props.variant) ? props.variant : 'inline';
  const status = BANNER_STATUSES.includes(props.status) ? props.status : 'neutral';
  queueComponentProperty(instance, assignments, 'Variant', variant, 'VARIANT', warnings, 'Banner variant');
  queueComponentProperty(instance, assignments, 'Status', status, 'VARIANT', warnings, 'Banner status');
  if (typeof props.title === 'string') queueComponentProperty(instance, assignments, 'Title', props.title, 'TEXT', warnings, 'Banner title');
  if (variant === 'calendar') {
    if (typeof props.eyebrow === 'string') queueComponentProperty(instance, assignments, 'Eyebrow', props.eyebrow, 'TEXT', warnings, 'Banner eyebrow');
    const date = calendarDateParts(props.date);
    if (date) {
      queueComponentProperty(instance, assignments, 'Month', date.month, 'TEXT', warnings, 'Banner month');
      queueComponentProperty(instance, assignments, 'Day', date.day, 'TEXT', warnings, 'Banner day');
    } else if (props.date !== undefined) {
      warnings.push('Banner date must be an ISO date string or { month, day }; the calendar date was not updated.');
    }
  }
  const iconName = typeof props.icon === 'string' && props.icon.trim()
    ? props.icon.trim()
    : (variant !== 'calendar' ? BANNER_DEFAULT_ICONS[status] : '');
  if (iconName) {
    const icon = await findMaterialIconComponentAsync(iconName, warnings);
    if (icon) queueIconSwapProperty(instance, assignments, icon);
    else if (hasIconProp) warnings.push(`No Material icon component named "${iconName}" exists in this file — the Banner icon was not updated.`);
  }
  applyQueuedProperties(instance, assignments, warnings, 'Banner properties');
  for (const runtimeProp of ['action', 'onDismiss']) {
    if (props[runtimeProp] !== undefined) warnings.push(`Banner "${runtimeProp}" is runtime-only and was not applied in Figma.`);
  }
}

async function importBanner(node, warnings) {
  const instance = await createComponentInstance('Banner', warnings);
  await applyBanner(instance, node, warnings);
  const children = bannerSlotChildren(node);
  const hasExplicitContent = Array.isArray(node.children)
    || Boolean(node && node.content && typeof node.content.fallback === 'string' && node.content.fallback.trim());
  if (!hasExplicitContent) return instance;

  // Figma's plugin API cannot author native Slot nodes, and it rejects child
  // insertion into an ordinary frame inside an instance. Preserve the fully
  // configured Banner visual by detaching only when JSON actually supplies
  // editable slot content, then tag the frame so future exports retain its
  // Banner identity and prop contract.
  const detached = instance.detachInstance();
  detached.setSharedPluginData(DETACHED_COMPONENT_NAMESPACE, DETACHED_COMPONENT_KEY, 'Banner');
  detached.setSharedPluginData(DETACHED_COMPONENT_NAMESPACE, DETACHED_BANNER_PROPS_KEY, JSON.stringify(node.props || {}));
  await replaceNativeSlotChildren(detached, 'Content Slot', children, warnings, 'Banner');
  warnings.push('Banner was detached to render editable Content Slot children; rerender it to change visual Banner props.');
  return detached;
}

function iconSizeFromNode(node) {
  const current = liveNode(node) || node;
  const fontSize = current && current.type === 'TEXT' && current.fontSize !== figma.mixed
    ? figmaNumber(current.fontSize, 0)
    : 0;
  const pixels = fontSize || Math.max(figmaNumber(current && current.width, 0), figmaNumber(current && current.height, 0));
  if (!pixels) return '';
  let best = 'md';
  let delta = Infinity;
  for (const [size, value] of Object.entries(ICON_SIZE_PIXELS)) {
    const next = Math.abs(pixels - value);
    if (next < delta) {
      best = size;
      delta = next;
    }
  }
  return best;
}

function applyIconSize(node, requestedSize, warnings) {
  const size = normalizeIconSize(requestedSize);
  const pixels = ICON_SIZE_PIXELS[size];
  if (!pixels) return;
  const current = liveNode(node) || node;
  try {
    if (current.type === 'TEXT') {
      current.fontSize = pixels;
      current.lineHeight = { unit: 'PIXELS', value: pixels };
      current.textAutoResize = 'WIDTH_AND_HEIGHT';
    } else {
      current.resize(pixels, pixels);
    }
  } catch (error) {
    warnings.push(`Icon size="${size}" could not be applied in Figma: ${error.message}`);
  }
}

function iconPaintCarriers(node) {
  const current = liveNode(node) || node;
  if (!current) return [];
  if (current.type === 'TEXT') return [current];
  try {
    if (!('findAll' in current)) return [];
    const carriers = current.findAll((child) => {
      try {
        return Array.isArray(child.fills)
          && child.fills.some((paint) => paint && paint.type === 'SOLID' && paint.visible !== false);
      } catch {
        return false;
      }
    });
    if (carriers.length) return carriers;
    return Array.isArray(current.fills) ? [current] : [];
  } catch {
    return [];
  }
}

function iconColorFromNode(node) {
  for (const carrier of iconPaintCarriers(node)) {
    try {
      const paints = Array.isArray(carrier.fills) ? carrier.fills : [];
      for (const paint of paints) {
        const variable = boundColorVariable(paint);
        const color = iconColorFromVariableName(variable && variable.name);
        if (color) return color;
      }
    } catch {
      // Continue to the next visible icon paint.
    }
  }
  return normalizeIconColor(iconPluginData(node, A1_ICON_COLOR_KEY));
}

function bindIconCarrierColor(carrier, colorVariable) {
  const existing = Array.isArray(carrier.fills) ? carrier.fills : [];
  let boundCount = 0;
  const fills = existing.map((paint) => {
    if (!paint || paint.type !== 'SOLID' || paint.visible === false) return paint;
    boundCount += 1;
    return figma.variables.setBoundVariableForPaint({ ...paint }, 'color', colorVariable);
  });
  if (!boundCount) return false;
  if (carrier.type === 'TEXT' && carrier.characters.length > 0 && typeof carrier.setRangeFills === 'function') {
    carrier.setRangeFills(0, carrier.characters.length, fills);
  } else {
    carrier.fills = fills;
  }
  return true;
}

async function applyIconColor(node, color, warnings) {
  const variable = await findIconColorVariable(color);
  const variableName = ICON_COLOR_VARIABLE_NAMES[color || 'default'];
  if (!variable) {
    warnings.push(`No A1 color variable named "${variableName}" was found in this file or enabled libraries; Icon color was not applied.`);
    return false;
  }
  let applied = false;
  for (const carrier of iconPaintCarriers(node)) {
    try {
      applied = bindIconCarrierColor(carrier, variable) || applied;
    } catch {
      // An inherited instance layer can reject an override; try the next paint.
    }
  }
  if (!applied) warnings.push(`Icon has no editable solid fill to bind to "${variableName}".`);
  return applied;
}

function iconNameFromNode(node) {
  const current = liveNode(node) || node;
  if (current && current.type === 'TEXT') return materialIconNameFromTextNode(current);
  const overriddenName = materialIconNameCandidate(iconPluginData(current, A1_ICON_NAME_KEY));
  return overriddenName || materialIconNameFromInstance(current);
}

function exportIcon(icon) {
  const name = iconNameFromNode(icon);
  const warnings = [];
  if (!name) warnings.push('The selected icon could not be resolved to a Material Symbols name.');
  const props = { name: name || 'star' };
  const size = iconSizeFromNode(icon);
  if (ICON_SIZES.includes(size) && size !== 'md') props.size = size;
  const color = iconColorFromNode(icon);
  if (ICON_COLORS.includes(color)) props.color = color;
  return {
    node: { id: componentId('Icon', icon), type: 'Icon', props },
    warnings,
  };
}

async function applyIcon(icon, node, warnings, resolvedSource = undefined) {
  const props = node.props || {};
  const rawName = iconNameProp(props);
  const name = materialIconNameCandidate(rawName) || 'star';
  const size = normalizeIconSize(props.size);
  const color = normalizeIconColor(props.color);
  if (props.size !== undefined && size === 'md' && String(props.size).trim().toLowerCase() !== 'md') {
    warnings.push(`Icon size="${props.size}" is not supported; size="md" was used.`);
  }
  if (props.color !== undefined && !color) {
    warnings.push(`Icon color="${props.color}" is not supported; color/text/default was used.`);
  }
  let current = liveNode(icon) || icon;
  let source = resolvedSource;
  if (current.type === 'INSTANCE') {
    if (source === undefined) source = await findMaterialIconComponentAsync(name, warnings);
    if (source) {
      try {
        if (current.mainComponent && current.mainComponent.id !== source.id) current.swapComponent(source);
        current = currentInstance(current);
        setIconPluginData(current, '', color);
      } catch (error) {
        warnings.push(`Icon could not be swapped to "${name}": ${error.message}`);
      }
    } else {
      const textUpdated = await applyMaterialIconText(current, name, warnings, 'Icon');
      if (textUpdated) setIconPluginData(current, name, color);
      else warnings.push(`No Material icon component named "${name}" was found, and the selected icon has no editable Material Symbols text.`);
    }
  } else if (current.type === 'TEXT') {
    try {
      if (current.fontName !== figma.mixed) await figma.loadFontAsync(current.fontName);
      current.characters = name;
      setIconPluginData(current, name, color);
    } catch (error) {
      warnings.push(`Icon glyph could not be changed to "${name}": ${error.message}`);
    }
  }
  applyIconSize(current, size, warnings);
  await applyIconColor(current, color, warnings);
  setIconPluginData(current, current.type === 'TEXT' ? name : iconPluginData(current, A1_ICON_NAME_KEY), color);
  for (const prop of ['fill', 'weight', 'grade', 'opticalSize']) {
    if (props[prop] !== undefined) warnings.push(`Icon ${prop} is runtime-owned for raw Material icon instances and was not applied in Figma.`);
  }
  return liveNode(current) || current;
}

async function importIcon(node, warnings) {
  const props = node.props || {};
  const name = materialIconNameCandidate(iconNameProp(props)) || 'star';
  const source = await findMaterialIconComponentAsync(name, warnings);
  const icon = source ? source.createInstance() : await createMaterialIconTextNode(name);
  return applyIcon(icon, node, warnings, source);
}

function imagePaintOn(node) {
  try {
    return Array.isArray(node && node.fills)
      ? node.fills.find((paint) => paint.type === 'IMAGE' && paint.imageHash)
      : null;
  } catch {
    return null;
  }
}

function figureImageLayer(instance) {
  try {
    let namedImageLayer = null;
    const imagePaintLayer = instance.findOne((child) => {
      if (!['FRAME', 'RECTANGLE', 'INSTANCE'].includes(child.type)) return false;
      if (canonicalKey(child.name) === 'image' && !namedImageLayer) namedImageLayer = child;
      return Boolean(imagePaintOn(child));
    });
    return imagePaintLayer || namedImageLayer;
  } catch {
    return null;
  }
}

function localFigureAsset(src) {
  const id = a1ImageIdFromRef(src);
  return id ? localFigureAssets.get(id) || null : null;
}

async function applyA1FigureImage(instance, src, warnings) {
  const id = a1ImageIdFromRef(src);
  if (!id) return false;
  const asset = localFigureAsset(src);
  const publicUrl = publicA1ImageUrl(src, A1_FIGMA_IMAGE_LIBRARY_PUBLIC_BASE_URL);
  try {
    const imageLayer = figureImageLayer(currentInstance(instance));
    if (!imageLayer) {
      warnings.push('The A1 Figure image was resolved, but the Figure Image layer was not found.');
      return true;
    }
    let image;
    if (asset) {
      const bytes = base64ToBytes(asset.dataBase64);
      if (bytes.byteLength === 0 || bytes.byteLength > LOCAL_FIGMA_IMAGE_MAX_BYTES) {
        warnings.push('Local Figure image was not applied because it exceeds the 4 MB handoff limit.');
        return true;
      }
      image = figma.createImage(bytes);
    } else if (publicUrl) {
      image = await figma.createImageAsync(publicUrl);
    } else {
      warnings.push(`A1 Figure image "${id}" is not available in this local handoff or the public Image Library.`);
      return true;
    }
    imageLayer.fills = [{ type: 'IMAGE', imageHash: image.hash, scaleMode: 'FILL' }];
    return true;
  } catch (error) {
    warnings.push(`A1 Figure image "${id}" could not be applied: ${error.message}`);
    return true;
  }
}

function applyFigureLayout(instance, size, aspectRatio, warnings) {
  const liveInstance = currentInstance(instance);
  const maxWidth = FIGURE_MAX_WIDTHS[size];
  if (maxWidth) {
    try {
      liveInstance.maxWidth = maxWidth;
      liveInstance.minWidth = null;
    } catch (error) {
      warnings.push(`Figure max width could not be applied: ${error.message}`);
    }
  }
  const image = figureImageLayer(liveInstance);
  const ratio = FIGURE_RATIO_VALUES[aspectRatio];
  if (!image || !ratio) return;
  try {
    // Variant replacement can leave the image with its old source width while
    // the outer Figure has already resolved to the selected size. Locking from
    // that stale width makes wide/tall ratios visibly wrong. The Figure is the
    // width authority; the Image fills it and derives only its height here.
    const width = Number.isFinite(liveInstance.width) && liveInstance.width > 0
      ? liveInstance.width
      : image.width;
    image.resizeWithoutConstraints(width, Math.round(width / ratio));
    image.lockAspectRatio();
  } catch (error) {
    warnings.push(`Figure image aspect ratio could not be locked: ${error.message}`);
  }
}

async function applyFigure(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const assignments = {};
  queueComponentProperty(instance, assignments, 'Source', typeof props.src === 'string' ? props.src : '', 'TEXT', warnings, 'Figure source');
  queueComponentProperty(instance, assignments, 'Alt', typeof props.alt === 'string' ? props.alt : '', 'TEXT', warnings, 'Figure alt text');
  const caption = typeof props.caption === 'string' ? props.caption : '';
  queueComponentProperty(instance, assignments, 'Caption', caption, 'TEXT', warnings, 'Figure caption');
  queueComponentProperty(instance, assignments, 'Show caption', Boolean(caption), 'BOOLEAN', warnings, 'Figure caption visibility');
  if (props.size !== undefined) {
    if (FIGURE_SIZES.includes(props.size)) queueComponentProperty(instance, assignments, 'Size', props.size, 'VARIANT', warnings, 'Figure size');
    else warnings.push(`Figure size="${props.size}" is not available in the compact Figma Figure asset.`);
  }
  if (props.aspectRatio !== undefined) {
    if (FIGURE_ASPECT_RATIOS.includes(props.aspectRatio)) queueComponentProperty(instance, assignments, 'Aspect ratio', props.aspectRatio, 'VARIANT', warnings, 'Figure aspect ratio');
    else warnings.push(`Figure aspectRatio="${props.aspectRatio}" is not available in the compact Figma Figure asset.`);
  }
  applyQueuedProperties(instance, assignments, warnings, 'Figure properties');
  applyFigureLayout(
    instance,
    FIGURE_SIZES.includes(props.size) ? props.size : 'sm',
    FIGURE_ASPECT_RATIOS.includes(props.aspectRatio) ? props.aspectRatio : '16:9',
    warnings,
  );
  const appliedA1Image = await applyA1FigureImage(instance, props.src, warnings);
  if (props.src && !appliedA1Image) warnings.push('Figure source is retained as component metadata; edit the image fill directly in Figma when a visual needs to change.');
}

async function importFigure(node, warnings) {
  const instance = await createComponentInstance('Figure', warnings);
  await applyFigure(instance, node, warnings);
  return instance;
}

function definitionItemsFromJson(node, warnings) {
  const source = node.props && Array.isArray(node.props.items) ? node.props.items : [];
  return source.map((item, index) => {
    const label = definitionItemText(item && item.label, 'Label');
    const value = definitionItemText(item && (item.value !== undefined ? item.value : item.children), 'Value');
    if (!label && !value) {
      warnings.push(`Definition List item ${index + 1} has no serializable label or value and was skipped.`);
      return null;
    }
    return { label, value };
  }).filter(Boolean);
}

async function createDefinitionItem(item, direction, size = 'md') {
  const source = await findComponentSourceAsync('Definition List Item');
  if (source) {
    const instance = source.createInstance();
    await loadInstanceFonts(instance);
    const assignments = {};
    queueComponentProperty(instance, assignments, 'Direction', direction, 'VARIANT', [], 'Definition List Item direction');
    queueComponentProperty(instance, assignments, 'Size', size, 'VARIANT', [], 'Definition List Item size');
    queueComponentProperty(instance, assignments, 'Label', item.label, 'TEXT', [], 'Definition List Item label');
    queueComponentProperty(instance, assignments, 'Value', item.value, 'TEXT', [], 'Definition List Item value');
    if (Object.keys(assignments).length > 0) instance.setProperties(assignments);
    return instance;
  }
  throw new Error('No "Definition List Item" component was found. The plugin no longer generates local fallback components.');
}

async function replaceDefinitionItems(instance, node, warnings) {
  const items = definitionItemsFromJson(node, warnings);
  const direction = DEFINITION_LIST_DIRECTIONS.includes(node.props && node.props.direction) ? node.props.direction : 'row';
  const size = DEFINITION_LIST_SIZES.includes(node.props && node.props.size) ? node.props.size : 'md';
  let slot = namedSlot(currentInstance(instance), 'Items Slot');
  if (!slot) {
    warnings.push('Definition List Items Slot was not found — items were not rendered.');
    return;
  }
  for (const child of [...slot.children]) {
    try {
      child.remove();
    } catch (error) {
      try {
        child.visible = false;
      } catch (visibilityError) {
        warnings.push(`Definition List item placeholder could not be cleared: ${visibilityError.message}`);
      }
    }
  }
  for (const item of items) {
    const row = await createDefinitionItem(item, direction, size);
    slot = namedSlot(currentInstance(instance), 'Items Slot');
    if (!slot) {
      warnings.push('Definition List Items Slot could not be refreshed — remaining items were not rendered.');
      return;
    }
    slot.appendChild(row);
    row.layoutSizingHorizontal = 'FILL';
  }
}

async function applyDefinitionList(instance, node, warnings) {
  const props = node.props || {};
  const assignments = {};
  const direction = DEFINITION_LIST_DIRECTIONS.includes(props.direction) ? props.direction : 'row';
  const size = DEFINITION_LIST_SIZES.includes(props.size) ? props.size : 'md';
  queueComponentProperty(instance, assignments, 'Direction', direction, 'VARIANT', warnings, 'Definition List direction');
  queueComponentProperty(instance, assignments, 'Size', size, 'VARIANT', warnings, 'Definition List size');
  applyQueuedProperties(instance, assignments, warnings, 'Definition List properties');
  for (const prop of ['labelWidth', 'copyValue', 'copyLabel', 'copiedLabel', 'valueHeadingProps']) {
    if (props[prop] !== undefined) warnings.push(`Definition List ${prop} has no representation in the simple Figma component.`);
  }
}

async function importDefinitionList(node, warnings) {
  const instance = await createComponentInstance('Definition List', warnings);
  await applyDefinitionList(instance, node, warnings);
  await replaceDefinitionItems(instance, node, warnings);
  return instance;
}

async function applyBlockquote(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const assignments = {};
  const variant = BLOCKQUOTE_VARIANTS.includes(props.variant) ? props.variant : 'border';
  queueComponentProperty(instance, assignments, 'Variant', variant, 'VARIANT', warnings, 'Blockquote variant');
  if (node.content && typeof node.content.fallback === 'string') {
    queueComponentProperty(instance, assignments, 'Quote', node.content.fallback, 'TEXT', warnings, 'Blockquote quote');
  }
  const cite = typeof props.cite === 'string' ? props.cite : '';
  queueComponentProperty(instance, assignments, 'Citation', cite, 'TEXT', warnings, 'Blockquote citation');
  queueComponentProperty(instance, assignments, 'Citation URL', typeof props.citeUrl === 'string' ? props.citeUrl : '', 'TEXT', warnings, 'Blockquote citation URL');
  queueComponentProperty(instance, assignments, 'Show citation', Boolean(cite), 'BOOLEAN', warnings, 'Blockquote citation visibility');
  applyQueuedProperties(instance, assignments, warnings, 'Blockquote properties');
}

async function importBlockquote(node, warnings) {
  const instance = await createComponentInstance('Blockquote', warnings);
  await applyBlockquote(instance, node, warnings);
  return instance;
}

async function legacyApplyCode(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const assignments = {};
  const variant = props.variant === 'inline' ? 'inline' : 'block';
  queueOptionalComponentProperty(instance, assignments, 'Variant', variant, 'VARIANT');
  if (props.wrapping !== undefined) {
    queueOptionalComponentProperty(instance, assignments, 'Wrapping', props.wrapping === true, 'BOOLEAN');
  }
  if (props.editable !== undefined) {
    queueOptionalComponentProperty(instance, assignments, 'Editable', props.editable === true, 'BOOLEAN');
  }
  if (props.copyCode !== undefined) {
    queueOptionalComponentProperty(instance, assignments, 'Copy code', props.copyCode === true, 'BOOLEAN')
      || queueOptionalComponentProperty(instance, assignments, 'Copy Code', props.copyCode === true, 'BOOLEAN')
      || queueOptionalComponentProperty(instance, assignments, 'Show copy', props.copyCode === true, 'BOOLEAN')
      || queueOptionalComponentProperty(instance, assignments, 'Show copy button', props.copyCode === true, 'BOOLEAN');
  }
  if (typeof props.copyText === 'string') {
    queueOptionalComponentProperty(instance, assignments, 'Copy text', props.copyText, 'TEXT')
      || queueOptionalComponentProperty(instance, assignments, 'Copy Text', props.copyText, 'TEXT');
  }
  if (props.collapsedLines !== undefined) {
    queueOptionalComponentProperty(instance, assignments, 'Collapsed lines', String(props.collapsedLines), 'TEXT')
      || queueOptionalComponentProperty(instance, assignments, 'Collapsed Lines', String(props.collapsedLines), 'TEXT');
  }
  const value = node.content && typeof node.content.fallback === 'string'
    ? node.content.fallback
    : typeof props.children === 'string'
      ? props.children
      : 'Code sample';
  const appliedTextProperty = queueOptionalComponentProperty(instance, assignments, 'Code', value, 'TEXT')
    || queueOptionalComponentProperty(instance, assignments, 'Content', value, 'TEXT')
    || queueOptionalComponentProperty(instance, assignments, 'Value', value, 'TEXT')
    || queueOptionalComponentProperty(instance, assignments, 'Text', value, 'TEXT');
  applyQueuedProperties(instance, assignments, warnings, 'Code properties');
  if (!appliedTextProperty) {
    await writeFirstNamedText(instance, ['Code', 'Content', 'Value', 'Text'], value, warnings, 'Code text');
  }
  for (const runtimeProp of ['onChangeValue', 'className', 'id']) {
    if (props[runtimeProp] !== undefined) warnings.push(`"${runtimeProp}" is a runtime prop with no Figma representation — ignored.`);
  }
}

async function legacyImportCode(node, warnings) {
  const instance = await createComponentInstance('Code', warnings);
  await applyCode(instance, node, warnings);
  return instance;
}

async function legacyApplyInline(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const assignments = {};
  const requestedElement = typeof props.inlineElement === 'string' ? props.inlineElement : 'all';
  const element = INLINE_ELEMENTS.includes(requestedElement) ? requestedElement : 'all';
  queueOptionalComponentProperty(instance, assignments, 'Inline element', element, 'VARIANT')
    || queueOptionalComponentProperty(instance, assignments, 'Element', element, 'VARIANT')
    || queueOptionalComponentProperty(instance, assignments, 'Type', element, 'VARIANT');

  const value = node.content && typeof node.content.fallback === 'string'
    ? node.content.fallback
    : typeof props.children === 'string'
      ? props.children
      : 'Inline text';
  const appliedTextProperty = queueOptionalComponentProperty(instance, assignments, 'Markdown', value, 'TEXT')
    || queueOptionalComponentProperty(instance, assignments, 'Content', value, 'TEXT')
    || queueOptionalComponentProperty(instance, assignments, 'Value', value, 'TEXT')
    || queueOptionalComponentProperty(instance, assignments, 'Text', value, 'TEXT');
  applyQueuedProperties(instance, assignments, warnings, 'Inline properties');
  if (!appliedTextProperty) {
    await writeFirstNamedText(instance, ['Markdown', 'Content', 'Value', 'Text'], value, warnings, 'Inline text');
  }
  for (const runtimeProp of ['className', 'id']) {
    if (props[runtimeProp] !== undefined) warnings.push(`"${runtimeProp}" is a runtime prop with no Figma representation — ignored.`);
  }
}

async function legacyImportInline(node, warnings) {
  const instance = await createComponentInstance('Inline', warnings);
  await applyInline(instance, node, warnings);
  return instance;
}

async function applyButtonContainer(instance, node, warnings) {
  const props = node.props || {};
  const requestedAlign = props.align;
  if (requestedAlign && typeof requestedAlign === 'object') {
    warnings.push('"align" responsive objects have no Figma representation — start was used.');
  } else if (requestedAlign !== undefined && !BUTTON_CONTAINER_ALIGNS.includes(requestedAlign)) {
    warnings.push(`align="${requestedAlign}" is not supported — start was used.`);
  }
  const align = BUTTON_CONTAINER_ALIGNS.includes(requestedAlign) ? requestedAlign : 'start';
  const assignments = {};
  queueComponentProperty(instance, assignments, 'Align', align, 'VARIANT', warnings, 'Button Container alignment');
  applyQueuedProperties(instance, assignments, warnings, 'Button Container properties');

  for (const runtimeProp of ['size', 'fillButtons']) {
    if (props[runtimeProp] !== undefined) {
      warnings.push(`"${runtimeProp}" has no Button Container Figma representation — ignored.`);
    }
  }
}

function buttonContainerChildren(node, warnings) {
  const collected = [];
  collectSupportedNodes(node.children || [], collected);
  const renderable = collected.filter((child) => !(
    activeActionTargetImportContext &&
    child &&
    typeof child === 'object' &&
    typeof child.id === 'string' &&
    activeActionTargetImportContext.targetNodes.has(child.id)
  ));
  const buttons = renderable.filter((child) => child.type === 'Button');
  if (renderable.length !== buttons.length) {
    warnings.push('Only Button children are supported inside Button Container; unsupported children were omitted.');
  }
  return buttons;
}

async function importButtonContainer(node, warnings) {
  const instance = await createComponentInstance('Button Container', warnings);
  await applyButtonContainer(instance, node, warnings);
  const children = buttonContainerChildren(node, warnings);
  if (children.length === 0) return syncButtonContainerForWidth(instance, warnings);

  const slot = buttonContainerSlot(instance);
  const existing = slot && 'children' in slot
    ? slot.children.filter((child) => buttonContainerSlotJsonType(child) === 'Button')
    : [];

  // Keep the component instance when its representative Button Slot has the
  // same number of actions. This is the normal JSON round-trip path: each
  // Button gets its own props/label without flattening the container.
  if (slot && existing.length === children.length) {
    for (let index = 0; index < children.length; index += 1) {
      await applyButton(existing[index], children[index], warnings);
    }
    return syncButtonContainerForWidth(instance, warnings);
  }

  // A native Slot can accept structural changes while retaining the outer
  // component instance. Frame-based legacy Button Slots are no longer detached
  // into fallback layouts.
  if (slot && slot.type === 'SLOT') {
    for (const existingChild of [...slot.children]) {
      try {
        existingChild.remove();
      } catch (error) {
        try {
          existingChild.visible = false;
        } catch (visibilityError) {
          warnings.push(`Button Slot placeholder could not be cleared: ${visibilityError.message}`);
        }
      }
    }
    for (const child of children) slot.appendChild(await importButton(child, warnings));
    return syncButtonContainerForWidth(instance, warnings);
  }

  throw new Error('Button Container children could not be changed because the component does not expose a native Button Slot. The plugin no longer detaches component instances as a fallback layout.');
}

function buttonContainerSlotJsonType(existing) {
  if (existing.type !== 'INSTANCE') return null;
  const componentName = registeredSetName(existing);
  return componentName ? (JSON_TYPE_BY_COMPONENT_NAME[componentName] || componentName) : null;
}

async function applyExistingButtonContainerChildren(instance, node, warnings) {
  const expected = buttonContainerChildren(node, warnings);
  if (expected.length === 0) return;
  const slot = buttonContainerSlot(instance);
  if (!slot || !('children' in slot)) {
    warnings.push('Button Slot was not found — Button children were not updated.');
    return;
  }
  const existing = slot.children.filter((child) => buttonContainerSlotJsonType(child) === 'Button');
  const count = Math.min(existing.length, expected.length);
  for (let index = 0; index < count; index += 1) {
    await applyButton(existing[index], expected[index], warnings);
  }
  if (existing.length !== expected.length) {
    warnings.push(`Button Container has ${existing.length} Button child${existing.length === 1 ? '' : 'ren'} but JSON has ${expected.length}; adding or removing actions requires Render on canvas.`);
  }
  syncButtonContainerForWidth(instance, warnings);
}

// Apply a Section node's props to an existing Section instance (used both when
// rendering a new instance and when updating the current selection).
async function applySection(sectionInstance, node, warnings) {
  const props = node.props || {};
  for (const responsiveProp of ['padding', 'align']) {
    if (props[responsiveProp] && typeof props[responsiveProp] === 'object') {
      warnings.push(`"${responsiveProp}" responsive object has no Figma representation — the default was used.`);
    }
  }
  await loadInstanceFonts(sectionInstance);

  // Properties are applied wherever they live — on the Section set itself or
  // on an internal part instance such as "Section Content" (the split model).
  // Each variant/property write can replace an internal instance layer, so
  // recompute the carriers before every read/write instead of retaining a
  // stale sublayer reference.
  const freshCarriers = () => sectionPropertyCarriers(currentInstance(sectionInstance));

  if (SECTION_SURFACES.includes(props.surface) && !assignSectionVariant(freshCarriers(), ['surface'], props.surface)) {
    warnings.push(`surface="${props.surface}" could not be applied — no Surface property found.`);
  }
  const padding = SECTION_PADDINGS.includes(props.padding) ? props.padding : 'sm';
  if (!assignSectionVariant(freshCarriers(), ['padding'], padding)) {
    warnings.push(`padding="${padding}" could not be applied — no Padding property found.`);
  }
  // contentWidth — the split half of the Figma Section model: a width variant
  // on the Section or a part, then the ContentWidth variable mode as fallback.
  if (SECTION_WIDTHS.includes(props.contentWidth)) {
    const applied = assignSectionVariant(freshCarriers(), ['contentwidth', 'width'], props.contentWidth)
      || applyCollectionMode(currentInstance(sectionInstance), 'ContentWidth', props.contentWidth);
    if (!applied) warnings.push(`contentWidth="${props.contentWidth}" could not be applied — no content-width property or ContentWidth variable mode matched.`);
  }
  if (SECTION_GAPS.includes(props.gap)) {
    const applied = assignSectionVariant(freshCarriers(), ['gap'], props.gap)
      || applyCollectionMode(currentInstance(sectionInstance), 'Gap', props.gap);
    if (!applied) warnings.push(`gap="${props.gap}" could not be applied — no Gap property or variable mode matched.`);
  }
  if (props.inverse === true) {
    const applied = applyCollectionMode(currentInstance(sectionInstance), 'Color', 'Dark');
    if (!applied) warnings.push('inverse could not be applied — the Color collection has no Dark mode.');
  }

  // TEXT documentation properties, wherever the components expose them.
  for (const key of Object.keys(SECTION_TEXT_PROPS)) {
    const def = SECTION_TEXT_PROPS[key];
    const value = props[def.prop];
    if (typeof value !== 'string' || !value) continue;
    const found = findSectionProperty(freshCarriers(), [canonicalKey(key)], 'TEXT');
    if (!found) continue;
    try {
      found.node.setProperties({ [found.key]: value });
    } catch (error) {
      warnings.push(`${def.prop} could not be applied: ${error.message}`);
    }
  }
  if (Array.isArray(props.borderSides)) {
    const found = findSectionProperty(freshCarriers(), ['bordersides'], 'TEXT');
    if (found) {
      try {
        found.node.setProperties({ [found.key]: JSON.stringify(props.borderSides) });
      } catch (error) {
        warnings.push(`borderSides could not be applied: ${error.message}`);
      }
    }
  }
}

async function importSection(node, warnings) {
  const sectionInstance = await createComponentInstance('Section', warnings);
  await applySection(sectionInstance, node, warnings);

  // Child nodes: a Figma instance cannot receive new children, so a Section
  // with children is rendered into its Section Content Slot. Missing Figma
  // mappings fail loudly instead of becoming local placeholders.
  const childNodes = [];
  collectSupportedNodes(node.children || [], childNodes);
  const renderableChildNodes = childNodes.filter((child) => !(
    activeActionTargetImportContext &&
    child &&
    typeof child === 'object' &&
    typeof child.id === 'string' &&
    activeActionTargetImportContext.targetNodes.has(child.id)
  ));
  if (renderableChildNodes.length > 0) {
    if ((node.children || []).some((child) => child && typeof child === 'object' && child.type && !IMPORTERS[child.type])) {
      warnings.push('Unsupported child types inside the Section were not rendered.');
    }

    // A1's current Section exposes a real native content Slot. Populate that
    // slot while the Section remains an instance so its intended layout,
    // clipping, and content-width carrier stay intact. This mirrors the
    // Dialog body/footer slot path and avoids appending payload layers behind
    // a detached Section's internal content frame.
    let slot = sectionContentContainer(currentInstance(sectionInstance));
    if (slot) {
      for (const existing of [...slot.children]) {
        try {
          existing.remove();
        } catch (error) {
          // Inherited slot content cannot always be removed from an instance;
          // hide representative placeholders before adding local JSON nodes.
          try {
            existing.visible = false;
          } catch (visibilityError) {
            warnings.push(`Section placeholder could not be cleared: ${visibilityError.message}`);
          }
        }
      }
      for (const child of renderableChildNodes) {
        const childInstance = await renderImportedNode(child, warnings);
        // Slot mutations can invalidate nested node handles, so resolve the
        // live Section Content Slot before every append.
        slot = sectionContentContainer(currentInstance(sectionInstance));
        if (!slot) {
          warnings.push('Section Content Slot could not be refreshed — remaining child nodes were not rendered.');
          break;
        }
        appendImportedChild(slot, childInstance, child, warnings);
      }
      return sectionInstance;
    }

    throw new Error('The Section Content Slot was not found. The plugin no longer detaches or generates fallback section layouts.');
  }
  return sectionInstance;
}

function sectionSlotJsonType(existing) {
  if (existing.type === 'TEXT') return isMaterialIconTextNode(existing) ? 'Icon' : textSuggestion(existing).type;
  if (existing.type !== 'INSTANCE') return null;
  const componentName = registeredSetName(existing);
  return componentName ? (JSON_TYPE_BY_COMPONENT_NAME[componentName] || componentName) : null;
}

// Updating a selected Section can safely update the real content already in
// its slot. It deliberately does not add/remove layers (that would require
// detaching or reshaping a component instance); instead it reconciles the
// ordered Heading/Paragraph/Button layers the designer has placed there.
async function applyExistingSectionChildren(sectionInstance, node, warnings) {
  const expected = [];
  collectSupportedNodes(node.children || [], expected);
  if (expected.length === 0) return;

  const slot = sectionContentContainer(sectionInstance);
  if (!slot || !('children' in slot)) {
    warnings.push('Section Content Slot was not found — child content was not updated.');
    return;
  }
  const existing = slot.children.filter((child) => sectionSlotJsonType(child));
  const count = Math.min(existing.length, expected.length);

  for (let index = 0; index < count; index += 1) {
    const current = existing[index];
    const child = expected[index];
    const currentType = sectionSlotJsonType(current);
    if (currentType !== child.type) {
      warnings.push(`Section child ${index + 1} is ${currentType || current.type}, not ${child.type} — it was not updated.`);
      continue;
    }
    if ((child.type === 'Heading' || child.type === 'Paragraph') && current.type === 'TEXT') {
      await applyTextSuggestion(current, textStyleRequestForNode(child), warnings);
      if (child.content && typeof child.content.fallback === 'string') {
        if (current.fontName !== figma.mixed) await figma.loadFontAsync(current.fontName);
        current.characters = child.content.fallback;
      }
    } else if (child.type === 'Icon' && (current.type === 'TEXT' || current.type === 'INSTANCE')) {
      await applyIcon(current, child, warnings);
    } else if (child.type === 'Button' && current.type === 'INSTANCE') {
      await applyButton(current, child, warnings);
    } else {
      warnings.push(`Section child ${index + 1} (${child.type}) is not yet updateable in place.`);
    }
  }

  if (existing.length !== expected.length) {
    warnings.push(`Section has ${existing.length} supported slot layer${existing.length === 1 ? '' : 's'} but JSON has ${expected.length}; adding or removing slot layers requires Render on canvas.`);
  }
}

async function applyTextField(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const state = props.error ? 'error'
    : props.disabled ? 'disabled'
      : props.readOnly ? 'readOnly'
        : props.required ? 'required'
          : 'default';
  const size = TEXT_FIELD_SIZES.includes(props.size) ? props.size : 'default';
  const assignments = {};
  queueComponentProperty(instance, assignments, 'Size', size, 'VARIANT', warnings);
  queueComponentProperty(instance, assignments, 'State', state, 'VARIANT', warnings);
  queueComponentProperty(instance, assignments, 'Show label', typeof props.label === 'string' && props.label.length > 0, 'BOOLEAN', warnings);
  if (typeof props.label === 'string') queueComponentProperty(instance, assignments, 'Label', props.label, 'TEXT', warnings);
  queueComponentProperty(instance, assignments, 'Show hint', !props.error && typeof props.hint === 'string' && props.hint.length > 0, 'BOOLEAN', warnings);
  if (typeof props.hint === 'string') queueComponentProperty(instance, assignments, 'Hint', props.hint, 'TEXT', warnings);
  if (typeof props.error === 'string') queueComponentProperty(instance, assignments, 'Error', props.error, 'TEXT', warnings);
  const defaultValue = typeof props.defaultValue === 'string' ? props.defaultValue : '';
  queueComponentProperty(instance, assignments, 'Value', defaultValue, 'TEXT', warnings);
  applyQueuedProperties(instance, assignments, warnings, 'Text Field properties');

  for (const runtimeProp of ['value', 'type', 'labelPosition', 'autoComplete', 'inputOverlay', 'id', 'className']) {
    if (props[runtimeProp] !== undefined) warnings.push(`"${runtimeProp}" has no Figma representation — ignored.`);
  }
}

async function importTextField(node, warnings) {
  const instance = await createComponentInstance('Text Field', warnings);
  await applyTextField(instance, node, warnings);
  return instance;
}

async function applySelect(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const state = props.error ? 'error' : props.disabled ? 'disabled' : 'default';
  const size = SELECT_SIZES.includes(props.size) ? props.size : 'default';
  const showValue = props.showValue === true;
  const assignments = {};

  queueComponentProperty(instance, assignments, 'Size', size, 'VARIANT', warnings, 'Select size');
  queueComponentProperty(instance, assignments, 'State', state, 'VARIANT', warnings, 'Select state');
  queueComponentProperty(instance, assignments, 'Show value', showValue, 'BOOLEAN', warnings, 'Select Show value');
  queueComponentProperty(instance, assignments, 'Required', props.required === true, 'BOOLEAN', warnings, 'Select Required');
  if (typeof props.label === 'string') queueComponentProperty(instance, assignments, 'Label', props.label, 'TEXT', warnings, 'Select label');
  if (typeof props.hint === 'string') queueComponentProperty(instance, assignments, 'Hint', props.hint, 'TEXT', warnings, 'Select hint');
  if (typeof props.error === 'string') queueComponentProperty(instance, assignments, 'Error message', props.error, 'TEXT', warnings, 'Select error message');
  if (showValue && typeof props.defaultValue === 'string' && props.defaultValue) {
    queueComponentProperty(instance, assignments, 'Value', props.defaultValue, 'TEXT', warnings, 'Select visible value');
  } else if (typeof props.defaultValue === 'string' && props.defaultValue) {
    warnings.push('Select defaultValue was not shown because showValue is false; set showValue: true to display it in Figma.');
  }
  applyQueuedProperties(instance, assignments, warnings, 'Select properties');
  for (const runtimeProp of ['value', 'options', 'labelPosition', 'name', 'autoComplete', 'id', 'className', 'onChange']) {
    if (props[runtimeProp] !== undefined) warnings.push(`"${runtimeProp}" has no Figma representation — ignored.`);
  }
}

async function importSelect(node, warnings) {
  const instance = await createComponentInstance('Select', warnings);
  await applySelect(instance, node, warnings);
  return instance;
}

function groupOptionInstances(instance, optionSetName) {
  return instance.findAll((node) => node.type === 'INSTANCE' && componentSetName(node) === optionSetName);
}

function groupOptionInstancesInSlot(instance, slotName, optionSetName) {
  const slot = groupOptionSlot(currentInstance(instance), slotName);
  if (!slot) return [];
  const isOption = (node) => {
    try {
      return node.type === 'INSTANCE' && componentSetName(node) === optionSetName;
    } catch {
      return false;
    }
  };
  try {
    const direct = slot.children.filter(isOption);
    return direct.length > 0 ? direct : slot.findAll(isOption);
  } catch {
    return [];
  }
}

function currentInstance(instance) {
  const refreshed = resolveNodeById(instance.id);
  return refreshed && refreshed.type === 'INSTANCE' ? refreshed : instance;
}

function groupOptionSlot(instance, slotName) {
  const wanted = canonicalKey(slotName);
  return instance.findOne((node) => node.type === 'SLOT' && canonicalKey(node.name) === wanted);
}

// The group components deliberately use Figma slots rather than a fixed set of
// rows. Reconcile the slot before applying property overrides so JSON changes
// add and remove real Radio/Checkbox Option instances instead of merely hiding
// the original three examples.
async function reconcileGroupOptionInstances(instance, type, optionSetName, requestedCount, warnings) {
  const slotConfig = GROUP_SLOT_CONFIG[type];
  const current = currentInstance(instance);
  const slot = slotConfig && groupOptionSlot(current, slotConfig.slotName);
  if (!slot) {
    warnings.push(`${type} option slot could not be found — items were not reconciled.`);
    if (type === 'TopHeader' || type === 'TopHeaderActions') return [];
    return groupOptionInstances(current, optionSetName);
  }

  const wanted = Math.max(slotConfig.min, Math.min(requestedCount, slotConfig.max));
  if (requestedCount < slotConfig.min) {
    warnings.push(`${type} requires at least ${slotConfig.min} Figma option rows; retained the minimum.`);
  }
  if (requestedCount > slotConfig.max) {
    warnings.push(`${type} supports at most ${slotConfig.max} Figma option rows; additional JSON options were not rendered.`);
  }

  let optionInstances = groupOptionInstancesInSlot(current, slotConfig.slotName, optionSetName);
  const optionSource = await findComponentSourceAsync(optionSetName, warnings);
  if (!optionSource) {
    warnings.push(`No "${optionSetName}" component set was found — items could not be added.`);
    return optionInstances;
  }
  while (optionInstances.length < wanted) {
    const liveGroup = currentInstance(instance);
    const liveSlot = groupOptionSlot(liveGroup, slotConfig.slotName);
    if (!liveSlot) break;
    liveSlot.appendChild(optionSource.createInstance());
    optionInstances = groupOptionInstancesInSlot(currentInstance(instance), slotConfig.slotName, optionSetName);
  }
  while (optionInstances.length > wanted) {
    const liveGroup = currentInstance(instance);
    const liveOptions = groupOptionInstancesInSlot(liveGroup, slotConfig.slotName, optionSetName);
    liveOptions[liveOptions.length - 1].remove();
    optionInstances = groupOptionInstancesInSlot(currentInstance(instance), slotConfig.slotName, optionSetName);
  }
  return optionInstances;
}

function selectedValuesForGroup(type, props) {
  if (type === 'RadioGroup') return typeof props.defaultValue === 'string' ? new Set([props.defaultValue]) : new Set();
  if (typeof props.defaultValue === 'string') return new Set([props.defaultValue]);
  return new Set(Array.isArray(props.defaultValue) ? props.defaultValue.filter((value) => typeof value === 'string') : []);
}

function groupOptionValue(option) {
  if (typeof option.value === 'string') return option.value;
  // `id` is accepted as a convenient compatibility path for a1-web's editor
  // config. Canonical page-definition JSON still uses `options[].value`.
  return typeof option.id === 'string' ? option.id : null;
}

async function applyLegacyChoiceGroup(instance, node, type, optionSetName, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const size = GROUP_SIZES.includes(props.size) ? props.size : 'default';
  const groupAssignments = {};
  queueComponentProperty(instance, groupAssignments, 'Size', size, 'VARIANT', warnings);
  queueComponentProperty(instance, groupAssignments, 'Inline', props.inline === true ? 'True' : 'False', 'VARIANT', warnings);
  queueComponentProperty(instance, groupAssignments, 'Required', props.required === true, 'BOOLEAN', warnings);
  if (typeof props.label === 'string') queueComponentProperty(instance, groupAssignments, 'Label', props.label, 'TEXT', warnings);
  if (typeof props.hint === 'string') queueComponentProperty(instance, groupAssignments, 'Helper', props.hint, 'TEXT', warnings);
  queueOptionalComponentProperty(instance, groupAssignments, 'Show helper', typeof props.hint === 'string' && props.hint.length > 0, 'BOOLEAN');
  applyQueuedProperties(instance, groupAssignments, warnings, `${type} properties`);

  const options = Array.isArray(props.options) ? props.options.filter((option) => option && typeof option === 'object') : [];
  const optionInstances = await reconcileGroupOptionInstances(instance, type, optionSetName, options.length, warnings);
  const selectedValues = selectedValuesForGroup(type, props);
  const matchedSelectedValues = new Set();
  if (props.disabled === true || props.error !== undefined || props.name !== undefined || props.value !== undefined) {
    warnings.push('disabled, error, name, and controlled value are runtime-only for the current Figma group component — ignored.');
  }

  for (let index = 0; index < optionInstances.length; index += 1) {
    const optionInstance = groupOptionInstances(currentInstance(instance), optionSetName)[index];
    const option = options[index];
    const label = typeof option?.label === 'string' && option.label ? option.label : `Option ${index + 1}`;
    const hint = typeof option?.hint === 'string' ? option.hint : '';
    const optionValue = option ? groupOptionValue(option) : null;
    const selected = Boolean(optionValue && selectedValues.has(optionValue));
    if (selected) matchedSelectedValues.add(optionValue);
    const optionAssignments = {};
    queueComponentProperty(optionInstance, optionAssignments, 'Label', label, 'TEXT', warnings, `Option ${index + 1} label`);
    queueComponentProperty(optionInstance, optionAssignments, 'Hint', hint, 'TEXT', warnings, `Option ${index + 1} hint`);
    queueComponentProperty(optionInstance, optionAssignments, 'Show hint', Boolean(hint), 'BOOLEAN', warnings, `Option ${index + 1} hint visibility`);
    queueComponentProperty(optionInstance, optionAssignments, 'Size', size, 'VARIANT', warnings, `Option ${index + 1} size`);
    queueComponentProperty(optionInstance, optionAssignments, 'selected', selected ? 'true' : 'false', 'VARIANT', warnings, `Option ${index + 1} selection`);
    applyQueuedProperties(optionInstance, optionAssignments, warnings, `Option ${index + 1} properties`);
    if (option?.disabled === true) warnings.push(`Option "${label}" is disabled in JSON, but option-level disabled is not represented by the Figma component.`);
  }
  for (const value of selectedValues) {
    if (!matchedSelectedValues.has(value)) warnings.push(`defaultValue "${value}" did not match an imported ${type} option value.`);
  }
}

async function importRadioGroup(node, warnings) {
  const instance = await createComponentInstance('Radio Group', warnings);
  await applyRadioGroup(instance, node, warnings);
  return instance;
}

async function importCheckboxGroup(node, warnings) {
  const instance = await createComponentInstance('Checkbox Group', warnings);
  await applyCheckboxGroup(instance, node, warnings);
  return instance;
}

async function applyRadioGroup(instance, node, warnings) {
  await applyLegacyChoiceGroup(instance, node, 'RadioGroup', 'Radio Option', warnings);
}

async function applyCheckboxGroup(instance, node, warnings) {
  await applyLegacyChoiceGroup(instance, node, 'CheckboxGroup', 'Checkbox Option', warnings);
}

function menuItemInstances(instance) {
  const root = liveNode(currentInstance(instance));
  if (!root || !('children' in root)) return [];
  const rows = [];
  const queue = [...stackFlowChildren(root)];
  const visited = new Set();
  while (queue.length) {
    const candidate = liveNode(queue.shift());
    if (!candidate || visited.has(candidate.id)) continue;
    visited.add(candidate.id);
    try {
      if (candidate.type === 'INSTANCE' && componentSetName(candidate) === 'Menu Item') {
        rows.push(candidate);
        continue;
      }
      if ('children' in candidate) queue.push(...stackFlowChildren(candidate));
    } catch {
      // Figma can leave stale native instance sublayers immediately after an
      // instance is imported or a row variant is changed. Skip those dead
      // proxies instead of letting a get_name failure abort Menu creation.
    }
  }
  return rows;
}

function applyMenuItem(instance, item, warnings) {
  const isDivider = item.kind === 'divider';
  const isSection = item.kind === 'section';
  const label = typeof item.label === 'string' && item.label ? item.label : (isSection ? 'Section' : 'Menu item');
  const assignments = {};
  queueComponentProperty(instance, assignments, 'Type', isDivider ? 'Divider' : isSection ? 'Menu Section' : 'Menu Item', 'VARIANT', warnings, 'Menu item type');
  if (isDivider) {
    queueComponentProperty(instance, assignments, 'State', 'default', 'VARIANT', warnings, 'Menu divider state');
    applyQueuedProperties(instance, assignments, warnings, 'Menu divider properties');
    return;
  }
  queueComponentProperty(instance, assignments, 'Label', label, 'TEXT', warnings, 'Menu item label');
  if (isSection) {
    applyQueuedProperties(instance, assignments, warnings, 'Menu section properties');
    return;
  }

  const state = item.disabled === true ? 'disabled' : item.destructive === true ? 'destructive' : item.active === true ? 'active' : 'default';
  queueComponentProperty(instance, assignments, 'State', state, 'VARIANT', warnings, 'Menu item state');
  const icon = typeof item.icon === 'string' ? item.icon : '';
  queueComponentProperty(instance, assignments, 'Show icon', Boolean(icon), 'BOOLEAN', warnings, 'Menu item icon visibility');
  if (icon) {
    const iconComponent = findIconComponent(icon);
    if (iconComponent) queueComponentProperty(instance, assignments, 'Icon', iconComponent.id, 'INSTANCE_SWAP', warnings, 'Menu item icon');
    else warnings.push(`No icon component named "${icon}" exists in this file — the default glyph is shown.`);
  }
  const shortcut = typeof item.shortcut === 'string' ? item.shortcut : '';
  queueComponentProperty(instance, assignments, 'Shortcut', shortcut, 'TEXT', warnings, 'Menu item shortcut');
  queueComponentProperty(instance, assignments, 'Show shortcut', Boolean(shortcut), 'BOOLEAN', warnings, 'Menu item shortcut visibility');
  applyQueuedProperties(instance, assignments, warnings, 'Menu item properties');
}

async function applyMenu(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const sourceItems = Array.isArray(props.items) ? props.items : [];
  const items = sourceItems.filter((item) => item && typeof item === 'object');
  const rows = menuItemInstances(instance);
  if (items.length > rows.length) {
    warnings.push(`Menu supports ${rows.length} preconfigured Figma rows; ${items.length - rows.length} additional JSON item(s) were not rendered.`);
  }
  for (let index = 0; index < rows.length; index += 1) {
    const item = items[index];
    rows[index].visible = Boolean(item);
    if (item) applyMenuItem(rows[index], item, warnings);
  }
  for (const runtimeProp of ['open', 'onClose', 'anchorRef', 'trapFocus', 'modalOnMobile', 'aria-label']) {
    if (props[runtimeProp] !== undefined) warnings.push(`"${runtimeProp}" has no Figma representation — ignored.`);
  }
}

async function importMenu(node, warnings) {
  const instance = await createComponentInstance('Menu', warnings);
  await applyMenu(instance, node, warnings);
  return instance;
}

function clearDialogBodySlot(instance, warnings, reason = 'Dialog body slot') {
  let liveInstance = currentInstance(instance);
  let slot = dialogBodySlot(liveInstance);
  if (!slot) {
    warnings.push(`${reason} could not be found.`);
    return null;
  }

  // Remove prior bridge/local content. Figma invalidates nested references
  // after each slot mutation, so refresh the instance before the next pass.
  let existing = slot.children.find((child) => !child.id.startsWith('I'));
  while (existing) {
    existing.remove();
    liveInstance = currentInstance(instance);
    slot = dialogBodySlot(liveInstance);
    if (!slot) {
      warnings.push(`${reason} could not be refreshed.`);
      return null;
    }
    existing = slot.children.find((child) => !child.id.startsWith('I'));
  }
  for (const inherited of slot.children.filter((child) => child.id.startsWith('I'))) {
    try {
      inherited.visible = false;
    } catch (error) {
      warnings.push(`Dialog body placeholder could not be hidden: ${error.message}`);
    }
  }
  return slot;
}

async function replaceDialogBodySlotChildren(instance, children, warnings) {
  const supported = supportedChildren(children || [], warnings, 'Dialog body');
  let slot = clearDialogBodySlot(instance, warnings, 'Dialog body slot');
  if (!slot) {
    if (supported.length > 0) warnings.push('Dialog body children were not rendered.');
    return;
  }
  for (const child of supported) {
    const childInstance = await renderImportedNode(child, warnings);
    slot = dialogBodySlot(currentInstance(instance));
    if (!slot) {
      warnings.push('Dialog body slot could not be refreshed — remaining child nodes were not rendered.');
      break;
    }
    appendImportedChild(slot, childInstance, child, warnings);
  }
}

async function replaceDialogBodySlot(instance, body, warnings) {
  let liveInstance = currentInstance(instance);
  let slot = clearDialogBodySlot(instance, warnings, 'Dialog body slot');
  if (!slot) {
    warnings.push('Dialog body text was not rendered.');
    return;
  }

  const sourceSlot = liveInstance.mainComponent && dialogBodySlot(liveInstance.mainComponent);
  const sourceText = sourceSlot && sourceSlot.findOne((child) => child.type === 'TEXT');
  if (!sourceText || sourceText.type !== 'TEXT' || sourceText.fontName === figma.mixed) {
    warnings.push('Dialog body slot has no editable text template — body text was not rendered.');
    return;
  }

  // Insert a basic local text node first. Applying text style before insertion
  // causes Figma's slot API to invalidate the inherited placeholder reference.
  const replacement = figma.createText();
  await figma.loadFontAsync(sourceText.fontName);
  replacement.characters = body;
  slot.appendChild(replacement);

  liveInstance = currentInstance(instance);
  slot = dialogBodySlot(liveInstance);
  if (!slot) {
    warnings.push('Dialog body slot could not be refreshed after insertion.');
    return;
  }
  // Refresh after the visibility override, then copy source typography onto
  // the local slot text. This preserves the Dialog body appearance while
  // keeping the slot insertion stable.
  liveInstance = currentInstance(instance);
  slot = dialogBodySlot(liveInstance);
  const localText = slot && slot.children.find((child) => child.id === replacement.id);
  if (!localText || localText.type !== 'TEXT') {
    warnings.push('Dialog body text could not be styled after insertion.');
    return;
  }
  localText.name = 'Body text';
  localText.fontName = sourceText.fontName;
  localText.fontSize = sourceText.fontSize;
  localText.lineHeight = sourceText.lineHeight;
  localText.letterSpacing = sourceText.letterSpacing;
  localText.fills = [...sourceText.fills];
  localText.textAutoResize = sourceText.textAutoResize;
  localText.resize(sourceText.width, sourceText.height);
}

// `footerActions` is the JSON-safe representation of Dialog.footer. The
// renderer turns it back into a ButtonContainer; the Figma bridge reconciles
// the same list against the real Footer Slot so added and removed actions are
// preserved instead of being merely hidden examples.
async function reconcileDialogFooterButtons(instance, requestedCount, warnings) {
  let liveInstance = currentInstance(instance);
  let slot = dialogFooterSlot(liveInstance);
  if (!slot) {
    warnings.push('Dialog footer slot could not be found — footer actions were not rendered.');
    return [];
  }
  const buttonSource = await findComponentSourceAsync('Button', warnings);
  if (!buttonSource) {
    warnings.push('No "Button" component set was found — footer actions could not be rendered.');
    return dialogFooterButtons(liveInstance);
  }
  let buttons = dialogFooterButtons(liveInstance);
  while (buttons.length < requestedCount) {
    liveInstance = currentInstance(instance);
    slot = dialogFooterSlot(liveInstance);
    if (!slot) break;
    slot.appendChild(buttonSource.createInstance());
    buttons = dialogFooterButtons(currentInstance(instance));
  }
  while (buttons.length > requestedCount) {
    liveInstance = currentInstance(instance);
    buttons = dialogFooterButtons(liveInstance);
    const removable = buttons[buttons.length - 1];
    if (!removable) break;
    try {
      removable.remove();
    } catch (error) {
      // Inherited slot children cannot always be removed. Hiding them is still
      // faithful in the instance and keeps the JSON action list authoritative.
      removable.visible = false;
      warnings.push(`A default footer action could not be removed and was hidden instead: ${error.message}`);
      break;
    }
    buttons = dialogFooterButtons(currentInstance(instance));
  }
  return dialogFooterButtons(currentInstance(instance));
}

async function applyDialog(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const size = DIALOG_SIZES.includes(props.size) ? props.size : 'md';
  const status = DIALOG_STATUSES.includes(props.status) ? props.status : 'none';
  const assignments = {};
  queueComponentProperty(instance, assignments, 'Size', size, 'VARIANT', warnings);
  queueComponentProperty(instance, assignments, 'Status', status, 'VARIANT', warnings);
  if (typeof props.title === 'string') queueComponentProperty(instance, assignments, 'Title', props.title, 'TEXT', warnings);
  // `Body` is a legacy text property that is not bound to the live body slot.
  // Write body copy exclusively through `replaceDialogBodySlot` below.
  const footerActions = Array.isArray(props.footerActions)
    ? props.footerActions.filter((action) => action && action.type === 'Button')
    : null;
  if (Array.isArray(props.footerActions) && footerActions.length !== props.footerActions.length) {
    warnings.push('Only Button nodes are supported in Dialog footerActions; other footer nodes were ignored.');
  }
  queueDialogBooleanProperty(instance, assignments, ['Show close', 'Show close button', 'Close button', 'Close'], props.showClose !== false, warnings, 'Dialog close visibility');
  queueDialogBooleanProperty(instance, assignments, ['Show footer', 'Show footer actions', 'Footer', 'Footer actions'], props.showFooter !== false && (!footerActions || footerActions.length > 0), warnings, 'Dialog footer visibility');
  applyQueuedProperties(instance, assignments, warnings, 'Dialog properties');
  const bodyChildren = Array.isArray(node.children) ? node.children : [];
  if (bodyChildren.length > 0) await replaceDialogBodySlotChildren(instance, bodyChildren, warnings);
  else if (typeof props.body === 'string') await replaceDialogBodySlot(instance, props.body, warnings);
  if (footerActions) {
    const buttons = await reconcileDialogFooterButtons(instance, footerActions.length, warnings);
    for (let index = 0; index < footerActions.length && index < buttons.length; index += 1) {
      await applyButton(buttons[index], footerActions[index], warnings);
    }
  }
  for (const runtimeProp of ['open', 'onClose', 'footer', 'icon', 'id', 'className']) {
    if (props[runtimeProp] !== undefined) warnings.push(`"${runtimeProp}" has no Figma representation — ignored.`);
  }
}

async function importDialog(node, warnings) {
  const instance = await createComponentInstance('Dialog', warnings);
  await applyDialog(instance, node, warnings);
  return instance;
}

function textStyleCanonicalName(styleName) {
  const [familyRaw, sizeRaw, weightRaw] = String(styleName || '').split('/');
  const family = String(familyRaw || '').toLowerCase();
  const size = String(sizeRaw || 'md').toLowerCase();
  const weight = String(weightRaw || '').toLowerCase();
  const familyName = family === 'body' || family === 'paragraph'
    ? 'Body'
    : family === 'heading'
      ? 'Heading'
      : family === 'display'
        ? 'Display'
        : family === 'link'
          ? 'Link'
          : String(familyRaw || 'Body');
  const sizeName = size === 'xjumbo' ? 'XJumbo' : size === 'jumbo' ? 'Jumbo' : size.toUpperCase();
  if (family === 'link') {
    const weightName = weight ? weight.charAt(0).toUpperCase() + weight.slice(1) : 'Normal';
    return `${familyName}/${sizeName}/${weightName}`;
  }
  return `${familyName}/${sizeName}`;
}

function textStyleNameVariants(name) {
  const base = String(name || '').trim();
  const canonical = textStyleCanonicalName(base);
  const variants = [base, canonical];
  if (/^body\//i.test(base)) {
    variants.push(base.replace(/^body\//i, 'paragraph/'));
    variants.push(canonical.replace(/^Body\//, 'Paragraph/'));
  }
  if (/^paragraph\//i.test(base)) {
    variants.push(base.replace(/^paragraph\//i, 'body/'));
    variants.push(canonical.replace(/^Paragraph\//, 'Body/'));
  }
  return [...new Set(variants.filter(Boolean))];
}

function configuredTextStyleKeyForName(map, name) {
  const styleNames = textStyleNameVariants(name);
  for (const styleName of styleNames) {
    const direct = map[styleName];
    if (typeof direct === 'string' && direct.trim()) return direct.trim();
    const matchingName = Object.keys(map).find((key) => looseNameMatch(key, styleName));
    const matchingValue = matchingName ? map[matchingName] : '';
    if (typeof matchingValue === 'string' && matchingValue.trim()) return matchingValue.trim();
  }
  return '';
}

async function importConfiguredTextStyle(name) {
  if (typeof figma.importStyleByKeyAsync !== 'function') return null;
  try {
    const stored = await readClientComponentKeyRegistry();
    const key = configuredTextStyleKeyForName({ ...A1_FIGMA_TEXT_STYLE_KEYS, ...stored.textStyles }, name);
    return key ? await figma.importStyleByKeyAsync(key) : null;
  } catch {
    return null;
  }
}

function configuredVariableKeyForName(map, name) {
  const wanted = canonicalKey(name);
  for (const key of Object.keys(map || {})) {
    const value = map[key];
    if (typeof value !== 'string' || !value.trim()) continue;
    const candidate = canonicalKey(key);
    if (candidate === wanted || candidate.endsWith(wanted)) return value.trim();
  }
  return '';
}

async function importConfiguredColorVariable(token) {
  if (!figma.variables || typeof figma.variables.importVariableByKeyAsync !== 'function') return null;
  try {
    const stored = await readClientComponentKeyRegistry();
    const map = { ...A1_FIGMA_COLOR_VARIABLE_KEYS, ...stored.variables.color };
    const names = token === 'link'
      ? ['link/color', 'color/link', 'color/link/default', 'semantic/color/link', 'semantic/color/link/default']
      : [`text/${token}`, `color/text/${token}`, `semantic/color/text/${token}`];
    for (const name of names) {
      const key = configuredVariableKeyForName(map, name);
      if (key) return await figma.variables.importVariableByKeyAsync(key);
    }
  } catch {
    return null;
  }
  return null;
}

async function findLocalTextStyle(name) {
  const styles = await figma.getLocalTextStylesAsync();
  const styleNames = textStyleNameVariants(name);
  const matchesWanted = (style) => styleNames.some((styleName) => looseNameMatch(style && style.name, styleName));
  const local = styles.find(matchesWanted) || null;
  if (local) return local;
  const configured = await importConfiguredTextStyle(name);
  if (configured) return configured;
  try {
    if (!figma.teamLibrary || typeof figma.teamLibrary.getAvailableTextStylesAsync !== 'function' || typeof figma.importStyleByKeyAsync !== 'function') return null;
    const libraryStyles = await figma.teamLibrary.getAvailableTextStylesAsync();
    const style = libraryStyles.find(matchesWanted);
    return style && style.key ? await figma.importStyleByKeyAsync(style.key) : null;
  } catch {
    return null;
  }
}

async function findNearestLocalTextStyle(name) {
  const [family, requestedSize, requestedWeight] = String(name).toLowerCase().split('/');
  const familyAliases = family === 'body' ? ['body', 'paragraph'] : [family];
  const sizes = family === 'link'
    ? LINK_SIZES
    : family === 'display'
      ? DISPLAY_SIZES
      : family === 'heading'
        ? HEADING_SIZES
        : PARAGRAPH_SIZES;
  const requestedIndex = sizes.indexOf(requestedSize);
  if (requestedIndex < 0) return null;
  const styles = [...await figma.getLocalTextStylesAsync()];
  try {
    if (figma.teamLibrary && typeof figma.teamLibrary.getAvailableTextStylesAsync === 'function' && typeof figma.importStyleByKeyAsync === 'function') {
      const libraryStyles = await figma.teamLibrary.getAvailableTextStylesAsync();
      for (const entry of libraryStyles) {
        if (styles.some((style) => style.key && entry.key && style.key === entry.key)) continue;
        styles.push(entry);
      }
    }
  } catch {
    // Library styles are an enhancement. Fall back to local/imported styles.
  }
  try {
    const stored = await readClientComponentKeyRegistry();
    const configuredStyles = { ...A1_FIGMA_TEXT_STYLE_KEYS, ...stored.textStyles };
    for (const [styleName, key] of Object.entries(configuredStyles)) {
      if (typeof key !== 'string' || !key.trim()) continue;
      if (styles.some((style) => style.key && style.key === key)) continue;
      styles.push({ name: styleName, key });
    }
  } catch {
    // The checked-in manifest is an enhancement. Fall back to local/imported styles.
  }
  const candidates = styles
    .map((style) => {
      const compactName = compactKey(style.name);
      const parts = family === 'link'
        ? LINK_SIZES.flatMap((size) => LINK_WEIGHTS.map((weight) => {
          const suffix = compactKey(`link/${size}/${weight}`);
          return compactName.endsWith(suffix) ? ['link', size, weight] : null;
        })).find(Boolean) || String(style.name).toLowerCase().split('/')
        : familyAliases.flatMap((familyName) => sizes.map((size) => {
          const familySuffix = compactKey(`${familyName}/${size}`);
          return compactName.endsWith(familySuffix) ? [family, size] : null;
        })).find(Boolean) || String(style.name).toLowerCase().split('/');
      return { style, parts: family === 'link' ? parts.slice(-3) : parts.slice(-2) };
    })
    .filter((entry) => family === 'link'
      ? entry.parts.length === 3 && entry.parts[0] === family && sizes.includes(entry.parts[1]) && LINK_WEIGHTS.includes(entry.parts[2])
      : entry.parts.length === 2 && (entry.parts[0] === family || (family === 'body' && entry.parts[0] === 'paragraph')) && sizes.includes(entry.parts[1]))
    .map((entry) => ({
      ...entry,
      distance: Math.abs(sizes.indexOf(entry.parts[1]) - requestedIndex)
        + (family === 'link' && requestedWeight ? Math.abs(LINK_WEIGHTS.indexOf(entry.parts[2]) - LINK_WEIGHTS.indexOf(requestedWeight)) : 0),
    }));
  candidates.sort((a, b) => a.distance - b.distance);
  const nearest = candidates[0] ? candidates[0].style : null;
  if (!nearest) return null;
  if (nearest.id) return nearest;
  try {
    return nearest.key && typeof figma.importStyleByKeyAsync === 'function'
      ? await figma.importStyleByKeyAsync(nearest.key)
      : null;
  } catch {
    return null;
  }
}

async function findLibraryColorVariable(predicate) {
  try {
    if (!figma.teamLibrary || typeof figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync !== 'function' || typeof figma.teamLibrary.getVariablesInLibraryCollectionAsync !== 'function' || typeof figma.variables.importVariableByKeyAsync !== 'function') {
      return null;
    }
    const collections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
    for (const collection of collections) {
      const variables = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(collection.key);
      const match = variables.find((variable) => variable.resolvedType === 'COLOR' && predicate(variable));
      if (match && match.key) return await figma.variables.importVariableByKeyAsync(match.key);
    }
  } catch {
    // Library variables are optional; callers report the ordinary missing-token warning.
  }
  return null;
}

async function findTextColorVariable(token) {
  const variables = await figma.variables.getLocalVariablesAsync('COLOR');
  if (token === 'link') return variables.find(isLinkColorVariable) || await importConfiguredColorVariable('link') || await findLibraryColorVariable(isLinkColorVariable);
  const wanted = canonicalKey(`text/${token}`);
  // A1 Figma variables are named `color/text/default`, `color/text/muted`,
  // and so on. Accept that canonical namespace while keeping this bridge
  // resilient to a library copy that only uses the shorter `text/muted` path.
  const local = variables.find((variable) => {
    const name = canonicalKey(variable.name);
    return name === wanted || name.endsWith(wanted);
  }) || null;
  if (local) return local;
  const configured = await importConfiguredColorVariable(token);
  if (configured) return configured;
  if (token === 'link') return findLibraryColorVariable(isLinkColorVariable);
  return findLibraryColorVariable((variable) => {
    const name = canonicalKey(variable.name);
    return name === wanted || name.endsWith(wanted);
  });
}

function colorVariableNameMatches(variable, requestedName) {
  const actual = canonicalKey(variable && variable.name);
  const requested = canonicalKey(requestedName);
  return Boolean(actual && requested && (actual === requested || actual.endsWith(requested)));
}

async function findIconColorVariable(color) {
  const token = ICON_COLOR_VARIABLE_NAMES[color || 'default'] || ICON_COLOR_VARIABLE_NAMES.default;
  const localVariables = await figma.variables.getLocalVariablesAsync('COLOR');
  const local = localVariables.find((variable) => colorVariableNameMatches(variable, token));
  if (local) return local;

  try {
    const stored = await readClientComponentKeyRegistry();
    const key = configuredVariableKeyForName({ ...A1_FIGMA_COLOR_VARIABLE_KEYS, ...stored.variables.color }, token);
    if (key && typeof figma.variables.importVariableByKeyAsync === 'function') {
      const imported = await figma.variables.importVariableByKeyAsync(key);
      if (imported) return imported;
    }
  } catch {
    // Fall through to the enabled-library lookup.
  }

  return findLibraryColorVariable((variable) => colorVariableNameMatches(variable, token));
}

function textStyleRequestForNode(node) {
  const props = node.props || {};
  if (node.type === 'Link') {
    const size = typeof props.size === 'string' && LINK_SIZES.includes(props.size) ? props.size : 'md';
    const weight = typeof props.weight === 'string' && LINK_WEIGHTS.includes(props.weight) ? props.weight : 'normal';
    return { type: 'Link', styleName: `link/${size}/${weight}`, color: 'link', align: 'left' };
  }
  if (node.type === 'Heading') {
    const family = props.type === 'display' ? 'display' : 'heading';
    const sizes = family === 'display' ? DISPLAY_SIZES : HEADING_SIZES;
    const size = typeof props.size === 'string' && sizes.includes(props.size.toLowerCase())
      ? props.size.toLowerCase()
      : 'md';
    return { styleName: `${family}/${size}`, color: typeof props.color === 'string' ? props.color : 'default', align: typeof props.align === 'string' ? props.align : 'left' };
  }
  const size = typeof props.size === 'string' && PARAGRAPH_SIZES.includes(props.size) ? props.size : 'md';
  return { styleName: `body/${size}`, color: typeof props.color === 'string' ? props.color : 'default', align: typeof props.align === 'string' ? props.align : 'left' };
}

const TEXT_CONTEXT_FAMILIES = ['body', 'heading', 'display'];
const TEXT_CONTEXT_FAMILIES_WITH_LINK = ['link', ...TEXT_CONTEXT_FAMILIES];

function textFamilyOptions(family) {
  return family === 'link' ? TEXT_CONTEXT_FAMILIES_WITH_LINK : TEXT_CONTEXT_FAMILIES;
}

function textSizeOptionsForFamily(family) {
  if (family === 'link') return LINK_SIZES;
  if (family === 'display') return DISPLAY_SIZES;
  if (family === 'heading') return HEADING_SIZES;
  return PARAGRAPH_SIZES;
}

function textColorOptionsForFamily(family) {
  if (family === 'link') return ['link'];
  if (family === 'body') return ['default', 'muted'];
  return ['default', 'muted', 'accent'];
}

function textContextForSelection(text, suggestion = textSuggestion(text)) {
  const [rawFamily, rawSize, rawWeight] = String(suggestion.styleName || 'body/md').toLowerCase().split('/');
  const family = rawFamily === 'paragraph' ? 'body' : rawFamily || 'body';
  const sizeOptions = textSizeOptionsForFamily(family);
  const colorOptions = textColorOptionsForFamily(family);
  let widthMode = 'hug';
  try {
    widthMode = text.layoutSizingHorizontal === 'FILL' ? 'fill' : 'hug';
  } catch {
    widthMode = 'hug';
  }
  return {
    type: suggestion.type,
    family,
    typeOptions: textFamilyOptions(family),
    size: sizeOptions.includes(rawSize) ? rawSize : 'md',
    sizeOptions,
    color: colorOptions.includes(suggestion.color) ? suggestion.color : colorOptions[0],
    colorOptions,
    weight: LINK_WEIGHTS.includes(rawWeight) ? rawWeight : 'normal',
    weightOptions: family === 'link' ? LINK_WEIGHTS : [],
    widthMode,
    ready: !Array.isArray(suggestion.issues) || suggestion.issues.length === 0,
  };
}

async function applyTextSuggestion(text, suggestion, warnings) {
  const style = await findLocalTextStyle(suggestion.styleName);
  if (style) {
    try {
      if (style.fontName !== figma.mixed) await figma.loadFontAsync(style.fontName);
      text.textStyleId = style.id;
    } catch (error) {
      warnings.push(`A1 text style "${style.name}" was found but could not be applied: ${error.message}`);
    }
  } else {
    const nearest = await findNearestLocalTextStyle(suggestion.styleName);
    if (nearest) {
      try {
        if (nearest.fontName !== figma.mixed) await figma.loadFontAsync(nearest.fontName);
        text.textStyleId = nearest.id;
        const displayHint = suggestion.styleName === 'heading/xxl'
          ? ' Use `props.type: "display"` with `size: "xxl"` for Figma Display XXL.'
          : '';
        warnings.push(`No A1 text style named "${suggestion.styleName}" was found; applied the nearest available style "${nearest.name}".${displayHint}`);
      } catch (error) {
        warnings.push(`Nearest A1 text style "${nearest.name}" could not be applied: ${error.message}`);
      }
    } else {
      warnings.push(`No A1 text style named "${suggestion.styleName}" was found in this file or enabled libraries. The plugin will not create local text styles.`);
    }
  }
  text.textAlignHorizontal = suggestion.align === 'center' ? 'CENTER' : suggestion.align === 'right' ? 'RIGHT' : 'LEFT';
  if (suggestion.type === 'Link') text.textDecoration = 'UNDERLINE';
  const colorVariable = await findTextColorVariable(suggestion.color);
  if (!colorVariable) {
    const variableName = suggestion.color === 'link' ? 'link/color' : `text/${suggestion.color}`;
    warnings.push(`No A1 color variable named "${variableName}" was found in this file or enabled libraries. The plugin will not create local color variables.`);
    return;
  }
  const existingPaint = firstSolidTextPaint(text);
  if (!existingPaint) {
    // Do not invent a black (or any other) hex fallback just to satisfy the
    // Figma API. A valid solid paint is needed as the carrier for the variable
    // binding, so leave an exotic fill alone and report the exact limitation.
    const variableName = suggestion.color === 'link' ? 'link/color' : `text/${suggestion.color}`;
    warnings.push(`The text has no solid fill to bind to the "${variableName}" token.`);
    return;
  }
  const boundPaint = figma.variables.setBoundVariableForPaint(existingPaint, 'color', colorVariable);
  try {
    // Range assignment is reliable for ordinary text and for a text layer that
    // has style overrides or mixed fills. It makes a full-layer AutoFix truly
    // semantic instead of silently leaving an unbound paint on one range.
    if (text.characters.length > 0 && typeof text.setRangeFills === 'function') {
      text.setRangeFills(0, text.characters.length, [boundPaint]);
    } else {
      text.fills = [boundPaint];
    }
  } catch (error) {
    try {
      text.fills = [boundPaint];
    } catch (fallbackError) {
      warnings.push(`The text fill could not be bound to the token: ${fallbackError.message || error.message}`);
    }
  }
}

async function handleSetTextProps(options = {}) {
  const selection = figma.currentPage.selection;
  if (selection.length !== 1 || selection[0].type !== 'TEXT') {
    return postError('Select one text layer to edit its A1 text controls.');
  }
  const text = selection[0];
  const current = textSuggestion(text);
  const currentContext = textContextForSelection(text, current);
  const familyOptions = textFamilyOptions(currentContext.family);
  const family = typeof options.family === 'string' && familyOptions.includes(options.family)
    ? options.family
    : currentContext.family;
  const sizeOptions = textSizeOptionsForFamily(family);
  const colorOptions = textColorOptionsForFamily(family);
  const fallbackSize = sizeOptions.includes(currentContext.size) ? currentContext.size : 'md';
  const fallbackColor = colorOptions.includes(currentContext.color) ? currentContext.color : colorOptions[0];
  const size = typeof options.size === 'string' && sizeOptions.includes(options.size) ? options.size : fallbackSize;
  const color = typeof options.color === 'string' && colorOptions.includes(options.color) ? options.color : fallbackColor;
  const weight = family === 'link' && typeof options.weight === 'string' && LINK_WEIGHTS.includes(options.weight)
    ? options.weight
    : currentContext.weight;
  const styleName = family === 'link' ? `link/${size}/${weight}` : `${family}/${size}`;
  const warnings = [];
  await applyTextSuggestion(text, {
    type: family === 'link' ? 'Link' : family === 'body' ? 'Paragraph' : 'Heading',
    styleName,
    color,
    align: current.align || 'left',
  }, warnings);
  if (options.widthMode === 'fill' || options.widthMode === 'hug') {
    syncLayoutWidthMode(text, options.widthMode, warnings, 'Text');
    trySetLayoutProperty(
      text,
      'textAutoResize',
      options.widthMode === 'fill' ? 'HEIGHT' : 'WIDTH_AND_HEIGHT',
      warnings,
      'Text auto resize'
    );
  }
  const refreshedSuggestion = textSuggestion(text);
  postPluginMessage({
    type: 'text-props-result',
    warnings,
    message: 'Updated selected text controls.',
    textContext: textContextForSelection(text, refreshedSuggestion),
    textReview: refreshedSuggestion.issues.length ? { issues: refreshedSuggestion.issues, suggestion: refreshedSuggestion } : null,
  });
  postSelectionState();
  scheduleAutoExport();
}

function selectedInstanceForContext(nodeId, componentName) {
  let target = null;
  if (typeof nodeId === 'string' && nodeId) {
    try {
      target = liveNode(resolveNodeById(nodeId));
    } catch {
      target = null;
    }
  }
  if (!target || target.type !== 'INSTANCE' || registeredSetName(target) !== componentName) {
    const selection = figma.currentPage.selection;
    target = selection.length === 1 ? liveNode(selection[0]) : null;
  }
  return target && target.type === 'INSTANCE' && registeredSetName(target) === componentName ? target : null;
}

async function handleSetPageLayoutProps(options = {}) {
  const target = selectedInstanceForContext(options.pageLayoutNodeId, 'Page Layout');
  if (!target) return postError('Select one A1 Page Layout instance to edit its controls.');
  const currentContext = pageLayoutContextForSelection(target);
  const breakpoint = typeof options.breakpoint === 'string' && A1_BREAKPOINTS.includes(options.breakpoint)
    ? options.breakpoint
    : currentContext.breakpoint;
  const warnings = [];
  const assignments = {};
  queueComponentProperty(target, assignments, 'Breakpoint', breakpoint, 'VARIANT', warnings, 'Page Layout breakpoint preview');
  applyQueuedProperties(target, assignments, warnings, 'Page Layout properties');
  const refreshed = currentInstance(target);
  postPluginMessage({
    type: 'page-layout-props-result',
    warnings,
    message: 'Updated selected Page Layout controls.',
    pageLayoutNodeId: refreshed.id,
    pageLayoutContext: pageLayoutContextForSelection(refreshed),
  });
  postSelectionState();
  scheduleAutoExport();
}

function topHeaderPropsWithShape(currentProps = {}, navCount = 0, actionCount = 0) {
  const usedNavIds = new Set();
  const navItems = (Array.isArray(currentProps.navItems) ? currentProps.navItems : [])
    .filter((item) => item && typeof item === 'object')
    .map((item, index) => ({
      ...item,
      id: typeof item.id === 'string' && item.id ? item.id : slugifyOptionValue(item.label || `nav-item-${index + 1}`, usedNavIds),
      label: typeof item.label === 'string' && item.label ? item.label : `Nav item ${index + 1}`,
    }));
  while (navItems.length < navCount) {
    const label = `Nav item ${navItems.length + 1}`;
    navItems.push({ id: slugifyOptionValue(label, usedNavIds), label });
  }

  const usedActionIds = new Set();
  const actions = (Array.isArray(currentProps.actions) ? currentProps.actions : [])
    .filter((action) => action && typeof action === 'object')
    .map((action, index) => ({
      ...action,
      id: typeof action.id === 'string' && action.id ? action.id : slugifyOptionValue(action.label || `action-${index + 1}`, usedActionIds),
      label: typeof action.label === 'string' && action.label ? action.label : `Action ${index + 1}`,
    }));
  while (actions.length < actionCount) {
    const label = `Action ${actions.length + 1}`;
    actions.push({ id: slugifyOptionValue(label, usedActionIds), label });
  }

  return {
    ...currentProps,
    navItems: navItems.slice(0, navCount),
    actions: actions.slice(0, actionCount),
  };
}

async function handleSetTopHeaderProps(options = {}) {
  const target = selectedInstanceForContext(options.topHeaderNodeId, 'Top Header');
  if (!target) return postError('Select one A1 Top Header instance to edit its controls.');
  const warnings = [];
  const exported = exportTopHeader(target);
  warnings.push(...exported.warnings);
  const currentContext = topHeaderContextForSelection(target);
  const navCount = Math.max(0, Math.min(GROUP_SLOT_CONFIG.TopHeader.max, Number(options.navCount) || 0));
  const actionCount = Math.max(0, Math.min(GROUP_SLOT_CONFIG.TopHeaderActions.max, Number(options.actionCount) || 0));
  const props = topHeaderPropsWithShape(exported.node.props || {}, navCount, actionCount);
  props.logoText = typeof options.logoText === 'string' ? options.logoText : currentContext.logoText;
  props.loginButton = options.showLogin === true
    ? {
        label: typeof options.loginLabel === 'string' && options.loginLabel.trim()
          ? options.loginLabel.trim()
          : currentContext.loginLabel,
      }
    : false;
  await applyTopHeader(target, { type: 'TopHeader', props }, warnings);
  const refreshed = currentInstance(target);
  postPluginMessage({
    type: 'top-header-props-result',
    warnings,
    message: 'Updated selected Top Header controls.',
    topHeaderNodeId: refreshed.id,
    topHeaderContext: topHeaderContextForSelection(refreshed),
  });
  postSelectionState();
  scheduleAutoExport();
}

async function handleSetLinkProps(options = {}) {
  const target = selectedInstanceForContext(options.linkNodeId, 'Link');
  if (!target) return postError('Select one A1 Link instance to edit its controls.');
  const currentContext = linkContextForSelection(target);
  const size = typeof options.size === 'string' && LINK_SIZES.includes(options.size)
    ? options.size
    : currentContext.size;
  const weight = typeof options.weight === 'string' && LINK_WEIGHTS.includes(options.weight)
    ? options.weight
    : currentContext.weight;
  const iconMode = options.iconMode === 'show' ? 'show' : 'hide';
  const iconPosition = options.iconPosition === 'end' ? 'end' : 'start';
  const label = typeof options.label === 'string' && options.label.trim()
    ? options.label.trim()
    : currentContext.label;
  const iconName = typeof options.iconName === 'string' && options.iconName.trim()
    ? options.iconName.trim()
    : currentContext.icon || 'arrow_forward';
  const props = { size, weight };
  if (iconMode === 'show') {
    props.icon = iconName;
    if (iconPosition === 'end') props.iconPosition = 'end';
  }
  const warnings = [];
  await applyLink(target, {
    type: 'Link',
    props,
    content: { fallback: label },
  }, warnings);
  const refreshed = currentInstance(target);
  postPluginMessage({
    type: 'link-props-result',
    warnings,
    message: 'Updated selected Link controls.',
    linkNodeId: refreshed.id,
    linkContext: linkContextForSelection(refreshed),
  });
  postSelectionState();
  scheduleAutoExport();
}

function definitionListPropsWithShape(currentProps = {}, itemCount = 1) {
  const usedIds = new Set();
  const existingItems = Array.isArray(currentProps.items) ? currentProps.items : [];
  const items = existingItems
    .filter((item) => item && typeof item === 'object')
    .map((item, index) => {
      const label = typeof item.label === 'string' && item.label ? item.label : `Label ${index + 1}`;
      return {
        ...item,
        id: typeof item.id === 'string' && item.id ? item.id : slugifyOptionValue(label, usedIds),
        label,
        value: typeof item.value === 'string' && item.value ? item.value : `Value ${index + 1}`,
      };
    });
  while (items.length < itemCount) {
    const index = items.length;
    const label = `Label ${index + 1}`;
    items.push({
      id: slugifyOptionValue(label, usedIds),
      label,
      value: `Value ${index + 1}`,
    });
  }
  return { ...currentProps, items: items.slice(0, itemCount) };
}

async function handleSetDefinitionListProps(options = {}) {
  const target = selectedInstanceForContext(options.definitionListNodeId, 'Definition List');
  if (!target) return postError('Select one A1 Definition List instance to edit its controls.');
  const warnings = [];
  const exported = exportDefinitionList(target);
  warnings.push(...exported.warnings);
  const currentContext = definitionListContextForSelection(target);
  const direction = typeof options.direction === 'string' && DEFINITION_LIST_DIRECTIONS.includes(options.direction)
    ? options.direction
    : currentContext.direction;
  const size = typeof options.size === 'string' && DEFINITION_LIST_SIZES.includes(options.size)
    ? options.size
    : currentContext.size;
  const itemCount = Math.max(1, Math.min(10, Number(options.itemCount) || currentContext.itemCount));
  const props = definitionListPropsWithShape(exported.node.props || {}, itemCount);
  props.direction = direction;
  props.size = size;
  await applyDefinitionList(target, { type: 'DefinitionList', props }, warnings);
  await replaceDefinitionItems(target, { type: 'DefinitionList', props }, warnings);
  const refreshed = currentInstance(target);
  postPluginMessage({
    type: 'definition-list-props-result',
    warnings,
    message: 'Updated selected Definition List controls.',
    definitionListNodeId: refreshed.id,
    definitionListContext: definitionListContextForSelection(refreshed),
  });
  postSelectionState();
  scheduleAutoExport();
}

function choiceGroupPropsWithShape(currentProps = {}, optionCount = 1, multiple = false) {
  const usedValues = new Set();
  const existingOptions = Array.isArray(currentProps.options) ? currentProps.options : [];
  const options = existingOptions
    .filter((option) => option && typeof option === 'object')
    .map((option, index) => {
      const label = typeof option.label === 'string' && option.label ? option.label : `Option ${index + 1}`;
      let value = typeof option.value === 'string' && option.value ? option.value : '';
      if (!value || usedValues.has(value)) value = slugifyOptionValue(label, usedValues);
      else usedValues.add(value);
      return {
        ...option,
        value,
        label,
      };
    });
  const shapeTemplate = [...options].reverse().find((option) =>
    (typeof option.subtext === 'string' && option.subtext.trim())
    || (typeof option.icon === 'string' && option.icon.trim()));
  while (options.length < optionCount) {
    const index = options.length;
    const label = `Option ${index + 1}`;
    const option = {
      value: slugifyOptionValue(label, usedValues),
      label,
    };
    if (shapeTemplate && typeof shapeTemplate.subtext === 'string' && shapeTemplate.subtext.trim()) {
      option.subtext = shapeTemplate.subtext;
    }
    if (shapeTemplate && typeof shapeTemplate.icon === 'string' && shapeTemplate.icon.trim()) {
      option.icon = shapeTemplate.icon;
    }
    options.push(option);
  }
  const nextOptions = options.slice(0, optionCount);
  const validValues = new Set(nextOptions.map((option) => option.value));
  const rawSelection = currentProps.defaultValue !== undefined ? currentProps.defaultValue : currentProps.value;
  const selectedValues = Array.isArray(rawSelection)
    ? rawSelection.filter((value) => typeof value === 'string' && validValues.has(value))
    : typeof rawSelection === 'string' && validValues.has(rawSelection) ? [rawSelection] : [];
  const fallbackValue = nextOptions[0] ? nextOptions[0].value : '';
  const nextProps = { ...currentProps, options: nextOptions };
  if (multiple) nextProps.defaultValue = selectedValues.length ? selectedValues : (fallbackValue ? [fallbackValue] : []);
  else nextProps.defaultValue = selectedValues[0] || fallbackValue;
  delete nextProps.value;
  return nextProps;
}

async function handleSetChoiceGroupProps(options = {}) {
  const target = selectedInstanceForContext(options.choiceGroupNodeId, 'Choice Group');
  if (!target) return postError('Select one A1 Choice Group instance to edit its controls.');
  const warnings = [];
  const exported = exportChoiceGroup(target);
  warnings.push(...exported.warnings);
  const currentContext = choiceGroupContextForSelection(target);
  const multiple = options.choiceType === 'checkbox'
    ? true
    : options.choiceType === 'radio'
      ? false
      : currentContext.type === 'checkbox';
  const size = typeof options.size === 'string' && CHOICE_SIZES.includes(options.size)
    ? options.size
    : currentContext.size;
  const optionCount = Math.max(1, Math.min(CHOICE_GROUP_CONTEXT_MAX_OPTIONS, Number(options.optionCount) || currentContext.optionCount));
  const props = choiceGroupPropsWithShape(exported.node.props || {}, optionCount, multiple);
  props.label = typeof options.label === 'string' ? options.label.trim() : currentContext.label;
  props.hint = typeof options.helper === 'string' ? options.helper.trim() : currentContext.helper;
  props.multiple = multiple;
  props.size = size;
  props.required = options.required === true;
  props.hideIndicator = options.hideIndicator === true;
  props.columns = normalizeResponsiveColumns(options.columns) || currentContext.columns || { xs: 1 };
  await applyChoiceGroup(target, { type: 'ChoiceGroup', props }, warnings);
  const refreshed = currentInstance(target);
  postPluginMessage({
    type: 'choice-group-props-result',
    warnings,
    message: 'Updated selected Choice Group controls.',
    choiceGroupNodeId: refreshed.id,
    choiceGroupContext: choiceGroupContextForSelection(refreshed),
  });
  postSelectionState();
  scheduleAutoExport();
}

async function handleSetButtonProps(options = {}) {
  const selection = figma.currentPage.selection;
  let target = selection.length === 1 ? liveNode(selection[0]) : null;
  if (!target || target.type !== 'INSTANCE' || registeredSetName(target) !== 'Button') {
    return postError('Select one A1 Button instance to edit its controls.');
  }
  const currentContext = buttonContextForSelection(target);
  const variant = typeof options.variant === 'string' && BUTTON_VARIANTS.includes(options.variant)
    ? options.variant
    : currentContext.variant;
  const size = typeof options.size === 'string' && BUTTON_SIZES.includes(options.size)
    ? options.size
    : currentContext.size;
  const state = typeof options.state === 'string' && BUTTON_CONTEXT_STATES.includes(options.state)
    ? options.state
    : currentContext.state;
  const iconMode = typeof options.iconMode === 'string' && BUTTON_CONTEXT_ICON_MODES.includes(options.iconMode)
    ? options.iconMode
    : currentContext.iconMode;
  const iconPosition = options.iconPosition === 'end' ? 'end' : 'start';
  const widthMode = typeof options.widthMode === 'string' && BUTTON_CONTEXT_WIDTH_MODES.includes(options.widthMode)
    ? options.widthMode
    : currentContext.widthMode;
  const label = typeof options.label === 'string' && options.label.trim()
    ? options.label.trim()
    : currentContext.label;
  const iconName = typeof options.iconName === 'string' && options.iconName.trim()
    ? options.iconName.trim()
    : currentContext.icon || 'star';
  const props = { variant, size };
  if (state === 'disabled') props.disabled = true;
  if (state === 'loading') props.loading = true;
  if (widthMode === 'fill') props.fullWidth = true;
  if (iconMode === 'show') {
    props.icon = iconName;
    if (iconPosition === 'end') props.iconPosition = 'end';
  }
  const warnings = [];
  await applyButton(target, {
    type: 'Button',
    props,
    content: { fallback: label },
  }, warnings);
  const refreshed = currentInstance(target);
  syncButtonFullWidthMetadata(refreshed, widthMode, warnings);
  postPluginMessage({
    type: 'button-props-result',
    warnings,
    message: 'Updated selected Button controls.',
    buttonNodeId: refreshed.id,
    buttonContext: buttonContextForSelection(refreshed),
  });
  postSelectionState();
  scheduleAutoExport();
}

async function handleSetButtonContainerProps(options = {}) {
  const target = selectedInstanceForContext(options.buttonContainerNodeId, 'Button Container');
  if (!target) {
    return postError('Select one A1 Button Group instance to edit its controls.');
  }
  const currentContext = buttonContainerContextForSelection(target);
  const align = typeof options.align === 'string' && BUTTON_CONTAINER_ALIGNS.includes(options.align)
    ? options.align
    : currentContext.align;
  const warnings = [];
  await applyButtonContainer(target, {
    type: 'ButtonContainer',
    props: { align },
    children: [],
  }, warnings);
  const refreshed = syncButtonContainerForWidth(currentInstance(target), warnings);
  postPluginMessage({
    type: 'button-container-props-result',
    warnings,
    message: 'Updated selected Button Group controls.',
    buttonContainerNodeId: refreshed.id,
    buttonContainerContext: buttonContainerContextForSelection(refreshed),
  });
  postSelectionState();
  scheduleAutoExport();
}

function actionTriggerPayload(trigger) {
  const refreshed = currentInstance(trigger);
  const componentName = actionTriggerComponentName(refreshed);
  const payload = {
    componentName,
    triggerNodeId: refreshed.id,
  };
  if (componentName === 'Button') {
    payload.buttonNodeId = refreshed.id;
    payload.buttonContext = buttonContextForSelection(refreshed);
  }
  if (componentName === 'Icon Button') {
    payload.iconButtonNodeId = refreshed.id;
    payload.iconButtonContext = iconButtonContextForSelection(refreshed);
  }
  return payload;
}

function postActionTriggerResult(trigger, warnings, message) {
  postPluginMessage({
    type: 'action-trigger-result',
    warnings,
    message,
    ...actionTriggerPayload(trigger),
  });
  postSelectionState();
  scheduleAutoExport();
}

function actionTriggerContextTarget(options = {}) {
  const explicitComponentName = typeof options.componentName === 'string' ? options.componentName : '';
  const componentName = ACTION_TRIGGER_COMPONENT_NAMES.has(explicitComponentName)
    ? explicitComponentName
    : (options.iconButtonNodeId ? 'Icon Button' : 'Button');
  const nodeId = options.triggerNodeId || options.buttonNodeId || options.iconButtonNodeId || null;
  const target = selectedInstanceForContext(nodeId, componentName);
  return target && supportsActionTrigger(target) ? target : null;
}

async function handleSetActionTriggerLink(options = {}) {
  const targetType = ACTION_TRIGGER_TARGET_TYPES.has(options.targetType) ? options.targetType : 'Dialog';
  const target = actionTriggerContextTarget(options);
  if (!target) return postError(`Select one A1 Button or Icon Button instance to connect it to a ${targetType}.`);
  const warnings = [];
  const targetNodeId = typeof options.targetNodeId === 'string'
    ? options.targetNodeId
    : typeof options.dialogNodeId === 'string'
      ? options.dialogNodeId
      : '';
  if (!targetNodeId) {
    setActionTriggerTarget(target, targetType, '');
    postActionTriggerResult(target, warnings, `Disconnected this ${actionTriggerComponentName(target)} from its ${targetType}.`);
    return;
  }
  let linkedTarget = null;
  try {
    linkedTarget = liveNode(resolveNodeById(targetNodeId));
  } catch {
    linkedTarget = null;
  }
  if (!linkedTarget || linkedTarget.type !== 'INSTANCE' || registeredSetName(linkedTarget) !== targetType) {
    return postError(`Choose an existing A1 ${targetType} from this canvas.`);
  }
  setActionTriggerTarget(target, targetType, linkedTarget.id);
  syncActionTargetTriggerNameMetadata(linkedTarget, target);
  postActionTriggerResult(target, warnings, `Connected this ${actionTriggerComponentName(target)} to "${actionTargetOptionLabel(linkedTarget, 0, targetType)}".`);
}

async function handleAddActionTargetForTrigger(options = {}) {
  const targetType = ACTION_TRIGGER_TARGET_TYPES.has(options.targetType) ? options.targetType : 'Dialog';
  const targetConfig = ACTION_TRIGGER_TARGET_CONFIG[targetType];
  const target = actionTriggerContextTarget(options);
  if (!target) return postError(`Select one A1 Button or Icon Button instance before adding a connected ${targetType}.`);
  const warnings = [];
  let linkedTarget = null;
  try {
    linkedTarget = await addComponentFromPackage(targetConfig.addTarget, {}, warnings);
  } catch (error) {
    warnings.push(`${targetType} could not be added: ${error.message}`);
  }
  if (!linkedTarget) {
    postPluginMessage({
      type: 'action-trigger-result',
      warnings,
      message: warnings.join('\n') || `No ${targetType} was added.`,
      ...actionTriggerPayload(target),
    });
    return;
  }
  try {
    figma.currentPage.appendChild(linkedTarget);
    const x = target.absoluteTransform && target.absoluteTransform[0] ? target.absoluteTransform[0][2] : target.x;
    const y = target.absoluteTransform && target.absoluteTransform[1] ? target.absoluteTransform[1][2] : target.y;
    linkedTarget.x = Math.round(x + target.width + 80);
    linkedTarget.y = Math.round(y);
  } catch (error) {
    warnings.push(`${targetType} was added but could not be positioned next to the ${actionTriggerComponentName(target)}: ${error.message}`);
  }
  setActionTriggerTarget(target, targetType, linkedTarget.id);
  syncActionTargetTriggerNameMetadata(linkedTarget, target);
  figma.currentPage.selection = [target];
  postActionTriggerResult(target, warnings, `Added and connected "${actionTargetOptionLabel(linkedTarget, 0, targetType)}".`);
}

async function handleSetIconButtonProps(options = {}) {
  const target = selectedInstanceForContext(options.iconButtonNodeId, 'Icon Button');
  if (!target) {
    return postError('Select one A1 Icon Button instance to edit its controls.');
  }
  const currentContext = iconButtonContextForSelection(target);
  const variant = typeof options.variant === 'string' && ICON_BUTTON_VARIANTS.includes(options.variant)
    ? options.variant
    : currentContext.variant;
  const size = typeof options.size === 'string' && ICON_BUTTON_SIZES.includes(options.size)
    ? options.size
    : currentContext.size;
  const label = typeof options.label === 'string' && options.label.trim()
    ? options.label.trim()
    : currentContext.label;
  const iconName = typeof options.iconName === 'string' && options.iconName.trim()
    ? options.iconName.trim()
    : currentContext.icon || 'star';
  const warnings = [];
  await applyIconButton(target, {
    type: 'IconButton',
    props: {
      label,
      variant,
      size,
      icon: iconName,
    },
  }, warnings);
  const refreshed = currentInstance(target);
  postPluginMessage({
    type: 'icon-button-props-result',
    warnings,
    message: 'Updated selected Icon Button controls.',
    iconButtonNodeId: refreshed.id,
    iconButtonContext: iconButtonContextForSelection(refreshed),
  });
  postSelectionState();
  scheduleAutoExport();
}

async function handleSetBadgeProps(options = {}) {
  const target = selectedInstanceForContext(options.badgeNodeId, 'Badge');
  if (!target) {
    return postError('Select one A1 Badge instance to edit its controls.');
  }
  const currentContext = badgeContextForSelection(target);
  const status = typeof options.status === 'string' && BADGE_STATUSES.includes(options.status)
    ? options.status
    : currentContext.status;
  const size = typeof options.size === 'string' && BADGE_SIZES.includes(options.size)
    ? options.size
    : currentContext.size;
  const label = typeof options.label === 'string' && options.label.trim()
    ? options.label.trim()
    : currentContext.label;
  const iconName = typeof options.iconName === 'string' && options.iconName.trim()
    ? options.iconName.trim()
    : currentContext.icon || 'info';
  const iconMode = options.iconMode === 'none' ? 'none' : 'show';
  const props = {
    status,
    size,
    subtle: options.subtle === true,
  };
  if (iconMode === 'none') {
    props.icon = null;
  } else {
    props.icon = iconName;
  }
  const warnings = [];
  await applyBadge(target, {
    type: 'MessageBadge',
    props,
    content: { fallback: label },
  }, warnings);
  const refreshed = currentInstance(target);
  postPluginMessage({
    type: 'badge-props-result',
    warnings,
    message: 'Updated selected Badge controls.',
    badgeNodeId: refreshed.id,
    badgeContext: badgeContextForSelection(refreshed),
  });
  postSelectionState();
  scheduleAutoExport();
}

async function handleSetCardProps(options = {}) {
  const warnings = [];
  let target = null;
  if (typeof options.cardNodeId === 'string' && options.cardNodeId) {
    try {
      target = liveNode(resolveNodeById(options.cardNodeId));
    } catch {
      target = null;
    }
  }
  if (!target || target.type !== 'INSTANCE' || registeredSetName(target) !== 'Card') {
    const selection = figma.currentPage.selection;
    target = selection.length === 1 ? liveNode(selection[0]) : null;
  }
  if (!target || target.type !== 'INSTANCE' || registeredSetName(target) !== 'Card') {
    return postError('Select one A1 Card instance to edit its controls.');
  }
  const currentContext = cardContextForSelection(target);
  const surface = typeof options.surface === 'string' && CARD_SURFACES.includes(options.surface)
    ? options.surface
    : currentContext.surface;
  const variant = typeof options.variant === 'string' && CARD_VARIANTS.includes(options.variant)
    ? options.variant
    : currentContext.variant;
  const iconDisplay = typeof options.iconDisplay === 'string' && CARD_ICON_DISPLAYS.includes(options.iconDisplay)
    ? options.iconDisplay
    : options.iconMode === 'show' ? 'default' : currentContext.iconDisplay;
  const heroColor = typeof options.heroColor === 'string' && CARD_HERO_COLORS.includes(options.heroColor)
    ? options.heroColor
    : currentContext.heroColor;
  const iconName = typeof options.iconName === 'string' && options.iconName.trim()
    ? options.iconName.trim()
    : currentContext.icon || 'star';
  const widthMode = typeof options.widthMode === 'string' && BUTTON_CONTEXT_WIDTH_MODES.includes(options.widthMode)
    ? options.widthMode
    : currentContext.widthMode;
  const heightMode = typeof options.heightMode === 'string' && BUTTON_CONTEXT_WIDTH_MODES.includes(options.heightMode)
    ? options.heightMode
    : currentContext.heightMode;
  await applyCard(target, {
    type: 'Card',
    props: {
      surface,
      ...(variant === 'navigation' ? { variant: 'navigation' } : {}),
      ...(variant === 'bare' ? { bare: true } : {}),
      ...(iconDisplay !== 'none'
        ? {
            icon: iconName,
            ...(iconDisplay !== 'default' ? { iconDisplay } : {}),
            ...(iconDisplay === 'hero' && heroColor !== 'action' ? { heroColor } : {}),
          }
        : { iconDisplay: 'none' }),
    },
    children: [],
  }, warnings);
  const refreshed = currentInstance(target);
  syncLayoutWidthMode(refreshed, widthMode, warnings, 'Card');
  syncLayoutHeightMode(refreshed, heightMode, warnings, 'Card');
  const synced = syncCardIconPositionForWidth(refreshed, warnings);
  postPluginMessage({
    type: 'card-props-result',
    warnings,
    message: 'Updated selected Card controls.',
    cardNodeId: synced.id,
    cardContext: cardContextForSelection(synced),
  });
  postSelectionState();
  scheduleAutoExport();
}

async function handleSetDialogProps(options = {}) {
  const target = selectedInstanceForContext(options.dialogNodeId, 'Dialog');
  if (!target) {
    return postError('Select one A1 Dialog instance to edit its controls.');
  }
  const currentContext = dialogContextForSelection(target);
  const size = typeof options.size === 'string' && DIALOG_SIZES.includes(options.size)
    ? options.size
    : currentContext.size;
  const status = typeof options.status === 'string' && DIALOG_STATUSES.includes(options.status)
    ? options.status
    : currentContext.status;
  const title = typeof options.title === 'string' && options.title.trim()
    ? options.title.trim()
    : currentContext.title;
  const warnings = [];
  await applyDialog(target, {
    type: 'Dialog',
    props: {
      title,
      size,
      status,
      showClose: options.showClose !== false,
      showFooter: options.showFooter !== false,
    },
  }, warnings);
  const refreshed = currentInstance(target);
  postPluginMessage({
    type: 'dialog-props-result',
    warnings,
    message: 'Updated selected Dialog controls.',
    dialogNodeId: refreshed.id,
    dialogContext: dialogContextForSelection(refreshed),
  });
  postSelectionState();
  scheduleAutoExport();
}

function handleSetMenuProps(options = {}) {
  const target = selectedInstanceForContext(options.menuNodeId, 'Menu');
  if (!target) {
    return postError('Select one A1 Menu instance to edit its controls.');
  }
  const warnings = [];
  const rows = menuItemInstances(target);
  const rowCount = Math.max(0, Math.min(rows.length, Number(options.rowCount) || 0));
  rows.forEach((row, index) => {
    try {
      row.visible = index < rowCount;
    } catch (error) {
      warnings.push(`Menu row ${index + 1} visibility could not be changed: ${error.message}`);
    }
  });
  const refreshed = currentInstance(target);
  postPluginMessage({
    type: 'menu-props-result',
    warnings,
    message: 'Updated selected Menu controls.',
    menuNodeId: refreshed.id,
    menuContext: menuContextForSelection(refreshed),
  });
  postSelectionState();
  scheduleAutoExport();
}

async function handleSetDataTableProps(options = {}) {
  const target = selectedInstanceForContext(options.dataTableNodeId, 'Data Table');
  if (!target) {
    return postError('Select one A1 Data Table instance to edit its controls.');
  }
  const warnings = [];
  const exported = exportDataTable(target);
  warnings.push(...exported.warnings);
  const currentProps = exported.node.props || {};
  let props = null;
  if (options.dataTableProps && typeof options.dataTableProps === 'object') {
    props = dataTablePropsFromDataInput(options.dataTableProps);
  } else {
    const currentContext = dataTableContextForSelection(target);
    const columnCount = Math.max(1, Math.min(DATA_TABLE_MAX_COLUMNS, Number(options.columnCount) || currentContext.columnCount));
    const rowCount = Math.max(1, Math.min(DATA_TABLE_MAX_ROWS, Number(options.rowCount) || currentContext.rowCount));
    props = dataTablePropsWithShape(currentProps, columnCount, rowCount);
  }
  props.zebra = options.zebra === true;
  await applyDataTable(target, { type: 'DataTable', props }, warnings);
  const refreshed = currentInstance(target);
  const widthMode = typeof options.widthMode === 'string' && BUTTON_CONTEXT_WIDTH_MODES.includes(options.widthMode)
    ? options.widthMode
    : layoutWidthMode(refreshed);
  const heightMode = typeof options.heightMode === 'string' && BUTTON_CONTEXT_WIDTH_MODES.includes(options.heightMode)
    ? options.heightMode
    : layoutHeightMode(refreshed);
  syncLayoutWidthMode(refreshed, widthMode, warnings, 'Data Table');
  syncLayoutHeightMode(refreshed, heightMode, warnings, 'Data Table');
  postPluginMessage({
    type: 'data-table-props-result',
    warnings,
    message: 'Updated selected Data Table controls.',
    dataTableNodeId: refreshed.id,
    dataTableContext: dataTableContextForSelection(refreshed),
  });
  postSelectionState();
  scheduleAutoExport();
}

async function handleSetStackProps(options = {}) {
  const warnings = [];
  let target = null;
  if (typeof options.stackNodeId === 'string' && options.stackNodeId) {
    try {
      target = liveNode(resolveNodeById(options.stackNodeId));
    } catch {
      target = null;
    }
  }
  if (!isStackFrame(target)) {
    const selection = figma.currentPage.selection;
    target = selection.length === 1 ? liveNode(selection[0]) : null;
  }
  if (!isStackFrame(target)) {
    return postError('Select one A1 Stack frame to edit its controls.');
  }
  const currentContext = stackContextForSelection(target);
  const direction = typeof options.direction === 'string' && STACK_CONTEXT_DIRECTIONS.includes(options.direction)
    ? options.direction
    : currentContext.direction;
  const gap = stackGapControlToProp(options.gap);
  const justify = typeof options.justify === 'string' && STACK_CONTEXT_JUSTIFIES.includes(options.justify)
    ? options.justify
    : currentContext.justify;
  const align = typeof options.align === 'string' && STACK_CONTEXT_ALIGNS.includes(options.align)
    ? options.align
    : currentContext.align;
  const wrap = options.wrapMode === 'wrap' && direction === 'row';
  const widthMode = typeof options.widthMode === 'string' && STACK_CONTEXT_WIDTH_MODES.includes(options.widthMode)
    ? options.widthMode
    : currentContext.widthMode;
  const heightMode = typeof options.heightMode === 'string' && STACK_CONTEXT_WIDTH_MODES.includes(options.heightMode)
    ? options.heightMode
    : currentContext.heightMode;
  await applyStack(target, {
    type: 'Stack',
    props: { direction, gap, justify, align, wrap },
  }, warnings);
  syncStackPropsName(target);
  syncLayoutWidthMode(target, widthMode, warnings, 'Stack');
  syncLayoutHeightMode(target, heightMode, warnings, 'Stack');
  postPluginMessage({
    type: 'stack-props-result',
    warnings,
    message: 'Updated selected Stack controls.',
    stackNodeId: target.id,
    stackContext: stackContextForSelection(target),
  });
  postSelectionState();
  scheduleAutoExport();
}

async function handleSetSectionProps(options = {}) {
  const warnings = [];
  let target = null;
  if (typeof options.sectionNodeId === 'string' && options.sectionNodeId) {
    try {
      target = liveNode(resolveNodeById(options.sectionNodeId));
    } catch {
      target = null;
    }
  }
  if (!target || target.type !== 'INSTANCE' || registeredSetName(target) !== 'Section') {
    const selection = figma.currentPage.selection;
    target = selection.length === 1 ? liveNode(selection[0]) : null;
  }
  if (!target || target.type !== 'INSTANCE' || registeredSetName(target) !== 'Section') {
    return postError('Select one A1 Section instance to edit its controls.');
  }
  const currentContext = sectionContextForSelection(target);
  const surface = typeof options.surface === 'string' && SECTION_SURFACES.includes(options.surface)
    ? options.surface
    : currentContext.surface;
  const inverse = typeof options.inverse === 'boolean'
    ? options.inverse
    : currentContext.inverse === true;
  const padding = typeof options.padding === 'string' && SECTION_PADDINGS.includes(options.padding)
    ? options.padding
    : currentContext.padding;
  const contentWidth = typeof options.contentWidth === 'string' && SECTION_WIDTHS.includes(options.contentWidth)
    ? options.contentWidth
    : currentContext.contentWidth;
  const shouldApplyGap = typeof options.gap === 'string' && SECTION_GAPS.includes(options.gap);
  const gap = shouldApplyGap ? options.gap : null;
  const widthMode = typeof options.widthMode === 'string' && STACK_CONTEXT_WIDTH_MODES.includes(options.widthMode)
    ? options.widthMode
    : currentContext.widthMode;
  const heightMode = typeof options.heightMode === 'string' && STACK_CONTEXT_WIDTH_MODES.includes(options.heightMode)
    ? options.heightMode
    : currentContext.heightMode;
  await applySection(target, {
    type: 'Section',
    props: { surface, padding, contentWidth, ...(shouldApplyGap ? { gap } : {}), ...(inverse ? { inverse: true } : {}) },
    children: [],
  }, warnings);
  target = currentInstance(target);
  syncSectionInverseMode(target, inverse, warnings);
  if (shouldApplyGap) syncSectionGapSpacing(target, gap, warnings);
  syncLayoutWidthMode(target, widthMode, warnings, 'Section');
  syncLayoutHeightMode(target, heightMode, warnings, 'Section');
  postPluginMessage({
    type: 'section-props-result',
    warnings,
    message: 'Updated selected Section controls.',
    sectionNodeId: target.id,
    sectionContext: sectionContextForSelection(target),
    sectionReview: sectionSuggestion(target),
  });
  postSelectionState();
  scheduleAutoExport();
}

function handleSetGridProps(options = {}) {
  const warnings = [];
  let target = null;
  if (typeof options.gridNodeId === 'string' && options.gridNodeId) {
    try {
      target = liveNode(resolveNodeById(options.gridNodeId));
    } catch {
      target = null;
    }
  }
  if (!isGridFrame(target)) {
    const selection = figma.currentPage.selection;
    target = selection.length === 1 ? liveNode(selection[0]) : null;
  }
  if (!isGridFrame(target)) {
    return postError('Select one A1 Grid frame to edit its controls.');
  }
  const widthMode = typeof options.widthMode === 'string' && GRID_CONTEXT_WIDTH_MODES.includes(options.widthMode)
    ? options.widthMode
    : gridWidthMode(target);
  const heightMode = typeof options.heightMode === 'string' && GRID_CONTEXT_WIDTH_MODES.includes(options.heightMode)
    ? options.heightMode
    : gridHeightMode(target);
  syncGridWidthMode(target, widthMode, warnings);
  syncGridHeightMode(target, heightMode, warnings);
  postPluginMessage({
    type: 'grid-props-result',
    warnings,
    message: 'Updated selected Grid controls.',
    gridNodeId: target.id,
    gridColumns: readResponsiveGridColumns(target),
    gridWidthMode: gridWidthMode(target),
    gridHeightMode: gridHeightMode(target),
  });
  postSelectionState();
  scheduleAutoExport();
}

async function applyInlineLinkRanges(text, inlineLinks, warnings) {
  if (!Array.isArray(inlineLinks) || inlineLinks.length === 0) return;
  const colorVariable = await findTextColorVariable('link');
  if (!colorVariable) {
    warnings.push('No local color variable named "link/color" was found; inline Link ranges were not styled.');
    return;
  }
  for (const link of inlineLinks) {
    const start = Number(link && link.start);
    const end = Number(link && link.end);
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end <= start || end > text.characters.length) {
      warnings.push('An inline Link range is outside the text content and was ignored.');
      continue;
    }
    try {
      text.setRangeTextDecoration(start, end, 'UNDERLINE');
      const fills = text.getRangeFills(start, end);
      const paint = Array.isArray(fills) && fills.find((entry) => entry && entry.type === 'SOLID' && entry.visible !== false);
      if (!paint) {
        warnings.push(`Inline Link range ${start}–${end} has no solid fill to bind to link/color.`);
        continue;
      }
      text.setRangeFills(start, end, [figma.variables.setBoundVariableForPaint(paint, 'color', colorVariable)]);
    } catch (error) {
      warnings.push(`Inline Link range ${start}–${end} could not be styled: ${error.message}`);
    }
  }
}

async function importTextNode(node, warnings) {
  const text = figma.createText();
  const fallback = node.content && typeof node.content.fallback === 'string' ? node.content.fallback : '';
  // A1 imports use the same local Figma styles that free-text exports detect.
  const suggestion = textStyleRequestForNode(node);
  const initialFont = text.fontName;
  if (initialFont !== figma.mixed) await figma.loadFontAsync(initialFont);
  text.characters = fallback;
  await applyTextSuggestion(text, suggestion, warnings);
  await applyInlineLinkRanges(text, node.content && node.content.inlineLinks, warnings);
  text.name = node.type;
  return text;
}

async function applyTextAutoFix(text, warnings) {
  const suggestion = textSuggestion(text);
  if (suggestion.issues.length === 0) return suggestion;
  // A manually coloured text layer has no semantic JSON token yet. Match its
  // visible solid fill against the local A1 text variables before binding it;
  // this makes a light gray resolve to text/muted instead of default text.
  // Link candidates intentionally bind to the explicit link/color token.
  if (suggestion.type !== 'Link' && !textColorToken(text)) {
    const allowedColors = suggestion.type === 'Paragraph' ? ['default', 'muted'] : ['default', 'muted', 'accent'];
    // Pure black is the authored equivalent of A1's default text. Resolve it
    // deterministically before the broader nearest-token fallback so AutoFix
    // always replaces #000000 with color/text/default rather than retaining a
    // raw fill or selecting a different dark semantic token in another mode.
    const nearestColor = isBlackPaint(firstSolidTextPaint(text))
      ? 'default'
      : await nearestTextColorToken(text, allowedColors);
    if (nearestColor) suggestion.color = nearestColor;
  }
  await applyTextSuggestion(text, suggestion, warnings);
  await applyInlineLinkRanges(text, suggestion.inlineLinks, warnings);
  return suggestion;
}

async function handleFixText() {
  const selection = figma.currentPage.selection;
  if (selection.length !== 1 || selection[0].type !== 'TEXT') {
    return postError('Select one text layer to apply the A1 text suggestion.');
  }
  const text = selection[0];
  const initialSuggestion = textSuggestion(text);
  if (initialSuggestion.issues.length === 0) {
    postPluginMessage({ type: 'text-fix-result', warnings: [], message: 'This text layer already uses supported A1 text properties.' });
    return;
  }
  const warnings = [];
  const suggestion = await applyTextAutoFix(text, warnings);
  const message = suggestion.type === 'Link'
    ? 'Applied the A1 Link text style, underline, and link/color token.'
    : suggestion.inlineLinks && suggestion.inlineLinks.length
      ? 'Applied the A1 text style, color, and inline Link token bindings.'
      : 'Applied the nearest A1 text style, color, and alignment.';
  figma.notify(message);
  postPluginMessage({ type: 'text-fix-result', warnings, message });
  postSelectionState();
  scheduleAutoExport();
}

async function handleFixStack() {
  const selection = figma.currentPage.selection;
  if (selection.length !== 1 || !isStackFrame(selection[0])) {
    return postError('Select one authored auto-layout frame to apply the A1 Stack suggestion.');
  }
  const frame = selection[0];
  const suggestion = stackSuggestion(frame);
  if (suggestion.fixes.length === 0) {
    postPluginMessage({ type: 'stack-fix-result', warnings: [], message: 'This auto-layout frame already uses A1-compatible Stack layout values.' });
    return;
  }
  const warnings = [];
  await applyStackSuggestion(frame, suggestion, warnings);
  figma.notify('Applied the nearest A1 Stack layout values.');
  postPluginMessage({ type: 'stack-fix-result', warnings, message: 'Applied the nearest A1 Stack gap and compatible layout values.' });
  scheduleAutoExport();
}

function copyCardPlacement(source, card, parent, warnings) {
  try {
    if (parent && parent.type !== 'PAGE' && parent.layoutMode && parent.layoutMode !== 'NONE') {
      card.layoutAlign = source.layoutAlign;
      card.layoutGrow = source.layoutGrow;
      card.layoutSizingHorizontal = source.layoutSizingHorizontal;
      card.layoutSizingVertical = source.layoutSizingVertical;
    } else {
      card.x = source.x;
      card.y = source.y;
      card.resizeWithoutConstraints(source.width, card.height);
    }
  } catch (error) {
    warnings.push(`Card placement could not fully match the source frame: ${error.message}`);
  }
  setNodeToFillParentWidth(card, 'Card', warnings);
}

function copyPageLayoutPlacement(source, pageLayout, parent, warnings) {
  try {
    if (parent && parent.type !== 'PAGE' && parent.layoutMode && parent.layoutMode !== 'NONE') {
      pageLayout.layoutAlign = source.layoutAlign;
      pageLayout.layoutGrow = source.layoutGrow;
      pageLayout.layoutSizingHorizontal = source.layoutSizingHorizontal;
      pageLayout.layoutSizingVertical = source.layoutSizingVertical;
    } else {
      pageLayout.x = source.x;
      pageLayout.y = source.y;
      pageLayout.resizeWithoutConstraints(source.width, pageLayout.height);
    }
  } catch (error) {
    warnings.push(`Page Layout placement could not fully match the source frame: ${error.message}`);
  }
}

function copySectionPlacement(source, section, parent, warnings) {
  try {
    if (parent && parent.type !== 'PAGE' && parent.layoutMode && parent.layoutMode !== 'NONE') {
      section.layoutAlign = source.layoutAlign;
      section.layoutGrow = source.layoutGrow;
      section.layoutSizingHorizontal = source.layoutSizingHorizontal;
      section.layoutSizingVertical = source.layoutSizingVertical;
    } else {
      section.x = source.x;
      section.y = source.y;
      section.resizeWithoutConstraints(source.width, section.height);
    }
  } catch (error) {
    warnings.push(`Section placement could not fully match the source selection: ${error.message}`);
  }
}

function normalizeSectionContentChildSizing(child, warnings) {
  const node = liveNode(child);
  if (!node) return;
  try {
    node.layoutGrow = 0;
  } catch {
    // Not every child type exposes layoutGrow.
  }
  try {
    node.layoutAlign = 'STRETCH';
  } catch (error) {
    warnings.push(`Section content "${node.name || 'child'}" could not be set to fill width: ${error.message}`);
  }
  try {
    node.layoutSizingHorizontal = 'FILL';
  } catch {
    // Some Figma node types rely on layoutAlign=STRETCH instead.
  }
  try {
    node.layoutSizingVertical = 'HUG';
  } catch {
    // Leaf/vector nodes may not expose layout sizing; preserve their height.
  }
}

function clearSectionSlot(slot) {
  for (const child of [...slot.children]) {
    try { child.remove(); } catch { try { child.visible = false; } catch { /* no-op */ } }
  }
}
// Selection helpers are defined in src/figma/selection.js.
function isSectionContentSource(node) {
  return Boolean(node && ['FRAME', 'GROUP', 'SECTION'].includes(node.type) && 'children' in node);
}

async function convertFrameToCard(source, warnings) {
  const parent = source.parent;
  if (!parent || !('children' in parent) || !('insertChild' in parent)) {
    warnings.push('The selected frame cannot be replaced with a Card in its current parent.');
    return null;
  }

  const sourceIndex = parent.children.indexOf(source);
  const children = [...source.children];
  const card = await createComponentInstance('Card', warnings);
  parent.insertChild(Math.max(0, sourceIndex), card);
  copyCardPlacement(source, card, parent, warnings);

  for (const child of children) {
    slot = namedSlot(currentInstance(card), 'Content Slot');
    if (!slot) {
      warnings.push('Card Content Slot could not be refreshed; remaining content stayed in the original frame.');
      break;
    }
    try {
      slot.appendChild(child);
    } catch (error) {
      warnings.push(`"${child.name}" could not be moved into the Card Content Slot: ${error.message}`);
    }
  }

  if (source.children.length === 0) source.remove();
  else warnings.push('Some source content could not be moved, so the original frame was retained.');
  return card;
}

async function convertSelectionToSection(selection, warnings) {
  const selected = topLevelSelectionNodes(selection);
  if (!selected.length) {
    warnings.push('Select one or more canvas layers to convert to an A1 Section.');
    return null;
  }
  if (selected.length === 1 && selected[0].type === 'INSTANCE' && registeredSetName(selected[0]) === 'Section') {
    warnings.push('The selected layer is already an A1 Section.');
    return null;
  }

  const source = selected.length === 1 ? selected[0] : null;
  const useSourceChildren = source && isSectionContentSource(source) && source.children.length > 0;
  const parent = useSourceChildren ? source.parent : commonParent(selected);
  if (!parent || !('children' in parent) || !('insertChild' in parent)) {
    warnings.push('The selected layers must share a parent that can contain an A1 Section.');
    return null;
  }

  const contentNodes = useSourceChildren
    ? [...source.children].filter((child) => !isAuditReportNode(child))
    : selectedNodesInParentOrder(parent, selected);
  if (!contentNodes.length) {
    warnings.push('No movable content was found for the new A1 Section.');
    return null;
  }

  const insertionIndex = useSourceChildren
    ? parent.children.indexOf(source)
    : Math.min(...contentNodes.map((node) => parent.children.indexOf(node)).filter((index) => index >= 0));
  const section = await createComponentInstance('Section', warnings);
  parent.insertChild(Math.max(0, insertionIndex), section);

  if (useSourceChildren) {
    copySectionPlacement(source, section, parent, warnings);
  } else {
    const bounds = selectionBoundsInParent(contentNodes);
    const placementSource = contentNodes[0];
    if (bounds && !(parent.type !== 'PAGE' && parent.layoutMode && parent.layoutMode !== 'NONE')) {
      try {
        section.x = bounds.x;
        section.y = bounds.y;
        section.resizeWithoutConstraints(bounds.width, section.height);
      } catch (error) {
        warnings.push(`Section placement could not match the selected content bounds: ${error.message}`);
      }
    } else if (placementSource) {
      copySectionPlacement(placementSource, section, parent, warnings);
    }
  }

  const contentWidth = inferredSectionContentWidth(useSourceChildren ? source : null, contentNodes, 'lg');
  applySectionContentWidth(section, contentWidth, warnings);

  let slot = sectionContentContainer(currentInstance(section));
  if (!slot) {
    section.remove();
    warnings.push('The Section Content Slot was not found. The selected content was left unchanged.');
    return null;
  }
  clearSectionSlot(slot);

  let moved = 0;
  for (const child of contentNodes) {
    slot = sectionContentContainer(currentInstance(section));
    if (!slot) {
      warnings.push('Section Content Slot could not be refreshed; remaining content stayed in place.');
      break;
    }
    try {
      slot.appendChild(child);
      normalizeSectionContentChildSizing(child, warnings);
      moved += 1;
    } catch (error) {
      warnings.push(`"${child.name}" could not be moved into the Section Content Slot: ${error.message}`);
    }
  }

  if (useSourceChildren) {
    try {
      if (source.children.length === 0) source.remove();
      else warnings.push('Some source frame content could not be moved, so the original frame was retained.');
    } catch {
      // Groups can be normalized by Figma as their children move. If the
      // source vanished, the successful Section conversion is still complete.
    }
  }
  if (moved === 0) {
    try { section.remove(); } catch { /* no-op */ }
    warnings.push('No selected content could be moved into the new A1 Section.');
    return null;
  }
  fillConvertedLayoutWidth(section, 'Section', warnings);
  return section;
}

function conversionContext(selection, warnings, emptyMessage) {
  const selected = topLevelSelectionNodes(selection);
  if (!selected.length) {
    warnings.push(emptyMessage || 'Select one or more canvas layers to convert.');
    return null;
  }
  const source = selected.length === 1 ? selected[0] : null;
  const useSourceChildren = source && isSectionContentSource(source) && source.children.length > 0;
  const parent = useSourceChildren ? source.parent : commonParent(selected);
  if (!parent || !('children' in parent) || !('insertChild' in parent)) {
    warnings.push('The selected layers must share a parent that can receive the converted A1 component.');
    return null;
  }
  const contentNodes = useSourceChildren
    ? [...source.children].filter((child) => !isAuditReportNode(child))
    : selectedNodesInParentOrder(parent, selected);
  if (!contentNodes.length) {
    warnings.push('No movable content was found for the conversion.');
    return null;
  }
  const insertionIndex = useSourceChildren
    ? parent.children.indexOf(source)
    : Math.min(...contentNodes.map((node) => parent.children.indexOf(node)).filter((index) => index >= 0));
  const bounds = useSourceChildren
    ? { x: source.x, y: source.y, width: source.width, height: source.height }
    : selectionBoundsInParent(contentNodes);
  return { selected, source, useSourceChildren, parent, contentNodes, insertionIndex: Math.max(0, insertionIndex), bounds };
}

function directConversionContext(selection, warnings, emptyMessage) {
  const selected = (selection || [])
    .map(liveNode)
    .filter(Boolean)
    .filter((node) => {
      try {
        return !isAuditReportNode(node) && node.type !== 'PAGE' && node.parent
          && !['COMPONENT', 'COMPONENT_SET', 'SLOT'].includes(node.type);
      } catch {
        return false;
      }
    });
  if (!selected.length) {
    warnings.push(emptyMessage || 'Select one or more canvas layers to convert.');
    return null;
  }
  const parent = commonParent(selected);
  if (!parent || !('children' in parent) || !('insertChild' in parent)) {
    warnings.push('The selected layers must share a parent that can receive the converted A1 component.');
    return null;
  }
  const contentNodes = selectedNodesInParentOrder(parent, selected);
  if (!contentNodes.length) {
    warnings.push('No movable content was found for the conversion.');
    return null;
  }
  const insertionIndex = Math.min(...contentNodes.map((node) => parent.children.indexOf(node)).filter((index) => index >= 0));
  return {
    selected,
    source: selected.length === 1 ? selected[0] : null,
    useSourceChildren: false,
    parent,
    contentNodes,
    insertionIndex: Math.max(0, insertionIndex),
    bounds: selectionBoundsInParent(contentNodes),
  };
}

function textConversionRoots(selection) {
  return (selection || [])
    .map(liveNode)
    .filter(Boolean)
    .filter((node) => {
      try {
        return !isAuditReportNode(node) && node.type !== 'PAGE'
          && !['COMPONENT', 'COMPONENT_SET'].includes(node.type);
      } catch {
        return false;
      }
    });
}

function isInsideNativeSlot(node) {
  try {
    for (let current = node && node.parent; current && current.type !== 'PAGE'; current = current.parent) {
      if (current.type === 'SLOT') return true;
    }
  } catch {
    return false;
  }
  return false;
}

function closestA1ComponentAncestor(node, componentName) {
  try {
    for (let current = liveNode(node); current; current = current.parent) {
      if (current.type === 'INSTANCE' && isA1ComponentInstance(current, componentName)) return current;
    }
  } catch {
    return null;
  }
  return null;
}

function placeConvertedNode(node, context, warnings, options = {}) {
  const { parent, insertionIndex, bounds, source, contentNodes } = context;
  parent.insertChild(insertionIndex, node);
  const reference = source || contentNodes[0];
  try {
    if (parent && parent.type !== 'PAGE' && parent.layoutMode && parent.layoutMode !== 'NONE' && reference) {
      node.layoutAlign = reference.layoutAlign;
      node.layoutGrow = reference.layoutGrow;
      node.layoutSizingHorizontal = reference.layoutSizingHorizontal;
      node.layoutSizingVertical = reference.layoutSizingVertical;
    } else if (bounds) {
      node.x = bounds.x;
      node.y = bounds.y;
      if (options.resize !== false && typeof node.resizeWithoutConstraints === 'function') {
        node.resizeWithoutConstraints(Math.max(1, bounds.width), node.height);
      }
    }
  } catch (error) {
    warnings.push(`Converted component placement could not fully match the selection: ${error.message}`);
  }
}

function removeConvertedSource(context, warnings) {
  const nodes = context.useSourceChildren ? [context.source] : context.contentNodes;
  for (const node of nodes) {
    try {
      if (node && node.parent) node.remove();
    } catch (error) {
      warnings.push(`"${node && node.name ? node.name : 'Selection'}" could not be removed after conversion: ${error.message}`);
    }
  }
}

function isVisibleForTextConversion(node) {
  const current = liveNode(node);
  if (!current) return false;
  try {
    return current.visible !== false;
  } catch {
    return true;
  }
}

function collectTextLayers(root, out = []) {
  const node = liveNode(root);
  if (!node || isAuditReportNode(node) || !isVisibleForTextConversion(node)) return out;
  if (node.type === 'TEXT') {
    if (isMaterialIconTextNode(node)) return out;
    out.push(node);
    return out;
  }
  if (node.type === 'INSTANCE') {
    const componentName = registeredSetName(node);
    if (componentName && isA1ComponentInstance(node, componentName)) return out;
  }
  try {
    for (const child of node.children || []) collectTextLayers(child, out);
  } catch {
    // Ignore stale child handles while deriving a label.
  }
  return out;
}

function selectionTextContent(nodes, fallback = '') {
  const text = [];
  for (const node of nodes || []) {
    for (const textNode of collectTextLayers(node)) {
      const value = typeof textNode.characters === 'string' ? textNode.characters.trim() : '';
      if (value) text.push(value);
    }
  }
  const visibleText = text
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  return visibleText || componentTextPropertyContent(nodes) || fallback;
}

function componentTextPropertyContent(nodes) {
  const wanted = ['label', 'text', 'title', 'value', 'defaultvalue', 'buttontext'];
  const fallbackValues = [];
  const visit = (node) => {
    const current = liveNode(node);
    if (!current || isAuditReportNode(current) || !isVisibleForTextConversion(current)) return '';
    if (current.type === 'INSTANCE') {
      const componentName = registeredSetName(current);
      if (componentName && isA1ComponentInstance(current, componentName)) return '';
      try {
        const props = current.componentProperties || {};
        for (const key of Object.keys(props)) {
          const property = props[key];
          const name = canonicalKey(key);
          if (property && property.type === 'TEXT' && wanted.some((part) => name.includes(part))) {
            const value = typeof property.value === 'string' ? property.value.trim() : '';
            if (value) return value;
          }
          if (property && property.type === 'TEXT') {
            const value = typeof property.value === 'string' ? property.value.trim() : '';
            if (value && !name.includes('icon')) fallbackValues.push(value);
          }
        }
      } catch {
        // Some custom instances do not expose componentProperties safely.
      }
    }
    try {
      for (const child of current.children || []) {
        const value = visit(child);
        if (value) return value;
      }
    } catch {
      return '';
    }
    return '';
  };
  for (const node of nodes || []) {
    const value = visit(node);
    if (value) return value;
  }
  return fallbackValues
    .sort((a, b) => b.length - a.length)[0] || '';
}

function nodeBounds(node) {
  const current = liveNode(node);
  if (!current) return null;
  try {
    const box = current.absoluteBoundingBox;
    if (box && Number.isFinite(box.x) && Number.isFinite(box.y) && Number.isFinite(box.width) && Number.isFinite(box.height)) return box;
  } catch {
    // Some Figma node types do not expose absolute bounds.
  }
  try {
    if (Number.isFinite(current.x) && Number.isFinite(current.y) && Number.isFinite(current.width) && Number.isFinite(current.height)) {
      return { x: current.x, y: current.y, width: current.width, height: current.height };
    }
  } catch {
    // Ignore unavailable geometry.
  }
  return null;
}

function conversionInferenceNodes(context) {
  if (context && context.source) return [context.source];
  return context && context.contentNodes ? context.contentNodes : [];
}

function conversionTargetComponentName(target) {
  return {
    'page-layout': 'Page Layout',
    section: 'Section',
    card: 'Card',
    stack: 'Stack',
    grid: 'Grid',
    button: 'Button',
    'button-container': 'Button Container',
    'text-field': 'Text Field',
    'search-field': 'Search Field',
    textarea: 'Textarea',
    select: 'Select',
    switch: 'Switch',
    'radio-group': 'Radio Group',
    'checkbox-group': 'Checkbox Group',
    'page-nav': 'Page Nav',
    'tree-menu': 'Tree Menu',
    pagination: 'Pagination',
    tabs: 'Tabs',
    'definition-list': 'Definition List Item',
    'definition-item': 'Definition List Item',
    link: 'Link',
    figure: 'Figure',
  }[target] || '';
}

function conversionPreparationRoot(node) {
  const selected = liveNode(node);
  if (!selected) return null;
  let customInstance = null;
  try {
    for (let current = selected; current && current.type !== 'PAGE'; current = current.parent) {
      if (current.type === 'SLOT') return customInstance || selected;
      if (current.type !== 'INSTANCE') continue;
      if (registeredSetName(current)) {
        return current.id === selected.id ? current : (customInstance || selected);
      }
      customInstance = current;
    }
  } catch {
    return selected;
  }
  return customInstance || selected;
}

function prepareSelectionForConversion(selection, target, warnings) {
  const targetComponent = conversionTargetComponentName(target);
  // Layout conversions should preserve authored A1 instances as children. In
  // particular, converting a selection of Banners to a Grid must not detach
  // the Banners first: detaching removes their component identity and the
  // exporter can only recover the text layers afterward. The layout primitive
  // owns the new container; its children should remain swappable A1 instances.
  const preserveA1Instances = new Set([
    'stack',
    'grid',
    'section',
    'card',
    'page-layout',
    'button-container',
  ]);
  const roots = (selection || [])
    .map(liveNode)
    .filter(Boolean)
    .map(conversionPreparationRoot)
    .filter(Boolean);
  const topLevel = topLevelSelectionNodes(roots);
  if (!topLevel.some((node) => node.type === 'INSTANCE')) return selection;
  const prepared = [];
  for (const node of topLevel) {
    if (node.type !== 'INSTANCE') {
      prepared.push(node);
      continue;
    }
    if (target === 'button-container' && isA1ComponentInstance(node, 'Button')) {
      prepared.push(node);
      continue;
    }
    if (preserveA1Instances.has(target) && registeredSetName(node)) {
      prepared.push(node);
      continue;
    }
    if (targetComponent && isA1ComponentInstance(node, targetComponent)) {
      prepared.push(node);
      continue;
    }
    try {
      prepared.push(node.detachInstance());
    } catch (error) {
      prepared.push(node);
      warnings.push(`"${node.name}" could not be detached before conversion: ${error.message}`);
    }
  }
  figma.currentPage.selection = prepared;
  return prepared;
}

function firstImagePaintInSelection(nodes) {
  const visit = (node) => {
    const current = liveNode(node);
    if (!current || isAuditReportNode(current)) return null;
    const paint = imagePaintOn(current);
    if (paint) return { node: current, paint };
    if (current.type === 'INSTANCE') {
      const componentName = registeredSetName(current);
      if (componentName && isA1ComponentInstance(current, componentName)) return null;
    }
    try {
      for (const child of current.children || []) {
        const found = visit(child);
        if (found) return found;
      }
    } catch {
      return null;
    }
    return null;
  };
  for (const node of nodes || []) {
    const found = visit(node);
    if (found) return found;
  }
  return null;
}

function nearestFigureSize(width) {
  if (typeof width !== 'number' || !Number.isFinite(width) || width <= 0) return 'sm';
  return FIGURE_SIZES.reduce((nearest, size) =>
    Math.abs(FIGURE_MAX_WIDTHS[size] - width) < Math.abs(FIGURE_MAX_WIDTHS[nearest] - width)
      ? size
      : nearest, 'sm');
}

function nearestFigureAspectRatio(width, height) {
  if (typeof width !== 'number' || typeof height !== 'number' || !Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return '16:9';
  const ratio = width / height;
  return FIGURE_ASPECT_RATIOS.reduce((nearest, option) =>
    Math.abs(FIGURE_RATIO_VALUES[option] - ratio) < Math.abs(FIGURE_RATIO_VALUES[nearest] - ratio)
      ? option
      : nearest, '16:9');
}

async function convertSelectionToCard(selection, warnings) {
  const context = conversionContext(selection, warnings, 'Select one or more layers to convert to an A1 Card.');
  if (!context) return null;
  if (context.selected.length === 1 && isA1ComponentInstance(context.selected[0], 'Card')) {
    warnings.push('The selected layer is already an A1 Card.');
    return null;
  }
  const card = await createComponentInstance('Card', warnings);
  placeConvertedNode(card, context, warnings);
  setNodeToFillParentWidth(card, 'Card', warnings);

  let slot = namedSlot(currentInstance(card), 'Content Slot');
  if (!slot) {
    card.remove();
    warnings.push('The Card Content Slot was not found. The selected content was left unchanged.');
    return null;
  }
  for (const child of [...slot.children]) {
    try { child.remove(); } catch { try { child.visible = false; } catch { /* no-op */ } }
  }
  let moved = 0;
  for (const child of context.contentNodes) {
    slot = namedSlot(currentInstance(card), 'Content Slot');
    if (!slot) {
      warnings.push('Card Content Slot could not be refreshed; remaining content stayed in place.');
      break;
    }
    try {
      slot.appendChild(child);
      moved += 1;
    } catch (error) {
      warnings.push(`"${child.name}" could not be moved into the Card Content Slot: ${error.message}`);
    }
  }
  if (context.useSourceChildren) {
    try {
      if (context.source.children.length === 0) context.source.remove();
      else warnings.push('Some source frame content could not be moved, so the original frame was retained.');
    } catch {
      // Figma may normalize a group as its children move.
    }
  }
  if (moved === 0) {
    try { card.remove(); } catch { /* no-op */ }
    warnings.push('No selected content could be moved into the new A1 Card.');
    return null;
  }
  return card;
}

function inferredStackDirection(nodes, source) {
  if (source && source.layoutMode === 'HORIZONTAL') return 'row';
  if (source && source.layoutMode === 'VERTICAL') return 'column';
  if (!nodes || nodes.length < 2) return 'column';
  const bounds = nodes
    .map(nodeBounds)
    .filter(Boolean);
  if (bounds.length < 2) return 'column';
  const minCenterX = Math.min(...bounds.map((box) => box.x + box.width / 2));
  const maxCenterX = Math.max(...bounds.map((box) => box.x + box.width / 2));
  const minCenterY = Math.min(...bounds.map((box) => box.y + box.height / 2));
  const maxCenterY = Math.max(...bounds.map((box) => box.y + box.height / 2));
  return (maxCenterX - minCenterX) > (maxCenterY - minCenterY) * 1.25 ? 'row' : 'column';
}

function inferredLayoutGap(nodes, direction) {
  if (!nodes || nodes.length < 2) return 'md';
  const bounds = nodes
    .map(nodeBounds)
    .filter(Boolean)
    .sort((a, b) => direction === 'row' ? a.x - b.x : a.y - b.y);
  const gaps = [];
  for (let index = 1; index < bounds.length; index += 1) {
    const previous = bounds[index - 1];
    const current = bounds[index];
    const gap = direction === 'row'
      ? current.x - (previous.x + previous.width)
      : current.y - (previous.y + previous.height);
    if (Number.isFinite(gap) && gap >= 0) gaps.push(gap);
  }
  if (!gaps.length) return 'md';
  const average = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
  return nearestStackGap(average);
}

function inferredGridColumns(nodes, bounds, source) {
  if (source && source.layoutMode === 'GRID') {
    const columns = figmaNumber(source.gridColumnCount, NaN);
    if (Number.isInteger(columns) && columns > 0) return columns;
  }
  if (!nodes || nodes.length <= 1) return 1;
  const childWidths = nodes
    .map((node) => nodeBounds(node))
    .filter(Boolean)
    .map((box) => box.width)
    .filter((width) => Number.isFinite(width) && width > 0)
    .sort((a, b) => a - b);
  const medianWidth = childWidths[Math.floor(childWidths.length / 2)];
  if (bounds && medianWidth) {
    return Math.max(1, Math.min(nodes.length, Math.round(bounds.width / medianWidth)));
  }
  return Math.min(nodes.length, 2);
}

function fillConvertedTextWidth(text, warnings) {
  const parent = text && text.parent;
  if (!parent || !['HORIZONTAL', 'VERTICAL', 'GRID'].includes(parent.layoutMode)) return;
  try {
    if (parent.layoutMode === 'VERTICAL') {
      text.layoutAlign = 'STRETCH';
      text.layoutSizingHorizontal = 'FILL';
    } else if (parent.layoutMode === 'HORIZONTAL') {
      text.layoutGrow = 1;
    } else {
      text.layoutSizingHorizontal = 'FILL';
    }
    text.textAutoResize = 'HEIGHT';
  } catch (error) {
    warnings.push(`Converted text could not be set to fill the parent width: ${error.message}`);
  }
}

async function replaceSlotTextWithA1Text(text, suggestion, warnings) {
  const parent = text && text.parent;
  if (!parent || !('insertChild' in parent)) return null;
  const [family, size, weight] = String(suggestion.styleName || '').split('/');
  const isHeading = suggestion.type === 'Heading';
  const node = isHeading
    ? {
      type: 'Heading',
      props: {
        as: 'h2',
        type: family === 'display' ? 'display' : 'heading',
        size: size || 'md',
        color: suggestion.color || 'default',
        align: suggestion.align || 'left',
      },
      content: { fallback: text.characters || '' },
    }
    : {
      type: 'Paragraph',
      props: {
        size: size || 'md',
        color: suggestion.color || 'default',
        align: suggestion.align || 'left',
        ...(weight ? { weight } : {}),
      },
      content: { fallback: text.characters || '' },
    };
  const replacement = await importTextNode(node, warnings);
  const index = parent.children.indexOf(text);
  parent.insertChild(index >= 0 ? index : parent.children.length, replacement);
  try {
    if (!parent.layoutMode || parent.layoutMode === 'NONE') {
      replacement.x = text.x;
      replacement.y = text.y;
      if (typeof replacement.resizeWithoutConstraints === 'function') {
        replacement.resizeWithoutConstraints(Math.max(1, text.width), replacement.height);
      }
    } else {
      replacement.layoutAlign = text.layoutAlign;
      replacement.layoutGrow = text.layoutGrow;
      replacement.layoutSizingHorizontal = text.layoutSizingHorizontal;
      replacement.layoutSizingVertical = text.layoutSizingVertical;
    }
  } catch (error) {
    warnings.push(`Converted slot text placement could not fully match the original text: ${error.message}`);
  }
  try {
    text.remove();
  } catch (error) {
    warnings.push(`Original slot text could not be removed after conversion: ${error.message}`);
  }
  fillConvertedTextWidth(replacement, warnings);
  replacement.name = isHeading ? 'Heading' : 'Paragraph';
  return replacement;
}

function fillConvertedLayoutWidth(node, type, warnings) {
  const parent = node && node.parent;
  if (!parent || !['HORIZONTAL', 'VERTICAL', 'GRID'].includes(parent.layoutMode)) return;
  try {
    if (parent.layoutMode === 'VERTICAL') {
      node.layoutAlign = 'STRETCH';
      node.layoutSizingHorizontal = 'FILL';
    } else if (parent.layoutMode === 'HORIZONTAL') {
      node.layoutGrow = 1;
    } else {
      node.layoutSizingHorizontal = 'FILL';
    }
  } catch (error) {
    warnings.push(`Converted ${type} could not be set to fill the parent width: ${error.message}`);
  }
}

function clearConvertedContainerChrome(frame, type, warnings) {
  if (!frame) return;
  const clear = (description, fn) => {
    try {
      fn();
    } catch (error) {
      warnings.push(`Converted ${type} ${description} could not be cleared: ${error.message}`);
    }
  };
  clear('background', () => { frame.fills = []; });
  clear('fill style', () => { if ('fillStyleId' in frame) frame.fillStyleId = ''; });
  clear('border', () => { frame.strokes = []; });
  clear('stroke style', () => { if ('strokeStyleId' in frame) frame.strokeStyleId = ''; });
  clear('effects', () => { frame.effects = []; });
  clear('effect style', () => { if ('effectStyleId' in frame) frame.effectStyleId = ''; });
  clear('corner radius', () => {
    frame.cornerRadius = 0;
    frame.topLeftRadius = 0;
    frame.topRightRadius = 0;
    frame.bottomRightRadius = 0;
    frame.bottomLeftRadius = 0;
  });
}

async function normalizeExistingStackFrame(frame, warnings) {
  const suggestion = stackSuggestion(frame);
  await applyStackSuggestion(frame, suggestion, warnings);
  const nearestGap = nearestStackGap(frame.itemSpacing);
  await bindGapProperty(frame, 'itemSpacing', nearestGap, warnings, 'Stack item spacing');
  if (frame.layoutWrap === 'WRAP') await bindGapProperty(frame, 'counterAxisSpacing', nearestGap, warnings, 'Stack wrap row spacing');
  syncStackPropsName(frame);
  clearConvertedContainerChrome(frame, 'Stack', warnings);
  fillConvertedLayoutWidth(frame, 'Stack', warnings);
  return frame;
}

async function normalizeExistingGridFrame(frame, warnings, options = {}) {
  await applyGridSuggestion(frame, gridSuggestion(frame), warnings);
  const responsiveColumns = normalizeResponsiveColumns(options.responsiveColumns);
  const previewBreakpoint = breakpointForWidth(frame.width, 'md');
  const requestedColumns = responsiveColumns ? responsiveColumnsAt(responsiveColumns, previewBreakpoint) : null;
  const currentColumnCount = figmaNumber(frame.gridColumnCount, NaN);
  frame.gridColumnCount = requestedColumns || (Number.isInteger(currentColumnCount) && currentColumnCount > 0 ? currentColumnCount : 1);
  try {
    frame.gridColumnSizes.forEach((track) => {
      track.type = 'FLEX';
      track.value = 1;
    });
  } catch {
    // Older grid frames may reject track edits; their count/gaps are still normalized.
  }
  frame.name = 'Grid';
  clearConvertedContainerChrome(frame, 'Grid', warnings);
  defineResponsiveGridBreakpoints(frame, figmaNumber(frame.gridColumnCount, 1) || 1, frame.width, warnings, responsiveColumns);
  fillConvertedLayoutWidth(frame, 'Grid', warnings);
  return frame;
}

async function convertSelectionToStack(selection, warnings) {
  const context = conversionContext(selection, warnings, 'Select one or more layers to convert to an A1 Stack.');
  if (!context) return null;
  if (context.selected.length === 1 && isStackFrame(context.selected[0])) {
    return await normalizeExistingStackFrame(context.selected[0], warnings);
  }
  const direction = inferredStackDirection(context.contentNodes, context.source);
  const gap = inferredLayoutGap(context.contentNodes, direction);
  const stack = figma.createFrame();
  stack.name = 'Stack';
  stack.clipsContent = false;
  clearConvertedContainerChrome(stack, 'Stack', warnings);
  if (context.bounds) {
    try {
      stack.resizeWithoutConstraints(Math.max(1, context.bounds.width), Math.max(1, context.bounds.height));
    } catch (error) {
      warnings.push(`Stack bounds could not match the selection: ${error.message}`);
    }
  }
  const { align } = await applyStack(stack, { type: 'Stack', props: { direction, gap, align: 'stretch' } }, warnings);
  syncStackPropsName(stack);
  placeConvertedNode(stack, context, warnings);
  fillConvertedLayoutWidth(stack, 'Stack', warnings);
  let moved = 0;
  for (const child of context.contentNodes) {
    try {
      stack.appendChild(child);
      moved += 1;
    } catch (error) {
      warnings.push(`"${child.name}" could not be moved into the Stack: ${error.message}`);
    }
  }
  setStackChildrenAlignment(stack, align, warnings);
  if (context.useSourceChildren) {
    try {
      if (context.source.children.length === 0) context.source.remove();
      else warnings.push('Some source frame content could not be moved, so the original frame was retained.');
    } catch {
      // Figma may normalize a group as its children move.
    }
  }
  if (moved === 0) {
    try { stack.remove(); } catch { /* no-op */ }
    warnings.push('No selected content could be moved into the new A1 Stack.');
    return null;
  }
  return stack;
}

async function convertSelectionToGrid(selection, warnings, options = {}) {
  const context = conversionContext(selection, warnings, 'Select one or more layers to convert to an A1 Grid.');
  if (!context) return null;
  if (context.selected.length === 1 && isGridFrame(context.selected[0])) {
    return await normalizeExistingGridFrame(context.selected[0], warnings, options);
  }
  const responsiveColumns = normalizeResponsiveColumns(options.responsiveColumns);
  const previewBreakpoint = breakpointForWidth(context.bounds && context.bounds.width, 'md');
  const columns = responsiveColumns
    ? responsiveColumnsAt(responsiveColumns, previewBreakpoint)
    : inferredGridColumns(context.contentNodes, context.bounds, context.source);
  const gap = inferredLayoutGap(context.contentNodes, 'row');
  const grid = figma.createFrame();
  grid.name = 'Grid';
  grid.clipsContent = false;
  clearConvertedContainerChrome(grid, 'Grid', warnings);
  if (context.bounds) {
    try {
      grid.resizeWithoutConstraints(Math.max(1, context.bounds.width), Math.max(1, context.bounds.height));
    } catch (error) {
      warnings.push(`Grid bounds could not match the selection: ${error.message}`);
    }
  }
  await applyGrid(grid, { type: 'Grid', props: { columns, gap, alignItems: 'stretch' } }, warnings);
  grid.name = 'Grid';
  placeConvertedNode(grid, context, warnings);
  fillConvertedLayoutWidth(grid, 'Grid', warnings);
  let moved = 0;
  for (const child of context.contentNodes) {
    try {
      grid.appendChild(child);
      try {
        child.layoutSizingHorizontal = 'FILL';
      } catch {
        // Some nodes cannot fill grid cells; their original width is preserved.
      }
      moved += 1;
    } catch (error) {
      warnings.push(`"${child.name}" could not be moved into the Grid: ${error.message}`);
    }
  }
  if (context.useSourceChildren) {
    try {
      if (context.source.children.length === 0) context.source.remove();
      else warnings.push('Some source frame content could not be moved, so the original frame was retained.');
    } catch {
      // Figma may normalize a group as its children move.
    }
  }
  if (moved === 0) {
    try { grid.remove(); } catch { /* no-op */ }
    warnings.push('No selected content could be moved into the new A1 Grid.');
    return null;
  }
  defineResponsiveGridBreakpoints(grid, columns, context.bounds && context.bounds.width, warnings, responsiveColumns);
  return grid;
}

async function convertSelectionToText(selection, kind, warnings) {
  const selected = textConversionRoots(selection);
  const texts = [];
  for (const node of selected) collectTextLayers(node, texts);
  if (!texts.length) {
    warnings.push(`Select at least one text layer or a frame containing text to convert to ${kind === 'heading' ? 'Heading' : 'Body'}.`);
    return [];
  }
  const affected = [];
  for (const text of texts) {
    const fontSize = text.fontSize === figma.mixed ? undefined : text.fontSize;
    const align = conversionTextAlignment(text, warnings, kind === 'heading' ? 'Converted Heading' : 'Converted Body');
    const size = kind === 'heading'
      ? nearestTextSize(HEADING_FONT_SIZES, fontSize, 'md')
      : nearestTextSize(PARAGRAPH_FONT_SIZES, fontSize, 'md');
    const color = kind === 'heading'
      ? (textColorToken(text) || 'default')
      : (['default', 'muted'].includes(textColorToken(text)) ? textColorToken(text) : 'default');
    const suggestion = kind === 'heading'
      ? { type: 'Heading', styleName: `heading/${size}`, color, align }
      : { type: 'Paragraph', styleName: `body/${size}`, color, align };
    if (isInsideNativeSlot(text)) {
      const replacement = await replaceSlotTextWithA1Text(text, suggestion, warnings);
      if (replacement) {
        affected.push(replacement);
        continue;
      }
      warnings.push('Slot text could not be replaced, so the plugin tried to style the selected text in place.');
    }
    await applyTextSuggestion(text, suggestion, warnings);
    if (kind !== 'link') {
      try { text.textDecoration = 'NONE'; } catch { /* no-op */ }
    }
    fillConvertedTextWidth(text, warnings);
    text.name = kind === 'heading' ? 'Heading' : 'Paragraph';
    affected.push(text);
  }
  return affected;
}

async function convertSelectionToButton(selection, warnings) {
  const liveSelection = (selection || []).map(liveNode).filter(Boolean);
  if (liveSelection.length === 1 && closestA1ComponentAncestor(liveSelection[0], 'Button')) {
    warnings.push('The selected layer is already inside an A1 Button.');
    return null;
  }
  const contextWarnings = [];
  let context = conversionContext(selection, contextWarnings, 'Select text or a layer to convert to an A1 Button.');
  if (context) warnings.push(...contextWarnings);
  else context = directConversionContext(selection, warnings, 'Select text or a layer to convert to an A1 Button.');
  if (!context) return null;
  const inferenceNodes = conversionInferenceNodes(context);
  const fallbackLabel = context.source && context.source.name ? context.source.name : 'Button';
  const label = selectionTextContent(inferenceNodes, fallbackLabel);
  if (label === fallbackLabel) warnings.push(`Button label was inferred from the selected layer name "${fallbackLabel}" because no visible text or text property was found.`);
  const button = await importButton({ type: 'Button', props: { variant: 'secondary' }, content: { fallback: label } }, warnings);
  placeConvertedNode(button, context, warnings, { resize: false });
  removeConvertedSource(context, warnings);
  return button;
}

function buttonConversionLabelsFromNode(node, fallback) {
  const labels = [];
  for (const textNode of collectTextLayers(node)) {
    const value = typeof textNode.characters === 'string' ? textNode.characters : '';
    value
      .split(/\n+/)
      .map((line) => line.replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .forEach((line) => labels.push(line));
  }
  if (labels.length) return labels;
  const content = selectionTextContent([node], fallback).replace(/\s+/g, ' ').trim();
  return content ? [content] : [];
}

function buttonContainerButtonNodesFromContext(context, warnings) {
  const nodes = [];
  const usedLabels = new Set();
  const addButtonNode = (node, fallbackLabel) => {
    const current = liveNode(node);
    if (current && current.type === 'INSTANCE' && registeredSetName(current) === 'Button') {
      const result = exportButton(current);
      warnings.push(...result.warnings);
      nodes.push(result.node);
      return;
    }
    const labels = buttonConversionLabelsFromNode(current, fallbackLabel);
    labels.forEach((label) => {
      const normalized = label.trim();
      if (!normalized) return;
      const key = normalized.toLowerCase();
      if (usedLabels.has(key)) return;
      usedLabels.add(key);
      nodes.push({
        type: 'Button',
        props: { variant: nodes.length === 0 ? 'primary' : 'secondary', size: 'md' },
        content: { fallback: normalized },
      });
    });
  };

  for (const node of context.contentNodes || []) {
    addButtonNode(node, node && node.name ? node.name : `Action ${nodes.length + 1}`);
  }
  if (nodes.length === 0) {
    const fallback = context.source && context.source.name ? context.source.name : 'Action';
    nodes.push({
      type: 'Button',
      props: { variant: 'primary', size: 'md' },
      content: { fallback },
    });
    warnings.push(`Button Group actions were inferred from the selected layer name "${fallback}" because no visible button labels were found.`);
  }
  return nodes;
}

async function replaceButtonContainerChildrenForConversion(instance, buttonNodes, warnings) {
  let slot = buttonContainerSlot(currentInstance(instance));
  if (!slot || !('children' in slot)) {
    warnings.push('Button Slot was not found — Button Group actions were not applied.');
    return false;
  }
  if (slot.type === 'SLOT') {
    for (const child of [...slot.children]) {
      try {
        child.remove();
      } catch {
        try { child.visible = false; } catch { /* no-op */ }
      }
    }
    for (const buttonNode of buttonNodes) {
      slot = buttonContainerSlot(currentInstance(instance));
      if (!slot || slot.type !== 'SLOT') {
        warnings.push('Button Slot could not be refreshed while adding Button Group actions.');
        break;
      }
      try {
        slot.appendChild(await importButton(buttonNode, warnings));
      } catch (error) {
        warnings.push(`"${buttonNode.content && buttonNode.content.fallback ? buttonNode.content.fallback : 'Button'}" could not be added to the Button Group: ${error.message}`);
      }
    }
    return true;
  }

  const existing = buttonContainerButtonChildren(instance);
  if (!existing.length) {
    warnings.push('Button Group has no editable child Button placeholders.');
    return false;
  }
  const count = Math.min(existing.length, buttonNodes.length);
  for (let index = 0; index < count; index += 1) {
    try {
      existing[index].visible = true;
    } catch {
      // Best-effort; applyButton may still work.
    }
    await applyButton(existing[index], buttonNodes[index], warnings);
  }
  for (let index = count; index < existing.length; index += 1) {
    try {
      existing[index].visible = false;
    } catch (error) {
      warnings.push(`Extra Button Group placeholder ${index + 1} could not be hidden: ${error.message}`);
    }
  }
  if (buttonNodes.length > existing.length) {
    warnings.push(`Button Group has ${existing.length} editable Button placeholder${existing.length === 1 ? '' : 's'}; ${buttonNodes.length - existing.length} selected action${buttonNodes.length - existing.length === 1 ? '' : 's'} could not be represented.`);
  }
  return count > 0;
}

async function convertSelectionToButtonContainer(selection, warnings) {
  const liveSelection = (selection || []).map(liveNode).filter(Boolean);
  if (liveSelection.length === 1 && closestA1ComponentAncestor(liveSelection[0], 'Button Container')) {
    warnings.push('The selected layer is already inside an A1 Button Group.');
    return null;
  }
  const contextWarnings = [];
  let context = conversionContext(selection, contextWarnings, 'Select buttons, text, or layers to convert to an A1 Button Group.');
  if (context) warnings.push(...contextWarnings);
  else context = directConversionContext(selection, warnings, 'Select buttons, text, or layers to convert to an A1 Button Group.');
  if (!context) return null;

  const buttonNodes = buttonContainerButtonNodesFromContext(context, warnings);
  const instance = await createComponentInstance('Button Container', warnings);
  placeConvertedNode(instance, context, warnings);
  setNodeToFillParentWidth(instance, 'Button Group', warnings);
  await applyButtonContainer(instance, { type: 'ButtonContainer', props: { align: 'start' }, children: [] }, warnings);
  const applied = await replaceButtonContainerChildrenForConversion(instance, buttonNodes, warnings);
  if (!applied) {
    try { instance.remove(); } catch { /* no-op */ }
    return null;
  }
  syncButtonContainerForWidth(instance, warnings);
  removeConvertedSource(context, warnings);
  return currentInstance(instance);
}

async function convertSelectionToSwitch(selection, warnings) {
  const liveSelection = (selection || []).map(liveNode).filter(Boolean);
  if (liveSelection.length === 1 && closestA1ComponentAncestor(liveSelection[0], 'Switch')) {
    warnings.push('The selected layer is already inside an A1 Switch.');
    return null;
  }
  const contextWarnings = [];
  let context = conversionContext(selection, contextWarnings, 'Select text or a layer to convert to an A1 Switch.');
  if (context) warnings.push(...contextWarnings);
  else context = directConversionContext(selection, warnings, 'Select text or a layer to convert to an A1 Switch.');
  if (!context) return null;
  const inferenceNodes = conversionInferenceNodes(context);
  const fallbackLabel = context.source && context.source.name ? context.source.name : 'Enable option';
  const label = selectionTextContent(inferenceNodes, fallbackLabel);
  if (label === fallbackLabel) warnings.push(`Switch label was inferred from the selected layer name "${fallbackLabel}" because no visible text or text property was found.`);
  const switchNode = await importSwitch({ type: 'Switch', props: { label } }, warnings);
  placeConvertedNode(switchNode, context, warnings, { resize: false });
  removeConvertedSource(context, warnings);
  return switchNode;
}

function conversionTextValues(nodes) {
  const values = [];
  for (const node of nodes || []) {
    for (const textNode of collectTextLayers(node)) {
      const value = textLayerPlainContent(textNode).replace(/\s+/g, ' ').trim();
      if (value) values.push(value);
    }
  }
  return values;
}

function uniqueOptionTexts(values) {
  const seen = new Set();
  const out = [];
  for (const value of values || []) {
    const label = String(value || '').trim();
    if (!label) continue;
    const key = label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(label);
  }
  return out;
}

function optionValueFromLabel(label, index) {
  const slug = String(label || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || `option-${index + 1}`;
}

function formConversionContext(selection, warnings, label) {
  const contextWarnings = [];
  let context = conversionContext(selection, contextWarnings, `Select text or a layer to convert to an A1 ${label}.`);
  if (context) warnings.push(...contextWarnings);
  else context = directConversionContext(selection, warnings, `Select text or a layer to convert to an A1 ${label}.`);
  return context;
}

function formTextParts(context, fallbackLabel) {
  const values = conversionTextValues(conversionInferenceNodes(context));
  const label = values[0] || fallbackLabel;
  return {
    values,
    label,
    value: values[1] || '',
    hint: values[2] || '',
  };
}

async function convertSelectionToFormField(selection, target, warnings) {
  const componentName = ADD_TARGET_COMPONENT_NAMES[target] || CONVERT_TARGET_LABELS[target] || 'form component';
  const liveSelection = (selection || []).map(liveNode).filter(Boolean);
  if (liveSelection.length === 1 && closestA1ComponentAncestor(liveSelection[0], componentName)) {
    warnings.push(`The selected layer is already inside an A1 ${componentName}.`);
    return null;
  }
  const context = formConversionContext(selection, warnings, componentName);
  if (!context) return null;
  const fallbackLabel = context.source && context.source.name ? context.source.name : componentName;
  const parts = formTextParts(context, fallbackLabel);
  if (parts.label === fallbackLabel) warnings.push(`${componentName} label was inferred from the selected layer name "${fallbackLabel}" because no visible text or text property was found.`);

  let node = null;
  if (target === 'text-field') {
    node = { type: 'TextField', props: { label: parts.label, ...(parts.value ? { defaultValue: parts.value } : {}), ...(parts.hint ? { hint: parts.hint } : {}), size: 'default' } };
  } else if (target === 'search-field') {
    node = { type: 'SearchField', props: { label: parts.label, ...(parts.value ? { defaultValue: parts.value } : {}), size: 'default' } };
  } else if (target === 'textarea') {
    node = { type: 'TextareaField', props: { label: parts.label, ...(parts.value ? { defaultValue: parts.value } : {}), ...(parts.hint ? { hint: parts.hint } : {}), size: 'default' } };
  } else if (target === 'select') {
    node = { type: 'SelectField', props: { label: parts.label, ...(parts.value ? { defaultValue: parts.value, showValue: true } : {}), ...(parts.hint ? { hint: parts.hint } : {}), size: 'default' } };
  }
  if (!node) return null;

  const instance = await renderImportedNode(node, warnings);
  placeConvertedNode(instance, context, warnings, { resize: false });
  setNodeToFillParentWidth(instance, componentName, warnings);
  removeConvertedSource(context, warnings);
  return instance;
}

async function convertSelectionToChoiceGroup(selection, target, warnings) {
  const componentName = target === 'radio-group' ? 'Radio Group' : 'Checkbox Group';
  const liveSelection = (selection || []).map(liveNode).filter(Boolean);
  if (liveSelection.length === 1 && closestA1ComponentAncestor(liveSelection[0], componentName)) {
    warnings.push(`The selected layer is already inside an A1 ${componentName}.`);
    return null;
  }
  const context = formConversionContext(selection, warnings, componentName);
  if (!context) return null;
  const fallbackLabel = context.source && context.source.name ? context.source.name : componentName;
  const values = uniqueOptionTexts(conversionTextValues(conversionInferenceNodes(context)));
  const useFirstAsLabel = values.length >= 3;
  const label = useFirstAsLabel ? values[0] : fallbackLabel;
  const optionLabels = (useFirstAsLabel ? values.slice(1) : values).slice(0, 20);
  while (optionLabels.length < 2) optionLabels.push(`Option ${optionLabels.length + 1}`);
  if (label === fallbackLabel && !useFirstAsLabel) warnings.push(`${componentName} label was inferred from the selected layer name "${fallbackLabel}". Select at least three text layers to infer a group label plus options.`);
  const options = optionLabels.map((optionLabel, index) => ({
    value: optionValueFromLabel(optionLabel, index),
    label: optionLabel,
  }));
  const type = target === 'radio-group' ? 'RadioGroup' : 'CheckboxGroup';
  const props = {
    label,
    options,
    size: 'default',
    defaultValue: target === 'radio-group' ? options[0].value : [options[0].value],
  };
  const instance = await renderImportedNode({ type, props }, warnings);
  placeConvertedNode(instance, context, warnings, { resize: false });
  setNodeToFillParentWidth(instance, componentName, warnings);
  removeConvertedSource(context, warnings);
  return instance;
}

async function convertSelectionToPagination(selection, warnings) {
  const liveSelection = (selection || []).map(liveNode).filter(Boolean);
  if (liveSelection.length === 1 && closestA1ComponentAncestor(liveSelection[0], 'Pagination')) {
    warnings.push('The selected layer is already inside an A1 Pagination component.');
    return null;
  }
  const contextWarnings = [];
  let context = conversionContext(selection, contextWarnings, 'Select a layer to convert to an A1 Pagination component.');
  if (context) warnings.push(...contextWarnings);
  else context = directConversionContext(selection, warnings, 'Select a layer to convert to an A1 Pagination component.');
  if (!context) return null;
  const pagination = await importPagination({ type: 'Pagination', props: { size: 'md' } }, warnings);
  placeConvertedNode(pagination, context, warnings, { resize: false });
  removeConvertedSource(context, warnings);
  return pagination;
}

function pageNavSectionsFromSelection(nodes) {
  const labels = uniqueOptionTexts(conversionTextValues(nodes)).slice(0, PAGE_NAV_MAX_SECTIONS);
  const usedValues = new Set();
  const sections = labels.map((label, index) => ({
    id: slugifyOptionValue(label, usedValues),
    label,
    level: index > 1 ? 2 : 1,
  }));
  if (sections.length) return sections;
  return [
    { id: 'overview', label: 'Overview', level: 1 },
    { id: 'getting-started', label: 'Getting started', level: 1 },
    { id: 'details', label: 'Details', level: 2 },
  ];
}

async function convertSelectionToPageNav(selection, warnings) {
  const liveSelection = (selection || []).map(liveNode).filter(Boolean);
  if (liveSelection.length === 1 && closestA1ComponentAncestor(liveSelection[0], 'Page Nav')) {
    warnings.push('The selected layer is already inside an A1 Page Nav component.');
    return null;
  }
  const contextWarnings = [];
  let context = conversionContext(selection, contextWarnings, 'Select one or more text layers to convert to A1 Page Nav.');
  if (context) warnings.push(...contextWarnings);
  else context = directConversionContext(selection, warnings, 'Select one or more text layers to convert to A1 Page Nav.');
  if (!context) return null;
  const values = uniqueOptionTexts(conversionTextValues(conversionInferenceNodes(context)));
  if (values.length > PAGE_NAV_MAX_SECTIONS) {
    warnings.push(`Page Nav supports ${PAGE_NAV_MAX_SECTIONS} Figma section rows; ${values.length - PAGE_NAV_MAX_SECTIONS} additional selected label(s) were not rendered.`);
  }
  if (!values.length) warnings.push('No visible text labels were found; default Page Nav sections were used.');
  const pageNav = await importPageNav({
    type: 'PageNav',
    props: {
      label: 'On this page',
      sections: pageNavSectionsFromSelection(conversionInferenceNodes(context)),
    },
  }, warnings);
  placeConvertedNode(pageNav, context, warnings, { resize: false });
  setNodeToFillParentWidth(pageNav, 'Page Nav', warnings);
  removeConvertedSource(context, warnings);
  return pageNav;
}

function treeMenuItemsFromSelection(nodes) {
  const entries = [];
  const usedLabels = new Set();
  const add = (label, bounds) => {
    const value = String(label || '').replace(/\s+/g, ' ').trim();
    if (!value || usedLabels.has(value.toLowerCase())) return;
    usedLabels.add(value.toLowerCase());
    entries.push({
      label: value.length > 72 ? value.slice(0, 69).trimEnd() + '…' : value,
      x: bounds && Number.isFinite(bounds.x) ? bounds.x : 0,
      y: bounds && Number.isFinite(bounds.y) ? bounds.y : entries.length,
    });
  };
  for (const node of nodes || []) {
    for (const textNode of collectTextLayers(node)) {
      const text = textLayerPlainContent(textNode).trim();
      if (!text) continue;
      const bounds = nodeBounds(textNode);
      for (const line of text.split(/\n+/)) add(line, bounds);
    }
  }
  if (!entries.length) {
    entries.push(
      { label: 'Overview', x: 0, y: 0 },
      { label: 'Details', x: 0, y: 1 },
      { label: 'Settings', x: 0, y: 2 },
    );
  }

  entries.sort((a, b) => Math.abs(a.y - b.y) < 4 ? a.x - b.x : a.y - b.y);
  const minX = Math.min(...entries.map((entry) => entry.x));
  const usedIds = new Set();
  const roots = [];
  const stack = [];
  for (const entry of entries.slice(0, TREE_MENU_MAX_ITEMS)) {
    const depth = Math.max(0, Math.min(4, Math.round((entry.x - minX) / 24)));
    const item = {
      id: slugifyOptionValue(entry.label, usedIds),
      label: entry.label,
    };
    while (stack.length > depth) stack.pop();
    if (stack.length === 0) roots.push(item);
    else {
      const parent = stack[stack.length - 1];
      parent.children = parent.children || [];
      parent.children.push(item);
    }
    stack[depth] = item;
  }
  return roots;
}

function treeMenuExpandedIds(items, out = []) {
  for (const item of items || []) {
    if (item && Array.isArray(item.children) && item.children.length) {
      out.push(item.id);
      treeMenuExpandedIds(item.children, out);
    }
  }
  return out;
}

async function convertSelectionToTreeMenu(selection, warnings) {
  const liveSelection = (selection || []).map(liveNode).filter(Boolean);
  if (liveSelection.length === 1 && closestA1ComponentAncestor(liveSelection[0], 'Tree Menu')) {
    warnings.push('The selected layer is already inside an A1 Tree Menu component.');
    return null;
  }
  const contextWarnings = [];
  let context = conversionContext(selection, contextWarnings, 'Select one or more text layers to convert to A1 Tree Menu.');
  if (context) warnings.push(...contextWarnings);
  else context = directConversionContext(selection, warnings, 'Select one or more text layers to convert to A1 Tree Menu.');
  if (!context) return null;

  const sourceNodes = conversionInferenceNodes(context);
  const textValues = uniqueOptionTexts(conversionTextValues(sourceNodes));
  if (textValues.length > TREE_MENU_MAX_ITEMS) {
    warnings.push(`Tree Menu supports ${TREE_MENU_MAX_ITEMS} Figma item rows; ${textValues.length - TREE_MENU_MAX_ITEMS} additional selected label(s) were not rendered.`);
  }
  if (!textValues.length) warnings.push('No visible text labels were found; default Tree Menu items were used.');
  const items = treeMenuItemsFromSelection(sourceNodes);
  const flatItems = flattenTreeMenuItems(items);
  const selectedId = flatItems[0]?.item?.id || '';
  const treeMenu = await importTreeMenu({
    type: 'TreeMenu',
    props: {
      variant: 'expanded',
      items,
      ...(selectedId ? { selectedId } : {}),
      expandedIds: treeMenuExpandedIds(items),
    },
  }, warnings);
  placeConvertedNode(treeMenu, context, warnings, { resize: false });
  setNodeToFillParentWidth(treeMenu, 'Tree Menu', warnings);
  removeConvertedSource(context, warnings);
  return treeMenu;
}

function tabLabelsFromSelection(nodes) {
  const labels = [];
  const used = new Set();
  const add = (value) => {
    const label = String(value || '').replace(/\s+/g, ' ').trim();
    if (!label || label.length > 32 || used.has(label.toLowerCase())) return;
    used.add(label.toLowerCase());
    labels.push(label);
  };
  for (const node of nodes || []) {
    for (const textNode of collectTextLayers(node)) {
      const value = typeof textNode.characters === 'string' ? textNode.characters : '';
      for (const line of value.split(/\n+/)) add(line);
    }
  }
  if (labels.length) return labels.slice(0, 12);
  add('Overview');
  add('Details');
  return labels.slice(0, 2);
}

async function convertSelectionToTabs(selection, warnings) {
  const liveSelection = (selection || []).map(liveNode).filter(Boolean);
  if (liveSelection.length === 1 && closestA1ComponentAncestor(liveSelection[0], 'Tabs')) {
    warnings.push('The selected layer is already inside an A1 Tabs component.');
    return null;
  }
  const contextWarnings = [];
  let context = conversionContext(selection, contextWarnings, 'Select one or more layers to convert to A1 Tabs.');
  if (context) warnings.push(...contextWarnings);
  else context = directConversionContext(selection, warnings, 'Select one or more layers to convert to A1 Tabs.');
  if (!context) return null;

  const usedValues = new Set();
  const items = tabLabelsFromSelection(conversionInferenceNodes(context)).map((label) => ({
    id: slugifyOptionValue(label, usedValues),
    label,
  }));
  const activeValue = items[0]?.id || 'overview';
  const tabs = await importTabs({
    type: 'Tabs',
    props: {
      items,
      value: activeValue,
    },
  }, warnings);
  placeConvertedNode(tabs, context, warnings, { resize: false });
  setNodeToFillParentWidth(tabs, 'Tabs', warnings);
  removeConvertedSource(context, warnings);
  return tabs;
}

function definitionListItemsFromSelection(nodes, fallbackLabel = 'Label') {
  const text = selectionTextContent(nodes, '');
  const lines = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const colonRows = lines
    .map((line) => {
      const match = line.match(/^([^:–—-]+)\s*[:–—-]\s*(.+)$/);
      return match ? { label: match[1].trim(), value: match[2].trim() } : null;
    })
    .filter(Boolean);
  if (colonRows.length) return colonRows;

  const values = [];
  for (const node of nodes || []) {
    for (const textNode of collectTextLayers(node)) {
      const value = typeof textNode.characters === 'string' ? textNode.characters.trim() : '';
      if (value) values.push(value);
    }
  }
  if (values.length >= 2) {
    const items = [];
    for (let index = 0; index < values.length; index += 2) {
      items.push({ label: values[index], value: values[index + 1] || '' });
    }
    return items;
  }
  if (text) return [{ label: fallbackLabel, value: text }];
  return [{ label: fallbackLabel, value: 'Value' }];
}

async function convertSelectionToDefinitionItem(selection, warnings) {
  const liveSelection = (selection || []).map(liveNode).filter(Boolean);
  if (liveSelection.length === 1 && closestA1ComponentAncestor(liveSelection[0], 'Definition List Item')) {
    warnings.push('The selected layer is already inside an A1 Definition List Item component.');
    return null;
  }
  const contextWarnings = [];
  let context = conversionContext(selection, contextWarnings, 'Select text or layers to convert to an A1 Definition List Item.');
  if (context) warnings.push(...contextWarnings);
  else context = directConversionContext(selection, warnings, 'Select text or layers to convert to an A1 Definition List Item.');
  if (!context) return null;
  const fallbackLabel = context.source && context.source.name ? context.source.name : 'Label';
  const item = definitionListItemsFromSelection(conversionInferenceNodes(context), fallbackLabel)[0] || { label: fallbackLabel, value: 'Value' };
  const definitionItem = await createDefinitionItem(item, 'row', 'md');
  placeConvertedNode(definitionItem, context, warnings, { resize: false });
  try {
    if (definitionItem.parent && ['HORIZONTAL', 'VERTICAL', 'GRID'].includes(definitionItem.parent.layoutMode)) {
      if (definitionItem.parent.layoutMode === 'VERTICAL') {
        definitionItem.layoutAlign = 'STRETCH';
        definitionItem.layoutSizingHorizontal = 'FILL';
      } else if (definitionItem.parent.layoutMode === 'HORIZONTAL') {
        definitionItem.layoutGrow = 1;
      } else {
        definitionItem.layoutSizingHorizontal = 'FILL';
      }
    }
  } catch (error) {
    warnings.push(`Converted Definition List Item could not be set to fill the parent width: ${error.message}`);
  }
  removeConvertedSource(context, warnings);
  return definitionItem;
}

async function convertSelectionToLink(selection, warnings) {
  const liveSelection = (selection || []).map(liveNode).filter(Boolean);
  if (liveSelection.length === 1 && closestA1ComponentAncestor(liveSelection[0], 'Link')) {
    warnings.push('The selected layer is already inside an A1 Link.');
    return null;
  }
  const contextWarnings = [];
  let context = conversionContext(selection, contextWarnings, 'Select text or a layer to convert to an A1 Link.');
  if (context) warnings.push(...contextWarnings);
  else context = directConversionContext(selection, warnings, 'Select text or a layer to convert to an A1 Link.');
  if (!context) return null;
  const label = selectionTextContent(context.contentNodes, context.source && context.source.name ? context.source.name : 'Link');
  const link = await importLink({ type: 'Link', props: { size: 'md', weight: 'normal' }, content: { fallback: label } }, warnings);
  placeConvertedNode(link, context, warnings, { resize: false });
  removeConvertedSource(context, warnings);
  return link;
}

async function convertSelectionToFigure(selection, warnings) {
  const context = conversionContext(selection, warnings, 'Select an image layer or a frame containing an image to convert to an A1 Figure.');
  if (!context) return null;
  const paintSource = firstImagePaintInSelection(context.contentNodes);
  if (!paintSource || !paintSource.paint) {
    warnings.push('No image fill was found in the selection. Convert to Figure was not applied.');
    return null;
  }
  const size = nearestFigureSize(context.bounds && context.bounds.width);
  const aspectRatio = nearestFigureAspectRatio(context.bounds && context.bounds.width, context.bounds && context.bounds.height);
  const caption = selectionTextContent(context.contentNodes, '');
  const figure = await importFigure({
    type: 'Figure',
    props: {
      src: '',
      alt: context.source && context.source.name ? context.source.name : 'Figure image',
      size,
      aspectRatio,
      ...(caption ? { caption } : {}),
    },
  }, warnings);
  const imageLayer = figureImageLayer(currentInstance(figure));
  if (imageLayer) {
    try {
      imageLayer.fills = [{ ...paintSource.paint, scaleMode: 'FILL' }];
    } catch (error) {
      warnings.push(`The selected image fill could not be moved into the Figure: ${error.message}`);
    }
  } else {
    warnings.push('The Figure Image layer was not found, so the selected image fill could not be applied.');
  }
  placeConvertedNode(figure, context, warnings);
  removeConvertedSource(context, warnings);
  return figure;
}

async function convertSelectionToPageLayout(selection, warnings) {
  const selected = topLevelSelectionNodes(selection);
  if (selected.length === 1 && selected[0].type === 'INSTANCE' && registeredSetName(selected[0]) === 'Page Layout') {
    warnings.push('The selected layer is already an A1 Page Layout.');
    return null;
  }
  const source = selected.length === 1 ? selected[0] : null;
  if (source && source.type === 'FRAME' && pageLayoutCandidateHeader(source)) {
    return convertFrameToPageLayout(source, warnings);
  }

  const context = conversionContext(selection, warnings, 'Select a frame or content to convert to an A1 Page Layout.');
  if (!context) return null;

  const header = context.contentNodes.find((node) => node.type === 'INSTANCE' && registeredSetName(node) === 'Top Header') || null;
  const contentChildren = context.contentNodes.filter((node) => node !== header);
  if (!contentChildren.length) {
    warnings.push('No page content was found to move into the Page Layout.');
    return null;
  }

  const pageLayout = await createComponentInstance('Page Layout', warnings);
  placeConvertedNode(pageLayout, context, warnings);
  const breakpoint = breakpointForWidth(context.bounds && context.bounds.width, 'md');
  const pageLayoutAssignments = {};
  queueComponentProperty(pageLayout, pageLayoutAssignments, 'Breakpoint', breakpoint, 'VARIANT', warnings, 'Page Layout breakpoint preview');
  applyQueuedProperties(pageLayout, pageLayoutAssignments, warnings, 'Page Layout properties');
  pageLayout.setPluginData(A1_BREAKPOINT_KEY, breakpoint);

  const nestedHeader = pageLayoutTopHeader(pageLayout);
  if (nestedHeader) {
    const headerAssignments = {};
    queueComponentProperty(nestedHeader, headerAssignments, 'Breakpoint', breakpoint, 'VARIANT', warnings, 'Top Header breakpoint preview');
    applyQueuedProperties(nestedHeader, headerAssignments, warnings, 'Top Header properties');
    if (header) {
      const exportedHeader = exportTopHeader(header);
      warnings.push(...exportedHeader.warnings);
      await applyTopHeader(nestedHeader, exportedHeader.node, warnings);
      const refreshedHeaderAssignments = {};
      queueComponentProperty(nestedHeader, refreshedHeaderAssignments, 'Breakpoint', breakpoint, 'VARIANT', warnings, 'Top Header breakpoint preview');
      applyQueuedProperties(nestedHeader, refreshedHeaderAssignments, warnings, 'Top Header properties');
    }
  } else {
    warnings.push('The Page Layout component has no nested Top Header instance, so header settings were not applied.');
  }

  let slot = pageLayoutContentSlot(pageLayout);
  if (!slot) {
    pageLayout.remove();
    warnings.push('The Page Content Slot was not found. The selected content was left unchanged.');
    return null;
  }
  for (const child of [...slot.children]) {
    try { child.remove(); } catch { try { child.visible = false; } catch { /* no-op */ } }
  }

  let moved = 0;
  for (const child of contentChildren) {
    slot = pageLayoutContentSlot(pageLayout);
    if (!slot) {
      warnings.push('Page Content Slot could not be refreshed; remaining content stayed in place.');
      break;
    }
    try {
      slot.appendChild(child);
      moved += 1;
    } catch (error) {
      warnings.push(`"${child.name}" could not be moved into the Page Content Slot: ${error.message}`);
    }
  }
  if (header) {
    try { header.remove(); } catch { try { header.visible = false; } catch { /* no-op */ } }
  }
  if (context.useSourceChildren) {
    try {
      if (context.source.children.length === 0) context.source.remove();
      else warnings.push('Some source frame content could not be moved, so the original frame was retained.');
    } catch {
      // Figma may normalize a group as its children move.
    }
  }
  if (moved === 0) {
    try { pageLayout.remove(); } catch { /* no-op */ }
    warnings.push('No selected content could be moved into the new A1 Page Layout.');
    return null;
  }
  return pageLayout;
}

async function convertFrameToPageLayout(source, warnings) {
  const parent = source.parent;
  if (!parent || !('children' in parent) || !('insertChild' in parent)) {
    warnings.push('The selected frame cannot be replaced with a Page Layout in its current parent.');
    return null;
  }
  const header = pageLayoutCandidateHeader(source);
  if (!header) {
    warnings.push('No Top Header instance was found inside the selected frame.');
    return null;
  }
  const contentChildren = pageLayoutCandidateContent(source, header);
  if (!contentChildren.length) {
    warnings.push('No page content was found to move into the Page Layout.');
    return null;
  }

  const sourceIndex = parent.children.indexOf(source);
  const pageLayout = await createComponentInstance('Page Layout', warnings);
  parent.insertChild(Math.max(0, sourceIndex), pageLayout);
  copyPageLayoutPlacement(source, pageLayout, parent, warnings);
  const breakpoint = breakpointForWidth(source.width);
  const pageLayoutAssignments = {};
  queueComponentProperty(pageLayout, pageLayoutAssignments, 'Breakpoint', breakpoint, 'VARIANT', warnings, 'Page Layout breakpoint preview');
  applyQueuedProperties(pageLayout, pageLayoutAssignments, warnings, 'Page Layout properties');
  pageLayout.setPluginData(A1_BREAKPOINT_KEY, breakpoint);

  const nestedHeader = pageLayoutTopHeader(pageLayout);
  if (nestedHeader) {
    const exportedHeader = exportTopHeader(header);
    warnings.push(...exportedHeader.warnings);
    await applyTopHeader(nestedHeader, exportedHeader.node, warnings);
    const headerAssignments = {};
    queueComponentProperty(nestedHeader, headerAssignments, 'Breakpoint', breakpoint, 'VARIANT', warnings, 'Top Header breakpoint preview');
    applyQueuedProperties(nestedHeader, headerAssignments, warnings, 'Top Header properties');
  } else {
    warnings.push('The Page Layout component has no nested Top Header instance, so header settings were not applied.');
  }

  let slot = pageLayoutContentSlot(pageLayout);
  if (!slot) {
    pageLayout.remove();
    warnings.push('The Page Content Slot was not found. The original frame was left unchanged.');
    return null;
  }
  for (const child of [...slot.children]) {
    try { child.remove(); } catch { try { child.visible = false; } catch { /* no-op */ } }
  }
  for (const child of contentChildren) {
    slot = pageLayoutContentSlot(pageLayout);
    if (!slot) {
      warnings.push('Page Content Slot could not be refreshed; remaining content stayed in the original frame.');
      break;
    }
    try {
      slot.appendChild(child);
    } catch (error) {
      warnings.push(`"${child.name}" could not be moved into the Page Content Slot: ${error.message}`);
    }
  }
  try {
    header.remove();
  } catch {
    try { header.visible = false; } catch { /* no-op */ }
  }

  if (source.children.length === 0) source.remove();
  else warnings.push('Some source content could not be moved, so the original frame was retained.');
  return pageLayout;
}

async function handleFixCard() {
  const selection = figma.currentPage.selection;
  const source = selection.length === 1 ? liveNode(selection[0]) : null;
  const suggestion = cardSuggestion(source);
  if (!source || !suggestion || suggestion.fixes.length === 0) {
    return postError('Select a padded white frame with content (and either a border or at least two child layers) to convert it to an A1 Card.');
  }
  const warnings = [];
  let card = null;
  try {
    card = await convertFrameToCard(source, warnings);
  } catch (error) {
    warnings.push(error.message);
  }
  if (!card) return postError(warnings.join('\n') || 'The selected frame could not be converted to an A1 Card.');
  figma.currentPage.selection = [card];
  figma.viewport.scrollAndZoomIntoView([card]);
  figma.notify('Converted the selected frame to an A1 Card.');
  postPluginMessage({
    type: 'card-fix-result',
    warnings,
    message: 'Converted the selected frame to an A1 Card and moved its content into the Card Content Slot.',
  });
  scheduleAutoExport();
}

async function handleFixPageLayout() {
  const selection = figma.currentPage.selection;
  const source = selection.length === 1 ? liveNode(selection[0]) : null;
  const suggestion = pageLayoutSuggestion(source);
  if (!source || !suggestion || suggestion.fixes.length === 0) {
    postPluginMessage({
      type: 'page-layout-fix-result',
      warnings: [],
      message: 'No Page Layout AutoFix was applied. Select a plain frame that contains a Top Header instance and page content.',
    });
    return;
  }
  const warnings = [];
  let pageLayout = null;
  try {
    pageLayout = await convertFrameToPageLayout(source, warnings);
  } catch (error) {
    warnings.push(error.message);
  }
  if (!pageLayout) {
    postPluginMessage({
      type: 'page-layout-fix-result',
      warnings,
      message: warnings.join('\n') || 'The selected frame could not be converted to an A1 Page Layout.',
    });
    return;
  }
  figma.currentPage.selection = [pageLayout];
  figma.viewport.scrollAndZoomIntoView([pageLayout]);
  figma.notify('Converted the selected frame to an A1 Page Layout.');
  postPluginMessage({
    type: 'page-layout-fix-result',
    warnings,
    message: 'Converted the selected frame to an A1 Page Layout and moved its content into the Page Content Slot.',
  });
  scheduleAutoExport();
}

async function handleConvertToSection() {
  await handleConvertTo('section', 'section-convert-result');
}

async function handleConvertTo(target, resultType = 'convert-result', options = {}) {
  const normalized = typeof target === 'string' ? target.toLowerCase() : '';
  const warnings = [];
  const selection = prepareSelectionForConversion(figma.currentPage.selection, normalized, warnings);
  let affected = [];
  let message = '';
  try {
    if (normalized === 'page-layout') {
      const pageLayout = await convertSelectionToPageLayout(selection, warnings);
      if (pageLayout) {
        affected = [pageLayout];
        message = 'Converted the selection to an A1 Page Layout and moved page content into the Page Content Slot.';
      }
    } else if (normalized === 'section') {
      const section = await convertSelectionToSection(selection, warnings);
      if (section) {
        affected = [section];
        message = 'Converted the selection to an A1 Section, inferred contentWidth, and moved the content into the Section Content Slot.';
      }
    } else if (normalized === 'card') {
      const card = await convertSelectionToCard(selection, warnings);
      if (card) {
        affected = [card];
        message = 'Converted the selection to an A1 Card and moved the content into the Card Content Slot.';
      }
    } else if (normalized === 'stack') {
      const stack = await convertSelectionToStack(selection, warnings);
      if (stack) {
        affected = [stack];
        message = 'Converted the selection to an A1 Stack.';
      }
    } else if (normalized === 'grid') {
      const grid = await convertSelectionToGrid(selection, warnings, options);
      if (grid) {
        affected = [grid];
        message = 'Converted the selection to an A1 Grid.';
      }
    } else if (normalized === 'heading' || normalized === 'body') {
      affected = await convertSelectionToText(selection, normalized, warnings);
      if (affected.length) {
        message = normalized === 'heading'
          ? `Converted ${affected.length} text ${affected.length === 1 ? 'layer' : 'layers'} to A1 Heading and set text to Fill where supported.`
          : `Converted ${affected.length} text ${affected.length === 1 ? 'layer' : 'layers'} to A1 Body and set text to Fill where supported.`;
      }
    } else if (normalized === 'button') {
      const button = await convertSelectionToButton(selection, warnings);
      if (button) {
        affected = [button];
        message = 'Converted the selection to an A1 Button.';
      }
    } else if (normalized === 'button-container') {
      const buttonContainer = await convertSelectionToButtonContainer(selection, warnings);
      if (buttonContainer) {
        affected = [buttonContainer];
        message = 'Converted the selection to an A1 Button Group.';
      }
    } else if (['text-field', 'search-field', 'textarea', 'select'].includes(normalized)) {
      const field = await convertSelectionToFormField(selection, normalized, warnings);
      if (field) {
        affected = [field];
        message = `Converted the selection to an A1 ${CONVERT_TARGET_LABELS[normalized]}.`;
      }
    } else if (normalized === 'switch') {
      const switchNode = await convertSelectionToSwitch(selection, warnings);
      if (switchNode) {
        affected = [switchNode];
        message = 'Converted the selection to an A1 Switch.';
      }
    } else if (normalized === 'radio-group' || normalized === 'checkbox-group') {
      const group = await convertSelectionToChoiceGroup(selection, normalized, warnings);
      if (group) {
        affected = [group];
        message = `Converted the selection to an A1 ${CONVERT_TARGET_LABELS[normalized]}.`;
      }
    } else if (normalized === 'page-nav') {
      const pageNav = await convertSelectionToPageNav(selection, warnings);
      if (pageNav) {
        affected = [pageNav];
        message = 'Converted the selected text to an A1 Page Nav.';
      }
    } else if (normalized === 'tree-menu') {
      const treeMenu = await convertSelectionToTreeMenu(selection, warnings);
      if (treeMenu) {
        affected = [treeMenu];
        message = 'Converted the selected text to an A1 Tree Menu.';
      }
    } else if (normalized === 'pagination') {
      const pagination = await convertSelectionToPagination(selection, warnings);
      if (pagination) {
        affected = [pagination];
        message = 'Converted the selection to an A1 Pagination component.';
      }
    } else if (normalized === 'tabs') {
      const tabs = await convertSelectionToTabs(selection, warnings);
      if (tabs) {
        affected = [tabs];
        message = 'Converted the selected text to A1 Tabs and created Tab items in the Tabs slot.';
      }
    } else if (normalized === 'definition-item' || normalized === 'definition-list') {
      const definitionItem = await convertSelectionToDefinitionItem(selection, warnings);
      if (definitionItem) {
        affected = [definitionItem];
        message = 'Converted the selection to an A1 Definition List Item.';
      }
    } else if (normalized === 'link') {
      const link = await convertSelectionToLink(selection, warnings);
      if (link) {
        affected = [link];
        message = 'Converted the selection to an A1 Link.';
      }
    } else if (normalized === 'figure') {
      const figure = await convertSelectionToFigure(selection, warnings);
      if (figure) {
        affected = [figure];
        message = 'Converted the selection to an A1 Figure.';
      }
    } else {
      warnings.push('Choose a supported conversion target: Page Layout, Section, Card, Stack, Grid, Heading, Body, Button, Button Container, Text Field, Search Field, Textarea, Select, Switch, Radio Group, Checkbox Group, Page Nav, Tree Menu, Pagination, Tabs, Definition Item, Link, or Figure.');
    }
  } catch (error) {
    warnings.push(error.message);
  }

  if (!affected.length) {
    postPluginMessage({
      type: resultType,
      warnings,
      message: warnings.join('\n') || 'No conversion was applied.',
    });
    return;
  }

  figma.currentPage.selection = affected;
  figma.viewport.scrollAndZoomIntoView(affected);
  figma.notify(message);
  postPluginMessage({ type: resultType, warnings, message });
  postSelectionState();
  scheduleAutoExport();
}

const CONVERT_TARGET_LABELS = {
  'page-layout': 'Page Layout',
  'top-header': 'Top Header',
  section: 'Section',
  card: 'Card',
  stack: 'Stack',
  grid: 'Grid',
  heading: 'Heading',
  body: 'Body',
  button: 'Button',
  'icon-button': 'Icon Button',
  'button-container': 'Button Container',
  switch: 'Switch',
  pagination: 'Pagination',
  'definition-item': 'Definition List Item',
  'definition-list': 'Definition List',
  chip: 'Chip',
  'chip-group': 'Chip Group',
  link: 'Link',
  figure: 'Figure',
  banner: 'Banner',
  badge: 'Badge',
  blockquote: 'Blockquote',
  'empty-state': 'Empty State',
  'text-field': 'Text Field',
  'search-field': 'Search Field',
  textarea: 'Textarea',
  select: 'Select',
  'radio-group': 'Radio Group',
  'checkbox-group': 'Checkbox Group',
  'page-nav': 'Page Nav',
  'tree-menu': 'Tree Menu',
  'segmented-control': 'Segmented Control',
  tabs: 'Tabs',
  accordion: 'Accordion',
  tooltip: 'Tooltip',
  divider: 'Divider',
  menu: 'Menu',
  dialog: 'Dialog',
};

const ADD_TARGET_DEFAULT_TEMPLATES = {
  'page-layout': {
    id: '$id',
    type: 'PageLayout',
    props: { showHeader: true, showSidebar: false, showFooter: false },
    children: [
      { id: '$id-section', type: 'Section', props: { surface: 'page', padding: 'lg', contentWidth: 'lg', gap: 'md' }, children: [
        { id: '$id-heading', type: 'Heading', props: { as: 'h1', type: 'display', size: 'md' }, content: { fallback: 'Page title' } },
        { id: '$id-body', type: 'Paragraph', props: { size: 'md', color: 'muted' }, content: { fallback: 'Page supporting text.' } },
      ] },
    ],
  },
  'top-header': {
    id: '$id',
    type: 'TopHeader',
    props: {
      logoText: 'A1:Figma',
      navItems: [{ id: 'overview', label: 'Overview', icon: 'dashboard', active: true }],
      actions: [{ id: 'settings', label: 'Settings', icon: 'settings' }],
      loginButton: { label: 'Sign in' },
    },
  },
  section: {
    id: '$id',
    type: 'Section',
    props: { surface: 'page', padding: 'lg', contentWidth: 'lg', gap: 'lg' },
    children: [
      { id: '$id-heading', type: 'Heading', props: { as: 'h2', type: 'heading', size: 'md' }, content: { fallback: 'Section heading' } },
      { id: '$id-body', type: 'Paragraph', props: { size: 'md', color: 'muted' }, content: { fallback: 'Section body text.' } },
    ],
  },
  card: {
    id: '$id',
    type: 'Card',
    props: { icon: 'star' },
    children: [
      { id: '$id-heading', type: 'Heading', props: { as: 'h2', type: 'heading', size: 'md' }, content: { fallback: 'Card title' } },
      { id: '$id-body', type: 'Paragraph', props: { size: 'md', color: 'muted' }, content: { fallback: 'Card supporting text.' } },
    ],
  },
  stack: {
    id: '$id',
    type: 'Stack',
    props: { direction: 'column', gap: 'md', align: 'stretch' },
    children: [
      { id: '$id-body', type: 'Paragraph', props: { size: 'md' }, content: { fallback: 'Stack content' } },
    ],
  },
  heading: { id: '$id', type: 'Heading', props: { as: 'h2', type: 'heading', size: 'md' }, content: { fallback: 'Add a heading' } },
  body: { id: '$id', type: 'Paragraph', props: { size: 'md' }, content: { fallback: 'Add body text.' } },
  button: { id: '$id', type: 'Button', props: { variant: 'secondary', size: 'md' }, content: { fallback: 'Button' } },
  icon: { id: '$id', type: 'Icon', props: { name: 'star', size: 'lg' } },
  'icon-button': { id: '$id', type: 'IconButton', props: { icon: 'settings', label: 'Settings', variant: 'secondary', size: 'md' } },
  'button-container': {
    id: '$id',
    type: 'ButtonContainer',
    props: { align: 'start' },
    children: [
      { id: '$id-primary', type: 'Button', props: { variant: 'primary', size: 'md' }, content: { fallback: 'Primary' } },
      { id: '$id-secondary', type: 'Button', props: { variant: 'secondary', size: 'md' }, content: { fallback: 'Secondary' } },
    ],
  },
  switch: { id: '$id', type: 'Switch', props: { label: 'Enable setting', size: 'comfortable' } },
  pagination: { id: '$id', type: 'Pagination', props: { page: 1, totalPages: 5, size: 'sm' } },
  'page-nav': {
    id: '$id',
    type: 'PageNav',
    props: {
      label: 'On this page',
      sections: [
        { id: 'overview', label: 'Overview', level: 1 },
        { id: 'getting-started', label: 'Getting started', level: 1 },
        { id: 'installation', label: 'Installation', level: 2 },
        { id: 'configuration', label: 'Configuration', level: 2 },
        { id: 'api-reference', label: 'API reference', level: 1 },
      ],
    },
  },
  'tree-menu': {
    id: '$id',
    type: 'TreeMenu',
    props: {
      variant: 'expanded',
      selectedId: 'invoices',
      expandedIds: ['account', 'billing'],
      showExpandControls: false,
      draggable: false,
      items: [
        {
          id: 'account',
          label: 'Account',
          icon: 'manage_accounts',
          children: [
            { id: 'profile', label: 'Profile', icon: 'person' },
            { id: 'security', label: 'Security', icon: 'lock' },
            {
              id: 'billing',
              label: 'Billing',
              icon: 'credit_card',
              children: [
                { id: 'invoices', label: 'Invoices', icon: 'receipt_long' },
                { id: 'payment', label: 'Payment methods', icon: 'payment' },
              ],
            },
          ],
        },
        { id: 'notifications', label: 'Notifications', icon: 'notifications' },
        { id: 'integrations', label: 'Integrations', icon: 'extension' },
      ],
    },
  },
  link: { id: '$id', type: 'Link', props: { size: 'md', href: '#' }, content: { fallback: 'Add a link' } },
  breadcrumb: {
    id: '$id',
    type: 'Breadcrumb',
    props: {
      backLabel: 'Back',
      items: [
        { id: 'home', label: 'Home', href: '/' },
        { id: 'section', label: 'Section', href: '#' },
        { id: 'current', label: 'Current page' },
      ],
    },
  },
  code: {
    id: '$id',
    type: 'Code',
    props: { variant: 'block', wrapping: true, copyCode: false },
    content: { fallback: "import { Button } from '@gtivr4/a1-design-system-react'\n\n<Button>Continue</Button>" },
  },
  inline: {
    id: '$id',
    type: 'Inline',
    props: { inlineElement: 'all' },
    content: { fallback: 'Example paragraph with **strong** text, `code`, and [kbd:⌘K].' },
  },
  banner: {
    id: '$id',
    type: 'Banner',
    props: { status: 'info', title: 'Banner title' },
    children: [
      { id: '$id-body', type: 'Paragraph', props: { size: 'sm', color: 'muted' }, content: { fallback: 'Banner supporting text.' } },
    ],
  },
  badge: { id: '$id', type: 'MessageBadge', props: { status: 'info', size: 'md', icon: 'info' }, content: { fallback: 'Badge' } },
  blockquote: { id: '$id', type: 'Blockquote', props: { variant: 'border', cite: 'Citation' }, content: { fallback: 'Add a quote' } },
  'definition-list': {
    id: '$id',
    type: 'DefinitionList',
    props: {
      direction: 'row',
      size: 'md',
      items: [
        { id: '$id-one', label: 'Label', value: 'Value' },
        { id: '$id-two', label: 'Another label', value: 'Another value' },
      ],
    },
  },
  'data-table': {
    id: '$id',
    type: 'DataTable',
    props: {
      zebra: true,
      columns: [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'status', label: 'Status' },
        { key: 'updated', label: 'Updated' },
      ],
      rows: [
        { id: '$id-row-1', name: 'Ada Lovelace', status: 'Active', updated: 'Today' },
        { id: '$id-row-2', name: 'Grace Hopper', status: 'Pending', updated: 'Yesterday' },
        { id: '$id-row-3', name: 'Katherine Johnson', status: 'Complete', updated: 'Jul 15' },
      ],
    },
  },
  chip: { id: '$id', type: 'ChipGroup', props: { size: 'md', behavior: 'multiple', items: [{ id: 'chip', title: 'Chip' }] } },
  'chip-group': { id: '$id', type: 'ChipGroup', props: { size: 'md', behavior: 'multiple', items: [{ id: 'chip', title: 'Chip' }] } },
  'empty-state': { id: '$id', type: 'MessageEmptyState', props: { scale: 'section', icon: 'inventory_2', title: 'Empty state', description: 'Add a helpful empty-state description.' } },
  'text-field': { id: '$id', type: 'TextField', props: { label: 'Text field', hint: 'Supporting text', defaultValue: 'Value', size: 'default' } },
  'search-field': { id: '$id', type: 'SearchField', props: { label: 'Search', defaultValue: 'Search query', size: 'default' } },
  textarea: { id: '$id', type: 'TextareaField', props: { label: 'Textarea', hint: 'Supporting text', defaultValue: 'Textarea value', showCount: true, maxLength: 120, size: 'default' } },
  select: { id: '$id', type: 'SelectField', props: { label: 'Select option', hint: 'Choose one option.', showValue: true, defaultValue: 'Selected value', size: 'default' } },
  'radio-group': {
    id: '$id',
    type: 'RadioGroup',
    props: {
      label: 'Radio group',
      defaultValue: 'one',
      options: [
        { value: 'one', label: 'Option one' },
        { value: 'two', label: 'Option two' },
      ],
    },
  },
  'checkbox-group': {
    id: '$id',
    type: 'CheckboxGroup',
    props: {
      label: 'Checkbox group',
      defaultValue: ['one'],
      options: [
        { value: 'one', label: 'Option one' },
        { value: 'two', label: 'Option two' },
      ],
    },
  },
  'choice-group': {
    id: '$id',
    type: 'ChoiceGroup',
    props: {
      label: 'Choice group',
      columns: { xs: 1, md: 3 },
      defaultValue: 'one',
      options: [
        { value: 'one', label: 'Option one', subtext: 'Supporting text' },
        { value: 'two', label: 'Option two', subtext: 'Supporting text' },
        { value: 'three', label: 'Option three', subtext: 'Supporting text' },
      ],
    },
  },
  'segmented-control': {
    id: '$id',
    type: 'SegmentedControl',
    props: {
      size: 'md',
      value: 'one',
      options: [
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' },
      ],
    },
  },
  tabs: {
    id: '$id',
    type: 'Tabs',
    props: {
      items: [
        { id: 'overview', label: 'Overview' },
        { id: 'details', label: 'Details' },
      ],
      value: 'overview',
    },
    children: [
      { id: '$id-panel', type: 'Paragraph', props: { size: 'sm', color: 'muted' }, content: { fallback: 'Active tab panel content.' } },
    ],
  },
  accordion: {
    id: '$id',
    type: 'Accordion',
    props: { label: 'Accordion item', subtext: 'Optional subtext', defaultOpen: true, size: 'md' },
    children: [
      { id: '$id-body', type: 'Paragraph', props: { size: 'sm', color: 'muted' }, content: { fallback: 'Accordion content.' } },
    ],
  },
  tooltip: { id: '$id', type: 'Tooltip', props: { content: 'Tooltip content', placement: 'top' } },
  divider: { id: '$id', type: 'Divider', props: { variant: 'subtle', lineStyle: 'solid', size: 'xs' } },
  menu: {
    id: '$id',
    type: 'Menu',
    props: {
      items: [
        { id: 'open', label: 'Open', icon: 'open_in_new' },
        { id: 'sync', label: 'Sync', icon: 'sync', active: true },
        { id: 'divider', kind: 'divider' },
        { id: 'delete', label: 'Delete', icon: 'delete', destructive: true },
      ],
    },
  },
  dialog: {
    id: '$id',
    type: 'Dialog',
    props: {
      title: 'Dialog title',
      body: 'Dialog body text.',
      size: 'md',
      status: 'none',
      footerActions: [
        { id: '$id-cancel', type: 'Button', props: { variant: 'secondary', size: 'md' }, content: { fallback: 'Cancel' } },
        { id: '$id-confirm', type: 'Button', props: { variant: 'primary', size: 'md' }, content: { fallback: 'Confirm' } },
      ],
    },
  },
  figure: {
    id: '$id',
    type: 'Figure',
    props: {
      alt: 'Placeholder image',
      size: 'md',
      aspectRatio: '16:9',
      caption: 'Figure caption',
    },
  },
};

const ADD_TARGET_DEFAULT_FACTORIES = {
  grid(id, options) {
    const responsiveColumns = normalizeResponsiveColumns(options.responsiveColumns);
    return {
      id,
      type: 'Grid',
      props: { columns: responsiveColumns || 2, gap: 'md', alignItems: 'stretch' },
      children: [
        { id: `${id}-one`, type: 'Card', children: [{ id: `${id}-one-body`, type: 'Paragraph', props: { size: 'sm' }, content: { fallback: 'Grid item' } }] },
        { id: `${id}-two`, type: 'Card', children: [{ id: `${id}-two-body`, type: 'Paragraph', props: { size: 'sm' }, content: { fallback: 'Grid item' } }] },
      ],
    };
  },
};

function defaultNodeForAddTarget(target, options = {}) {
  const normalized = typeof target === 'string' ? target.toLowerCase() : '';
  const id = `${normalized || 'component'}-${Date.now()}`;
  const factory = ADD_TARGET_DEFAULT_FACTORIES[normalized];
  if (factory) return factory(id, options || {});
  const template = ADD_TARGET_DEFAULT_TEMPLATES[normalized];
  return template ? addDefaultTemplateWithId(template, id) : null;
}

function addInsertionContext(selection) {
  const selected = topLevelSelectionNodes(selection);
  if (selected.length === 1) {
    const container = addableContainerForSelection(selected[0]);
    if (container) {
      return {
        parent: container,
        index: container.children.length,
        bounds: null,
        inside: true
      };
    }
  }
  const parent = commonParent(selected);
  const bounds = selectionBoundsInParent(selected);
  if (parent && 'children' in parent && 'insertChild' in parent) {
    const indexes = selected
      .map((node) => parent.children.indexOf(node))
      .filter((index) => index >= 0);
    return {
      parent,
      index: indexes.length ? Math.max(...indexes) + 1 : parent.children.length,
      bounds
    };
  }
  return {
    parent: figma.currentPage,
    index: figma.currentPage.children.length,
    bounds: null
  };
}

function addableContainerForSelection(node) {
  const current = liveNode(node);
  if (!current || !('children' in current)) return null;
  if (current.type === 'INSTANCE') {
    return pageLayoutContentSlot(current)
      || sectionContentContainer(current)
      || namedSlot(current, 'Content Slot')
      || nativeSlot(current, 'Content Slot')
      || null;
  }
  if (current.type === 'SLOT') return current;
  if (['FRAME', 'GROUP', 'SECTION'].includes(current.type) && 'insertChild' in current) return current;
  return null;
}

function placeAddedNode(node, context, warnings) {
  const parent = context && context.parent ? context.parent : figma.currentPage;
  const index = context && Number.isInteger(context.index) ? context.index : parent.children.length;
  try {
    if ('insertChild' in parent) parent.insertChild(Math.max(0, Math.min(index, parent.children.length)), node);
    else parent.appendChild(node);
  } catch (error) {
    warnings.push(`Added component could not be inserted near the selection: ${error.message}`);
    figma.currentPage.appendChild(node);
  }

  if (parent.type === 'PAGE' || !parent.layoutMode || parent.layoutMode === 'NONE') {
    const bounds = context && context.bounds;
    try {
      if (context && context.inside) {
        node.x = 24;
        node.y = 24;
      } else {
        node.x = bounds ? bounds.x + bounds.width + 24 : Math.round(figma.viewport.center.x);
        node.y = bounds ? bounds.y : Math.round(figma.viewport.center.y);
      }
    } catch (error) {
      warnings.push(`Added component position could not be adjusted: ${error.message}`);
    }
  } else if (parent.layoutMode === 'VERTICAL') {
    try {
      node.layoutAlign = 'STRETCH';
      node.layoutSizingHorizontal = 'FILL';
    } catch {
      // Some inserted instances do not expose fill sizing; keep their default.
    }
  } else if (parent.layoutMode === 'HORIZONTAL') {
    try {
      node.layoutGrow = 1;
    } catch {
      // Some inserted instances do not expose grow; keep their default.
    }
  } else if (parent.layoutMode === 'GRID') {
    try {
      node.layoutSizingHorizontal = 'FILL';
    } catch {
      // Some inserted instances do not expose fill sizing; keep their default.
    }
  }
}

const ADD_TARGET_COMPONENT_NAMES = {
  'page-layout': 'Page Layout',
  'top-header': 'Top Header',
  section: 'Section',
  card: 'Card',
  button: 'Button',
  'icon-button': 'Icon Button',
  link: 'Link',
  breadcrumb: 'Breadcrumb',
  banner: 'Banner',
  badge: 'Badge',
  chip: 'Chip',
  'chip-group': 'Chip Group',
  blockquote: 'Blockquote',
  code: 'Code',
  inline: 'Inline',
  'data-table': 'Data Table',
  'definition-list': 'Definition List',
  'empty-state': 'Empty State',
  'text-field': 'Text Field',
  'search-field': 'Search Field',
  textarea: 'Textarea',
  select: 'Select',
  switch: 'Switch',
  'radio-group': 'Radio Group',
  'checkbox-group': 'Checkbox Group',
  'choice-group': 'Choice Group',
  'page-nav': 'Page Nav',
  'tree-menu': 'Tree Menu',
  'button-container': 'Button Container',
  'segmented-control': 'Segmented Control',
  tabs: 'Tabs',
  pagination: 'Pagination',
  menu: 'Menu',
  tooltip: 'Tooltip',
  accordion: 'Accordion',
  dialog: 'Dialog',
  figure: 'Figure',
  divider: 'Divider',
};

async function applyStarterPropsToAddedInstance(target, instance, node, warnings) {
  if (target === 'page-layout') return applyPageLayout(instance, { ...node, children: [] }, warnings);
  if (target === 'top-header') return applyTopHeader(instance, node, warnings);
  if (target === 'section') return applySection(instance, { ...node, children: [] }, warnings);
  if (target === 'card') return applyCard(instance, { ...node, children: [] }, warnings);
  if (target === 'button') return applyButton(instance, node, warnings);
  if (target === 'icon-button') return applyIconButton(instance, node, warnings);
  if (target === 'link') return applyLink(instance, node, warnings);
  if (target === 'breadcrumb') return applyBreadcrumb(instance, node, warnings);
  if (target === 'banner') return applyBanner(instance, { ...node, children: [] }, warnings);
  if (target === 'badge') return applyBadge(instance, node, warnings);
  if (target === 'chip') return applyChip(instance, node, warnings);
  if (target === 'chip-group') return applyChipGroup(instance, node, warnings);
  if (target === 'bottom-sheet') return applyBottomSheet(instance, node, warnings);
  if (target === 'blockquote') return applyBlockquote(instance, node, warnings);
  if (target === 'code') return applyCode(instance, node, warnings);
  if (target === 'inline') return applyInline(instance, node, warnings);
  if (target === 'data-table') return applyDataTable(instance, node, warnings);
  if (target === 'definition-list') return applyDefinitionList(instance, node, warnings);
  if (target === 'empty-state') return applyEmptyState(instance, node, warnings);
  if (target === 'text-field') return applyTextField(instance, node, warnings);
  if (target === 'search-field') return applySearchField(instance, node, warnings);
  if (target === 'textarea') return applyTextarea(instance, node, warnings);
  if (target === 'select') return applySelect(instance, node, warnings);
  if (target === 'switch') return applySwitch(instance, node, warnings);
  if (target === 'radio-group') return applyRadioGroup(instance, node, warnings);
  if (target === 'checkbox-group') return applyCheckboxGroup(instance, node, warnings);
  if (target === 'choice-group') return applyChoiceGroup(instance, node, warnings);
  if (target === 'page-nav') return applyPageNav(instance, node, warnings);
  if (target === 'tree-menu') return applyTreeMenu(instance, node, warnings);
  if (target === 'button-container') return applyButtonContainer(instance, { ...node, children: [] }, warnings);
  if (target === 'segmented-control') return applySegmentedControl(instance, node, warnings);
  if (target === 'tabs') return applyTabs(instance, { ...node, children: [] }, warnings);
  if (target === 'pagination') return applyPagination(instance, node, warnings);
  if (target === 'menu') return applyMenu(instance, node, warnings);
  if (target === 'tooltip') return applyTooltip(instance, node, warnings);
  if (target === 'accordion') return applyAccordion(instance, { ...node, children: [] }, warnings);
  if (target === 'dialog') return applyDialog(instance, node, warnings);
  if (target === 'figure') return applyFigure(instance, node, warnings);
  if (target === 'divider') return applyDivider(instance, node, warnings);
  return undefined;
}

async function addComponentFromPackage(target, options, warnings) {
  const node = defaultNodeForAddTarget(target, options);
  if (!node) return null;
  if (target === 'heading' || target === 'body') return importTextNode(node, warnings);
  if (target === 'icon' || target === 'stack' || target === 'grid') return renderImportedNode(node, warnings);
  const componentName = ADD_TARGET_COMPONENT_NAMES[target];
  if (!componentName) return null;
  const instance = await createComponentInstance(componentName, warnings);
  await applyStarterPropsToAddedInstance(target, instance, node, warnings);
  if (typeof node.id === 'string') {
    instance.name = node.id;
    instance.setPluginData('a1-json-id', node.id);
  }
  return instance;
}

async function handleAddComponent(target, options = {}) {
  const normalized = typeof target === 'string' ? target.toLowerCase() : '';
  const warnings = [];
  let added = null;
  try {
    if (normalized === 'definition-item') {
      added = await createDefinitionItem({ label: 'Label', value: 'Value' }, 'row', 'md');
      added.name = 'Definition List Item';
    } else {
      added = await addComponentFromPackage(normalized, options, warnings);
      if (!added) warnings.push('Choose a supported Add target from the Build quick-add component list.');
    }
  } catch (error) {
    warnings.push(`Add failed before placement: ${error.message}`);
  }

  if (!added) {
    postPluginMessage({
      type: 'add-component-result',
      warnings,
      message: warnings.join('\n') || 'No component was added.'
    });
    return;
  }

  const context = addInsertionContext(figma.currentPage.selection);
  placeAddedNode(added, context, warnings);
  if (normalized === 'card') setNodeToFillParentWidth(added, 'Card', warnings);
  figma.currentPage.selection = [added];
  figma.viewport.scrollAndZoomIntoView([added]);
  const label = ADD_TARGET_COMPONENT_NAMES[normalized] || CONVERT_TARGET_LABELS[normalized] || 'component';
  const message = `Added an A1 ${label}.`;
  figma.notify(message);
  postPluginMessage({ type: 'add-component-result', warnings, message });
  scheduleAutoExport();
}

function contextualGridBreakpoint(grid, explicitPrimary) {
  if (A1_BREAKPOINTS.includes(explicitPrimary)) return explicitPrimary;
  // A selected Grid inside a rendered breakpoint preview can carry stale local
  // plugin metadata from an earlier edit. Prefer the surrounding preview/root
  // breakpoint so changing `{ md: 3 }` updates the md preview, `{ xl: 4 }`
  // updates the xl preview, etc.
  for (let current = grid && grid.parent; current; current = current.parent) {
    const breakpoint = readBreakpointData(current);
    if (breakpoint) return breakpoint;
  }
  return readBreakpointData(grid) || breakpointForWidth(grid && grid.width, 'md');
}

function handleApplyGridBreakpoints(options = {}) {
  const warnings = [];
  const responsiveColumns = normalizeResponsiveColumns(options.responsiveColumns);
  if (!responsiveColumns) {
    postPluginMessage({ type: 'grid-breakpoints-result', count: 0, warnings: ['Choose at least one responsive Grid column value.'] });
    return;
  }

  const selected = topLevelSelectionNodes(figma.currentPage.selection);
  const grids = [];
  if (typeof options.gridNodeId === 'string' && options.gridNodeId) {
    try {
      const explicitGrid = liveNode(resolveNodeById(options.gridNodeId));
      if (isGridFrame(explicitGrid)) grids.push(explicitGrid);
    } catch {
      // Fall back to the current selection below.
    }
  }
  for (const node of selected) {
    if (isGridFrame(node)) {
      grids.push(node);
      continue;
    }
    try {
      grids.push(...node.findAll((child) => isGridFrame(child)));
    } catch {
      // Non-container selections are ignored.
    }
  }
  const unique = Array.from(new Map(grids.map((grid) => [grid.id, grid])).values());
  if (!unique.length) {
    postPluginMessage({ type: 'grid-breakpoints-result', count: 0, warnings: ['Select a Grid frame or a frame containing Grid frames.'] });
    return;
  }

  const names = [];
  for (const grid of unique) {
    const breakpoint = contextualGridBreakpoint(grid, options.primary);
    const columns = responsiveColumnsAt(responsiveColumns, breakpoint) || Object.values(responsiveColumns)[0] || 1;
    const beforeName = grid.name || 'Grid';
    try {
      grid.gridColumnCount = columns;
      grid.gridColumnSizes.forEach((track) => {
        track.type = 'FLEX';
        track.value = 1;
      });
    } catch (error) {
      warnings.push(`"${grid.name || 'Grid'}" preview columns could not be set: ${error.message}`);
    }
    const normalized = syncResponsiveGridColumnsMetadata(grid, responsiveColumns);
    if (normalized) {
      const expectedName = responsiveGridName(beforeName, normalized);
      if (grid.name !== expectedName) {
        try {
          grid.name = expectedName;
        } catch (error) {
          warnings.push(`"${beforeName}" responsive Grid name could not be updated: ${error.message}`);
        }
      }
      names.push(grid.name || expectedName);
    }
    try {
      grid.setPluginData(A1_BREAKPOINT_KEY, breakpoint);
    } catch {
      // The visible layer-name suffix remains the portable contract.
    }
  }

  figma.currentPage.selection = unique;
  figma.notify(`Applied responsive Grid values to ${unique.length} Grid${unique.length === 1 ? '' : 's'}.`);
  postPluginMessage({ type: 'grid-breakpoints-result', count: unique.length, warnings, names });
  scheduleAutoExport();
}

async function handleFixSection() {
  const selection = figma.currentPage.selection;
  if (selection.length !== 1 || selection[0].type !== 'INSTANCE' || registeredSetName(selection[0]) !== 'Section') {
    return postError('Select one Section instance to AutoFix its content gap.');
  }
  const section = selection[0];
  const suggestion = sectionSuggestion(section);
  if (suggestion.fixes.length === 0) {
    postPluginMessage({ type: 'section-fix-result', warnings: [], message: 'This Section content gap already uses an A1-compatible value.' });
    return;
  }
  const warnings = [];
  applySectionSuggestion(section, suggestion, warnings);
  figma.notify('Applied the nearest A1 Section content gap.');
  postPluginMessage({ type: 'section-fix-result', warnings, message: 'Applied the nearest A1 Section content gap.' });
  scheduleAutoExport();
}

function collectAutoFixTargets(selection) {
  const targets = { componentOverrides: [], pageLayouts: [], cards: [], stacks: [], grids: [], sections: [], texts: [] };
  const seen = new Set();
  const visit = (node) => {
    const current = liveNode(node);
    if (!current || seen.has(current.id)) return;
    seen.add(current.id);
    if (['COMPONENT', 'COMPONENT_SET', 'SLOT'].includes(current.type) || isComponentImplementationNode(current)) return;
    if (current.type === 'TEXT') {
      if (isMaterialIconTextNode(current)) return;
      if (textSuggestion(current).issues.length) targets.texts.push(current.id);
      return;
    }
    if (current.type === 'INSTANCE') {
      if (registeredSetName(current) && hasSupportedInstancePaintOverrides(current)) targets.componentOverrides.push(current.id);
      if (registeredSetName(current) === 'Section' && sectionSuggestion(current).fixes.length) targets.sections.push(current.id);
      // Registered instances own their internal implementation layers. Do not
      // rewrite those nested layers as if they were user-authored content.
      return;
    }
    const pageLayout = pageLayoutSuggestion(current);
    const card = pageLayout ? null : cardSuggestion(current);
    if (pageLayout && pageLayout.fixes.length) targets.pageLayouts.push(current.id);
    else if (card && card.fixes.length) targets.cards.push(current.id);
    else if (isStackFrame(current) && stackSuggestion(current).fixes.length) targets.stacks.push(current.id);
    else if (isGridFrame(current) && gridSuggestion(current).fixes.length) targets.grids.push(current.id);
    try {
      for (const child of current.children || []) visit(child);
    } catch {
      // An in-flight Figma instance update can invalidate a child handle.
    }
  };
  for (const node of selection || []) visit(node);
  return targets;
}

function collectTextAutoFixTargets(selection) {
  const out = [];
  const seen = new Set();
  const visit = (node) => {
    const current = liveNode(node);
    if (!current || seen.has(current.id)) return;
    seen.add(current.id);
    if (isAuditReportNode(current) || !isVisibleForTextConversion(current)) return;
    if (['COMPONENT', 'COMPONENT_SET'].includes(current.type) || isComponentImplementationNode(current)) return;
    if (current.type === 'INSTANCE') return;
    if (current.type === 'TEXT') {
      if (isMaterialIconTextNode(current)) return;
      if (textSuggestion(current).issues.length) out.push(current.id);
      return;
    }
    try {
      for (const child of current.children || []) visit(child);
    } catch {
      // An in-flight Figma instance update can invalidate a child handle.
    }
  };
  for (const node of selection || []) visit(node);
  return out;
}

function autoFixTargetCount(selection) {
  const targets = collectAutoFixTargets(selection);
  return targets.componentOverrides.length + targets.pageLayouts.length + targets.cards.length + targets.stacks.length + targets.grids.length + targets.sections.length + targets.texts.length;
}

function auditNodeName(node) {
  try {
    return node && node.name ? node.name : node && node.type ? node.type : 'Unknown layer';
  } catch {
    return 'Unavailable layer';
  }
}

function boundColorVariable(paint) {
  try {
    const binding = paint && paint.boundVariables && paint.boundVariables.color;
    const candidate = Array.isArray(binding) ? binding.find((entry) => entry && entry.id) : binding;
    return candidate && candidate.id ? figma.variables.getVariableById(candidate.id) : null;
  } catch {
    return null;
  }
}

function paintHasValidColorBinding(paint) {
  return Boolean(boundColorVariable(paint));
}

function isVisibleSolidPaint(paint) {
  return Boolean(paint && paint.type === 'SOLID' && paint.visible !== false && (paint.opacity === undefined || paint.opacity > 0));
}

function auditA1TextStyleName(styleName) {
  const name = String(styleName || '').trim().toLowerCase();
  if (/^(heading|display|body)\/(xs|sm|md|lg|xl|xxl|jumbo|xjumbo)$/.test(name)) return true;
  if (/^link\/(xs|sm|md|lg|xl)\/(normal|medium|semibold|bold)$/.test(name)) return true;
  return Object.keys(A1_FIGMA_TEXT_STYLE_KEYS || {}).some((key) => key.toLowerCase() === name);
}

function addAuditIssue(report, nodeOrIssue, maybeIssue, options = {}) {
  const issue = maybeIssue === undefined ? nodeOrIssue : maybeIssue;
  if (!issue) return;
  const text = String(issue);
  const node = maybeIssue === undefined ? null : liveNode(nodeOrIssue);
  return addSharedAuditIssue(report, {
    text,
    nodeId: node && typeof node.id === 'string' ? node.id : '',
    nodeName: node ? auditNodeName(node) : '',
    severity: options.severity,
    category: options.category,
    groupKey: options.groupKey,
    metricKeys: options.metricKeys,
  });
}

function addAuditPaintIssues(report, node, propertyName) {
  let paints = null;
  try {
    paints = node && node[propertyName];
  } catch {
    return;
  }
  if (!Array.isArray(paints)) return;
  const missing = paints.filter((paint) => isVisibleSolidPaint(paint) && !paintHasValidColorBinding(paint));
  if (!missing.length) return;
  report.missingColorValues += missing.length;
  addAuditIssue(report, node, `${auditNodeName(node)} has ${missing.length} ${propertyName} color ${missing.length === 1 ? 'value' : 'values'} not bound to a valid A1 color variable.`, {
    severity: 'minor',
    category: 'Color token',
    groupKey: `color-variable:${propertyName}`,
    metricKeys: ['color-values'],
  });
}

function auditSupportedInstancePaintOverrides(report, instance, componentName) {
  const rawPaintNodes = supportedInstancePaintOverrideNodes(instance);
  if (!rawPaintNodes.length) return;
  report.missingColorValues += rawPaintNodes.length;
  const names = rawPaintNodes.slice(0, 3).map(auditNodeName).join(', ');
  const more = rawPaintNodes.length > 3 ? `, and ${rawPaintNodes.length - 3} more` : '';
  addAuditIssue(report, instance, `${componentName} "${auditNodeName(instance)}" has ${rawPaintNodes.length} internal color ${rawPaintNodes.length === 1 ? 'override' : 'overrides'} not bound to valid A1 variables (${names}${more}).`, {
    severity: 'minor',
    category: 'Component override',
    groupKey: `component-color-override:${componentName}`,
    metricKeys: ['a1-components', 'color-values'],
  });
}

function supportedInstancePaintOverrideNodes(instance) {
  const rawPaintNodes = [];
  try {
    const descendants = instance.findAll((node) => {
      try {
        if (node.type === 'SLOT' || isAuditReportNode(node)) return false;
        const paintGroups = [];
        if (Array.isArray(node.fills)) paintGroups.push(node.fills);
        if (Array.isArray(node.strokes)) paintGroups.push(node.strokes);
        return paintGroups.some((paints) =>
          paints.some((paint) => isVisibleSolidPaint(paint) && !paintHasValidColorBinding(paint)));
      } catch {
        return false;
      }
    });
    for (const node of descendants) rawPaintNodes.push(node);
  } catch {
    return [];
  }
  return rawPaintNodes;
}

function hasSupportedInstancePaintOverrides(instance) {
  return supportedInstancePaintOverrideNodes(instance).length > 0;
}

function resetSupportedInstancePaintOverrides(instance, warnings) {
  const nodes = supportedInstancePaintOverrideNodes(instance);
  let count = 0;
  for (const node of nodes) {
    try {
      if (typeof node.resetOverrides === 'function') {
        node.resetOverrides();
        count += 1;
      } else {
        warnings.push(`"${auditNodeName(node)}" has a color override, but this Figma node cannot reset overrides through the plugin API.`);
      }
    } catch (error) {
      warnings.push(`"${auditNodeName(node)}" color override could not be reset: ${error.message}`);
    }
  }
  return count;
}

function addAuditReviewIssues(report, node, review) {
  if (!review || !Array.isArray(review.issues) || review.issues.length === 0) return;
  report.autoFixOpportunities += 1;
  addAuditIssue(report, node, `${auditNodeName(node)} can be improved: ${review.issues[0]}`, {
    severity: 'advisory',
    category: 'AutoFix',
    groupKey: `autofix:${normalizeAuditIssueKey(review.issues[0])}`,
    metricKeys: ['autofix'],
  });
}

function supportedInstanceSlots(instance) {
  try {
    return instance.findAll((node) => node.type === 'SLOT');
  } catch {
    return [];
  }
}

const AUDIT_REPORT_COMPONENT_NAME = 'A1 Audit Report Card';
const AUDIT_REPORT_TEMPLATE_KEY = 'a1-audit-template';
const AUDIT_IGNORE_MARKER = ' [A1 ignore]';

function nameHasAuditIgnoreMarker(node) {
  try {
    return Boolean(node && typeof node.name === 'string' && /ignore/i.test(node.name));
  } catch {
    return false;
  }
}

function isAuditIgnoredNode(node) {
  try {
    for (let current = node; current && current.type !== 'PAGE'; current = current.parent) {
      if (nameHasAuditIgnoreMarker(current)) return true;
    }
  } catch {
    return false;
  }
  return false;
}

function auditIgnoredName(name) {
  const current = String(name || 'Layer');
  return /ignore/i.test(current) ? current : `${current}${AUDIT_IGNORE_MARKER}`;
}

function privateA1ImplementationComponentName(instance) {
  const name = componentSetName(instance);
  if (AUDIT_SUPPORTED_PRIVATE_COMPONENTS.has(name)) return name;
  const iconName = materialIconNameFromInstance(instance);
  if (iconName) return `Icon (${iconName})`;
  try {
    return AUDIT_SUPPORTED_PRIVATE_COMPONENTS.has(instance.name) ? instance.name : '';
  } catch {
    return '';
  }
}

function auditPrivateComponentName(instance) {
  return privateA1ImplementationComponentName(instance);
}

function isAuditReportNode(node) {
  try {
    return Boolean(
      node
      && typeof node.getPluginData === 'function'
      && (node.getPluginData('a1-audit-report') === 'true' || node.getPluginData(AUDIT_REPORT_TEMPLATE_KEY) === 'true')
    );
  } catch {
    return false;
  }
}

function findExistingAuditReportCard() {
  try {
    return figma.currentPage.findOne((node) => {
      try {
        return typeof node.getPluginData === 'function' && node.getPluginData('a1-audit-report') === 'true';
      } catch {
        return false;
      }
    });
  } catch {
    return null;
  }
}

function auditSelection(selection) {
  const roots = Array.isArray(selection) && selection.length ? selection : [figma.currentPage];
  const report = createSharedAuditReport(roots.length);
  if (!selection || selection.length === 0) {
    report.warnings.push('Nothing was selected, so the current Figma page was audited.');
  }

  const seen = new Set();
  const unsupportedNodeTypes = new Set(['BOOLEAN_OPERATION', 'ELLIPSE', 'LINE', 'POLYGON', 'RECTANGLE', 'SHAPE_WITH_TEXT', 'STAR', 'VECTOR', 'WIDGET']);
  const visit = (node, options = {}) => {
    const current = liveNode(node) || node;
    if (!current || seen.has(current.id)) return;
    if (isAuditReportNode(current)) return;
    if (isAuditIgnoredNode(current)) {
      report.ignoredLayers += 1;
      return;
    }
    seen.add(current.id);
    report.nodeCount += 1;

    try {
      const missingType = typeof current.getPluginData === 'function' ? current.getPluginData('a1-missing-component-type') : '';
      if (missingType) {
        report.missingComponents += 1;
        addAuditIssue(report, current, `${auditNodeName(current)} is a visible placeholder for missing Figma component "${missingType}".`, {
          severity: 'blocker',
          category: 'JSON translation',
          groupKey: `missing-figma-component:${missingType}`,
          metricKeys: ['figma-components'],
        });
        return;
      }
    } catch {
      // Ignore plugin data read failures on transient Figma nodes.
    }

    if (current.type === 'TEXT' && isMaterialIconTextNode(current)) {
      report.supportedComponents += 1;
      if (!iconColorFromNode(current)) {
        report.missingColorValues += 1;
        addAuditIssue(report, current, `${auditNodeName(current)} icon color is not bound to an A1 semantic color variable.`, {
          severity: 'minor',
          category: 'Color token',
          groupKey: 'icon-color-variable',
          metricKeys: ['color-values'],
        });
      }
      return;
    }

    if (current.type === 'TEXT') {
      const styleName = textStyleName(current).trim().toLowerCase();
      const usesA1TextStyle = auditA1TextStyleName(styleName);
      if (usesA1TextStyle) {
        report.supportedTextStyles += 1;
      } else {
        report.missingTextStyles += 1;
        addAuditIssue(report, current, `${auditNodeName(current)} is not using an A1 text style.`, {
          severity: 'minor',
          category: 'Text style',
          groupKey: 'text-style',
          metricKeys: ['text-styles'],
        });
      }
      const paint = visibleSolidTextPaint(current);
      const hasA1TextColor = Boolean(textColorToken(current) || textUsesLinkColor(current));
      if (paint && !hasA1TextColor) {
        report.missingColorValues += 1;
        addAuditIssue(report, current, `${auditNodeName(current)} text color is not bound to an A1 text/link variable.`, {
          severity: 'minor',
          category: 'Color token',
          groupKey: 'text-color-variable',
          metricKeys: ['color-values'],
        });
      }
      addAuditReviewIssues(report, current, textSuggestion(current));
      return;
    }

    if (current.type === 'INSTANCE') {
      const componentName = registeredSetName(current);
      if (componentName) {
        report.supportedComponents += 1;
        auditSupportedInstancePaintOverrides(report, current, componentName);
        if (componentName === 'Tabs' && tabsConnectedPanelCount(current) === 0) {
          addAuditIssue(report, current, `${auditNodeName(current)} has no connected tab panel content. Add {tab=Tab label} to a nearby frame, Section, Stack, or Grid that matches one tab label; that layer's exported content becomes the matching A1 tab panel. Example: {tab=Dashboard}.`, {
            severity: 'advisory',
            category: 'Tabs content',
            groupKey: 'tabs-missing-connected-content',
            metricKeys: ['element-support'],
          });
        }
        if (componentName === 'Section') addAuditReviewIssues(report, current, sectionSuggestion(current));
        for (const slot of supportedInstanceSlots(current)) {
          try {
            for (const child of slot.children || []) visit(child);
          } catch {
            report.warnings.push(`${auditNodeName(current)} has a content slot that could not be audited because Figma refreshed that sublayer.`);
          }
        }
        return;
      }
      const privateComponentName = auditPrivateComponentName(current);
      if (privateComponentName) {
        report.supportedComponents += 1;
        return;
      }
      if (!options.insideSupportedSlot) {
        report.unsupportedElements += 1;
        addAuditIssue(report, current, `${auditNodeName(current)} is an unsupported component instance.`, {
          severity: 'major',
          category: 'JSON translation',
          groupKey: `unsupported-component:${componentSetName(current) || current.name || 'unknown'}`,
          metricKeys: ['element-support'],
        });
      }
    }

    if (unsupportedNodeTypes.has(current.type)) {
      report.unsupportedElements += 1;
      addAuditIssue(report, current, `${auditNodeName(current)} is a ${current.type.toLowerCase().replaceAll('_', ' ')} layer, which is not portable A1 JSON.`, {
        severity: 'major',
        category: 'JSON translation',
        groupKey: `unsupported-layer:${current.type}`,
        metricKeys: ['element-support'],
      });
    }

    if (current.type === 'FRAME' || current.type === 'COMPONENT' || current.type === 'GROUP' || current.type === 'SECTION') {
      const pageLayoutReview = pageLayoutSuggestion(current);
      const cardReview = pageLayoutReview ? null : cardSuggestion(current);
      if (pageLayoutReview) addAuditReviewIssues(report, current, pageLayoutReview);
      else if (cardReview) addAuditReviewIssues(report, current, cardReview);
      else if (isStackFrame(current)) addAuditReviewIssues(report, current, stackSuggestion(current));
      else if (isGridFrame(current)) addAuditReviewIssues(report, current, gridSuggestion(current));
      addAuditPaintIssues(report, current, 'fills');
      addAuditPaintIssues(report, current, 'strokes');
    } else if (!options.insideSupportedSlot) {
      addAuditPaintIssues(report, current, 'fills');
      addAuditPaintIssues(report, current, 'strokes');
    }

    try {
      for (const child of current.children || []) visit(child, options);
    } catch {
      report.warnings.push(`${auditNodeName(current)} has child layers that disappeared while auditing.`);
    }
  };

  for (const root of roots) visit(root);
  if (report.nodeCount > 0 && auditA1CoverageCount(report) === 0) {
    const target = roots.find(Boolean) || null;
    addAuditIssue(report, target, 'No A1 components or A1 text styles were found in this selection. Convert key structure to A1 components or run AutoFix text before treating this as A1-compatible.', {
      severity: 'blocker',
      category: 'A1 coverage',
      groupKey: 'a1-coverage:none',
      metricKeys: ['a1-components', 'text-styles', 'element-support'],
    });
  }
  // Shared finalization keeps scoring and issue metadata in one place.
  return finalizeSharedAuditReport(report);
}

function auditSelectionBounds(selection) {
  const scopedSelection = (selection || []).length ? selection : figma.currentPage.children;
  const boxes = (scopedSelection || []).map((node) => {
    try {
      if (isAuditReportNode(node)) return null;
      return node.absoluteBoundingBox || null;
    } catch {
      return null;
    }
  }).filter(Boolean);
  if (!boxes.length) return null;
  const minX = Math.min(...boxes.map((box) => box.x));
  const minY = Math.min(...boxes.map((box) => box.y));
  const maxX = Math.max(...boxes.map((box) => box.x + box.width));
  const maxY = Math.max(...boxes.map((box) => box.y + box.height));
  return { x: minX, y: minY, right: maxX, bottom: maxY };
}

function auditReportProperty(instance, name, type) {
  const found = componentProperty(instance, name, type);
  return found || null;
}

function queueAuditReportProperty(instance, assignments, name, value, type = 'TEXT') {
  const found = auditReportProperty(instance, name, type);
  if (!found) return false;
  assignments[found.key] = value;
  return true;
}

function setAuditTextNode(text, value) {
  if (!text || text.type !== 'TEXT') return false;
  try {
    text.characters = String(value);
    return true;
  } catch {
    return false;
  }
}

function firstAuditNode(root, predicate) {
  try {
    return root.findOne((node) => {
      try {
        return predicate(node);
      } catch {
        return false;
      }
    });
  } catch {
    return null;
  }
}

function auditNamedText(root, name) {
  return firstAuditNode(root, (node) => node.type === 'TEXT' && node.name === name);
}

function auditNamedNode(root, name) {
  return firstAuditNode(root, (node) => node.name === name);
}

function auditFrameTextChildren(root, frameName) {
  const frame = auditNamedNode(root, frameName);
  if (!frame || !('findAll' in frame)) return [];
  try {
    return frame.findAll((node) => node.type === 'TEXT');
  } catch {
    return [];
  }
}

function setAuditNodeVisible(root, name, visible) {
  const node = auditNamedNode(root, name);
  if (!node) return false;
  try {
    node.visible = Boolean(visible);
    return true;
  } catch {
    return false;
  }
}

function applyAuditReportDataFallback(instance, report) {
  const metrics = auditReportMetrics(report);
  const recommendations = auditReportRecommendations(report);
  const topIssues = auditReportFindings(report);
  const cleanFinding = topIssues.length ? null : 'No compatibility issues found. This selection is cleanly A1-shaped.';

  setAuditTextNode(auditNamedText(instance, 'Title'), 'A1 compatibility audit');
  setAuditTextNode(auditNamedText(instance, 'Score'), `${report.grade} · ${report.score}/100`);
  setAuditTextNode(auditNamedText(instance, 'Summary'), auditReportSummary(report));
  setAuditTextNode(auditNamedText(instance, 'Findings heading'), topIssues.length ? 'Top findings' : 'Findings');

  // Structural fallback for edited templates where property bindings were
  // deleted but the named rows remain.
  const headerTexts = auditFrameTextChildren(instance, 'Header Slot');
  setAuditTextNode(headerTexts[0], 'A1 compatibility audit');
  setAuditTextNode(headerTexts[1], `${report.grade} · ${report.score}/100`);

  metrics.forEach((metric, index) => {
    const slot = index + 1;
    setAuditTextNode(auditNamedText(instance, `Metric ${slot} Status`), metric.passes ? '✓' : '×');
    setAuditTextNode(auditNamedText(instance, `Metric ${slot} Label`), metric.label);
    setAuditTextNode(auditNamedText(instance, `Metric ${slot} Value`), String(metric.value));
    const rowTexts = auditFrameTextChildren(instance, `Metric Slot ${slot}`);
    setAuditTextNode(rowTexts[0], metric.passes ? '✓' : '×');
    setAuditTextNode(rowTexts[1], metric.label);
    setAuditTextNode(rowTexts[2], String(metric.value));
  });

  for (let index = 1; index <= 8; index += 1) {
    const value = topIssues[index - 1] ? `• ${topIssues[index - 1]}` : index === 1 && cleanFinding ? cleanFinding : '';
    setAuditTextNode(auditNamedText(instance, `Finding ${index}`), value);
    setAuditNodeVisible(instance, `Finding ${index}`, Boolean(value));
  }

  setAuditNodeVisible(instance, 'Recommendations heading', recommendations.length > 0);
  recommendations.forEach((item, index) => {
    setAuditTextNode(auditNamedText(instance, `Recommendation ${index + 1}`), `• ${item}`);
    setAuditNodeVisible(instance, `Recommendation ${index + 1}`, true);
  });
  for (let index = recommendations.length + 1; index <= 4; index += 1) {
    setAuditTextNode(auditNamedText(instance, `Recommendation ${index}`), '');
    setAuditNodeVisible(instance, `Recommendation ${index}`, false);
  }
}

function applyAuditReportData(instance, report, warnings) {
  const assignments = {};
  queueAuditReportProperty(instance, assignments, 'Title', 'A1 compatibility audit');
  queueAuditReportProperty(instance, assignments, 'Score', `${report.grade} · ${report.score}/100`);
  queueAuditReportProperty(instance, assignments, 'Summary', auditReportSummary(report));
  auditReportMetrics(report).forEach((metric, index) => {
    const slot = index + 1;
    queueAuditReportProperty(instance, assignments, `Metric ${slot} Status`, metric.passes ? '✓' : '×');
    queueAuditReportProperty(instance, assignments, `Metric ${slot} Label`, metric.label);
    queueAuditReportProperty(instance, assignments, `Metric ${slot} Value`, String(metric.value));
  });
  const topIssues = auditReportFindings(report);
  queueAuditReportProperty(instance, assignments, 'Findings heading', topIssues.length ? 'Top findings' : 'Findings');
  const cleanFinding = topIssues.length ? null : 'No compatibility issues found. This selection is cleanly A1-shaped.';
  for (let index = 1; index <= 8; index += 1) {
    const value = topIssues[index - 1] ? `• ${topIssues[index - 1]}` : index === 1 && cleanFinding ? cleanFinding : '';
    queueAuditReportProperty(instance, assignments, `Finding ${index}`, value);
    queueAuditReportProperty(instance, assignments, `Show finding ${index}`, Boolean(value), 'BOOLEAN');
  }
  const recommendations = auditReportRecommendations(report);
  queueAuditReportProperty(instance, assignments, 'Show recommendations', recommendations.length > 0, 'BOOLEAN');
  recommendations.forEach((item, index) => {
    queueAuditReportProperty(instance, assignments, `Recommendation ${index + 1}`, `• ${item}`);
    queueAuditReportProperty(instance, assignments, `Show recommendation ${index + 1}`, true, 'BOOLEAN');
  });
  for (let index = recommendations.length + 1; index <= 4; index += 1) {
    queueAuditReportProperty(instance, assignments, `Recommendation ${index}`, '');
    queueAuditReportProperty(instance, assignments, `Show recommendation ${index}`, false, 'BOOLEAN');
  }
  applyQueuedProperties(instance, assignments, warnings, 'Audit report properties');
  applyAuditReportDataFallback(instance, report);
}

async function renderAuditReportCard(report, selection) {
  const existing = findExistingAuditReportCard();
  const existingPosition = existing ? { x: existing.x, y: existing.y } : null;
  const warnings = [];
  let frame = existing || null;

  if (!frame) {
    frame = await createComponentInstance(AUDIT_REPORT_COMPONENT_NAME, warnings);
    if (existingPosition) {
      frame.x = existingPosition.x;
      frame.y = existingPosition.y;
    }
  } else if (frame.type !== 'INSTANCE') {
    const staleFrame = frame;
    frame = await createComponentInstance(AUDIT_REPORT_COMPONENT_NAME, warnings);
    if (existingPosition) {
      frame.x = existingPosition.x;
      frame.y = existingPosition.y;
    }
    try {
      staleFrame.remove();
    } catch {
      // Replace stale/non-renderable report nodes with a fresh report instance.
    }
  }

  const isExisting = frame.parent !== null;
  frame.name = `A1 Audit Report · ${report.grade} ${report.score}`;
  frame.setPluginData('a1-audit-report', 'true');

  try {
    await loadInstanceFonts(frame);
  } catch {
    // The report still tries component-property updates; direct text fallback
    // may skip layers whose custom fonts are unavailable.
  }
  applyAuditReportData(frame, report, warnings);
  if (warnings.length) report.warnings.push(...warnings);

  const bounds = auditSelectionBounds(selection);
  if (bounds) {
    frame.x = Math.round(bounds.right + 24);
    frame.y = Math.round(bounds.y);
  } else if (!isExisting) {
    frame.x = Math.round(figma.viewport.center.x - 260);
    frame.y = Math.round(figma.viewport.center.y - 220);
  }
  if (!isExisting) {
    figma.currentPage.appendChild(frame);
  }
  figma.currentPage.selection = [frame];
  figma.viewport.scrollAndZoomIntoView([frame]);
  return frame;
}

async function handleAuditSelection(options = {}) {
  const selection = figma.currentPage.selection.filter((node) => !isAuditReportNode(node));
  const report = auditSelection(selection);
  if (options.printReport === true) await renderAuditReportCard(report, selection);
  figma.notify(`A1 audit complete: ${report.grade} (${report.score}/100).`);
  postPluginMessage({
    type: 'audit-result',
    grade: report.grade,
    score: report.score,
    warnings: report.warnings,
    issueCount: report.issues.length,
    printed: options.printReport === true,
    report: {
      grade: report.grade,
      score: report.score,
      nodeCount: report.nodeCount,
      auditedRoots: report.auditedRoots,
      ignoredLayers: report.ignoredLayers,
      issueGroupCount: report.issueGroupCount,
      metrics: auditReportMetrics(report),
      recommendations: auditReportRecommendations(report),
      issues: report.issueItems,
    },
  });
}

function handleIgnoreAuditIssue(nodeId) {
  if (!nodeId || typeof nodeId !== 'string') {
    postPluginMessage({ type: 'audit-ignore-result', warnings: ['This audit issue is not linked to a Figma layer.'] });
    return;
  }
  const node = liveNode({ id: nodeId });
  if (!node || node.removed) {
    postPluginMessage({ type: 'audit-ignore-result', warnings: ['That audit issue layer no longer exists in this Figma file. Run Audit again to refresh the report.'] });
    return;
  }
  let target = node;
  while (target && target.type !== 'PAGE') {
    try {
      const previousName = auditNodeName(target);
      target.name = auditIgnoredName(previousName);
      figma.currentPage.selection = [target];
      figma.viewport.scrollAndZoomIntoView([target]);
      figma.notify(`Audit will ignore "${auditNodeName(target)}".`);
      postPluginMessage({
        type: 'audit-ignore-result',
        warnings: [],
        nodeId: target.id,
        nodeName: auditNodeName(target),
        message: `Marked "${auditNodeName(target)}" as ignored. Run Audit again to refresh the report.`,
      });
      return;
    } catch {
      target = target.parent && target.parent.type !== 'PAGE' ? target.parent : null;
    }
  }
  postPluginMessage({ type: 'audit-ignore-result', warnings: [`${auditNodeName(node)} could not be renamed. Try renaming it manually with "${AUDIT_IGNORE_MARKER.trim()}" in the layer name.`] });
}

function handleSelectAuditIssue(nodeId) {
  if (!nodeId || typeof nodeId !== 'string') {
    postPluginMessage({ type: 'audit-select-result', warnings: ['This audit issue is not linked to a Figma layer.'] });
    return;
  }
  const node = liveNode({ id: nodeId });
  if (!node || node.removed) {
    postPluginMessage({ type: 'audit-select-result', warnings: ['That audit issue layer no longer exists in this Figma file. Run Audit again to refresh the report.'] });
    return;
  }
  let target = node;
  while (target) {
    try {
      figma.currentPage.selection = [target];
      figma.viewport.scrollAndZoomIntoView([target]);
      postPluginMessage({ type: 'audit-select-result', warnings: [], nodeName: auditNodeName(target) });
      return;
    } catch {
      target = target.parent && target.parent.type !== 'PAGE' ? target.parent : null;
    }
  }
  try {
    figma.viewport.scrollAndZoomIntoView([node]);
    postPluginMessage({ type: 'audit-select-result', warnings: [`${auditNodeName(node)} could not be selected directly. Try selecting its parent layer in the Layers panel.`] });
  } catch (error) {
    postPluginMessage({ type: 'audit-select-result', warnings: [`Could not select the audit issue layer: ${error.message}`] });
  }
}

function selectedDetachRoots(selection) {
  return topLevelSelectionNodes(selection).filter((node) => !isAuditReportNode(node));
}

function firstDetachableInstance(node) {
  const current = liveNode(node);
  if (!current || isAuditReportNode(current)) return null;
  if (current.type === 'INSTANCE') return current;
  try {
    for (const child of current.children || []) {
      const found = firstDetachableInstance(child);
      if (found) return found;
    }
  } catch {
    return null;
  }
  return null;
}

async function handleDetachAll() {
  const roots = selectedDetachRoots(figma.currentPage.selection);
  if (!roots.length) {
    postPluginMessage({ type: 'detach-all-result', warnings: [], count: 0, message: 'Select one or more layers to detach component instances.' });
    return;
  }
  const warnings = [];
  const rootRefs = roots.map((node) => ({ id: node.id }));
  let count = 0;
  let pass = 0;
  while (pass < 1000) {
    pass += 1;
    let detached = false;
    for (let index = 0; index < rootRefs.length; index += 1) {
      const instance = firstDetachableInstance(rootRefs[index]);
      if (!instance) continue;
      try {
        const frame = instance.detachInstance();
        if (rootRefs[index].id === instance.id) rootRefs[index] = { id: frame.id };
        count += 1;
        detached = true;
      } catch (error) {
        warnings.push(`"${auditNodeName(instance)}" could not be detached: ${error.message}`);
      }
    }
    if (!detached) break;
  }
  if (pass >= 1000) warnings.push('Detach All stopped after 1000 passes to avoid an infinite loop.');
  const affected = rootRefs.map(liveNode).filter(Boolean);
  if (affected.length) {
    figma.currentPage.selection = affected;
    figma.viewport.scrollAndZoomIntoView(affected);
  }
  const message = count
    ? `Detached ${count} component ${count === 1 ? 'instance' : 'instances'} in the selection.`
    : 'No component instances were found to detach in the selection.';
  if (count) figma.notify(message);
  postPluginMessage({ type: 'detach-all-result', warnings, count, message });
  if (count) scheduleAutoExport();
}

async function handleFixAll() {
  const targets = collectAutoFixTargets(figma.currentPage.selection);
  const targetCount = targets.componentOverrides.length + targets.pageLayouts.length + targets.cards.length + targets.stacks.length + targets.grids.length + targets.sections.length + targets.texts.length;
  if (!targetCount) {
    postPluginMessage({ type: 'fix-all-result', warnings: [], count: 0, message: 'No supported AutoFix suggestions were found in this selection.' });
    return;
  }
  const warnings = [];
  const affected = [];
  let count = 0;

  for (const id of targets.componentOverrides) {
    const instance = liveNode({ id });
    if (!instance || instance.type !== 'INSTANCE' || !registeredSetName(instance)) continue;
    const resetCount = resetSupportedInstancePaintOverrides(instance, warnings);
    if (resetCount > 0) {
      count += 1;
      affected.push(instance);
    }
  }

  // Convert app shells before nested content. Child node ids remain valid after
  // moving into the Page Content Slot, so deeper fixes can still run afterward
  // when Figma keeps those nodes available.
  for (const id of targets.pageLayouts) {
    const frame = liveNode({ id });
    if (!pageLayoutSuggestion(frame)) continue;
    try {
      const pageLayout = await convertFrameToPageLayout(frame, warnings);
      if (pageLayout) {
        count += 1;
        affected.push(pageLayout);
      }
    } catch (error) {
      warnings.push(`Page Layout conversion failed: ${error.message}`);
    }
  }
  // Convert outer cards next. Their child node ids remain valid after moving
  // into the Card slot, so text and Stack fixes can run afterward.
  for (const id of targets.cards) {
    const frame = liveNode({ id });
    if (!cardSuggestion(frame)) continue;
    try {
      const card = await convertFrameToCard(frame, warnings);
      if (card) {
        count += 1;
        affected.push(card);
      }
    } catch (error) {
      warnings.push(`Card conversion failed: ${error.message}`);
    }
  }
  for (const id of targets.stacks) {
    const frame = liveNode({ id });
    if (!isStackFrame(frame) || cardSuggestion(frame)) continue;
    const suggestion = stackSuggestion(frame);
    if (!suggestion.fixes.length) continue;
    await applyStackSuggestion(frame, suggestion, warnings);
    count += 1;
    affected.push(frame);
  }
  for (const id of targets.grids) {
    const frame = liveNode({ id });
    if (!isGridFrame(frame)) continue;
    const suggestion = gridSuggestion(frame);
    if (!suggestion.fixes.length) continue;
    await applyGridSuggestion(frame, suggestion, warnings);
    frame.name = 'Grid';
    count += 1;
    affected.push(frame);
  }
  for (const id of targets.sections) {
    const section = liveNode({ id });
    if (!section || section.type !== 'INSTANCE' || registeredSetName(section) !== 'Section') continue;
    const suggestion = sectionSuggestion(section);
    if (!suggestion.fixes.length) continue;
    applySectionSuggestion(section, suggestion, warnings);
    count += 1;
    affected.push(section);
  }
  for (const id of targets.texts) {
    const text = liveNode({ id });
    if (!text || text.type !== 'TEXT' || textSuggestion(text).issues.length === 0) continue;
    await applyTextAutoFix(text, warnings);
    count += 1;
    affected.push(text);
  }
  if (affected.length) {
    figma.currentPage.selection = affected;
    figma.viewport.scrollAndZoomIntoView(affected);
  }
  if (count === 0) {
    postPluginMessage({
      type: 'fix-all-result',
      warnings,
      count,
      message: warnings.length
        ? 'AutoFix found supported targets, but no updates were applied. See warnings for details.'
        : 'AutoFix found supported targets, but they did not need changes.',
    });
    return;
  }
  figma.notify(`Applied ${count} A1 AutoFix ${count === 1 ? 'update' : 'updates'}.`);
  postPluginMessage({
    type: 'fix-all-result',
    warnings,
    count,
    message: `Applied ${count} A1 AutoFix ${count === 1 ? 'update' : 'updates'} in the selection.`,
  });
  scheduleAutoExport();
}

async function handleTidyUp() {
  const warnings = [];
  const affected = new Map();
  const remember = (node) => {
    const current = liveNode(node);
    if (current && current.id) affected.set(current.id, current);
  };

  const originalSelection = [...figma.currentPage.selection];
  const pageNodes = [];
  try {
    pageNodes.push(...figma.currentPage.children);
    pageNodes.push(...figma.currentPage.findAll((node) => !isAuditReportNode(node)));
  } catch (error) {
    warnings.push(`Current page could not be scanned completely: ${error.message}`);
  }

  const seen = new Set();
  for (const nodeRef of pageNodes) {
    const node = liveNode(nodeRef);
    if (!node || seen.has(node.id) || isAuditReportNode(node)) continue;
    seen.add(node.id);
    try {
      const breakpoint = readBreakpointData(node);
      if (breakpoint && node.parent && node.parent.type === 'PAGE') {
        applyBreakpointToTree(node, breakpoint, warnings);
        remember(node);
        continue;
      }

      if (node.type === 'INSTANCE') {
        const componentName = registeredSetName(node);
        if (componentName === 'Card') {
          const synced = syncCardIconPositionForWidth(node, warnings);
          syncLayoutWidthMode(synced, layoutWidthMode(synced), warnings, 'Card');
          syncLayoutHeightMode(synced, layoutHeightMode(synced), warnings, 'Card');
          remember(synced);
        } else if (componentName === 'Breadcrumb') {
          remember(syncBreadcrumbBackButtonForWidth(node, warnings));
        } else if (componentName === 'Button Container') {
          remember(syncButtonContainerForWidth(node, warnings));
        } else if (componentName === 'Choice Group') {
          syncChoiceGroupTileSizing(node, warnings);
          remember(node);
        } else if (componentName === 'Button') {
          const parentButtonContainer = buttonContainerAncestor(node);
          if (parentButtonContainer) {
            remember(syncButtonContainerForWidth(parentButtonContainer, warnings));
          } else {
            syncButtonFullWidthMetadata(node, buttonWidthMode(node), warnings);
            remember(node);
          }
        } else if (componentName === 'Data Table') {
          syncLayoutWidthMode(node, layoutWidthMode(node), warnings, 'Data Table');
          syncLayoutHeightMode(node, layoutHeightMode(node), warnings, 'Data Table');
          remember(node);
        } else if (componentName === 'Section') {
          const suggestion = sectionSuggestion(node);
          if (suggestion && suggestion.fixes && suggestion.fixes.length) applySectionSuggestion(node, suggestion, warnings);
          syncLayoutWidthMode(node, layoutWidthMode(node), warnings, 'Section');
          syncLayoutHeightMode(node, layoutHeightMode(node), warnings, 'Section');
          remember(node);
        }
      } else if (isStackFrame(node)) {
        const suggestion = stackSuggestion(node);
        if (suggestion && suggestion.fixes && suggestion.fixes.length) await applyStackSuggestion(node, suggestion, warnings);
        syncStackPropsName(node);
        syncLayoutWidthMode(node, layoutWidthMode(node), warnings, 'Stack');
        syncLayoutHeightMode(node, layoutHeightMode(node), warnings, 'Stack');
        remember(node);
      } else if (isGridFrame(node)) {
        const responsive = readResponsiveGridColumns(node);
        if (responsive) applyResponsiveGridColumnsForBreakpoint(node, breakpointForNode(node, 'md'), warnings);
        const suggestion = gridSuggestion(node);
        if (suggestion && suggestion.fixes && suggestion.fixes.length) await applyGridSuggestion(node, suggestion, warnings);
        syncGridWidthMode(node, gridWidthMode(node), warnings);
        syncGridHeightMode(node, gridHeightMode(node), warnings);
        remember(node);
      }
    } catch (error) {
      warnings.push(`"${auditNodeName(node)}" could not be tidied: ${error.message}`);
    }
  }

  const affectedNodes = [...affected.values()].filter((node) => liveNode(node));
  try {
    figma.currentPage.selection = originalSelection.map((node) => liveNode(node)).filter(Boolean);
  } catch {
    // Preserve the successful tidy even if a previous selection node vanished.
  }

  const count = affectedNodes.length;
  const message = count
    ? `Tidied ${count} layer${count === 1 ? '' : 's'} on the current page.`
    : 'No page-level tidy fixes were needed.';
  if (count) {
    figma.notify(message);
    scheduleAutoExport();
  }
  postPluginMessage({ type: 'tidy-up-result', warnings, count, message });
  postSelectionState();
}

async function handleFixAllText() {
  const selection = figma.currentPage.selection;
  if (!selection.length) {
    postPluginMessage({ type: 'text-fix-all-result', warnings: [], count: 0, message: 'Select a frame, group, section, or text layer to AutoFix its free text.' });
    return;
  }
  const targetIds = collectTextAutoFixTargets(selection);
  if (!targetIds.length) {
    postPluginMessage({ type: 'text-fix-all-result', warnings: [], count: 0, message: 'No eligible free text issues were found in the selection. Text inside components was skipped.' });
    return;
  }

  const warnings = [];
  const affected = [];
  let count = 0;
  for (const id of targetIds) {
    const text = liveNode({ id });
    if (!text || text.type !== 'TEXT' || textSuggestion(text).issues.length === 0) continue;
    try {
      await applyTextAutoFix(text, warnings);
      count += 1;
      affected.push(text);
    } catch (error) {
      warnings.push(`"${auditNodeName(text)}" text AutoFix failed: ${error.message}`);
    }
  }

  if (affected.length) {
    figma.currentPage.selection = affected;
    figma.viewport.scrollAndZoomIntoView(affected);
  }
  if (count === 0) {
    postPluginMessage({
      type: 'text-fix-all-result',
      warnings,
      count,
      message: warnings.length
        ? 'AutoFix all Text found eligible text, but no updates were applied. See warnings for details.'
        : 'AutoFix all Text found eligible text, but it did not need changes.',
    });
    return;
  }
  figma.notify(`AutoFixed ${count} free text ${count === 1 ? 'layer' : 'layers'}.`);
  postPluginMessage({
    type: 'text-fix-all-result',
    warnings,
    count,
    message: `AutoFixed ${count} free text ${count === 1 ? 'layer' : 'layers'} in the selection. Text inside components was skipped.`,
  });
  scheduleAutoExport();
}

async function handleImport(text, assets = [], targetParent = figma.currentPage, replaceTargetChildren = false, options = {}) {
  localFigureAssets = new Map((Array.isArray(assets) ? assets : [])
    .filter((asset) => asset && typeof asset.id === 'string' && typeof asset.dataBase64 === 'string')
    .map((asset) => [asset.id, asset]));
  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    postError('Not valid JSON: ' + error.message);
    return null;
  }
  const allNodes = [];
  collectSupportedNodes(data, allNodes);
  if (allNodes.length === 0) {
    postError(`No supported component nodes found. Supported: ${SUPPORTED_COMPONENT_MESSAGE}.`);
    return null;
  }

  const warnings = [];
  const instances = [];
  const previousActionTargetImportContext = activeActionTargetImportContext;
  const actionTargetTypes = new Map();
  const actionTriggerNames = new Map();
  const scanImportActions = (value) => {
    if (Array.isArray(value)) {
      value.forEach(scanImportActions);
      return;
    }
    if (!value || typeof value !== 'object') return;
    const actions = value.actions && typeof value.actions === 'object' ? value.actions : null;
    const clickActions = [
      actions && actions.onClick && typeof actions.onClick === 'object' ? actions.onClick : null,
      value.action && typeof value.action === 'object' ? value.action : null,
    ].filter(Boolean);
    for (const action of clickActions) {
      const targetType = ACTION_TRIGGER_TYPE_BY_ACTION[action.type];
      if (targetType && typeof action.target === 'string' && action.target) {
        actionTargetTypes.set(action.target, targetType);
        if (!actionTriggerNames.has(action.target)) {
          actionTriggerNames.set(action.target, actionTriggerDisplayNameFromSource(value));
        }
      }
    }
    for (const key of ['children', 'nodes', 'regions', 'props', 'actions']) scanImportActions(value[key]);
    scanImportActions(value.page);
    scanImportActions(value.layout);
  };
  scanImportActions(data);
  const actionTargetNodes = new Map();
  const scanImportTargetNodes = (value) => {
    if (Array.isArray(value)) {
      value.forEach(scanImportTargetNodes);
      return;
    }
    if (!value || typeof value !== 'object') return;
    if (
      typeof value.id === 'string' &&
      typeof value.type === 'string' &&
      actionTargetTypes.get(value.id) === value.type &&
      !actionTargetNodes.has(value.id)
    ) {
      actionTargetNodes.set(value.id, value);
    }
    for (const key of ['children', 'nodes', 'regions', 'props', 'actions']) scanImportTargetNodes(value[key]);
    scanImportTargetNodes(value.page);
    scanImportTargetNodes(value.layout);
  };
  scanImportTargetNodes(data);
  for (const node of allNodes) {
    if (!node || typeof node !== 'object' || typeof node.id !== 'string') continue;
    const targetType = actionTargetTypes.get(node.id);
    if (targetType && node.type === targetType && !actionTargetNodes.has(node.id)) actionTargetNodes.set(node.id, node);
  }
  activeActionTargetImportContext = {
    targetTypes: actionTargetTypes,
    targetNodes: actionTargetNodes,
    triggerNames: actionTriggerNames,
    targetLayers: new Map(),
    renderedLayers: new Map(),
    pendingTriggers: [],
  };
  const nodes = allNodes.filter((node) => !(
    activeActionTargetImportContext &&
    node &&
    typeof node === 'object' &&
    typeof node.id === 'string' &&
    activeActionTargetImportContext.targetNodes.has(node.id)
  ));
  if (replaceTargetChildren && targetParent && 'children' in targetParent) {
    for (const child of [...targetParent.children]) child.remove();
  }
  const shouldRenderBreakpointRoots = targetParent === figma.currentPage && replaceTargetChildren !== true;
  const authoredBreakpointSet = shouldRenderBreakpointRoots ? collectAuthoredBreakpoints(data) : new Set();
  const requestedBreakpointSet = new Set(Array.isArray(options.breakpoints)
    ? options.breakpoints.filter((breakpoint) => A1_BREAKPOINTS.includes(breakpoint))
    : []);
  const authoredBreakpoints = shouldRenderBreakpointRoots
    ? A1_BREAKPOINTS.filter((breakpoint) => requestedBreakpointSet.has(breakpoint) || authoredBreakpointSet.has(breakpoint))
    : [];
  const renderBreakpoints = authoredBreakpoints.length > 0 && (requestedBreakpointSet.size > 0 || authoredBreakpoints.length > 1)
    ? authoredBreakpoints
    : [''];
  let x = Math.round(figma.viewport.center.x);
  const y = Math.round(figma.viewport.center.y);
  try {
    for (const breakpoint of renderBreakpoints) {
      activeRenderBreakpoint = breakpoint;
      try {
        for (const node of nodes) {
          const instance = await renderImportedNode(node, warnings);
          if (breakpoint) {
            instance.setPluginData(A1_BREAKPOINT_KEY, breakpoint);
            instance.name = `${instance.name} · ${breakpoint}`;
            const width = A1_BREAKPOINT_WIDTHS[breakpoint];
            if (width && typeof instance.resizeWithoutConstraints === 'function') {
              try {
                instance.resizeWithoutConstraints(width, instance.height);
              } catch (error) {
                warnings.push(`${instance.name} could not be resized to the ${breakpoint} preview width (${width}px): ${error.message}`);
              }
            }
          }
          if (targetParent === figma.currentPage) {
            instance.x = x;
            instance.y = y;
          }
          x += Math.round(instance.width) + 24; // gap/lg between rendered instances
          appendImportedChild(targetParent, instance, node, warnings);
          instances.push(instance);
        }
      } finally {
        activeRenderBreakpoint = '';
      }
    }
    for (const targetNode of activeActionTargetImportContext.targetNodes.values()) {
      const instance = await renderImportedNode(targetNode, warnings);
      instance.x = x;
      instance.y = y;
      x += Math.round(instance.width) + 24;
      figma.currentPage.appendChild(instance);
      instances.push(instance);
    }
    for (const { trigger, action } of activeActionTargetImportContext.pendingTriggers) {
      const targetType = ACTION_TRIGGER_TYPE_BY_ACTION[action.type];
      let target = activeActionTargetImportContext.targetLayers.get(action.target);
      if (!target) {
        try {
          target = figma.currentPage.findOne((node) => (
            node.type === 'INSTANCE' &&
            registeredSetName(node) === targetType &&
            typeof node.getPluginData === 'function' &&
            node.getPluginData('a1-json-id') === action.target
          ));
        } catch {
          target = null;
        }
      }
      if (!target) {
        warnings.push(`A rendered trigger targets ${targetType} "${action.target}", but that target was not rendered on the canvas.`);
        continue;
      }
      setActionTriggerTarget(trigger, targetType, target.id);
      syncActionTargetTriggerNameMetadata(target, trigger);
    }
  } finally {
    activeRenderBreakpoint = '';
    activeActionTargetImportContext = previousActionTargetImportContext;
  }
  figma.currentPage.selection = instances;
  figma.viewport.scrollAndZoomIntoView(instances);
  if (authoredBreakpoints.length > 1) {
    warnings.push(`Rendered separate breakpoint previews for ${authoredBreakpoints.join(', ')}.`);
  }
  figma.notify(`Rendered ${instances.length} component ${instances.length === 1 ? 'instance' : 'instances'} from JSON.`);
  postPluginMessage({ type: 'import-result', count: instances.length, warnings });
  return { count: instances.length, warnings };
}

function breakpointRootName(name) {
  return String(name || 'A1 breakpoint root').replace(/\s+·\s+(xs|sm|md|lg|xl)$/i, '');
}

function selectedBreakpointRoot() {
  const selected = figma.currentPage.selection[0];
  if (!selected) return null;
  let root = liveNode(selected);
  let outermost = null;
  while (root && root.parent && root.parent.type !== 'PAGE') {
    outermost = root;
    root = root.parent;
  }
  if (root && root.type !== 'PAGE') outermost = root;
  return outermost;
}

function siblingBreakpointRoots(root) {
  if (!root || !root.parent || !('children' in root.parent)) return [];
  const base = breakpointRootName(root.name);
  return root.parent.children.filter((child) => {
    try {
      return child !== root && breakpointRootName(child.name) === base && readBreakpointData(child);
    } catch {
      return false;
    }
  });
}

function breakpointRootByKey(root, key) {
  if (!root || !A1_BREAKPOINTS.includes(key)) return null;
  const all = [root, ...siblingBreakpointRoots(root)];
  return all.find((candidate) => readBreakpointData(candidate) === key) || null;
}

function gridFlexTracks(frame) {
  try {
    frame.gridColumnSizes.forEach((track) => {
      track.type = 'FLEX';
      track.value = 1;
    });
  } catch {
    // Older Figma grid handles may not expose track mutation; column count
    // still applies.
  }
}

function breakpointForSyncedNode(node, root, fallback = 'xl') {
  const rootBreakpoint = readBreakpointData(root);
  if (rootBreakpoint) return rootBreakpoint;
  for (let current = node && node.parent; current; current = current.parent) {
    const breakpoint = readBreakpointData(current);
    if (breakpoint) return breakpoint;
  }
  return A1_BREAKPOINTS.includes(fallback) ? fallback : 'xl';
}

function applyResponsiveGridColumnsForBreakpoint(grid, breakpoint, warnings) {
  const responsiveColumns = readResponsiveGridColumns(grid);
  if (!responsiveColumns) return false;
  syncResponsiveGridColumnsMetadata(grid, responsiveColumns);
  const columns = responsiveColumnsAt(responsiveColumns, breakpoint);
  if (Number.isInteger(columns) && columns > 0) {
    grid.gridColumnCount = columns;
    gridFlexTracks(grid);
  }
  try {
    grid.setPluginData(A1_BREAKPOINT_KEY, breakpoint);
  } catch {
    // The containing breakpoint root remains the source of truth.
  }
  return true;
}

function applyChoiceGroupGridColumnsForBreakpoint(instance, breakpoint, warnings) {
  instance = currentInstance(instance);
  const { grid } = choiceGroupTileContainer(instance);
  if (!grid) return false;
  const responsiveColumns = readResponsiveGridColumns(grid);
  if (!responsiveColumns) return false;
  applyChoiceGroupGridColumns(instance, responsiveColumns, warnings, breakpoint);
  return true;
}

function applyBreakpointToTree(root, breakpoint, warnings) {
  if (!root || !A1_BREAKPOINTS.includes(breakpoint)) return;
  try {
    root.setPluginData(A1_BREAKPOINT_KEY, breakpoint);
    root.name = `${breakpointRootName(root.name)} · ${breakpoint}`;
    const width = A1_BREAKPOINT_WIDTHS[breakpoint];
    if (width && typeof root.resizeWithoutConstraints === 'function') {
      root.resizeWithoutConstraints(width, root.height);
    }
  } catch (error) {
    warnings.push(`Could not size ${root.name || 'breakpoint root'} for ${breakpoint}: ${error.message}`);
  }

  const visit = (node) => {
    const live = liveNode(node) || node;
    if (!live) return;
    try {
      const visibility = readBreakpointVisibility(live);
      if (visibility) live.visible = resolveBreakpointVisibility(visibility)[breakpoint] !== false;
      if (live.type === 'INSTANCE') {
        const componentName = registeredSetName(live);
        if (componentName === 'Page Layout' || componentName === 'Top Header') {
          const assignments = {};
          queueComponentProperty(live, assignments, 'Breakpoint', breakpoint, 'VARIANT', warnings, `${componentName} breakpoint preview`);
          applyQueuedProperties(live, assignments, warnings, `${componentName} properties`);
        } else if (componentName === 'Choice Group') {
          const gridBreakpoint = breakpointForSyncedNode(live, root, breakpoint);
          applyChoiceGroupGridColumnsForBreakpoint(live, gridBreakpoint, warnings);
        } else if (componentName === 'Button Container') {
          syncButtonContainerForWidth(live, warnings);
        }
      } else if (isGridFrame(live)) {
        const gridBreakpoint = breakpointForSyncedNode(live, root, breakpoint);
        applyResponsiveGridColumnsForBreakpoint(live, gridBreakpoint, warnings);
      }
      if ('children' in live) {
        for (const child of [...live.children]) visit(child);
      }
    } catch (error) {
      warnings.push(`Unsupported or unavailable breakpoint adjustment on "${live.name || 'layer'}": ${error.message}`);
    }
  };
  visit(root);
}

function cloneRootForBreakpoint(sourceRoot, breakpoint, warnings) {
  const clone = sourceRoot.clone();
  clone.x = sourceRoot.x + (A1_BREAKPOINT_WIDTHS[breakpoint] || sourceRoot.width) + 24;
  clone.y = sourceRoot.y;
  sourceRoot.parent.appendChild(clone);
  applyBreakpointToTree(clone, breakpoint, warnings);
  return clone;
}

function createBreakpointRoots({ primary = 'xl', breakpoints = [] } = {}) {
  const warnings = [];
  const selected = selectedBreakpointRoot();
  if (!selected) {
    postError('Select a rendered breakpoint root or top-level design frame first.');
    return;
  }
  const targets = (Array.isArray(breakpoints) ? breakpoints : []).filter((key) => A1_BREAKPOINTS.includes(key));
  if (targets.length === 0) {
    postError('Choose at least one breakpoint to create.');
    return;
  }
  const source = breakpointRootByKey(selected, primary) || selected;
  const created = [];
  let x = source.x;
  for (const breakpoint of targets) {
    let root = breakpointRootByKey(source, breakpoint);
    if (root === source) {
      applyBreakpointToTree(root, breakpoint, warnings);
      created.push(root);
      x = Math.max(x, root.x + root.width + 24);
      continue;
    }
    const clone = source.clone();
    clone.x = x;
    clone.y = source.y;
    source.parent.appendChild(clone);
    applyBreakpointToTree(clone, breakpoint, warnings);
    if (root && root !== source) {
      clone.x = root.x;
      clone.y = root.y;
      root.remove();
    }
    created.push(clone);
    x = clone.x + clone.width + 24;
  }
  figma.currentPage.selection = created;
  figma.viewport.scrollAndZoomIntoView(created);
  warnings.push('Created breakpoint roots from one design. Supported automatic adjustments: Page Layout breakpoint, Top Header breakpoint, and responsive Grid columns. Other visual differences remain local until explicit responsive diff support is added.');
  postPluginMessage({ type: 'breakpoint-create-result', count: created.length, warnings });
}

function gridResponsiveIdentity(grid) {
  try {
    const jsonId = grid.getPluginData('a1-json-id');
    if (jsonId) return jsonId;
  } catch {
    // Ignore stale grid handles.
  }
  return gridExportId(grid);
}

function mergeGridColumnsIntoNode(node, columnsById) {
  if (!node || typeof node !== 'object') return;
  if (node.type === 'Grid') {
    const id = typeof node.id === 'string' ? node.id : '';
    const columns = columnsById.get(id);
    if (columns && Object.keys(columns).length > 0) {
      node.props = node.props || {};
      node.props.columns = columns;
    }
  }
  for (const key of ['children', 'nodes']) {
    if (Array.isArray(node[key])) node[key].forEach((child) => mergeGridColumnsIntoNode(child, columnsById));
  }
}

function exportResponsiveDiff({ primary = 'xl' } = {}) {
  const selected = selectedBreakpointRoot();
  if (!selected) {
    postError('Select one rendered breakpoint root first.');
    return;
  }
  const roots = [selected, ...siblingBreakpointRoots(selected)]
    .filter((root) => A1_BREAKPOINTS.includes(readBreakpointData(root)));
  if (roots.length < 2) {
    postError('Select a design with at least two rendered breakpoint roots.');
    return;
  }
  const primaryRoot = breakpointRootByKey(selected, primary) || roots[0];
  const componentName = primaryRoot.type === 'INSTANCE' ? registeredSetName(primaryRoot) : null;
  const result = componentName && EXPORTERS[componentName]
    ? withBreakpointVisibility(primaryRoot, EXPORTERS[componentName](primaryRoot))
    : exportContainerNode(primaryRoot);
  const columnsById = new Map();
  const warnings = [...(result.warnings || [])];
  for (const root of roots) {
    const breakpoint = readBreakpointData(root);
    const grids = root.findAll((node) => isGridFrame(node));
    for (const grid of grids) {
      const id = gridResponsiveIdentity(grid);
      if (!id) continue;
      if (!columnsById.has(id)) columnsById.set(id, {});
      columnsById.get(id)[breakpoint] = figmaNumber(grid.gridColumnCount, 1) || 1;
    }
  }
  for (const root of roots) {
    const grids = root.findAll((node) => isGridFrame(node));
    for (const grid of grids) {
      const id = gridResponsiveIdentity(grid);
      const columns = columnsById.get(id);
      if (columns) syncResponsiveGridColumnsMetadata(grid, columns);
    }
  }
  mergeGridColumnsIntoNode(result.node, columnsById);
  warnings.push('Responsive diff currently writes supported Grid column differences. Unsupported visual/layout differences are not serialized yet.');
  postExportResult({ auto: false, live: false, componentName: 'Responsive breakpoints', node: result.node, warnings });
}

// ─── Linked A1 project pages (local bridge) ─────────────────────────────────

const PAGE_SYNC_NAMESPACE = 'a1_page_sync';
const PAGE_SYNC_LINK_KEY = 'link-id';
const PATTERN_SYNC_NAMESPACE = 'a1_pattern_sync';
const PATTERN_SYNC_ID_KEY = 'pattern-id';
const PATTERN_SYNC_NAME_KEY = 'pattern-name';
const PATTERN_SYNC_DESCRIPTION_KEY = 'pattern-description';
const PATTERN_SYNC_CATEGORY_KEY = 'pattern-category';

function patternRecordFromMessage(pattern) {
  if (!pattern || typeof pattern !== 'object' || typeof pattern.json !== 'string') {
    throw new Error('Choose an A1 pattern first.');
  }
  let definition;
  try {
    definition = JSON.parse(pattern.json);
  } catch (error) {
    throw new Error('The selected pattern JSON is invalid: ' + error.message);
  }
  const meta = definition && definition.pattern && typeof definition.pattern === 'object'
    ? definition.pattern
    : null;
  if (!meta || typeof meta.id !== 'string' || !Array.isArray(meta.nodes)) {
    throw new Error('The selected A1 pattern does not include pattern.nodes.');
  }
  return {
    id: meta.id,
    name: typeof meta.name === 'string' && meta.name.trim() ? meta.name.trim() : (pattern.name || meta.id),
    description: typeof meta.description === 'string' ? meta.description : (pattern.description || ''),
    category: typeof meta.category === 'string' && meta.category.trim() ? meta.category.trim() : (pattern.category || 'pattern'),
    definition,
    nodes: meta.nodes,
  };
}

function patternComponentSetName(record) {
  return `Pattern / ${record.name || record.id || 'Untitled'}`;
}

function isPatternComponentSet(node, patternId = '') {
  try {
    return node && node.type === 'COMPONENT_SET' &&
      typeof node.getSharedPluginData === 'function' &&
      (!patternId || node.getSharedPluginData(PATTERN_SYNC_NAMESPACE, PATTERN_SYNC_ID_KEY) === patternId);
  } catch {
    return false;
  }
}

function patternSetForId(patternId) {
  if (!patternId) return null;
  return figma.currentPage.findOne((node) => isPatternComponentSet(node, patternId));
}

function tagPatternNode(node, record, breakpoint = '') {
  if (!node || typeof node.setSharedPluginData !== 'function') return;
  node.setSharedPluginData(PATTERN_SYNC_NAMESPACE, PATTERN_SYNC_ID_KEY, record.id || '');
  node.setSharedPluginData(PATTERN_SYNC_NAMESPACE, PATTERN_SYNC_NAME_KEY, record.name || '');
  node.setSharedPluginData(PATTERN_SYNC_NAMESPACE, PATTERN_SYNC_DESCRIPTION_KEY, record.description || '');
  node.setSharedPluginData(PATTERN_SYNC_NAMESPACE, PATTERN_SYNC_CATEGORY_KEY, record.category || 'pattern');
  if (breakpoint) node.setPluginData(A1_BREAKPOINT_KEY, breakpoint);
}

function patternNodeJsonId(node) {
  try {
    return node && typeof node.getPluginData === 'function' ? node.getPluginData('a1-json-id') : '';
  } catch {
    return '';
  }
}

function patternNodePath(root, node) {
  const parts = [];
  let current = node;
  while (current && current !== root && current.parent && current.parent !== figma.currentPage) {
    const parent = current.parent;
    const siblings = parent && 'children' in parent ? parent.children : [];
    const sameNameIndex = siblings.filter((sibling) => sibling.name === current.name).indexOf(current);
    parts.unshift(`${String(current.name || current.type || 'Layer').replace(/\s+/g, ' ').trim()}${sameNameIndex > 0 ? ` ${sameNameIndex + 1}` : ''}`);
    current = parent;
  }
  return parts.join(' / ');
}

function patternPropertyLabel(root, node, fallback = 'Layer') {
  const id = patternNodeJsonId(node);
  if (id) return id;
  const path = patternNodePath(root, node);
  if (path) return path;
  return String(node && node.name || fallback || 'Layer');
}

function patternPropertyName(prefix, root, node, fallback) {
  const raw = `${prefix} / ${patternPropertyLabel(root, node, fallback)}`
    .replace(/\s+/g, ' ')
    .trim();
  return raw.slice(0, 100);
}

function hasAncestorOfTypeBefore(node, root, type) {
  for (let current = node && node.parent; current && current !== root; current = current.parent) {
    if (current.type === type) return true;
  }
  return false;
}

function componentMainId(instance) {
  try {
    return instance && instance.mainComponent && instance.mainComponent.id ? instance.mainComponent.id : '';
  } catch {
    return '';
  }
}

function componentPreferredSwapValues(instance) {
  try {
    const main = instance && instance.mainComponent;
    const parent = main && main.parent;
    if (parent && parent.type === 'COMPONENT_SET' && parent.key) return [{ type: 'COMPONENT_SET', key: parent.key }];
    if (main && main.key) return [{ type: 'COMPONENT', key: main.key }];
  } catch {
    // Local components may not have published keys; the default component id is enough.
  }
  return undefined;
}

function findPatternPropertyKey(owner, name, type) {
  try {
    const definitions = owner.componentPropertyDefinitions || {};
    const wanted = canonicalKey(name);
    for (const key of Object.keys(definitions)) {
      if (canonicalKey(plainKey(key)) !== wanted) continue;
      if (type && definitions[key].type !== type) continue;
      return key;
    }
  } catch {
    // Unsupported in older Figma runtimes.
  }
  return '';
}

function ensurePatternProperty(owner, name, type, defaultValue, warnings, options = {}) {
  const existing = findPatternPropertyKey(owner, name, type);
  if (existing) return existing;
  if (!owner || typeof owner.addComponentProperty !== 'function') return '';
  try {
    return owner.addComponentProperty(name, type, defaultValue, options);
  } catch (error) {
    warnings.push(`Pattern property "${name}" could not be created: ${error.message}`);
    return '';
  }
}

function setPatternPropertyReference(node, field, propertyKey, warnings, description) {
  if (!node || !propertyKey) return false;
  try {
    node.componentPropertyReferences = {
      ...(node.componentPropertyReferences || {}),
      [field]: propertyKey,
    };
    return true;
  } catch (error) {
    warnings.push(`${description || node.name || 'Pattern layer'} could not be exposed as a Pattern property: ${error.message}`);
    return false;
  }
}

function wirePatternComponentProperties(componentSet, warnings) {
  if (!componentSet || componentSet.type !== 'COMPONENT_SET') return;
  const variants = componentSet.children.filter((child) => child.type === 'COMPONENT');
  let textCount = 0;
  let exposedInstanceCount = 0;
  let swapCount = 0;

  for (const variant of variants) {
    const texts = variant.findAll((node) => {
      if (node.type !== 'TEXT' || node.visible === false) return false;
      return Boolean(patternNodeJsonId(node));
    });
    for (const text of texts) {
      const name = patternPropertyName('Text', variant, text, 'Text');
      const key = ensurePatternProperty(componentSet, name, 'TEXT', text.characters || '', warnings);
      if (setPatternPropertyReference(text, 'characters', key, warnings, `Text "${text.name}"`)) textCount += 1;
    }

    const instances = variant.findAll((node) => {
      if (node.type !== 'INSTANCE' || node.visible === false) return false;
      if (hasAncestorOfTypeBefore(node, variant, 'INSTANCE')) return false;
      return Boolean(registeredSetName(node) || componentSetName(node) || patternNodeJsonId(node));
    });
    for (const instance of instances) {
      try {
        instance.isExposedInstance = true;
        exposedInstanceCount += 1;
      } catch (error) {
        warnings.push(`Nested component "${instance.name}" could not be exposed on the Pattern instance: ${error.message}`);
      }
      const mainId = componentMainId(instance);
      if (!mainId) continue;
      const componentName = registeredSetName(instance) || componentSetName(instance) || instance.name || 'Component';
      const name = patternPropertyName('Component', variant, instance, componentName);
      const options = componentPreferredSwapValues(instance);
      const key = ensurePatternProperty(
        componentSet,
        name,
        'INSTANCE_SWAP',
        mainId,
        warnings,
        options ? { preferredValues: options } : {}
      );
      if (setPatternPropertyReference(instance, 'mainComponent', key, warnings, `Nested component "${instance.name}"`)) swapCount += 1;
    }
  }
  if (textCount || exposedInstanceCount || swapCount) {
    warnings.push(`Pattern controls exposed ${textCount} text field${textCount === 1 ? '' : 's'}, ${exposedInstanceCount} nested component instance${exposedInstanceCount === 1 ? '' : 's'}, and ${swapCount} component swap${swapCount === 1 ? '' : 's'}.`);
  }
}

async function renderPatternVariant(record, breakpoint, x, y, warnings) {
  const component = figma.createComponent();
  component.name = `Breakpoint=${breakpoint}`;
  component.x = x;
  component.y = y;
  component.layoutMode = 'VERTICAL';
  component.primaryAxisSizingMode = 'AUTO';
  component.counterAxisSizingMode = 'FIXED';
  component.itemSpacing = 16;
  component.paddingLeft = 0;
  component.paddingRight = 0;
  component.paddingTop = 0;
  component.paddingBottom = 0;
  const width = A1_BREAKPOINT_WIDTHS[breakpoint] || 1200;
  try { component.resizeWithoutConstraints(width, 1); } catch { /* Component will keep its natural size. */ }
  tagPatternNode(component, record, breakpoint);
  figma.currentPage.appendChild(component);
  const previousBreakpoint = activeRenderBreakpoint;
  activeRenderBreakpoint = breakpoint;
  try {
    for (const node of record.nodes) {
      const layer = await renderImportedNode(node, warnings);
      appendImportedChild(component, layer, node, warnings);
    }
  } finally {
    activeRenderBreakpoint = previousBreakpoint;
  }
  applyBreakpointToTree(component, breakpoint, warnings);
  component.name = `Breakpoint=${breakpoint}`;
  return component;
}

async function importPatternAsComponentSet(pattern) {
  const record = patternRecordFromMessage(pattern);
  const warnings = [];
  const existing = patternSetForId(record.id);
  const x = existing && 'x' in existing ? existing.x : Math.round(figma.viewport.center.x);
  const y = existing && 'y' in existing ? existing.y : Math.round(figma.viewport.center.y);
  if (existing) {
    try { existing.remove(); }
    catch (error) { warnings.push(`Existing Pattern component set could not be replaced: ${error.message}`); }
  }
  const variants = [];
  let nextX = x;
  for (const breakpoint of A1_BREAKPOINTS) {
    const variant = await renderPatternVariant(record, breakpoint, nextX, y, warnings);
    variants.push(variant);
    nextX += Math.round(variant.width) + 24;
  }
  let set = null;
  try {
    set = figma.combineAsVariants(variants, figma.currentPage);
    set.name = patternComponentSetName(record);
    set.x = x;
    set.y = y;
    tagPatternNode(set, record);
    wirePatternComponentProperties(set, warnings);
  } catch (error) {
    warnings.push(`Pattern variants were rendered, but could not be combined into a component set: ${error.message}`);
  }
  const selection = set ? [set] : variants;
  figma.currentPage.selection = selection;
  figma.viewport.scrollAndZoomIntoView(selection);
  figma.notify(`Imported Pattern "${record.name}" as breakpoint variants.`);
  postPluginMessage({ type: 'pattern-import-result', count: variants.length, name: record.name, warnings });
}

function selectedPatternSetOrVariant() {
  const selected = figma.currentPage.selection[0];
  if (!selected) return { set: null, variant: null };
  if (isPatternComponentSet(selected)) return { set: selected, variant: null };
  if (selected.type === 'COMPONENT') {
    const parent = selected.parent;
    if (isPatternComponentSet(parent)) return { set: parent, variant: selected };
    try {
      if (selected.getSharedPluginData(PATTERN_SYNC_NAMESPACE, PATTERN_SYNC_ID_KEY)) {
        return { set: null, variant: selected };
      }
    } catch { /* ignore */ }
  }
  return { set: null, variant: null };
}

function breakpointFromVariantName(component) {
  try {
    const match = String(component.name || '').match(/Breakpoint\s*=\s*(xs|sm|md|lg|xl)/i);
    if (match) return match[1].toLowerCase();
  } catch { /* ignore */ }
  return readBreakpointData(component);
}

function primaryPatternVariant(set, explicitVariant = null) {
  if (explicitVariant) return explicitVariant;
  const variants = set && 'children' in set
    ? set.children.filter((child) => child.type === 'COMPONENT')
    : [];
  return variants.find((child) => breakpointFromVariantName(child) === 'md')
    || variants.find((child) => breakpointFromVariantName(child) === 'xl')
    || variants[0]
    || null;
}

function patternMetaFromNode(node) {
  const read = (key) => {
    try { return node && typeof node.getSharedPluginData === 'function' ? node.getSharedPluginData(PATTERN_SYNC_NAMESPACE, key) : ''; }
    catch { return ''; }
  };
  const id = read(PATTERN_SYNC_ID_KEY) || slugifyOptionValue(String(node && node.name || 'pattern'), new Set());
  return {
    id,
    name: read(PATTERN_SYNC_NAME_KEY) || String(node && node.name || 'Pattern').replace(/^Pattern\s*\/\s*/i, ''),
    description: read(PATTERN_SYNC_DESCRIPTION_KEY) || '',
    category: read(PATTERN_SYNC_CATEGORY_KEY) || 'pattern',
  };
}

function exportSelectedPattern() {
  const { set, variant } = selectedPatternSetOrVariant();
  const source = primaryPatternVariant(set, variant);
  if (!source) throw new Error('Select a local Pattern component set or one of its breakpoint variants.');
  const meta = patternMetaFromNode(set || source);
  const { node, warnings } = exportContainerNode(source);
  const nodes = Array.isArray(node.nodes) ? node.nodes : [];
  const definition = {
    schemaVersion: '1.0',
    pattern: {
      id: meta.id,
      name: meta.name || 'Pattern',
      description: meta.description || '',
      category: meta.category || 'pattern',
      nodes,
    },
  };
  warnings.push(`Exported the ${breakpointFromVariantName(source) || 'selected'} Pattern variant as the A1 source pattern. Other breakpoint variants remain Figma-only previews for now.`);
  postPluginMessage({
    type: 'pattern-export-result',
    name: definition.pattern.name,
    json: JSON.stringify(definition, null, 2),
    warnings,
  });
}

function linkedPageRootName(link, title) {
  const projectLabel = typeof link.projectName === 'string' && link.projectName.trim()
    ? link.projectName.trim()
    : link.projectId;
  const pageLabel = typeof link.pageTitle === 'string' && link.pageTitle.trim()
    ? link.pageTitle.trim()
    : (title || link.pageId);
  return `A1 · ${projectLabel} / ${pageLabel}`;
}

function canBeLinkedPageRoot(node) {
  return Boolean(
    node &&
    ['FRAME', 'INSTANCE'].includes(node.type) &&
    typeof node.getPluginData === 'function' &&
    typeof node.setPluginData === 'function'
  );
}

function tagLinkedPageRoot(root, link, title) {
  if (!canBeLinkedPageRoot(root)) return root;
  root.name = linkedPageRootName(link, title);
  root.setPluginData(PAGE_SYNC_LINK_KEY, link.linkId);
  root.setPluginData('project-id', link.projectId);
  root.setPluginData('page-id', link.pageId);
  root.setPluginData('mode', link.mode || 'manual');
  return root;
}

function isLinkedPageRoot(node, link) {
  try {
    return canBeLinkedPageRoot(node) && node.getPluginData(PAGE_SYNC_LINK_KEY) === link.linkId;
  } catch {
    return false;
  }
}

function linkedRootFor(link) {
  const expectedId = link && link.figmaRootNodeId;
  if (expectedId) {
    try {
      const byId = resolveNodeById(expectedId);
      if (isLinkedPageRoot(byId, link)) return byId;
    } catch { /* Figma can retain an instance-subnode id after changes. */ }
  }
  return figma.currentPage.findOne((node) => {
    try { return isLinkedPageRoot(node, link); } catch { return false; }
  });
}

function prepareLinkedRoot(link, title) {
  let root = linkedRootFor(link);
  if (root && root.type !== 'FRAME') {
    try { root.remove(); } catch { /* Fall through and create a fresh frame root. */ }
    root = null;
  }
  if (!root) {
    root = figma.createFrame();
    figma.currentPage.appendChild(root);
    root.x = Math.round(figma.viewport.center.x);
    root.y = Math.round(figma.viewport.center.y);
  }
  // Legacy fallback for non-PageLayout payloads. Proper A1 pages tag the
  // PageLayout instance itself so PageLayout remains the top canvas layer.
  tagLinkedPageRoot(root, link, title);
  root.layoutMode = 'VERTICAL';
  root.primaryAxisSizingMode = 'AUTO';
  root.counterAxisSizingMode = 'FIXED';
  try { root.resizeWithoutConstraints(1200, Math.max(root.height, 1)); } catch { /* retain the existing root width */ }
  root.itemSpacing = 16;
  root.paddingLeft = 0;
  root.paddingRight = 0;
  root.paddingTop = 0;
  root.paddingBottom = 0;
  return root;
}

function pageLayoutDefinitionNode(data) {
  if (data && data.type === 'PageLayout') return data;
  if (data && data.page && data.page.layout && data.page.layout.type === 'PageLayout') return data.page.layout;
  if (data && data.layout && data.layout.type === 'PageLayout') return data.layout;
  return null;
}

function renderedPageLayoutRoot(instances, pageLayoutNode) {
  const expectedId = pageLayoutNode && typeof pageLayoutNode.id === 'string' ? pageLayoutNode.id : '';
  return (instances || []).find((node) => {
    try {
      return node.type === 'INSTANCE' &&
        registeredSetName(node) === 'Page Layout' &&
        (!expectedId || node.getPluginData('a1-json-id') === expectedId);
    } catch {
      return false;
    }
  }) || (instances || []).find((node) => {
    try { return node.type === 'INSTANCE' && registeredSetName(node) === 'Page Layout'; }
    catch { return false; }
  }) || null;
}

function moveRenderedRoots(nodes, dx, dy) {
  if (!Number.isFinite(dx) || !Number.isFinite(dy) || (dx === 0 && dy === 0)) return;
  for (const node of nodes || []) {
    try {
      if ('x' in node) node.x += dx;
      if ('y' in node) node.y += dy;
    } catch {
      // Ignore transient nodes; the render itself already succeeded.
    }
  }
}

async function handleLinkedPageImport(text, assets, link) {
  let parsed;
  try { parsed = JSON.parse(text); } catch (error) { postError('Not valid JSON: ' + error.message); return null; }
  const title = parsed && parsed.page && typeof parsed.page.name === 'string' ? parsed.page.name : link.pageId;
  const pageLayoutNode = pageLayoutDefinitionNode(parsed);
  if (pageLayoutNode) {
    const previousRoot = linkedRootFor(link);
    const targetX = previousRoot && 'x' in previousRoot ? previousRoot.x : Math.round(figma.viewport.center.x);
    const targetY = previousRoot && 'y' in previousRoot ? previousRoot.y : Math.round(figma.viewport.center.y);
    const result = await handleImport(text, assets, figma.currentPage, false);
    if (!result) return null;
    const renderedRoots = [...figma.currentPage.selection];
    const root = renderedPageLayoutRoot(renderedRoots, pageLayoutNode);
    if (!root) {
      postError('The page JSON rendered, but no PageLayout root was created.');
      return null;
    }
    moveRenderedRoots(renderedRoots, targetX - root.x, targetY - root.y);
    tagLinkedPageRoot(root, link, title);
    if (previousRoot && previousRoot.id !== root.id) {
      try { previousRoot.remove(); } catch { /* The previous linked root may already be gone. */ }
    }
    figma.currentPage.selection = [root];
    figma.viewport.scrollAndZoomIntoView([root]);
    return { ...result, rootNodeId: root.id, figmaPageId: figma.currentPage.id, figmaFileKey: figma.fileKey || '' };
  }
  const root = prepareLinkedRoot(link, title);
  const result = await handleImport(text, assets, root, true);
  if (!result) return null;
  figma.currentPage.selection = [root];
  figma.viewport.scrollAndZoomIntoView([root]);
  return { ...result, rootNodeId: root.id, figmaPageId: figma.currentPage.id, figmaFileKey: figma.fileKey || '' };
}

function figureJsonNodes(value, found = new Map()) {
  if (Array.isArray(value)) {
    value.forEach((item) => figureJsonNodes(item, found));
  } else if (value && typeof value === 'object') {
    if (value.type === 'Figure' && typeof value.id === 'string') found.set(value.id, value);
    Object.values(value).forEach((item) => figureJsonNodes(item, found));
  }
  return found;
}

/**
 * Collect image fills from Figures included in an exported Figma page and
 * replace only those Figure sources with stable local A1 image references.
 * The bytes travel beside page JSON and never become inline page data.
 */
async function collectPageFigureAssets(root, pageNode, warnings) {
  const figureNodes = figureJsonNodes(pageNode);
  if (figureNodes.size === 0) return [];
  let figures = [];
  try {
    figures = root.findAll((node) => node.type === 'INSTANCE' && registeredSetName(node) === 'Figure');
  } catch (error) {
    warnings.push(`Figure images could not be collected: ${error.message}`);
    return [];
  }
  const assets = [];
  const assetByHash = new Map();
  let totalBytes = 0;
  for (const candidate of figures) {
    try {
      const figure = currentInstance(candidate);
      const figureNode = figureNodes.get(componentId('Figure', figure));
      if (!figureNode) continue;
      const paint = imagePaintOn(figureImageLayer(figure));
      if (!paint || !paint.imageHash) continue;
      let asset = assetByHash.get(paint.imageHash);
      if (!asset) {
        const image = figma.getImageByHash(paint.imageHash);
        if (!image) {
          warnings.push(`Figure "${figure.name}" has an unavailable image fill; its source was left unchanged.`);
          continue;
        }
        const bytes = await image.getBytesAsync();
        const type = figureImageMime(bytes);
        if (bytes.byteLength === 0 || bytes.byteLength > LOCAL_FIGMA_IMAGE_MAX_BYTES || !type) {
          warnings.push(`Figure "${figure.name}" image was not synced; use a PNG, JPEG, or GIF up to 4 MB.`);
          continue;
        }
        if (assets.length >= 8 || totalBytes + bytes.byteLength > LOCAL_FIGMA_IMAGE_MAX_BYTES) {
          warnings.push(`Figure "${figure.name}" image was not synced because page image handoffs support up to 8 images and 4 MB total.`);
          continue;
        }
        const sourceName = componentText(figure, 'Source', '').trim() || figure.name || 'Figure image';
        asset = {
          id: `figma_${paint.imageHash.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 96)}`,
          name: sourceName.slice(0, 180),
          type,
          dataBase64: bytesToBase64(bytes),
        };
        assetByHash.set(paint.imageHash, asset);
        assets.push(asset);
        totalBytes += bytes.byteLength;
      }
      figureNode.props = { ...(figureNode.props || {}), src: `a1img://${asset.id}` };
    } catch (error) {
      warnings.push(`A Figure image was not synced: ${error.message}`);
    }
  }
  return assets;
}

async function exportLinkedPage(link) {
  const root = linkedRootFor(link);
  if (!root) throw new Error('The linked A1 page root was not found on this Figma page. Render it from A1 first.');
  const componentName = root.type === 'INSTANCE' ? registeredSetName(root) : null;
  const result = componentName && EXPORTERS[componentName]
    ? withBreakpointVisibility(root, EXPORTERS[componentName](root))
    : exportContainerNode(root);
  const { node, warnings } = result;
  const assets = await collectPageFigureAssets(root, node, warnings);
  const layout = pageLayoutForPageExport(node);
  return {
    json: JSON.stringify({
      schemaVersion: '1.0.0',
      page: {
        id: link.pageId,
        name: root.name.replace(/^A1 ·\s*/, '') || 'Untitled',
        layout,
      },
    }, null, 2),
    warnings,
    assets,
    rootNodeId: root.id,
    figmaPageId: figma.currentPage.id,
    figmaFileKey: figma.fileKey || '',
  };
}

function createPageLinkId() {
  return `figma-link-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Export the selected top-level Figma frame as a new, manually linked A1 page. */
async function exportNewA1Page(project) {
  if (!project || typeof project.id !== 'string' || !project.id) {
    throw new Error('Choose an A1 project before creating a page.');
  }
  let root = liveNode(topmostExportableNode());
  const isPageLayout = root && root.type === 'INSTANCE' && registeredSetName(root) === 'Page Layout';
  if (!root || (!isPageLayout && (root.type !== 'FRAME' || !canExportContainer(root)))) {
    throw new Error('Select one top-level Figma frame with supported A1 content, or one A1 Page Layout instance, before creating a page.');
  }
  const { node, warnings } = isPageLayout ? exportPageLayout(root) : exportContainerNode(root);
  const assets = await collectPageFigureAssets(root, node, warnings);
  root = liveNode(root);
  if (!root) {
    throw new Error('The selected Figma root changed while it was being exported. Select it again and retry.');
  }
  const title = pageTitleFromFigmaFrame(root);
  const linkId = createPageLinkId();
  const projectName = typeof project.name === 'string' && project.name.trim() ? project.name.trim() : project.id;
  // Name and tag the source frame now, so it can be discovered as the new
  // page's linked root as soon as A1 persists the generated page id.
  root.name = `A1 · ${projectName} / ${title}`;
  root.setPluginData(PAGE_SYNC_LINK_KEY, linkId);
  root.setPluginData('project-id', project.id);
  root.setPluginData('mode', 'manual');
  return {
    projectId: project.id,
    projectName,
    title,
    json: JSON.stringify({
      schemaVersion: '1.0.0',
      page: {
        id: `figma-${String(root.id).replace(/[^a-zA-Z0-9_-]+/g, '-')}`,
        name: title,
        layout: pageLayoutForPageExport(node),
      },
    }, null, 2),
    warnings,
    assets,
    figma: {
      linkId,
      figmaRootNodeId: root.id,
      figmaPageId: figma.currentPage.id,
      figmaFileKey: figma.fileKey || '',
    },
  };
}

function normalizedLinkFrameName(value) {
  return String(value || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase();
}

/**
 * Match an outer frame named `A1 · Project / Page` to the local A1 manifest.
 * A unique `A1 · Page` name is accepted as a convenient legacy fallback.
 */
function detectLinkedPageFromFrameNames(projects) {
  if (!Array.isArray(projects)) return null;
  const candidates = [];
  for (const project of projects) {
    if (!project || typeof project.id !== 'string' || !Array.isArray(project.pages)) continue;
    for (const page of project.pages) {
      if (!page || typeof page.id !== 'string') continue;
      const projectName = String(project.name || project.id).trim();
      const pageTitle = String(page.title || page.id).trim();
      candidates.push({
        project,
        page,
        fullName: normalizedLinkFrameName(`A1 · ${projectName} / ${pageTitle}`),
        pageOnlyName: normalizedLinkFrameName(`A1 · ${pageTitle}`),
      });
    }
  }
  for (const root of figma.currentPage.children) {
    if (!root || root.type !== 'FRAME') continue;
    const name = normalizedLinkFrameName(root.name);
    let match = candidates.find((candidate) => candidate.fullName === name);
    if (!match) {
      const pageOnly = candidates.filter((candidate) => candidate.pageOnlyName === name);
      if (pageOnly.length === 1) match = pageOnly[0];
    }
    if (!match) continue;
    const link = {
      ...(match.page.link || {}),
      linkId: match.page.link?.linkId || `figma-link-${match.project.id}-${match.page.id}`,
      projectId: match.project.id,
      pageId: match.page.id,
      mode: match.page.link?.mode || 'manual',
      projectName: String(match.project.name || ''),
      pageTitle: String(match.page.title || ''),
      figmaRootNodeId: root.id,
      figmaPageId: figma.currentPage.id,
      figmaFileKey: figma.fileKey || '',
    };
    root.setPluginData(PAGE_SYNC_LINK_KEY, link.linkId);
    root.setPluginData('project-id', link.projectId);
    root.setPluginData('page-id', link.pageId);
    return link;
  }
  return null;
}

// ─── Registries ──────────────────────────────────────────────────────────────


// ── Top Header (Breakpoint variants; Nav Items + Actions slots) ─────────────

function topHeaderSlot(instance, name) {
  return currentInstance(instance).findOne((node) => node.type === 'SLOT' && canonicalKey(node.name) === canonicalKey(name));
}

function exportTopHeader(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};

  const logoText = componentPropertyValue(instance, 'Logo text', 'TEXT');
  if (typeof logoText === 'string' && logoText) props.logoText = logoText;

  // Nav items are read regardless of the Breakpoint variant: xs/sm hide the
  // slot visually, but the composition is the breakpoint-agnostic source.
  const usedNavIds = new Set();
  const navItems = [];
  for (const nav of currentInstance(instance).findAll((node) => node.type === 'INSTANCE' && componentSetName(node) === 'Top Header Nav Item' && node.visible !== false)) {
    const label = componentPropertyValue(nav, 'Label', 'TEXT') || 'Nav item';
    const item = { id: slugifyOptionValue(label, usedNavIds), label };
    if (componentPropertyValue(nav, 'Show icon', 'BOOLEAN') === true) {
      const iconName = iconNameFromInstance(nav, 'Nav icon') || iconNameFromSwapValue(componentPropertyValue(nav, 'Icon', 'INSTANCE_SWAP'));
      if (iconName) item.icon = iconName;
      else warnings.push(`Nav item "${label}" has an icon that could not be resolved — icon omitted.`);
    }
    const state = componentPropertyValue(nav, 'State', 'VARIANT');
    if (state === 'active') item.active = true;
    if (state === 'hover') warnings.push(`Nav item "${label}" is in a visual-only hover state — no prop was emitted.`);
    navItems.push(item);
  }
  if (navItems.length > 0) props.navItems = navItems;

  const actionsSlot = topHeaderSlot(instance, 'Actions');
  const usedActionIds = new Set();
  const actions = [];
  if (actionsSlot) {
    // Direct slot children are the contract, but tolerate a wrapper frame
    // inside the slot (deep scan) so restructures don't silently drop actions.
    const isActionButton = (node) => node.type === 'INSTANCE' && componentSetName(node) === 'Icon Button' && node.visible !== false;
    let actionNodes = actionsSlot.children.filter(isActionButton);
    if (actionNodes.length === 0) actionNodes = actionsSlot.findAll(isActionButton);
    for (const action of actionNodes) {
      const label = componentText(action, 'Aria label', 'Action');
      const entry = { id: slugifyOptionValue(label, usedActionIds), label };
      const iconName = iconNameFromInstance(action, 'Icon') || iconNameFromSwapValue(componentPropertyValue(action, 'Icon', 'INSTANCE_SWAP'));
      if (iconName) entry.icon = iconName;
      const clickAction = actionForLinkedTarget(action);
      if (clickAction) {
        entry.actions = { onClick: clickAction };
        warnings.push(`Top Header action "${label}" is linked to ${ACTION_TRIGGER_TYPE_BY_ACTION[clickAction.type] || 'action target'} "${clickAction.target}".`);
      }
      actions.push(entry);
    }
    // A visible Button in the Actions slot is the sign-in affordance. It maps
    // to the React `loginButton` prop as `{ label }`; click behavior stays
    // runtime-owned.
    const loginButtons = actionsSlot.children.filter((node) => node.type === 'INSTANCE' && componentSetName(node) === 'Button' && node.visible !== false);
    if (loginButtons.length > 0) {
      props.loginButton = { label: componentText(loginButtons[0], 'Label', 'Sign in') };
    }
    if (loginButtons.length > 1) {
      warnings.push('Top Header supports one sign-in Button — only the first Button in the Actions slot was exported as loginButton.');
    }
  }
  if (actions.length > 0) props.actions = actions;

  // Breakpoint variants are visual preview state only; TopHeader stays fluid in JSON.

  return { node: { id: componentId('TopHeader', instance), type: 'TopHeader', props }, warnings };
}

function topHeaderContextForSelection(instance) {
  instance = currentInstance(instance);
  const result = exportTopHeader(instance);
  const props = result.node.props || {};
  const navItems = Array.isArray(props.navItems) ? props.navItems : [];
  const actions = Array.isArray(props.actions) ? props.actions : [];
  const showLoginProperty = componentPropertyValue(instance, 'Show login button', 'BOOLEAN');
  const showLogin = showLoginProperty === false ? false : Boolean(props.loginButton);
  const loginLabel = typeof props.loginButton === 'string'
    ? props.loginButton
    : props.loginButton && typeof props.loginButton === 'object' && typeof props.loginButton.label === 'string'
      ? props.loginButton.label
      : 'Sign in';
  return {
    logoText: typeof props.logoText === 'string' ? props.logoText : componentPropertyValue(instance, 'Logo text', 'TEXT') || '',
    navCount: navItems.length,
    navCountOptions: Array.from({ length: GROUP_SLOT_CONFIG.TopHeader.max + 1 }, (_, index) => String(index)),
    actionCount: actions.length,
    actionCountOptions: Array.from({ length: GROUP_SLOT_CONFIG.TopHeaderActions.max + 1 }, (_, index) => String(index)),
    showLogin,
    loginLabel,
    booleanOptions: ['false', 'true'],
  };
}

async function applyTopHeader(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};

  const assignments = {};
  // projectLayout chrome uses `logo` as the wordmark string; the catalog uses `logoText`.
  const wordmark = typeof props.logoText === 'string' ? props.logoText : (typeof props.logo === 'string' ? props.logo : undefined);
  if (wordmark !== undefined) queueComponentProperty(instance, assignments, 'Logo text', wordmark, 'TEXT', warnings);
  if ('loginButton' in props) queueComponentProperty(instance, assignments, 'Show login button', Boolean(props.loginButton), 'BOOLEAN', warnings);
  if (A1_BREAKPOINTS.includes(activeRenderBreakpoint)) {
    queueComponentProperty(instance, assignments, 'Breakpoint', activeRenderBreakpoint, 'VARIANT', warnings, 'Top Header breakpoint preview');
  }
  applyQueuedProperties(instance, assignments, warnings, 'Top Header properties');
  // loginButton carries `{ label }` (a legacy string is the label itself);
  // apply the label onto the sign-in Button in the Actions slot.
  const loginLabel = typeof props.loginButton === 'string'
    ? props.loginButton
    : (props.loginButton && typeof props.loginButton === 'object' && typeof props.loginButton.label === 'string' ? props.loginButton.label : undefined);
  if (loginLabel) {
    const applySlot = topHeaderSlot(instance, 'Actions');
    const loginInstance = applySlot && applySlot.children.find((child) => child.type === 'INSTANCE' && componentSetName(child) === 'Button');
    if (loginInstance) {
      const loginAssignments = {};
      queueComponentProperty(loginInstance, loginAssignments, 'Label', loginLabel, 'TEXT', warnings, 'Sign-in button label');
      applyQueuedProperties(loginInstance, loginAssignments, warnings, 'Sign-in button properties');
    } else {
      warnings.push('No sign-in Button instance exists in the Actions slot — the loginButton label was not applied.');
    }
  }
  if (props.navIconPosition !== undefined) {
    warnings.push('navIconPosition is a responsive runtime prop — nav icons show the start position via each item\'s Show icon.');
  }

  const navItems = Array.isArray(props.navItems)
    ? props.navItems.filter((item) => item && typeof item === 'object' && item.mobileOnly !== true && item.isHeader !== true)
    : [];
  const navInstances = await reconcileGroupOptionInstances(instance, 'TopHeader', 'Top Header Nav Item', navItems.length, warnings);
  for (let index = 0; index < Math.min(navInstances.length, navItems.length); index += 1) {
    const navInstance = currentInstance(navInstances[index]);
    const item = navItems[index];
    const label = typeof item.label === 'string' && item.label ? item.label : `Nav item ${index + 1}`;
    const hasSubmenu = Array.isArray(item.items) && item.items.length > 0;
    const navAssignments = {};
    queueComponentProperty(navInstance, navAssignments, 'Label', label, 'TEXT', warnings, `Nav item ${index + 1} label`);
    queueComponentProperty(navInstance, navAssignments, 'State', item.active === true ? 'active' : 'default', 'VARIANT', warnings, `Nav item ${index + 1} state`);
    queueComponentProperty(navInstance, navAssignments, 'Show icon', typeof item.icon === 'string' && item.icon.length > 0, 'BOOLEAN', warnings, `Nav item ${index + 1} icon visibility`);
    queueComponentProperty(navInstance, navAssignments, 'Show chevron', hasSubmenu, 'BOOLEAN', warnings, `Nav item ${index + 1} chevron`);
    if (typeof item.icon === 'string' && item.icon) {
      const iconComponent = findIconComponent(item.icon);
      if (iconComponent) queueComponentProperty(navInstance, navAssignments, 'Icon', iconComponent.id, 'INSTANCE_SWAP', warnings, `Nav item ${index + 1} icon`);
      else warnings.push(`No icon component named "${item.icon}" exists in this file — nav item "${label}" keeps the default glyph.`);
    }
    applyQueuedProperties(navInstance, navAssignments, warnings, `Nav item ${index + 1} properties`);
  }

  const actions = Array.isArray(props.actions)
    ? props.actions.filter((action) => action && typeof action === 'object')
    : [];
  const actionInstances = await reconcileGroupOptionInstances(instance, 'TopHeaderActions', 'Icon Button', actions.length, warnings);
  for (let index = 0; index < Math.min(actionInstances.length, actions.length); index += 1) {
    const actionInstance = currentInstance(actionInstances[index]);
    const action = actions[index];
    const label = typeof action.label === 'string' && action.label ? action.label : `Action ${index + 1}`;
    const actionAssignments = {};
    queueComponentProperty(actionInstance, actionAssignments, 'Aria label', label, 'TEXT', warnings, `Action ${index + 1} label`);
    if (typeof action.icon === 'string' && action.icon) {
      const iconComponent = findIconComponent(action.icon);
      if (iconComponent) queueComponentProperty(actionInstance, actionAssignments, 'Icon', iconComponent.id, 'INSTANCE_SWAP', warnings, `Action ${index + 1} icon`);
      else warnings.push(`No icon component named "${action.icon}" exists in this file — action "${label}" keeps the default glyph.`);
    }
    applyQueuedProperties(actionInstance, actionAssignments, warnings, `Action ${index + 1} properties`);
    if (activeActionTargetImportContext) {
      const actionMap = action.actions && typeof action.actions === 'object' ? action.actions : null;
      const clickAction = actionMap && actionMap.onClick && typeof actionMap.onClick === 'object'
        ? actionMap.onClick
        : action.action && typeof action.action === 'object'
          ? action.action
          : null;
      if (
        clickAction &&
        ACTION_TRIGGER_TYPE_BY_ACTION[clickAction.type] &&
        typeof clickAction.target === 'string' &&
        clickAction.target
      ) {
        activeActionTargetImportContext.pendingTriggers.push({ trigger: actionInstance, action: clickAction });
      }
    }
    if (action.badge !== undefined) warnings.push(`Action "${label}" badge is not represented on the Figma Icon Button instance.`);
    if (Array.isArray(action.items) && action.items.length > 0) warnings.push(`Action "${label}" dropdown items are runtime-owned — not represented.`);
  }

  return instance;
}

async function importTopHeader(node, warnings) {
  const instance = await createComponentInstance('Top Header', warnings);
  await applyTopHeader(instance, node, warnings);
  return instance;
}

// ── Page Layout (v1: Top Header + Page Content Slot) ────────────────────────

function pageLayoutContentSlot(instance) {
  return nativeSlot(currentInstance(instance), 'Page Content Slot')
    || nativeSlot(currentInstance(instance), 'Page content');
}

function pageLayoutTopHeader(instance) {
  try {
    return currentInstance(instance).findOne((node) => {
      try {
        return node.type === 'INSTANCE' && componentSetName(node) === 'Top Header' && node.visible !== false;
      } catch {
        return false;
      }
    });
  } catch {
    return null;
  }
}

function pageLayoutChildNodes(node) {
  if (Array.isArray(node.children)) {
    return node.children
      .filter((child) => child && typeof child === 'object')
      .filter((child) => !(
        activeActionTargetImportContext &&
        typeof child.id === 'string' &&
        activeActionTargetImportContext.targetNodes.has(child.id)
      ));
  }
  const collected = [];
  for (const key of ['nodes', 'regions']) {
    if (node && node[key]) collectSupportedNodes(node[key], collected);
  }
  return collected.filter((child) => !(
    activeActionTargetImportContext &&
    child &&
    typeof child === 'object' &&
    typeof child.id === 'string' &&
    activeActionTargetImportContext.targetNodes.has(child.id)
  ));
}

function exportPageLayout(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const children = [];
  const header = pageLayoutTopHeader(instance);
  if (header) {
    try {
      const result = exportTopHeader(header);
      children.push(result.node);
      for (const warning of result.warnings) warnings.push(warning);
    } catch (error) {
      warnings.push(`The Page Layout Top Header changed during export and was skipped: ${error.message}`);
    }
  }
  const slot = pageLayoutContentSlot(instance);
  if (slot) {
    try {
      children.push(...exportFreeContent(slot, warnings));
    } catch (error) {
      warnings.push(`The Page Content Slot changed during export and was skipped: ${error.message}`);
    }
  } else {
    warnings.push('No Page Content Slot was found — only the Top Header was exported.');
  }
  // Breakpoint variants and unsupported chrome slots are visual preview state;
  // PageLayout JSON exports the supported top header + main content contract.
  // The playground-preview flags suppress the configurator's placeholder
  // header/sidebar/footer slots so the exported children render alone.
  const props = { showHeader: false, showSidebar: false, showFooter: false };
  const node = { id: componentId('PageLayout', instance), type: 'PageLayout', props };
  if (children.length > 0) node.children = children;
  return { node, warnings };
}

function pageLayoutContextForSelection(instance) {
  instance = currentInstance(instance);
  const breakpoint = componentPropertyValue(instance, 'Breakpoint', 'VARIANT');
  return {
    breakpoint: A1_BREAKPOINTS.includes(breakpoint) ? breakpoint : 'xl',
    breakpointOptions: A1_BREAKPOINTS,
  };
}

async function applyPageLayout(instance, node, warnings) {
  if (A1_BREAKPOINTS.includes(activeRenderBreakpoint)) {
    const assignments = {};
    queueComponentProperty(instance, assignments, 'Breakpoint', activeRenderBreakpoint, 'VARIANT', warnings, 'Page Layout breakpoint preview');
    applyQueuedProperties(instance, assignments, warnings, 'Page Layout properties');
  }
  const children = pageLayoutChildNodes(node);
  const headerNode = children.find((child) => child.type === 'TopHeader');
  const headerInstance = pageLayoutTopHeader(instance);
  if (headerNode && headerInstance) await applyTopHeader(headerInstance, headerNode, warnings);
  else if (headerNode) warnings.push('No Top Header instance exists in this Page Layout — the TopHeader child was not applied.');

  const contentNodes = supportedChildren(children.filter((child) => child !== headerNode), warnings, 'Page Layout');
  let slot = pageLayoutContentSlot(instance);
  if (!slot) {
    if (contentNodes.length > 0) warnings.push('No Page Content Slot was found — content children were not rendered.');
    return instance;
  }
  for (const existing of [...slot.children]) {
    try { existing.remove(); } catch (error) {
      try { existing.visible = false; } catch (visibilityError) {
        warnings.push(`Page Layout placeholder could not be cleared: ${visibilityError.message}`);
      }
    }
  }
  for (const child of contentNodes) {
    const childInstance = await renderImportedNode(child, warnings);
    slot = pageLayoutContentSlot(instance);
    if (!slot) {
      warnings.push('Page Content Slot could not be refreshed — remaining child nodes were not rendered.');
      break;
    }
    appendImportedChild(slot, childInstance, child, warnings);
  }
  return instance;
}

async function importPageLayout(node, warnings) {
  const instance = await createComponentInstance('Page Layout', warnings);
  await applyPageLayout(instance, node, warnings);
  return instance;
}

// ── Bottom Sheet (mobile overlay shell + content slot) ──────────────────────

const BOTTOM_SHEET_DETENT_LABELS = {
  0: 'collapsed',
  1: 'half',
  2: 'full',
};

function bottomSheetDetentIndex(value, fallback = 1) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, Math.min(2, Math.round(value)));
  }
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return fallback;
  if (raw === '0' || raw.includes('collapsed') || raw.includes('closed')) return 0;
  if (raw === '1' || raw.includes('half') || raw.includes('medium') || raw.includes('mid')) return 1;
  if (raw === '2' || raw.includes('full') || raw.includes('expanded') || raw.includes('open')) return 2;
  return fallback;
}

function bottomSheetDetentProperty(instance) {
  for (const name of ['Default detent', 'Default Detent', 'Open state', 'Detent', 'State']) {
    const variant = componentProperty(instance, name, 'VARIANT');
    if (variant) return variant;
    const text = componentProperty(instance, name, 'TEXT');
    if (text) return text;
  }
  return null;
}

function bottomSheetDetentValueForProperty(property, index) {
  const wanted = BOTTOM_SHEET_DETENT_LABELS[index] || BOTTOM_SHEET_DETENT_LABELS[1];
  const current = String(property && property.property && property.property.value || '').trim();
  if (!current) return property && property.property && property.property.type === 'TEXT' ? String(index) : wanted;
  if (/^\d+$/.test(current)) return String(index);
  const lower = current.toLowerCase();
  if (lower === current) return wanted;
  if (current.toUpperCase() === current) return wanted.toUpperCase();
  return wanted.charAt(0).toUpperCase() + wanted.slice(1);
}

function bottomSheetContentSlot(instance) {
  const current = currentInstance(instance);
  for (const name of ['Content Slot', 'Sheet Content Slot', 'Bottom Sheet Content Slot', 'Body Slot', 'Content', 'Body']) {
    const slot = nativeSlot(current, name) || namedSlot(current, name);
    if (slot) return slot;
  }
  return null;
}

function exportBottomSheet(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};
  const title = componentText(instance, 'Title', '');
  if (title.trim()) props.title = title.trim();
  const detentProp = bottomSheetDetentProperty(instance);
  if (detentProp) {
    const defaultDetent = bottomSheetDetentIndex(detentProp.property.value, 1);
    if (defaultDetent !== 1) props.defaultDetent = defaultDetent;
  }
  const slot = bottomSheetContentSlot(instance);
  const children = slot ? exportFreeContent(slot, warnings) : [];
  if (!slot) warnings.push('Bottom Sheet content slot was not found — only sheet props were exported.');
  warnings.push('Bottom Sheet is mobile-only at runtime; detents and drag behavior are represented as a static Figma preview.');
  const node = { id: componentId('BottomSheet', instance), type: 'BottomSheet' };
  if (Object.keys(props).length) node.props = props;
  if (children.length) node.children = children;
  return { node, warnings };
}

async function applyBottomSheet(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const assignments = {};
  if (typeof props.title === 'string') {
    queueComponentProperty(instance, assignments, 'Title', props.title, 'TEXT', warnings, 'Bottom Sheet title');
  }
  const detentProp = bottomSheetDetentProperty(instance);
  if (detentProp) {
    assignments[detentProp.key] = bottomSheetDetentValueForProperty(detentProp, bottomSheetDetentIndex(props.defaultDetent, 1));
  } else if (props.defaultDetent !== undefined || props.detent !== undefined) {
    warnings.push('Bottom Sheet detent could not be applied — no matching Figma property was found.');
  }
  applyQueuedProperties(instance, assignments, warnings, 'Bottom Sheet properties');

  const children = supportedChildren(node.children || [], warnings, 'Bottom Sheet');
  if (children.length > 0) {
    let slot = bottomSheetContentSlot(instance);
    if (!slot) {
      warnings.push('Bottom Sheet content slot was not found — children were not rendered.');
    } else {
      for (const existing of [...slot.children]) {
        try { existing.remove(); } catch (error) {
          try { existing.visible = false; } catch (visibilityError) {
            warnings.push(`Bottom Sheet placeholder could not be cleared: ${visibilityError.message}`);
          }
        }
      }
      for (const child of children) {
        const childInstance = await renderImportedNode(child, warnings);
        slot = bottomSheetContentSlot(instance);
        if (!slot) {
          warnings.push('Bottom Sheet content slot could not be refreshed — remaining child nodes were not rendered.');
          break;
        }
        appendImportedChild(slot, childInstance, child, warnings);
      }
    }
  }
  if (props.detents !== undefined) warnings.push('Bottom Sheet detents are runtime-owned in the current Figma component — defaultDetent is the only preview state applied.');
  for (const runtimeProp of ['detent', 'onDetentChange', 'className', 'id']) {
    if (props[runtimeProp] !== undefined) warnings.push(`"${runtimeProp}" has no Figma representation — ignored.`);
  }
  return instance;
}

async function importBottomSheet(node, warnings) {
  const instance = await createComponentInstance('Bottom Sheet', warnings);
  await applyBottomSheet(instance, node, warnings);
  return instance;
}

// ── Chip Group (Chip slot reconciliation) ───────────────────────────────────

const CHIP_SIZES = ['sm', 'md', 'lg'];

function exportChipGroup(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};
  const groupLabel = componentText(instance, 'Label', '');
  if (componentBoolean(instance, 'Show label', false) && groupLabel.trim()) props.label = groupLabel.trim();
  const chips = groupOptionInstancesInSlot(instance, 'Chip slot', 'Chip');
  const usedIds = new Set();
  const items = [];
  let anyMenu = false;
  let size = null;
  for (const chip of chips) {
    if (chip.visible === false) continue;
    const title = componentText(chip, 'Label', 'Chip');
    const item = { id: slugifyOptionValue(title, usedIds), title };
    if (componentBoolean(chip, 'Show icon', false)) {
      const iconName = iconNameFromInstance(chip, 'Icon') || iconNameFromSwapValue(componentPropertyValue(chip, 'Icon', 'INSTANCE_SWAP'));
      if (iconName) item.icon = iconName;
    }
    // Per-item flags: the group `behavior` is a selection semantic, not a
    // visual state, so carets/selection/disabled travel on each item.
    if (componentBoolean(chip, 'Show caret', false)) { item.menu = true; anyMenu = true; }
    const state = componentPropertyValue(chip, 'State', 'VARIANT');
    if (state === 'selected') item.selected = true;
    if (state === 'disabled') item.disabled = true;
    const chipSize = componentPropertyValue(chip, 'Size', 'VARIANT');
    if (!size && CHIP_SIZES.includes(chipSize)) size = chipSize;
    items.push(item);
  }
  if (items.length > 0) props.items = items;
  if (size && size !== 'md') props.size = size;
  if (anyMenu) warnings.push('A chip shows the menu caret — a1-web previews representative menu items; real menu contents are runtime-owned.');
  return { node: { id: componentId('ChipGroup', instance), type: 'ChipGroup', props }, warnings };
}

async function applyChipGroup(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const assignments = {};
  queueComponentProperty(instance, assignments, 'Label', typeof props.label === 'string' ? props.label : '', 'TEXT', warnings, 'Chip Group label');
  queueComponentProperty(instance, assignments, 'Show label', typeof props.label === 'string' && props.label.trim().length > 0, 'BOOLEAN', warnings, 'Chip Group label visibility');
  applyQueuedProperties(instance, assignments, warnings, 'Chip Group properties');
  const behavior = typeof props.behavior === 'string' ? props.behavior : 'multiple';
  const size = CHIP_SIZES.includes(props.size) ? props.size : 'md';
  const items = Array.isArray(props.items) ? props.items.filter((item) => item && typeof item === 'object') : [];
  const chipInstances = await reconcileGroupOptionInstances(instance, 'ChipGroup', 'Chip', items.length, warnings);
  for (let index = 0; index < Math.min(chipInstances.length, items.length); index += 1) {
    const chip = groupOptionInstancesInSlot(currentInstance(instance), 'Chip slot', 'Chip')[index];
    if (!chip) break;
    const item = items[index];
    const title = typeof item.title === 'string' && item.title ? item.title : `Chip ${index + 1}`;
    const chipAssignments = {};
    queueComponentProperty(chip, chipAssignments, 'Label', title, 'TEXT', warnings, `Chip ${index + 1} label`);
    queueComponentProperty(chip, chipAssignments, 'Size', size, 'VARIANT', warnings, `Chip ${index + 1} size`);
    const selectable = behavior === 'single' || behavior === 'multiple';
    const hasExplicitStates = items.some((entry) => entry.selected === true || entry.disabled === true);
    const state = item.disabled === true
      ? 'disabled'
      : item.selected === true || (!hasExplicitStates && selectable && index === 0) ? 'selected' : 'default';
    queueComponentProperty(chip, chipAssignments, 'State', state, 'VARIANT', warnings, `Chip ${index + 1} state`);
    queueComponentProperty(chip, chipAssignments, 'Show icon', typeof item.icon === 'string' && item.icon.length > 0, 'BOOLEAN', warnings, `Chip ${index + 1} icon visibility`);
    queueComponentProperty(chip, chipAssignments, 'Show caret', item.menu === true || behavior === 'menu', 'BOOLEAN', warnings, `Chip ${index + 1} caret`);
    if (typeof item.icon === 'string' && item.icon) {
      const iconComponent = findIconComponent(item.icon);
      if (iconComponent) queueComponentProperty(chip, chipAssignments, 'Icon', iconComponent.id, 'INSTANCE_SWAP', warnings, `Chip ${index + 1} icon`);
      else warnings.push(`No icon component named "${item.icon}" exists in this file — chip "${title}" keeps the default glyph.`);
    }
    applyQueuedProperties(chip, chipAssignments, warnings, `Chip ${index + 1} properties`);
    if (behavior === 'navigation' && item.href) warnings.push(`Chip "${title}" href is runtime navigation — not represented in Figma.`);
  }
  if (behavior === 'menu' || items.some((entry) => entry.menu === true)) warnings.push('Menu chip contents are runtime-owned — only the caret affordance was applied.');
  return instance;
}

function exportChip(instance) {
  // A lone Chip exports as a one-item ChipGroup: the page-definition schema
  // has no standalone Chip node.
  instance = currentInstance(instance);
  const warnings = [];
  const title = componentText(instance, 'Label', 'Chip');
  const item = { id: slugifyOptionValue(title, new Set()), title };
  if (componentBoolean(instance, 'Show icon', false)) {
    const iconName = iconNameFromInstance(instance, 'Icon') || iconNameFromSwapValue(componentPropertyValue(instance, 'Icon', 'INSTANCE_SWAP'));
    if (iconName) item.icon = iconName;
  }
  const props = { items: [item] };
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  if (CHIP_SIZES.includes(size) && size !== 'md') props.size = size;
  if (componentBoolean(instance, 'Show caret', false)) item.menu = true;
  const state = componentPropertyValue(instance, 'State', 'VARIANT');
  if (state === 'selected') item.selected = true;
  if (state === 'disabled') item.disabled = true;
  warnings.push('A single Chip exports as a one-item ChipGroup node.');
  return { node: { id: componentId('ChipGroup', instance), type: 'ChipGroup', props }, warnings };
}

async function applyChip(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const items = Array.isArray(props.items) ? props.items.filter((item) => item && typeof item === 'object') : [];
  const item = items[0] || {};
  const title = typeof item.title === 'string' && item.title ? item.title : 'Chip';
  const assignments = {};
  queueComponentProperty(instance, assignments, 'Label', title, 'TEXT', warnings, 'Chip label');
  if (CHIP_SIZES.includes(props.size)) queueComponentProperty(instance, assignments, 'Size', props.size, 'VARIANT', warnings, 'Chip size');
  queueComponentProperty(instance, assignments, 'Show icon', typeof item.icon === 'string' && item.icon.length > 0, 'BOOLEAN', warnings, 'Chip icon visibility');
  const chipState = item.disabled === true ? 'disabled' : item.selected === true ? 'selected' : 'default';
  queueComponentProperty(instance, assignments, 'State', chipState, 'VARIANT', warnings, 'Chip state');
  queueComponentProperty(instance, assignments, 'Show caret', item.menu === true || props.behavior === 'menu', 'BOOLEAN', warnings, 'Chip caret');
  if (typeof item.icon === 'string' && item.icon) {
    const iconComponent = findIconComponent(item.icon);
    if (iconComponent) queueComponentProperty(instance, assignments, 'Icon', iconComponent.id, 'INSTANCE_SWAP', warnings, 'Chip icon');
    else warnings.push(`No icon component named "${item.icon}" exists in this file — the chip keeps the default glyph.`);
  }
  applyQueuedProperties(instance, assignments, warnings, 'Chip properties');
  if (items.length > 1) warnings.push('Only the first ChipGroup item was applied to the selected single Chip.');
  return instance;
}

async function importChipGroup(node, warnings) {
  const instance = await createComponentInstance('Chip Group', warnings);
  await applyChipGroup(instance, node, warnings);
  return instance;
}

// ── Data Table (column-slot model) ──────────────────────────────────────────

const DATA_TABLE_MAX_COLUMNS = 10;
const DATA_TABLE_MAX_ROWS = 20;
const DATA_TABLE_CONTEXT_COLUMN_OPTIONS = Array.from({ length: DATA_TABLE_MAX_COLUMNS }, (_, index) => String(index + 1));
const DATA_TABLE_CONTEXT_ROW_OPTIONS = ['1', '2', '3', '4', '5', '10', '20'];

function dataTableFlexibleSlot(root, names, requiredKeyPart, childComponentName) {
  const liveRoot = currentInstance(root);
  for (const name of names) {
    const slot = nativeSlot(liveRoot, name);
    if (slot) return slot;
  }
  try {
    const candidates = liveRoot.findAll((node) => {
      try {
        if (node.type !== 'SLOT' && node.type !== 'FRAME' && node.type !== 'GROUP') return false;
        const key = canonicalKey(node.name);
        if (requiredKeyPart && !key.includes(requiredKeyPart)) return false;
        if (key.includes('slot')) return true;
        return Boolean(childComponentName && node.findOne((child) => child.type === 'INSTANCE' && componentSetName(child) === childComponentName));
      } catch {
        return false;
      }
    });
    return candidates.find((node) => canonicalKey(node.name).includes('slot')) || candidates[0] || null;
  } catch {
    return null;
  }
}

function dataTableColumnsSlot(instance) {
  return dataTableFlexibleSlot(instance, ['Columns Slot', 'Column Slot', 'Columns'], 'column', 'Data Table Column');
}

function dataTableColumnInstances(instance, options = {}) {
  const slot = dataTableColumnsSlot(instance);
  const includeHidden = options.includeHidden === true;
  const isColumn = (node) => {
    try { return node.type === 'INSTANCE' && componentSetName(node) === 'Data Table Column' && (includeHidden || node.visible !== false); }
    catch { return false; }
  };
  if (!slot) return [];
  try {
    const direct = slot.children.filter(isColumn);
    return direct.length > 0 ? direct : slot.findAll(isColumn);
  } catch {
    return [];
  }
}

function dataTableHeaderCell(column) {
  try {
    return currentInstance(column).findOne((node) => node.type === 'INSTANCE' && componentSetName(node) === 'Data Table Header Cell' && node.visible !== false);
  } catch {
    return null;
  }
}

function dataTableColumnCellSlot(column) {
  return dataTableFlexibleSlot(column, ['Cell Slot', 'Cells Slot', 'Cells'], 'cell', 'Data Table Cell');
}

function dataTableColumnCells(column, options = {}) {
  const slot = dataTableColumnCellSlot(column);
  const includeHidden = options.includeHidden === true;
  const isCell = (node) => {
    try { return node.type === 'INSTANCE' && componentSetName(node) === 'Data Table Cell' && (includeHidden || node.visible !== false); }
    catch { return false; }
  };
  if (!slot) return [];
  try {
    const direct = slot.children.filter(isCell);
    return direct.length > 0 ? direct : slot.findAll(isCell);
  } catch {
    return [];
  }
}

function dataTableLegacyHeaderCells(instance) {
  return currentInstance(instance).findAll((node) => node.type === 'INSTANCE' && componentSetName(node) === 'Data Table Header Cell');
}

function dataTableLegacyRowFrames(instance) {
  return currentInstance(instance).findAll((node) => node.type === 'FRAME' && /^Row \d+$/.test(node.name));
}

function exportDataTable(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const usedKeys = new Set();
  const columns = [];
  let defaultSort = null;
  const columnInstances = dataTableColumnInstances(instance);
  const headerCells = columnInstances.length > 0
    ? columnInstances.map(dataTableHeaderCell).filter(Boolean)
    : dataTableLegacyHeaderCells(instance);
  for (const header of headerCells) {
    if (header.visible === false) continue;
    const label = componentText(header, 'Label', `Column ${columns.length + 1}`);
    const sort = componentPropertyValue(header, 'Sort', 'VARIANT');
    const align = componentPropertyValue(header, 'Align', 'VARIANT');
    const column = { key: slugifyOptionValue(label, usedKeys), label };
    if (sort && sort !== 'none') column.sortable = true;
    if (align === 'end') column.align = 'end';
    if ((sort === 'ascending' || sort === 'descending') && !defaultSort) {
      defaultSort = { key: column.key, direction: sort === 'descending' ? 'desc' : 'asc' };
    }
    columns.push(column);
  }
  const rows = [];
  if (columnInstances.length > 0) {
    const cellsByColumn = columnInstances.map(dataTableColumnCells);
    const rowCount = Math.max(0, ...cellsByColumn.map((cells) => cells.length));
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
      const row = { id: `row-${rowIndex + 1}` };
      cellsByColumn.forEach((cells, columnIndex) => {
        const cell = cells[rowIndex];
        if (!cell || cell.visible === false || !columns[columnIndex]) return;
        row[columns[columnIndex].key] = componentText(cell, 'Value', '');
      });
      rows.push(row);
    }
  } else {
    for (const frame of dataTableLegacyRowFrames(instance)) {
      if (frame.visible === false) continue;
      const cells = frame.children.filter((node) => node.type === 'INSTANCE' && componentSetName(node) === 'Data Table Cell');
      const row = { id: `row-${rows.length + 1}` };
      cells.forEach((cell, index) => {
        if (cell.visible === false || !columns[index]) return;
        row[columns[index].key] = componentText(cell, 'Value', '');
      });
      rows.push(row);
    }
  }
  const props = {};
  if (columns.length > 0) props.columns = columns;
  if (rows.length > 0) props.rows = rows;
  if (defaultSort) props.defaultSort = defaultSort;
  if (columnInstances.length > 0) {
    const zebraCells = columnInstances.flatMap(dataTableColumnCells).filter((cell) => componentPropertyValue(cell, 'stripe', 'VARIANT') === 'zebra');
    if (zebraCells.length > 0) props.zebra = true;
  }
  for (const runtimeProp of ['size', 'selectable', 'search', 'pagination', 'notices', 'scrollable', 'mobileLayout']) {
    if (props[runtimeProp] !== undefined) warnings.push(`DataTable ${runtimeProp} is runtime-owned in Figma and was not exported.`);
  }
  return { node: { id: componentId('DataTable', instance), type: 'DataTable', props }, warnings };
}

function dataTableContextForSelection(instance) {
  instance = currentInstance(instance);
  const result = exportDataTable(instance);
  const props = result.node.props || {};
  const columns = Array.isArray(props.columns) ? props.columns : [];
  const rows = Array.isArray(props.rows) ? props.rows : [];
  const columnCount = Math.max(1, Math.min(DATA_TABLE_MAX_COLUMNS, columns.length || dataTableColumnInstances(instance).length || dataTableLegacyHeaderCells(instance).filter((header) => header.visible !== false).length || 1));
  const rowCount = Math.max(1, Math.min(DATA_TABLE_MAX_ROWS, rows.length || 1));
  return {
    columnCount,
    columnCountOptions: DATA_TABLE_CONTEXT_COLUMN_OPTIONS,
    rowCount,
    rowCountOptions: DATA_TABLE_CONTEXT_ROW_OPTIONS,
    zebra: props.zebra === true,
    booleanOptions: ['false', 'true'],
    widthMode: layoutWidthMode(instance),
    heightMode: layoutHeightMode(instance),
  };
}

function dataTablePropsFromDataInput(input = {}) {
  const sourceRows = Array.isArray(input.rows) ? input.rows.filter((row) => row && typeof row === 'object') : [];
  const sourceColumns = Array.isArray(input.columns) ? input.columns.filter((column) => column && typeof column === 'object') : [];
  const usedKeys = new Set();
  const sourceKeyByOutputKey = {};
  const columns = sourceColumns.slice(0, DATA_TABLE_MAX_COLUMNS).map((column, index) => {
    const sourceKey = typeof column.key === 'string' && column.key.trim() ? column.key.trim() : '';
    const labelSource = typeof column.label === 'string' && column.label.trim()
      ? column.label.trim()
      : (typeof column.name === 'string' && column.name.trim() ? column.name.trim() : '');
    const label = labelSource || sourceKey || `Column ${index + 1}`;
    const key = sourceKey && !usedKeys.has(sourceKey) ? sourceKey : slugifyOptionValue(label, usedKeys);
    if (sourceKey && !usedKeys.has(sourceKey)) usedKeys.add(sourceKey);
    sourceKeyByOutputKey[key] = sourceKey || key;
    return {
      key,
      label,
      ...(column.align === 'end' ? { align: 'end' } : {}),
    };
  });
  if (!columns.length) {
    sourceRows.forEach((row) => {
      Object.keys(row).forEach((sourceKey) => {
        if (sourceKey === 'id' || sourceKey === '__id' || columns.length >= DATA_TABLE_MAX_COLUMNS) return;
        if (columns.some((column) => sourceKeyByOutputKey[column.key] === sourceKey)) return;
        const key = sourceKey && !usedKeys.has(sourceKey) ? sourceKey : slugifyOptionValue(sourceKey || `Column ${columns.length + 1}`, usedKeys);
        if (sourceKey && !usedKeys.has(sourceKey)) usedKeys.add(sourceKey);
        sourceKeyByOutputKey[key] = sourceKey;
        columns.push({ key, label: sourceKey || `Column ${columns.length + 1}` });
      });
    });
  }
  if (!columns.length) columns.push({ key: 'column-1', label: 'Column 1' });
  const rows = sourceRows.slice(0, DATA_TABLE_MAX_ROWS).map((sourceRow, rowIndex) => {
    const row = {
      id: typeof sourceRow.id === 'string' && sourceRow.id ? sourceRow.id : `row-${rowIndex + 1}`,
    };
    columns.forEach((column) => {
      const sourceKey = sourceKeyByOutputKey[column.key] || column.key;
      const value = sourceRow[sourceKey];
      row[column.key] = value === undefined || value === null ? '' : String(value);
    });
    return row;
  });
  return { columns, rows: rows.length ? rows : [{ id: 'row-1' }] };
}

function dataTablePropsWithShape(props, columnCount, rowCount) {
  const usedKeys = new Set();
  const sourceColumns = Array.isArray(props.columns) ? props.columns.filter((column) => column && typeof column === 'object') : [];
  const columns = sourceColumns.slice(0, columnCount).map((column, index) => {
    const label = typeof column.label === 'string' && column.label.trim() ? column.label.trim() : `Column ${index + 1}`;
    const rawKey = typeof column.key === 'string' && column.key.trim() ? column.key.trim() : '';
    const key = rawKey && !usedKeys.has(rawKey) ? rawKey : slugifyOptionValue(label, usedKeys);
    if (rawKey && !usedKeys.has(rawKey)) usedKeys.add(rawKey);
    return {
      ...column,
      key,
      label,
    };
  });
  while (columns.length < columnCount) {
    const label = `Column ${columns.length + 1}`;
    columns.push({ key: slugifyOptionValue(label, usedKeys), label });
  }

  const rows = (Array.isArray(props.rows) ? props.rows.filter((row) => row && typeof row === 'object') : [])
    .slice(0, rowCount)
    .map((row, index) => {
      const next = {
        ...row,
        id: typeof row.id === 'string' && row.id ? row.id : `row-${index + 1}`,
      };
      columns.forEach((column) => {
        if (next[column.key] === undefined || next[column.key] === null) next[column.key] = '';
      });
      return next;
    });
  while (rows.length < rowCount) {
    const row = { id: `row-${rows.length + 1}` };
    columns.forEach((column) => {
      row[column.key] = '';
    });
    rows.push(row);
  }

  const nextProps = { columns, rows };
  if (props.defaultSort && columns.some((column) => column.key === props.defaultSort.key)) {
    nextProps.defaultSort = props.defaultSort;
  }
  return nextProps;
}

async function reconcileDataTableColumns(instance, requestedCount, warnings) {
  const slot = dataTableColumnsSlot(instance);
  if (!slot) {
    warnings.push('Data Table Columns Slot could not be found — columns were not reconciled.');
    return dataTableColumnInstances(instance);
  }
  const wanted = Math.max(1, Math.min(requestedCount || 1, DATA_TABLE_MAX_COLUMNS));
  let columns = dataTableColumnInstances(instance, { includeHidden: true });
  let source = null;
  while (columns.length < wanted) {
    const liveSlot = dataTableColumnsSlot(currentInstance(instance));
    if (!liveSlot) break;
    const template = columns[columns.length - 1] || columns[0] || null;
    if (template && typeof template.clone === 'function') {
      const clone = template.clone();
      try { clone.visible = true; } catch { /* nested visibility can be locked */ }
      liveSlot.appendChild(clone);
    } else {
      if (!source) source = await findComponentSourceAsync('Data Table Column', warnings);
      if (!source) break;
      liveSlot.appendChild(source.createInstance());
    }
    columns = dataTableColumnInstances(currentInstance(instance), { includeHidden: true });
  }
  if (columns.length < wanted) warnings.push('Data Table Columns could not be added because no local column template or A1 library component was available.');
  columns = dataTableColumnInstances(currentInstance(instance), { includeHidden: true });
  columns.forEach((column, index) => {
    const shouldShow = index < wanted;
    try { column.visible = shouldShow; } catch { /* nested visibility can be locked */ }
    if (!shouldShow && column.visible !== false) {
      try { column.remove(); } catch { /* library-owned child cannot be removed */ }
    }
  });
  return dataTableColumnInstances(currentInstance(instance));
}

async function reconcileDataTableCells(column, requestedCount, warnings) {
  const slot = dataTableColumnCellSlot(column);
  if (!slot) {
    warnings.push('Data Table Column Cell Slot could not be found — cells were not reconciled.');
    return dataTableColumnCells(column);
  }
  const wanted = Math.max(1, Math.min(requestedCount || 1, DATA_TABLE_MAX_ROWS));
  let cells = dataTableColumnCells(column, { includeHidden: true });
  let source = null;
  while (cells.length < wanted) {
    const liveSlot = dataTableColumnCellSlot(currentInstance(column));
    if (!liveSlot) break;
    const template = cells[cells.length - 1] || cells[0] || null;
    if (template && typeof template.clone === 'function') {
      const clone = template.clone();
      try { clone.visible = true; } catch { /* nested visibility can be locked */ }
      liveSlot.appendChild(clone);
    } else {
      if (!source) source = await findComponentSourceAsync('Data Table Cell', warnings);
      if (!source) break;
      liveSlot.appendChild(source.createInstance());
    }
    cells = dataTableColumnCells(currentInstance(column), { includeHidden: true });
  }
  if (cells.length < wanted) warnings.push('Data Table Cells could not be added because no local cell template or A1 library component was available.');
  cells = dataTableColumnCells(currentInstance(column), { includeHidden: true });
  cells.forEach((cell, index) => {
    const shouldShow = index < wanted;
    try { cell.visible = shouldShow; } catch { /* nested visibility can be locked */ }
    if (!shouldShow && cell.visible !== false) {
      try { cell.remove(); } catch { /* library-owned child cannot be removed */ }
    }
  });
  return dataTableColumnCells(currentInstance(column));
}

async function applyDataTable(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const columns = Array.isArray(props.columns) ? props.columns.filter((column) => column && typeof column === 'object') : [];
  const rows = Array.isArray(props.rows) ? props.rows.filter((row) => row && typeof row === 'object') : [];
  if (columns.length > DATA_TABLE_MAX_COLUMNS) warnings.push(`The Figma Data Table shows up to ${DATA_TABLE_MAX_COLUMNS} columns — additional JSON columns were not rendered.`);
  if (rows.length > DATA_TABLE_MAX_ROWS) warnings.push(`The Figma Data Table shows up to ${DATA_TABLE_MAX_ROWS} rows — additional JSON rows were not rendered.`);
  const defaultSort = props.defaultSort && typeof props.defaultSort === 'object' ? props.defaultSort : null;

  let tableColumns = dataTableColumnInstances(instance);
  if (tableColumns.length > 0 || dataTableColumnsSlot(instance)) {
    tableColumns = await reconcileDataTableColumns(instance, columns.length || tableColumns.length || 1, warnings);
    for (let index = 0; index < tableColumns.length; index += 1) {
      const column = columns[index];
      const columnInstance = currentInstance(tableColumns[index]);
      const header = dataTableHeaderCell(columnInstance);
      if (header && column) {
        const assignments = {};
        queueComponentProperty(header, assignments, 'Label', typeof column.label === 'string' ? column.label : `Column ${index + 1}`, 'TEXT', warnings, `Column ${index + 1} label`);
        const sorted = defaultSort && defaultSort.key === column.key;
        const sortValue = sorted ? (defaultSort.direction === 'desc' ? 'descending' : 'ascending') : (column.sortable ? 'unsorted' : 'none');
        queueComponentProperty(header, assignments, 'Sort', sortValue, 'VARIANT', warnings, `Column ${index + 1} sort`);
        queueComponentProperty(header, assignments, 'Align', column.align === 'end' ? 'end' : 'start', 'VARIANT', warnings, `Column ${index + 1} align`);
        applyQueuedProperties(header, assignments, warnings, `Column ${index + 1} properties`);
      }
      const cells = await reconcileDataTableCells(columnInstance, rows.length || dataTableColumnCells(columnInstance).length || 1, warnings);
      cells.forEach((cell, rowIndex) => {
        const row = rows[rowIndex];
        const value = row && column ? row[column.key] : '';
        const assignments = {};
        queueComponentProperty(cell, assignments, 'Value', value === undefined || value === null ? '' : String(value), 'TEXT', warnings, `Row ${rowIndex + 1} ${column ? column.key : `column-${index + 1}`}`);
        queueComponentProperty(cell, assignments, 'Align', column && column.align === 'end' ? 'end' : 'start', 'VARIANT', warnings, `Row ${rowIndex + 1} align`);
        queueOptionalComponentProperty(cell, assignments, 'Type', 'Text', 'VARIANT');
        queueOptionalComponentProperty(cell, assignments, 'stripe', props.zebra === true && rowIndex % 2 === 1 ? 'zebra' : 'Default', 'VARIANT');
        applyQueuedProperties(cell, assignments, warnings, `Row ${rowIndex + 1} cell properties`);
        try { cell.strokeBottomWeight = rowIndex === cells.length - 1 ? 0 : 1; } catch { /* stroke override unavailable */ }
      });
    }
    return instance;
  }

  const headers = dataTableLegacyHeaderCells(instance);
  headers.forEach((header, index) => {
    const column = columns[index];
    const inRange = Boolean(column) && index < DATA_TABLE_MAX_COLUMNS;
    // With no columns supplied, keep the existing composition untouched.
    if (columns.length === 0) return;
    try { header.visible = inRange; } catch (error) { /* nested visibility can be locked */ }
    if (!inRange) return;
    const assignments = {};
    queueComponentProperty(header, assignments, 'Label', typeof column.label === 'string' ? column.label : `Column ${index + 1}`, 'TEXT', warnings, `Column ${index + 1} label`);
    const sorted = defaultSort && defaultSort.key === column.key;
    const sortValue = sorted ? (defaultSort.direction === 'desc' ? 'descending' : 'ascending') : (column.sortable ? 'unsorted' : 'none');
    queueComponentProperty(header, assignments, 'Sort', sortValue, 'VARIANT', warnings, `Column ${index + 1} sort`);
    queueComponentProperty(header, assignments, 'Align', column.align === 'end' ? 'end' : 'start', 'VARIANT', warnings, `Column ${index + 1} align`);
    applyQueuedProperties(header, assignments, warnings, `Column ${index + 1} properties`);
  });

  const frames = dataTableLegacyRowFrames(instance);
  const visibleRows = Math.min(rows.length, DATA_TABLE_MAX_ROWS, frames.length);
  frames.forEach((frame, rowIndex) => {
    const row = rows[rowIndex];
    const isVisible = Boolean(row) && rowIndex < DATA_TABLE_MAX_ROWS;
    if (rows.length > 0) {
      try { frame.visible = isVisible; } catch (error) { /* nested visibility can be locked */ }
    }
    if (!isVisible && rows.length > 0) return;
    const cells = frame.children.filter((n) => n.type === 'INSTANCE' && componentSetName(n) === 'Data Table Cell');
    cells.forEach((cell, colIndex) => {
      const column = columns[colIndex];
      const inColumn = Boolean(column) && colIndex < DATA_TABLE_MAX_COLUMNS;
      if (columns.length > 0) {
        try { cell.visible = inColumn; } catch (error) { /* nested visibility can be locked */ }
      }
      if (!inColumn || !row) return;
      const value = row[column.key];
      const assignments = {};
      queueComponentProperty(cell, assignments, 'Value', value === undefined || value === null ? '' : String(value), 'TEXT', warnings, `Row ${rowIndex + 1} ${column.key}`);
      queueComponentProperty(cell, assignments, 'Align', column.align === 'end' ? 'end' : 'start', 'VARIANT', warnings, `Row ${rowIndex + 1} ${column.key} align`);
      applyQueuedProperties(cell, assignments, warnings, `Row ${rowIndex + 1} cell properties`);
      // The hairline stays on every row except the last visible one.
      try { cell.strokeBottomWeight = rowIndex === visibleRows - 1 ? 0 : 1; } catch (error) { /* stroke override unavailable */ }
    });
  });
  return instance;
}

async function importDataTable(node, warnings) {
  const instance = await createComponentInstance('Data Table');
  await applyDataTable(instance, node, warnings);
  return instance;
}

// ── Choice Group (Options slot; tiles may sit inside an embedded Grid) ──────

const CHOICE_SIZES = ['compact', 'default', 'comfortable'];
const CHOICE_GROUP_MAX_OPTIONS = 12;
const CHOICE_GROUP_CONTEXT_MAX_OPTIONS = 8;

function choiceGroupOptionsSlot(instance) {
  return currentInstance(instance).findOne((node) => node.type === 'SLOT' && canonicalKey(node.name) === canonicalKey('Options'));
}

// The Options slot may hold Choice Option tiles directly or nest them inside an
// embedded Grid frame (native GRID layout or a responsive plugin Grid carrying
// `{xs:n, md:n}` name/plugin-data metadata). Detect that container so export,
// reconciliation, and the `columns` prop all target the right frame.
function choiceGroupTileContainer(instance) {
  const slot = choiceGroupOptionsSlot(instance);
  if (!slot) return { slot: null, container: null, grid: null };
  const grid = slot.children.find((child) =>
    child.type === 'FRAME'
    && (child.layoutMode === 'GRID' || Boolean(readResponsiveGridColumns(child)) || isGridFrame(child)));
  return { slot, container: grid || slot, grid: grid || null };
}

function choiceGroupTiles(instance) {
  const { container } = choiceGroupTileContainer(instance);
  if (!container) return [];
  const isTile = (node) => node.type === 'INSTANCE' && componentSetName(node) === 'Choice Option';
  const direct = container.children.filter(isTile);
  return direct.length > 0 ? direct : container.findAll(isTile);
}

function visibleChoiceGroupTiles(instance) {
  return choiceGroupTiles(instance).filter((tile) => tile.visible !== false);
}

function choiceGroupTileHasIndicatorProperty(tile) {
  return Boolean(componentProperty(tile, 'Show indicator', 'BOOLEAN'));
}

function choiceGroupTileShowsIndicator(tile) {
  const found = componentProperty(tile, 'Show indicator', 'BOOLEAN');
  return found ? found.property.value !== false : true;
}

function setChoiceGroupTileFillSizing(tile, warnings = [], description = 'Choice Group option') {
  if (!tile) return;
  try {
    tile.layoutSizingHorizontal = 'FILL';
  } catch (error) {
    warnings.push(`${description} width could not be set to Fill: ${error.message}`);
  }
  try {
    if ('layoutGrow' in tile) tile.layoutGrow = 1;
  } catch {
    // Some plugin-owned nodes ignore grow while still accepting Fill.
  }
}

function setChoiceGroupTileGridPreviewSizing(tile, width, warnings = [], description = 'Choice Group option') {
  if (!tile) return;
  try {
    tile.layoutSizingHorizontal = 'FIXED';
  } catch (error) {
    warnings.push(`${description} width could not be set to Fixed for the responsive grid preview: ${error.message}`);
  }
  try {
    if ('layoutGrow' in tile) tile.layoutGrow = 0;
  } catch {
    // Some plugin-owned nodes ignore grow while still accepting fixed sizing.
  }
  try {
    tile.resize(width, tile.height);
  } catch (error) {
    warnings.push(`${description} width could not be resized for the responsive grid preview: ${error.message}`);
  }
}

function choiceGroupGridTiles(grid) {
  if (!grid || !('children' in grid)) return [];
  const isTile = (node) => node.type === 'INSTANCE' && node.visible !== false && componentSetName(node) === 'Choice Option';
  const direct = grid.children.filter(isTile);
  return direct.length > 0 ? direct : grid.findAll(isTile);
}

function choiceGroupTileTemplate(instance, tiles = choiceGroupTiles(instance)) {
  const visible = tiles.filter((tile) => tile.visible !== false);
  return visible[visible.length - 1] || tiles[tiles.length - 1] || tiles[0] || null;
}

function choiceGroupRows(instance) {
  const rows = [];
  for (const tile of visibleChoiceGroupTiles(instance)) {
    const y = figmaNumber(tile.y, 0);
    let row = rows.find((candidate) => Math.abs(candidate.y - y) <= 1);
    if (!row) {
      row = { y, tiles: [] };
      rows.push(row);
    }
    row.tiles.push(tile);
  }
  rows.sort((a, b) => a.y - b.y);
  rows.forEach((row) => row.tiles.sort((a, b) => figmaNumber(a.x, 0) - figmaNumber(b.x, 0)));
  return rows;
}

function syncChoiceGroupRowHeights(instance, warnings = []) {
  instance = currentInstance(instance);
  const rows = choiceGroupRows(instance);
  let changed = 0;
  for (const row of rows) {
    if (row.tiles.length < 2) continue;
    const tallest = Math.max(...row.tiles.map((tile) => figmaNumber(tile.height, 0)));
    for (const tile of row.tiles) {
      if (figmaNumber(tile.height, 0) >= tallest - 0.5) continue;
      try {
        if (tile.layoutSizingVertical !== 'FILL') {
          tile.layoutSizingVertical = 'FILL';
          changed += 1;
        }
      } catch (error) {
        try {
          tile.resize(tile.width, tallest);
          changed += 1;
        } catch {
          warnings.push(`Choice Group option height could not be synced: ${error.message}`);
        }
      }
    }
  }
  return changed;
}

function syncChoiceGroupTileSizing(instance, warnings = []) {
  const { grid } = choiceGroupTileContainer(instance);
  const responsive = grid ? readResponsiveGridColumns(grid) : null;
  if (responsive) {
    applyChoiceGroupGridColumns(instance, responsive, warnings);
    return syncChoiceGroupRowHeights(instance, warnings);
  }
  visibleChoiceGroupTiles(instance).forEach((tile, index) => {
    setChoiceGroupTileFillSizing(tile, warnings, `Option ${index + 1}`);
  });
  return syncChoiceGroupRowHeights(instance, warnings);
}

function exportChoiceGroup(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};
  const label = componentText(instance, 'Label', '');
  if (label.trim()) props.label = label.trim();
  if (componentBoolean(instance, 'Required', false)) props.required = true;
  if (componentBoolean(instance, 'Show helper', false)) {
    const helper = componentText(instance, 'Helper', '').trim();
    if (helper) props.hint = helper;
  }

  const { slot, grid } = choiceGroupTileContainer(instance);
  if (!slot) warnings.push('No Options slot was found — options were not exported.');
  if (grid) {
    const responsive = readResponsiveGridColumns(grid);
    if (responsive) props.columns = responsive;
    else if (grid.layoutMode === 'GRID') {
      try {
        if (Number.isInteger(grid.gridColumnCount) && grid.gridColumnCount > 0) props.columns = grid.gridColumnCount;
      } catch (error) { /* grid metadata unavailable */ }
    }
  }

  const usedValues = new Set();
  const options = [];
  const selectedValues = [];
  const indicatorValues = [];
  let multiple = false;
  const parentSize = componentPropertyValue(instance, 'Size', 'VARIANT');
  let size = CHOICE_SIZES.includes(parentSize) ? parentSize : null;
  for (const tile of choiceGroupTiles(instance)) {
    if (tile.visible === false) continue;
    if (choiceGroupTileHasIndicatorProperty(tile)) indicatorValues.push(choiceGroupTileShowsIndicator(tile));
    const tileLabel = componentText(tile, 'Label', `Option ${options.length + 1}`);
    const option = { value: slugifyOptionValue(tileLabel, usedValues), label: tileLabel };
    if (componentBoolean(tile, 'Show subtext', false)) {
      const subtext = componentText(tile, 'Subtext', '').trim();
      if (subtext) option.subtext = subtext;
    }
    if (componentBoolean(tile, 'Show icon', false)) {
      const iconName = iconNameFromInstance(tile, 'Icon') || iconNameFromSwapValue(componentPropertyValue(tile, 'Icon', 'INSTANCE_SWAP'));
      if (iconName) option.icon = iconName;
    }
    const state = componentPropertyValue(tile, 'State', 'VARIANT');
    if (state === 'disabled') option.disabled = true;
    if (state === 'selected') selectedValues.push(option.value);
    if (componentPropertyValue(tile, 'Type', 'VARIANT') === 'checkbox') multiple = true;
    const tileSize = componentPropertyValue(tile, 'Size', 'VARIANT');
    if (!size && CHOICE_SIZES.includes(tileSize)) size = tileSize;
    options.push(option);
  }
  if (options.length > 0) props.options = options;
  if (multiple) props.multiple = true;
  if (size && size !== 'default') props.size = size;
  if (indicatorValues.length > 0 && indicatorValues.every((showsIndicator) => showsIndicator === false)) props.hideIndicator = true;
  else if (indicatorValues.some((showsIndicator) => showsIndicator === false)) {
    warnings.push('Choice Group has mixed Show indicator values; JSON supports one group-level hideIndicator prop, so indicators were exported as visible.');
  }
  if (selectedValues.length > 0) props.defaultValue = multiple ? selectedValues : selectedValues[0];
  return { node: { id: componentId('ChoiceGroup', instance), type: 'ChoiceGroup', props }, warnings };
}

function choiceGroupResponsiveColumnsForContext(instance, props = {}) {
  const responsive = normalizeResponsiveColumns(props.columns);
  if (responsive) return responsive;
  if (Number.isInteger(props.columns) && props.columns > 0) return { xs: props.columns };
  const { grid } = choiceGroupTileContainer(instance);
  if (grid) {
    const gridResponsive = readResponsiveGridColumns(grid);
    if (gridResponsive) return gridResponsive;
    if (grid.layoutMode === 'GRID') {
      try {
        if (Number.isInteger(grid.gridColumnCount) && grid.gridColumnCount > 0) return { xs: grid.gridColumnCount };
      } catch {
        // Ignore unavailable grid metadata.
      }
    }
  }
  return { xs: 1 };
}

function choiceGroupContextForSelection(instance) {
  instance = currentInstance(instance);
  const result = exportChoiceGroup(instance);
  const props = result.node.props || {};
  const options = Array.isArray(props.options) ? props.options : [];
  return {
    label: typeof props.label === 'string' ? props.label : '',
    helper: componentText(instance, 'Helper', typeof props.hint === 'string' ? props.hint : ''),
    type: props.multiple === true ? 'checkbox' : 'radio',
    typeOptions: ['radio', 'checkbox'],
    size: CHOICE_SIZES.includes(props.size) ? props.size : 'default',
    sizeOptions: CHOICE_SIZES,
    optionCount: Math.max(1, Math.min(CHOICE_GROUP_CONTEXT_MAX_OPTIONS, options.length || visibleChoiceGroupTiles(instance).length || 1)),
    optionCountOptions: Array.from({ length: CHOICE_GROUP_CONTEXT_MAX_OPTIONS }, (_, index) => String(index + 1)),
    required: props.required === true,
    hideIndicator: props.hideIndicator === true,
    booleanOptions: ['false', 'true'],
    columns: choiceGroupResponsiveColumnsForContext(instance, props),
  };
}

function applyChoiceGroupGridColumns(instance, columns, warnings = [], explicitBreakpoint = '') {
  instance = currentInstance(instance);
  const responsive = normalizeResponsiveColumns(columns)
    || (Number.isInteger(columns) && columns > 0 ? { xs: columns } : null);
  if (!responsive) return null;
  const { grid } = choiceGroupTileContainer(instance);
  if (!grid) {
    warnings.push('Choice Group columns need an embedded Grid inside the Options slot — the value was not represented.');
    return null;
  }
  const fallbackBreakpoint = readBreakpointData(grid) || 'md';
  const breakpoint = A1_BREAKPOINTS.includes(explicitBreakpoint) ? explicitBreakpoint : breakpointForNode(instance, fallbackBreakpoint);
  const count = responsiveColumnsAt(responsive, breakpoint) || Object.values(responsive)[0] || 1;
  try {
    if (grid.layoutMode === 'GRID') {
      grid.gridColumnCount = count;
      grid.gridColumnSizes.forEach((track) => {
        track.type = 'FLEX';
        track.value = 1;
      });
    } else if (grid.layoutMode === 'HORIZONTAL') {
      const visibleTiles = choiceGroupGridTiles(grid);
      const columnCount = Math.max(1, Math.min(count, Math.max(visibleTiles.length, 1)));
      const horizontalGap = figmaNumber(grid.itemSpacing, 0);
      const availableWidth = Math.max(1, figmaNumber(grid.width, 0) - figmaNumber(grid.paddingLeft, 0) - figmaNumber(grid.paddingRight, 0));
      const tileWidth = Math.max(1, (availableWidth - horizontalGap * Math.max(0, columnCount - 1)) / columnCount);
      grid.layoutWrap = 'WRAP';
      try { grid.counterAxisSpacing = horizontalGap; } catch { /* Older files may not expose wrapped row gap. */ }
      visibleTiles.forEach((tile, index) => setChoiceGroupTileGridPreviewSizing(tile, tileWidth, warnings, `Option ${index + 1}`));
    }
  } catch (error) {
    warnings.push(`Choice Group Options Grid preview columns could not be set: ${error.message}`);
  }
  syncResponsiveGridColumnsMetadata(grid, responsive);
  try {
    grid.setPluginData(A1_BREAKPOINT_KEY, breakpoint);
  } catch {
    // The visible name suffix still carries the responsive contract.
  }
  return responsive;
}

async function applyChoiceGroup(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const options = Array.isArray(props.options) ? props.options.filter((option) => option && typeof option === 'object') : [];
  const multiple = props.multiple === true;
  const size = CHOICE_SIZES.includes(props.size) ? props.size : 'default';
  const assignments = {};
  queueComponentProperty(instance, assignments, 'Label', typeof props.label === 'string' ? props.label : '', 'TEXT', warnings, 'Choice Group label');
  queueComponentProperty(instance, assignments, 'Required', props.required === true, 'BOOLEAN', warnings, 'Choice Group required');
  const hint = typeof props.hint === 'string' ? props.hint : '';
  queueComponentProperty(instance, assignments, 'Helper', hint, 'TEXT', warnings, 'Choice Group helper');
  queueComponentProperty(instance, assignments, 'Show helper', hint.trim().length > 0, 'BOOLEAN', warnings, 'Choice Group helper visibility');
  queueOptionalComponentProperty(instance, assignments, 'Size', size, 'VARIANT');
  applyQueuedProperties(instance, assignments, warnings, 'Choice Group properties');
  instance = currentInstance(instance);

  const rawSelection = props.defaultValue !== undefined ? props.defaultValue : props.value;
  const selected = new Set(
    Array.isArray(rawSelection)
      ? rawSelection.filter((value) => typeof value === 'string')
      : typeof rawSelection === 'string' && rawSelection ? [rawSelection] : []);

  const initial = choiceGroupTileContainer(instance);
  if (!initial.slot) {
    if (options.length > 0) warnings.push('No Options slot was found — options were not applied.');
    return instance;
  }
  if (options.length > CHOICE_GROUP_MAX_OPTIONS) {
    warnings.push(`Choice Group supports up to ${CHOICE_GROUP_MAX_OPTIONS} Figma tiles — additional JSON options were not rendered.`);
  }
  const wanted = options.length > 0 ? Math.min(options.length, CHOICE_GROUP_MAX_OPTIONS) : choiceGroupTiles(instance).length;
  let source = null;
  let tiles = choiceGroupTiles(instance);
  while (tiles.length < wanted) {
    const { container } = choiceGroupTileContainer(instance);
    if (!container) break;
    const template = choiceGroupTileTemplate(instance, tiles);
    let added = null;
    if (template && typeof template.clone === 'function') {
      added = template.clone();
      try { added.visible = true; } catch { /* nested visibility can be locked */ }
      container.appendChild(added);
    } else {
      if (!source && options.length > 0) source = await findComponentSourceAsync('Choice Option', warnings);
      if (!source) { warnings.push('No "Choice Option" component was found — missing tiles were not added.'); break; }
      added = source.createInstance();
      container.appendChild(added);
    }
    setChoiceGroupTileFillSizing(added, warnings, `Option ${tiles.length + 1}`);
    tiles = choiceGroupTiles(instance);
  }
  while (tiles.length > wanted) {
    tiles[tiles.length - 1].remove();
    tiles = choiceGroupTiles(instance);
  }

  // columns lives on the embedded Grid: a responsive object (or a fixed count,
  // stored as its xs value) syncs the grid's name/plugin-data metadata.
  if (props.columns !== undefined) {
    const responsive = normalizeResponsiveColumns(props.columns)
      || (Number.isInteger(props.columns) && props.columns > 0 ? { xs: props.columns } : null);
    if (responsive) applyChoiceGroupGridColumns(instance, responsive, warnings);
    else warnings.push('Choice Group columns value was not recognized — the embedded Grid was left unchanged.');
  }

  const usedValues = new Set();
  tiles = choiceGroupTiles(instance);
  const hasResponsiveOptionsGrid = Boolean(choiceGroupTileContainer(instance).grid);
  if (!hasResponsiveOptionsGrid) {
    tiles.forEach((tile, index) => setChoiceGroupTileFillSizing(tile, warnings, `Option ${index + 1}`));
  }
  for (let index = 0; index < Math.min(tiles.length, options.length || tiles.length); index += 1) {
    const tile = tiles[index];
    const option = options[index];
    if (!option) break;
    const tileLabel = typeof option.label === 'string' && option.label ? option.label : `Option ${index + 1}`;
    const value = typeof option.value === 'string' && option.value ? option.value : slugifyOptionValue(tileLabel, usedValues);
    const state = option.disabled === true ? 'disabled' : selected.has(value) ? 'selected' : 'default';
    const tileAssignments = {};
    queueComponentProperty(tile, tileAssignments, 'Label', tileLabel, 'TEXT', warnings, `Option ${index + 1} label`);
    queueComponentProperty(tile, tileAssignments, 'Type', multiple ? 'checkbox' : 'radio', 'VARIANT', warnings, `Option ${index + 1} type`);
    queueComponentProperty(tile, tileAssignments, 'Size', size, 'VARIANT', warnings, `Option ${index + 1} size`);
    queueComponentProperty(tile, tileAssignments, 'State', state, 'VARIANT', warnings, `Option ${index + 1} state`);
    queueOptionalComponentProperty(tile, tileAssignments, 'Show indicator', props.hideIndicator !== true, 'BOOLEAN');
    const subtext = typeof option.subtext === 'string' ? option.subtext : '';
    queueComponentProperty(tile, tileAssignments, 'Show subtext', subtext.trim().length > 0, 'BOOLEAN', warnings, `Option ${index + 1} subtext visibility`);
    if (subtext.trim()) queueComponentProperty(tile, tileAssignments, 'Subtext', subtext, 'TEXT', warnings, `Option ${index + 1} subtext`);
    queueComponentProperty(tile, tileAssignments, 'Show icon', typeof option.icon === 'string' && option.icon.length > 0, 'BOOLEAN', warnings, `Option ${index + 1} icon visibility`);
    if (typeof option.icon === 'string' && option.icon) {
      const iconComponent = findIconComponent(option.icon);
      if (iconComponent) queueComponentProperty(tile, tileAssignments, 'Icon', iconComponent.id, 'INSTANCE_SWAP', warnings, `Option ${index + 1} icon`);
      else warnings.push(`No icon component named "${option.icon}" exists in this file — option "${tileLabel}" keeps the default glyph.`);
    }
    applyQueuedProperties(tile, tileAssignments, warnings, `Option ${index + 1} properties`);
  }
  if (props.hideIndicator !== undefined && options.length === 0) {
    tiles.forEach((tile, index) => {
      const tileAssignments = {};
      queueOptionalComponentProperty(tile, tileAssignments, 'Show indicator', props.hideIndicator !== true, 'BOOLEAN');
      applyQueuedProperties(tile, tileAssignments, warnings, `Option ${index + 1} indicator visibility`);
    });
  }
  if (props.inlineIcon === true) warnings.push('inlineIcon layout is runtime-owned — tiles keep the stacked icon layout.');
  if (props.sections) warnings.push('Labeled sections are runtime-owned — options were applied as a flat list.');
  if (props.error || props.success) warnings.push('Error/success group messages are runtime-owned — the helper text was applied instead.');
  syncChoiceGroupTileSizing(instance, warnings);
  return instance;
}

async function importChoiceGroup(node, warnings) {
  const instance = await createComponentInstance('Choice Group', warnings);
  await applyChoiceGroup(instance, node, warnings);
  return instance;
}

const EXPORTERS = componentRegistryMap(COMPONENT_ADAPTERS, 'export');
const IMPORTERS = componentRegistryImporters(COMPONENT_ADAPTERS);
// Appliers update an EXISTING instance in place (the "Update selection" action)
// — the same functions the importers use after creating a fresh instance.
const APPLIERS = componentRegistryMap(COMPONENT_ADAPTERS, 'apply');

// ── Update: apply pasted JSON to the currently selected instance ────────────

async function handleUpdate(text) {
  const selection = figma.currentPage.selection;
  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    return postError('Not valid JSON: ' + error.message);
  }
  const nodes = [];
  collectSupportedNodes(data, nodes);
  if (selection.length === 1 && selection[0].type === 'TEXT') {
    if (isMaterialIconTextNode(selection[0])) {
      const iconNode = nodes.find((entry) => entry.type === 'Icon');
      if (!iconNode) return postError('The JSON has no Icon node to apply to the selected Material icon.');
      const warnings = [];
      await applyIcon(selection[0], iconNode, warnings);
      writeBreakpointVisibility(selection[0], iconNode.visibility);
      figma.notify('Updated the selected Icon from JSON.');
      postPluginMessage({ type: 'update-result', componentName: 'Icon', warnings });
      return;
    }
    const textNode = nodes.find((entry) => ['Heading', 'Paragraph', 'Link'].includes(entry.type));
    if (!textNode) return postError('The JSON has no Heading, Paragraph, or Link node to apply to the selected text layer.');
    const warnings = [];
    await applyTextSuggestion(selection[0], textStyleRequestForNode(textNode), warnings);
    if (textNode.content && typeof textNode.content.fallback === 'string') {
      const text = selection[0];
      if (text.fontName !== figma.mixed) await figma.loadFontAsync(text.fontName);
      text.characters = textNode.content.fallback;
    }
    await applyInlineLinkRanges(selection[0], textNode.content && textNode.content.inlineLinks, warnings);
    writeBreakpointVisibility(selection[0], textNode.visibility);
    figma.notify('Updated the selected text layer from JSON.');
    postPluginMessage({ type: 'update-result', componentName: textNode.type, warnings });
    return;
  }
  if (selection.length === 1 && isStackFrame(selection[0])) {
    const stackNode = nodes.find((entry) => entry.type === 'Stack');
    if (!stackNode) return postError('The JSON has no Stack node to apply to the selected auto-layout frame.');
    const warnings = [];
    await applyStack(selection[0], stackNode, warnings);
    writeBreakpointVisibility(selection[0], stackNode.visibility);
    syncStackPropsName(selection[0]);
    if (Array.isArray(stackNode.children) && stackNode.children.length > 0) {
      warnings.push('Child nodes were not applied — updating a selected Stack changes its layout properties only. Use Render on canvas to create its child tree.');
    }
    figma.notify('Updated the selected Stack auto-layout frame from JSON.');
    postPluginMessage({ type: 'update-result', componentName: 'Stack', warnings });
    return;
  }
  if (selection.length === 1 && selection[0].type === 'INSTANCE' && materialIconNameFromInstance(selection[0])) {
    const iconNode = nodes.find((entry) => entry.type === 'Icon');
    if (!iconNode) return postError('The JSON has no Icon node to apply to the selected Material icon.');
    const warnings = [];
    await applyIcon(selection[0], iconNode, warnings);
    writeBreakpointVisibility(selection[0], iconNode.visibility);
    figma.notify('Updated the selected Icon from JSON.');
    postPluginMessage({ type: 'update-result', componentName: 'Icon', warnings });
    return;
  }
  if (selection.length !== 1 || selection[0].type !== 'INSTANCE') {
    return postError('Select a single supported component instance, Stack auto-layout frame, or text layer to update.');
  }
  const target = selection[0];
  const componentName = registeredSetName(target);
  if (!componentName) {
    return postError(`The selected component is not supported yet. Supported: ${SUPPORTED_COMPONENT_MESSAGE}.`);
  }
  const jsonType = JSON_TYPE_BY_COMPONENT_NAME[componentName] || componentName;
  const node = nodes.find((entry) => entry.type === jsonType);
  if (!node) {
    return postError(`The JSON has no "${jsonType}" node to apply to the selected ${componentName}.`);
  }
  const warnings = [];
  await APPLIERS[componentName](target, node, warnings);
  writeBreakpointVisibility(target, node.visibility);
  if (componentName === 'Section') {
    await applyExistingSectionChildren(target, node, warnings);
  } else if (componentName === 'Button Container') {
    await applyExistingButtonContainerChildren(target, node, warnings);
    syncButtonContainerForWidth(target, warnings);
  } else if (componentName === 'Card') {
    await replaceNativeSlotChildren(target, 'Content Slot', node.children, warnings, 'Card');
  } else if (componentName === 'Banner') {
    await replaceNativeSlotChildren(target, 'Content Slot', bannerSlotChildren(node), warnings, 'Banner');
  } else if (componentName === 'Definition List') {
    await replaceDefinitionItems(target, node, warnings);
  } else if (Array.isArray(node.children) && node.children.length > 0) {
    warnings.push('Child nodes were not applied — updating a selected instance changes its properties only.');
  }
  figma.notify(`Updated the selected ${componentName} from JSON.`);
  postPluginMessage({ type: 'update-result', componentName, warnings });
}

// ─── Wiring ──────────────────────────────────────────────────────────────────

const PLUGIN_UI_SIZE = {
  default: { width: 620, height: 640 },
  buildFix: { width: 620, height: 600 },
  help: { width: 620, height: 640 },
  patterns: { width: 620, height: 640 },
  minimized: { width: 400, height: 40 },
  context: { width: 420, height: 440 },
  // Live Edit has enough controls that the standard compact plugin window
  // hides the bottom of the interface on typical desktop Figma layouts.
  liveEdit: { width: 620, height: 640 },
};

const RELAUNCH_COMMAND = 'open';

function setRelaunchDataSafe(node, description) {
  if (!node || typeof node.setRelaunchData !== 'function') return;
  try {
    node.setRelaunchData({ [RELAUNCH_COMMAND]: description });
  } catch {
    // Older Figma runtimes may expose the plugin typings without the
    // relaunch-data API. Relaunch metadata is optional and must not affect
    // export, audit, or context-menu behavior.
  }
}

function relaunchDescription(target, selectionCount) {
  if (target && target.type === 'INSTANCE') {
    const componentName = registeredSetName(target) || componentSetName(target);
    if (componentName) return `Open A1:Figma to edit this ${componentName}.`;
  }
  if (target && target.type === 'TEXT' && isMaterialIconTextNode(target)) return 'Open A1:Figma to configure this Icon.';
  if (target && target.type === 'TEXT') return 'Open A1:Figma to configure this text layer.';
  if (selectionCount > 1) return 'Open A1:Figma to inspect the selected layers.';
  return 'Open A1:Figma for this page.';
}

function updateRelaunchData(selection, target) {
  const selected = Array.isArray(selection) ? selection : [];
  const description = relaunchDescription(target, selected.length);
  setRelaunchDataSafe(figma.currentPage, description);
  selected.forEach((node) => setRelaunchDataSafe(node, description));
}

figma.showUI(__html__, PLUGIN_UI_SIZE.minimized);

function postSelectionState() {
  const selection = figma.currentPage.selection;
  const autoFixAllCount = autoFixTargetCount(selection);
  const selectionCount = selection.length;
  const conversionRecommendation = conversionRecommendationForSelection(selection);
  const conversionSuggestions = conversionRecommendation ? conversionRecommendation.suggestions : [];
  let target = selection.length === 1 ? liveNode(selection[0]) : null;
  updateRelaunchData(selection, target);
  if (target && target.type === 'TEXT' && isMaterialIconTextNode(target)) {
    postPluginMessage({
      type: 'selection',
      exportable: true,
      componentName: 'Icon',
      autoFixAllCount,
      selectionCount,
      conversionRecommendation,
      conversionSuggestions
    });
    return;
  }
  if (target && target.type === 'TEXT') {
    const suggestion = textSuggestion(target);
    const review = suggestion.issues.length ? { issues: suggestion.issues, suggestion } : null;
    postPluginMessage({
      type: 'selection',
      exportable: true,
      componentName: 'Text',
      textReview: review,
      textContext: textContextForSelection(target, suggestion),
      autoFixAllCount,
      selectionCount,
      conversionRecommendation,
      conversionSuggestions
    });
    return;
  }
  if (target && target.type === 'INSTANCE') {
    const componentName = registeredSetName(target);
    if (componentName) {
      if (componentName === 'Card') target = syncCardIconPositionForWidth(target, []);
      if (componentName === 'Breadcrumb') target = syncBreadcrumbBackButtonForWidth(target, []);
      if (componentName === 'Button Container') target = syncButtonContainerForWidth(target, []);
      if (componentName === 'Choice Group') {
        const { grid } = choiceGroupTileContainer(target);
        applyChoiceGroupGridColumnsForBreakpoint(target, breakpointForNode(target, readBreakpointData(grid) || 'md'), []);
        syncChoiceGroupTileSizing(target, []);
      }
      const sectionReview = componentName === 'Section' ? sectionSuggestion(target) : null;
      const sectionContext = componentName === 'Section' ? sectionContextForSelection(target) : null;
      const buttonContext = componentName === 'Button' ? buttonContextForSelection(target) : null;
      const buttonContainerContext = componentName === 'Button Container' ? buttonContainerContextForSelection(target) : null;
      const iconButtonContext = componentName === 'Icon Button' ? iconButtonContextForSelection(target) : null;
      const badgeContext = componentName === 'Badge' ? badgeContextForSelection(target) : null;
      const cardContext = componentName === 'Card' ? cardContextForSelection(target) : null;
      const dialogContext = componentName === 'Dialog' ? dialogContextForSelection(target) : null;
      const menuContext = componentName === 'Menu' ? menuContextForSelection(target) : null;
      const pageLayoutContext = componentName === 'Page Layout' ? pageLayoutContextForSelection(target) : null;
      const topHeaderContext = componentName === 'Top Header' ? topHeaderContextForSelection(target) : null;
      const linkContext = componentName === 'Link' ? linkContextForSelection(target) : null;
      const definitionListContext = componentName === 'Definition List' ? definitionListContextForSelection(target) : null;
      const dataTableContext = componentName === 'Data Table' ? dataTableContextForSelection(target) : null;
      const choiceGroupContext = componentName === 'Choice Group' ? choiceGroupContextForSelection(target) : null;
      postPluginMessage({
        type: 'selection',
        exportable: true,
        componentName,
        pageLayoutNodeId: componentName === 'Page Layout' ? target.id : null,
        pageLayoutContext,
        topHeaderNodeId: componentName === 'Top Header' ? target.id : null,
        topHeaderContext,
        linkNodeId: componentName === 'Link' ? target.id : null,
        linkContext,
        cardNodeId: componentName === 'Card' ? target.id : null,
        cardContext,
        iconButtonNodeId: componentName === 'Icon Button' ? target.id : null,
        iconButtonContext,
        badgeNodeId: componentName === 'Badge' ? target.id : null,
        badgeContext,
        dialogNodeId: componentName === 'Dialog' ? target.id : null,
        dialogContext,
        menuNodeId: componentName === 'Menu' ? target.id : null,
        menuContext,
        definitionListNodeId: componentName === 'Definition List' ? target.id : null,
        definitionListContext,
        dataTableNodeId: componentName === 'Data Table' ? target.id : null,
        dataTableContext,
        choiceGroupNodeId: componentName === 'Choice Group' ? target.id : null,
        choiceGroupContext,
        sectionNodeId: componentName === 'Section' ? target.id : null,
        sectionReview,
        sectionContext,
        buttonNodeId: componentName === 'Button' ? target.id : null,
        buttonContext,
        buttonContainerNodeId: componentName === 'Button Container' ? target.id : null,
        buttonContainerContext,
        autoFixAllCount,
        selectionCount,
        conversionRecommendation,
        conversionSuggestions
      });
      return;
    }
    if (materialIconNameFromInstance(target)) {
      postPluginMessage({ type: 'selection', exportable: true, componentName: 'Icon', autoFixAllCount, selectionCount, conversionRecommendation, conversionSuggestions });
      return;
    }
    const privateComponentName = privateA1ImplementationComponentName(target);
    if (privateComponentName) {
      postPluginMessage({ type: 'selection', exportable: false, componentName: privateComponentName, autoFixAllCount, selectionCount, conversionRecommendation, conversionSuggestions });
      return;
    }
  }
  const pageLayoutReview = pageLayoutSuggestion(target);
  if (pageLayoutReview) {
    postPluginMessage({ type: 'selection', exportable: true, componentName: 'Page Layout candidate', pageLayoutReview, autoFixAllCount, selectionCount, conversionRecommendation, conversionSuggestions });
    return;
  }
  const cardReview = cardSuggestion(target);
  if (cardReview) {
    postPluginMessage({ type: 'selection', exportable: true, componentName: 'Card candidate', cardReview, autoFixAllCount, selectionCount, conversionRecommendation, conversionSuggestions });
    return;
  }
  if (isStackFrame(target)) {
    const stackReview = stackSuggestion(target);
    postPluginMessage({
      type: 'selection',
      exportable: true,
      componentName: 'Stack',
      stackNodeId: target.id,
      stackContext: stackContextForSelection(target),
      stackReview,
      autoFixAllCount,
      selectionCount,
      conversionRecommendation,
      conversionSuggestions
    });
    return;
  }
  if (isGridFrame(target)) {
    postPluginMessage({
      type: 'selection',
      exportable: true,
      componentName: 'Grid',
      gridNodeId: target.id,
      gridColumns: readResponsiveGridColumns(target),
      gridWidthMode: gridWidthMode(target),
      gridHeightMode: gridHeightMode(target),
      autoFixAllCount,
      selectionCount,
      conversionRecommendation,
      conversionSuggestions
    });
    return;
  }
  if (target && canExportContainer(target)) {
    postPluginMessage({ type: 'selection', exportable: true, componentName: 'Screen content', autoFixAllCount, selectionCount, conversionRecommendation, conversionSuggestions });
    return;
  }
  const componentName = target && target.type === 'INSTANCE' ? componentSetName(target) : null;
  postPluginMessage({
    type: 'selection',
    exportable: Boolean(componentName && EXPORTERS[componentName]),
    componentName,
    autoFixAllCount,
    selectionCount,
    conversionRecommendation,
    conversionSuggestions,
  });
}

// Auto-export: the JSON regenerates on its own when the selection changes or
// when the selected instance's configuration changes (variant swap, property
// edit, nested content) — no need to click Export selection. Debounced because
// document changes arrive in bursts while dragging/typing in Figma's UI. The
// UI side keeps hand-edited JSON safe: an auto export never overwrites a
// textarea the user has typed into (manual Export selection does).
let autoExportTimer = null;
let liveViewEnabled = false;
let pluginMode = 'build-fix';
let pluginUiMode = 'minimized';
let livePreviewTimer = null;
let linkedPageLiveLink = null;
let linkedPageLiveTimer = null;
let selectedAutoExportSignature = '';
function scheduleAutoExport() {
  if (autoExportTimer) clearTimeout(autoExportTimer);
  autoExportTimer = setTimeout(() => {
    autoExportTimer = null;
    runExport(true);
  }, 250);
}

function selectedInstancePropertySignature() {
  const selection = figma.currentPage.selection;
  if (selection.length !== 1) return '';
  const target = liveNode(selection[0]);
  if (!target || target.type !== 'INSTANCE') return '';
  const componentName = registeredSetName(target);
  if (!componentName && !materialIconNameFromInstance(target)) return '';
  const props = {};
  try {
    const raw = target.componentProperties || {};
    for (const key of Object.keys(raw).sort()) {
      const prop = raw[key];
      props[plainKey(key)] = prop && typeof prop === 'object'
        ? { type: prop.type, value: prop.value }
        : prop;
    }
  } catch {
    // Some transient instance states do not expose componentProperties safely.
  }
  return JSON.stringify({
    id: target.id,
    componentName: componentName || 'Icon',
    props,
    dialogCloseVisible: componentName === 'Dialog' ? dialogCloseLayerVisible(target) : undefined,
  });
}

function syncSelectedInstancePropertySignature({ schedule = false } = {}) {
  const signature = selectedInstancePropertySignature();
  if (signature === selectedAutoExportSignature) return;
  selectedAutoExportSignature = signature;
  if (schedule && signature) scheduleAutoExport();
}

function scheduleLivePreview() {
  if (!liveViewEnabled) return;
  if (livePreviewTimer) clearTimeout(livePreviewTimer);
  livePreviewTimer = setTimeout(() => {
    livePreviewTimer = null;
    const target = topmostExportableNode();
    if (!target) return;
    try {
      runExport(true, target, true);
    } catch (error) {
      postError(`Live view could not export the selected composition: ${error.message}`);
    }
  }, 350);
}

function scheduleLinkedPagePreview() {
  if (!linkedPageLiveLink) return;
  if (linkedPageLiveTimer) clearTimeout(linkedPageLiveTimer);
  linkedPageLiveTimer = setTimeout(() => {
    linkedPageLiveTimer = null;
    try {
      Promise.resolve(exportLinkedPage(linkedPageLiveLink)).then((result) => {
        postPluginMessage({ type: 'linked-page-live-preview', link: linkedPageLiveLink, ...result });
      }).catch(() => {});
    } catch (error) {
      // A root can briefly be unavailable while Figma applies a document edit.
    }
  }, 600);
}

let selectionStateRefreshTimer = null;

function scheduleSelectionStateRefresh(delay = 120) {
  if (selectionStateRefreshTimer) clearTimeout(selectionStateRefreshTimer);
  selectionStateRefreshTimer = setTimeout(() => {
    selectionStateRefreshTimer = null;
    postSelectionState();
  }, delay);
}

figma.on('selectionchange', () => {
  postSelectionState();
  syncSelectedInstancePropertySignature();
  scheduleAutoExport();
  scheduleLivePreview();
});

function handleCurrentPageNodeChange(event) {
  if (linkedPageLiveLink) scheduleLinkedPagePreview();
  if (liveViewEnabled) {
    scheduleLivePreview();
    return;
  }
  const selection = figma.currentPage.selection;
  const target = selection.length === 1 ? liveNode(selection[0]) : null;
  if (!target || (!['INSTANCE', 'TEXT'].includes(target.type) && !canExportContainer(target))) return;
  if (target.type === 'INSTANCE') {
    syncSelectedInstancePropertySignature({ schedule: true });
  }
  // Figma does not consistently expose a direct changed-node id for paint
  // variable changes. If a text layer remains selected, re-export on the next
  // debounced document change and read its fresh fill binding above.
  if (target.type === 'TEXT') {
    scheduleSelectionStateRefresh();
    scheduleAutoExport();
    return;
  }
  const relevant = event.nodeChanges.some((change) => {
    if (!change.id) return false;
    if (change.id === target.id) return true;
    let changed = null;
    try {
      changed = resolveNodeById(change.id);
    } catch {
      return false;
    }
    for (let parent = changed && changed.parent; parent; parent = parent.parent) {
      if (parent.id === target.id) return true;
    }
    return false;
  });
  if (relevant) {
    if (target.type === 'INSTANCE' && registeredSetName(target) === 'Card') {
      syncCardIconPositionForWidth(target, []);
    }
    if (target.type === 'INSTANCE' && registeredSetName(target) === 'Breadcrumb') {
      syncBreadcrumbBackButtonForWidth(target, []);
    }
    if (target.type === 'INSTANCE' && registeredSetName(target) === 'Button Container') {
      syncButtonContainerForWidth(target, []);
    }
    if (target.type === 'INSTANCE' && registeredSetName(target) === 'Choice Group') {
      syncChoiceGroupTileSizing(target, []);
    }
    scheduleSelectionStateRefresh();
    scheduleAutoExport();
  }
}

let nodeChangePage = null;
function bindCurrentPageNodeChange() {
  const page = figma.currentPage;
  if (!page || page === nodeChangePage) return;
  nodeChangePage = page;
  page.on('nodechange', handleCurrentPageNodeChange);
}

figma.on('currentpagechange', bindCurrentPageNodeChange);
bindCurrentPageNodeChange();

setInterval(() => {
  syncSelectedInstancePropertySignature({ schedule: true });
}, 600);

postSelectionState();
syncSelectedInstancePropertySignature();
scheduleAutoExport();

figma.ui.onmessage = async (message) => {
  try {
    if (message.type === 'export') runExport(false);
    if (message.type === 'export-figure-image') await sendSelectedFigureImageToPlayground();
    if (message.type === 'audit-selection') await handleAuditSelection({ printReport: message.printReport === true });
    if (message.type === 'select-audit-issue') handleSelectAuditIssue(message.nodeId);
    if (message.type === 'ignore-audit-issue') handleIgnoreAuditIssue(message.nodeId);
    if (message.type === 'tidy-up') await handleTidyUp();
    if (message.type === 'detach-all') await handleDetachAll();
    if (message.type === 'set-live-view') {
      // Live view is a plain toggle: the plugin window keeps its normal size
      // and the full UI stays visible while it is on.
      liveViewEnabled = message.enabled === true;
      // The UI first opens or refreshes Preview from the current JSON.
      // Give that page a moment to register its listener before sending the
      // topmost live export, otherwise the first preview could replace the
      // handoff that is opening the page.
      if (liveViewEnabled) setTimeout(scheduleLivePreview, 900);
    }
    if (message.type === 'set-plugin-mode') {
      pluginMode = ['audit', 'build-fix', 'live-edit', 'patterns', 'help'].includes(message.mode) ? message.mode : 'build-fix';
      if (pluginUiMode !== 'full') return;
      const size = pluginMode === 'live-edit'
        ? PLUGIN_UI_SIZE.liveEdit
        : pluginMode === 'build-fix'
          ? PLUGIN_UI_SIZE.buildFix
          : pluginMode === 'patterns'
            ? PLUGIN_UI_SIZE.patterns
          : pluginMode === 'help'
            ? PLUGIN_UI_SIZE.help
          : PLUGIN_UI_SIZE.default;
      figma.ui.resize(size.width, size.height);
    }
    if (message.type === 'set-plugin-ui-mode') {
      pluginUiMode = ['full', 'minimized', 'context'].includes(message.mode) ? message.mode : 'full';
      const size = pluginUiMode === 'minimized'
        ? PLUGIN_UI_SIZE.minimized
        : pluginUiMode === 'context'
          ? PLUGIN_UI_SIZE.context
          : pluginMode === 'live-edit'
            ? PLUGIN_UI_SIZE.liveEdit
            : pluginMode === 'build-fix'
              ? PLUGIN_UI_SIZE.buildFix
              : pluginMode === 'patterns'
                ? PLUGIN_UI_SIZE.patterns
                : pluginMode === 'help'
                  ? PLUGIN_UI_SIZE.help
                  : PLUGIN_UI_SIZE.default;
      figma.ui.resize(size.width, size.height);
    }
    if (message.type === 'set-plugin-compact') {
      // Backward-compatible controller command for older UI bundles.
      pluginUiMode = message.compact === true ? 'minimized' : 'full';
      if (pluginUiMode === 'minimized') {
        figma.ui.resize(PLUGIN_UI_SIZE.minimized.width, PLUGIN_UI_SIZE.minimized.height);
      } else {
        const size = pluginMode === 'live-edit'
          ? PLUGIN_UI_SIZE.liveEdit
          : pluginMode === 'build-fix'
            ? PLUGIN_UI_SIZE.buildFix
            : pluginMode === 'patterns'
              ? PLUGIN_UI_SIZE.patterns
              : pluginMode === 'help'
                ? PLUGIN_UI_SIZE.help
                : PLUGIN_UI_SIZE.default;
        figma.ui.resize(size.width, size.height);
      }
    }
    if (message.type === 'set-breakpoint-visibility') handleSetBreakpointVisibility(message);
    if (message.type === 'close-plugin') figma.closePlugin();
    if (message.type === 'set-linked-page-live') {
      linkedPageLiveLink = message.enabled === true ? message.link : null;
      if (linkedPageLiveLink) scheduleLinkedPagePreview();
    }
    if (message.type === 'import') {
      const result = await handleImport(message.text, message.assets, figma.currentPage, false, { breakpoints: message.breakpoints, primary: message.primary });
      if (result && message.handoffId) {
        postPluginMessage({ type: 'handoff-import-result', handoffId: message.handoffId, ...result });
      }
    }
    if (message.type === 'create-breakpoints' || message.type === 'sync-breakpoints') {
      createBreakpointRoots({ primary: message.primary, breakpoints: message.breakpoints });
    }
    if (message.type === 'export-responsive-diff') {
      exportResponsiveDiff({ primary: message.primary });
    }
    if (message.type === 'linked-page-import') {
      const result = await handleLinkedPageImport(message.text, message.assets, message.link);
      if (result) postPluginMessage({
        type: 'linked-page-import-result',
        handoffId: message.handoffId,
        link: { ...message.link, figmaRootNodeId: result.rootNodeId, figmaPageId: result.figmaPageId, figmaFileKey: result.figmaFileKey },
        ...result,
      });
    }
    if (message.type === 'linked-project-import') {
      const pages = Array.isArray(message.pages) ? message.pages.slice(0, 100) : [];
      const roots = [];
      const warnings = [];
      const origin = { x: Math.round(figma.viewport.center.x), y: Math.round(figma.viewport.center.y) };
      let nextY = origin.y;
      for (let index = 0; index < pages.length; index += 1) {
        const page = pages[index];
        if (!page || typeof page.text !== 'string' || !page.link) {
          warnings.push(`Page ${index + 1} could not be rendered.`);
          continue;
        }
        const result = await handleLinkedPageImport(page.text, page.assets || [], page.link);
        if (!result) {
          warnings.push(`${page.link.pageTitle || page.link.pageId}: could not be rendered.`);
          continue;
        }
        const root = resolveNodeById(result.rootNodeId);
        if (root && root.type === 'FRAME') {
          root.x = origin.x;
          root.y = nextY;
          nextY += Math.max(root.height, 800) + 120;
          roots.push(root);
        }
        if (Array.isArray(result.warnings)) warnings.push(...result.warnings);
      }
      if (roots.length) {
        figma.currentPage.selection = roots;
        figma.viewport.scrollAndZoomIntoView(roots);
      }
      postPluginMessage({
        type: 'linked-project-import-result',
        projectId: message.projectId,
        count: roots.length,
        warnings,
      });
    }
    if (message.type === 'linked-page-export') {
      const result = await exportLinkedPage(message.link);
      postPluginMessage({
        type: 'linked-page-export-result',
        link: { ...message.link, figmaRootNodeId: result.rootNodeId, figmaPageId: result.figmaPageId, figmaFileKey: result.figmaFileKey },
        ...result,
      });
    }
    if (message.type === 'import-pattern') {
      await importPatternAsComponentSet(message.pattern);
    }
    if (message.type === 'export-pattern') {
      exportSelectedPattern();
    }
    if (message.type === 'create-a1-page') {
      const result = await exportNewA1Page(message.project);
      postPluginMessage({ type: 'create-a1-page-result', ...result });
    }
    if (message.type === 'detect-linked-page') {
      const link = detectLinkedPageFromFrameNames(message.projects);
      postPluginMessage({ type: 'detected-linked-page', link });
    }
    if (message.type === 'update') await handleUpdate(message.text);
    if (message.type === 'fix-text') await handleFixText();
    if (message.type === 'set-page-layout-props') await handleSetPageLayoutProps(message);
    if (message.type === 'set-top-header-props') await handleSetTopHeaderProps(message);
    if (message.type === 'set-text-props') await handleSetTextProps(message);
    if (message.type === 'set-link-props') await handleSetLinkProps(message);
    if (message.type === 'set-button-props') await handleSetButtonProps(message);
    if (message.type === 'set-button-container-props') await handleSetButtonContainerProps(message);
    if (message.type === 'set-button-dialog-link') await handleSetActionTriggerLink({ ...message, componentName: 'Button', targetType: 'Dialog' });
    if (message.type === 'add-dialog-for-button') await handleAddActionTargetForTrigger({ ...message, componentName: 'Button', targetType: 'Dialog' });
    if (message.type === 'set-dialog-trigger-link') await handleSetActionTriggerLink({ ...message, targetType: 'Dialog' });
    if (message.type === 'add-dialog-for-trigger') await handleAddActionTargetForTrigger({ ...message, targetType: 'Dialog' });
    if (message.type === 'set-action-trigger-link') await handleSetActionTriggerLink(message);
    if (message.type === 'add-action-trigger-target') await handleAddActionTargetForTrigger(message);
    if (message.type === 'set-icon-button-props') await handleSetIconButtonProps(message);
    if (message.type === 'set-badge-props') await handleSetBadgeProps(message);
    if (message.type === 'set-card-props') await handleSetCardProps(message);
    if (message.type === 'set-dialog-props') await handleSetDialogProps(message);
    if (message.type === 'set-menu-props') handleSetMenuProps(message);
    if (message.type === 'set-definition-list-props') await handleSetDefinitionListProps(message);
    if (message.type === 'set-data-table-props') await handleSetDataTableProps(message);
    if (message.type === 'set-choice-group-props') await handleSetChoiceGroupProps(message);
    if (message.type === 'set-section-props') await handleSetSectionProps(message);
    if (message.type === 'set-stack-props') await handleSetStackProps(message);
    if (message.type === 'set-grid-props') handleSetGridProps(message);
    if (message.type === 'fix-all') await handleFixAll();
    if (message.type === 'fix-all-text') await handleFixAllText();
    if (message.type === 'fix-page-layout') await handleFixPageLayout();
    if (message.type === 'convert-to') await handleConvertTo(message.target, 'convert-result', { responsiveColumns: message.responsiveColumns });
    if (message.type === 'add-component') await handleAddComponent(message.target, { responsiveColumns: message.responsiveColumns });
    if (message.type === 'export-component-keys') await handleExportComponentKeys();
    if (message.type === 'apply-grid-breakpoints') handleApplyGridBreakpoints({ gridNodeId: message.gridNodeId, responsiveColumns: message.responsiveColumns, primary: message.primary });
    if (message.type === 'convert-to-section') await handleConvertToSection();
    if (message.type === 'fix-card') await handleFixCard();
    if (message.type === 'fix-stack') await handleFixStack();
    if (message.type === 'fix-section') await handleFixSection();
  } catch (error) {
    postError(error.message);
  }
};
