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

// ── Virtual Icon Designer ────────────────────────────────────────────────────

/** One AI-generated custom icon design. */
export interface DesignedIcon {
  name: string;
  reason: string;
  /** Raw path "d" attribute strings returned by Claude. */
  paths: string[];
  /** True when validateCustomIconSvg() accepted it. */
  valid: boolean;
  /** Sanitised SVG markup (only set when valid). */
  svg?: string;
  /** Validation error message (only set when invalid). */
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
          name: {
            type: 'string',
            description:
              'snake_case icon name, e.g. cloud_check or gear_sparkle. Must match /^[a-z][a-z0-9_]*$/.',
          },
          reason: {
            type: 'string',
            description: 'One sentence describing the visual design and why it fits the concept.',
          },
          paths: {
            type: 'array',
            items: { type: 'string' },
            description:
              'SVG path "d" attribute values. Use absolute commands only (M L C Q A Z). All paths must close with Z. Coordinate space: 0–24; keep shapes within 2–22 for optical margin.',
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
• ViewBox is 0 0 24 24. Keep all shapes within x:2–22, y:2–22.
• Paths use fill="currentColor". No stroke. No transforms. No groups.
• Commands: absolute only — M (moveto), L (lineto), C (cubic), Q (quadratic), A (arc), Z (close). Every sub-path must end with Z.
• Outline style: draw the silhouette of a 2-unit-thick line stroke as a closed filled shape — like an outlined font glyph.
• Shapes must be visually centered and optically balanced in the 24×24 grid.
• Keep paths simple — prefer L and A over complex C curves where geometry allows.

REFERENCE PATHS (correct style):
• Outlined circle: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
• Outlined home: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" (filled solid — also acceptable)

Provide distinct design variations for the requested concept. Each icon must be independently recognisable.`;

/**
 * Ask Claude to generate original SVG icon designs for a concept.
 * Returns DesignedIcon[] — each is validated with validateCustomIconSvg().
 * Invalid designs are included with valid: false so the UI can show them
 * with an error and let the user re-prompt.
 */
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
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('Could not read the response — try again.');
  }

  const rawIcons = Array.isArray(parsed.icons) ? parsed.icons : [];
  const icons: DesignedIcon[] = [];

  for (const it of rawIcons) {
    const item = it as Record<string, unknown>;
    const name = String(item.name ?? '').trim() || 'icon';
    const reason = String(item.reason ?? '');
    const pathArr = (Array.isArray(item.paths) ? item.paths : []) as string[];

    const svgText =
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">` +
      pathArr.map((d) => `<path d="${d}" fill="currentColor"/>`).join('') +
      `</svg>`;

    try {
      const validated = validateCustomIconSvg(svgText, name);
      icons.push({
        name: validated.name || name,
        reason,
        paths: validated.paths,
        valid: true,
        svg: validated.svg,
      });
    } catch (err) {
      icons.push({
        name,
        reason,
        paths: pathArr,
        valid: false,
        error: err instanceof Error ? err.message : 'Invalid SVG',
      });
    }

    if (icons.length >= count + 1) break;
  }

  return {
    icons,
    usage: {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      elapsedMs,
      model: 'claude-sonnet-4-6',
    },
  };
}
