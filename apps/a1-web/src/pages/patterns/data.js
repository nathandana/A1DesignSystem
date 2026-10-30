/**
 * Pattern registry for the a1-web Pattern library (A1-2720). Patterns are
 * compositions of A1 components shipped from `packages/react/src/patterns/`
 * and treated like components: a page with a live configurator, rules,
 * properties, accessibility and history tabs, an entry in the editor's Add
 * panel, and a `## Patterns` section in `packages/react/ai/components.md`
 * that the MCP index reads. Entries follow the `{ id, icon, title, body }`
 * order of `pages/components/data.js` so the history miner picks them up.
 */

export const PATTERNS_LAST_UPDATED = '2026-10-28'

export const PATTERN_LAST_UPDATED = {
  'navigation-tree': '2026-10-28',
  'verification-dialog': '2026-10-28',
  'overflow-menu': '2026-10-28',
  'page-title': '2026-10-28',
  'overview-card': '2026-10-28',
}

// Mirrors the "Patterns" section in packages/react/ai/components.md.
export const patternCategories = [
  { id: 'navigation', title: 'Navigation', icon: 'account_tree', body: 'Patterns for browsing and finding content.', patterns: [
    { id: 'navigation-tree', icon: 'account_tree', title: 'Navigation tree', body: 'A nested side menu with optional search and a toggle between categorized and A–Z views.' },
  ] },
  {
    id: 'contextual-actions',
    title: 'Contextual actions',
    icon: 'more_vert',
    body: 'Contextual actions with consistent triggers and optional verification.',
    patterns: [
      { id: 'verification-dialog', icon: 'verified_user', title: 'Verification dialog', body: 'A reusable confirmation dialog with a message, optional supporting content and fixed Cancel/Confirm actions.' },
      { id: 'overflow-menu', icon: 'more_vert', title: 'Overflow menu', body: 'An icon-button menu with configurable actions and optional verification dialogs for any action.' },
    ],
  },
  {
    id: 'page-structure',
    title: 'Page structure',
    icon: 'web',
    body: 'The bands that frame a page: its title area now; footers and other page furniture to follow.',
    patterns: [
      { id: 'page-title', icon: 'title', title: 'Page title', body: 'The top band of a page: breadcrumb, eyebrow, heading, metadata badges, description and page actions.' },
    ],
  },
  {
    id: 'cards',
    title: 'Cards',
    icon: 'dashboard',
    body: 'Cards that summarise one thing in a set, so every card in a grid reads the same.',
    patterns: [
      { id: 'overview-card', icon: 'summarize', title: 'Overview card', body: 'A summary card: an icon, a heading, key details, a content area, an optional labelled status and up to two actions.' },
    ],
  },
]

export const PATTERN_SEARCH_KEYWORDS = {
  'verification-dialog': ['confirmation', 'verify', 'confirm action', 'delete', 'cancel'],
  'navigation-tree': ['sidebar', 'navigation', 'tree menu', 'search', 'categories', 'alphabetical', 'A-Z'],
  'overflow-menu': ['more actions', 'more_vert', 'kebab menu', 'edit', 'duplicate', 'delete', 'verification', 'confirmation'],
  'page-title': ['page header', 'page title area', 'title band', 'hero', 'breadcrumb', 'page actions', 'h1'],
  'overview-card': ['summary card', 'stat card', 'detail card', 'key details', 'facts', 'definition list', 'card grid', 'dashboard card'],
}

export const PATTERN_COVERAGE = {
  'verification-dialog': ['React'],
  'navigation-tree': ['React'],
  'overflow-menu': ['React'],
  'page-title': ['React'],
  'overview-card': ['React'],
}

export const PATTERN_STATUS = {
  'verification-dialog': 'experimental',
  'navigation-tree': 'experimental',
  'overflow-menu': 'experimental',
  'page-title': 'experimental',
  'overview-card': 'experimental',
}

export const PATTERN_RELATED = {
  'verification-dialog': ['dialog', 'button', 'paragraph'],
  'navigation-tree': ['tree-menu', 'side-nav', 'search-field', 'toolbar'],
  'overflow-menu': ['icon-button', 'menu', 'dialog', 'button'],
  'page-title': ['section', 'breadcrumb', 'heading', 'button-container'],
  'overview-card': ['card', 'definition-list', 'heading', 'button-container'],
}

export const PATTERN_HISTORY = {
  'verification-dialog': [{ date: '2026-10-28', type: 'release', summary: 'Added reusable verification as a formal pattern, nested by overflow menu actions.' }],
  'navigation-tree': [{ date: '2026-10-28', type: 'release', summary: 'Reusable nested navigation with optional search and A–Z sorting; used by the Components and Patterns sidebars.' }],
  'overflow-menu': [{ date: '2026-10-28', type: 'release', summary: 'Added a formal overflow menu with structured actions and optional per-action verification dialogs.' }],
  'page-title': [
    { date: '2026-10-27', type: 'release', ticket: 'A1-2720', summary: 'Page title shipped as the first first-class pattern — a React composition of Section, Breadcrumb, Heading, Paragraph and ButtonContainer with a Pattern library page, configurator, editor entry and MCP coverage.' },
  ],
  'overview-card': [
    { date: '2026-10-28', type: 'release', ticket: 'A1-2720', summary: 'Overview card shipped as the second pattern — a React composition of Card, Heading, DefinitionList and ButtonContainer with a locked surface and icon block, a labelled status, key details, a content area and an Actions zone of small, non-primary actions.' },
  ],
}

export function getPatternHistory(patternId) {
  const entries = PATTERN_HISTORY[patternId] ?? []
  return [...entries].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}
