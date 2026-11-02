#!/usr/bin/env node
// Compile the existing TypeScript declarations into a browser-safe validation
// artifact. No component or app code is executed by the generator or validator.
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { parse as parseYaml } from 'yaml';
import { fileURLToPath } from 'node:url';
import { patternManifests } from '../packages/react/src/patterns/patternPolicies.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = p => path.join(root, p);
const entry = file('packages/react/src/index.d.ts');
const pageFile = file('apps/a1-web/src/editor/pageTypes.ts');
const projectFile = file('apps/a1-web/src/projects/projectImportTypes.ts');
const program = ts.createProgram([entry, pageFile, projectFile], {
  strictNullChecks: true, skipLibCheck: true, moduleResolution: ts.ModuleResolutionKind.Bundler,
  module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ESNext,
});
const checker = program.getTypeChecker();
const definitions = {};
const seen = new Map();
const F = ts.TypeFlags;
const jsonText = { type: ['string', 'number', 'boolean', 'null'] };

function schema(type, depth = 0) {
  if (!type) return {};
  if (depth > 12) return {};
  const name = type.aliasSymbol?.name ?? type.symbol?.name ?? '';
  if (name === 'ReactNode' || name === 'React.ReactNode') return { anyOf: [jsonText, { type: 'array', items: jsonText }] };
  if (/^(ReactElement|ReactPortal|RefObject|Promise|Iterable)$/.test(name)) return false;
  if (name === 'CSSProperties') return { type: 'object' };
  if (/^(ElementType|React.ElementType)/.test(name)) return { type: 'string' };
  if (type.flags & (F.Any | F.Unknown | F.TypeParameter)) return {};
  if (type.flags & (F.Never | F.Undefined | F.ESSymbolLike | F.BigIntLike)) return false;
  if (type.flags & F.Null) return { type: 'null' };
  if (type.flags & F.StringLiteral) return { const: type.value };
  if (type.flags & F.NumberLiteral) return { const: type.value };
  if (type.flags & F.BooleanLiteral) return { const: type.intrinsicName === 'true' };
  if (type.flags & F.StringLike) return { type: 'string' };
  if (type.flags & F.NumberLike) return { type: 'number' };
  if (type.flags & F.Boolean) return { type: 'boolean' };
  if (type.isUnion()) {
    const parts = type.types.filter(t => !(t.flags & F.Undefined)).map(t => schema(t, depth + 1));
    if (parts.some(p => p && Object.keys(p).length === 0)) return {};
    const supported = parts.filter(p => p !== false);
    if (!supported.length) return false;
    if (supported.length === 2 && supported.every(p => typeof p.const === 'boolean')) return { type: 'boolean' };
    if (supported.every(p => Object.hasOwn(p, 'const'))) return { enum: supported.map(p => p.const) };
    return supported.length === 1 ? supported[0] : { anyOf: supported };
  }
  if (checker.isArrayType(type)) return { type: 'array', items: schema(checker.getTypeArguments(type)[0], depth + 1) };
  if (checker.getSignaturesOfType(type, ts.SignatureKind.Call).length) return false;
  if (seen.has(type)) return { $ref: `#/definitions/${seen.get(type)}` };
  const key = `t${seen.size}`;
  seen.set(type, key);
  definitions[key] = {};
  const properties = {};
  const required = [];
  for (const prop of checker.getPropertiesOfType(type)) {
    const name = prop.getName();
    if (name.startsWith('__@')) continue;
    const declaration = prop.valueDeclaration ?? prop.declarations?.[0];
    const value = ['ref', 'dangerouslySetInnerHTML'].includes(name) ? false : schema(checker.getTypeOfSymbolAtLocation(prop, declaration ?? program.getSourceFile(entry)), depth + 1);
    properties[name] = value;
    if (!(prop.flags & ts.SymbolFlags.Optional) && value !== false) required.push(name);
  }
  const index = checker.getIndexTypeOfType(type, ts.IndexKind.String);
  definitions[key] = { type: 'object', properties, ...(required.length ? { required } : {}), additionalProperties: index ? schema(index, depth + 1) : false };
  return { $ref: `#/definitions/${key}` };
}

function exported(sourcePath, name) {
  const source = program.getSourceFile(sourcePath);
  return checker.getExportsOfModule(checker.getSymbolAtLocation(source)).find(s => s.name === name);
}
function declared(sourcePath, name) {
  return checker.getDeclaredTypeOfSymbol(exported(sourcePath, name));
}
const componentTypes = declared(pageFile, 'ComponentType').types.map(t => t.value);
const nodeSchema = schema(declared(pageFile, 'ComponentNode'));
const pageSchema = schema(declared(pageFile, 'PageDefinition'));
const projectSchema = schema(declared(projectFile, 'ProjectImportBundle'));
const components = {};
for (const name of componentTypes) {
  const symbol = exported(entry, name);
  if (!symbol) continue; // Editor-owned adapters are populated below.
  const type = checker.getTypeOfSymbolAtLocation(symbol, program.getSourceFile(entry));
  const parameter = checker.getSignaturesOfType(type, ts.SignatureKind.Call)[0]?.parameters[0];
  if (!parameter) continue;
  const ref = schema(checker.getTypeOfSymbolAtLocation(parameter, parameter.valueDeclaration));
  components[name] = structuredClone(definitions[ref.$ref?.split('/').at(-1)] ?? ref);
  // React callbacks and children are supplied by the renderer. Literal content
  // belongs in node.content; DOM data attributes remain supported.
  for (const key of ['children', 'ref', 'key']) delete components[name].properties?.[key];
  components[name].required = (components[name].required ?? []).filter(k => !['children', 'ref', 'key'].includes(k));
  components[name].patternProperties = { '^data-': { type: ['string', 'number', 'boolean', 'null'] } };
}

// Adapters consume their configurator's config, not just React props. Derive
// additive keys and their primitive kinds from getDefaultConfig's return type.
const adapterSource = ts.createSourceFile('adapters.jsx', fs.readFileSync(file('apps/a1-web/src/editor/editorComponents.jsx'), 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);
const previews = new Map();
for (const statement of adapterSource.statements) if (ts.isImportDeclaration(statement)) {
  for (const binding of statement.importClause?.namedBindings?.elements ?? []) if (binding.propertyName?.text === 'Preview') previews.set(binding.name.text, path.resolve(file('apps/a1-web/src/editor'), statement.moduleSpecifier.text));
}
const adapters = {};
for (const [preview, sourcePath] of previews) {
  const adapterName = preview.replace(/Preview$/, '');
  adapters[adapterName === 'Chip' ? 'ChipGroup' : adapterName] = sourcePath;
}
const adapterProgram = ts.createProgram(Object.values(adapters), { allowJs: true, noResolve: true, strictNullChecks: true, target: ts.ScriptTarget.ESNext });
const ac = adapterProgram.getTypeChecker();
for (const [name, sourcePath] of Object.entries(adapters)) {
  const source = adapterProgram.getSourceFile(sourcePath);
  const fn = source?.statements.find(s => ts.isFunctionDeclaration(s) && s.name?.text === 'getDefaultConfig');
  if (!fn) continue;
  const returnType = ac.getReturnTypeOfSignature(ac.getSignatureFromDeclaration(fn));
  const target = components[name] ??= { type: 'object', properties: {}, additionalProperties: false };
  for (const property of returnType.getProperties()) {
    const type = ac.getTypeOfSymbolAtLocation(property, property.valueDeclaration);
    const kind = type.flags & F.StringLike ? 'string' : type.flags & F.NumberLike ? 'number' : type.flags & F.BooleanLike ? 'boolean' : ac.isArrayType(type) ? 'array' : null;
    if (!Object.hasOwn(target.properties, property.name)) target.properties[property.name] = kind ? { type: kind } : {};
  }
  // Configurator adapters provide their own required defaults.
  target.required = [];
}

const overrides = JSON.parse(fs.readFileSync(file('system/json-model/adapter-contracts.json'), 'utf8'));
for (const [name, override] of Object.entries(overrides)) {
  const target = components[name] ??= { type: 'object', properties: {}, additionalProperties: false };
  Object.assign(target.properties, override);
}
// Formal JSON contracts take precedence over React-only slots (for example,
// OverflowMenu verification is serialized as a node, then rendered as an element).
for (const manifest of patternManifests) {
  const mapped = JSON.parse(JSON.stringify(manifest.propsSchema).replaceAll('#/definitions/', `#/definitions/${manifest.type}_`));
  for (const [key, value] of Object.entries(mapped.definitions ?? {})) definitions[`${manifest.type}_${key}`] = value;
  Object.assign(components[manifest.type].properties, mapped.properties);
  components[manifest.type].required = mapped.required ?? [];
}
for (const name of componentTypes) if (!components[name]) throw new Error(`Missing JSON prop contract for ${name}`);

// YAML remains the policy source; browsers consume generated data, never a
// separate hand-maintained rule list or a runtime YAML parser.
const ruleCatalog = fs.readdirSync(file('system/rules')).filter(name => name.endsWith('.yaml')).sort().flatMap(name => {
  const source = parseYaml(fs.readFileSync(file(`system/rules/${name}`), 'utf8'));
  return (source.rules ?? []).map(rule => ({ id: rule.id, requirement: rule.requirement ?? rule.description ?? rule.id, components: rule.components ?? [source.component ?? 'System'], ...(rule.enforcement?.json ? { json: rule.enforcement.json } : {}) }));
});
for (const rule of ruleCatalog.filter(rule => rule.json)) {
  if (!['authored-text-case', 'heading-sentence-case'].includes(rule.json.check) || !['error', 'warning'].includes(rule.json.severity)) throw new Error(`Unsupported JSON enforcement for ${rule.id}`);
}
const contract = { contractVersion: '1.1.0', supportedVersions: ['0.1.0', '1.0.0', '1.1.0'], componentTypes, nodeSchema, pageSchema, projectSchema, components, definitions, ruleCatalog };
// Drop intermediate schemas no longer reachable after adapter overrides.
const reachable = new Set();
function collect(value) {
  if (!value || typeof value !== 'object') return;
  if (value.$ref) {
    const key = value.$ref.split('/').at(-1);
    if (!reachable.has(key)) { reachable.add(key); collect(definitions[key]); }
  }
  Object.values(value).forEach(collect);
}
collect([nodeSchema, pageSchema, projectSchema, components]);
contract.definitions = Object.fromEntries(Object.entries(definitions).filter(([key]) => reachable.has(key)));
const destination = file('system/json-model/contract.generated.json');
const output = JSON.stringify(contract) + '\n';
if (process.argv.includes('--check')) {
  if (fs.readFileSync(destination, 'utf8') !== output) throw new Error('Stale JSON contract. Run npm run build:json-contract.');
  console.log('JSON validation contract is current.');
} else {
  fs.writeFileSync(destination, output);
  console.log(`Generated JSON validation contracts for ${componentTypes.length} components.`);
}
