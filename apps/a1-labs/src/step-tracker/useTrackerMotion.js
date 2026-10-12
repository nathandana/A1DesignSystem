import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'

export const TRACKER_TRANSITIONS = [
  { id: 'standard', label: 'Standard' },
  { id: 'instant', label: 'Instant' },
  { id: 'fade', label: 'Fade' },
  { id: 'slide', label: 'Slide' },
  { id: 'pop', label: 'Pop' },
  { id: 'bounce', label: 'Bounce' },
  { id: 'ripple', label: 'Ripple' },
]

export function useTrackerMotion(host, { current, total, treatment, align, transition, duration }) {
  const previous = useRef(null), running = useRef(new Set()), ring = useRef(null)
  const stop = useCallback(() => {
    running.current.forEach(animation => animation.cancel())
    running.current.clear()
    ring.current?.remove(); ring.current = null
  }, [])
  useEffect(() => {
    const queries = ['(prefers-reduced-motion: reduce)', '(forced-colors: active)'].map(query => window.matchMedia(query))
    const changed = () => { if (queries.some(query => query.matches)) stop() }
    queries.forEach(query => query.addEventListener('change', changed))
    let width = host.current?.getBoundingClientRect().width
    const observer = new ResizeObserver(() => {
      const next = host.current?.getBoundingClientRect().width
      if (next !== width) { width = next; stop(); previous.current = null }
    })
    if (host.current) observer.observe(host.current)
    return () => { observer.disconnect(); queries.forEach(query => query.removeEventListener('change', changed)); stop() }
  }, [host, stop])
  useLayoutEffect(() => {
    const root = host.current, marker = root?.querySelector('.a1-step-tracker__step--current')
    if (!marker) return
    const old = previous.current
    // During an interrupted slide, begin at the marker's currently painted
    // position. At rest use the saved bounds from before A1 updates its widths.
    const from = running.current.size && old?.node?.isConnected ? old.node.getBoundingClientRect() : old?.bounds
    stop()
    const bounds = marker.getBoundingClientRect()
    previous.current = { current, total, treatment, align, transition, duration, bounds, node: marker }
    const sameSetup = old && ['total', 'treatment', 'align', 'transition', 'duration'].every(key => old[key] === ({ total, treatment, align, transition, duration })[key])
    if (!sameSetup || old.current === current || transition === 'instant' || transition === 'standard' || !marker.animate ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(forced-colors: active)').matches) return
    const style = getComputedStyle(root)
    const token = name => style.getPropertyValue(name).trim()
    const standard = token('--semantic-motion-easing-standard'), expressive = token('--semantic-motion-easing-expressive')
    let target = marker, frames, easing = standard
    if (transition === 'fade') frames = [{ opacity: token('--component-tracker-motion-fade-opacity') }, { opacity: 1 }]
    if (transition === 'slide') frames = [{ transform: `translate(${from.left + from.width / 2 - bounds.left - bounds.width / 2}px, ${from.top + from.height / 2 - bounds.top - bounds.height / 2}px)` }, { transform: 'translate(0, 0)' }]
    if (transition === 'pop') { frames = [{ transform: `scale(${token('--component-tracker-motion-pop-scale')})` }, { transform: 'scale(1)' }]; easing = expressive }
    if (transition === 'bounce') { frames = [{ transform: `translateY(calc(-1 * ${token('--component-tracker-motion-bounce-lift')}))` }, { transform: 'translateY(0)' }]; easing = expressive }
    if (transition === 'ripple') {
      const area = root.getBoundingClientRect()
      target = root.ownerDocument.createElement('span')
      target.className = 'a1-tracker-study__ripple'
      target.setAttribute('aria-hidden', 'true')
      Object.assign(target.style, { left: `${bounds.left - area.left}px`, top: `${bounds.top - area.top}px`, width: `${bounds.width}px`, height: `${bounds.height}px` })
      root.appendChild(target); ring.current = target
      frames = [{ transform: 'scale(1)', opacity: 1 }, { transform: `scale(${token('--component-tracker-motion-ripple-scale')})`, opacity: 0 }]
    }
    if (!frames) return
    const animation = target.animate(frames, { duration: Number(duration), easing })
    running.current.add(animation)
    animation.onfinish = () => { running.current.delete(animation); if (target !== marker) { target.remove(); if (ring.current === target) ring.current = null } }
    return undefined
  }, [host, current, total, treatment, align, transition, duration, stop])
}
