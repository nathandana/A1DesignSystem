import { lazy, Suspense } from 'react'
import { SystemMapFoundationPage } from './SystemMapFoundation.jsx'
import { ColorFoundationPage } from './ColorFoundation.jsx'
import { SizeFoundationPage } from './SizeFoundation.jsx'
import { TypeScaleFoundationPage } from './TypeScaleFoundation.jsx'
import { ShapeFoundationPage } from './ShapeFoundation.jsx'
import { MotionFoundationPage } from './MotionFoundation.jsx'
import { ElevationFoundationPage } from './ElevationFoundation.jsx'
import { IconographyFoundationPage } from './IconographyFoundation.jsx'
import { AccessibilityFoundationPage } from './AccessibilityFoundation.jsx'
import { LabelsFoundationPage } from './LabelsFoundation.jsx'
import { BreakpointsFoundationPage } from './BreakpointsFoundation.jsx'
import { PropConventionsFoundationPage } from './PropConventionsFoundation.jsx'
import { ZIndexFoundationPage } from './ZIndexFoundation.jsx'
import { UtilitiesFoundationPage } from './UtilitiesFoundation.jsx'
import { FigmaPluginFoundationPage } from './FigmaPluginFoundation.jsx'
import { FigmaComponentsFoundationPage } from './FigmaComponentsFoundation.jsx'
import { ContentStandardsFoundationPage } from './ContentStandardsFoundation.jsx'

const ColorVisualizationFoundationPage = lazy(() => (
  import('./ColorVisualizationFoundation.jsx').then((module) => ({
    default: module.ColorVisualizationFoundationPage,
  }))
))

export function FoundationDetail({ foundation, onNavigate, theme, colorMode }) {
  switch (foundation?.id) {
    case 'foundation-system-map':
      return <SystemMapFoundationPage onNavigate={onNavigate} />
    case 'foundation-figma-plugin':
      return <FigmaPluginFoundationPage onNavigate={onNavigate} />
    case 'foundation-figma-components':
      return <FigmaComponentsFoundationPage onNavigate={onNavigate} />
    case 'foundation-color-visualization':
      return (
        <Suspense fallback={null}>
          <ColorVisualizationFoundationPage
            onNavigate={onNavigate}
            theme={theme}
            colorMode={colorMode}
          />
        </Suspense>
      )
    case 'foundation-color':
      return (
        <ColorFoundationPage
          onNavigate={onNavigate}
          theme={theme}
          colorMode={colorMode}
        />
      )
    case 'foundation-size':
      return <SizeFoundationPage onNavigate={onNavigate} />
    case 'foundation-type-scale':
      return <TypeScaleFoundationPage onNavigate={onNavigate} />
    case 'foundation-shape':
      return <ShapeFoundationPage onNavigate={onNavigate} />
    case 'foundation-motion':
      return <MotionFoundationPage onNavigate={onNavigate} />
    case 'foundation-elevation':
      return <ElevationFoundationPage onNavigate={onNavigate} />
    case 'foundation-iconography':
      return <IconographyFoundationPage onNavigate={onNavigate} />
    case 'foundation-accessibility':
      return <AccessibilityFoundationPage onNavigate={onNavigate} />
    case 'foundation-labels':
      return <LabelsFoundationPage onNavigate={onNavigate} />
    case 'foundation-content-standards':
      return <ContentStandardsFoundationPage onNavigate={onNavigate} />
    case 'foundation-responsive':
      return <BreakpointsFoundationPage onNavigate={onNavigate} />
    case 'foundation-prop-conventions':
      return <PropConventionsFoundationPage onNavigate={onNavigate} />
    case 'foundation-z-index':
      return <ZIndexFoundationPage onNavigate={onNavigate} />
    case 'foundation-utilities':
      return <UtilitiesFoundationPage onNavigate={onNavigate} />
    default:
      return null
  }
}
