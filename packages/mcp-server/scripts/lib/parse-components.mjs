// Builds the component index from two independent sources, merged rather than
// forced into one brittle schema:
//
// 1. packages/react/ai/components.md — the hand-maintained coverage tables
//    (React/Native/Pure/Web Components/Figma per component) plus surrounding
//    prose. Tables are parsed structurally (they're consistently GFM-formatted);
//    prose is kept as raw markdown per category section rather than parsed into
//    fields, since forcing hand-authored English into a rigid schema would drift
//    from the source the moment someone edits the doc.
// 2. packages/react/src/components/**/*.d.ts — parsed with the TypeScript
//    compiler API for exact prop names, types, optionality, and JSDoc text.
//
// A display name from the coverage table (e.g. "Empty State") is matched
// against exported names (e.g. "MessageEmptyState") by a normalized
// contains/endsWith heuristic, since several components export under a
// different name than their menu/registry display name.

import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { repoPath } from './paths.mjs';

const COMPONENTS_MD = 'packages/react/ai/components.md';
const COMPONENTS_SRC_DIR = 'packages/react/src/components';

// ── components.md: sections + tables ────────────────────────────────────────

function splitIntoH2Sections(markdown) {
  const lines = markdown.split('\n');
  const sections = [];
  let current = null;
  for (const line of lines) {
    const isH2 = /^##\s+/.test(line) && !/^###/.test(line);
    if (isH2) {
      if (current) sections.push(current);
      current = { heading: line.replace(/^##\s+/, '').trim(), lines: [line] };
      continue;
    }
    if (current) current.lines.push(line);
  }
  if (current) sections.push(current);
  return sections.map((s) => ({ heading: s.heading, raw: s.lines.join('\n').trim() }));
}

function splitTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function isTableSeparatorRow(line) {
  const trimmed = line.trim();
  return /^\|?[\s:|-]+\|?$/.test(trimmed) && trimmed.includes('-');
}

function parseMarkdownTables(raw) {
  const lines = raw.split('\n');
  const tables = [];
  let i = 0;
  while (i < lines.length) {
    if (lines[i].trim().startsWith('|') && lines[i + 1] && isTableSeparatorRow(lines[i + 1])) {
      const header = splitTableRow(lines[i]);
      const rows = [];
      let j = i + 2;
      while (j < lines.length && lines[j].trim().startsWith('|')) {
        rows.push(splitTableRow(lines[j]));
        j++;
      }
      tables.push({ header, rows });
      i = j;
      continue;
    }
    i++;
  }
  return tables;
}

function isCoverageTable(header) {
  if (!header.length) return false;
  return header[0].toLowerCase() === 'component' && header.some((h) => h.toLowerCase() === 'react');
}

function parseCoverageRow(header, row) {
  const name = row[0];
  if (!name) return null;
  const columnIndex = (label) => header.findIndex((h) => h.toLowerCase() === label.toLowerCase());
  const flag = (label) => {
    const idx = columnIndex(label);
    if (idx === -1) return null;
    return (row[idx] ?? '').trim() === '✓';
  };
  return {
    name,
    react: flag('React'),
    native: flag('Native'),
    pure: flag('Pure'),
    webComponents: flag('Web Components'),
    figma: flag('Figma'),
  };
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Blockquote/paragraph blocks in a section that name-check the given component. */
function extractHighlights(sectionMarkdown, displayName) {
  const nameRe = new RegExp(
    `\\b${displayName.split(/\s+/).map(escapeRegExp).join('\\s+')}\\b`,
    'i',
  );
  return sectionMarkdown
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter((block) => block.startsWith('>') && nameRe.test(block));
}

export function parseComponentsMd() {
  const raw = fs.readFileSync(repoPath(COMPONENTS_MD), 'utf8');
  const sections = splitIntoH2Sections(raw);

  const categories = [];
  const components = [];
  let categoryId = 0;

  for (const section of sections) {
    const coverageTables = parseMarkdownTables(section.raw).filter((t) => isCoverageTable(t.header));
    if (!coverageTables.length) continue; // narrative-only sections (e.g. "Start Here") carry no table

    const id = `cat-${++categoryId}`;
    const categoryComponents = [];
    for (const table of coverageTables) {
      for (const row of table.rows) {
        const parsed = parseCoverageRow(table.header, row);
        if (parsed) categoryComponents.push(parsed);
      }
    }

    categories.push({ id, heading: section.heading, sectionMarkdown: section.raw });
    for (const c of categoryComponents) {
      components.push({
        ...c,
        categoryId: id,
        highlights: extractHighlights(section.raw, c.name),
      });
    }
  }

  return { categories, components };
}

// ── .d.ts scanning ──────────────────────────────────────────────────────────

function walkDtsFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkDtsFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.d.ts')) {
      out.push(full);
    }
  }
  return out;
}

function getLeadingComment(sourceText, node) {
  const ranges = ts.getLeadingCommentRanges(sourceText, node.getFullStart()) ?? [];
  if (!ranges.length) return null;
  const range = ranges[ranges.length - 1];
  const text = sourceText
    .slice(range.pos, range.end)
    .replace(/^\/\*\*/, '')
    .replace(/\*\/$/, '')
    .split('\n')
    .map((l) => l.replace(/^\s*\*\s?/, ''))
    .join('\n')
    .trim();
  return text || null;
}

/**
 * Find the `XProps` type name behind a `const`-declared component's type
 * annotation — the `React.forwardRef` pattern used by several field
 * components (e.g. `export declare const TextField:
 * React.ForwardRefExoticComponent<TextFieldProps & React.RefAttributes<...>>`)
 * as well as the simpler `(props: XProps) => ReactElement` function-type form.
 */
function extractPropsTypeName(typeNode, sourceFile) {
  if (!typeNode) return null;
  if (ts.isFunctionTypeNode(typeNode)) {
    const param = typeNode.parameters[0];
    return param?.type && ts.isTypeReferenceNode(param.type)
      ? param.type.typeName.getText(sourceFile)
      : null;
  }
  if (ts.isTypeReferenceNode(typeNode) && typeNode.typeArguments?.length) {
    const [firstArg] = typeNode.typeArguments;
    if (ts.isIntersectionTypeNode(firstArg)) {
      for (const part of firstArg.types) {
        if (ts.isTypeReferenceNode(part) && /Props$/.test(part.typeName.getText(sourceFile))) {
          return part.typeName.getText(sourceFile);
        }
      }
      return null;
    }
    if (ts.isTypeReferenceNode(firstArg)) {
      return firstArg.typeName.getText(sourceFile);
    }
  }
  return null;
}

function parseDtsFile(filePath) {
  const sourceText = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true);

  const interfaces = new Map(); // interface name -> { props, extends }
  const functions = []; // { name, propsTypeName }

  const hasExportModifier = (node) =>
    (ts.getModifiers ? ts.getModifiers(node) : node.modifiers)?.some(
      (m) => m.kind === ts.SyntaxKind.ExportKeyword,
    ) ?? false;

  ts.forEachChild(sourceFile, (node) => {
    if (ts.isInterfaceDeclaration(node)) {
      const props = [];
      for (const member of node.members) {
        if (ts.isPropertySignature(member) && member.name) {
          props.push({
            name: member.name.getText(sourceFile),
            optional: Boolean(member.questionToken),
            type: member.type ? member.type.getText(sourceFile) : 'unknown',
            description: getLeadingComment(sourceText, member),
          });
        }
      }
      const extendsClause = (node.heritageClauses ?? []).flatMap((h) =>
        h.types.map((t) => t.getText(sourceFile)),
      );
      interfaces.set(node.name.text, { props, extends: extendsClause });
      return;
    }
    if (ts.isFunctionDeclaration(node) && node.name && hasExportModifier(node)) {
      const firstParam = node.parameters[0];
      const propsTypeName =
        firstParam?.type && ts.isTypeReferenceNode(firstParam.type)
          ? firstParam.type.typeName.getText(sourceFile)
          : null;
      functions.push({ name: node.name.text, propsTypeName });
      return;
    }
    if (ts.isVariableStatement(node) && hasExportModifier(node)) {
      for (const decl of node.declarationList.declarations) {
        if (decl.name && ts.isIdentifier(decl.name)) {
          functions.push({
            name: decl.name.text,
            propsTypeName: extractPropsTypeName(decl.type, sourceFile),
          });
        }
      }
    }
  });

  return functions.map((fn) => {
    const iface = fn.propsTypeName ? interfaces.get(fn.propsTypeName) : null;
    return {
      exportedName: fn.name,
      propsInterfaceName: fn.propsTypeName,
      props: iface?.props ?? [],
      extends: iface?.extends ?? [],
      sourceFile: path.relative(repoPath(), filePath).split(path.sep).join('/'),
    };
  });
}

export function parseComponentExports() {
  const componentsDir = repoPath(COMPONENTS_SRC_DIR);
  const exportsList = [];
  for (const file of walkDtsFiles(componentsDir)) {
    try {
      exportsList.push(...parseDtsFile(file));
    } catch {
      // Skip a file the compiler API can't parse rather than fail the whole build.
    }
  }
  return exportsList;
}

// ── merge ────────────────────────────────────────────────────────────────────

function compact(name) {
  return String(name).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}

// Known display-name -> exported-name mismatches that aren't a plain suffix
// relationship. Keep this list short; anything more than a couple of entries
// is a sign the underlying naming convention should be revisited instead.
const DISPLAY_NAME_ALIASES = {
  Textarea: 'TextareaField',
};

/**
 * Candidate match strings for a display name, most-specific first. A few
 * coverage-table names carry a parenthetical/slash qualifier — e.g.
 * "Text Field (text, email, password)", "Accordion (React) / Disclosure
 * (pure)" — so the leading name before that qualifier is tried too.
 */
function matchCandidates(displayName) {
  const candidates = [displayName];
  const leading = displayName.split(/[(/]/)[0].trim();
  if (leading && leading !== displayName) candidates.push(leading);
  return candidates.map(compact).filter(Boolean);
}

/** Match a components.md display name (e.g. "Empty State") to its .d.ts export(s) (e.g. "MessageEmptyState"). */
export function matchComponentExports(displayName, exportsList) {
  for (const target of matchCandidates(displayName)) {
    const exact = exportsList.filter((e) => compact(e.exportedName) === target);
    if (exact.length) return exact;
  }
  // Suffix match only (e.g. "Badge" -> "MessageBadge") — a plain substring or
  // prefix match would also catch unrelated components that happen to share a
  // leading word (e.g. "Inline" wrongly matching "InlineEditable", a distinct
  // component with no relation to the CSS-only "Inline" entry).
  for (const target of matchCandidates(displayName)) {
    const hits = exportsList.filter((e) => compact(e.exportedName).endsWith(target));
    if (hits.length) return hits;
  }
  // A small number of components are named with a suffix React doesn't share
  // (e.g. "Textarea" exports as "TextareaField") — call these out explicitly
  // rather than widening the general heuristic and risking a false match.
  const alias = DISPLAY_NAME_ALIASES[displayName];
  if (alias) return exportsList.filter((e) => e.exportedName === alias);
  return [];
}
