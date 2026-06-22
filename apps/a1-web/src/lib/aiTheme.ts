/**
 * Generate a theme from a plain-language description. Claude returns a -500 hex
 * per colour ramp, three Google Font family names, and a roundness value, which
 * the theme editor compiles into the full theme. Browser-side, shared API key.
 */
import Anthropic from '@anthropic-ai/sdk';
import { type AiUsage, getApiKey } from './aiImages';

const MODEL = 'claude-haiku-4-5';

export interface AiThemeResult {
  name: string;
  description: string;
  ramps: { neutral: string; accent: string; info: string; error: string; warn: string; success: string };
  fonts: { display: string; heading: string; body: string };
  roundness: number;
}

export function describeError(err: unknown): string {
  if (err instanceof Anthropic.AuthenticationError) return 'That API key was rejected. Check the key and try again.';
  if (err instanceof Anthropic.RateLimitError) return 'Rate limited — wait a moment and try again.';
  if (err instanceof Error && err.message === 'NO_API_KEY') return 'Add your Anthropic API key to generate a theme.';
  if (err instanceof Error && err.message === 'BAD_JSON') return 'Couldn’t read the theme from Claude. Try again.';
  if (err instanceof Anthropic.APIError) return `Claude API error (${err.status ?? '—'}). Try again.`;
  return 'Something went wrong reaching Claude. Check your connection and try again.';
}

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    name: { type: 'string', description: 'A short theme name (1–2 words).' },
    description: { type: 'string', description: 'One sentence describing the look.' },
    ramps: {
      type: 'object',
      additionalProperties: false,
      description: 'The -500 (mid) hex for each ramp; the editor generates the full scale.',
      properties: {
        neutral: { type: 'string', description: 'Mid grey/neutral hex (#RRGGBB) — drives surfaces, text, and borders.' },
        accent: { type: 'string', description: 'Primary brand/action hex (#RRGGBB).' },
        info: { type: 'string', description: 'Info hex (#RRGGBB).' },
        error: { type: 'string', description: 'Error/danger hex (#RRGGBB).' },
        warn: { type: 'string', description: 'Warning hex (#RRGGBB).' },
        success: { type: 'string', description: 'Success hex (#RRGGBB).' },
      },
      required: ['neutral', 'accent', 'info', 'error', 'warn', 'success'],
    },
    fonts: {
      type: 'object',
      additionalProperties: false,
      description: 'Real Google Fonts family names that exist on fonts.google.com.',
      properties: {
        display: { type: 'string', description: 'Display font family (for large hero/display text).' },
        heading: { type: 'string', description: 'Heading font family.' },
        body: { type: 'string', description: 'Body text font family.' },
      },
      required: ['display', 'heading', 'body'],
    },
    roundness: { type: 'number', description: 'Corner roundness in px for medium radius (0 = sharp, 16 = very round).' },
  },
  required: ['name', 'description', 'ramps', 'fonts', 'roundness'],
} as const;

export interface AiFontPairing {
  display: string;
  heading: string;
  body: string;
  rationale: string;
}

const FONT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    display: { type: 'string', description: 'Display font family (large hero/display text) — an exact Google Fonts family name.' },
    heading: { type: 'string', description: 'Heading font family — an exact Google Fonts family name.' },
    body: { type: 'string', description: 'Body text font family — an exact Google Fonts family name, highly legible at small sizes.' },
    rationale: { type: 'string', description: 'One short sentence on why this trio pairs well.' },
  },
  required: ['display', 'heading', 'body', 'rationale'],
} as const;

/**
 * Pick three compatible Google Fonts (display / heading / body) for a described
 * mood. Claude searches its knowledge of the Google Fonts catalogue and applies
 * pairing heuristics (contrast of classification, harmony of proportion). The
 * three may legitimately be the same family in different roles when that suits.
 */
export async function generateFontPairing(description: string): Promise<AiFontPairing & { usage: AiUsage }> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('NO_API_KEY');

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const t0 = performance.now();
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 512,
    system:
      'You are a typographer who pairs Google Fonts. Given a mood or brand description, choose three REAL families ' +
      'that exist on fonts.google.com for the display, heading, and body roles. Apply real pairing craft: pair by ' +
      'contrast of classification (e.g. an expressive display with a neutral body) while keeping proportion and ' +
      'x-height in harmony; ensure the body face is highly legible at small sizes; and make sure the trio shares a ' +
      'coherent voice. Prefer well-known, well-hinted families over obscure ones. Return exact family names only ' +
      '(no weights or styles).',
    output_config: { format: { type: 'json_schema', schema: FONT_SCHEMA } },
    messages: [{ role: 'user', content: `Pair display, heading, and body fonts for: "${description}".` }],
  } as Anthropic.MessageCreateParamsNonStreaming);

  const elapsedMs = performance.now() - t0;
  const block = response.content.find((b) => b.type === 'text');
  const raw = block && 'text' in block ? block.text : '';
  try {
    return { ...JSON.parse(raw) as AiFontPairing, usage: { inputTokens: response.usage.input_tokens, outputTokens: response.usage.output_tokens, elapsedMs, model: MODEL } };
  } catch {
    throw new Error('BAD_JSON');
  }
}

export async function generateTheme(description: string): Promise<AiThemeResult & { usage: AiUsage }> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('NO_API_KEY');

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const t0 = performance.now();
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system:
      'You design cohesive UI colour + type themes. From a description, choose a -500 (mid) hex for each ramp ' +
      '(neutral drives surfaces/text/borders, so pick a grey suited to the mood), an accent (brand/action) colour, ' +
      'and info/error/warn/success colours that read as those statuses. Pick three REAL Google Fonts that fit the ' +
      'description and pair well (display, heading, body). Choose a roundness in px (0 sharp … 16 very round). ' +
      'Ensure good contrast (text on light surfaces, white on the accent).',
    output_config: { format: { type: 'json_schema', schema: SCHEMA } },
    messages: [{ role: 'user', content: `Design a theme for: "${description}".` }],
  } as Anthropic.MessageCreateParamsNonStreaming);

  const elapsedMs = performance.now() - t0;
  const block = response.content.find((b) => b.type === 'text');
  const raw = block && 'text' in block ? block.text : '';
  try {
    return { ...JSON.parse(raw) as AiThemeResult, usage: { inputTokens: response.usage.input_tokens, outputTokens: response.usage.output_tokens, elapsedMs, model: MODEL } };
  } catch {
    throw new Error('BAD_JSON');
  }
}
