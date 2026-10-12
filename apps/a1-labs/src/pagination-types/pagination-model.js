export const PAGINATION_TYPES = [
  { value: 'a1', label: 'A1 default', description: 'Numbered pages, first and last destinations, and ellipses. A familiar starting point for browsing a known result set.' },
  { value: 'compact', label: 'Compact', description: 'Previous and Next with an explicit page count. Suits sequential review when jumping to a distant page is uncommon.' },
  { value: 'bookends', label: 'First and last', description: 'Direct boundary shortcuts alongside Previous and Next. Useful for checking the newest and oldest ends of a sorted table.' },
  { value: 'select', label: 'Page selector', description: 'Choose a page and its row range from a native menu. Best with a modest page count; the jump field is faster for hundreds of pages.' },
  { value: 'jump', label: 'Jump to page', description: 'Enter a known page number and confirm with Go or Enter. Efficient for distant pages without a very long list of page buttons.' },
  { value: 'hybrid', label: 'Numbered with jump', description: 'Combine neighboring page links with direct access. Useful when users both browse nearby records and revisit distant pages.' },
]
export function parsePage(value, totalPages) {
  if (!/^\d+$/.test(String(value).trim())) return null
  const page = Number(value)
  return Number.isSafeInteger(page) && page >= 1 && page <= totalPages ? page : null
}
