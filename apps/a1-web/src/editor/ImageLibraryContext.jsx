import { createContext, useContext, useEffect, useState } from 'react'
import { ensureLoaded, subscribeLibrary } from '../lib/imageLibrary.ts'

/**
 * Hydrates the image-library object-URL cache once and exposes a `version` that
 * bumps whenever the library loads or changes. Components that render library
 * images (the renderer's Figure path, the Figure configurator) read the version
 * so they re-render and pick up resolved `object:` URLs after async hydration.
 *
 * Resolution itself is the synchronous `resolveSrc` from `lib/imageLibrary` — the
 * version is only a re-render signal. Used without the provider (e.g. the
 * standalone component detail pages), the version stays 0, which is fine because
 * those surfaces never hold library refs.
 */
const ImageLibraryContext = createContext(0)

export function ImageLibraryProvider({ children }) {
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let active = true
    ensureLoaded().then(() => { if (active) setVersion((v) => v + 1) })
    const unsub = subscribeLibrary(() => { if (active) setVersion((v) => v + 1) })
    return () => { active = false; unsub() }
  }, [])

  return <ImageLibraryContext.Provider value={version}>{children}</ImageLibraryContext.Provider>
}

/** Re-render signal for components that resolve library image refs. */
export function useImageLibraryVersion() {
  return useContext(ImageLibraryContext)
}
