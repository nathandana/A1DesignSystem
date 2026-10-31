import { createCatalog } from '../catalog/createCatalog.js'
import { componentsCatalog } from '../components/catalog.js'
import {
  PATTERNS_LAST_UPDATED,
  PATTERN_COVERAGE,
  PATTERN_LAST_UPDATED,
  PATTERN_RELATED,
  PATTERN_SEARCH_KEYWORDS,
  PATTERN_STATUS,
  getPatternHistory,
  patternCategories,
} from './data.js'

/**
 * The Pattern library as a catalogue: the data behind `/pattern-library`. It
 * shares the component pages (sidebar, overview, category and detail) through
 * the catalogue descriptor. A pattern's related items are the components it
 * composes, so they resolve against the component catalogue.
 */
export const patternsCatalog = createCatalog({
  kind: 'pattern',
  icon: 'dashboard_customize',
  rootId: 'pattern-library',
  rootPath: '/pattern-library',
  categoryPrefix: 'patterns-',
  itemPrefix: 'pattern-',
  categories: patternCategories.map((category) => ({
    id: category.id,
    title: category.title,
    icon: category.icon,
    body: category.body,
    items: category.patterns,
  })),
  lastUpdated: PATTERNS_LAST_UPDATED,
  lastUpdatedById: PATTERN_LAST_UPDATED,
  status: PATTERN_STATUS,
  coverage: PATTERN_COVERAGE,
  related: PATTERN_RELATED,
  relatedCatalog: componentsCatalog,
  keywords: PATTERN_SEARCH_KEYWORDS,
  historyOf: getPatternHistory,
  sidebarViewKey: 'a1-patterns-sidebar-view',
  responsiveViewControl: 'toolbar',
  labels: {
    root: ['app.nav.patterns', 'Patterns'],
    all: ['app.patterns.all', 'All patterns'],
    search: ['app.nav.searchPatterns', 'Search patterns'],
    tree: ['app.patterns.tree', 'Pattern tree'],
    listView: ['app.patterns.listView', 'Pattern list view'],
    statusHeading: ['app.patterns.statusHeading', 'Pattern status'],
    relatedHeading: ['app.components.relatedHeading', 'Related components'],
    overviewTitle: ['app.page.patternLibrary', 'Pattern library'],
    overviewDescription: ['app.patterns.libraryDescription', 'Reusable compositions built from A1 components, configured like components and added to projects as one piece.'],
    tableCaption: ['app.patterns.tableCaption', 'All A1 patterns'],
    column: ['app.patterns.column', 'Pattern'],
    countLabel: ['app.nav.patterns', 'Patterns'],
    categoriesLabel: ['app.components.categoriesLabel', 'Categories'],
  },
})
