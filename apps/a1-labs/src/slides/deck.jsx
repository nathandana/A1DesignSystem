import React from 'react'
import { Heading, Icon, Inverse, Paragraph } from '@gtivr4/a1-design-system-react'

// Sample deck, influenced by a reference presentation but drawn with A1
// components, tokens and invented copy. Attributes the deck reads:
//   data-part      a piece that cascades or fades on its own
//   data-morph="k" a piece shared with a neighbouring slide (morphs by key)
//   data-build     a point loaded by the content build setting

const RAMP = Array.from({ length: 10 }, (_, index) => index)

const Stripe = () => <div className="a1-slides__stripe" data-morph="stripe" aria-hidden="true"><span /><span /><span /><span /><span /><span /></div>

function TitleCard({ eyebrow, title, position }) {
  return (
    <div className={`a1-slides__card a1-slides__card--${position}`} data-morph="title-card">
      <Paragraph size="sm" color="muted">{eyebrow}</Paragraph>
      <Heading as="h2" type="display" size="lg">{title}</Heading>
    </div>
  )
}

function Ramp({ hue }) {
  return (
    <div className="a1-slides__ramp" aria-hidden="true">
      {RAMP.map(index => (
        <span key={index} data-morph={`ramp-${index}`} style={{ background: `var(--component-slides-ramp-${hue}-${index})` }} />
      ))}
    </div>
  )
}

function Header({ children }) {
  return <div className="a1-slides__header" data-morph="header"><Heading as="h2" size="xl">{children}</Heading></div>
}

const Logo = ({ size }) => (
  <div className={`a1-slides__logo a1-slides__logo--${size}`} data-morph="logo" aria-hidden="true"><Icon name="view_in_ar" fill /></div>
)

export const DECK = [
  {
    id: 'title', title: 'A1', accent: 'var(--semantic-color-action-background)',
    render: () => (
      <div className="a1-slides__layout a1-slides__layout--title">
        <Logo size="lg" />
        <div className="a1-slides__lockup">
          <div data-part><Heading as="h2" type="display" size="jumbo">A1</Heading></div>
          <div data-part><Paragraph size="lg" color="muted">One design system for every product</Paragraph></div>
        </div>
        <Stripe />
      </div>
    ),
  },
  {
    id: 'foundations', title: 'Foundations', accent: 'var(--semantic-color-status-warn-background)',
    render: () => <div className="a1-slides__layout a1-slides__layout--ramp"><Ramp hue="warm" /><TitleCard eyebrow="Part 1" title="Foundations" position="bottom" /></div>,
  },
  {
    id: 'components', title: 'Components', accent: 'var(--semantic-color-status-info-background)',
    render: () => <div className="a1-slides__layout a1-slides__layout--ramp"><Ramp hue="cool" /><TitleCard eyebrow="Part 2" title="Components" position="top" /></div>,
  },
  {
    id: 'what', title: 'What is a design system?', accent: 'var(--semantic-color-action-background)',
    render: () => (
      <div className="a1-slides__layout a1-slides__layout--banded">
        <Header>What is a design system?</Header>
        <ol className="a1-slides__points" data-part>
          {['Shared tokens for colour and type', 'Accessible components', 'Patterns for common tasks', 'Guidance for content', 'Tools for design and code', 'A team that supports it'].map((point, index) => (
            <li key={point} data-build><span className="a1-slides__number" aria-hidden="true">{index + 1}</span><Paragraph as="span">{point}</Paragraph></li>
          ))}
        </ol>
        <Stripe />
      </div>
    ),
  },
  {
    id: 'definition', title: 'A shared language', accent: 'var(--semantic-color-action-background)',
    render: () => (
      <div className="a1-slides__layout a1-slides__layout--banded">
        <Header>A shared language</Header>
        <div className="a1-slides__copy" data-part>
          <Paragraph size="lg" data-build>A design system is a shared set of standards, components and guidance that helps teams build consistent, accessible products faster.</Paragraph>
          <Paragraph size="lg" color="muted" data-build>It lets designers and developers spend less time rebuilding the basics and more time on what makes their product useful.</Paragraph>
        </div>
        <Stripe />
      </div>
    ),
  },
  {
    id: 'collection', title: 'A collection of', accent: 'var(--semantic-color-surface-inverse)', inverse: true,
    render: () => (
      <Inverse className="a1-slides__layout a1-slides__layout--collection">
        <div data-part><Heading as="h2" size="md" color="muted">A collection of</Heading></div>
        <ul className="a1-slides__pills">
          {[['palette', 'Foundations', 'Colour, type and spacing'], ['widgets', 'Components', 'Buttons, fields and navigation'], ['dashboard', 'Patterns', 'Forms, tables and layouts']].map(([icon, title, detail]) => (
            <li key={title} data-build>
              <span className="a1-slides__pill-icon" aria-hidden="true"><Icon name={icon} /></span>
              <span><Heading as="h3" size="sm">{title}</Heading><Paragraph as="span" size="sm" color="muted">{detail}</Paragraph></span>
            </li>
          ))}
        </ul>
      </Inverse>
    ),
  },
  {
    id: 'truth', title: 'Single source of truth', accent: 'var(--semantic-color-status-success-background)',
    render: () => (
      <div className="a1-slides__layout a1-slides__layout--statement" data-tone="success">
        <div className="a1-slides__big-icon" data-morph="big-icon" aria-hidden="true"><Icon name="chevron_right" /></div>
        <TitleCard eyebrow="One place for every decision" title="Single source of truth" position="side" />
      </div>
    ),
  },
  {
    id: 'access', title: 'Accessibility built in', accent: 'var(--semantic-color-status-info-background)',
    render: () => (
      <div className="a1-slides__layout a1-slides__layout--statement" data-tone="info">
        <div className="a1-slides__big-icon" data-morph="big-icon" aria-hidden="true"><Icon name="accessibility_new" /></div>
        <TitleCard eyebrow="Built in, not bolted on" title="Accessibility" position="side" />
      </div>
    ),
  },
  {
    id: 'why', title: 'Why it matters', accent: 'var(--semantic-color-status-error-background)',
    render: () => (
      <div className="a1-slides__layout a1-slides__layout--why">
        <div className="a1-slides__why-copy">
          <div data-part><Heading as="h2" type="display" size="xJumbo">Why?</Heading></div>
          <div data-part><Paragraph color="muted">Sample results from teams that share one system.</Paragraph></div>
        </div>
        <ul className="a1-slides__bars">
          {[['2× faster delivery', 40], ['45% fewer defects', 65], ['90% shared components', 90]].map(([label, value]) => (
            <li key={label} data-build style={{ '--a1-slides-bar': `${value}%` }}>
              <span className="a1-slides__bar" aria-hidden="true" />
              <Paragraph as="span" size="sm">{label}</Paragraph>
            </li>
          ))}
        </ul>
        <Stripe />
      </div>
    ),
  },
  {
    id: 'together', title: 'A1 and you', accent: 'var(--semantic-color-action-background)',
    render: () => (
      <div className="a1-slides__layout a1-slides__layout--together">
        <div className="a1-slides__equation" data-part>
          <Logo size="sm" />
          <Heading as="h2" type="display" size="xl" className="a1-slides__equation-text">
            A1 <Icon name="add" size="lg" color="accent" /><span className="a1-slides__sr">and</span> you
          </Heading>
        </div>
        <div className="a1-slides__badge" data-part><Heading as="p" size="lg">Better together</Heading></div>
      </div>
    ),
  },
]
