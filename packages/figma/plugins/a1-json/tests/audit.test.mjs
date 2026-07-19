import assert from 'node:assert/strict';
import test from 'node:test';
import {
  auditCoverageScoreCap,
  auditGrade,
  auditIssueBucket,
  auditReportFindings,
  auditReportMetrics,
  auditReportRecommendations,
  auditReportSummary,
  auditScoreFromIssueGroups,
  compactWarningMessage,
  compactWarnings,
  normalizeAuditIssueKey,
} from '../src/pure/audit.js';

test('compacts repeated warnings and multiline warning messages', () => {
  assert.deepEqual(compactWarnings(['A', 'B', 'A', '', null]), ['A (2×)', 'B']);
  assert.equal(compactWarningMessage('A\nA\nB'), 'A (2×)\nB');
});

test('normalizes audit issue keys and groups repeated issue families', () => {
  assert.equal(normalizeAuditIssueKey('Layer "Hero 123" has 12.5 px'), 'layer "…" has # px');
  const report = { issueGroups: {} };
  const first = auditIssueBucket(report, 'Unsupported layer 12');
  const second = auditIssueBucket(report, 'Unsupported layer 99');
  assert.equal(first.key, second.key);
  assert.equal(second.count, 2);
  assert.equal(second.severity, 'major');
});

test('scores and caps audit reports by severity and A1 coverage', () => {
  const report = {
    nodeCount: 12,
    supportedComponents: 0,
    supportedTextStyles: 0,
    issueGroups: {},
  };
  auditIssueBucket(report, 'Unsupported component instance.');
  auditIssueBucket(report, 'Text can be improved: nearest A1 style.');
  assert.equal(auditScoreFromIssueGroups(report), 96);
  assert.equal(auditCoverageScoreCap(report), 55);
  assert.equal(auditGrade(95), 'A');
  assert.equal(auditGrade(64), 'F');
});

test('formats audit report metrics, recommendations, summary, and findings', () => {
  const report = {
    nodeCount: 3,
    auditedRoots: 1,
    supportedComponents: 1,
    missingColorValues: 2,
    missingTextStyles: 1,
    unsupportedElements: 1,
    missingComponents: 0,
    autoFixOpportunities: 1,
    issueGroupCount: 1,
    issueGroups: {},
  };
  auditIssueBucket(report, 'Unsupported layer.', { severity: 'major', category: 'JSON translation' });
  assert.equal(auditReportMetrics(report).length, 6);
  assert.deepEqual(auditReportRecommendations(report), [
    'Run AutoFix all to normalize supported text, Card, Stack, Grid, and Section issues.',
    'Bind raw or broken fills/strokes to valid A1 color variables before export.',
    'Apply A1 text styles instead of detached typography.',
    'Replace unsupported layers with A1 components or add the missing component mapping.',
  ]);
  assert.equal(auditReportSummary(report), 'Audited 3 layers across 1 root; 1 issue family scored.');
  assert.deepEqual(auditReportFindings(report), ['Major translation issue: Unsupported layer.']);
});
