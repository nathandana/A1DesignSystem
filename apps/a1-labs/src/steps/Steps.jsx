import React, { useEffect, useRef } from 'react'
import { Tabs, TabList, Tab, TabPanel, Stack, Icon } from '@gtivr4/a1-design-system-react'
import './steps.css'

export const STEP_TREATMENTS = [
  { id: 'default', label: 'A1 default', description: 'The standard A1 progress tabs, with numbered circles and connected completion states.' },
  { id: 'dots', label: 'Dots', description: 'Small milestones keep the path quiet. Labels and explicit states remain available.' },
  { id: 'bars', label: 'Bars', description: 'A row of separate progress bars gives every stage its own place.' },
  { id: 'pills', label: 'Pills', description: 'Soft capsules gather each step’s number and label into a single target.' },
  { id: 'tiles', label: 'Tiles', description: 'Roomy outlined tiles make room for a title, description and status.' },
  { id: 'chevrons', label: 'Chevrons', description: 'Arrow-shaped connectors emphasize the direction through the sequence.' },
  { id: 'vertical', label: 'Vertical', description: 'A stacked checklist gives each stage a full line and works well in narrow spaces.' },
  { id: 'compact', label: 'Compact', description: 'Numbered markers show the whole journey, with the full label on the current step.' },
]

/** Controlled presentation on A1 progress tabs. Navigation never completes a step. */
export function Steps({ items, value, onChange, completed = [], error, treatment = 'default', descriptions = true, label = 'Setup steps' }) {
  const host = useRef(null)
  const variant = STEP_TREATMENTS.some(item => item.id === treatment) ? treatment : 'default'
  useEffect(() => {
    const list = host.current?.querySelector('[role="tablist"]')
    // A1 owns tab semantics and keyboard behavior; its current TabList API does
    // not expose orientation or a name. This adapter supplies those attributes.
    list?.setAttribute('aria-label', label)
    list?.setAttribute('aria-orientation', variant === 'vertical' ? 'vertical' : 'horizontal')
    const scroll = host.current?.querySelector('.a1-steps-study__scroll')
    const active = list?.querySelector('[aria-selected="true"]')
    if (scroll && active) {
      const area = scroll.getBoundingClientRect(), box = active.getBoundingClientRect()
      if (box.left < area.left) scroll.scrollLeft -= area.left - box.left
      else if (box.right > area.right) scroll.scrollLeft += box.right - area.right
    }
  }, [value, variant, label, items.length])
  return <div ref={host} className="a1-steps-study" data-treatment={variant}>
    <Tabs variant="progress" value={value} onChange={onChange} equalHeight>
      <div className="a1-steps-study__scroll">
        <TabList>
          {items.map((item, index) => {
            const state = error === item.id ? 'Needs attention' : completed.includes(item.id) ? 'Complete' : item.id === value ? 'Current step' : 'Not started'
            return <Tab key={item.id} value={item.id} status={completed.includes(item.id) && error !== item.id ? 'completed' : undefined}>
              <Stack as="span" gap={4}>
                <span><span className="a1-sr-only">Step {index + 1} of {items.length}: </span>{item.label}</span>
                {variant === 'tiles' && descriptions && <span className="a1-steps-study__detail">{item.description}</span>}
                <span className={variant === 'default' || variant === 'compact' ? 'a1-sr-only' : 'a1-steps-study__state'} data-error={error === item.id || undefined}>{state}</span>
              </Stack>
              {variant === 'chevrons' && index < items.length - 1 && <Icon name="chevron_right" className="a1-steps-study__chevron" />}
            </Tab>
          })}
        </TabList>
      </div>
      {items.map(item => <TabPanel key={item.id} value={item.id}>{item.content}</TabPanel>)}
    </Tabs>
  </div>
}
