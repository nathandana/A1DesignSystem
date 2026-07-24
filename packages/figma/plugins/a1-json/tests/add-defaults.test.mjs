import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import ts from 'typescript';

const here = dirname(fileURLToPath(import.meta.url));
const codePath = resolve(here, '../src/code.js');

function sourceFile() {
  const source = readFileSync(codePath, 'utf8');
  return ts.createSourceFile(codePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
}

function variableInitializer(file, name) {
  for (const statement of file.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === name) return declaration.initializer;
    }
  }
  return null;
}

function objectKeys(node) {
  assert.ok(node && ts.isObjectLiteralExpression(node), 'expected object literal');
  return node.properties.map((property) => {
    const name = property.name;
    assert.ok(name && (ts.isIdentifier(name) || ts.isStringLiteral(name)), 'expected simple object key');
    return name.text;
  }).sort();
}

test('quick-add targets have data-backed defaults or a computed factory', () => {
  const file = sourceFile();
  const componentTargets = objectKeys(variableInitializer(file, 'ADD_TARGET_COMPONENT_NAMES'));
  const templates = objectKeys(variableInitializer(file, 'ADD_TARGET_DEFAULT_TEMPLATES'));
  const factories = objectKeys(variableInitializer(file, 'ADD_TARGET_DEFAULT_FACTORIES'));
  const specialRenderTargets = ['body', 'grid', 'heading', 'icon', 'stack'];
  const expected = [...new Set([...componentTargets, ...specialRenderTargets])].sort();
  assert.deepEqual([...templates, ...factories].sort(), expected);
});
