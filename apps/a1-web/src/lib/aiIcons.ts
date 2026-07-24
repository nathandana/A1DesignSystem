/**
 * Icon AI helpers: submit a description, get back a few built-in or project
 * custom icon options to choose from.
 *
 * Every suggestion is validated against `system/icons/material-symbols.json`, so
 * built-in results are always real Material Symbols. Project custom suggestions
 * must match the active project's custom icon registry. Built-ins are annotated
 * with any guidance from `system/icons/icon-usage.md` so the user knows the
 * intended context for that icon.
 */
import Anthropic from '@anthropic-ai/sdk';
import iconRegistry from '../../../../system/icons/material-symbols.json';
import iconUsageRaw from '../../../../system/icons/icon-usage.md?raw';
import { type AiUsage, getApiKey } from './aiImages';
import { validateCustomIconSvg } from './customIconFont';
import { suggestIconsWithCodex } from './localCodex';

// The built-in Material Symbols set. Custom icons are validated separately by
// active project name and returned with the `custom:` namespace.
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

export interface IconSuggestionUsage extends AiUsage {
  source: 'codex';
  codexUsageReported: boolean;
  totalTokens: number | null;
}

export interface CustomIconCandidate {
  name: string;
}

function customIconNameSet(customIcons: CustomIconCandidate[]): Set<string> {
  return new Set(customIcons.map((icon) => String(icon.name ?? '').trim()).filter(Boolean));
}

function normalizeSuggestedIconName(name: string, customIconNames: Set<string>): string | null {
  const trimmed = name.trim();
  if (!trimmed) return null;
  if (isValidIcon(trimmed)) return trimmed;

  if (trimmed.startsWith('custom:')) {
    const customName = trimmed.slice('custom:'.length).trim();
    return customIconNames.has(customName) ? `custom:${customName}` : null;
  }

  return customIconNames.has(trimmed) ? `custom:${trimmed}` : null;
}

function iconSuggestionsFromParsed(
  {
    parsed,
    count,
    avoid,
    customIcons = [],
  }: { parsed: { icons?: unknown }; count: number; avoid: string[]; customIcons?: CustomIconCandidate[] },
): IconSuggestion[] {
  const icons = Array.isArray(parsed.icons) ? parsed.icons : [];
  const seen = new Set<string>();
  const avoided = new Set(avoid);
  const customIconNames = customIconNameSet(customIcons);
  const out: IconSuggestion[] = [];
  for (const it of icons) {
    const item = it as Record<string, unknown>;
    const name = normalizeSuggestedIconName(String(item.name ?? ''), customIconNames);
    if (!name || seen.has(name) || avoided.has(name)) continue;
    seen.add(name);
    out.push({ name, reason: String(item.reason ?? ''), guidance: iconGuidance(name) });
    if (out.length >= count) break;
  }
  return out;
}

/**
 * Ask the local Codex bridge for `count` icons matching `description`.
 * Results are validated against the built-in and custom icon registries;
 * invalid/duplicate/avoided names are dropped.
 */
export async function suggestIcons(
  {
    description,
    count = 3,
    avoid = [],
    customIcons = [],
  }: { description: string; count?: number; avoid?: string[]; customIcons?: CustomIconCandidate[] },
): Promise<{ icons: IconSuggestion[]; usage: IconSuggestionUsage }> {
  const response = await suggestIconsWithCodex({ description, count, avoid, customIcons });
  const icons = iconSuggestionsFromParsed({
    parsed: { icons: response.icons },
    count,
    avoid,
    customIcons,
  });

  return {
    icons,
    usage: {
      inputTokens: response.usage?.inputTokens ?? 0,
      outputTokens: response.usage?.outputTokens ?? 0,
      elapsedMs: response.elapsedMs,
      model: 'Codex',
      source: 'codex',
      codexUsageReported: response.usage?.reported ?? false,
      totalTokens: response.usage?.totalTokens ?? null,
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
