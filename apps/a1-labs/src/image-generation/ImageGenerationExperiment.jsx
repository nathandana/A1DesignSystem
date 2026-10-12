import React, { useState } from 'react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { ImageGeneration } from './ImageGeneration.jsx'
import { Configuration } from './Configuration.jsx'
import generationTokens from '../../../../system/tokens/component/image-generation.json'

export function ImageGenerationExperiment({ experiment, onOpenSettings }) {
  const [ratio, setRatio] = useState('4 / 3')
  const [animationStyle, setAnimationStyle] = useState('discs')
  const [borderRadius, setBorderRadius] = useState('')
  const [borderWidth, setBorderWidth] = useState('')
  const [duration, setDuration] = useState(() => Number.parseFloat(generationTokens.component.imageGeneration.duration.$value))
  const [runId, setRunId] = useState(0)
  const [paused, setPaused] = useState(false)
  const [phase, setPhase] = useState('loading')
  function replay() { setPaused(false); setRunId(value => value + 1) }
  const configuration = <Configuration
    ratio={ratio} setRatio={setRatio} duration={duration}
    animationStyle={animationStyle} setAnimationStyle={setAnimationStyle}
    borderRadius={borderRadius} setBorderRadius={setBorderRadius}
    borderWidth={borderWidth} setBorderWidth={setBorderWidth}
    setDuration={value => { setDuration(value); replay() }}
    paused={paused} setPaused={setPaused} phase={phase} replay={replay}
  />
  return (
    <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
      <ImageGeneration ratio={ratio} duration={duration} runId={runId} paused={paused} onPhaseChange={setPhase}
        borderRadius={borderRadius} borderWidth={borderWidth} animationStyle={animationStyle} />
    </ExperimentLayout>
  )
}
