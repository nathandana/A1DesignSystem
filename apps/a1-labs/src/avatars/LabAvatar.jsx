import React, { useState } from 'react'
import { Icon } from '@gtivr4/a1-design-system-react'
import {
  AVATAR_BORDERS, AVATAR_COLORS, AVATAR_CONTENT, AVATAR_RADII, AVATAR_SIZES, AVATAR_STATUSES,
  avatarLabel, initialsFor, patternFor, tintFor,
} from './avatar-model.js'
import './avatars.css'

const pick = (list, value, fallback) => (list.includes(value) ? value : fallback)

// Candidate extension of A1 Avatar: same sizes and tokens, plus radius, colour,
// border, status and experimental content. Independent of the Labs shell.
export function LabAvatar({
  name,
  src,
  cutoutSrc,
  content = 'initials',
  size = 'md',
  radius = 'full',
  color = 'neutral',
  border = 'hairline',
  status,
  initialsCount = 2,
  popOut = false,
  className = '',
  ...rest
}) {
  const [failedSrc, setFailedSrc] = useState(null)
  const resolvedContent = pick(AVATAR_CONTENT, content, 'initials')
  const imageSrc = popOut && cutoutSrc ? cutoutSrc : src
  const showImage = resolvedContent === 'image' && !!imageSrc && failedSrc !== imageSrc
  // An image that is missing or fails falls back to initials, as in A1 Avatar.
  const shown = resolvedContent === 'image' && !showImage ? 'initials' : resolvedContent
  const resolvedStatus = AVATAR_STATUSES.includes(status) ? status : undefined
  const resolvedColor = pick(AVATAR_COLORS, color, 'neutral')
  const tone = resolvedColor === 'tinted' ? tintFor(name) : resolvedColor
  const breaksFrame = showImage && popOut && !!cutoutSrc
  const classes = [
    'a1-avatar-lab',
    `a1-avatar-lab--${pick(AVATAR_SIZES, size, 'md')}`,
    `a1-avatar-lab--radius-${pick(AVATAR_RADII, radius, 'full')}`,
    `a1-avatar-lab--border-${pick(AVATAR_BORDERS, border, 'hairline')}`,
    `a1-avatar-lab--tone-${tone}`,
    `a1-avatar-lab--content-${shown}`,
    breaksFrame && 'a1-avatar-lab--pop-out',
    className,
  ].filter(Boolean).join(' ')
  const label = avatarLabel(name, resolvedStatus)

  return (
    <span className={classes} role="img" aria-label={label || undefined} aria-hidden={label ? undefined : 'true'} {...rest}>
      <span className="a1-avatar-lab__frame" aria-hidden="true">
        {breaksFrame && <span className="a1-avatar-lab__backdrop" />}
        {shown === 'image' && (
          <img className="a1-avatar-lab__image" src={imageSrc} alt="" onError={() => setFailedSrc(imageSrc)} />
        )}
        {shown === 'initials' && <span className="a1-avatar-lab__initials">{initialsFor(name, initialsCount)}</span>}
        {shown === 'icon' && <Icon name="person" className="a1-avatar-lab__icon" />}
        {shown === 'pattern' && (
          <span className="a1-avatar-lab__pattern">
            {patternFor(name).flatMap((row, r) => row.map((on, c) => (
              <span key={`${r}-${c}`} className={on ? 'a1-avatar-lab__cell a1-avatar-lab__cell--on' : 'a1-avatar-lab__cell'} />
            )))}
          </span>
        )}
      </span>
      {resolvedStatus && <span className={`a1-avatar-lab__status a1-avatar-lab__status--${resolvedStatus}`} aria-hidden="true" />}
    </span>
  )
}

// Overlapping avatars with a "+N" overflow. `people` is [{ name, src? }].
export function LabAvatarGroup({ people = [], max = 4, label, size = 'md', ...avatarProps }) {
  const visible = people.slice(0, max)
  const extra = people.length - visible.length
  return (
    <span className={`a1-avatar-lab-group a1-avatar-lab-group--${pick(AVATAR_SIZES, size, 'md')}`} role="group" aria-label={label ?? `${people.length} people`}>
      {visible.map(person => (
        <LabAvatar key={person.name} {...avatarProps} size={size} name={person.name} src={person.src} status={undefined} popOut={false} />
      ))}
      {extra > 0 && (
        <span className={`a1-avatar-lab a1-avatar-lab--${pick(AVATAR_SIZES, size, 'md')} a1-avatar-lab--radius-${pick(AVATAR_RADII, avatarProps.radius, 'full')} a1-avatar-lab--border-hairline a1-avatar-lab--tone-neutral a1-avatar-lab--content-initials`}
          role="img" aria-label={`${extra} more`}>
          <span className="a1-avatar-lab__frame" aria-hidden="true"><span className="a1-avatar-lab__initials">+{extra}</span></span>
        </span>
      )}
    </span>
  )
}
