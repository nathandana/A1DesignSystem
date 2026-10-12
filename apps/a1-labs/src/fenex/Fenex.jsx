import React, { useEffect, useRef, useState } from 'react'
import markup from './fenex-celebrate.svg?raw'
import './fenex.css'

// Fenex the fox: a self-contained animated SVG, inlined so the page's
// reduced-motion setting reaches its CSS. Playback is controlled through the
// Web Animations API (pause, speed); `still` shows his resting pose with the
// confetti scattered around him.

/**
 * @param {object} props
 * @param {boolean} [props.playing=true]  Pause or play every part of the animation.
 * @param {number} [props.speed=1]  Playback rate.
 * @param {boolean} [props.still=false]  Show the still pose (as with reduced motion).
 * @param {boolean} [props.confetti=true]  Show the falling stars and confetti.
 * @param {string} [props.height]  CSS length for his height.
 * @param {number} [props.settleAfter]  Milliseconds after which he settles into the still pose.
 * @param {boolean} [props.decorative=false]  Hide from assistive technology when other text carries the meaning.
 */
export function Fenex({ playing = true, speed = 1, still = false, confetti = true, height, settleAfter, decorative = false, className = '' }) {
  const ref = useRef(null)
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    if (!settleAfter) return undefined
    const timer = setTimeout(() => setSettled(true), settleAfter)
    return () => clearTimeout(timer)
  }, [settleAfter])

  useEffect(() => {
    for (const animation of ref.current?.getAnimations({ subtree: true }) ?? []) {
      animation.playbackRate = speed
      if (playing) animation.play()
      else animation.pause()
    }
  }, [playing, speed, still, confetti, settled])

  return (
    <span ref={ref} className={`a1-fenex ${className}`.trim()} data-still={still || settled || undefined}
      data-confetti={confetti ? undefined : 'off'} aria-hidden={decorative || undefined}
      style={height ? { '--a1-fenex-height': height } : undefined}
      dangerouslySetInnerHTML={{ __html: markup }} />
  )
}
