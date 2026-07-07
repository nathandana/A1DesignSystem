import {
  COMPONENT_SEARCH_KEYWORDS,
  COMPONENT_RELATED,
  COMPONENT_LAST_UPDATED,
  PACKAGE_COVERAGE,
  LAST_UPDATED,
  componentCategories,
  ruleSourceFiles,
} from './data.js'
import componentExamples from './componentExamples.json'

export { componentExamples }

function normalizeSearchTerm(value) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

function compactSearchTerm(value) {
  return normalizeSearchTerm(value).replace(/\s+/g, '')
}

function uniqueTerms(terms) {
  return [...new Set(terms.map(normalizeSearchTerm).filter(Boolean))]
}

function oneEditVariants(term) {
  const compact = compactSearchTerm(term)
  if (compact.length < 4 || compact.length > 18) return []

  const variants = new Set()
  for (let index = 0; index < compact.length; index += 1) {
    variants.add(`${compact.slice(0, index)}${compact.slice(index + 1)}`)
  }
  for (let index = 0; index < compact.length - 1; index += 1) {
    variants.add(`${compact.slice(0, index)}${compact[index + 1]}${compact[index]}${compact.slice(index + 2)}`)
  }
  variants.delete(compact)
  return [...variants]
}

function expandSearchTerms(terms) {
  const normalized = uniqueTerms(terms)
  return uniqueTerms([
    ...normalized,
    ...normalized.map(compactSearchTerm),
    ...normalized.map((term) => term.replace(/\s+/g, '_')),
    ...normalized.flatMap((term) => normalizeSearchTerm(term).split(' ')),
    ...normalized.flatMap(oneEditVariants),
  ])
}

function levenshtein(a, b) {
  const left = compactSearchTerm(a)
  const right = compactSearchTerm(b)
  if (!left || !right) return Number.POSITIVE_INFINITY
  if (left === right) return 0
  if (Math.abs(left.length - right.length) > 2) return Number.POSITIVE_INFINITY

  const previous = Array.from({ length: right.length + 1 }, (_, index) => index)
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex]
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const cost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1
      current[rightIndex] = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + cost,
      )
    }
    previous.splice(0, previous.length, ...current)
  }
  return previous[right.length]
}

function scoreTerms(query, terms, exactScore, startsScore, includesScore, fuzzyScore = 0) {
  const normalizedQuery = normalizeSearchTerm(query)
  const compactQuery = compactSearchTerm(query)
  if (!normalizedQuery) return 0

  return terms.reduce((best, term) => {
    const normalizedTerm = normalizeSearchTerm(term)
    const compactTerm = compactSearchTerm(term)
    if (!normalizedTerm) return best
    if (normalizedTerm === normalizedQuery || compactTerm === compactQuery) return Math.max(best, exactScore)
    if (normalizedTerm.startsWith(normalizedQuery) || compactTerm.startsWith(compactQuery)) return Math.max(best, startsScore)
    if (normalizedTerm.includes(normalizedQuery) || compactTerm.includes(compactQuery)) return Math.max(best, includesScore)

    if (fuzzyScore > 0) {
      const distance = levenshtein(normalizedQuery, normalizedTerm)
      if (distance === 1) return Math.max(best, fuzzyScore)
      if (distance === 2 && compactQuery.length >= 6) return Math.max(best, Math.max(1, fuzzyScore - 120))
    }

    return best
  }, 0)
}

export function getComponentSearchKeywords(component) {
  return COMPONENT_SEARCH_KEYWORDS[component.id] ?? []
}

export function getComponentSearchText(component) {
  const terms = [
    component.id,
    component.title,
    component.body,
    component.categoryTitle,
    component.categoryId,
    ...(component.packages ?? []),
    ...getComponentSearchKeywords(component),
  ]
  return expandSearchTerms(terms).join(' ')
}

export function scoreComponentSearch(component, query) {
  const normalizedQuery = normalizeSearchTerm(query)
  if (!normalizedQuery) return 0

  const titleTerms = [component.title, component.id]
  const keywordTerms = getComponentSearchKeywords(component)
  const contextTerms = [component.body, component.categoryTitle, component.categoryId, ...(component.packages ?? [])]

  return Math.max(
    scoreTerms(normalizedQuery, titleTerms, 1000, 900, 820, 780),
    scoreTerms(normalizedQuery, keywordTerms, 680, 620, 540, 460),
    scoreTerms(normalizedQuery, contextTerms, 420, 360, 300, 0),
  )
}

export function rankComponentsForSearch(components, query) {
  const normalizedQuery = normalizeSearchTerm(query)
  if (!normalizedQuery) return components
  return components
    .map((component, index) => ({ component, index, score: scoreComponentSearch(component, normalizedQuery) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((entry) => entry.component)
}

export const componentCategoryPageIds = componentCategories.map((category) => `components-${category.id}`)
export const componentPageIds = componentCategories.flatMap((category) =>
  category.components.map((component) => `component-${component.id}`)
)

export const componentPageTitles = {
  components: 'Components',
  ...Object.fromEntries(componentCategories.map((category) => [`components-${category.id}`, category.title])),
  ...Object.fromEntries(componentCategories.flatMap((category) =>
    category.components.map((component) => [`component-${component.id}`, component.title])
  )),
}

export const allComponents = componentCategories.flatMap((category) =>
  category.components.map((component) => {
    const enriched = {
      ...component,
      categoryId: category.id,
      categoryTitle: category.title,
      categoryIcon: category.icon,
      updated: COMPONENT_LAST_UPDATED[component.id] ?? LAST_UPDATED,
      packages: PACKAGE_COVERAGE[component.id] ?? ['React'],
    }
    return {
      ...enriched,
      searchKeywords: getComponentSearchKeywords(enriched),
      searchText: getComponentSearchText(enriched),
    }
  })
)

const COMPONENT_ROUTE_SLUGS = {
  'action-tile': 'action-tiles',
  overlay: 'overlay-component',
}

const COMPONENT_IDS_BY_ROUTE_SLUG = Object.fromEntries(
  Object.entries(COMPONENT_ROUTE_SLUGS).map(([id, slug]) => [slug, id]),
)

export function componentRouteSlug(componentId) {
  return COMPONENT_ROUTE_SLUGS[componentId] ?? componentId
}

export function componentIdFromRouteSlug(slug) {
  return COMPONENT_IDS_BY_ROUTE_SLUG[slug] ?? slug
}

export function getComponentPath(id) {
  if (id === 'components') return '/components'
  if (id.startsWith('components-')) return `/components/${id.slice('components-'.length)}`
  if (id.startsWith('component-')) return `/components/${componentRouteSlug(id.slice('component-'.length))}`
  return `/${id}`
}

export function getComponentExampleSlug(example) {
  return example?.slug ?? example?.id
}

export function getComponentExamplePath(componentId, exampleId) {
  const resolvedComponentId = componentIdFromRouteSlug(componentId)
  const example = (componentExamples[resolvedComponentId] ?? []).find((item) => item.id === exampleId)
  if (!example) return getComponentPath(`component-${resolvedComponentId}`)
  return `/components/${componentRouteSlug(resolvedComponentId)}/${getComponentExampleSlug(example)}`
}

export function getComponentExampleBySlug(componentId, slug) {
  const resolvedComponentId = componentIdFromRouteSlug(componentId)
  return (componentExamples[resolvedComponentId] ?? []).find((example) => getComponentExampleSlug(example) === slug) ?? null
}

export function getRelatedComponents(component) {
  return (COMPONENT_RELATED[component.id] ?? [])
    .map((id) => allComponents.find((item) => item.id === id))
    .filter(Boolean)
}

export function getComponentEntry(activePage) {
  for (const category of componentCategories) {
    if (activePage === `components-${category.id}`) return { category }
    const component = category.components.find((item) => activePage === `component-${item.id}`)
    if (component) return { category, component: { ...component, categoryId: category.id, categoryTitle: category.title, categoryIcon: category.icon } }
  }
  return {}
}

export function navigateCard(event, onNavigate, page) {
  event.preventDefault()
  onNavigate?.(page)
}

export function navigateBreadcrumb(event, onNavigate, page) {
  if (!onNavigate) return
  event.preventDefault()
  onNavigate(page)
}

export function getBreadcrumbItems({ category, component }, onNavigate) {
  const homeItem = {
    href: '/',
    label: 'Home',
    onClick: (event) => navigateBreadcrumb(event, onNavigate, 'home'),
  }

  const componentsItem = component || category
    ? {
        href: getComponentPath('components'),
        label: 'Components',
        onClick: (event) => navigateBreadcrumb(event, onNavigate, 'components'),
      }
    : { label: 'Components' }

  if (component) {
    return [
      homeItem,
      componentsItem,
      {
        href: getComponentPath(`components-${category.id}`),
        label: category.title,
        onClick: (event) => navigateBreadcrumb(event, onNavigate, `components-${category.id}`),
      },
      { label: component.title },
    ]
  }

  if (category) return [homeItem, componentsItem, { label: category.title }]

  return [homeItem, componentsItem]
}

function titleToRuleName(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function parseRuleSource({ file, raw }) {
  const rules = []
  let current = null

  for (const rawLine of raw.split('\n')) {
    const line = rawLine.trim()
    if (line.startsWith('- id:')) {
      if (current) rules.push(current)
      current = { id: line.slice(5).trim(), file }
      continue
    }
    if (!current) continue

    for (const key of ['component', 'requirement', 'title', 'description', 'do', 'dont']) {
      if (line.startsWith(`${key}:`)) {
        const value = line.slice(key.length + 1).trim()
        if (value && value !== '>' && value !== '|') current[key] = value.replace(/^['"]|['"]$/g, '')
      }
    }
  }

  if (current) rules.push(current)
  return rules
}

const parsedRules = ruleSourceFiles.flatMap(parseRuleSource)

export function getRulesForComponent(component) {
  const ruleName = titleToRuleName(component.title)
  const compactTitle = component.title.toLowerCase().replace(/\s+/g, '')

  return parsedRules.filter((rule) => {
    const haystack = `${rule.id} ${rule.component ?? ''} ${rule.requirement ?? ''} ${rule.title ?? ''}`.toLowerCase()
    return haystack.includes(ruleName) || haystack.includes(compactTitle)
  })
}
