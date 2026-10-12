import React, { useEffect, useState } from 'react'
import { CircularProgress, Icon, List, ListItem, MessageBadge, StatusBar } from '@gtivr4/a1-design-system-react'
import { FULL_BITS, LEVEL_NAMES, describeTime, levelFor, toneFor } from './password-model.js'
import './password-strength.css'

// Password strength meters for the Labs experiment. Every style shares one
// semantic element (role="meter" with a text value), names the level in words
// (never colour alone) and announces changes politely once typing pauses.
// Visual pieces built from A1 components are hidden from assistive
// technology because the meter's value text already describes them.

export const STRENGTH_STYLES = [
  { id: 'segments', label: 'Segments', icon: 'view_week', summary: 'A row of segments fills and changes colour, with the level named beside it.' },
  { id: 'bar', label: 'Bar', icon: 'linear_scale', summary: 'The A1 status bar fills smoothly as the password gains strength.' },
  { id: 'ring', label: 'Ring', icon: 'donut_large', summary: 'A1 circular progress fills around a lock that closes at the top level.' },
  { id: 'underline', label: 'Underline', icon: 'border_bottom', summary: 'The field’s own bottom edge becomes the meter.' },
  { id: 'badge', label: 'Badge', icon: 'label', summary: 'Only a status badge naming the level: the quietest option.' },
  { id: 'checklist', label: 'Checklist', icon: 'checklist', summary: 'Each requirement ticks off as it is met, beside a strength badge.' },
  { id: 'time', label: 'Time to guess', icon: 'timer', summary: 'Strength explained as how long an attacker would need to guess it.' },
]

const token = name => getComputedStyle(document.documentElement).getPropertyValue(`--component-password-strength-${name}`)
const ms = value => (value.trim().endsWith('ms') ? Number.parseFloat(value) : Number.parseFloat(value) * 1000) || 0

/** Summary of a result for display: level, tone, words and bar fill. */
export function describeStrength(result, levels) {
  if (result.empty) return { level: -1, tone: 'neutral', name: '', text: 'Enter a password to check its strength', fill: 0 }
  const level = levelFor(result.grade, levels)
  const name = LEVEL_NAMES[levels][level]
  const time = describeTime(result.crackSeconds)
  return {
    level,
    tone: toneFor(level, levels),
    name,
    time,
    text: `${name} password`,
    fill: Math.max(Number(token('bar-minimum')) || 0, Math.min(1, result.bits / FULL_BITS)),
  }
}

/** The bar drawn along the field's bottom edge (pass to TextField `inputOverlay`). */
export function StrengthUnderline({ result, levels }) {
  const { tone, fill } = describeStrength(result, levels)
  return <span className="a1-password-strength__underline" data-tone={tone} style={{ '--a1-pw-fill': fill }} aria-hidden="true" />
}

// Screen readers hear the strength once typing pauses, not on every key.
function useAnnouncement(message) {
  const [spoken, setSpoken] = useState('')
  useEffect(() => {
    const timer = setTimeout(() => setSpoken(message), ms(token('announce-delay')))
    return () => clearTimeout(timer)
  }, [message])
  return spoken
}

/**
 * @param {object} props
 * @param {ReturnType<import('./password-model.js').analysePassword>} props.result
 * @param {3|4|5} [props.levels=4]
 * @param {string} [props.variant='segments']  One of STRENGTH_STYLES.
 * @param {string} props.id  Id of the value text, for the field's aria-describedby.
 * @param {boolean} [props.showSuggestions=true]
 */
export function StrengthMeter({ result, levels = 4, variant = 'segments', id, showSuggestions = true }) {
  const strength = describeStrength(result, levels)
  const { level, tone, name, time, fill } = strength
  const valueText = result.empty ? strength.text : variant === 'time' ? `${name}: would take ${time} to guess` : `${name} password`
  const spoken = useAnnouncement(result.empty ? '' : `Password strength: ${valueText}.`)
  const showBadge = variant === 'badge' || variant === 'checklist'
  // The checklist already lists the length rule, so its tip would repeat it.
  const tips = result.suggestions.filter(tip => variant !== 'checklist' || tip.id !== 'length').slice(0, 2)

  return (
    <div className="a1-password-strength" data-variant={variant} data-tone={tone} data-empty={result.empty || undefined}>
      <div className="a1-password-strength__meter" role="meter" aria-label="Password strength"
        aria-valuemin={0} aria-valuemax={levels} aria-valuenow={level + 1} aria-valuetext={valueText}>
        {variant === 'segments' && (
          <span className="a1-password-strength__segments" aria-hidden="true">
            {Array.from({ length: levels }, (_, i) => <span key={i} data-on={i <= level || undefined} />)}
          </span>
        )}
        {variant === 'bar' && (
          <span className="a1-password-strength__bar" aria-hidden="true"><StatusBar value={fill * 100} size="sm" aria-label="Password strength" /></span>
        )}
        {variant === 'ring' && (
          <span className="a1-password-strength__ring" aria-hidden="true">
            <CircularProgress value={result.empty ? 0 : ((level + 1) / levels) * 100} size="sm" aria-label="Password strength">
              <Icon name={level === levels - 1 ? 'lock' : 'lock_open'} size="xs" />
            </CircularProgress>
          </span>
        )}
        {variant === 'time' && <Icon name="timer" size="sm" aria-hidden="true" />}
        {showBadge && !result.empty ? (
          <MessageBadge status={tone} subtle size="sm" icon={null}><span id={id}>{name}</span></MessageBadge>
        ) : (
          <span className="a1-password-strength__text" id={id}>
            {result.empty ? strength.text : variant === 'time'
              ? <><strong>{name}:</strong> would take {time} to guess</>
              : <><span className="a1-sr-only">Strength: </span>{name}</>}
          </span>
        )}
      </div>

      {variant === 'checklist' && (
        <List size="sm" variant="icon" className="a1-password-strength__checklist" aria-label="Password requirements">
          {result.checks.map(check => (
            <ListItem key={check.id} icon={check.met ? 'check_circle' : 'radio_button_unchecked'} data-met={check.met || undefined}>
              {check.label}<span className="a1-sr-only">{check.met ? ', done' : ', not yet'}</span>
            </ListItem>
          ))}
        </List>
      )}

      {showSuggestions && !result.empty && tips.length > 0 && (
        <List size="sm" color="muted" icon="tips_and_updates" className="a1-password-strength__tips" aria-label="Suggestions">
          {tips.map(tip => <ListItem key={tip.id}>{tip.text}</ListItem>)}
        </List>
      )}

      <p className="a1-sr-only" role="status" aria-live="polite">{spoken}</p>
    </div>
  )
}
