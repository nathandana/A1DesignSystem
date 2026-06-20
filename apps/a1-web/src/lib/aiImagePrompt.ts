/**
 * "Generate with AI" — prompt-only. Anthropic's API can't render images, so this
 * has Claude compose a detailed, project-aware image-generation **prompt** from a
 * short description (plus the Figure's alt text and the project's image/illustration
 * style, when available). The user copies the prompt into the image generator of
 * their choice. Browser-side, sharing the same API key as the other AI helpers.
 */
import Anthropic from '@anthropic-ai/sdk';
import { getApiKey } from './aiImages';

const MODEL = 'claude-haiku-4-5';

export interface ImagePromptInput {
  description: string;
  alt?: string;
  /** The project's image & illustration style notes, if set (see project settings). */
  styleContext?: string;
}

export async function generateImagePrompt(
  { description, alt, styleContext }: ImagePromptInput,
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('NO_API_KEY');

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 600,
    system:
      'You write a single, detailed image-generation prompt (for tools like Midjourney, DALL·E, or ' +
      'Stable Diffusion) from a short description. Return ONLY the prompt text — no preamble, no quotes, ' +
      'no numbered options. Be vivid and specific about subject, composition, lighting, style, mood, and ' +
      'colour. If a project image/illustration style is given, follow it closely. Keep it to 2–4 sentences.',
    messages: [{
      role: 'user',
      content: [
        `Description: ${description}`,
        alt ? `Where it's used (alt text): ${alt}` : '',
        styleContext ? `Project image & illustration style to follow:\n${styleContext}` : '',
      ].filter(Boolean).join('\n\n'),
    }],
  } as Anthropic.MessageCreateParamsNonStreaming);

  const block = response.content.find((b) => b.type === 'text');
  return block && 'text' in block ? block.text.trim() : '';
}
