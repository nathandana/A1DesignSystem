/**
 * Local AI client — talks to a **local** LLM runner (Ollama's HTTP API) so optional AI-assisted
 * features can use a model on your own machine, with **no Anthropic API calls and no credits
 * spent**. Used by the Backlog "Build with AI" tab to turn a ticket into a development plan.
 *
 * Everything degrades gracefully: if no local runner is reachable (or it errors), callers
 * fall back to the deterministic planner. Nothing here is required for the app to work.
 *
 * Setup (optional): install Ollama (https://ollama.com), `ollama pull qwen2.5-coder`
 * (or any model), and allow the dev origin if needed:
 *   OLLAMA_ORIGINS="http://127.0.0.1:5177" ollama serve
 */

const HOST_KEY = 'a1-local-ai-host';
const MODEL_KEY = 'a1-local-ai-model';
const DEFAULT_HOST = 'http://localhost:11434';

export function localAiHost(): string {
  try { return localStorage.getItem(HOST_KEY) || DEFAULT_HOST; } catch { return DEFAULT_HOST; }
}
export function setLocalAiHost(host: string): void {
  try { if (host) localStorage.setItem(HOST_KEY, host.trim()); else localStorage.removeItem(HOST_KEY); } catch { /* ignore */ }
}
export function preferredLocalModel(): string | null {
  try { return localStorage.getItem(MODEL_KEY); } catch { return null; }
}
export function setPreferredLocalModel(model: string): void {
  try { if (model) localStorage.setItem(MODEL_KEY, model.trim()); else localStorage.removeItem(MODEL_KEY); } catch { /* ignore */ }
}

/** Models available on the local runner (empty when none/unreachable). */
export async function listLocalModels(timeoutMs = 1500): Promise<string[]> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(`${localAiHost()}/api/tags`, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) return [];
    const data = await res.json();
    const models = Array.isArray(data?.models) ? data.models : [];
    return models.map((m: { name?: string }) => m?.name).filter((n: unknown): n is string => typeof n === 'string');
  } catch {
    return [];
  }
}

/** Pick the model to use: the preferred one if it's installed, else the first available. */
export function chooseModel(available: string[]): string | null {
  if (!available.length) return null;
  const pref = preferredLocalModel();
  if (pref && available.includes(pref)) return pref;
  return available[0];
}

export interface LocalChatResult {
  text: string;
  model: string;
  elapsedMs: number;
  /** Ollama's local token counts (no API cost — purely informational). */
  promptTokens?: number;
  outputTokens?: number;
}

/**
 * One non-streaming chat completion against the local runner. Throws on transport/HTTP
 * error so the caller can fall back. (Ollama's `/api/chat` shape.)
 */
export async function localChat(
  { system, prompt, model, temperature = 0.2 }: { system: string; prompt: string; model: string; temperature?: number },
): Promise<LocalChatResult> {
  const t0 = performance.now();
  const res = await fetch(`${localAiHost()}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      stream: false,
      options: { temperature },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: prompt },
      ],
    }),
  });
  if (!res.ok) throw new Error(`LOCAL_AI_HTTP_${res.status}`);
  const data = await res.json();
  return {
    text: (data?.message?.content ?? '').trim(),
    model,
    elapsedMs: performance.now() - t0,
    promptTokens: typeof data?.prompt_eval_count === 'number' ? data.prompt_eval_count : undefined,
    outputTokens: typeof data?.eval_count === 'number' ? data.eval_count : undefined,
  };
}
