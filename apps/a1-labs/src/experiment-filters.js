import { experimentCategories, experimentTypes, matchesExperiment } from './experiments.js'
export const categoryLabel = id => experimentCategories.find(item => item.id === id)?.label ?? id
export const typeLabel = id => experimentTypes.find(item => item.id === id)?.label ?? id
export const experimentSorts = [
  { value: 'az', label: 'Name, A–Z' }, { value: 'za', label: 'Name, Z–A' },
  { value: 'oldest', label: 'Oldest first' }, { value: 'newest', label: 'Newest first' },
]
export function readExperimentFilters(search = '') {
  const params = new URLSearchParams(search)
  return { query: params.get('q') ?? '', sort: experimentSorts.some(item => item.value === params.get('sort')) ? params.get('sort') : 'newest' }
}
function releaseOrder(a, b) {
  const left = a.addedIn.split('.').map(Number), right = b.addedIn.split('.').map(Number)
  return left[0] - right[0] || left[1] - right[1] || left[2] - right[2]
}
const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true })
export function filterExperiments(items, { query = '', sort = 'newest' } = {}) {
  const selected = items.filter(item => matchesExperiment(item, query))
  return selected.sort((a, b) => {
    const age = releaseOrder(a, b) || items.indexOf(a) - items.indexOf(b)
    if (sort === 'az' || sort === 'za') return collator.compare(a.title, b.title) * (sort === 'za' ? -1 : 1) || age
    return age * (sort === 'oldest' ? 1 : -1)
  })
}
