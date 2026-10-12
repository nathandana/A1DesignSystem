import React, { useLayoutEffect, useRef, useState } from 'react'
import { Heading, Icon, Paragraph } from '@gtivr4/a1-design-system-react'
import { horizontalConnector, resolveOrientation, sideOf, verticalConnector } from './timeline-geometry.js'
import './timeline.css'

// Timeline: milestones on an axis, each joined by a connector that wraps a
// quarter arc around its badge and turns into a stem ending at a node beside
// its details. Horizontally, milestones alternate above and below the axis;
// vertically, the axis runs down the inline start with every milestone's
// details after it (year as an eyebrow), which keeps room for text on phones. The layout is CSS grid (text wraps freely); the connectors are
// an SVG drawn from the measured positions. Content is an ordered list; the
// badges and connectors are decorative.

const TONES = ['accent', 'info', 'success', 'warn', 'error', 'neutral']

function toPx(value, root) {
  const number = Number.parseFloat(value) || 0
  if (!value.trim().endsWith('rem')) return number
  return number * Number.parseFloat(getComputedStyle(root.ownerDocument.documentElement).fontSize)
}

function measure(track, list) {
  const style = getComputedStyle(track)
  const token = name => toPx(style.getPropertyValue(`--component-timeline-${name}`), track)
  const orientation = track.closest('[data-orientation]')?.dataset.orientation
  const arcGap = token('arc-gap')
  const nodeRadius = token('node-size') / 2
  const nodeGap = token('node-gap')
  const lineWidth = token('line-width')
  const dir = style.direction === 'rtl' ? -1 : 1
  const box = track.getBoundingClientRect()
  let previous = null
  const connectors = [...list.children].map((item, index) => {
    const badge = item.querySelector('.a1-timeline__badge').getBoundingClientRect()
    const details = item.querySelector('.a1-timeline__details').getBoundingClientRect()
    const r = badge.width / 2
    const cx = badge.left - box.left + r
    const cy = badge.top - box.top + r
    const radius = r + arcGap
    let path
    let node
    if (orientation === 'vertical') {
      // The stem turns towards the details (inline end of the axis).
      const towardsEnd = details.left + details.width / 2 > badge.left + r
      const nodeX = towardsEnd ? details.left - box.left - nodeGap - nodeRadius : details.right - box.left + nodeGap + nodeRadius
      node = { x: nodeX, y: cy }
      path = verticalConnector({ fromY: previous ? previous.cy + previous.r : 0, cx, cy, radius, nodeX, nodeRadius })
    } else {
      const side = sideOf(index)
      const nodeY = side === 'above' ? details.bottom - box.top + nodeGap + nodeRadius : details.top - box.top - nodeGap - nodeRadius
      node = { x: cx, y: nodeY }
      const fromX = previous ? previous.cx + dir * previous.r : (dir === 1 ? 0 : box.width)
      path = horizontalConnector({ fromX, cx, cy, radius, side, nodeY, nodeRadius, dir })
    }
    previous = { cx, cy, r }
    return { id: item.dataset.id, tone: item.dataset.tone, path, node }
  })
  return { width: box.width, height: box.height, nodeRadius, lineWidth, connectors }
}

/**
 * @param {object} props
 * @param {{ id: string, year: string, title: string, items?: string[], icon?: string, tone?: string }[]} props.milestones
 * @param {'auto'|'horizontal'|'vertical'} [props.layout='auto']  Auto is horizontal from `horizontalMinWidth` up.
 * @param {number} [props.horizontalMinWidth=960]  Container width (px) where auto switches to horizontal.
 * @param {'h2'|'h3'|'h4'} [props.headingLevel='h3']  Level of each milestone's title.
 */
export function Timeline({ milestones, layout = 'auto', horizontalMinWidth = 960, headingLevel = 'h3', className = '', ...props }) {
  const rootRef = useRef(null)
  const scrollerRef = useRef(null)
  const trackRef = useRef(null)
  const listRef = useRef(null)
  const [orientation, setOrientation] = useState(layout === 'vertical' ? 'vertical' : 'horizontal')
  const [shape, setShape] = useState(null)
  const [scrollable, setScrollable] = useState(false)

  useLayoutEffect(() => {
    const root = rootRef.current
    const update = () => {
      const next = resolveOrientation(layout, root.clientWidth, horizontalMinWidth)
      if (next !== root.dataset.orientation) {
        setOrientation(next)
        return
      }
      setShape(measure(trackRef.current, listRef.current))
      const scroller = scrollerRef.current
      setScrollable(scroller.scrollWidth > scroller.clientWidth + 1)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(root)
    observer.observe(listRef.current)
    return () => observer.disconnect()
  }, [layout, horizontalMinWidth, orientation, milestones])

  return (
    <div {...props} ref={rootRef} className={`a1-timeline ${className}`.trim()} data-orientation={orientation}
      style={{ '--a1-timeline-count': milestones.length }}>
      {/* Only focusable (to scroll by keyboard) when a forced horizontal layout overflows. */}
      <div ref={scrollerRef} className="a1-timeline__scroller" tabIndex={scrollable ? 0 : undefined}
        role={scrollable ? 'region' : undefined} aria-label={scrollable ? 'Timeline, scrolls sideways' : undefined}>
        <div ref={trackRef} className="a1-timeline__track">
          {shape && (
            <svg className="a1-timeline__connectors" aria-hidden="true" focusable="false"
              width={shape.width} height={shape.height} viewBox={`0 0 ${shape.width} ${shape.height}`}>
              {shape.connectors.map(connector => (
                <g key={connector.id} data-tone={connector.tone}>
                  <path d={connector.path} />
                  <circle cx={connector.node.x} cy={connector.node.y} r={shape.nodeRadius - shape.lineWidth / 2} />
                </g>
              ))}
            </svg>
          )}
          <ol ref={listRef} className="a1-timeline__list">
            {milestones.map((milestone, index) => (
              <li key={milestone.id} className="a1-timeline__item" data-id={milestone.id}
                data-tone={TONES.includes(milestone.tone) ? milestone.tone : 'accent'} data-side={sideOf(index)}>
                {/* Vertically, the year is an eyebrow above the title (A1 eyebrow pattern). */}
                <Paragraph className="a1-timeline__year" {...(orientation === 'vertical' ? { size: 'sm', color: 'muted' } : { size: 'lg', weight: 'bold' })}>
                  <time dateTime={milestone.year}>{milestone.year}</time>
                </Paragraph>
                <span className="a1-timeline__badge" aria-hidden="true">
                  {milestone.icon && <Icon name={milestone.icon} size="lg" fill />}
                </span>
                <div className="a1-timeline__details">
                  <Heading as={headingLevel} size="sm">{milestone.title}</Heading>
                  {milestone.items?.length > 0 && (
                    <ul className="a1-timeline__points">
                      {milestone.items.map(point => (
                        <li key={point}><Paragraph as="span" size="sm" color="muted">{point}</Paragraph></li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
