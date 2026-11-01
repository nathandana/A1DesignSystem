import { CatalogPages, getCatalogAside, getCatalogSidebar } from '../components/index.jsx'
import { patternsCatalog } from './catalog.js'

export { patternCategories } from './data.js'
export { patternsCatalog }

export const PATTERN_ROUTE_IDS = patternsCatalog.pageIds
export const patternCategoryPageIds = patternsCatalog.categoryPageIds
export const patternPageIds = patternsCatalog.itemPageIds
export const patternPageTitles = patternsCatalog.pageTitles

/** The Pattern library: the same pages as Components, over the patterns catalogue. */
export function PatternLibrary(props) {
  return <CatalogPages catalog={patternsCatalog} {...props} />
}

export function getPatternsSidebar(props) {
  return getCatalogSidebar({ catalog: patternsCatalog, ...props })
}

export function getPatternsAside(props) {
  return getCatalogAside({ catalog: patternsCatalog, ...props })
}
