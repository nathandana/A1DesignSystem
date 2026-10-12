import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button, ButtonContainer, Card, Grid, Heading, IconButton, Paragraph, Stack } from '@gtivr4/a1-design-system-react'
import { moveItem } from './reorder-model.js'
import { attractedPoint, magneticTarget, springFrames, springStep } from './magnetic-model.js'
import { physics, snapRadii } from './magnetic-config.js'
import './magnetic-grid.css'


/** Controlled grid: previews are local; onChange receives committed orders only. */
export function MagneticGrid({ items, onChange, radius = snapRadii[1], stiffness = physics.stiffnessDefault.$value, damping = physics.dampingDefault.$value, onUndo, canUndo = false, label = 'Magnetic design process' }) {
  const root = useRef(null), grid = useRef(null), nodes = useRef(new Map()), ghost = useRef(null)
  const session = useRef(null), before = useRef(new Map()), animations = useRef(new Set())
  const frame = useRef(0), focusFrame = useRef(0), lastTime = useRef(0), follower = useRef(null), target = useRef(null), still = useRef(false)
  const latest = useRef({ items, onChange }); latest.current = { items, onChange }
  const [drag, setDrag] = useState(null), [announcement, setAnnouncement] = useState('Order ready.')
  const hint = useId()
  const projected = drag ? moveItem(items, drag.id, drag.target) : items
  const clear = () => { animations.current.forEach(animation => animation.cancel()); animations.current.clear() }
  const remember = () => { before.current = new Map([...nodes.current].map(([id, node]) => [id, node.getBoundingClientRect()])) }
  const focus = id => {
    cancelAnimationFrame(focusFrame.current)
    focusFrame.current = requestAnimationFrame(() => nodes.current.get(id)?.querySelector('[data-magnetic-handle]')?.focus({ preventScroll: true }))
  }
  const update = value => { session.current = value; setDrag(value) }
  const stopFollower = () => { cancelAnimationFrame(frame.current); frame.current = 0; lastTime.current = 0 }
  const cancel = () => {
    const active = session.current
    if (!active) return
    remember(); stopFollower(); update(null); focus(active.id)
    setAnnouncement(`Move cancelled. ${active.label} remains in position ${latest.current.items.findIndex(item => item.id === active.id) + 1}.`)
  }
  const paint = () => {
    if (!ghost.current || !follower.current || !session.current) return
    ghost.current.style.transform = `translate(${follower.current.x - session.current.rect.left}px, ${follower.current.y - session.current.rect.top}px)`
  }
  const follow = time => {
    frame.current = 0
    if (!target.current || !follower.current || !session.current) return
    const dt = lastTime.current ? Math.min((time - lastTime.current) / 1000, 1 / 30) : 1 / 60
    lastTime.current = time
    const value = follower.current, destination = target.current
    if (still.current) { value.x = destination.x; value.y = destination.y; value.vx = value.vy = 0 }
    else {
      const x = springStep(value.x, value.vx, destination.x, stiffness, damping, dt)
      const y = springStep(value.y, value.vy, destination.y, stiffness, damping, dt)
      Object.assign(value, { x: x.position, y: y.position, vx: x.velocity, vy: y.velocity })
    }
    paint()
    if (Math.hypot(value.x - destination.x, value.y - destination.y, value.vx, value.vy) > .1) frame.current = requestAnimationFrame(follow)
    else lastTime.current = 0
  }
  useEffect(() => {
    const queries = ['(prefers-reduced-motion: reduce)', '(forced-colors: active)'].map(query => window.matchMedia(query))
    const preference = () => {
      still.current = queries.some(query => query.matches)
      if (still.current) { clear(); stopFollower(); if (follower.current && target.current) { Object.assign(follower.current, target.current, { vx: 0, vy: 0 }); paint() } }
    }
    const outside = event => { if (!root.current?.contains(event.target)) cancel() }
    const hidden = () => { if (document.hidden) cancel() }
    preference(); queries.forEach(query => query.addEventListener('change', preference))
    window.addEventListener('scroll', cancel, true); window.addEventListener('resize', cancel); window.addEventListener('blur', cancel)
    document.addEventListener('visibilitychange', hidden); document.addEventListener('pointerdown', outside)
    return () => { clear(); stopFollower(); cancelAnimationFrame(focusFrame.current); queries.forEach(query => query.removeEventListener('change', preference)); window.removeEventListener('scroll', cancel, true); window.removeEventListener('resize', cancel); window.removeEventListener('blur', cancel); document.removeEventListener('visibilitychange', hidden); document.removeEventListener('pointerdown', outside) }
  }, [])
  useEffect(() => { cancel() }, [items, radius, stiffness, damping])
  useLayoutEffect(() => {
    clear()
    if (!still.current) for (const [id, node] of nodes.current) {
      const previous = before.current.get(id), current = node.getBoundingClientRect()
      if (!previous || id === drag?.id) continue
      const dx = previous.left - current.left, dy = previous.top - current.top
      if (Math.abs(dx) + Math.abs(dy) < .5) continue
      const spring = springFrames(dx, dy, stiffness, damping)
      const animation = node.animate(spring.frames, { duration: spring.duration, easing: 'linear' })
      animations.current.add(animation)
      animation.onfinish = () => animations.current.delete(animation)
    }
    before.current.clear()
    if (drag) focus(drag.id)
    paint()
  }, [items, drag?.id, drag?.target, stiffness, damping])
  const start = (item, input, event) => {
    if (session.current) return
    clear(); remember()
    const rect = nodes.current.get(item.id).getBoundingClientRect()
    const slots = items.map(value => { const box = nodes.current.get(value.id).getBoundingClientRect(); return { x: box.left + box.width / 2, y: box.top + box.height / 2 } })
    const index = items.findIndex(value => value.id === item.id)
    const columns = getComputedStyle(grid.current).gridTemplateColumns.split(' ').length
    follower.current = { x: rect.left, y: rect.top, vx: 0, vy: 0 }; target.current = { x: rect.left, y: rect.top }
    if (input === 'pointer') root.current.setPointerCapture(event.pointerId)
    update({ id: item.id, label: item.label, input, target: index, snapped: index, slots, columns, rect, x: event?.clientX, y: event?.clientY, pointerId: event?.pointerId })
    setAnnouncement(`Picked up ${item.label}, position ${index + 1} of ${items.length}. Arrow keys preview a position; Space places; Escape cancels.`)
  }
  const preview = (index, snapped = index) => {
    const active = session.current
    if (!active || (active.target === index && active.snapped === snapped)) return
    if (active.target !== index) remember()
    update({ ...active, target: index, snapped })
    setAnnouncement(snapped == null ? 'Outside the snap range. Move closer to a target, or cancel.' : `${active.label} will land in position ${index + 1} of ${items.length}.`)
  }
  const commit = () => {
    const active = session.current
    if (!active) return
    if (active.snapped == null) { cancel(); return }
    remember()
    if (active.input === 'pointer' && ghost.current) before.current.set(active.id, ghost.current.getBoundingClientRect())
    stopFollower(); update(null)
    const next = moveItem(latest.current.items, active.id, active.target)
    if (next !== latest.current.items) latest.current.onChange(next)
    setAnnouncement(`${active.label} placed in position ${active.target + 1} of ${items.length}.`)
    focus(active.id)
  }
  const move = (item, index) => {
    remember(); const next = moveItem(items, item.id, index); if (next !== items) onChange(next)
    setAnnouncement(`${item.label} placed in position ${index + 1} of ${items.length}.`); focus(item.id)
  }
  const picked = items.find(item => item.id === drag?.id)
  return <Stack ref={root} className="a1-magnetic-reorder" gap={16}
    onPointerMove={event => {
      const active = session.current
      if (active?.input !== 'pointer' || active.pointerId !== event.pointerId) return
      const point = { x: active.rect.left + event.clientX - active.x + active.rect.width / 2, y: active.rect.top + event.clientY - active.y + active.rect.height / 2 }
      const snapped = magneticTarget(active.slots, point, active.snapped, radius, physics.hysteresis.$value)
      preview(snapped ?? active.target, snapped)
      const attracted = still.current ? point : attractedPoint(point, snapped == null ? null : active.slots[snapped], radius, physics.attraction.$value)
      target.current = { x: attracted.x - active.rect.width / 2, y: attracted.y - active.rect.height / 2 }
      if (still.current) { Object.assign(follower.current, target.current); paint() }
      else if (!frame.current) frame.current = requestAnimationFrame(follow)
    }}
    onPointerUp={event => {
      if (session.current?.pointerId !== event.pointerId) return
      const box = grid.current.getBoundingClientRect()
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) cancel(); else commit()
    }} onPointerCancel={cancel} onLostPointerCapture={cancel}
    onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); cancel() } else if (event.key === 'Tab') cancel() }}>
    <Paragraph id={hint} size="sm" color="muted">Drag a handle toward a tile. The outlined slot shows exactly where it will land. Or use Space to pick up, arrow keys to move, Space to place and Escape to cancel.</Paragraph>
    <Grid ref={grid} role="list" aria-label={label} columns={{ xs: 2, lg: 3 }} gap={16} className="a1-magnetic-reorder__grid">
      {projected.map((item, index) => <div role="listitem" key={item.id} ref={node => { if (node) nodes.current.set(item.id, node); else nodes.current.delete(item.id) }}
        className="a1-magnetic-reorder__tile" data-item={item.id} data-picked={drag?.id === item.id || undefined} data-snapped={drag?.id === item.id && drag.snapped != null || undefined}>
        <Card><Stack gap={12}>
          <Stack direction="row" justify="between" align="center" gap={4}>
            <Paragraph size="xs" color="muted">{drag?.id === item.id ? drag.snapped == null ? 'No target' : `Drop here · ${index + 1}` : `Position ${index + 1}`}</Paragraph>
            <IconButton icon="drag_indicator" label={`Move ${item.label}`} aria-describedby={hint} aria-pressed={drag?.id === item.id} data-magnetic-handle className="a1-magnetic-reorder__handle"
              onContextMenu={event => event.preventDefault()}
              onPointerDown={event => { if (event.button === 0 && event.isPrimary) { event.currentTarget.focus(); start(item, 'pointer', event) } }}
              onClick={event => { if (event.detail === 0) { if (session.current?.id === item.id) commit(); else start(item, 'keyboard') } }}
              onKeyDown={event => {
                if ([' ', 'Enter'].includes(event.key)) { event.preventDefault(); if (!event.repeat) { if (session.current?.id === item.id) commit(); else start(item, 'keyboard') } }
                else if (session.current?.id === item.id && ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key)) {
                  event.preventDefault(); const active = session.current
                  const horizontal = getComputedStyle(grid.current).direction === 'rtl' ? -1 : 1
                  const delta = { ArrowLeft: -horizontal, ArrowRight: horizontal, ArrowUp: -active.columns, ArrowDown: active.columns }[event.key]
                  preview(event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : Math.max(0, Math.min(items.length - 1, active.target + delta)))
                }
              }} />
          </Stack>
          <Heading as="h2" size="sm">{item.label}</Heading>
          <Paragraph size="sm" color="muted">{item.description}</Paragraph>
          <Stack direction="row" gap={4}>
            <IconButton size="sm" icon="arrow_back" label={`Move ${item.label} earlier`} disabled={Boolean(drag) || index === 0} onClick={() => move(item, index - 1)} />
            <IconButton size="sm" icon="arrow_forward" label={`Move ${item.label} later`} disabled={Boolean(drag) || index === items.length - 1} onClick={() => move(item, index + 1)} />
          </Stack>
        </Stack></Card>
      </div>)}
    </Grid>
    <ButtonContainer align="start">
      <Button variant="secondary" disabled={!drag} onClick={cancel}>Cancel move</Button>
      <Button variant="tertiary" disabled={!canUndo || Boolean(drag)} onClick={() => { remember(); onUndo?.(); setAnnouncement('Last move undone.') }}>Undo</Button>
    </ButtonContainer>
    <Paragraph role="status" aria-live="polite" aria-atomic="true" size="sm">{announcement}</Paragraph>
    {drag?.input === 'pointer' && picked && createPortal(<div ref={ghost} className="a1-magnetic-reorder__ghost" aria-hidden="true"
      style={{ left: drag.rect.left, top: drag.rect.top, width: drag.rect.width, height: drag.rect.height }}>
      <Card><Stack gap={12}><Paragraph size="sm">Moving {picked.label}</Paragraph><Heading as="span" size="sm">{picked.label}</Heading><Paragraph size="sm">{picked.description}</Paragraph></Stack></Card>
    </div>, document.body)}
  </Stack>
}
