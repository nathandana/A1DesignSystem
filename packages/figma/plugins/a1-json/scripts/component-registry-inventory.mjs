import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const here = dirname(fileURLToPath(import.meta.url));
const pluginRoot = resolve(here, '..');
const codePath = resolve(pluginRoot, 'src/code.js');
const isCli = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

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

function propertyValue(object, name) {
  if (!object || !ts.isObjectLiteralExpression(object)) return null;
  for (const property of object.properties) {
    if (!ts.isPropertyAssignment(property)) continue;
    const key = property.name;
    const propertyName = ts.isIdentifier(key) || ts.isStringLiteral(key) ? key.text : '';
    if (propertyName === name) return property.initializer;
  }
  return null;
}

function stringValue(node) {
  return node && ts.isStringLiteral(node) ? node.text : '';
}

function identifierValue(node) {
  return node && ts.isIdentifier(node) ? node.text : '';
}

function stringArray(node) {
  if (!node || !ts.isArrayLiteralExpression(node)) return [];
  return node.elements.map(stringValue).filter(Boolean);
}

function objectEntries(node) {
  if (!node || !ts.isObjectLiteralExpression(node)) return [];
  return node.properties
    .filter(ts.isPropertyAssignment)
    .map((property) => {
      const key = property.name;
      const name = ts.isIdentifier(key) || ts.isStringLiteral(key) ? key.text : '';
      return [name, stringArray(property.initializer)];
    })
    .filter(([name]) => Boolean(name));
}

function capabilities(node) {
  return {
    update: propertyValue(node, 'update')?.kind === ts.SyntaxKind.TrueKeyword,
    children: stringValue(propertyValue(node, 'children')),
  };
}

export function componentRegistryInventory() {
  const file = sourceFile();
  const adaptersNode = variableInitializer(file, 'COMPONENT_ADAPTERS');
  const helpersNode = variableInitializer(file, 'FIGMA_LIBRARY_COMPONENT_ALIASES');
  const adapters = [];
  if (adaptersNode && ts.isArrayLiteralExpression(adaptersNode)) {
    for (const adapterNode of adaptersNode.elements) {
      if (!ts.isObjectLiteralExpression(adapterNode)) continue;
      const figmaNode = propertyValue(adapterNode, 'figma');
      const figma = [];
      if (figmaNode && ts.isArrayLiteralExpression(figmaNode)) {
        for (const entryNode of figmaNode.elements) {
          if (!ts.isObjectLiteralExpression(entryNode)) continue;
          figma.push({
            name: stringValue(propertyValue(entryNode, 'name')),
            aliases: stringArray(propertyValue(entryNode, 'aliases')),
            export: identifierValue(propertyValue(entryNode, 'export')),
            apply: identifierValue(propertyValue(entryNode, 'apply')),
          });
        }
      }
      adapters.push({
        jsonType: stringValue(propertyValue(adapterNode, 'jsonType')),
        import: identifierValue(propertyValue(adapterNode, 'import')),
        figma,
        capabilities: capabilities(propertyValue(adapterNode, 'capabilities')),
      });
    }
  }

  return {
    adapters,
    helperAliases: Object.fromEntries(objectEntries(helpersNode)),
  };
}

function canonicalName(value) {
  return String(value || '').replace(/[\s_-]+/g, '').toLowerCase();
}

export function validateComponentRegistry(registry = componentRegistryInventory()) {
  const errors = [];
  const jsonTypes = new Map();
  const figmaNames = new Map();
  const aliases = new Map();

  for (const adapter of registry.adapters) {
    if (!adapter.jsonType) errors.push('Adapter is missing jsonType.');
    if (adapter.jsonType && jsonTypes.has(adapter.jsonType)) errors.push(`Duplicate JSON type "${adapter.jsonType}".`);
    if (adapter.jsonType) jsonTypes.set(adapter.jsonType, adapter);
    if (!adapter.capabilities.children) errors.push(`${adapter.jsonType} is missing children capability.`);

    for (const entry of adapter.figma) {
      if (!entry.name) errors.push(`${adapter.jsonType} has a Figma entry without a name.`);
      if (entry.name && figmaNames.has(entry.name)) errors.push(`Duplicate Figma component name "${entry.name}".`);
      if (entry.name) figmaNames.set(entry.name, entry);
      if (entry.apply && adapter.capabilities.update !== true) {
        errors.push(`${entry.name} declares an apply handler but update capability is false.`);
      }
      for (const value of [entry.name, ...entry.aliases]) {
        const canonical = canonicalName(value);
        if (!canonical) continue;
        const owner = aliases.get(canonical);
        if (owner && owner !== entry.name) {
          errors.push(`Alias "${value}" is ambiguous between "${owner}" and "${entry.name}".`);
        }
        aliases.set(canonical, entry.name);
      }
    }
  }

  for (const [name, values] of Object.entries(registry.helperAliases)) {
    if (figmaNames.has(name)) errors.push(`Helper alias "${name}" duplicates an adapter Figma name.`);
    for (const value of [name, ...values]) {
      const canonical = canonicalName(value);
      if (!canonical) continue;
      const owner = aliases.get(canonical);
      if (owner && owner !== name) {
        errors.push(`Alias "${value}" is ambiguous between "${owner}" and helper "${name}".`);
      }
      aliases.set(canonical, name);
    }
  }

  return {
    errors,
    counts: {
      adapters: registry.adapters.length,
      figmaNames: figmaNames.size,
      jsonTypes: jsonTypes.size,
      helperAliases: Object.keys(registry.helperAliases).length,
      exportHandlers: registry.adapters.flatMap((adapter) => adapter.figma).filter((entry) => entry.export).length,
      applyHandlers: registry.adapters.flatMap((adapter) => adapter.figma).filter((entry) => entry.apply).length,
      importHandlers: registry.adapters.filter((adapter) => adapter.import).length,
    },
  };
}

if (isCli && process.argv.includes('--json')) {
  const registry = componentRegistryInventory();
  const validation = validateComponentRegistry(registry);
  console.log(JSON.stringify({ ...validation, registry }, null, 2));
}
