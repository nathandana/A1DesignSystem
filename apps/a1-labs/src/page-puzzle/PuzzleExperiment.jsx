import React from 'react'
import tokens from '../../../../system/tokens/component/page-puzzle.json'
import { LoadingPreviewExperiment } from '../loading-preview/LoadingPreviewExperiment.jsx'
import { SamplePage } from '../loading-preview/SamplePage.jsx'
import { PuzzleLoader } from './PuzzleLoader.jsx'

// Labs page: the shared loading preview (viewport, speed, finish/pause/replay)
// with the PuzzleLoader around the sample page.

const timing = tokens.component.pagePuzzle
const ms = key => Number.parseFloat(timing[key].$value)
const OPTIONS = [
  { value: ms('buildSlow'), label: 'Relaxed' },
  { value: ms('buildDuration'), label: 'Normal' },
  { value: ms('buildFast'), label: 'Quick' },
]
const label = value => OPTIONS.find(option => option.value === value)?.label ?? ''

export function PuzzleExperiment(props) {
  return (
    <LoadingPreviewExperiment
      {...props}
      speed={{ label: 'Assembly time', options: OPTIONS, defaultValue: ms('buildDuration'), format: value => `${label(value)}, ${value / 1000} seconds for every piece` }}
      status={{ loading: 'Loading page. Assembling the layout.', paused: 'Loading paused.', ready: 'Page ready. Loading complete.' }}
    >
      {({ loading, paused, speed, run }) => (
        <PuzzleLoader key={run} loading={loading} paused={paused} buildDuration={speed}>
          <SamplePage />
        </PuzzleLoader>
      )}
    </LoadingPreviewExperiment>
  )
}
