/**
 * "API for Claude" for whole-page editing: describe a change in plain language
 * and get back an updated A1 **page definition** (the strict layout-first JSON
 * the editor renders). Claude is given the live page JSON plus the self-contained
 * A1 agent brief (`packages/react/ai/a1-agent-brief.md`) as context, so it knows
 * the exact component registry, props, value vocabularies, and rules.
 *
 * Mirrors `aiImages.ts` / `aiIcons.ts`: runs entirely in the browser via the
 * official Anthropic SDK with `dangerouslyAllowBrowser: true`, sharing the same
 * user-supplied API key in localStorage. As with those, this is fine for a local
 * prototyping tool but must NOT ship to a public app (the key is exposed to the
 * page — proxy through a backend there instead).
 *
 * The model returns a single JSON object `{ message, page }`: `message` is the
 * chat reply shown to the user, `page` is the full replacement PageDefinition.
 * The caller commits `page` to the editor history as one undoable step.
 */
import Anthropic from '@anthropic-ai/sdk';
import agentBrief from '../../../../packages/react/ai/a1-agent-brief.md?raw';
import type { PageDefinition } from '../editor/pageTypes';
import { getApiKey } from './aiImages';

// Whole-page structural editing is reasoning-heavy, so default to the most
// capable widely-released Opus model rather than the lightweight icon/image one.
const MODEL = 'claude-opus-4-8';

/** One exchange kept for multi-turn context (page JSON is sent fresh each turn). */
export interface PageChatTurn {
  role: 'user' | 'assistant';
  /** For user turns: the instruction. For assistant turns: the short reply (NOT the page JSON). */
  text: string;
}

export interface PageEditResult {
  /** Natural-language reply to show in the chat. */
  message: string;
  /** The full replacement page definition to commit to the canvas. */
  page: PageDefinition;
}

export function describeError(err: unknown): string {
  if (err instanceof Anthropic.AuthenticationError) return 'That API key was rejected. Check the key and try again.';
  if (err instanceof Anthropic.PermissionDeniedError) return 'This API key doesn’t have access to the model.';
  if (err instanceof Anthropic.RateLimitError) return 'Rate limited — wait a moment and try again.';
  if (err instanceof Error && err.message === 'NO_API_KEY') return 'Add your Anthropic API key to use the AI page editor.';
  if (err instanceof Error && err.message === 'BAD_JSON') return 'Claude’s response wasn’t valid page JSON. Try rephrasing the request.';
  if (err instanceof Error && err.message === 'BAD_SHAPE') return 'Claude returned JSON that isn’t a valid page definition. Try again.';
  if (err instanceof Anthropic.APIError) return `Claude API error (${err.status ?? '—'}). Try again.`;
  return 'Something went wrong reaching Claude. Check your connection and try again.';
}

const SYSTEM_PROMPT = [
  'You are the page-editing assistant inside the A1 Design System visual editor.',
  'The user describes a change in plain language; you return an updated A1 page definition (the JSON the editor renders).',
  '',
  'You are given, as your authoritative reference, the full A1 agent brief: the page-definition JSON shape, the complete component registry with key props, the allowed value vocabularies, the system rules, and worked examples. Treat it as the source of truth for what is allowed.',
  '',
  'Hard rules:',
  '- Only use component `type` values, props, and prop values that the brief documents. Never invent components, props, colors, spacing, or other values.',
  '- Preserve the page `schemaVersion`, the page `id`, and the layout structure unless the user explicitly asks to change them. Keep every existing node `id` you reuse so the editor’s history and selection stay stable; only mint new ids (short, unique strings) for nodes you add.',
  '- Make the smallest change that satisfies the request. Do not restructure, reword, reorder, or drop content the user did not ask you to touch.',
  '- Never use ALL-CAPS / uppercased text. Author labels and headings in sentence case.',
  '- Honor the A1 layout rules from the brief (Section/Stack/Grid for layout, Cards in a Grid, sentence-case content, accessible structure).',
  '',
  'Output contract: respond with ONLY a single JSON object and nothing else — no markdown, no code fences, no commentary outside the JSON. The object must be exactly:',
  '{ "message": <a short, friendly one-to-three sentence summary of what you changed, for the chat>, "page": <the COMPLETE updated page definition object, same shape as the one you were given> }',
  'The "page" value must be the entire page definition (not a diff or a fragment), valid against the brief, ready to render as-is.',
  '',
  '=== A1 AGENT BRIEF (reference) ===',
  agentBrief,
].join('\n');

/** Light structural guard before we hand the page to the editor. */
function isPageDefinition(value: unknown): value is PageDefinition {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  if (typeof v.schemaVersion !== 'string') return false;
  const page = v.page as Record<string, unknown> | undefined;
  if (!page || typeof page !== 'object') return false;
  const layout = page.layout as Record<string, unknown> | undefined;
  if (!layout || typeof layout !== 'object') return false;
  return Array.isArray(layout.regions);
}

/** Pull the first balanced top-level JSON object out of a string. */
function extractJsonObject(text: string): string | null {
  const start = text.indexOf('{');
  if (start < 0) return null;
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (escape) { escape = false; continue; }
    if (ch === '\\') { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return null;
}

/**
 * Ask Claude to apply `instruction` to `currentPage`, returning the updated page
 * definition plus a chat reply. `history` carries prior (instruction → reply)
 * turns for conversational context; the live page JSON is always sent fresh, so
 * edits made by hand between turns are respected.
 *
 * Streams the response (whole-page output can be large) and parses the final
 * message; nothing is applied until parsing + structural validation succeed.
 */
export async function editPage(
  { instruction, currentPage, history = [] }:
  { instruction: string; currentPage: PageDefinition; history?: PageChatTurn[] },
): Promise<PageEditResult> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('NO_API_KEY');

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  // Prior turns give conversational context. We deliberately do NOT replay past
  // page JSON — only the short summaries — to keep the prompt small; the current
  // page is always sent fresh below.
  const priorMessages = history.map((t) => ({
    role: t.role,
    content: t.text,
  } as Anthropic.MessageParam));

  const currentJson = JSON.stringify(currentPage);

  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: 16000,
    thinking: { type: 'adaptive' },
    system: SYSTEM_PROMPT,
    messages: [
      ...priorMessages,
      {
        role: 'user',
        content:
          `Here is the current page definition JSON:\n\n${currentJson}\n\n` +
          `Instruction: ${instruction}\n\n` +
          `Return the JSON object { "message", "page" } as specified.`,
      },
    ],
  } as Anthropic.MessageStreamParams);

  const final = await stream.finalMessage();
  const textBlock = final.content.find((b) => b.type === 'text');
  const raw = textBlock && 'text' in textBlock ? textBlock.text : '';

  const jsonText = extractJsonObject(raw);
  if (!jsonText) throw new Error('BAD_JSON');

  let parsed: { message?: unknown; page?: unknown };
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error('BAD_JSON');
  }

  if (!isPageDefinition(parsed.page)) throw new Error('BAD_SHAPE');

  return {
    message: typeof parsed.message === 'string' && parsed.message.trim()
      ? parsed.message.trim()
      : 'Updated the page.',
    page: parsed.page,
  };
}
