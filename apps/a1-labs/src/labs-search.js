import { experimentCategories, experimentTypes, experiments } from './experiments.js'

// Entries for the sitewide search overlay (a1-web's GlobalSearchDialog).
// Hidden experiments stay out, as in the gallery and sidebar.
const label = (list, id) => list.find(item => item.id === id)?.label ?? id

export const labsSearchEntries = [
  ...experiments.map(item => ({
    id: item.id,
    title: item.title,
    category: label(experimentCategories, item.category),
    description: item.description,
    keywords: [...item.types.map(id => label(experimentTypes, id)), ...(item.tags ?? [])],
    href: item.href,
  })),
  {
    id: 'page-home',
    title: 'All experiments',
    category: 'Pages',
    description: 'Browse, search and sort every Labs experiment.',
    keywords: ['home', 'gallery', 'browse'],
    href: '/',
  },
  {
    id: 'page-about',
    title: 'About Labs',
    category: 'Pages',
    description: 'What Labs is, how it relates to A1 and its release history.',
    keywords: ['release notes', 'changelog', 'version', 'history'],
    href: '/about',
  },
]
