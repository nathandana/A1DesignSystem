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

  const index = {
    schemaVersion: '0.1.0',
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
  fs.writeFileSync(outPath, JSON.stringify(index));

  const sizeKb = (fs.statSync(outPath).size / 1024).toFixed(1);
  console.log(
    `Wrote ${outPath} (${sizeKb} KB): ${components.length} components, ${tokens.length} tokens, ` +
      `${themes.length} themes, ${rules.length} rules, ${componentTypes.length} page types.`,
  );
}

main();
