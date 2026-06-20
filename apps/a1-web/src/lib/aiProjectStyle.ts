/**
 * Suggest a project's image & illustration style with AI, informed by the project
 * (name + description) and the active theme. Returns a concise style guide the
 * user can accept or edit; it later feeds the Figure "Generate with AI" prompt.
 * Browser-side, sharing the same API key as the other AI helpers.
 */
import Anthropic from '@anthropic-ai/sdk';
import { getApiKey } from './aiImages';

const MODEL = 'claude-haiku-4-5';

// Short vibe descriptors for the known themes, so Claude grounds the style in the
// actual look. Falls back to the raw theme id for anything not listed.
const THEME_VIBES: Record<string, string> = {
  a1Light: 'clean, modern, neutral light UI',
  accessible: 'high-contrast, accessible, utilitarian',
  heritage: 'classic, traditional, established brand; barely-rounded corners',
  fresh: 'bright and friendly; sky-blue accents, mint gradient, rounded; Nunito/Baskerville type',
  crochet: 'soft cozy pastels (dusty-rose, sage, periwinkle, apricot) on warm cream; expressive warm serifs; handmade/craft feel',
};

function activeThemeVibe(): string {
  let theme = '';
  try { theme = localStorage.getItem('a1-web-theme') || ''; } catch { /* ignore */ }
  return THEME_VIBES[theme] || theme || 'a clean modern design system';
}

export async function suggestImageStyle(
  { projectName, projectDescription }: { projectName?: string; projectDescription?: string },
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('NO_API_KEY');

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 500,
    system:
      'You define the image and illustration style for a product/website so all its imagery feels cohesive. ' +
      'Given the project and its visual theme, write a short, concrete style guide covering BOTH: ' +
      '(1) Illustration style, and (2) Photography style. Cover subject matter, composition, colour palette, ' +
      'lighting/mood, and any treatments to avoid. Return plain prose with the two labelled parts — no preamble, ' +
      'about 4–6 sentences total.',
    messages: [{
      role: 'user',
      content: [
        `Project: ${projectName || '(untitled)'}`,
        projectDescription ? `Description: ${projectDescription}` : '',
        `Visual theme: ${activeThemeVibe()}`,
      ].filter(Boolean).join('\n'),
    }],
  } as Anthropic.MessageCreateParamsNonStreaming);

  const block = response.content.find((b) => b.type === 'text');
  return block && 'text' in block ? block.text.trim() : '';
}
