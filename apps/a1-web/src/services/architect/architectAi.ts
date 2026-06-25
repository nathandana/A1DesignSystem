/**
 * Optional Ollama layer for the Virtual Information Architect.
 *
 * Enriches heuristic findings with concrete label rename suggestions and adds
 * 1–3 contextual observations that the rule engine cannot express. Degrades
 * gracefully to `engine: 'none'` when Ollama is not running.
 */
import { chooseModel, listLocalModels, localChat } from '../../lib/localAi';
import type { Finding, NavModel, NavNode } from './types';

export interface RenameProposal {
  /** The label as it currently reads in the nav. */
  from: string;
  /** The AI-suggested replacement (1–3 words, sentence case). */
  to: string;
  /** One-sentence rationale. */
  reason: string;
}

export interface AiObservation {
  /** Position-based stable id within a run. */
  id: string;
  title: string;
  detail: string;
  suggestion?: string;
}

export interface ArchitectAiResult {
  renames: RenameProposal[];
  observations: AiObservation[];
  /** 'model' when Ollama contributed; 'none' when unavailable or errored. */
  engine: 'model' | 'none';
  model?: string;
  elapsedMs: number;
  promptTokens?: number;
  outputTokens?: number;
}

function formatNav(nodes: NavNode[], depth = 0): string {
  return nodes
    .map((n) => {
      const indent = '  '.repeat(depth);
      const children = n.children?.length ? '\n' + formatNav(n.children, depth + 1) : '';
      return `${indent}- ${n.label}${children}`;
    })
    .join('\n');
}

/** Labels the heuristics flagged as problematic (non-praise). */
function flaggedLabels(findings: Finding[]): string[] {
  const seen = new Set<string>();
  for (const f of findings) {
    if (f.severity !== 'praise') {
      for (const label of f.nodes ?? []) seen.add(label);
    }
  }
  return [...seen];
}

/**
 * Ask the local Ollama model to enrich the deterministic audit with specific
 * rename proposals and additional contextual observations. Returns immediately
 * with `engine: 'none'` when no local model is available.
 */
export async function runArchitectAi(
  nav: NavModel,
  findings: Finding[],
): Promise<ArchitectAiResult> {
  const started = performance.now();
  const available = await listLocalModels();
  const model = chooseModel(available);

  if (!model) {
    return { renames: [], observations: [], engine: 'none', elapsedMs: performance.now() - started };
  }

  const flagged = flaggedLabels(findings);
  const flaggedNote = flagged.length
    ? `\n\nThe heuristic audit flagged these labels: ${flagged.map((l) => `"${l}"`).join(', ')}. Include a rename proposal for each that would benefit from a more specific name.`
    : '';

  try {
    const response = await localChat({
      model,
      temperature: 0.3,
      system: [
        'You are a senior information architect reviewing a design-system tool navigation menu.',
        'Return JSON only — no markdown fences, no explanation outside the JSON.',
        'Schema: {"renames":[{"from":"original","to":"better","reason":"one sentence"}],"observations":[{"title":"...","detail":"...","suggestion":"..."}]}',
        'Rename rules: replacements must be 1–3 words, concrete not vague, sentence case.',
        'Observations: maximum 3. Only include insights a rule engine cannot detect —',
        'conceptual overlap between sections, domain-specific clarity issues, discoverability',
        'gaps from a user perspective, or structural opportunities specific to a growing design tool.',
        'Do NOT repeat violations already flagged by heuristics (casing, depth, item count).',
        'Omit the "suggestion" key when no concrete fix applies.',
      ].join(' '),
      prompt: `Design-system tool navigation:\n${formatNav(nav.items)}${flaggedNote}`,
    });

    const cleaned = response.text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    let parsed: { renames?: unknown; observations?: unknown };
    try { parsed = JSON.parse(cleaned); } catch { parsed = {}; }

    const renames: RenameProposal[] = [];
    if (Array.isArray(parsed.renames)) {
      for (const item of parsed.renames) {
        if (
          item &&
          typeof item.from === 'string' &&
          typeof item.to === 'string' &&
          item.to !== item.from
        ) {
          renames.push({
            from: String(item.from),
            to: String(item.to),
            reason: String(item.reason ?? ''),
          });
        }
      }
    }

    const observations: AiObservation[] = [];
    if (Array.isArray(parsed.observations)) {
      for (let i = 0; i < Math.min(3, parsed.observations.length); i++) {
        const obs = parsed.observations[i];
        if (obs && typeof obs.title === 'string' && obs.title) {
          observations.push({
            id: `ai-obs-${i}`,
            title: String(obs.title),
            detail: String(obs.detail ?? ''),
            suggestion: typeof obs.suggestion === 'string' ? obs.suggestion : undefined,
          });
        }
      }
    }

    return {
      renames,
      observations,
      engine: 'model',
      model: response.model,
      elapsedMs: performance.now() - started,
      promptTokens: response.promptTokens,
      outputTokens: response.outputTokens,
    };
  } catch {
    return { renames: [], observations: [], engine: 'none', elapsedMs: performance.now() - started };
  }
}
