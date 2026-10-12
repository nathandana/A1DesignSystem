import React from 'react'
import { Inset } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
// The a1-web Foundations color visualization, as is: one source of truth. Its
// stylesheet sits beside it in a1-web, and it reads live theme values.
import { useColorVisualization } from '../../../a1-web/src/pages/foundations/ColorVisualizationFoundation.jsx'

export function TokenVisualizerExperiment({ experiment, onOpenSettings }) {
  const { controls, content } = useColorVisualization()
  return (
    <ExperimentLayout
      experiment={experiment}
      onOpenSettings={onOpenSettings}
      configuration={<Inset space={16}>{controls}</Inset>}
    >
      {content}
    </ExperimentLayout>
  )
}
