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
import { type AiUsage, getApiKey } from './aiImages';
import { validateCustomIconSvg } from './customIconFont';

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
): Promise<{ icons: IconSuggestion[]; usage: AiUsage }> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('NO_API_KEY');

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
  const avoidNote = avoid.length ? `\n\nDo NOT suggest any of these already-shown icons: ${avoid.join(', ')}.` : '';

  const t0 = performance.now();
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

  const elapsedMs = performance.now() - t0;

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
  return {
    icons: out,
    usage: {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      elapsedMs,
      model: MODEL,
    },
  };
}

// ── Icon designer ─────────────────────────────────────────────────────────────

export interface DesignedIcon {
  name: string;
  reason: string;
  paths: string[];
  valid: boolean;
  svg?: string;
  error?: string;
}

const DESIGN_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    icons: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          name: { type: 'string', description: 'snake_case icon name, e.g. cloud_check.' },
          reason: { type: 'string', description: 'One sentence describing the design.' },
          paths: {
            type: 'array',
            items: { type: 'string' },
            description: 'SVG path "d" values. Absolute commands only (M L C Q A Z). Every path must close with Z.',
          },
        },
        required: ['name', 'reason', 'paths'],
      },
    },
  },
  required: ['icons'],
} as const;

const DESIGN_SYSTEM_PROMPT = `You are a precision icon designer creating Material Symbols Outlined-style icons for a 24×24 SVG grid.

RULES — follow exactly:
• ViewBox is 0 0 24 24. Keep all shapes within x:2–22, y:2–22 for optical margin.
• Paths use fill="currentColor". No stroke. No transforms. No groups.
• Absolute commands only — M L C Q A Z. Every sub-path must end with Z.
• Outlined style: draw a ~2-unit-thick outline silhouette, like a Material Symbol glyph.
• Keep shapes visually centered and balanced in the 24×24 grid.

REFERENCE (correct style):
• Outlined circle: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8Z"

Provide distinct design variations. Each icon must be independently recognisable.`;

/** Ask Claude to design SVG icons for a concept. Each result is validated. */
export async function designIcons(
  { description, count = 3 }: { description: string; count?: number },
): Promise<{ icons: DesignedIcon[]; usage: AiUsage }> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('NO_API_KEY');

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
  const t0 = performance.now();

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: DESIGN_SYSTEM_PROMPT,
    output_config: { format: { type: 'json_schema', schema: DESIGN_SCHEMA } },
    messages: [{
      role: 'user',
      content: `Design ${count + 1} distinct icon variations for: "${description}". Each should represent the concept differently.`,
    }],
  } as Anthropic.MessageCreateParamsNonStreaming);

  const elapsedMs = performance.now() - t0;
  const textBlock = response.content.find((b) => b.type === 'text');
  const raw = textBlock && 'text' in textBlock ? textBlock.text : '';

  let parsed: { icons?: unknown };
  try { parsed = JSON.parse(raw); } catch { throw new Error('Could not read the response — try again.'); }

  const icons: DesignedIcon[] = [];
  for (const it of (Array.isArray(parsed.icons) ? parsed.icons : [])) {
    const item = it as Record<string, unknown>;
    const name = String(item.name ?? '').trim() || 'icon';
    const reason = String(item.reason ?? '');
    const pathArr = (Array.isArray(item.paths) ? item.paths : []) as string[];
    const svgText =
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">` +
      pathArr.map((d) => `<path d="${d}" fill="currentColor"/>`).join('') +
      `</svg>`;
    try {
      const v = validateCustomIconSvg(svgText, name);
      icons.push({ name: v.name || name, reason, paths: v.paths, valid: true, svg: v.svg });
    } catch (err) {
      icons.push({ name, reason, paths: pathArr, valid: false, error: err instanceof Error ? err.message : 'Invalid SVG' });
    }
    if (icons.length >= count) break;
  }

  return {
    icons,
    usage: { inputTokens: response.usage.input_tokens, outputTokens: response.usage.output_tokens, elapsedMs, model: 'claude-sonnet-4-6' },
  };
}

