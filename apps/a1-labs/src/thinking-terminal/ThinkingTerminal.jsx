import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Paragraph } from '@gtivr4/a1-design-system-react'
import { characterDuration, characters, holdDuration, nextLineIndex, normalizeLines } from './thinking-model.js'
import '../../../../packages/react/src/utilities/sr-only.css'
import './thinking-terminal.css'

// Reusable activity indicator: the host owns work, completion and pause controls.
// Status copy is presentation only, never a model's hidden reasoning.
export function ThinkingTerminal({ lines = [], paused = false }) {
  const signature = JSON.stringify(normalizeLines(lines))
  const pool = useMemo(() => JSON.parse(signature), [signature])
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const engine = useRef({ index: 0, elapsed: 0 })
  const [frame, setFrame] = useState({ index: 0, count: 0 })

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    engine.current = { index: 0, elapsed: 0 }
    setFrame({ index: 0, count: 0 })
  }, [signature])

  useEffect(() => {
    if (paused || reduced || !pool.length) return
    let last = performance.now()
    const timer = window.setInterval(() => {
      const now = performance.now()
      const state = engine.current
      // Background tabs must not fast-forward through unread lines.
      if (document.hidden) { last = now; return }
      state.elapsed += Math.min(now - last, characterDuration * 2)
      last = now
      let glyphs = characters(pool[state.index])
      if (state.elapsed >= glyphs.length * characterDuration + holdDuration(pool[state.index]) && pool.length > 1) {
        state.index = nextLineIndex(pool.length, state.index)
        state.elapsed = 0
        glyphs = characters(pool[state.index])
      }
      const count = Math.min(glyphs.length, Math.floor(state.elapsed / characterDuration))
      setFrame(previous => previous.index === state.index && previous.count === count
        ? previous : { index: state.index, count })
    }, characterDuration)
    return () => window.clearInterval(timer)
  }, [pool, paused, reduced])

  const current = pool[frame.index] ?? pool[0] ?? 'Thinking'
  const shown = reduced || !pool.length ? current : characters(current).slice(0, frame.count).join('')
  return (
    <Paragraph as="div" size="sm" className="a1-thinking-terminal" data-paused={paused}>
      <span className="a1-sr-only" role="status" aria-live="polite" aria-atomic="true">
        {paused ? 'Thinking · paused' : 'Thinking'}
      </span>
      <code className="a1-thinking-terminal__output" aria-hidden="true">
        <span className="a1-thinking-terminal__current">{`$ ${shown}`}</span><span className="a1-thinking-terminal__cursor" />
      </code>
    </Paragraph>
  )
}
