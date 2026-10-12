import { createContext, useCallback, useContext, useEffect } from 'react'

// Sitewide search, matching a1-web: "/" or Cmd/Ctrl+K opens the search overlay
// from anywhere except text entry, menus and other dialogs.
export const LabsSearchContext = createContext({ openSearch: () => {}, handleShortcut: () => {} })

export const useLabsSearch = () => useContext(LabsSearchContext)

export function useSearchShortcut(openSearch, enabled = true) {
  const handleShortcut = useCallback(event => {
    if (!enabled || event.defaultPrevented || event.repeat || event.isComposing || event.nativeEvent?.isComposing) return
    const slash = event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey
    const command = (event.metaKey || event.ctrlKey) && !event.altKey && event.key?.toLowerCase() === 'k'
    if (!slash && !command) return
    const target = event.target
    if (target?.isContentEditable || target?.closest?.('input, textarea, select, [role="textbox"], [role="combobox"], [role="menu"], [role="dialog"], dialog, [inert]')) return
    if ([...document.querySelectorAll('[aria-modal="true"], dialog[open]')].some(dialog => dialog.getClientRects().length)) return
    event.preventDefault()
    openSearch()
  }, [enabled, openSearch])
  useEffect(() => {
    document.addEventListener('keydown', handleShortcut)
    return () => document.removeEventListener('keydown', handleShortcut)
  }, [handleShortcut])
  // Pages also attach handleShortcut as a React onKeyDown: React events bubble
  // out of preview iframe portals, while native iframe events do not.
  return handleShortcut
}
