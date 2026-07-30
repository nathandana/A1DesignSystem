import '../../../build/css/tokens.css'
import '../../../packages/react/src/themes.css'
import '../../../packages/react/src/color-scheme.css'
import '../../../packages/react/src/utilities/spacing.css'
import '../../../packages/react/src/utilities/sr-only.css'
import { createRoot } from 'react-dom/client'
import { LabelsProvider } from '@gtivr4/a1-design-system-react'
import actionLabels from '../../../system/labels/action.json'
import fieldLabels from '../../../system/labels/field.json'
import { App } from './App.jsx'
import './styles.css'

const labels = {
  label: {
    ...actionLabels.label,
    ...fieldLabels.label,
  },
}

createRoot(document.getElementById('root')).render(
  <LabelsProvider locale="en" labels={labels}>
    <App />
  </LabelsProvider>,
)
