import React, { useLayoutEffect, useRef } from 'react'
import { Heading, IconButton, List, ListItem, Paragraph, Stack } from '@gtivr4/a1-design-system-react'
import { placePopover } from './help-model.js'
import './contextual-help.css'

// Contextual help surfaces for the Labs help experiment. Tooltip, hint and
// dialog come straight from A1; these are the two A1 doesn't have yet:
// a popover (native popover, top layer) and an inline expansion.

const px = (value, element) => {
  const number = Number.parseFloat(value) || 0
  return value.trim().endsWith('rem') ? number * Number.parseFloat(getComputedStyle(element.ownerDocument.documentElement).fontSize) : number
}

/** Help text shared by every surface: a sentence and where to look. */
export function HelpDetails({ summary, details }) {
  return (
    <Stack gap={8}>
      <Paragraph size="sm">{summary}</Paragraph>
      <List size="sm">{details.map(item => <ListItem key={item}>{item}</ListItem>)}</List>
    </Stack>
  )
}

function HelpHeader({ id, title, onClose }) {
  return (
    <Stack direction="row" justify="between" align="center" gap={8}>
      <Heading as="h3" size="xs" id={id}>{title}</Heading>
      <IconButton icon="close" label="Close help" size="sm" variant="tertiary" onClick={onClose} />
    </Stack>
  )
}

/**
 * A non-modal help card in the top layer, placed beside its anchor. Focus
 * moves into it on open; Escape, Close or clicking elsewhere closes it.
 * `onClose(restoreFocus)` is told whether focus should return to the opener.
 */
export function HelpPopover({ id, open, anchor, onClose, title, children }) {
  const ref = useRef(null)
  const titleId = `${id}-title`

  useLayoutEffect(() => {
    const element = ref.current
    if (!element?.showPopover) return undefined
    if (!open) {
      if (element.matches(':popover-open')) element.hidePopover()
      return undefined
    }
    if (!element.matches(':popover-open')) element.showPopover()
    const place = () => {
      const target = anchor()
      if (!target) return
      const gap = px(getComputedStyle(element).getPropertyValue('--component-contextual-help-popover-gap'), element)
      const position = placePopover(target.getBoundingClientRect(), { width: element.offsetWidth, height: element.offsetHeight }, { width: window.innerWidth, height: window.innerHeight }, gap)
      element.style.top = `${position.top}px`
      element.style.left = `${position.left}px`
      element.dataset.side = position.side
    }
    place()
    element.focus({ preventScroll: true })
    const outside = event => { if (!element.contains(event.target) && !anchor()?.contains(event.target)) onClose(false) }
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    document.addEventListener('pointerdown', outside)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
      document.removeEventListener('pointerdown', outside)
    }
  }, [open])

  return (
    <div ref={ref} id={id} popover="manual" className="a1-help-popover" role="dialog" aria-labelledby={titleId} tabIndex={-1}
      onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); onClose(true) } }}
      onBlur={event => {
        const next = event.relatedTarget
        if (open && next && !ref.current.contains(next) && !anchor()?.contains(next)) onClose(false)
      }}>
      <Stack gap={8}>
        <HelpHeader id={titleId} title={title} onClose={() => onClose(true)} />
        {children}
      </Stack>
    </div>
  )
}

/** Help that expands in the page flow. Hidden content is out of the accessibility tree. */
export function InlineHelp({ id, open, title, children }) {
  return (
    <div id={id} className="a1-help-inline" data-open={open || undefined}>
      <div className="a1-help-inline__clip">
        <div className="a1-help-inline__body">
          <Stack gap={8}>
            <Paragraph size="sm"><strong>{title}</strong></Paragraph>
            {children}
          </Stack>
        </div>
      </div>
    </div>
  )
}
