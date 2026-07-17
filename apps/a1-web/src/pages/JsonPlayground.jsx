import { useState } from 'react'
import {
  Banner,
  Button,
  Canvas,
  Code,
  SideNav,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { RenderPageDefinition } from '../editor/pageRenderer.tsx'
import { isLocalBridgeFeatureEnabled, queueFigmaHandoff } from '../lib/localCodex.ts'
import {
  FIGMA_BRIDGE_IMAGE_TYPES,
  FIGMA_BRIDGE_MAX_IMAGE_BYTES,
  getImageBlob,
  idFromRef,
  isImageRef,
} from '../lib/imageLibrary.ts'

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

/** Format valid inbound JSON once without touching in-progress user edits. */
export function formatPlaygroundJson(json) {
  if (!json?.trim()) return ''
  try {
    return JSON.stringify(JSON.parse(json), null, 2)
  } catch {
    return json
  }
}

/** Normalize the bridge-friendly JSON shapes into the renderer's page format. */
export function parsePlaygroundJson(json) {
  if (!json.trim()) return { definition: null, error: '' }
  try {
    const value = JSON.parse(json)
    if (!isObject(value)) throw new Error('JSON must be an object.')
    if (isObject(value.page) && isObject(value.page.layout) && Array.isArray(value.page.layout.regions)) {
      return { definition: value, error: '' }
    }
    const nodes = typeof value.type === 'string'
      ? [value]
      : Array.isArray(value.nodes)
        ? value.nodes
        : null
    if (!nodes) throw new Error('Provide a component node, a { "nodes": [...] } bundle, or a complete page definition.')
    if (!nodes.every((node) => isObject(node) && typeof node.type === 'string' && typeof node.id === 'string')) {
      throw new Error('Every node needs a string "id" and a registered A1 component "type".')
    }
    return {
      definition: {
        schemaVersion: '1.0.0',
        page: {
          id: 'json-playground',
          name: 'JSON playground',
          layout: { type: 'PageLayout', regions: [{ id: 'main', name: 'Main', nodes }] },
        },
      },
      error: '',
    }
  } catch (error) {
    return { definition: null, error: error instanceof Error ? error.message : 'JSON could not be rendered.' }
  }
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '')
    reader.onerror = () => reject(reader.error || new Error('Could not read the local image.'))
    reader.readAsDataURL(blob)
  })
}

function figureImageRefs(value, refs = new Set()) {
  if (Array.isArray(value)) {
    value.forEach((item) => figureImageRefs(item, refs))
  } else if (isObject(value)) {
    if (value.type === 'Figure' && isImageRef(value.props?.src)) refs.add(value.props.src)
    Object.values(value).forEach((item) => figureImageRefs(item, refs))
  }
  return refs
}

/** Build a volatile sidecar for local Figure refs; it is never written into JSON. */
async function figureHandoffAssets(json) {
  const refs = figureImageRefs(JSON.parse(json))
  const assets = []
  let totalBytes = 0
  for (const ref of refs) {
    const record = await getImageBlob(idFromRef(ref))
    if (!record) throw new Error(`The local Figure image "${idFromRef(ref)}" is unavailable.`)
    if (!FIGMA_BRIDGE_IMAGE_TYPES.has(record.blob.type)) {
      throw new Error(`"${record.meta.name}" is ${record.blob.type || 'an unsupported format'}; use PNG, JPEG, or GIF for Figma.`)
    }
    totalBytes += record.blob.size
    if (totalBytes > FIGMA_BRIDGE_MAX_IMAGE_BYTES) {
      throw new Error('Local Figure images must total 4 MB or less for this local handoff.')
    }
    assets.push({
      id: record.meta.id,
      name: record.meta.name,
      type: record.blob.type,
      dataBase64: await blobToBase64(record.blob),
    })
  }
  return assets
}

export function JsonPlaygroundSidebar({ json, onJsonChange, error, open, onClose }) {
  const [figmaHandoffStatus, setFigmaHandoffStatus] = useState('')
  const [figmaHandoffError, setFigmaHandoffError] = useState('')
  const [sendingToFigma, setSendingToFigma] = useState(false)
  const bridgeFeaturesEnabled = isLocalBridgeFeatureEnabled()

  async function sendToFigma() {
    if (!json.trim() || error || sendingToFigma) return
    setSendingToFigma(true)
    setFigmaHandoffError('')
    setFigmaHandoffStatus('')
    try {
      const assets = await figureHandoffAssets(json)
      await queueFigmaHandoff(json, assets)
      setFigmaHandoffStatus(assets.length
        ? `Queued ${assets.length} local Figure image${assets.length === 1 ? '' : 's'} and JSON for the open A1 Figma plugin.`
        : 'Queued for the open A1 Figma plugin. It will render on the current Figma page.')
    } catch (handoffError) {
      const unavailable = handoffError instanceof Error && handoffError.message === 'Failed to fetch'
      setFigmaHandoffError(unavailable
        ? 'The local bridge is not running. Start it with npm run codex:bridge:a1-web, then try again.'
        : handoffError instanceof Error ? handoffError.message : 'Could not queue the Figma handoff.')
    } finally {
      setSendingToFigma(false)
    }
  }

  return (
    <SideNav header="JSON" collapseButtonPlacement="header" open={open} onClose={onClose}>
      <Stack gap="xs">
        <Code
          variant="block"
          editable
          rows={18}
          lineNumbers
          wrapping
          copyCode
          aria-label="A1 JSON"
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? 'playground-json-error' : undefined}
          onChangeValue={onJsonChange}
        >
          {json}
        </Code>
        {bridgeFeaturesEnabled && (
          <Button
            size="sm"
            icon="open_in_new"
            fullWidth
            loading={sendingToFigma}
            disabled={!json.trim() || Boolean(error)}
            onClick={sendToFigma}
          >
            Send to Figma
          </Button>
        )}
        {error && <Banner id="playground-json-error" status="error" variant="inline">{error}</Banner>}
        {bridgeFeaturesEnabled && figmaHandoffStatus && <Banner status="success" variant="inline">{figmaHandoffStatus}</Banner>}
        {bridgeFeaturesEnabled && figmaHandoffError && <Banner status="error" variant="inline">{figmaHandoffError}</Banner>}
      </Stack>
    </SideNav>
  )
}

export function JsonPlayground({ result }) {
  if (result.definition) return <RenderPageDefinition definition={result.definition} />

  return (
    <Canvas
      aria-label="JSON playground canvas"
      background="page"
      gridType="dots"
      showControls={false}
    />
  )
}
