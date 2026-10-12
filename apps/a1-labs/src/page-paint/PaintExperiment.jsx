import React from 'react'
import tokens from '../../../../system/tokens/component/page-paint.json'
import { LoadingPreviewExperiment } from '../loading-preview/LoadingPreviewExperiment.jsx'
import { SamplePage } from '../loading-preview/SamplePage.jsx'
import { PaintLoader } from './PaintLoader.jsx'

// Labs page: the shared loading preview (viewport, speed, finish/pause/replay)
// with the PaintLoader around the sample page.

const timing = tokens.component.pagePaint
const ms = key => Number.parseFloat(timing[key].$value)
const OPTIONS = [
  { value: ms('coatSlow'), label: 'Relaxed' },
  { value: ms('coatDuration'), label: 'Normal' },
  { value: ms('coatFast'), label: 'Quick' },
]
const label = value => OPTIONS.find(option => option.value === value)?.label ?? ''

export function PaintExperiment(props) {
  return (
    <LoadingPreviewExperiment
      {...props}
      speed={{ label: 'Roller speed', options: OPTIONS, defaultValue: ms('coatDuration'), format: value => `${label(value)}, ${value / 1000} seconds per coat` }}
      status={{ loading: 'Loading page. Painting the layout.', paused: 'Loading paused.', ready: 'Page ready. Loading complete.' }}
    >
      {({ loading, paused, speed, run }) => (
        <PaintLoader key={run} loading={loading} paused={paused} coatDuration={speed}>
          <SamplePage />
        </PaintLoader>
      )}
    </LoadingPreviewExperiment>
  )
}
