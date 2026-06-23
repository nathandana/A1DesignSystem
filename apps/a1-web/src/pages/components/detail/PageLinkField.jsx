import { SelectField, Stack, TextField } from '@gtivr4/a1-design-system-react'
import { resolvePageJson } from '../../../projects/projectStore'

/**
 * PageLinkField — link target control shared by the Button, Link, IconButton, and
 * Card configurators.
 *
 * - In the editor (when `pages` are supplied), it renders a Select of every
 *   available page plus a custom-URL fallback, so connections between screens
 *   can be made by picking a page.
 * - On the standalone component detail pages (no `pages`), it degrades to a
 *   plain "Link URL" text field.
 *
 * Page links are stored as `/?page={id}` so the standalone prototype's click
 * interceptor can resolve them. When the target page is a **detail page** (tagged
 * to a dataset, A1-94), the link also carries `&item={{ key.__id }}` so a card
 * repeated over that dataset links each item to its own detail view.
 */

const PAGE_PREFIX = '/?page='

/** The page id encoded in a stored link value (handles a trailing `&item=`). */
function pageIdFromValue(value) {
  const m = typeof value === 'string' ? value.match(/[?&]page=([^&]+)/) : null
  return m ? decodeURIComponent(m[1]) : ''
}

/** The dataset binding key a page shows details for, or null. */
function detailDatasetForPage(pageId) {
  try {
    const json = resolvePageJson(pageId)
    if (!json) return null
    return JSON.parse(json)?.page?.detailDataset || null
  } catch { return null }
}

/** Build the href for a chosen page — detail pages carry the current item's id. */
function hrefForPage(pageId) {
  const dataset = detailDatasetForPage(pageId)
  return dataset
    ? `${PAGE_PREFIX}${pageId}&item={{ ${dataset}.__id }}`
    : `${PAGE_PREFIX}${pageId}`
}

export function PageLinkField({ pages, value = '', onChange }) {
  // No editor pages context → plain URL field (standalone detail page).
  if (!pages?.length) {
    return (
      <TextField
        label="Link URL (optional)"
        size="compact"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    )
  }

  const selectedId = pageIdFromValue(value)
  const matchedPage = pages.find((page) => page.id === selectedId)

  return (
    <Stack gap="sm">
      <SelectField
        label="Link to page"
        size="compact"
        value={matchedPage ? matchedPage.id : ''}
        onChange={(event) => {
          const next = event.target.value
          onChange(next === '' ? '' : hrefForPage(next))
        }}
      >
        <option value="">— No link —</option>
        {pages.map((page) => (
          <option key={page.id} value={page.id}>{page.label}</option>
        ))}
      </SelectField>
      {!matchedPage && (
        <TextField
          label="Or custom URL"
          size="compact"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </Stack>
  )
}
