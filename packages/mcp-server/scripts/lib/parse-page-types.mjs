// Extracts the page-definition ComponentType registry — the locked union of
// A1 component names the a1-web page-definition renderer is allowed to
// instantiate — straight from its source of truth via the TS compiler API,
// rather than hand-copying the list (which would drift as components are
// added). See packages/react/ai/page-definition-standard.md for the contract
// this registry backs.

import fs from 'node:fs';
import ts from 'typescript';
import { repoPath } from './paths.mjs';

const PAGE_TYPES_FILE = 'apps/a1-web/src/editor/pageTypes.ts';

export function parsePageTypes() {
  const filePath = repoPath(PAGE_TYPES_FILE);
  const sourceText = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true);

  const componentTypes = [];
  ts.forEachChild(sourceFile, (node) => {
    if (ts.isTypeAliasDeclaration(node) && node.name.text === 'ComponentType' && ts.isUnionTypeNode(node.type)) {
      for (const member of node.type.types) {
        if (ts.isLiteralTypeNode(member) && ts.isStringLiteral(member.literal)) {
          componentTypes.push(member.literal.text);
        }
      }
    }
  });

  return { componentTypes, sourceFile: PAGE_TYPES_FILE };
}
