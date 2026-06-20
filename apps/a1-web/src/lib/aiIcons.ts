/**
 * "API for Claude" for icons: submit a description, get back a few **Material
 * Symbols Outlined** icon options to choose from. Mirrors `aiImages.ts` (same
 * browser-side Anthropic SDK + shared API key in localStorage) but for icons.
 *
 * Every suggestion is validated against `system/icons/material-symbols.json`, so
 * the result is always a real icon from the standard set. Each is annotated with
 * any guidance from `system/icons/icon-usage.md` so the user knows the intended
 * context for that icon.
 */
import Anthropic from '@anthropic-ai/sdk';
import iconRegistry from '../../../../system/icons/material-symbols.json';
import iconUsageRaw from '../../../../system/icons/icon-usage.md?raw';
import { getApiKey } from './aiImages';

const MODEL = 'claude-haiku-4-5';

// The standard set — only these names are ever returned.
const VALID_ICONS = new Set<string>(
  (iconRegistry as { icons: { name: string }[] }).icons.map((i) => i.name),
);

export function isValidIcon(name: string): boolean {
  return VALID_ICONS.has(name);
}

// Parse the icon-usage "Usage Lookup" table (between the HTML markers) into a
// name → scenario map, so a chosen icon can show its intended context.
const ICON_GUIDANCE: Map<string, string> = (() => {
  const map = new Map<string, string>();
  const start = iconUsageRaw.indexOf('icon-usage-table:start');
  const end = iconUsageRaw.indexOf('icon-usage-table:end');
  if (start < 0 || end < 0) return map;
  for (const line of iconUsageRaw.slice(start, end).split('\n')) {
    const m = line.match(/^\|\s*([a-z0-9_]+)\s*\|\s*(.+?)\s*\|\s*$/);
    if (m && m[1] !== 'Icon') map.set(m[1], m[2].trim());
  }
  return map;
})();

/** The icon-usage guidance for an icon, or null when it isn't documented. */
export function iconGuidance(name: string): string | null {
  return ICON_GUIDANCE.get(name) ?? null;
}

export interface IconSuggestion {
  name: string;
  reason: string;
  guidance: string | null;
}

const ICON_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    icons: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          name: {
            type: 'string',
            description:
              'A real Material Symbols Outlined icon name in snake_case (e.g. shopping_cart, settings, warning). Never invent names.',
          },
          reason: { type: 'string', description: 'One short sentence on why this icon fits the request.' },
        },
        required: ['name', 'reason'],
      },
    },
  },
  required: ['icons'],
} as const;

/**
 * Ask Claude for `count` Material Symbols icons matching `description`. Results
 * are validated against the registry; invalid/duplicate/avoided names are
 * dropped. Pass already-shown names in `avoid` to get fresh options.
 */
export async function suggestIcons(
  { description, count = 3, avoid = [] }: { description: string; count?: number; avoid?: string[] },
): Promise<IconSuggestion[]> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('NO_API_KEY');

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
  const avoidNote = avoid.length ? `\n\nDo NOT suggest any of these already-shown icons: ${avoid.join(', ')}.` : '';

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system:
      'You pick Material Symbols Outlined icons that match a description for a design system. ' +
      'Return ONLY real Material Symbols Outlined icon names in snake_case (e.g. shopping_cart, settings, favorite, warning). ' +
      'Prefer the clearest, most specific icon for the concept — do not use a generic icon when a specific one exists. ' +
      'Vary the options so the user has meaningful choices. Never invent icon names.',
    output_config: { format: { type: 'json_schema', schema: ICON_SCHEMA } },
    // Over-request so we still have `count` after validation filtering.
    messages: [{ role: 'user', content: `Suggest ${count + 3} Material Symbols icons for: "${description}".${avoidNote}` }],
  } as Anthropic.MessageCreateParamsNonStreaming);

  const textBlock = response.content.find((b) => b.type === 'text');
  const raw = textBlock && 'text' in textBlock ? textBlock.text : '';
  let parsed: { icons?: unknown };
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('Could not read Claude’s response.');
  }

  const icons = Array.isArray(parsed.icons) ? parsed.icons : [];
  const seen = new Set<string>();
  const out: IconSuggestion[] = [];
  for (const it of icons) {
    const item = it as Record<string, unknown>;
    const name = String(item.name ?? '').trim();
    if (!isValidIcon(name) || seen.has(name) || avoid.includes(name)) continue;
    seen.add(name);
    out.push({ name, reason: String(item.reason ?? ''), guidance: iconGuidance(name) });
    if (out.length >= count) break;
  }
  return out;
}
