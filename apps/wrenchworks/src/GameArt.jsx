import { Icon, Paragraph } from '@gtivr4/a1-design-system-react'
import { formatMoney } from './formatters.js'

function VehicleArt({ variant = 'compact', parked = false }) {
  return (
    <div
      className={[
        'a1-wrenchworks-car',
        `a1-wrenchworks-car--${variant}`,
        parked && 'a1-wrenchworks-car--parked',
      ].filter(Boolean).join(' ')}
      aria-hidden="true"
    >
      <span className="a1-wrenchworks-car__body" />
      <span className="a1-wrenchworks-car__cabin" />
      <span className="a1-wrenchworks-car__window a1-wrenchworks-car__window--front" />
      <span className="a1-wrenchworks-car__window a1-wrenchworks-car__window--rear" />
      <span className="a1-wrenchworks-car__light" />
      <span className="a1-wrenchworks-car__wheel a1-wrenchworks-car__wheel--front" />
      <span className="a1-wrenchworks-car__wheel a1-wrenchworks-car__wheel--rear" />
    </div>
  )
}

function MechanicArt({ index }) {
  return (
    <span
      className={`a1-wrenchworks-mechanic a1-wrenchworks-mechanic--${index}`}
      aria-hidden="true"
    >
      <span className="a1-wrenchworks-mechanic__head" />
      <span className="a1-wrenchworks-mechanic__cap" />
      <span className="a1-wrenchworks-mechanic__body" />
      <span className="a1-wrenchworks-mechanic__arm" />
      <span className="a1-wrenchworks-mechanic__legs" />
    </span>
  )
}

export function GarageScene({ business, serviceState, economy, game }) {
  const progress =
    economy.jobDuration > 0
      ? ((game.lastTickAt / 1000) % economy.jobDuration) / economy.jobDuration * 100
      : 0
  const visibleCrew = Math.min(3, serviceState.staff)

  return (
    <figure
      className={[
        'a1-wrenchworks-scene',
        `a1-wrenchworks-scene--${business.tone}`,
        serviceState.manager && 'a1-wrenchworks-scene--managed',
      ].filter(Boolean).join(' ')}
      aria-labelledby="a1-wrenchworks-scene-caption"
    >
      <div className="a1-wrenchworks-scene__sky" aria-hidden="true">
        <span className="a1-wrenchworks-scene__sun" />
        <span className="a1-wrenchworks-scene__cloud a1-wrenchworks-scene__cloud--one" />
        <span className="a1-wrenchworks-scene__cloud a1-wrenchworks-scene__cloud--two" />
        <span className="a1-wrenchworks-scene__building a1-wrenchworks-scene__building--one" />
        <span className="a1-wrenchworks-scene__building a1-wrenchworks-scene__building--two" />
        <span className="a1-wrenchworks-scene__building a1-wrenchworks-scene__building--three" />
      </div>

      <div className="a1-wrenchworks-shop" aria-hidden="true">
        <span className="a1-wrenchworks-shop__roof" />
        <span className="a1-wrenchworks-shop__sign">Wrenchworks</span>
        <span className="a1-wrenchworks-shop__office">
          <span className="a1-wrenchworks-shop__office-window" />
          <span className="a1-wrenchworks-shop__office-door" />
        </span>
        <span className="a1-wrenchworks-shop__bay a1-wrenchworks-shop__bay--one">
          <span className="a1-wrenchworks-shop__lift" />
          <VehicleArt variant={business.vehicle} parked />
        </span>
        <span className="a1-wrenchworks-shop__bay a1-wrenchworks-shop__bay--two">
          <span className="a1-wrenchworks-shop__lift" />
        </span>
        <span className="a1-wrenchworks-shop__manager">
          <span className="a1-wrenchworks-shop__manager-window" />
        </span>
      </div>

      <div className="a1-wrenchworks-scene__crew">
        {Array.from({ length: visibleCrew }, (_, index) => (
          <MechanicArt index={index + 1} key={index} />
        ))}
      </div>

      <div className="a1-wrenchworks-scene__earnings" aria-hidden="true">
        <span>+{formatMoney(economy.jobRevenue)}</span>
      </div>

      <div className="a1-wrenchworks-scene__road" aria-hidden="true">
        <span className="a1-wrenchworks-scene__road-line" />
        <VehicleArt variant={business.vehicle} />
      </div>

      <figcaption id="a1-wrenchworks-scene-caption" className="a1-sr-only">
        {business.name} is running with {serviceState.staff} technician
        {serviceState.staff === 1 ? '' : 's'}
        {serviceState.manager ? ' and a manager' : ''}.
      </figcaption>

      <div className="a1-wrenchworks-scene__job">
        <span className="a1-wrenchworks-scene__job-icon" aria-hidden="true">
          <Icon name={business.icon} />
        </span>
        <span className="a1-wrenchworks-scene__job-copy">
          <strong>{business.jobName}</strong>
          <progress
            className="a1-wrenchworks-progress"
            max="100"
            value={progress}
            aria-label={`${business.jobName} progress`}
          />
        </span>
      </div>
    </figure>
  )
}

export function BusinessThumbnail({ business, locked = false }) {
  return (
    <div
      className={[
        'a1-wrenchworks-thumbnail',
        `a1-wrenchworks-thumbnail--${business.tone}`,
        locked && 'a1-wrenchworks-thumbnail--locked',
      ].filter(Boolean).join(' ')}
      aria-hidden="true"
    >
      <span className="a1-wrenchworks-thumbnail__sun" />
      <span className="a1-wrenchworks-thumbnail__shop">
        <span className="a1-wrenchworks-thumbnail__roof" />
        <span className="a1-wrenchworks-thumbnail__door" />
        <span className="a1-wrenchworks-thumbnail__window" />
      </span>
      <VehicleArt variant={business.vehicle} parked />
      {locked && (
        <span className="a1-wrenchworks-thumbnail__lock">
          <Icon name="lock" />
        </span>
      )}
    </div>
  )
}

export function NoAdsMark() {
  return (
    <div className="a1-wrenchworks-no-ads" aria-label="No ads ever">
      <span className="a1-wrenchworks-no-ads__mark" aria-hidden="true">
        <Icon name="favorite" />
      </span>
      <Paragraph size="sm">
        <strong>No ads. No purchases. Just your garage.</strong>
      </Paragraph>
    </div>
  )
}
