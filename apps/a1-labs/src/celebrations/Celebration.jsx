import React, { useEffect, useRef } from 'react'
import { Icon } from '@gtivr4/a1-design-system-react'
import { createBurst, createConfetti, createRocket, rocketLanded, seededRandom, stepParticles, stillVisible } from './particles.js'
import { Fenex } from '../fenex/Fenex.jsx'
import './celebrations.css'

// Celebrations for a successful submission, from a quiet check to a confetti
// explosion. All are decorative (aria-hidden): the success heading carries
// the message. With reduced motion every style shows its still, final state
// and the particle effects don't run.

export const CELEBRATIONS = [
  { id: 'check', label: 'Check', icon: 'check_circle', particles: false, summary: 'A large check springs in. Quiet and clear.' },
  { id: 'rings', label: 'Rings', icon: 'radio_button_checked', particles: false, summary: 'Rings ripple out from the check.' },
  { id: 'stamp', label: 'Stamp', icon: 'approval', particles: false, summary: 'A “You’re in” stamp slams down and the card jolts.' },
  { id: 'sparkles', label: 'Sparkles', icon: 'auto_awesome', particles: false, summary: 'Sparkles twinkle around the check.' },
  { id: 'fenex', label: 'Fenex', icon: 'pets', particles: false, summary: 'Fenex the fox jumps for joy, arms raised, as stars and confetti fall.' },
  { id: 'fireworks', label: 'Fireworks', icon: 'celebration', particles: true, summary: 'Fireworks rise and burst across the screen.' },
  { id: 'confetti', label: 'Confetti', icon: 'festival', particles: true, summary: 'An explosion of confetti bursts from the check and rains down.' },
]

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const token = name => getComputedStyle(document.documentElement).getPropertyValue(`--component-celebration-${name}`)
const PALETTE = ['info', 'success', 'warn', 'error'].map(tone => `--semantic-color-status-${tone}-background`).concat('--semantic-color-action-background')

// Full-screen particles in the top layer (a manual popover), so they float
// over everything without a z-index. Runs once, then hides itself.
function ParticleLayer({ kind, amount, origin, seed }) {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas?.showPopover || reducedMotion()) return undefined
    canvas.showPopover()
    const ratio = window.devicePixelRatio || 1
    const width = window.innerWidth
    const height = window.innerHeight
    canvas.width = width * ratio
    canvas.height = height * ratio
    const context = canvas.getContext('2d')
    context.scale(ratio, ratio)
    const style = getComputedStyle(canvas)
    const colors = PALETTE.map(name => style.getPropertyValue(name).trim()).filter(Boolean)
    const random = seededRandom(seed)
    const gravity = Number(token('gravity')) || 900
    const sparkLife = Number(token('spark-life')) || 1.4
    const start = origin() ?? { x: width / 2, y: height / 2 }

    let particles = []
    if (kind === 'confetti') {
      particles = createConfetti({ count: Number(token(`confetti-${amount}`)) || 150, origin: start, colors, random, speed: [400, 1100] })
    } else {
      const rockets = Number(token(`rockets-${amount}`)) || 4
      particles = Array.from({ length: rockets }, (_, i) => createRocket({
        from: { x: width * (0.15 + random() * 0.7), y: height },
        target: { x: width * (0.15 + random() * 0.7), y: height * (0.15 + random() * 0.3) },
        delay: i * 0.35 + random() * 0.15,
        duration: 0.6 + random() * 0.3,
      }))
    }

    let frame = 0
    let last = performance.now()
    const draw = now => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      stepParticles(particles, dt, { gravity })
      // Rockets that reach their height burst into sparks.
      for (const rocket of particles.filter(p => p.kind === 'rocket' && rocketLanded(p) && !p.burst)) {
        rocket.burst = true
        particles.push(...createBurst({ count: 64, origin: { x: rocket.x, y: rocket.y }, colors, random }))
      }
      particles = particles.filter(p => stillVisible(p, height, sparkLife))
      context.clearRect(0, 0, width, height)
      for (const p of particles) {
        if (p.kind === 'confetti') {
          context.save()
          context.translate(p.x, p.y)
          context.rotate(p.rotation)
          context.scale(1, Math.cos(p.flip))
          context.fillStyle = p.color
          if (p.round) { context.beginPath(); context.arc(0, 0, p.width / 2, 0, Math.PI * 2); context.fill() }
          else context.fillRect(-p.width / 2, -p.height / 2, p.width, p.height)
          context.restore()
        } else if (p.kind === 'spark') {
          context.globalAlpha = Math.max(0, 1 - p.age / sparkLife)
          context.fillStyle = p.color
          context.beginPath(); context.arc(p.x, p.y, p.size, 0, Math.PI * 2); context.fill()
          context.globalAlpha = 1
        } else if (p.age >= p.delay) {
          context.fillStyle = colors[0]
          context.beginPath(); context.arc(p.x, p.y, 2.5, 0, Math.PI * 2); context.fill()
        }
      }
      if (particles.length) frame = requestAnimationFrame(draw)
      else canvas.hidePopover()
    }
    frame = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(frame)
      if (canvas.matches(':popover-open')) canvas.hidePopover()
    }
  }, [kind, amount, seed])
  return <canvas ref={ref} popover="manual" className="a1-celebration__particles" aria-hidden="true" />
}

/**
 * @param {object} props
 * @param {string} props.variant  One of CELEBRATIONS.
 * @param {'light'|'normal'|'lots'} [props.amount='normal']  Particle amount (Fireworks and Confetti).
 * @param {number} props.run  Changes to replay the celebration.
 */
export function Celebration({ variant, amount = 'normal', run }) {
  const checkRef = useRef(null)
  const centre = () => {
    const rect = checkRef.current?.getBoundingClientRect()
    return rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : null
  }
  return (
    <div className="a1-celebration" data-variant={variant} key={run} aria-hidden="true">
      {variant === 'stamp' ? (
        <span className="a1-celebration__stamp">You’re in</span>
      ) : variant === 'fenex' ? (
        // He settles into his still pose after a few seconds, so the motion doesn't loop indefinitely.
        <span className="a1-celebration__character"><Fenex decorative settleAfter={Number.parseFloat(token('character-settle')) || 4800} /></span>
      ) : (
        <span className="a1-celebration__check" ref={checkRef}><Icon name="check_circle" size="xJumbo" fill /></span>
      )}
      {variant === 'rings' && [0, 1, 2].map(i => <span key={i} className="a1-celebration__ring" style={{ '--a1-celebration-index': i }} />)}
      {variant === 'sparkles' && Array.from({ length: 8 }, (_, i) => (
        <span key={i} className="a1-celebration__sparkle" style={{ '--a1-celebration-index': i }}><Icon name="auto_awesome" size={i % 2 ? 'sm' : 'lg'} fill /></span>
      ))}
      {(variant === 'confetti' || variant === 'fireworks') && <ParticleLayer kind={variant} amount={amount} origin={centre} seed={run + 1} />}
    </div>
  )
}
