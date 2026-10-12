import React, { useId, useState } from 'react'
import { Paragraph, Stack } from '@gtivr4/a1-design-system-react'
import '../../../../packages/react/src/utilities/sr-only.css'
import './morph-switch.css'

const scales = { 1: 'standard', 2: 'small', 3: 'medium', 4: 'large' }

// Native switch semantics, with the same A1 track/thumb tokens at a larger scale.
// The consumer owns its meaning and state; no Labs-specific dependencies.
export function MorphSwitch({ label = 'Switch', checked, defaultChecked = false,
  onChange, disabled = false, scale = 2, speed = 'quick', id: providedId, name, value }) {
  const autoId = useId()
  const [internalChecked, setInternalChecked] = useState(defaultChecked)
  const isChecked = checked ?? internalChecked
  const size = scales[scale] ?? 'small'
  const isStandard = size === 'standard'
  const duration = ['quick', 'fast', 'normal', 'slow', 'slowest'].includes(speed) ? speed : 'quick'
  return (
    <Stack as="label" direction="row" align="center" justify="center" wrap gap={24}
      className="a1-switch-morph" style={{
        '--a1-switch-morph-scale': `var(--component-switch-morph-scale-${size})`,
        '--a1-switch-morph-duration': `var(--semantic-motion-duration-${duration})`,
        ...(isStandard ? {
          '--a1-stack-gap': 'var(--component-switch-row-gap)',
          paddingBlock: 'var(--component-switch-row-padding-block)',
          paddingInline: 'var(--component-switch-row-padding-inline)',
          marginInline: 'calc(-1 * var(--component-switch-row-padding-inline))',
        } : {}),
      }}>
      <input id={providedId ?? autoId} type="checkbox" role="switch" className="a1-sr-only a1-switch-morph__input"
        checked={isChecked} disabled={disabled} name={name} value={value}
        onChange={event => {
          if (checked === undefined) setInternalChecked(event.target.checked)
          onChange?.(event.target.checked, event)
        }} />
      <span className="a1-switch-morph__track" aria-hidden="true">
        <span className="a1-switch-morph__thumb">
          <span className="a1-switch-morph__stroke a1-switch-morph__stroke--short" />
          <span className="a1-switch-morph__stroke a1-switch-morph__stroke--long" />
        </span>
      </span>
      <Paragraph as="span" size={isStandard ? 'md' : 'xl'} weight="regular"
        style={isStandard ? { lineHeight: 'var(--semantic-font-line-height-body)' } : undefined}
        color={disabled ? 'muted' : 'default'}>{label}</Paragraph>
    </Stack>
  )
}
