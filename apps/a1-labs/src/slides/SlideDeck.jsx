import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { IconButton, Paragraph, Stack } from '@gtivr4/a1-design-system-react'
import { buildSchedule, layerFrames, mapRect, navigate, staggerDelays, wipeFrames } from './slide-motion.js'
import './slides.css'

// SlideDeck: a 16:9 presentation stage. Slides are drawn on a fixed design
// canvas (component.slides.canvasWidth) scaled to fit, so A1 type tokens keep
// their proportions. During a transition the outgoing and incoming slides are
// two layers on the same canvas, animated with the Web Animations API; morph
// and cascade read the slides' marked pieces (see deck.jsx).

const toMs = value => {
  const text = value.trim()
  const number = Number.parseFloat(text)
  if (!Number.isFinite(number)) return 0
  return text.endsWith('ms') ? number : text.endsWith('s') ? number * 1000 : number
}

const toPx = (value, doc) => {
  const number = Number.parseFloat(value) || 0
  return value.trim().endsWith('rem') ? number * Number.parseFloat(getComputedStyle(doc.documentElement).fontSize) : number
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return reduced
}

const pieces = layer => [...layer.querySelectorAll('[data-part], [data-morph]')]
const builds = layer => [...layer.querySelectorAll('[data-build]')]

/**
 * @param {object} props
 * @param {{ id: string, title: string, accent: string, render: () => React.ReactNode }[]} props.slides
 * @param {number} props.index  Current slide (controlled).
 * @param {(index: number) => void} props.onIndexChange
 * @param {'cut'|'fade'|'push'|'zoom'|'wipe'|'cascade'|'morph'} [props.transition='fade']
 * @param {'all'|'fade'|'rise'|'step'} [props.build='all']
 * @param {'quick'|'standard'|'relaxed'} [props.speed='standard']
 * @param {string} [props.label='Slides']
 */
export function SlideDeck({ slides, index, onIndexChange, transition = 'fade', build = 'all', speed = 'standard', label = 'Slides' }) {
  const stageRef = useRef(null)
  const canvasRef = useRef(null)
  const wipeRef = useRef(null)
  const layers = useRef(new Map())
  const animations = useRef([])
  const runRef = useRef(0)
  const revealRef = useRef('all')
  const reduced = useReducedMotion()
  const [scale, setScale] = useState(1)
  const [shown, setShown] = useState({ index, from: null, dir: 1, run: 0 })
  const [step, setStep] = useState(0)
  const [count, setCount] = useState(0)

  useLayoutEffect(() => {
    const stage = stageRef.current
    const update = () => setScale(stage.clientWidth / canvasRef.current.offsetWidth)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  const settle = () => {
    for (const animation of animations.current) animation.cancel()
    animations.current = []
  }
  const run = (element, frames, timing) => {
    if (!element || !frames) return null
    const animation = element.animate(frames, timing)
    animations.current.push(animation)
    return animation
  }

  // A new index from the host starts a transition from the slide now shown.
  useLayoutEffect(() => {
    if (index === shown.index) return
    settle()
    // Next arrives with no points shown (step-through); anything else shows all.
    setStep(revealRef.current === 'all' ? Number.POSITIVE_INFINITY : 0)
    revealRef.current = 'all'
    setShown(current => ({ index, from: current.index, dir: index > current.index ? 1 : -1, run: current.run + 1 }))
  }, [index])

  // Run the transition and the incoming slide's build.
  useLayoutEffect(() => {
    const thisRun = shown.run
    runRef.current = thisRun
    const canvas = canvasRef.current
    const style = getComputedStyle(canvas)
    const token = name => style.getPropertyValue(`--component-slides-${name}`)
    const duration = toMs(token(`speed-${speed}`)) || toMs(token('speed-standard'))
    const stagger = toMs(token('stagger-step'))
    const buildDuration = toMs(token('build-duration'))
    const shift = toPx(token('shift'), canvas.ownerDocument)
    const easing = style.getPropertyValue('--semantic-motion-easing-standard').trim()
    // Choreography fractions of the transition, from component.slides tokens.
    const handoff = Number(token('handoff'))
    const fadeOutBy = Number(token('fade-out-by'))
    const fadeInFrom = Number(token('fade-in-from'))
    const pieceShare = Number(token('piece-share'))
    const incoming = layers.current.get(shown.index)
    const outgoing = shown.from === null ? null : layers.current.get(shown.from)
    const type = !outgoing ? 'none' : reduced ? 'cut' : transition
    const timing = { duration, easing, fill: 'both' }
    const width = canvas.offsetWidth
    const transitionAnimations = []
    const add = animation => animation && transitionAnimations.push(animation)
    const layout = layer => layer.querySelector('.a1-slides__layout')

    if (type === 'fade' || type === 'push' || type === 'zoom' || type === 'wipe') {
      const visual = { width, zoomOut: Number(token('zoom-out')), zoomIn: Number(token('zoom-in')), handoff }
      if (type !== 'fade') add(run(incoming, layerFrames(type, 'in', shown.dir, visual), timing))
      add(run(outgoing, layerFrames(type, 'out', shown.dir, visual), timing))
      if (type === 'wipe') {
        wipeRef.current.style.setProperty('--a1-slides-wipe', slides[shown.index].accent)
        add(run(wipeRef.current, wipeFrames(shown.dir, width, handoff), { duration, easing }))
      }
    } else if (type === 'cascade') {
      // Pieces leave in reverse order, then the next slide's pieces arrive.
      const leaving = pieces(outgoing).reverse()
      const leaveAt = staggerDelays(leaving.length, stagger, duration * fadeOutBy)
      leaving.forEach((piece, i) => add(run(piece, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateY(${-shift}px)` }],
        { duration: duration * pieceShare, delay: leaveAt[i], easing, fill: 'both' })))
      const bg = getComputedStyle(layout(outgoing)).backgroundColor
      add(run(layout(outgoing), [{ backgroundColor: bg }, { backgroundColor: bg, offset: fadeInFrom }, { backgroundColor: 'transparent', offset: handoff }, { backgroundColor: 'transparent' }], timing))
      const arriving = pieces(incoming)
      const arriveAt = staggerDelays(arriving.length, stagger, duration * fadeOutBy)
      arriving.forEach((piece, i) => add(run(piece, [{ opacity: 0, transform: `translateY(${shift}px)` }, { opacity: 1, transform: 'none' }],
        { duration: duration * pieceShare, delay: duration * handoff + arriveAt[i], easing, fill: 'both' })))
    } else if (type === 'morph') {
      const box = canvas.getBoundingClientRect()
      const rectOf = element => {
        const rect = element.getBoundingClientRect()
        return { x: (rect.left - box.left) / scale, y: (rect.top - box.top) / scale, width: rect.width / scale, height: rect.height / scale }
      }
      const keyed = layer => new Map([...layer.querySelectorAll('[data-morph]')].map(element => [element.dataset.morph, element]))
      const before = keyed(outgoing)
      const after = keyed(incoming)
      const shared = [...after.keys()].filter(key => before.has(key))
      for (const key of shared) {
        const from = before.get(key)
        const to = after.get(key)
        const a = rectOf(from)
        const b = rectOf(to)
        const fromStyle = getComputedStyle(from)
        const toStyle = getComputedStyle(to)
        const same = from.innerHTML === to.innerHTML
        add(run(to, [
          { transformOrigin: '0 0', transform: mapRect(a, b), backgroundColor: fromStyle.backgroundColor, color: fromStyle.color },
          { transformOrigin: '0 0', transform: 'none', backgroundColor: toStyle.backgroundColor, color: toStyle.color },
        ], timing))
        add(run(from, [
          { transformOrigin: '0 0', transform: 'none', backgroundColor: 'transparent', borderColor: 'transparent', boxShadow: 'none' },
          { transformOrigin: '0 0', transform: mapRect(b, a), backgroundColor: 'transparent', borderColor: 'transparent', boxShadow: 'none' },
        ], timing))
        // Different content inside a shared piece cross-fades as it moves.
        for (const child of to.children) add(run(child, same ? null : [{ opacity: 0 }, { opacity: 0, offset: fadeOutBy }, { opacity: 1 }], timing))
        for (const child of from.children) add(run(child, same ? [{ opacity: 0 }, { opacity: 0 }] : [{ opacity: 1 }, { opacity: 0, offset: fadeOutBy }, { opacity: 0 }], timing))
      }
      for (const piece of pieces(outgoing)) {
        if (!shared.includes(piece.dataset.morph)) add(run(piece, [{ opacity: 1 }, { opacity: 0, offset: fadeOutBy }, { opacity: 0 }], timing))
      }
      for (const piece of pieces(incoming)) {
        if (!shared.includes(piece.dataset.morph)) add(run(piece, [{ opacity: 0 }, { opacity: 0, offset: fadeInFrom }, { opacity: 1 }], timing))
      }
      const fromBg = getComputedStyle(layout(outgoing)).backgroundColor
      const toBg = getComputedStyle(layout(incoming)).backgroundColor
      add(run(layout(outgoing), [{ backgroundColor: fromBg }, { backgroundColor: 'transparent', offset: fadeOutBy }, { backgroundColor: 'transparent' }], timing))
      add(run(layout(incoming), [{ backgroundColor: fromBg }, { backgroundColor: toBg }], timing))
    }

    // Remove the outgoing slide once its transition has finished.
    const done = () => { if (runRef.current === thisRun) setShown(current => (current.from === null ? current : { ...current, from: null })) }
    if (!outgoing) { /* first slide */ } else if (transitionAnimations.length === 0) done()
    else Promise.all(transitionAnimations.map(animation => animation.finished)).then(done, () => {})

    // Build: the incoming slide's points load after the transition.
    const points = builds(incoming)
    setCount(points.length)
    const start = type === 'none' || type === 'cut' ? 0 : duration
    buildSchedule(build, points.length, { start, step: stagger, shift, reduced }).forEach((plan, i) => {
      run(points[i], plan.frames, { duration: buildDuration, delay: plan.delay, easing, fill: 'backwards' })
    })
  }, [shown.run])

  // Step-through hides points not yet revealed; revealing one rises it in.
  useLayoutEffect(() => {
    const incoming = layers.current.get(shown.index)
    if (!incoming) return
    const points = builds(incoming)
    points.forEach((point, i) => point.toggleAttribute('data-build-hidden', build === 'step' && i >= step))
  }, [shown.run, step, build])

  useEffect(() => () => settle(), [])

  const go = action => {
    const result = navigate({ build, step: Math.min(step, count), count, index, total: slides.length }, action)
    if (result.type === 'step') {
      setStep(result.step)
      const point = builds(layers.current.get(shown.index))[result.step - 1]
      if (point && !reduced) {
        const style = getComputedStyle(canvasRef.current)
        const shift = toPx(style.getPropertyValue('--component-slides-shift'), canvasRef.current.ownerDocument)
        run(point, [{ opacity: 0, transform: `translateY(${shift}px)` }, { opacity: 1, transform: 'none' }],
          { duration: toMs(style.getPropertyValue('--component-slides-build-duration')), easing: style.getPropertyValue('--semantic-motion-easing-standard').trim() })
      }
    } else if (result.type === 'go') {
      revealRef.current = result.reveal
      onIndexChange(result.index)
    }
  }

  const onKeyDown = event => {
    const actions = { ArrowRight: 'next', PageDown: 'next', ' ': 'next', ArrowLeft: 'previous', PageUp: 'previous' }
    if (actions[event.key]) { event.preventDefault(); go(actions[event.key]) }
    else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      revealRef.current = 'all'
      onIndexChange(event.key === 'Home' ? 0 : slides.length - 1)
    }
  }

  const current = slides[shown.index]
  const visibleStep = Math.min(step, count)
  const pointsLeft = build === 'step' && visibleStep < count
  const layerList = [shown.index, shown.from].filter(value => value !== null)

  return (
    <div className="a1-slides">
      <div ref={stageRef} className="a1-slides__stage" tabIndex={0} role="region" aria-roledescription="carousel"
        aria-label={`${label}. Use the arrow keys to move between slides.`} onKeyDown={onKeyDown}>
        <div ref={canvasRef} className="a1-slides__canvas" style={{ '--a1-slides-scale': scale }}>
          {layerList.map(slideIndex => {
            const slide = slides[slideIndex]
            const out = slideIndex !== shown.index
            return (
              <div key={slide.id} ref={node => { if (node) layers.current.set(slideIndex, node); else layers.current.delete(slideIndex) }}
                className="a1-slides__slide" data-layer={out ? 'out' : 'in'} role="group" aria-roledescription="slide"
                aria-label={`${slideIndex + 1} of ${slides.length}: ${slide.title}`} aria-hidden={out || undefined} inert={out || undefined}>
                {slide.render()}
              </div>
            )
          })}
          <div ref={wipeRef} className="a1-slides__wipe" aria-hidden="true" />
        </div>
      </div>
      <Stack direction="row" align="center" justify="between" gap={12}>
        <IconButton icon="arrow_back" label="Previous slide" variant="secondary" disabled={index === 0} onClick={() => go('previous')} />
        <Paragraph role="status" aria-live="polite" aria-atomic="true" align="center" size="sm">
          {`Slide ${shown.index + 1} of ${slides.length}: ${current.title}`}
          {build === 'step' && count > 0 ? ` · Point ${visibleStep} of ${count}` : ''}
        </Paragraph>
        <IconButton icon="arrow_forward" label={pointsLeft ? 'Show next point' : 'Next slide'} variant="secondary"
          disabled={!pointsLeft && index === slides.length - 1} onClick={() => go('next')} />
      </Stack>
    </div>
  )
}
