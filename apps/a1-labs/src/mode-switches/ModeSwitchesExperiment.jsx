import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Button, ChoiceGroup, Heading, Inset, MessageBadge, Paragraph, Section, Slider, Stack, Toolbar, ToolbarGroup } from '@gtivr4/a1-design-system-react'
import motion from '../../../../system/tokens/motion.json'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { EclipseButton, ModeDial, PullCord, SlideSwitch, SunMoonSwitch } from './ModeSwitches.jsx'
import { MODE_LABEL, resolveMode } from './mode-model.js'
import { revealRadius } from './mode-transition.js'

// Labs page: one light/dark switch at a time, chosen in the side panel, all
// driving the real Labs appearance mode (the same setting as the header's
// Settings menu). The change between modes can fade or reveal from the
// control, with a duration from the motion tokens.

const SWITCHES = [
  { id: 'cord', title: 'Pull cord', kind: 'binary', icon: 'vertical_align_bottom', Control: PullCord, detail: 'Pull the bead past halfway and let go; the cord springs back. Tap, Enter or Space gives it a tug.' },
  { id: 'sunmoon', title: 'Sun and moon switch', kind: 'binary', icon: 'toggle_on', Control: SunMoonSwitch, detail: 'The A1 Switch with a sun or moon in its thumb, which turns as it moves.' },
  { id: 'dial', title: 'Mode dial', kind: 'auto', icon: 'tune', Control: ModeDial, detail: 'Turn the knob, drag it or use the arrow keys between Light, Auto and Dark.' },
  { id: 'eclipse', title: 'Eclipse', kind: 'auto', icon: 'brightness_4', Control: EclipseButton, detail: 'Each press moves the moon: Light, Dark when it covers the sun, Auto halfway.' },
  { id: 'slide', title: 'Slide switch', kind: 'auto', icon: 'linear_scale', Control: SlideSwitch, detail: 'A three-position hardware slider. Click a position or use the arrow keys to move the thumb between Light, Auto and Dark.' },
]

const TRANSITIONS = [
  { value: 'none', label: 'None', icon: 'block' },
  { value: 'fade', label: 'Fade', icon: 'blur_on' },
  { value: 'reveal', label: 'Reveal', icon: 'radio_button_checked' },
]

// Duration detents are the semantic motion tokens.
const DURATIONS = ['fast', 'slow', 'slower', 'slowest'].map(key => ({ key, ms: Number.parseFloat(motion.semantic.motion.duration[key].$value) }))

function useMedia(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const list = window.matchMedia(query)
    const update = event => setMatches(event.matches)
    list.addEventListener('change', update)
    return () => list.removeEventListener('change', update)
  }, [query])
  return matches
}

const initialSwitch = () => {
  const requested = new URLSearchParams(window.location.search).get('switch')
  return SWITCHES.some(item => item.id === requested) ? requested : SWITCHES[0].id
}

export function ModeSwitchesExperiment({ experiment, onOpenSettings, appearance }) {
  const systemDark = useMedia('(prefers-color-scheme: dark)')
  const reduced = useMedia('(prefers-reduced-motion: reduce)')
  const [switchId, setSwitchId] = useState(initialSwitch)
  const [transition, setTransition] = useState('reveal')
  const [duration, setDuration] = useState('slower')
  const lastPointer = useRef(null)
  const run = useRef(0)
  const active = useRef(null)

  // While a view transition runs, the browser sends clicks to the document
  // element rather than the page. A click then ends the transition at once and
  // is replayed on the control under the pointer, so no change is lost.
  useEffect(() => {
    const replay = event => {
      const transition = active.current
      if (!transition || event.target !== document.documentElement) return
      event.preventDefault()
      const { clientX, clientY } = event
      transition.skipTransition()
      transition.finished.finally(() => {
        const target = document.elementFromPoint(clientX, clientY)?.closest('button, label')
        target?.click()
      })
    }
    document.addEventListener('click', replay, true)
    return () => document.removeEventListener('click', replay, true)
  }, [])
  const mode = appearance?.mode ?? 'dark'
  const setMode = appearance?.setMode ?? (() => {})
  const shown = resolveMode(mode, systemDark)
  const current = SWITCHES.find(item => item.id === switchId)
  const Control = current.Control
  const status = mode === 'system'
    ? `Auto: following your device, which is using ${shown} mode.`
    : `${MODE_LABEL[mode]} mode.`

  const chooseSwitch = id => {
    setSwitchId(id)
    const url = new URL(window.location.href)
    url.searchParams.set('switch', id)
    window.history.replaceState(null, '', url)
  }

  // Where the reveal starts: the last press, or the focused control.
  const origin = () => {
    const pointer = lastPointer.current
    if (pointer && performance.now() - pointer.time < 1500) return pointer
    const rect = document.activeElement?.getBoundingClientRect?.()
    return rect && rect.width ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  }

  const changeMode = next => {
    if (next === mode) return
    const visible = resolveMode(next, systemDark) !== shown
    if (transition === 'none' || reduced || !visible || !document.startViewTransition) {
      setMode(next)
      return
    }
    const root = document.documentElement
    const { x, y } = origin()
    const id = ++run.current
    root.style.setProperty('--a1-mode-transition-duration', `var(--semantic-motion-duration-${duration})`)
    root.style.setProperty('--a1-mode-x', `${x}px`)
    root.style.setProperty('--a1-mode-y', `${y}px`)
    root.style.setProperty('--a1-mode-r', `${revealRadius(x, y, window.innerWidth, window.innerHeight)}px`)
    root.dataset.a1ModeTransition = transition
    const change = document.startViewTransition(() => flushSync(() => setMode(next)))
    active.current = change
    change.finished.finally(() => {
      if (run.current !== id) return
      active.current = null
      delete root.dataset.a1ModeTransition
      for (const name of ['--a1-mode-transition-duration', '--a1-mode-x', '--a1-mode-y', '--a1-mode-r']) root.style.removeProperty(name)
    })
  }

  const configuration = (
    <Inset space={16}>
      <Stack gap={24}>
        <ChoiceGroup label="Switch" name="mode-switch" columns={1} size="compact" inlineIcon value={switchId} onChange={chooseSwitch}
          options={SWITCHES.map(item => ({ value: item.id, label: item.title, icon: item.icon, subtext: item.kind === 'auto' ? 'Light, dark or auto' : 'Light or dark' }))} />
        <Toolbar label="Transition between modes" fullWidth>
          <ToolbarGroup aria-label="Transition between modes" value={transition} onChange={setTransition} showLabels options={TRANSITIONS} />
        </Toolbar>
        <Slider label="Transition duration (ms)" variant="subtle" disabled={transition === 'none'}
          value={DURATIONS.find(item => item.key === duration).ms}
          detents={DURATIONS.map(item => ({ value: item.ms, label: String(item.ms) }))}
          formatValue={value => `${value} milliseconds`}
          onChange={value => setDuration(DURATIONS.find(item => item.ms === value).key)} />
        {reduced && <Paragraph size="sm" color="muted">Your device asks for reduced motion, so modes change without a transition.</Paragraph>}
        <Stack gap={8}>
          <Button variant="secondary" icon="brightness_auto" onClick={() => changeMode('system')}>Use Auto</Button>
          <Button variant="secondary" icon="restart_alt" onClick={() => changeMode('dark')}>Reset to Dark</Button>
        </Stack>
        <Paragraph size="sm" color="muted">Every switch changes the real Labs appearance, the same setting as the Settings menu in the header.</Paragraph>
      </Stack>
    </Inset>
  )

  return (
    <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
      <Section padding="none">
        <Stack gap={24} align="center" className="a1-mode-switches"
          onPointerDownCapture={event => { lastPointer.current = { x: event.clientX, y: event.clientY, time: performance.now() } }}>
          <Stack gap={8} align="center">
            <Heading as="h2" size="lg">{current.title}</Heading>
            <MessageBadge status={current.kind === 'auto' ? 'info' : 'neutral'} subtle size="sm" icon={null}>
              {current.kind === 'auto' ? 'Light, dark or auto' : 'Light or dark'}
            </MessageBadge>
          </Stack>
          <Stack align="center" justify="center" className="a1-mode-switches__stage">
            <Control key={switchId} mode={mode} systemDark={systemDark} onChange={changeMode} />
          </Stack>
          <Paragraph role="status" aria-live="polite" align="center">{status}</Paragraph>
        </Stack>
      </Section>
    </ExperimentLayout>
  )
}
