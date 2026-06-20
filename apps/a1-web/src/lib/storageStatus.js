import { loadProjects } from '../projects/projectStore'
import { getAllPatterns, isUserPattern } from '../patterns/patternStore'
import { listThemes } from './themeStore'
import { listImages } from './imageLibrary'
import { getBackend, activeBackendKind } from './imageStore'

// Where each kind of editor data actually lives, so the Account dialog can show a
// source tag per category. Projects sync as the exportAllText() blob; images use
// a pluggable backend; patterns and themes are still local-only (raw localStorage,
// not part of the cloud blob).

const IMAGE_DETAIL = {
  supabase: 'Supabase Storage',
  netlify: 'Netlify Blobs',
  idb: 'This browser (IndexedDB)',
}

/** Gather the storage location + live count for each data category. `signedIn`
 *  decides whether projects count as cloud-synced or local-only. */
export async function getStorageStatus(signedIn) {
  const projects = loadProjects().length
  const patterns = getAllPatterns().filter((p) => isUserPattern(p.pattern.id)).length
  const themes = listThemes().length

  let images = 0
  try { images = (await listImages()).length } catch { /* backend unavailable */ }
  await getBackend() // ensure the backend is resolved so the kind is accurate
  const imageKind = activeBackendKind() ?? 'idb'

  return [
    {
      key: 'projects',
      label: 'Projects & pages',
      count: projects,
      location: signedIn ? 'cloud' : 'local',
      detail: signedIn ? 'Synced to your account' : 'This browser only — sign in to sync',
    },
    {
      key: 'images',
      label: 'Images',
      count: images,
      location: imageKind === 'idb' ? 'local' : 'cloud',
      detail: IMAGE_DETAIL[imageKind] ?? IMAGE_DETAIL.idb,
    },
    {
      key: 'patterns',
      label: 'Patterns',
      count: patterns,
      location: signedIn ? 'cloud' : 'local',
      detail: signedIn ? 'Synced to your account' : 'This browser only — sign in to sync',
    },
    {
      key: 'themes',
      label: 'Themes',
      count: themes,
      location: signedIn ? 'cloud' : 'local',
      detail: signedIn ? 'Synced to your account' : 'This browser only — sign in to sync',
    },
  ]
}
