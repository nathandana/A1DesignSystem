/**
 * Pattern registry. Each entry is a `PatternDefinition` (see `patternTypes.ts`):
 * a reusable, governed composition of A1 components. For now this holds a single
 * example — a page header — that the Patterns page renders. Future patterns
 * (footers, scenario cards, whole pages) and a pattern editor will read and write
 * this same shape.
 */

/**
 * Page header — breadcrumb, title, supporting text, and a primary/secondary
 * action pair. The layout, surface, and structure are locked so every page
 * header looks the same; the title, description, breadcrumb, and action labels
 * stay editable per page.
 *
 * @type {import('./patternTypes').PatternDefinition}
 */
const pageHeaderPattern = {
  schemaVersion: '1.0',
  pattern: {
    id: 'page-header',
    name: 'Page header',
    description:
      'The standard header for a content page: breadcrumb, title, a short supporting description, and a primary/secondary action pair. The section surface, padding, border, and the row/title/action layout are locked so headers stay consistent; the title, description, breadcrumb, and button labels are editable per page.',
    category: 'header',
    tags: ['layout', 'header', 'navigation', 'actions'],
    nodes: [
      {
        id: 'ph-section',
        type: 'Section',
        props: {
          as: 'header',
          padding: 'lg',
          surface: 'panel',
          gap: 'md',
          borderSize: 'sm',
          borderVariant: 'subtle',
          borderSides: ['bottom'],
          contentWidth: 'xl',
        },
        // The whole header is structural and its surface/spacing/border are governed.
        lock: { node: true, props: ['as', 'padding', 'surface', 'gap', 'borderSize', 'borderVariant', 'borderSides'] },
        children: [
          {
            id: 'ph-row',
            type: 'Stack',
            // Titles on the start, actions on the end; stacks on small viewports.
            props: {
              direction: { xs: 'column', md: 'row' },
              justify: 'between',
              align: { xs: 'start', md: 'end' },
              gap: 'md',
            },
            lock: { node: true, props: ['direction', 'justify', 'align'] },
            children: [
              {
                id: 'ph-titles',
                type: 'Stack',
                props: { direction: 'column', gap: 'xs' },
                lock: { props: ['direction'] },
                children: [
                  {
                    id: 'ph-breadcrumb',
                    type: 'Breadcrumb',
                    props: {
                      items: [
                        { id: 'home', label: 'Home', href: '/' },
                        { id: 'section', label: 'Reports', href: '/reports' },
                        { id: 'current', label: 'Quarterly summary' },
                      ],
                    },
                  },
                  {
                    id: 'ph-title',
                    type: 'Heading',
                    props: { as: 'h1', size: 'xl' },
                    content: { fallback: 'Quarterly summary' },
                  },
                  {
                    id: 'ph-description',
                    type: 'Paragraph',
                    props: { color: 'muted' },
                    content: { fallback: 'Review performance across the last quarter and export the figures your team needs.' },
                  },
                ],
              },
              {
                id: 'ph-actions',
                type: 'ButtonContainer',
                props: { align: 'end' },
                lock: { node: true, props: ['align'] },
                children: [
                  {
                    id: 'ph-secondary',
                    type: 'Button',
                    props: { variant: 'secondary', icon: 'download' },
                    content: { fallback: 'Export' },
                  },
                  {
                    id: 'ph-primary',
                    type: 'Button',
                    props: { variant: 'primary', icon: 'add' },
                    content: { fallback: 'New report' },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
}

/**
 * Overview card — an icon, heading, a definition list of key facts, and an
 * optional action row. The card surface + icon are locked; the heading, facts,
 * and actions stay editable.
 *
 * @type {import('./patternTypes').PatternDefinition}
 */
const overviewCardPattern = {
  schemaVersion: '1.0',
  pattern: {
    id: 'overview-card',
    name: 'Overview card',
    description:
      'A summary card: an icon, a heading, a definition list of key facts, and an optional action row. The card surface and icon are locked so every overview reads the same; the heading, facts, and actions are editable.',
    category: 'card',
    tags: ['card', 'summary', 'metadata'],
    nodes: [
      {
        id: 'oc-card',
        type: 'Card',
        props: { variant: 'default', icon: 'account_circle', iconDisplay: 'default' },
        lock: { node: true, props: ['variant', 'icon', 'iconDisplay'] },
        children: [
          {
            id: 'oc-stack',
            type: 'Stack',
            props: { direction: 'column', gap: 'sm' },
            lock: { props: ['direction'] },
            children: [
              { id: 'oc-heading', type: 'Heading', props: { as: 'h3', size: 'md' }, content: { fallback: 'Account overview' } },
              {
                id: 'oc-list',
                type: 'DefinitionList',
                props: {
                  direction: 'row',
                  size: 'sm',
                  labelWidth: 'fixed',
                  items: [
                    { label: 'Plan', value: 'Enterprise' },
                    { label: 'Seats', value: '24 of 50' },
                    { label: 'Renews', value: 'June 30, 2026' },
                  ],
                },
              },
              {
                id: 'oc-actions',
                type: 'ButtonContainer',
                props: { align: 'start' },
                children: [
                  { id: 'oc-action-primary', type: 'Button', props: { variant: 'secondary', size: 'sm' }, content: { fallback: 'Manage plan' } },
                  { id: 'oc-action-link', type: 'Button', props: { variant: 'tertiary', size: 'sm', icon: 'arrow_forward', iconPosition: 'end' }, content: { fallback: 'View details' } },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
}

// A feature card (icon + heading + supporting text) for the three-card lockup.
function featureCard(id, icon, heading, text) {
  return {
    id,
    type: 'Card',
    props: { variant: 'default', icon, iconDisplay: 'default' },
    lock: { props: ['variant'] },
    children: [
      {
        id: `${id}-stack`,
        type: 'Stack',
        props: { direction: 'column', gap: 'xs' },
        children: [
          { id: `${id}-heading`, type: 'Heading', props: { as: 'h3', size: 'sm' }, content: { fallback: heading } },
          { id: `${id}-text`, type: 'Paragraph', props: { size: 'sm', color: 'muted' }, content: { fallback: text } },
        ],
      },
    ],
  }
}

/**
 * Three-card lockup — a section with a centered heading and three feature cards
 * in a row (stacking on small screens). The section spacing and the three-column
 * grid are locked; each card's heading and text are editable.
 *
 * @type {import('./patternTypes').PatternDefinition}
 */
const threeCardLockupPattern = {
  schemaVersion: '1.0',
  pattern: {
    id: 'three-card-lockup',
    name: 'Three-card lockup',
    description:
      'A section with a centered heading and three feature cards in a row that stack on small screens. The section padding and the three-column grid are locked so the lockup stays balanced; the heading and each card’s content are editable.',
    category: 'section',
    tags: ['section', 'grid', 'cards', 'features'],
    nodes: [
      {
        id: 'tcl-section',
        type: 'Section',
        props: { as: 'section', padding: 'xl', gap: 'lg', contentWidth: 'xl' },
        lock: { node: true, props: ['padding', 'gap', 'contentWidth'] },
        children: [
          { id: 'tcl-heading', type: 'Heading', props: { as: 'h2', size: 'lg', align: 'center' }, content: { fallback: 'Built for teams' } },
          {
            id: 'tcl-grid',
            type: 'Grid',
            props: { columns: { xs: 1, md: 3 }, gap: 'md' },
            lock: { node: true, props: ['columns', 'gap'] },
            children: [
              featureCard('tcl-card-1', 'bolt', 'Fast by default', 'Performant interfaces with no extra tuning.'),
              featureCard('tcl-card-2', 'shield', 'Secure & accessible', 'Governed components you can trust out of the box.'),
              featureCard('tcl-card-3', 'insights', 'Insightful', 'Clear data displays that scale with your product.'),
            ],
          },
        ],
      },
    ],
  },
}

/**
 * Quote callout — a narrow, centered section with a large feature blockquote and
 * a single call to action. The section width and quote treatment are locked; the
 * quote text, attribution, and action label are editable.
 *
 * @type {import('./patternTypes').PatternDefinition}
 */
const quoteCalloutPattern = {
  schemaVersion: '1.0',
  pattern: {
    id: 'quote-callout',
    name: 'Quote callout',
    description:
      'A narrow, centered section with a large feature blockquote and a single call to action. The section width, alignment, and the quote treatment are locked; the quote text, attribution, and action label are editable.',
    category: 'section',
    tags: ['section', 'quote', 'callout', 'testimonial'],
    nodes: [
      {
        id: 'qc-section',
        type: 'Section',
        props: { as: 'section', padding: 'xl', gap: 'lg', contentWidth: 'sm', align: 'center' },
        lock: { node: true, props: ['padding', 'contentWidth', 'align'] },
        children: [
          {
            id: 'qc-quote',
            type: 'Blockquote',
            props: { variant: 'feature', cite: 'Jordan Lee, Head of Design' },
            lock: { props: ['variant'] },
            content: { fallback: 'A1 let us ship a consistent, accessible product three times faster — without a single bespoke component.' },
          },
          {
            id: 'qc-actions',
            type: 'ButtonContainer',
            props: { align: 'center' },
            children: [
              { id: 'qc-action', type: 'Button', props: { variant: 'primary', icon: 'arrow_forward', iconPosition: 'end' }, content: { fallback: 'Read the story' } },
            ],
          },
        ],
      },
    ],
  },
}

/**
 * Card showcase — a section with a locked heading and a **constrained blank
 * area** (Slot). The slot only accepts Cards or the Overview card pattern, so a
 * page author fills the showcase with on-brand cards but can't drop arbitrary
 * components in. The section, its spacing, the heading structure, and the slot's
 * rules are locked; the heading text and the cards the author adds are editable.
 *
 * @type {import('./patternTypes').PatternDefinition}
 */
const cardShowcasePattern = {
  schemaVersion: '1.0',
  pattern: {
    id: 'card-showcase',
    name: 'Card showcase',
    description:
      'A section with a centered heading and a constrained blank area (Slot) that accepts 1–4 Cards or the Overview card pattern. The section spacing, heading layout, and the slot’s rules are locked, so page authors fill the area with the allowed cards (no more than four) and nothing else. Demonstrates pattern blank areas, item count limits, and allowing a pattern inside a pattern.',
    category: 'section',
    tags: ['section', 'slot', 'blank-area', 'cards'],
    nodes: [
      {
        id: 'cs-section',
        type: 'Section',
        props: { as: 'section', padding: 'xl', gap: 'lg', contentWidth: 'xl' },
        lock: { node: true, props: ['padding', 'gap', 'contentWidth'] },
        children: [
          {
            id: 'cs-heading',
            type: 'Heading',
            props: { as: 'h2', size: 'lg', align: 'center' },
            lock: { props: ['align'] },
            content: { fallback: 'Featured' },
          },
          {
            // A constrained drop zone: only Cards or the Overview card pattern.
            // No `node` lock so the area stays fillable; its rules (label/allow)
            // are locked so an instance can't loosen the constraint.
            id: 'cs-slot',
            type: 'Slot',
            props: {
              label: 'Add cards here',
              allow: ['Card'],
              allowPatterns: ['overview-card'],
              min: 1,
              max: 4,
              // The grid layout is locked down so the showcase stays a tidy
              // two-column grid; `gap` is left open for per-page tuning.
              columns: 2,
              gap: 'md',
            },
            lock: { props: ['label', 'allow', 'allowPatterns', 'min', 'max', 'columns'] },
          },
        ],
      },
    ],
  },
}

/** All available patterns, in display order. */
export const PATTERNS = [
  pageHeaderPattern,
  overviewCardPattern,
  threeCardLockupPattern,
  quoteCalloutPattern,
  cardShowcasePattern,
]

/** Look up a pattern definition by id (used to expand `PatternRef` nodes). */
export function getPattern(id) {
  return PATTERNS.find((pattern) => pattern.pattern.id === id)
}
