import { useEffect } from 'react'
import {
  clearCustomIconFont,
  registerCustomIconFont,
} from '@gtivr4/a1-design-system-react'
import { buildCustomIconFont } from '../lib/customIconFont.ts'
import {
  customIconMatchesProject,
  listCustomIcons,
  subscribeCustomIconStore,
} from '../lib/customIconStore.ts'

export function CustomIconFontProvider({ projectId, includeAll = false, children }) {
  useEffect(() => {
    let currentUrl = ''
    let cancelled = false

    async function rebuild() {
      const icons = await listCustomIcons()
      if (cancelled) return
      const scoped = includeAll ? icons : icons.filter((icon) => customIconMatchesProject(icon, projectId))
      if (currentUrl) URL.revokeObjectURL(currentUrl)
      currentUrl = ''
      if (!scoped.length) {
        clearCustomIconFont()
        return
      }
      const build = buildCustomIconFont(scoped)
      currentUrl = URL.createObjectURL(new Blob([build.buffer], { type: 'font/ttf' }))
      registerCustomIconFont({
        fontUrl: currentUrl,
        mappings: build.mappings,
        fontFamily: build.fontFamily,
      })
    }

    rebuild().catch((error) => {
      console.error('[custom icons] Could not build the active icon font.', error)
      clearCustomIconFont()
    })
    const unsubscribe = subscribeCustomIconStore(() => {
      rebuild().catch((error) => console.error('[custom icons] Could not rebuild the icon font.', error))
    })
    return () => {
      cancelled = true
      unsubscribe()
      if (currentUrl) URL.revokeObjectURL(currentUrl)
    }
  }, [includeAll, projectId])

  return children
}

