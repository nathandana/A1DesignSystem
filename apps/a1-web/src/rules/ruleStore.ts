/**
 * Rules: the built-in design rules (parsed from the bundled `system/rules/*.yaml`)
 * plus user-authored rules stored locally in this browser. Built-in rules are
 * read-only; user rules can be added (by hand or via AI) and deleted. Device-local.
 */
import { parse as parseYaml } from 'yaml';
import { ruleSourceFiles } from '../pages/components/data.js';

const KEY = 'a1-user-rules';

export interface Rule {
  id: string;
  component: string;       // the component / area the rule applies to
  requirement: string;     // the rule itself
  do?: string;
  dont?: string;
  appliesTo: string[];     // categories: accessibility, layout, content, …
  source: 'builtin' | 'user';
  file?: string;           // built-in source file
  /** How the rule is enforced on code (eslint-plugin-a1 / CSS gate), when it is. */
  enforcement?: { eslint?: string; css?: boolean };
  createdAt?: number;
}

// ── Built-in rules (parsed once from the bundled YAML) ────────────────────────

function parseBuiltin(): Rule[] {
  const out: Rule[] = [];
  for (const { file, raw } of ruleSourceFiles) {
    let doc: any;
    try { doc = parseYaml(raw); } catch { continue; }
    const topComponent: string | undefined = doc?.component;
    for (const r of doc?.rules ?? []) {
      if (!r?.id) continue;
      out.push({
        id: r.id,
        component: topComponent ?? (Array.isArray(r.components) ? r.components[0] : undefined) ?? 'General',
        requirement: r.requirement ?? r.description ?? '',
        do: r.do,
        dont: r.dont,
        appliesTo: Array.isArray(r.applies_to) ? r.applies_to : [],
        source: 'builtin',
        file,
        enforcement: r.enforcement
          ? { eslint: r.enforcement.eslint, css: r.enforcement.css === true }
          : undefined,
      });
    }
  }
  return out;
}

const builtinRules = parseBuiltin();

/** Every category a built-in rule references — seeds the "Applies to" picker. */
export const RULE_CATEGORIES: string[] = Array.from(
  new Set(builtinRules.flatMap((r) => r.appliesTo)),
).sort();

// ── User rules (localStorage) ─────────────────────────────────────────────────

type Listener = () => void;
const listeners = new Set<Listener>();
export function subscribeRules(fn: Listener): () => void { listeners.add(fn); return () => listeners.delete(fn); }
function notify(): void { for (const fn of listeners) fn(); }

function uid(): string { return `rule_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`; }

function readUser(): Rule[] {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as Rule[]) : [];
    return Array.isArray(list) ? list.map((r) => ({ ...r, source: 'user' as const })) : [];
  } catch { return []; }
}

function writeUser(list: Rule[]): void {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* ignore */ }
  notify();
}

export function listUserRules(): Rule[] {
  return readUser().slice().sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
}

export function listBuiltinRules(): Rule[] { return builtinRules; }

export function listAllRules(): Rule[] { return [...listUserRules(), ...builtinRules]; }

export function addRule(partial: Omit<Rule, 'source'> & { id?: string }): Rule {
  const rule: Rule = {
    id: partial.id?.trim() || uid(),
    component: partial.component?.trim() || 'General',
    requirement: partial.requirement?.trim() || '',
    do: partial.do?.trim() || undefined,
    dont: partial.dont?.trim() || undefined,
    appliesTo: partial.appliesTo ?? [],
    source: 'user',
    createdAt: Date.now(),
  };
  writeUser([rule, ...readUser().filter((r) => r.id !== rule.id)]);
  return rule;
}

export function deleteRule(id: string): void {
  writeUser(readUser().filter((r) => r.id !== id));
}
