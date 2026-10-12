import React, { useId, useRef, useState } from 'react'
import { Button, ChoiceGroup, Dialog, Heading, IconButton, Inset, Paragraph, Section, Stack, TextField, Tooltip } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { PATTERNS, TRIGGERS, resolveTrigger, unavailableReason } from './help-model.js'
import { HelpDetails, HelpPopover, InlineHelp } from './HelpPatterns.jsx'

// Labs page: one form field with help shown five ways and opened by up to
// four kinds of trigger. Combinations that don't work well are disabled,
// with the reason shown in the configuration panel.

const TITLE = 'Finding your routing number'
const SUMMARY = 'Your routing number is the 9-digit number that identifies your bank.'
const DETAILS = [
  'On a check: the first 9 digits along the bottom, before your account number.',
  'In your bank’s app or website: look under account details or direct deposit.',
  'It’s sometimes called an ABA number or routing transit number.',
]
const TOOLTIP = '9 digits that identify your bank. Find it at the bottom left of a check.'

export function ContextualHelpExperiment({ experiment, onOpenSettings }) {
  const [patternId, setPatternId] = useState('popover')
  const [requested, setRequested] = useState('icon')
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const buttonRef = useRef(null)
  const linkRef = useRef(null)
  const openerRef = useRef(null)
  const base = useId()
  const fieldId = `${base}-routing`
  const helpId = `${base}-help`
  const trigger = resolveTrigger(patternId, requested)

  const close = restoreFocus => {
    setOpen(false)
    if (restoreFocus) openerRef.current?.focus({ preventScroll: true })
  }
  const toggle = opener => {
    openerRef.current = opener
    setOpen(value => !value)
  }
  const choosePattern = id => { setPatternId(id); setOpen(false) }
  const chooseTrigger = id => { setRequested(id); setOpen(false) }

  // Inline help follows focus when that's the trigger; otherwise it toggles.
  const inlineOpen = patternId === 'inline' && (trigger === 'focus' ? focused : open)
  const opensHelp = ['popover', 'inline'].includes(patternId)
  const triggerProps = {
    'aria-expanded': opensHelp ? open : undefined,
    'aria-controls': opensHelp ? helpId : undefined,
    'aria-haspopup': patternId === 'dialog' ? 'dialog' : undefined,
  }

  const hint = patternId === 'hint'
    ? '9 digits. Find it at the bottom left of a check, or under account details in your bank’s app.'
    : '9 digits.'

  // In the field: a small tertiary button at the input's end. Beside the
  // field: a field-height secondary button just outside the input.
  const outside = trigger === 'outside'
  const hasButton = trigger === 'icon' || outside
  const helpButton = (
    <span className={outside ? 'a1-help-field__button a1-help-field__button--outside' : 'a1-help-field__button'}>
      <IconButton ref={buttonRef} icon="help" label="Help with routing number" size={outside ? 'md' : 'sm'} variant={outside ? 'secondary' : 'tertiary'}
        onClick={patternId === 'tooltip' ? undefined : event => toggle(event.currentTarget)}
        {...(patternId === 'tooltip' ? {} : triggerProps)} />
    </span>
  )

  const describedBy = [`${fieldId}-hint`, inlineOpen && helpId].filter(Boolean).join(' ')
  let field = (
    <TextField id={fieldId} label="Routing number" hint={hint} inputMode="numeric" autoComplete="off"
      className={trigger === 'icon' ? 'a1-help-field--has-button' : outside ? 'a1-help-field--button-outside' : undefined}
      aria-describedby={describedBy}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      inputOverlay={hasButton
        ? patternId === 'tooltip' ? <Tooltip content={TOOLTIP} placement="top">{helpButton}</Tooltip> : helpButton
        : undefined} />
  )
  if (patternId === 'tooltip' && trigger === 'focus') field = <Tooltip content={TOOLTIP} placement="top">{field}</Tooltip>

  const anchor = () => (hasButton ? buttonRef.current : linkRef.current)
  const details = <HelpDetails summary={SUMMARY} details={DETAILS} />

  const configuration = (
    <Inset space={16}>
      <Stack gap={24}>
        <ChoiceGroup label="Help pattern" name="help-pattern" columns={1} size="compact" inlineIcon value={patternId} onChange={choosePattern}
          options={PATTERNS.map(item => ({ value: item.id, label: item.label, icon: item.icon, subtext: item.summary }))} />
        <ChoiceGroup label="Trigger" name="help-trigger" columns={1} size="compact" inlineIcon value={trigger ?? ''} onChange={chooseTrigger}
          hint={patternId === 'hint' ? unavailableReason('hint', 'icon') : undefined}
          options={TRIGGERS.map(item => ({
            value: item.id, label: item.label, icon: item.icon,
            subtext: unavailableReason(patternId, item.id) && patternId !== 'hint' ? unavailableReason(patternId, item.id) : item.summary,
            disabled: Boolean(unavailableReason(patternId, item.id)),
          }))} />
      </Stack>
    </Inset>
  )

  return (
    <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
      <Section padding="none" contentWidth="sm">
        <Stack gap={24}>
          <Stack as="form" gap={16} aria-labelledby={`${base}-title`} onSubmit={event => event.preventDefault()}>
            <Heading as="h2" size="md" id={`${base}-title`}>Set up direct deposit</Heading>
            <TextField label="Account holder name" autoComplete="off" />
            <Stack gap={4}>
              {field}
              {trigger === 'link' && (
                <span>
                  <Button ref={linkRef} variant="tertiary" size="sm" icon="help" onClick={event => toggle(event.currentTarget)} {...triggerProps}>
                    Find your routing number
                  </Button>
                </span>
              )}
              {patternId === 'inline' && <InlineHelp id={helpId} open={inlineOpen} title={TITLE}>{details}</InlineHelp>}
              {/* Shown in the top layer, but placed after its trigger so Tab continues to the next field. */}
              {patternId === 'popover' && <HelpPopover id={helpId} open={open} anchor={anchor} onClose={close} title={TITLE}>{details}</HelpPopover>}
            </Stack>
            <TextField label="Account number" inputMode="numeric" autoComplete="off" />
          </Stack>
          {/* Inside the Stack so the Section's gap margin doesn't push the dialog off-centre. */}
          {patternId === 'dialog' && (
            <Dialog open={open} onClose={() => setOpen(false)} title={TITLE} size="sm"
              footer={<Button onClick={() => setOpen(false)}>Done</Button>}>
              {details}
            </Dialog>
          )}
        </Stack>
      </Section>
    </ExperimentLayout>
  )
}
