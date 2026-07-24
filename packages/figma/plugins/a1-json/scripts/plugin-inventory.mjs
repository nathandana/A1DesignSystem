import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { validateComponentRegistry } from './component-registry-inventory.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const pluginRoot = resolve(here, '..');
const codePath = resolve(pluginRoot, 'src/code.js');
const uiPath = resolve(pluginRoot, 'src/ui.html');

function lineCount(source) {
  return source.length === 0 ? 0 : source.split(/\r?\n/).length;
}

function uniqueMatches(source, expression) {
  return [...new Set([...source.matchAll(expression)].map((match) => match[1]))].sort();
}

function countObjectProperties(sourceFile, name) {
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || declaration.name.text !== name) continue;
      if (!declaration.initializer || !ts.isObjectLiteralExpression(declaration.initializer)) return 0;
      return declaration.initializer.properties.length;
    }
  }
  return 0;
}

function countFunctions(sourceFile) {
  let total = 0;
  let topLevel = 0;

  for (const statement of sourceFile.statements) {
    if (ts.isFunctionDeclaration(statement)) topLevel += 1;
  }

  function visit(node) {
    if (
      ts.isFunctionDeclaration(node)
      || ts.isFunctionExpression(node)
      || ts.isArrowFunction(node)
      || ts.isMethodDeclaration(node)
    ) {
      total += 1;
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);

  return { total, topLevel };
}

function countTopLevelDeclarations(sourceFile) {
  let total = 0;
  for (const statement of sourceFile.statements) {
    if (ts.isFunctionDeclaration(statement)) total += 1;
    if (ts.isVariableStatement(statement)) total += statement.declarationList.declarations.length;
  }
  return total;
}

export function createInventory() {
  const code = readFileSync(codePath, 'utf8');
  const ui = readFileSync(uiPath, 'utf8');
  const sourceFile = ts.createSourceFile(codePath, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  const functions = countFunctions(sourceFile);

  const registry = validateComponentRegistry().counts;
  return {
    code: {
      lines: lineCount(code),
      functions,
      topLevelDeclarations: countTopLevelDeclarations(sourceFile),
      registries: {
        adapters: registry.adapters,
        figmaNames: registry.figmaNames,
        jsonTypes: registry.jsonTypes,
        exporters: registry.exportHandlers,
        importers: registry.importHandlers,
        appliers: registry.applyHandlers,
      },
      inboundMessages: uniqueMatches(code, /message\.type\s*===\s*['"`]([^'"`]+)['"`]/g),
    },
    ui: {
      lines: lineCount(ui),
      handledMessages: uniqueMatches(ui, /message\.type\s*===\s*['"`]([^'"`]+)['"`]/g),
      outboundMessages: uniqueMatches(ui, /type:\s*['"`]([^'"`]+)['"`]/g),
    },
  };
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(createInventory(), null, 2));
}
