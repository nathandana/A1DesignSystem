import React, { useEffect, useId, useRef, useState } from 'react'
import { Icon, Paragraph, Stack } from '@gtivr4/a1-design-system-react'
import { createSwitchScene } from './switch-scene.js'
import '../../../../packages/react/src/utilities/sr-only.css'
import './three-switch.css'

const scales = { 1: 'standard', 2: 'small', 3: 'medium', 4: 'large' }
export function ThreeSwitch({ label = 'Switch', checked, defaultChecked = false, onChange,
  disabled = false, scale = 2, speed = 'quick', view = 'angled', id, name, value }) {
  const autoId = useId(), host = useRef(null), scene = useRef(null)
  const [internalChecked, setInternalChecked] = useState(defaultChecked)
  const [failed, setFailed] = useState(false)
  const [still, setStill] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [forced, setForced] = useState(() => matchMedia('(forced-colors: active)').matches)
  const isChecked = checked ?? internalChecked
  const size = scales[scale] ?? 'small'
  const duration = ['quick', 'fast', 'normal', 'slow', 'slowest'].includes(speed) ? speed : 'quick'
  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)'), colors = matchMedia('(forced-colors: active)')
    const update = () => { setStill(motion.matches); setForced(colors.matches) }
    motion.addEventListener('change', update); colors.addEventListener('change', update)
    return () => { motion.removeEventListener('change', update); colors.removeEventListener('change', update) }
  }, [])
  useEffect(() => {
    if (failed || forced) return
    try { scene.current = createSwitchScene(host.current, () => setFailed(true)) }
    catch { setFailed(true) }
    return () => { scene.current?.dispose(); scene.current = null }
  }, [failed, forced])
  useEffect(() => {
    scene.current?.update({ checked: isChecked, disabled, still, view })
  }, [isChecked, disabled, still, view, duration, scale, forced, failed])
  return <Stack as="label" direction="row" align="center" justify="center" wrap gap={size === 'standard' ? 6 : 24}
    className="a1-switch-three" data-fallback={failed || forced} style={{
      '--a1-switch-three-scale': `var(--component-switch-morph-scale-${size})`,
      '--a1-switch-three-duration': `var(--semantic-motion-duration-${duration})`,
    }}>
    <input id={id ?? autoId} type="checkbox" role="switch" name={name} value={value}
      className="a1-sr-only a1-switch-three__input" checked={isChecked} disabled={disabled}
      onChange={event => { if (checked === undefined) setInternalChecked(event.target.checked); onChange?.(event.target.checked, event) }} />
    <span className="a1-switch-three__surface" aria-hidden="true">
      <span className="a1-switch-three__fallback"><span className="a1-switch-three__thumb"><Icon name={isChecked ? 'check' : 'close'} size="lg" /></span></span>
      <span className="a1-switch-three__canvas" ref={host} />
    </span>
    <Paragraph as="span" size={size === 'standard' ? 'md' : 'xl'} weight="regular" color={disabled ? 'muted' : 'default'}>{label}</Paragraph>
  </Stack>
}
