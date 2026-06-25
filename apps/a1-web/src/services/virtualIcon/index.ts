/**
 * Virtual Icon Designer — local AI service.
 *
 * Uses an optional Ollama model to generate Material Symbols-style SVG icon
 * path data from a text description. When no local model is reachable the
 * service returns a set of geometric template icons so the UI always has
 * something to show. No Anthropic API key required.
 *
 * Setup (optional): install Ollama (https://ollama.com), pull any capable
 * model (e.g. `ollama pull qwen2.5-coder`), and allow the dev origin:
 *   OLLAMA_ORIGINS="http://127.0.0.1:5177" ollama serve
 */
import { chooseModel, listLocalModels, localChat } from '../../lib/localAi'
import { validateCustomIconSvg } from '../../lib/customIconFont'

export const virtualIconDesigner = {
  name: 'Virtual Icon Designer',
  role: 'SVG icon design via local AI',
  icon: 'draw',
  blurb:
    'Describe a concept and a local Ollama model will design Material Symbols-style 24×24 SVG icons. ' +
    'Preview each result, then add the ones you want to your custom icon font.',
}

export interface DesignedIcon {
  name: string
  reason: string
  paths: string[]
  valid: boolean
  svg?: string
  error?: string
}

export interface DesignResult {
  icons: DesignedIcon[]
  model: string
  elapsedMs: number
  /** True when Ollama was unreachable and template icons were returned. */
  fromFallback?: boolean
}

// ── Fallback templates ────────────────────────────────────────────────────────
// Returned when no local model is available. Each is a real 24×24 path that
// validates correctly — they demonstrate the format and can be accepted as-is.

const FALLBACK_TEMPLATES: { name: string; reason: string; paths: string[] }[] = [
  {
    name: 'template_circle',
    reason: 'Outlined circle — a Ollama model is needed to generate custom paths.',
    paths: [
      'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8Z',
    ],
  },
  {
    name: 'template_diamond',
    reason: 'Outlined diamond — a Ollama model is needed to generate custom paths.',
    paths: [
      'M12 2L2 12l10 10 10-10L12 2zm0 3.17L18.83 12 12 18.83 5.17 12 12 5.17Z',
    ],
  },
  {
    name: 'template_star',
    reason: 'Five-pointed star — a Ollama model is needed to generate custom paths.',
    paths: [
      'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
    ],
  },
]

// ── Ollama prompt ─────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an SVG icon designer. Create Material Symbols Outlined-style icons for a 24×24 viewBox.

Output valid JSON ONLY — no markdown, no code fences, no explanation outside the JSON:
{"icons":[{"name":"snake_case_name","reason":"one sentence why","paths":["M... Z"]}]}

STRICT SVG PATH RULES:
- All shapes must fit within x:2–22 and y:2–22.
- Use fill="currentColor". No stroke. No transforms. No groups.
- Use absolute path commands ONLY: M L C Q A Z. Every path MUST end with Z.
- Outlined style: draw the icon as a ~2-unit-thick outline silhouette (like a Material Symbol).
- Each icon: a distinct snake_case name and one short reason sentence.

EXAMPLE OUTPUT (correct format — output ONLY this shape of JSON):
{"icons":[{"name":"outlined_circle","reason":"Clean outlined circle for status indicators.","paths":["M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8Z"]}]}`

function buildPrompt(description: string, count: number): string {
  return (
    `Design ${count} distinct 24×24 SVG icon variations for: "${description}". ` +
    `Each icon should represent the concept differently. Return only the JSON object.`
  )
}

// ── JSON extraction ───────────────────────────────────────────────────────────
// Local models often wrap the JSON in markdown code fences. Try several extraction
// strategies before giving up.

function extractIcons(text: string): { name: string; reason: string; paths: string[] }[] {
  const candidates = [
    text.trim(),
    text.replace(/```(?:json)?\s*([\s\S]*?)```/g, '$1').trim(),
    (text.match(/\{[\s\S]*\}/) || [])[0] ?? '',
  ]

  for (const candidate of candidates) {
    if (!candidate) continue
    try {
      const parsed = JSON.parse(candidate) as { icons?: unknown }
      if (Array.isArray(parsed.icons)) {
        return parsed.icons as { name: string; reason: string; paths: string[] }[]
      }
    } catch {
      // try next candidate
    }
  }
  return []
}

// ── Main export ───────────────────────────────────────────────────────────────

export async function designIconsLocal({
  description,
  count = 3,
  modelOverride,
}: {
  description: string
  count?: number
  modelOverride?: string
}): Promise<DesignResult> {
  const available = await listLocalModels().catch(() => [] as string[])
  const model = modelOverride ?? chooseModel(available)

  // No local model — return geometric templates with a note
  if (!model) {
    const icons: DesignedIcon[] = FALLBACK_TEMPLATES.slice(0, count).map((t) => ({
      ...t,
      valid: true,
      svg:
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">` +
        t.paths.map((d) => `<path d="${d}" fill="currentColor"/>`).join('') +
        `</svg>`,
    }))
    return { icons, model: 'none', elapsedMs: 0, fromFallback: true }
  }

  const t0 = performance.now()
  const response = await localChat({
    system: SYSTEM_PROMPT,
    prompt: buildPrompt(description, count + 1), // over-request by 1 to allow for filtering
    model,
    temperature: 0.7,
  })
  const elapsedMs = performance.now() - t0

  const rawIcons = extractIcons(response.text)
  const icons: DesignedIcon[] = []

  for (const it of rawIcons) {
    if (!it || typeof it !== 'object') continue
    const name = String(it.name ?? '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '') || 'icon'
    const reason = String(it.reason ?? '')
    const pathArr = (Array.isArray(it.paths) ? it.paths : []).map(String)

    const svgText =
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">` +
      pathArr.map((d) => `<path d="${d}" fill="currentColor"/>`).join('') +
      `</svg>`

    try {
      const validated = validateCustomIconSvg(svgText, name)
      icons.push({
        name: validated.name || name,
        reason,
        paths: validated.paths,
        valid: true,
        svg: validated.svg,
      })
    } catch (err) {
      icons.push({
        name,
        reason,
        paths: pathArr,
        valid: false,
        error: err instanceof Error ? err.message : 'Invalid SVG',
      })
    }

    if (icons.length >= count) break
  }

  // If the model returned nothing parseable, fall back to templates
  if (icons.length === 0) {
    const fallback: DesignedIcon[] = FALLBACK_TEMPLATES.slice(0, Math.min(count, 3)).map((t) => ({
      ...t,
      valid: true,
      svg:
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">` +
        t.paths.map((d) => `<path d="${d}" fill="currentColor"/>`).join('') +
        `</svg>`,
    }))
    return { icons: fallback, model, elapsedMs, fromFallback: true }
  }

  return { icons, model, elapsedMs }
}
