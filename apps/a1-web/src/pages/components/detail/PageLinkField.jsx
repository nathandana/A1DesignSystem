import { SelectField, Stack, TextField } from '@gtivr4/a1-design-system-react'

/**
 * PageLinkField — link target control shared by the Button and Link
 * configurators.
 *
 * - In the editor (when `pages` are supplied), it renders a Select of every
 *   available page plus a custom-URL fallback, so connections between screens
 *   can be made by picking a page.
 * - On the standalone component detail pages (no `pages`), it degrades to a
 *   plain "Link URL" text field.
 *
 * Page links are stored as `/?page={id}` so the standalone prototype's click
 * interceptor can resolve them.
 */

const PAGE_PREFIX = '/?page='

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

  const matchedPage = pages.find((page) => value === `${PAGE_PREFIX}${page.id}`)

  return (
    <Stack gap="sm">
      <SelectField
        label="Link to page"
        size="compact"
        value={matchedPage ? matchedPage.id : ''}
        onChange={(event) => {
          const next = event.target.value
          onChange(next === '' ? '' : `${PAGE_PREFIX}${next}`)
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
