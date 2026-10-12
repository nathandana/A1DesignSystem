import React, { useId, useState } from 'react'
import { Inset, Stack, Toolbar, ToolbarGroup } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { ResponsivePreviewFrame, VIEWPORT_PRESETS, viewportSize } from '../../../a1-web/src/pages/components/detail/ResponsivePreviewFrame.jsx'
import { FrostedGlass, GlassPane } from './FrostedGlass.jsx'
import './frosted-glass-demo.css'

// Labs page: a sample page made of frosted glass inside a responsive viewport.
// The reusable core is FrostedGlass/GlassPane; the sample content, backdrop
// artwork and configuration live here.

const devices = { xs: 'Phone', sm: 'Landscape phone', md: 'Tablet', lg: 'Laptop', xl: 'Desktop' }
// Crisp shapes behind the glass, so the frost has edges to soften.
const SHAPES = 6

function SamplePage() {
  const titleId = useId()
  const [sent, setSent] = useState(false)
  return (
    // The viewport itself is the first sheet of glass; everything stacks on it.
    <GlassPane sheet className="a1-frosted-glass-demo__page">
      <GlassPane as="header" className="a1-frosted-glass-demo__header" aria-label="Glasshouse sample header">
        <span className="a1-frosted-glass-demo__brand">
          <span className="a1-frosted-glass-demo__mark" aria-hidden="true" />
          Glasshouse
        </span>
        <GlassPane as="span" className="a1-frosted-glass-demo__chip">Early access</GlassPane>
      </GlassPane>
      <main className="a1-frosted-glass-demo__main" aria-label="Glasshouse sample page">
        {/* A separate piece of glass set flush into the viewport sheet. */}
        <GlassPane
          as="form"
          inlay
          className="a1-frosted-glass-demo__form"
          aria-labelledby={titleId}
          onSubmit={event => { event.preventDefault(); setSent(true) }}
        >
          <h1 id={titleId} className="a1-frosted-glass-demo__title">Request an invite</h1>
          <p className="a1-frosted-glass-demo__intro">Tell us a little about yourself and we’ll be in touch.</p>
          {/* Each field is its own piece of glass inlaid in the form, label inside. */}
          <GlassPane as="label" inlay className="a1-frosted-glass__field">
            <span className="a1-frosted-glass__label">Name</span>
            <input className="a1-frosted-glass__input" name="name" autoComplete="name" onInput={() => setSent(false)} />
          </GlassPane>
          <GlassPane as="label" inlay className="a1-frosted-glass__field">
            <span className="a1-frosted-glass__label">Email</span>
            <input className="a1-frosted-glass__input" name="email" type="email" autoComplete="email" onInput={() => setSent(false)} />
          </GlassPane>
          <GlassPane as="label" inlay className="a1-frosted-glass__field">
            <span className="a1-frosted-glass__label">What would you build?</span>
            <textarea className="a1-frosted-glass__input" name="message" rows={3} onInput={() => setSent(false)} />
          </GlassPane>
          <button type="submit" className="a1-frosted-glass__button">Request invite</button>
          <p className="a1-frosted-glass-demo__status" role="status">
            {sent ? 'Thanks! This is a demo, so nothing was sent.' : ''}
          </p>
        </GlassPane>
      </main>
    </GlassPane>
  )
}

export function FrostedGlassExperiment({ experiment, onOpenSettings }) {
  const [viewport, setViewport] = useState('xs')
  const [frost, setFrost] = useState('medium')
  const [backdrop, setBackdrop] = useState('aurora')

  const configuration = (
    <Inset space={16}>
      <Stack gap={24}>
        <Toolbar label="Viewport">
          <ToolbarGroup aria-label="Viewport" value={viewport} onChange={setViewport}
            options={VIEWPORT_PRESETS.filter(preset => devices[preset.value]).map(preset => ({
              value: preset.value, label: devices[preset.value], icon: preset.icon,
            }))} />
        </Toolbar>
        <Toolbar label="Frost">
          <ToolbarGroup aria-label="Frost" showLabels value={frost} onChange={setFrost}
            options={[
              { value: 'light', label: 'Light' },
              { value: 'medium', label: 'Medium' },
              { value: 'heavy', label: 'Heavy' },
            ]} />
        </Toolbar>
        <Toolbar label="Backdrop">
          <ToolbarGroup aria-label="Backdrop" showLabels value={backdrop} onChange={setBackdrop}
            options={[
              { value: 'aurora', label: 'Aurora' },
              { value: 'sunset', label: 'Sunset' },
              { value: 'meadow', label: 'Meadow' },
            ]} />
        </Toolbar>
      </Stack>
    </Inset>
  )

  return (
    <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
      <ResponsivePreviewFrame {...viewportSize(viewport)}>
        <FrostedGlass
          frost={frost}
          className="a1-frosted-glass-demo"
          data-backdrop={backdrop}
          backdrop={Array.from({ length: SHAPES }, (_, index) => (
            <span key={index} className={`a1-frosted-glass-demo__shape a1-frosted-glass-demo__shape--${index + 1}`} />
          ))}
        >
          <SamplePage />
        </FrostedGlass>
      </ResponsivePreviewFrame>
    </ExperimentLayout>
  )
}
