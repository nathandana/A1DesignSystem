import React, { useRef, useState } from 'react'
import { Button, ChoiceGroup, Inset, Paragraph, Section, Slider, Stack, Toolbar, ToolbarGroup } from '@gtivr4/a1-design-system-react'
import motion from '../../../../system/tokens/motion.json'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { DIALOG_MOTIONS, DIRECTIONS, MotionDialog } from './MotionDialog.jsx'

// Labs page: the A1 Dialog with nine enter/exit animations, a direction and
// exit for the directional ones, and a scrim whose colour, opacity and blur
// can change. The stage is just a large button that opens the dialog.

const SPEEDS = ['fast', 'normal', 'slow', 'slower', 'slowest'].map(key => ({ key, ms: Number.parseFloat(motion.semantic.motion.duration[key].$value) }))
const EXITS = [
  { value: 'reverse', label: 'Back the way it came', icon: 'undo' },
  { value: 'continue', label: 'Carry on through', icon: 'redo' },
]
const SCRIM_COLORS = [
  { value: 'a1', label: 'A1 scrim', swatch: 'var(--component-scrim-color)', css: 'var(--component-scrim-color)' },
  { value: 'black', label: 'Black', swatch: 'var(--base-color-neutral-1000)', css: 'var(--base-color-neutral-1000)' },
  { value: 'white', label: 'White', swatch: 'var(--base-color-neutral-0)', css: 'var(--base-color-neutral-0)' },
  { value: 'page', label: 'Page', swatch: 'var(--semantic-color-surface-page)', css: 'var(--semantic-color-surface-page)' },
  { value: 'accent', label: 'Accent', swatch: 'var(--semantic-color-action-background)', css: 'var(--semantic-color-action-background)' },
]
const OPACITIES = [0, 20, 40, 60, 80]
const BLURS = [
  { value: 0, css: '0px', label: 'None' },
  { value: 2, css: 'var(--base-spacing-2)', label: '2' },
  { value: 4, css: 'var(--base-spacing-4)', label: '4' },
  { value: 8, css: 'var(--base-spacing-8)', label: '8' },
  { value: 16, css: 'var(--base-spacing-16)', label: '16' },
]
// A1's own scrim: its colour at 60% with a 2px blur.
const A1_SCRIM = { color: 'a1', opacity: 60, blur: 2 }

export function DialogMotionExperiment({ experiment, onOpenSettings }) {
  const [motionId, setMotionId] = useState('scale')
  const [direction, setDirection] = useState('bottom')
  const [exit, setExit] = useState('reverse')
  const [speed, setSpeed] = useState('slow')
  const [scrim, setScrim] = useState(A1_SCRIM)
  const [open, setOpen] = useState(false)
  const openerRef = useRef(null)
  const current = DIALOG_MOTIONS.find(item => item.id === motionId)
  const setScrimPart = part => setScrim(value => ({ ...value, ...part }))

  const configuration = (
    <Inset space={16}>
      <Stack gap={24}>
        <ChoiceGroup label="Animation" name="dialog-motion" columns={1} size="compact" inlineIcon value={motionId} onChange={setMotionId}
          options={DIALOG_MOTIONS.map(item => ({ value: item.id, label: item.label, icon: item.icon, subtext: item.summary }))} />
        <Toolbar label="Enters from">
          <ToolbarGroup aria-label="Enters from" value={direction} onChange={setDirection} labelMode="selected"
            options={DIRECTIONS.map(item => ({ ...item, disabled: !current.directional }))} />
        </Toolbar>
        <Toolbar label="Leaves">
          <ToolbarGroup aria-label="Leaves" value={exit} onChange={setExit} labelMode="selected"
            options={EXITS.map(item => ({ ...item, disabled: !current.continues }))} />
        </Toolbar>
        {!current.continues && (
          <Paragraph size="sm" color="muted">
            {current.directional ? 'Swing always closes back on its hinge.' : 'Direction applies to Slide, Flip and Swing.'}
          </Paragraph>
        )}
        <Slider label="Duration (ms)" variant="subtle" value={SPEEDS.find(item => item.key === speed).ms}
          detents={SPEEDS.map(item => ({ value: item.ms, label: String(item.ms) }))} formatValue={ms => `${ms} milliseconds`}
          onChange={ms => setSpeed(SPEEDS.find(item => item.ms === ms).key)} />
        <Toolbar label="Scrim color">
          <ToolbarGroup aria-label="Scrim color" value={scrim.color} onChange={color => setScrimPart({ color })} labelMode="selected"
            options={SCRIM_COLORS.map(({ value, label, swatch }) => ({ value, label, swatch }))} />
        </Toolbar>
        <Slider label="Scrim opacity (%)" variant="subtle" value={scrim.opacity} detents={OPACITIES.map(value => ({ value, label: String(value) }))}
          formatValue={value => `${value} percent`} onChange={opacity => setScrimPart({ opacity })} />
        <Slider label="Scrim blur (px)" variant="subtle" value={scrim.blur} detents={BLURS.map(({ value, label }) => ({ value, label }))}
          formatValue={value => (value ? `${value} pixels` : 'No blur')} onChange={blur => setScrimPart({ blur })} />
        <Button variant="secondary" icon="restart_alt" onClick={() => setScrim(A1_SCRIM)}>Reset to the A1 scrim</Button>
        <Paragraph size="sm" color="muted">With reduced motion, dialogs open and close instantly; the scrim keeps its color, opacity and blur. Exit animations need a browser that can keep a closing dialog on top; elsewhere it closes instantly.</Paragraph>
      </Stack>
    </Inset>
  )

  return (
    <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
      <Section padding="none" height="hero" align="center">
        <Stack gap={24} align="center">
          <Button ref={openerRef} size="lg" icon="open_in_new" onClick={() => setOpen(true)} aria-haspopup="dialog">Open dialog</Button>
          {/* Inside the Stack: a dialog that follows a sibling in a Section picks up the Section's gap margin and sits off-centre. */}
          <MotionDialog open={open} onClose={() => setOpen(false)} motion={motionId} direction={direction} exit={exit} speed={speed}
            opener={() => openerRef.current}
            scrim={{ color: SCRIM_COLORS.find(item => item.value === scrim.color).css, opacity: scrim.opacity, blur: BLURS.find(item => item.value === scrim.blur).css }}
            title="Archive this project?"
            footer={<>
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => setOpen(false)}>Archive project</Button>
            </>}>
            <Paragraph>Archived projects are hidden from your dashboard. You can restore them at any time from Settings.</Paragraph>
          </MotionDialog>
        </Stack>
      </Section>
    </ExperimentLayout>
  )
}
