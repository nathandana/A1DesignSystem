/**
 * A small "API for Claude": submit a description, get back Unsplash image
 * suggestions. Claude returns real `images.unsplash.com/photo-…` URLs that match
 * the description, plus alt text and a caption for each.
 *
 * Runs entirely in the browser via the official Anthropic SDK with
 * `dangerouslyAllowBrowser: true`. The API key is supplied by the user and kept
 * in localStorage — this is fine for a local prototyping tool, but the key is
 * exposed to the page, so do NOT ship this pattern to a public production app
 * (proxy the call through a backend there instead).
 */
import Anthropic from '@anthropic-ai/sdk';

const KEY_STORAGE = 'a1-anthropic-api-key';

/**
 * Model used for suggestions. Defaults to Opus 4.8; for this lightweight task a
 * faster/cheaper model also works well — swap to `'claude-haiku-4-5'`.
 */
const MODEL = 'claude-haiku-4-5';

export interface ImageSuggestion {
  url: string;
  alt: string;
  caption: string;
}

export function getApiKey(): string | null {
  try { return localStorage.getItem(KEY_STORAGE); } catch { return null; }
}

export function setApiKey(key: string): void {
  try {
    if (key) localStorage.setItem(KEY_STORAGE, key.trim());
    else localStorage.removeItem(KEY_STORAGE);
  } catch { /* ignore */ }
}

export function hasApiKey(): boolean {
  return !!getApiKey();
}

// JSON schema for structured output. (Structured-output schemas don't support
// array length constraints, so the count is requested in the prompt and the
// result is sliced to `count` below.)
const SUGGESTION_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    images: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          url: {
            type: 'string',
            description:
              'A real Unsplash image URL of the form https://images.unsplash.com/photo-<id>?w=1280&q=80&auto=format&fit=crop',
          },
          alt: { type: 'string', description: 'Concise, descriptive alt text for the image.' },
          caption: { type: 'string', description: 'A short caption a designer could place under the image.' },
        },
        required: ['url', 'alt', 'caption'],
      },
    },
  },
  required: ['images'],
} as const;

/** Ensure an Unsplash URL carries sizing/format params so it renders well. */
function normalizeUnsplash(url: string): string {
  if (!/^https?:\/\//i.test(url)) return '';
  try {
    const u = new URL(url);
    if (u.hostname.includes('unsplash.com')) {
      if (!u.searchParams.has('w')) u.searchParams.set('w', '1280');
      if (!u.searchParams.has('q')) u.searchParams.set('q', '80');
      u.searchParams.set('auto', 'format');
      u.searchParams.set('fit', 'crop');
    }
    return u.toString();
  } catch {
    return url;
  }
}

/** A smaller variant of an Unsplash URL for grid thumbnails. */
export function thumbUrl(url: string, w = 400): string {
  try {
    const u = new URL(url);
    if (u.hostname.includes('unsplash.com')) u.searchParams.set('w', String(w));
    return u.toString();
  } catch {
    return url;
  }
}

/** Friendly message for an SDK/network error. */
export function describeError(err: unknown): string {
  if (err instanceof Anthropic.AuthenticationError) return 'That API key was rejected. Check the key and try again.';
  if (err instanceof Anthropic.PermissionDeniedError) return 'This API key doesn’t have access to the model.';
  if (err instanceof Anthropic.RateLimitError) return 'Rate limited — wait a moment and try again.';
  if (err instanceof Error && err.message === 'NO_API_KEY') return 'Add your Anthropic API key to use AI image search.';
  if (err instanceof Anthropic.APIError) return `Claude API error (${err.status ?? '—'}). Try again.`;
  return 'Something went wrong reaching Claude. Check your connection and try again.';
}

/**
 * Ask Claude for `count` Unsplash image suggestions matching `description`.
 * Pass already-shown URLs in `avoid` to get different options ("show 3 more").
 */
export async function suggestImages(
  { description, count = 3, avoid = [] }: { description: string; count?: number; avoid?: string[] },
): Promise<ImageSuggestion[]> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('NO_API_KEY');

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const avoidNote = avoid.length
    ? `\n\nDo NOT suggest any of these already-shown images:\n${avoid.join('\n')}`
    : '';

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system:
      'You recommend real stock photography from Unsplash that matches a description. ' +
      'Only return genuine Unsplash photo URLs in the https://images.unsplash.com/photo-<id> ' +
      'format with sizing query params. Favor high-quality, professional editorial photography, ' +
      'and vary the subject, composition, and color palette across the suggestions.',
    output_config: { format: { type: 'json_schema', schema: SUGGESTION_SCHEMA } },
    messages: [
      { role: 'user', content: `Suggest ${count} distinct Unsplash images for: "${description}".${avoidNote}` },
    ],
  } as Anthropic.MessageCreateParamsNonStreaming);

  const textBlock = response.content.find((b) => b.type === 'text');
  const raw = textBlock && 'text' in textBlock ? textBlock.text : '';
  let parsed: { images?: unknown };
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('Could not read Claude’s response.');
  }

  const images = Array.isArray(parsed.images) ? parsed.images : [];
  return images
    .map((im) => {
      const item = im as Record<string, unknown>;
      return {
        url: normalizeUnsplash(String(item.url ?? '')),
        alt: String(item.alt ?? ''),
        caption: String(item.caption ?? ''),
      };
    })
    .filter((im) => im.url)
    .slice(0, count);
}
