// Reads every system/rules/*.yaml file and flattens them into the same `Rule`
// shape apps/a1-web/src/rules/ruleStore.ts already defines for the a1-web
// Rules page, so the MCP server, the Rules page, and eslint-plugin-a1 all
// present one consistent rule model. Auto-discovers files via readdirSync
// rather than a hand-maintained import list, so new rule files need no extra
// wiring here.

import fs from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { repoPath } from './paths.mjs';

export function parseRules() {
  const rulesDir = repoPath('system/rules');
  const files = fs
    .readdirSync(rulesDir)
    .filter((f) => f.endsWith('.yaml'))
    .sort();

  const rules = [];
  for (const file of files) {
    let doc;
    try {
      doc = parseYaml(fs.readFileSync(path.join(rulesDir, file), 'utf8'));
    } catch {
      continue; // skip unparsable rule file rather than fail the whole index build
    }
    const topComponent = doc?.component;
    for (const r of doc?.rules ?? []) {
      if (!r?.id) continue;
      const components = Array.isArray(r.components)
        ? r.components
        : topComponent
          ? [topComponent]
          : [];
      rules.push({
        id: r.id,
        component: topComponent ?? components[0] ?? 'General',
        components,
        requirement: r.requirement ?? r.description ?? '',
        do: r.do ?? null,
        dont: r.dont ?? null,
        appliesTo: Array.isArray(r.applies_to) ? r.applies_to : [],
        enforcement: r.enforcement
          ? { eslint: r.enforcement.eslint ?? null, css: r.enforcement.css === true }
          : null,
        file: `system/rules/${file}`,
      });
    }
  }
  return rules;
}
