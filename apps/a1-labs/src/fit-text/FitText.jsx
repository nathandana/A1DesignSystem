import React, { useCallback, useLayoutEffect, useRef } from 'react'
import { fitSizes } from './fit-model.js'
import './fit-text.css'

// Fitted type: each line is measured, then scaled so it fills the container's
// width. Lines with fewer or narrower letters come out larger. Sizes are
// recalculated whenever the container resizes or fonts finish loading.

const px = (value, element) => {
  const number = Number.parseFloat(value)
  if (!Number.isFinite(number)) return Infinity
  return value.trim().endsWith('rem') ? number * Number.parseFloat(getComputedStyle(element.ownerDocument.documentElement).fontSize) : number
}

/**
 * @param {object} props
 * @param {string[]} props.lines
 * @param {'each'|'match'} [props.mode='each']  Fill every line, or one size set by the longest line.
 * @param {string} [props.max]  CSS length capping the size ('none' for no cap).
 * @param {'start'|'center'} [props.align='start']
 * @param {string} [props.font]  CSS font-family value.
 * @param {boolean} [props.showSizes=false]  Label each line with its size.
 */
export function FitText({ lines, mode = 'each', max = 'none', align = 'start', font, weight = 'bold', showSizes = false, as: Element = 'p', ...props }) {
  const ref = useRef(null)

  const fit = useCallback(() => {
    const block = ref.current
    if (!block) return
    const style = getComputedStyle(block)
    const reference = Number(style.getPropertyValue('--component-fit-text-measure-size')) || 100
    const min = px(style.getPropertyValue('--component-fit-text-min-size'), block)
    const cap = max === 'none' ? Infinity : px(getComputedStyle(block).getPropertyValue('--a1-fit-text-max'), block)
    // Size labels sit beside each line, so reserve room for the widest one.
    const labels = [...block.querySelectorAll('.a1-fit-text__size')]
    for (const label of labels) label.textContent = '000 px'
    const gap = labels.length ? Number.parseFloat(getComputedStyle(labels[0].parentElement).columnGap) || 0 : 0
    const reserve = labels.length ? labels[0].getBoundingClientRect().width + gap : 0
    const available = block.clientWidth - reserve
    const spans = [...block.querySelectorAll('.a1-fit-text__line')]
    for (const span of spans) { span.style.fontSize = `${reference}px`; span.dataset.wraps = 'false' }
    const widths = spans.map(span => span.getBoundingClientRect().width)
    fitSizes(widths, available, { reference, min, max: cap, mode }).forEach(({ size, wraps }, i) => {
      const span = spans[i]
      span.style.fontSize = `${size}px`
      span.dataset.wraps = String(wraps)
      const label = span.parentElement.querySelector('.a1-fit-text__size')
      if (label) label.textContent = `${Math.round(size)} px`
    })
  }, [lines, mode, max, font, weight, showSizes])

  useLayoutEffect(() => {
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(ref.current)
    document.fonts?.ready.then(fit)
    document.fonts?.addEventListener('loadingdone', fit)
    return () => { observer.disconnect(); document.fonts?.removeEventListener('loadingdone', fit) }
  }, [fit])

  return (
    <Element ref={ref} className="a1-fit-text" data-align={align} data-weight={weight}
      style={{ '--a1-fit-text-font': font, '--a1-fit-text-max': max === 'none' ? undefined : max }} {...props}>
      {lines.map((line, i) => (
        <span key={`${i}-${line}`} className="a1-fit-text__row">
          <span className="a1-fit-text__line">{line}</span>
          {showSizes && <span className="a1-fit-text__size" aria-hidden="true" />}
        </span>
      ))}
    </Element>
  )
}
