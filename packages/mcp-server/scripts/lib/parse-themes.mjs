// Reads system/themes/*/theme.json metadata plus each selector's DTCG override
// file, and resolves single-hop-and-beyond alias references against the
// flattened base token list. This is a lookup index, not the full theme build
// pipeline (system/theme-config.mjs / system/build-themes.mjs remain the
// source of truth for what actually ships in CSS) — see plan notes on scope.

import fs from 'node:fs';
import path from 'node:path';
import { repoPath } from './paths.mjs';
import { flattenDtcgTree, resolveAlias } from './token-shape.mjs';

export function parseThemes(baseTokens) {
  const lookup = new Map(baseTokens.map((t) => [t.path, t.value]));
  const themesDir = repoPath('system/themes');
  const themeDirNames = fs
    .readdirSync(themesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const themes = [];
  for (const dirName of themeDirNames) {
    const themeJsonPath = path.join(themesDir, dirName, 'theme.json');
    if (!fs.existsSync(themeJsonPath)) continue;

    let meta;
    try {
      meta = JSON.parse(fs.readFileSync(themeJsonPath, 'utf8'));
    } catch {
      continue;
    }

    const selectors = (meta.selectors ?? []).map((sel) => {
      const overridesPath = path.join(themesDir, dirName, sel.overrides ?? '');
      let overrides = [];
      if (sel.overrides && fs.existsSync(overridesPath)) {
        try {
          const raw = JSON.parse(fs.readFileSync(overridesPath, 'utf8'));
          overrides = flattenDtcgTree(raw.tokens ?? {}).map((entry) => ({
            ...entry,
            resolvedValue: resolveAlias(entry.value, lookup),
          }));
        } catch {
          // Malformed/unreadable override file — keep the theme listed with no overrides.
        }
      }
      return {
        selector: sel.selector,
        overridesFile: sel.overrides ? path.posix.join('system/themes', dirName, sel.overrides) : null,
        overrides,
      };
    });

    themes.push({
      id: dirName,
      name: meta.name ?? dirName,
      description: meta.description ?? null,
      selectors,
    });
  }
  return themes;
}
