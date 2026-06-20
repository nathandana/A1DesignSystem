/**
 * "Create with AI" — a conversational project builder. The user describes the
 * project they want; Claude asks a few clarifying questions, then returns a
 * complete A1 **project bundle** JSON (pages + content) built to the agent brief.
 *
 * Each turn returns `{ status, message, project? }`:
 *  - `status: "asking"` → `message` is a clarifying question; keep the chat going.
 *  - `status: "complete"` → `message` is a summary and `project` is the bundle to
 *    import (via the existing project-import flow).
 *
 * Browser-side Anthropic SDK with the shared API key, like the other AI helpers.
 */
import Anthropic from '@anthropic-ai/sdk';
import agentBrief from '../../../../packages/react/ai/a1-agent-brief.md?raw';
import { getApiKey } from './aiImages';

// Sonnet 4.6 is a much cheaper run than Opus while still strong at multi-page
// structured JSON. (Swap to 'claude-haiku-4-5' for the lowest cost, at some risk
// of more malformed bundles on complex projects.)
const MODEL = 'claude-sonnet-4-6';

export interface ProjectChatTurn {
  role: 'user' | 'assistant';
  text: string;
}

export interface ProjectBuildResult {
  status: 'asking' | 'complete';
  message: string;
  project?: unknown;
}

export function describeError(err: unknown): string {
  if (err instanceof Anthropic.AuthenticationError) return 'That API key was rejected. Check the key and try again.';
  if (err instanceof Anthropic.PermissionDeniedError) return 'This API key doesn’t have access to the model.';
  if (err instanceof Anthropic.RateLimitError) return 'Rate limited — wait a moment and try again.';
  if (err instanceof Error && err.message === 'NO_API_KEY') return 'Add your Anthropic API key to use AI project creation.';
  if (err instanceof Error && err.message === 'BAD_JSON') return 'Claude’s response wasn’t valid JSON. Try again.';
  if (err instanceof Error && err.message === 'TRUNCATED') return 'The project was too large to return in one go. Ask for fewer or simpler pages and try again.';
  if (err instanceof Anthropic.APIError) return `Claude API error (${err.status ?? '—'}). Try again.`;
  return 'Something went wrong reaching Claude. Check your connection and try again.';
}

const SYSTEM_PROMPT = [
  'You are an assistant that helps a user create a brand-new A1 Design System project through a short conversation.',
  '',
  'Flow:',
  '1. The user describes what they want to build.',
  '2. Ask a FEW (2–4 total, one short batch at a time) clarifying questions to pin down: the kind of site/app, the pages needed, the audience/tone, and any key content. Do not over-interrogate — once you have enough to make sensible decisions, proceed.',
  '3. When you have enough, generate the COMPLETE A1 project bundle JSON (pages + their layout-first component trees) per the agent brief below. Preserve any content the user gave; invent reasonable, on-brand content for the rest. Use only documented component types, props, and values. Sentence case; accessible, semantic structure.',
  '',
  'Output contract — every reply is ONLY a single JSON object, no markdown/code fences/prose outside it:',
  '- While clarifying: { "status": "asking", "message": "<your question(s) to the user>" }',
  '- When done: { "status": "complete", "message": "<1–2 sentence summary of what you built>", "project": <project bundle> }',
  '',
  'The "project" bundle MUST have EXACTLY this shape (this is what the importer accepts):',
  '{',
  '  "name": "<project name>",',
  '  "description": "<short description>",',
  '  "icon": "<Material Symbols name, e.g. storefront>",',
  '  "pages": [',
  '    {',
  '      "id": "<stable page key, e.g. home>",',
  '      "title": "<page title>",',
  '      "icon": "<Material Symbols name>",',
  '      "description": "<optional>",',
  '      "parentId": "<id of a parent page for nesting, or omit/null for top level>",',
  '      "definition": {',
  '        "schemaVersion": "1.0.0",',
  '        "page": {',
  '          "id": "<same as the page id>",',
  '          "name": "<page title>",',
  '          "layout": { "type": "PageLayout", "regions": [ { "id": "main", "nodes": [ /* component nodes per the brief */ ] } ] }',
  '        }',
  '      }',
  '    }',
  '  ]',
  '}',
  'Every page MUST include a "definition" with page.layout.regions (an array of regions, each with a "nodes" array of A1 component nodes). Set "parentId" to another page\'s "id" to nest it. Do not wrap "definition" as a string — it is a nested object.',
  '',
  '=== A1 AGENT BRIEF (reference) ===',
  agentBrief,
].join('\n');

function extractJsonObject(text: string): string | null {
  const start = text.indexOf('{');
  if (start < 0) return null;
  let depth = 0, inString = false, escape = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (escape) { escape = false; continue; }
    if (ch === '\\') { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === '{') depth++;
    else if (ch === '}') { depth--; if (depth === 0) return text.slice(start, i + 1); }
  }
  return null;
}

/** Send the next user message and get the assistant's reply (a question, or the
 *  finished project). `history` carries the prior turns. */
export async function continueProjectChat(
  { history, userMessage }: { history: ProjectChatTurn[]; userMessage: string },
): Promise<ProjectBuildResult> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('NO_API_KEY');

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const messages: Anthropic.MessageParam[] = [
    ...history.map((t) => ({ role: t.role, content: t.text } as Anthropic.MessageParam)),
    { role: 'user', content: userMessage },
  ];

  const stream = client.messages.stream({
    model: MODEL,
    // A complete project bundle can be large; give plenty of headroom so the JSON
    // isn't truncated mid-object. No extended thinking — cheaper, and the whole
    // budget goes to the output.
    max_tokens: 32000,
    system: SYSTEM_PROMPT,
    messages,
  } as Anthropic.MessageStreamParams);

  const final = await stream.finalMessage();
  // A cut-off response yields invalid (unbalanced) JSON — report it clearly.
  if (final.stop_reason === 'max_tokens') throw new Error('TRUNCATED');

  const textBlock = final.content.find((b) => b.type === 'text');
  let raw = textBlock && 'text' in textBlock ? textBlock.text : '';
  // Strip ```json … ``` fences if the model wrapped its reply.
  raw = raw.replace(/```(?:json)?/gi, '');

  const jsonText = extractJsonObject(raw);
  if (!jsonText) throw new Error('BAD_JSON');

  let parsed: { status?: unknown; message?: unknown; project?: unknown };
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    // Tolerate a stray trailing comma before a closing } or ] and retry once.
    try {
      parsed = JSON.parse(jsonText.replace(/,(\s*[}\]])/g, '$1'));
    } catch {
      throw new Error('BAD_JSON');
    }
  }

  const status = parsed.status === 'complete' ? 'complete' : 'asking';
  return {
    status,
    message: typeof parsed.message === 'string' ? parsed.message : (status === 'complete' ? 'Project ready.' : '…'),
    project: status === 'complete' ? parsed.project : undefined,
  };
}
