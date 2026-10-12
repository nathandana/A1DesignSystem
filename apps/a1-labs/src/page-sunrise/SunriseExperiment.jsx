import React from 'react'
import tokens from '../../../../system/tokens/component/page-sunrise.json'
import { LoadingPreviewExperiment } from '../loading-preview/LoadingPreviewExperiment.jsx'
import { SamplePage } from '../loading-preview/SamplePage.jsx'
import { SunriseLoader } from './SunriseLoader.jsx'

// Labs page: the shared loading preview (viewport, speed, finish/pause/replay)
// with the SunriseLoader around the sample page.

const timing = tokens.component.pageSunrise
const ms = key => Number.parseFloat(timing[key].$value)
const OPTIONS = [
  { value: ms('expectedSlow'), label: 'Relaxed' },
  { value: ms('expectedDuration'), label: 'Normal' },
  { value: ms('expectedFast'), label: 'Quick' },
]
const label = value => OPTIONS.find(option => option.value === value)?.label ?? ''

export function SunriseExperiment(props) {
  return (
    <LoadingPreviewExperiment
      {...props}
      speed={{ label: 'Typical load', options: OPTIONS, defaultValue: ms('expectedDuration'), format: value => `${label(value)}, the sun slows after ${value / 1000} seconds` }}
      status={{ loading: 'Loading page. The sun is rising.', paused: 'Loading paused.', ready: 'Page ready. Loading complete.' }}
    >
      {({ loading, paused, speed, run }) => (
        <SunriseLoader key={run} loading={loading} paused={paused} expectedDuration={speed}>
          <SamplePage />
        </SunriseLoader>
      )}
    </LoadingPreviewExperiment>
  )
}
