#!/usr/bin/env node
// Builds packages/mcp-server/index.json — the single static index the MCP
// Netlify Function loads at cold start. Run via `npm run build:mcp-index`
// (see packages/react/ai/quick-orientation.md). Re-run after any change to
// components.md, a component's .d.ts, tokens, themes, rules, or the
// page-definition contract, and always after `npm run build:tokens`.

import fs from 'node:fs';
import { MCP_SERVER_ROOT } from './lib/paths.mjs';
import { parseTokens } from './lib/parse-tokens.mjs';
import { parseThemes } from './lib/parse-themes.mjs';
import { parseRules } from './lib/parse-rules.mjs';
import { parseComponentsMd, parseComponentExports, matchComponentExports } from './lib/parse-components.mjs';
import { parsePageTypes } from './lib/parse-page-types.mjs';
import { parseDocs } from './lib/docs.mjs';
import { patternManifests, createPatternNode } from '../../react/src/patterns/patternPolicies.js';
import { validatePatterns, formatPatternDiagnostics } from '../../react/src/patterns/patternValidation.js';

function buildComponents() {
  const { categories, components: coverageComponents } = parseComponentsMd();
  const exportsList = parseComponentExports();

  const components = coverageComponents.map((c) => {
    const matches = matchComponentExports(c.name, exportsList);
    return {
      name: c.name,
      categoryId: c.categoryId,
      coverage: {
        react: c.react,
        native: c.native,
        pure: c.pure,
        webComponents: c.webComponents,
        figma: c.figma,
      },
      exports: matches.map((m) => ({
        exportedName: m.exportedName,
        propsInterfaceName: m.propsInterfaceName,
        extends: m.extends,
        sourceFile: m.sourceFile,
        props: m.props,
      })),
      highlights: c.highlights,
    };
  });

  return { categories, components };
}

function buildRulesByComponent(rules) {
  const byComponent = {};
  for (const rule of rules) {
    const componentNames = rule.components.length ? rule.components : [rule.component];
    for (const name of componentNames) {
      if (!byComponent[name]) byComponent[name] = [];
      byComponent[name].push(rule.id);
    }
  }
  return byComponent;
}

function main() {
  const tokens = parseTokens();
  const themes = parseThemes(tokens);
  const rules = parseRules();
  const { categories, components } = buildComponents();
  const { componentTypes } = parsePageTypes();
  const docs = parseDocs();

  const patterns = patternManifests.map(manifest => ({
    ...manifest,
    starter: createPatternNode(manifest.type),
    examples: manifest.examples.map(example => createPatternNode(manifest.type, { ...example, id: `${manifest.id}-${example.id}` })),
  }));
  for (const pattern of patterns) {
    if (!componentTypes.includes(pattern.type)) throw new Error(`Unregistered pattern ${pattern.type}`);
    for (const rule of pattern.rules) if (!rules.some(r => r.id === rule.id)) throw new Error(`Unknown rule ${rule.id}`);
    for (const example of [pattern.starter, ...pattern.examples]) {
      const result = validatePatterns(example);
      if (!result.valid) throw new Error(formatPatternDiagnostics(result.diagnostics));
    }
  }
  const index = {
    schemaVersion: '0.2.0',
    patterns,
    generatedAt: new Date().toISOString(),
    categories,
    components,
    tokens,
    themes,
    rules,
    rulesByComponent: buildRulesByComponent(rules),
    pageTypes: componentTypes,
    docs,
  };

  const outPath = `${MCP_SERVER_ROOT}/index.json`;
  if (process.argv.includes('--check')) {
    const current = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    if (JSON.stringify({ ...current, generatedAt: null }) !== JSON.stringify({ ...index, generatedAt: null })) throw new Error('Stale MCP index. Run npm run build:mcp-index.');
    console.log('MCP index is current.');
    return;
  }
  fs.writeFileSync(outPath, JSON.stringify(index));

  const sizeKb = (fs.statSync(outPath).size / 1024).toFixed(1);
  console.log(
    `Wrote ${outPath} (${sizeKb} KB): ${components.length} components, ${tokens.length} tokens, ` +
      `${themes.length} themes, ${rules.length} rules, ${componentTypes.length} page types.`,
  );
}

main();
