// Reads per-story artifacts and generates HTML reports.
import { writeFileSync, readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const ROOT       = fileURLToPath(new URL('..', import.meta.url));
const REPORTS    = join(ROOT, 'reports');
const A11Y_DIR   = join(REPORTS, '.a11y');
const VISUAL_DIR = join(REPORTS, '.visual');
const SCAN_LOG   = join(REPORTS, '.scan.log');

const totalScanned = existsSync(SCAN_LOG)
  ? readFileSync(SCAN_LOG, 'utf8').trim().split('\n').filter(Boolean).length
  : 0;

// ── A11y report — always written ──────────────────────────────────────────────

const a11yFiles   = existsSync(A11Y_DIR) ? readdirSync(A11Y_DIR).filter(f => f.endsWith('.json')) : [];
const a11yStories = a11yFiles.map(f => JSON.parse(readFileSync(join(A11Y_DIR, f), 'utf8')));

writeFileSync(join(REPORTS, 'a11y.html'), buildA11yReport(a11yStories, totalScanned));

if (a11yStories.length === 0) {
  console.log(`\n✅  No accessibility violations across ${totalScanned} stories → reports/a11y.html\n`);
} else {
  const total = a11yStories.reduce((n, s) => n + s.violations.length, 0);
  console.log(`\n⚠️   ${total} a11y violation(s) in ${a11yStories.length} / ${totalScanned} stories → reports/a11y.html\n`);
}

// ── Visual diff report — written only when regressions exist ──────────────────

const visualFiles = existsSync(VISUAL_DIR) ? readdirSync(VISUAL_DIR).filter(f => f.endsWith('.json')) : [];

if (visualFiles.length > 0) {
  const diffs = visualFiles.map(f => JSON.parse(readFileSync(join(VISUAL_DIR, f), 'utf8')));
  writeFileSync(join(REPORTS, 'visual.html'), buildVisualReport(diffs, totalScanned));
  console.log(`\n❌  Visual regressions in ${diffs.length} / ${totalScanned} stories → reports/visual.html\n`);
} else {
  console.log(`\n✅  No visual regressions across ${totalScanned} stories\n`);
}

// ─── A11y HTML report ─────────────────────────────────────────────────────────

function buildA11yReport(stories, totalScanned = 0) {
  const totalViolations = stories.reduce((n, s) => n + s.violations.length, 0);
  const counts = { critical: 0, serious: 0, moderate: 0, minor: 0 };
  for (const s of stories) for (const v of s.violations) counts[v.impact] = (counts[v.impact] ?? 0) + 1;

  const allClearBanner = stories.length === 0 ? `
  <div class="allclear">
    <span class="allclear-icon">✅</span>
    <div>
      <strong>No violations found</strong>
      <p>${totalScanned} stories scanned against WCAG 2.0 / 2.1 / 2.2 Levels A &amp; AA — all passed.</p>
    </div>
  </div>` : '';

  const storyRows = stories.map(s => {
    const items = s.violations.map(v => {
      const nodes = v.nodes.map(n => `
          <li>
            <code>${esc(n.html)}</code>
            <p>${esc(n.failureSummary)}</p>
          </li>`).join('');
      return `
        <div class="violation">
          <div class="vhd">
            <span class="badge ${v.impact}">${v.impact}</span>
            <strong>${esc(v.id)}</strong>
            <span class="desc">${esc(v.description)}</span>
          </div>
          <ul>${nodes}</ul>
          <a href="${esc(v.helpUrl)}" target="_blank" rel="noopener">Learn more ↗</a>
        </div>`;
    }).join('');
    return `
      <section>
        <h2>${esc(s.id)}</h2>
        <p class="url">${esc(s.url)}</p>
        ${items}
      </section>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Accessibility Report — A1 Design System</title>
  <style>
    *,*::before,*::after{box-sizing:border-box}
    body{font-family:system-ui,-apple-system,sans-serif;margin:0;background:#f8fafc;color:#1e293b}
    .hd{background:#1e293b;color:#fff;padding:24px 40px}
    .hd h1{margin:0 0 4px;font-size:1.5rem}.hd p{margin:0;opacity:.6;font-size:.875rem}
    .summary{display:flex;gap:12px;padding:20px 40px;border-bottom:1px solid #e2e8f0;flex-wrap:wrap}
    .stat{background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px 20px}
    .stat-n{font-size:1.75rem;font-weight:700;line-height:1}.stat-l{font-size:.75rem;color:#64748b;margin-top:4px}
    .critical .stat-n{color:#dc2626}.serious .stat-n{color:#ea580c}.moderate .stat-n{color:#ca8a04}.minor .stat-n{color:#16a34a}
    .allclear{display:flex;align-items:flex-start;gap:16px;margin:24px 40px;padding:20px 24px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px}
    .allclear-icon{font-size:1.5rem;line-height:1;flex-shrink:0}
    .allclear strong{display:block;font-size:1rem;color:#15803d;margin-bottom:4px}
    .allclear p{margin:0;font-size:.875rem;color:#166534}
    .content{padding:24px 40px;max-width:1100px}
    section{background:#fff;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:16px;overflow:hidden}
    section h2{margin:0;padding:12px 20px;font-size:.875rem;font-family:monospace;background:#f1f5f9;border-bottom:1px solid #e2e8f0}
    .url{margin:0;padding:4px 20px 8px;font-size:.75rem;color:#94a3b8;font-family:monospace}
    .violation{padding:14px 20px;border-bottom:1px solid #f1f5f9}.violation:last-child{border-bottom:none}
    .vhd{display:flex;align-items:baseline;gap:10px;margin-bottom:8px;flex-wrap:wrap}
    .badge{font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:2px 8px;border-radius:4px}
    .badge.critical{background:#fee2e2;color:#dc2626}.badge.serious{background:#ffedd5;color:#ea580c}
    .badge.moderate{background:#fef9c3;color:#ca8a04}.badge.minor{background:#f0fdf4;color:#16a34a}
    .desc{color:#64748b;font-size:.875rem}.violation a{font-size:.8rem;color:#6366f1;text-decoration:none}
    .violation ul{margin:8px 0 10px;padding:0;list-style:none;display:flex;flex-direction:column;gap:6px}
    .violation li{background:#f8fafc;border:1px solid #e2e8f0;border-radius:4px;padding:10px 12px}
    .violation code{display:block;font-size:.8rem;color:#7c3aed;overflow-x:auto;white-space:pre;margin-bottom:6px}
    .violation p{margin:0;font-size:.8rem;color:#64748b}
  </style>
</head>
<body>
  <div class="hd">
    <h1>Accessibility Report</h1>
    <p>A1 Design System &middot; ${new Date().toLocaleString()} &middot; ${totalScanned} stories &middot; WCAG 2.0 / 2.1 / 2.2 — Levels A &amp; AA</p>
  </div>
  <div class="summary">
    <div class="stat"><div class="stat-n">${totalScanned}</div><div class="stat-l">Stories scanned</div></div>
    <div class="stat"><div class="stat-n">${totalViolations}</div><div class="stat-l">Total violations</div></div>
    <div class="stat"><div class="stat-n">${stories.length}</div><div class="stat-l">Stories affected</div></div>
    <div class="stat critical"><div class="stat-n">${counts.critical}</div><div class="stat-l">Critical</div></div>
    <div class="stat serious"><div class="stat-n">${counts.serious}</div><div class="stat-l">Serious</div></div>
    <div class="stat moderate"><div class="stat-n">${counts.moderate}</div><div class="stat-l">Moderate</div></div>
    <div class="stat minor"><div class="stat-n">${counts.minor}</div><div class="stat-l">Minor</div></div>
  </div>
  ${allClearBanner}
  <div class="content">${storyRows}</div>
</body>
</html>`;
}

// ─── Visual diff HTML report ──────────────────────────────────────────────────

function buildVisualReport(diffs, totalScanned = 0) {
  const rows = diffs.map(d => {
    if (d.error) {
      return `
        <section>
          <h2>${esc(d.id)}</h2>
          <p class="error">${esc(d.error)}</p>
        </section>`;
    }
    const base = `visual/diffs/${esc(d.id)}`;
    return `
      <section>
        <h2>${esc(d.id)}</h2>
        <p class="meta">${d.diffPercent}% pixels changed (${d.numDiffPixels.toLocaleString()} / ${d.totalPixels.toLocaleString()})</p>
        <div class="imgs">
          <figure><figcaption>Baseline</figcaption><img src="${base}-baseline.png" alt="baseline"></figure>
          <figure><figcaption>Current</figcaption><img src="${base}-current.png" alt="current"></figure>
          <figure><figcaption>Diff</figcaption><img src="${base}-diff.png" alt="diff"></figure>
        </div>
      </section>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Visual Regression Report — A1 Design System</title>
  <style>
    *,*::before,*::after{box-sizing:border-box}
    body{font-family:system-ui,-apple-system,sans-serif;margin:0;background:#f8fafc;color:#1e293b}
    .hd{background:#1e293b;color:#fff;padding:24px 40px}
    .hd h1{margin:0 0 4px;font-size:1.5rem}.hd p{margin:0;opacity:.6;font-size:.875rem}
    .content{padding:24px 40px;max-width:1400px}
    section{background:#fff;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:20px;overflow:hidden}
    section h2{margin:0;padding:12px 20px;font-size:.875rem;font-family:monospace;background:#fef2f2;border-bottom:1px solid #fecaca;color:#dc2626}
    .meta{margin:0;padding:8px 20px;font-size:.8rem;color:#64748b;border-bottom:1px solid #f1f5f9}
    .error{margin:0;padding:12px 20px;font-size:.875rem;color:#dc2626}
    .imgs{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding:16px 20px}
    figure{margin:0;display:flex;flex-direction:column;gap:6px}
    figcaption{font-size:.75rem;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.05em}
    img{width:100%;border:1px solid #e2e8f0;border-radius:4px;display:block}
  </style>
</head>
<body>
  <div class="hd">
    <h1>Visual Regression Report</h1>
    <p>A1 Design System &middot; ${new Date().toLocaleString()} &middot; ${diffs.length} regression${diffs.length === 1 ? '' : 's'} in ${totalScanned} stories</p>
  </div>
  <div class="content">${rows}</div>
</body>
</html>`;
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
