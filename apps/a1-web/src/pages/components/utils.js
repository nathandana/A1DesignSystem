import {
  COMPONENT_RELATED,
  PACKAGE_COVERAGE,
  LAST_UPDATED,
  componentCategories,
  ruleSourceFiles,
} from './data.js'

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
  category.components.map((component) => ({
    ...component,
    categoryId: category.id,
    categoryTitle: category.title,
    categoryIcon: category.icon,
    updated: LAST_UPDATED,
    packages: PACKAGE_COVERAGE[component.id] ?? ['React'],
  }))
)

export function getComponentPath(id) {
  if (id === 'components') return '/components'
  if (id.startsWith('components-')) return `/components/${id.slice('components-'.length)}`
  if (id.startsWith('component-')) return `/components/${id.slice('component-'.length)}`
  return `/${id}`
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
