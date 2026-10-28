/**
 * Pattern registry for the a1-web Pattern library (A1-2720). Patterns are
 * compositions of A1 components shipped from `packages/react/src/patterns/`
 * and treated like components: a page with a live configurator, rules,
 * properties, accessibility and history tabs, an entry in the editor's Add
 * panel, and a `## Patterns` section in `packages/react/ai/components.md`
 * that the MCP index reads. Entries follow the `{ id, icon, title, body }`
 * order of `pages/components/data.js` so the history miner picks them up.
 */

export const PATTERNS_LAST_UPDATED = '2026-10-27'

export const PATTERN_LAST_UPDATED = {
  'page-title': '2026-10-27',
}

// Mirrors the "Patterns" section in packages/react/ai/components.md.
export const patternCategories = [
  {
    id: 'page-structure',
    title: 'Page structure',
    icon: 'web',
    body: 'The bands that frame a page: its title area now; footers and other page furniture to follow.',
    patterns: [
      { id: 'page-title', icon: 'title', title: 'Page title', body: 'The top band of a page: breadcrumb, eyebrow, heading with an optional accessory, description and page actions.' },
    ],
  },
]

export const PATTERN_SEARCH_KEYWORDS = {
  'page-title': ['page header', 'page title area', 'title band', 'hero', 'breadcrumb', 'page actions', 'h1'],
}

export const PATTERN_COVERAGE = {
  'page-title': ['React'],
}

export const PATTERN_STATUS = {
  'page-title': 'experimental',
}

export const PATTERN_RELATED = {
  'page-title': ['section', 'breadcrumb', 'heading', 'button-container'],
}

export const PATTERN_HISTORY = {
  'page-title': [
    { date: '2026-10-27', type: 'release', ticket: 'A1-2720', summary: 'Page title shipped as the first first-class pattern — a React composition of Section, Breadcrumb, Heading, Paragraph and ButtonContainer with a Pattern library page, configurator, editor entry and MCP coverage.' },
  ],
}

export function getPatternHistory(patternId) {
  const entries = PATTERN_HISTORY[patternId] ?? []
  return [...entries].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}
