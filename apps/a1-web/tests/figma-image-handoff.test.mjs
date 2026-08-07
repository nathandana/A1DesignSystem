import assert from 'node:assert/strict'
import test from 'node:test'
import {
  FIGMA_BRIDGE_MAX_IMAGE_BYTES,
  FIGMA_BRIDGE_MAX_IMAGE_COUNT,
  buildFigmaFigureAssets,
  figureImageRefs,
} from '../src/lib/figmaImageHandoff.js'

const exampleFigure = {
  type: 'Figure',
  props: {
    src: 'a1img://img_msas4e319gypyu',
    alt: 'Mountain lake landscape',
    radius: 'md',
    size: '2xs',
    captionSrOnly: true,
  },
}

test('finds unique A1 image refs only on Figure nodes', () => {
  const refs = figureImageRefs({
    page: {
      regions: [
        { nodes: [exampleFigure, exampleFigure] },
        { nodes: [{ type: 'Image', props: { src: 'a1img://ignored' } }] },
      ],
    },
  })

  assert.deepEqual([...refs], ['a1img://img_msas4e319gypyu'])
})

test('builds a volatile Figma image sidecar for the example Figure', async () => {
  const requestedIds = []
  const assets = await buildFigmaFigureAssets(JSON.stringify(exampleFigure), {
    getImage: async (id) => {
      requestedIds.push(id)
      return {
        meta: { id, name: 'Mountain lake landscape' },
        blob: new Blob(['mountain-lake'], { type: 'image/png' }),
      }
    },
    encodeBlob: async (blob) => Buffer.from(await blob.arrayBuffer()).toString('base64'),
  })

  assert.deepEqual(requestedIds, ['img_msas4e319gypyu'])
  assert.deepEqual(assets, [{
    id: 'img_msas4e319gypyu',
    name: 'Mountain lake landscape',
    type: 'image/png',
    dataBase64: Buffer.from('mountain-lake').toString('base64'),
  }])
})

test('rejects missing, unsupported and oversized Figure image sidecars', async () => {
  await assert.rejects(
    buildFigmaFigureAssets(exampleFigure, {
      getImage: async () => null,
      encodeBlob: async () => '',
    }),
    /img_msas4e319gypyu.*unavailable/,
  )

  await assert.rejects(
    buildFigmaFigureAssets(exampleFigure, {
      getImage: async (id) => ({
        meta: { id, name: 'Mountain lake' },
        blob: new Blob(['svg'], { type: 'image/svg+xml' }),
      }),
      encodeBlob: async () => '',
    }),
    /use PNG, JPEG, or GIF/,
  )

  await assert.rejects(
    buildFigmaFigureAssets(exampleFigure, {
      getImage: async (id) => ({
        meta: { id, name: 'Mountain lake' },
        blob: new Blob([new Uint8Array(FIGMA_BRIDGE_MAX_IMAGE_BYTES + 1)], { type: 'image/png' }),
      }),
      encodeBlob: async () => '',
    }),
    /total 4 MB or less/,
  )
})

test('limits the number of local Figure images in one Figma handoff', async () => {
  const figures = Array.from({ length: FIGMA_BRIDGE_MAX_IMAGE_COUNT + 1 }, (_, index) => ({
    type: 'Figure',
    props: { src: `a1img://img_${index}` },
  }))

  await assert.rejects(
    buildFigmaFigureAssets(figures, {
      getImage: async () => null,
      encodeBlob: async () => '',
    }),
    /support up to 8 local Figure images/,
  )
})
