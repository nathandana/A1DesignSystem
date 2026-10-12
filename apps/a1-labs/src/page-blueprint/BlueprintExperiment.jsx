import React from 'react'
import tokens from '../../../../system/tokens/component/page-blueprint.json'
import { LoadingPreviewExperiment } from '../loading-preview/LoadingPreviewExperiment.jsx'
import { SamplePage } from '../loading-preview/SamplePage.jsx'
import { BlueprintLoader } from './BlueprintLoader.jsx'

// Labs page: the shared loading preview (viewport, speed, finish/pause/replay)
// with the BlueprintLoader around the sample page.

const timing = tokens.component.pageBlueprint
const ms = key => Number.parseFloat(timing[key].$value)
const OPTIONS = [
  { value: ms('stepSlow'), label: 'Relaxed' },
  { value: ms('stepDuration'), label: 'Normal' },
  { value: ms('stepFast'), label: 'Quick' },
]
const label = value => OPTIONS.find(option => option.value === value)?.label ?? ''

export function BlueprintExperiment(props) {
  return (
    <LoadingPreviewExperiment
      {...props}
      speed={{ label: 'Drafting speed', options: OPTIONS, defaultValue: ms('stepDuration'), format: value => `${label(value)}, ${value / 1000} seconds per block` }}
      status={{ loading: 'Loading page. Drafting the layout.', paused: 'Loading paused.', ready: 'Page ready. Loading complete.' }}
    >
      {({ loading, paused, speed, run }) => (
        <BlueprintLoader key={run} loading={loading} paused={paused} stepDuration={speed}>
          <SamplePage />
        </BlueprintLoader>
      )}
    </LoadingPreviewExperiment>
  )
}
