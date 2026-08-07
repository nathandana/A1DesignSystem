import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Sphere,
} from 'react-simple-maps'
import countries from 'world-atlas/countries-110m.json'

export function VisitMap({ locations, label }) {
  const points = Array.isArray(locations) ? locations : []

  return (
    <ComposableMap
      width={800}
      height={390}
      projectionConfig={{ scale: 135 }}
      role="img"
      aria-label={label}
      style={{ width: '100%', height: 'auto' }}
    >
      <Sphere
        id="visit-map-sphere"
        fill="var(--semantic-color-surface-page)"
        stroke="var(--semantic-color-border-subtle)"
      />
      <Geographies geography={countries}>
        {({ geographies }) => geographies.map((geography) => (
          <Geography
            key={geography.rsmKey}
            geography={geography}
            tabIndex={-1}
            aria-hidden="true"
            focusable="false"
            fill="var(--semantic-color-surface-panel)"
            stroke="var(--semantic-color-border-subtle)"
            strokeWidth="var(--component-chart-tooltip-border-width)"
          />
        ))}
      </Geographies>
      {points.map((point) => (
        <Marker key={`${point.name}-${point.coordinates.join('-')}`} coordinates={point.coordinates}>
          <circle
            r="var(--semantic-spacing-gap-xs)"
            fill="var(--component-chart-series-accent)"
            stroke="var(--semantic-color-surface-raised)"
            strokeWidth="var(--component-chart-line-stroke-width)"
          >
            <title>{`${point.name}: ${point.value}`}</title>
          </circle>
        </Marker>
      ))}
    </ComposableMap>
  )
}
