import { useLayoutEffect, useRef } from 'react'

/** Pause only after a pointer click commits a change; leave/re-enter to resume. */
export function useHoverPause(treatment, getTarget, { onClickCapture, onPointerOut }) {
  const clicked = useRef(null)
  function clear() {
    clicked.current?.item.removeAttribute('data-a1-hover-paused')
    clicked.current = null
  }
  useLayoutEffect(() => {
    const pending = clicked.current
    if (pending && pending.readState() !== pending.before) pending.item.setAttribute('data-a1-hover-paused', '')
  })
  useLayoutEffect(() => clear, [treatment])

  return {
    onClickCapture(event) {
      onClickCapture?.(event)
      if (treatment !== 'match-active' || event.defaultPrevented || event.detail === 0) return
      const target = getTarget(event.target)
      if (!target || !event.currentTarget.contains(target.item)) return
      if (clicked.current?.item !== target.item) clear()
      clicked.current = target
    },
    onPointerOut(event) {
      onPointerOut?.(event)
      if (clicked.current && !clicked.current.item.contains(event.relatedTarget)) clear()
    },
  }
}
