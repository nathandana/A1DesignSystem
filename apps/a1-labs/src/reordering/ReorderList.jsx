import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Card, IconButton, Paragraph, Stack } from '@gtivr4/a1-design-system-react'
import { cssDurationMs, insertionIndex, moveItem, placementFrames } from './reorder-model.js'
import './reordering.css'

/**
 * Controlled ordered list. Only committed drops/moves emit onChange.
 * placement: subtle | plop | tilt | spring | pop | slide | fade | instant
 * indicator: line | outline | slot | glow | arrows, or in the margin beside
 *   the list (never under the dragged item): marker | pointer | rail
 */
export function ReorderList({ items, onChange, placement = 'subtle', indicator = 'rail', duration = 'slow', label = 'Reorder items' }) {
  const root = useRef(null)
  const elements = useRef(new Map())
  const before = useRef(new Map())
  const active = useRef(null)
  const pendingLanding = useRef(null)
  const animations = useRef(new Set())
  const [drag, setDrag] = useState(null)
  const [announcement, setAnnouncement] = useState('')
  const [placed, setPlaced] = useState(null)
  const hintId = useId()
  const reduced = useRef(false)
  const itemsRef = useRef(items)
  itemsRef.current = items
  const projected = drag ? moveItem(items, drag.id, drag.target) : items
  const remember = () => { before.current = new Map([...elements.current].map(([id, node]) => [id, node.getBoundingClientRect().top])) }
  const clearAnimations = () => { for (const animation of animations.current) animation.cancel(); animations.current.clear() }
  const focusHandle = id => elements.current.get(id)?.querySelector('[data-reorder-handle]')?.focus({ preventScroll: true })
  const updateDrag = next => { active.current = next; setDrag(next) }
  const cancel = () => {
    const session = active.current
    if (!session) return
    remember(); updateDrag(null)
    setAnnouncement(`Move cancelled. ${session.label} remains in position ${itemsRef.current.findIndex(item => item.id === session.id) + 1}.`)
    focusHandle(session.id)
  }
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const motion = () => { reduced.current = query.matches; if (query.matches) clearAnimations() }
    const hidden = () => { if (document.hidden) cancel() }
    const outside = event => { if (!root.current?.contains(event.target)) cancel() }
    motion(); query.addEventListener('change', motion)
    window.addEventListener('blur', cancel)
    window.addEventListener('resize', cancel)
    document.addEventListener('visibilitychange', hidden)
    document.addEventListener('pointerdown', outside)
    return () => { clearAnimations(); query.removeEventListener('change', motion); window.removeEventListener('blur', cancel); window.removeEventListener('resize', cancel); document.removeEventListener('visibilitychange', hidden); document.removeEventListener('pointerdown', outside) }
  }, [])
  useEffect(() => { if (active.current) cancel() }, [items, placement, indicator, duration])
  const run = (node, frames, timing) => {
    const animation = node.animate(frames, timing)
    animations.current.add(animation)
    animation.onfinish = () => { animations.current.delete(animation); animation.cancel() }
  }
  useLayoutEffect(() => {
    const css = getComputedStyle(root.current)
    const milliseconds = cssDurationMs(css.getPropertyValue(`--semantic-motion-duration-${['fast','slow','slower'].includes(duration) ? duration : 'slow'}`))
    const easing = css.getPropertyValue('--semantic-motion-easing-standard').trim()
    if (!reduced.current && placement !== 'instant') {
      const previous = before.current
      // Finish previous transforms only after sampling their visible positions.
      clearAnimations()
      for (const [id, node] of elements.current) {
        const old = previous.get(id)
        const delta = old == null ? 0 : old - node.getBoundingClientRect().top
        if (Math.abs(delta) > 0 && id !== drag?.id) run(node, [{ transform: `translateY(${delta}px)` }, { transform: 'none' }], { duration: milliseconds, easing })
      }
      const landed = elements.current.get(pendingLanding.current)?.querySelector('[data-reorder-landing]')
      if (landed) {
        const value = name => css.getPropertyValue(`--component-reordering-${name}`).trim()
        run(landed, placementFrames(placement, { lift: value('lift'), bounce: value('bounce'), liftScale: value('lift-scale'), squashX: value('squash-x'), squashY: value('squash-y'), tilt: value('tilt'), counterTilt: value('counter-tilt'),
          slide: value('slide'), popScale: value('pop-scale'), popSettle: value('pop-settle'), fadeScale: value('fade-scale'), direction: css.direction }), { duration: milliseconds, easing })
      }
    } else clearAnimations()
    before.current.clear(); pendingLanding.current = null
    if (drag?.input === 'keyboard') focusHandle(drag.id)
  }, [items, drag?.target, drag?.id, placement, duration])

  const start = (item, input, event) => {
    if (active.current) return
    remember(); clearAnimations(); setPlaced(null)
    const node = elements.current.get(item.id)
    const rect = node.getBoundingClientRect()
    const target = items.findIndex(value => value.id === item.id)
    const centers = items.map(value => { const bounds = elements.current.get(value.id).getBoundingClientRect(); return bounds.top + bounds.height / 2 })
    if (input === 'pointer') root.current.setPointerCapture(event.pointerId)
    updateDrag({ id: item.id, label: item.label, input, target, centers, pointerId: event?.pointerId, x: event?.clientX, y: event?.clientY, left: rect.left, top: rect.top, width: rect.width, dx: 0, dy: 0 })
    setAnnouncement(`Picked up ${item.label}, position ${target + 1} of ${items.length}. Use arrow keys to move, Space to place, or Escape to cancel.`)
  }
  const preview = target => {
    const session = active.current
    if (!session || target === session.target) return
    remember(); updateDrag({ ...session, target })
    setAnnouncement(`${session.label}, insertion position ${target + 1} of ${items.length}.`)
  }
  const commit = () => {
    const session = active.current
    if (!session) return
    remember(); pendingLanding.current = session.id; setPlaced(session.id)
    const next = moveItem(itemsRef.current, session.id, session.target)
    updateDrag(null); onChange(next)
    setAnnouncement(`${session.label} placed in position ${session.target + 1} of ${next.length}.`)
    requestAnimationFrame(() => focusHandle(session.id))
  }
  const move = (item, index) => {
    if (active.current) return
    remember(); pendingLanding.current = item.id; setPlaced(item.id)
    const next = moveItem(items, item.id, index)
    onChange(next)
    setAnnouncement(`${item.label} placed in position ${index + 1} of ${items.length}.`)
    requestAnimationFrame(() => focusHandle(item.id))
  }
  const draggedItem = drag && items.find(item => item.id === drag.id)
  return <Stack className="a1-reordering" ref={root} gap={16}
    onPointerMove={event => {
      const session = active.current
      if (session?.input !== 'pointer' || session.pointerId !== event.pointerId) return
      const target = insertionIndex(session.centers, event.clientY)
      if (target !== session.target) preview(target)
      updateDrag({ ...active.current, dx: event.clientX - session.x, dy: event.clientY - session.y })
    }}
    onPointerUp={event => {
      if (active.current?.pointerId !== event.pointerId) return
      const rect = root.current.getBoundingClientRect()
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) cancel()
      else commit()
    }}
    onPointerCancel={cancel} onLostPointerCapture={cancel}
    onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); cancel() } else if (event.key === 'Tab') cancel() }}>
    <Paragraph id={hintId} size="sm" color="muted">Drag a handle to reorder. Or pick it up with Space, use the arrow keys and press Space to place.</Paragraph>
    <Stack as="ol" role="list" aria-label={label} className="a1-reordering__list" gap={12}
      data-indicator={indicator} data-dragging={drag ? 'true' : undefined}>
      {projected.map((item, index) => <li key={item.id} className="a1-reordering__item" ref={node => { if (node) elements.current.set(item.id, node); else elements.current.delete(item.id) }}
        data-active={drag?.id === item.id || undefined} data-indicator={indicator} data-placed={placed === item.id || undefined}>
        <div data-reorder-landing className="a1-reordering__landing">
          <Card><Stack direction="row" align="center" gap={12}>
            <IconButton icon="drag_indicator" label={`Move ${item.label}`} data-reorder-handle aria-describedby={hintId} aria-pressed={drag?.id === item.id}
              className="a1-reordering__handle"
              onContextMenu={event => event.preventDefault()}
              onPointerDown={event => { if (event.button === 0 && event.isPrimary) { event.currentTarget.focus(); start(item, 'pointer', event) } }}
              onClick={event => { if (event.detail === 0) { if (active.current?.id === item.id) commit(); else start(item,'keyboard') } }}
              onKeyDown={event => {
                if ([' ', 'Enter'].includes(event.key)) { event.preventDefault(); if (event.repeat) return; if (active.current?.id === item.id) commit(); else start(item,'keyboard') }
                else if (['ArrowUp','ArrowDown','Home','End'].includes(event.key) && active.current?.id === item.id) {
                  event.preventDefault()
                  const target = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : Math.max(0, Math.min(items.length - 1, active.current.target + (event.key === 'ArrowUp' ? -1 : 1)))
                  preview(target)
                }
              }} />
            <Stack grow gap={4}><Paragraph>{item.label}</Paragraph>{item.description && <Paragraph size="sm" color="muted">{item.description}</Paragraph>}</Stack>
            <Stack gap={0}>
              <IconButton size="sm" icon="arrow_upward" label={`Move ${item.label} up`} disabled={Boolean(drag) || index === 0} onClick={() => move(item,index-1)} />
              <IconButton size="sm" icon="arrow_downward" label={`Move ${item.label} down`} disabled={Boolean(drag) || index === items.length-1} onClick={() => move(item,index+1)} />
            </Stack>
          </Stack></Card>
        </div>
        {drag?.id === item.id && <span className="a1-reordering__insertion" aria-hidden="true" data-position={index+1}>
          <span className="a1-reordering__insertion-label">Place here · {index+1}</span>
        </span>}
      </li>)}
    </Stack>
    <Paragraph size="sm" color="muted" role="status" aria-live="polite" aria-atomic="true">{announcement || 'Order ready.'}</Paragraph>
    {drag?.input === 'pointer' && draggedItem && createPortal(<div className="a1-reordering__ghost" aria-hidden="true"
      style={{ left: drag.left, top: drag.top, width: drag.width, transform: `translate(${drag.dx}px, ${drag.dy}px)` }}>
      <Card><Stack direction="row" align="center" gap={12}>
        <IconButton as="span" icon="drag_indicator" label="" />
        <Stack grow gap={4}><Paragraph>{draggedItem.label}</Paragraph>{draggedItem.description && <Paragraph size="sm" color="muted">{draggedItem.description}</Paragraph>}</Stack>
        <Stack gap={0}><IconButton as="span" size="sm" icon="arrow_upward" label="" /><IconButton as="span" size="sm" icon="arrow_downward" label="" /></Stack>
      </Stack></Card>
    </div>, document.body)}
  </Stack>
}
