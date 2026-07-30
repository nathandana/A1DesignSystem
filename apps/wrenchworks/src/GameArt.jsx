import { Icon, Paragraph } from '@gtivr4/a1-design-system-react'
import neighborhoodGarage from './assets/garage-neighborhood.jpg'
import performanceGarage from './assets/garage-performance.jpg'
import dealershipGarage from './assets/garage-dealership.jpg'
import { getWorldTier } from './workshopMovement.js'

const worldImages = {
  neighborhood: neighborhoodGarage,
  performance: performanceGarage,
  dealership: dealershipGarage,
}

export function BusinessThumbnail({ business, locked = false }) {
  const tier = getWorldTier(business.id)

  return (
    <div
      className={[
        'a1-wrenchworks-thumbnail',
        locked && 'a1-wrenchworks-thumbnail--locked',
      ].filter(Boolean).join(' ')}
    >
      <img
        src={worldImages[tier]}
        alt={`${business.name} workshop`}
        loading="lazy"
      />
      <span className="a1-wrenchworks-thumbnail__label">
        <Icon name={business.icon} aria-hidden="true" />
        {business.shortName}
      </span>
      {locked && (
        <span className="a1-wrenchworks-thumbnail__lock" aria-label="Locked">
          <Icon name="lock" aria-hidden="true" />
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
