import React from 'react'
import tokens from '../../../../system/tokens/component/page-construction.json'
import { LoadingPreviewExperiment } from '../loading-preview/LoadingPreviewExperiment.jsx'
import { SamplePage } from '../loading-preview/SamplePage.jsx'
import { PageConstruction } from './PageConstruction.jsx'

// Labs page: the shared loading preview (viewport, speed, finish/pause/replay)
// with a tower crane building the sample page.

const timing = tokens.component.pageConstruction
const ms = key => Number.parseFloat(timing[key].$value)
const OPTIONS = [
  { value: ms('stepSlow'), label: 'Relaxed' },
  { value: ms('stepDuration'), label: 'Normal' },
  { value: ms('stepFast'), label: 'Quick' },
]
const label = value => OPTIONS.find(option => option.value === value)?.label ?? ''

export function PageConstructionExperiment(props) {
  return (
    <LoadingPreviewExperiment
      {...props}
      speed={{ label: 'Crane speed', options: OPTIONS, defaultValue: ms('stepDuration'), format: value => `${label(value)}, ${value / 1000} seconds per block` }}
      status={{ loading: 'Loading page. A crane is building the layout.', paused: 'Loading paused.', ready: 'Page ready. Loading complete.' }}
    >
      {({ loading, paused, speed, run }) => (
        <PageConstruction key={run} loading={loading} paused={paused} stepDuration={speed} blockSelector="[data-loading-block]">
          <SamplePage />
        </PageConstruction>
      )}
    </LoadingPreviewExperiment>
  )
}
