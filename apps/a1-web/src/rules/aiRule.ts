/**
 * Generate a structured A1 design rule from a plain-language description. Claude
 * returns an id, the component/area it applies to, a requirement, do/don't
 * guidance, and applicable categories. Browser-side, shared API key.
 */
import Anthropic from '@anthropic-ai/sdk';
import { type AiUsage, getApiKey } from '../lib/aiImages';
import { RULE_CATEGORIES } from './ruleStore';

const MODEL = 'claude-haiku-4-5';

export interface AiRuleResult {
  id: string;
  component: string;
  requirement: string;
  do: string;
  dont: string;
  appliesTo: string[];
}

export function describeError(err: unknown): string {
  if (err instanceof Anthropic.AuthenticationError) return 'That API key was rejected. Check the key and try again.';
  if (err instanceof Anthropic.RateLimitError) return 'Rate limited — wait a moment and try again.';
  if (err instanceof Error && err.message === 'NO_API_KEY') return 'Add your Anthropic API key to generate a rule.';
  if (err instanceof Error && err.message === 'BAD_JSON') return 'Couldn’t read the rule from Claude. Try again.';
  if (err instanceof Anthropic.APIError) return `Claude API error (${err.status ?? '—'}). Try again.`;
  return 'Something went wrong reaching Claude. Check your connection and try again.';
}

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    id: { type: 'string', description: 'A kebab-case rule id, prefixed with the component, e.g. "button-single-primary-action".' },
    component: { type: 'string', description: 'The component or area the rule applies to (e.g. "Button", "Card", "Typography").' },
    requirement: { type: 'string', description: 'The rule, stated as a single clear requirement sentence.' },
    do: { type: 'string', description: 'A concrete "do" example of following the rule.' },
    dont: { type: 'string', description: 'A concrete "don’t" example of breaking the rule.' },
    appliesTo: {
      type: 'array',
      items: { type: 'string' },
      description: 'Categories the rule touches (lowercase), e.g. accessibility, layout, content, visual-design, usability, safety, hierarchy.',
    },
  },
  required: ['id', 'component', 'requirement', 'do', 'dont', 'appliesTo'],
} as const;

export async function generateRule(description: string, componentHint?: string): Promise<{ rule: AiRuleResult; usage: AiUsage }> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('NO_API_KEY');

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const t0 = performance.now();
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 700,
    system:
      'You author design-system rules for the A1 design system. From a description, write ONE concise, enforceable ' +
      'rule: a kebab-case id (component-prefixed), the component/area it applies to, a single-sentence requirement, ' +
      'a concrete do example, a concrete don’t example, and the categories it touches. A1 values accessibility, ' +
      'semantic HTML, tokenised values, and sentence case (never uppercase). Prefer these category labels when they ' +
      `fit: ${RULE_CATEGORIES.join(', ') || 'accessibility, layout, content, visual-design, usability, safety, hierarchy'}.`,
    output_config: { format: { type: 'json_schema', schema: SCHEMA } },
    messages: [{
      role: 'user',
      content: `Write a rule for: "${description}".${componentHint ? ` It applies to the ${componentHint} component.` : ''}`,
    }],
  } as Anthropic.MessageCreateParamsNonStreaming);

  const elapsedMs = performance.now() - t0;
  const block = response.content.find((b) => b.type === 'text');
  const raw = block && 'text' in block ? block.text : '';
  try {
    return {
      rule: JSON.parse(raw) as AiRuleResult,
      usage: { inputTokens: response.usage.input_tokens, outputTokens: response.usage.output_tokens, elapsedMs, model: MODEL },
    };
  } catch {
    throw new Error('BAD_JSON');
  }
}
