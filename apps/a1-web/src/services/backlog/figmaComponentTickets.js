import { allComponents } from '../../pages/components/utils.js'
import figmaComponentGuidelines from '../../../FIGMA_COMPONENT_GUIDELINES.md?raw'

const FIGMA_SCOPE_PREFIX = 'figma:'
const REGISTRY_ONLY_COMPONENTS = [
  { id: 'split-button', title: 'Split Button', packages: ['React', 'Figma'] },
  { id: 'snackbar-stack', title: 'SnackbarStack', packages: ['React'] },
  { id: 'canvas-edge', title: 'CanvasEdge', packages: ['React'] },
]

const PRIORITY_BY_COMPONENT = {
  // P0: core primitives and controls used on almost every designed screen.
  heading: 'p0',
  paragraph: 'p0',
  section: 'p0',
  card: 'p0',
  icon: 'p0',
  link: 'p0',
  'icon-button': 'p0',
  'text-field': 'p0',
  select: 'p0',
  'checkbox-group': 'p0',
  'radio-group': 'p0',
  dialog: 'p0',
  menu: 'p0',

  // P1: common application structure, form composition, and high-frequency feedback.
  list: 'p1',
  divider: 'p1',
  stack: 'p1',
  grid: 'p1',
  'page-layout': 'p1',
  'button-container': 'p1',
  breadcrumb: 'p1',
  'side-nav': 'p1',
  'top-header': 'p1',
  tabs: 'p1',
  'search-field': 'p1',
  textarea: 'p1',
  fieldset: 'p1',
  'field-row': 'p1',
  'choice-group': 'p1',
  autocomplete: 'p1',
  banner: 'p1',
  badge: 'p1',
  'empty-state': 'p1',
  tooltip: 'p1',
  accordion: 'p1',
  'data-table': 'p1',
  'split-button': 'p1',

  // P3: experimental, highly specialized, or mostly implementation-detail rows.
  calendar: 'p3',
  canvas: 'p3',
  node: 'p3',
  'canvas-edge': 'p3',
  'bottom-sheet': 'p3',
}

const PRIORITY_LABEL = {
  p0: 'P0',
  p1: 'P1',
  p2: 'P2',
  p3: 'P3',
}

const COMPOSITIONAL_COMPONENTS = new Set([
  'accordion',
  'autocomplete',
  'bottom-drawer',
  'bottom-sheet',
  'breadcrumb',
  'button-container',
  'canvas',
  'chip',
  'context-menu',
  'data-table',
  'definition-list',
  'dialog',
  'fieldset',
  'field-row',
  'grid',
  'menu',
  'overlay',
  'page-layout',
  'page-nav',
  'side-nav',
  'snackbar-stack',
  'sticky-actions',
  'tabs',
  'toolbar',
  'top-header',
  'tree-menu',
])

const FIELD_COMPONENTS = new Set([
  'autocomplete',
  'checkbox-group',
  'choice-group',
  'credit-card-field',
  'date-field',
  'fieldset',
  'field-row',
  'inline-editable',
  'number-field',
  'phone-field',
  'radio-group',
  'search-field',
  'select',
  'switch',
  'text-field',
  'textarea',
  'time-field',
  'zip-field',
])

const TEXT_COMPONENTS = new Set(['blockquote', 'code', 'divider', 'heading', 'inline', 'list', 'paragraph'])

const ICON_COMPONENTS = new Set([
  'action-tile',
  'badge',
  'banner',
  'bottom-drawer',
  'button',
  'card',
  'chip',
  'empty-state',
  'icon',
  'icon-button',
  'link',
  'menu',
  'notification',
  'overlay',
  'side-nav',
  'split-button',
  'tabs',
  'toolbar',
  'top-header',
  'tree-menu',
])

const STATUS_COMPONENTS = new Set([
  'badge',
  'banner',
  'card',
  'circular-progress',
  'dialog',
  'empty-state',
  'notification',
  'overlay',
  'snackbar',
  'status-bar',
])

const LAYOUT_COMPONENTS = new Set([
  'bleed',
  'button-container',
  'card',
  'grid',
  'inset',
  'page-layout',
  'section',
  'spacer',
  'stack',
])

const OVERLAY_COMPONENTS = new Set(['bottom-sheet', 'context-menu', 'dialog', 'menu', 'overlay', 'tooltip'])

const COMPONENT_SPECIFIC_GUIDANCE = {
  menu: [
    'Build Menu as a compositional shell with a native Figma slot for Menu Item/Menu Section children; the shell itself should not be a variant grid.',
    'Build Menu Item/Menu Section as reusable child components. Child items own label, icon, shortcut, active/disabled/destructive/state behavior.',
    'Validate icon color variables in every Menu Item state so swapped icons do not stay black.',
  ],
  'context-menu': [
    'Reuse the Menu/Menu Item model where possible; Context Menu should focus on positioning context and item composition rather than duplicating row internals.',
    'Represent item, divider, and group entries as reusable child components or slots instead of baking every row into the parent.',
  ],
  toolbar: [
    'Split reusable controls such as buttons, toggles, groups, menus, and dividers into child components or slots.',
    'Keep overflow/menu behavior documented as a Figma gap unless it can be represented without misleading designers.',
  ],
  'data-table': [
    'Favor compositional table parts such as header, row, cell, notice, empty state, pagination, and filter controls over a single giant variant matrix.',
    'Show representative column types and density behavior, but keep runtime sorting/filtering/pagination documented as behavior gaps.',
  ],
  tabs: [
    'Represent the supported variants and selected/disabled states, but keep Tab and TabPanel content compositional through child components or slots.',
    'Do not create separate parent variants for every possible tab count; use editable child instances.',
  ],
  'text-field': [
    'Mirror optional label, value, hint, error, required, disabled/read-only, and focus behavior exactly; hint/error content must be toggleable.',
    'Use the comfortable required badge treatment instead of an asterisk.',
  ],
  textarea: [
    'Follow the field-family model for label, value, hint, error, required, disabled/read-only, focus, and resize behavior.',
    'Use multiline value text and tokenized field sizing instead of stretching a Text Field instance by hand.',
  ],
  figure: [
    'Represent image, caption, radius, size, aspect ratio, crop presets, and placeholder behavior; document freeform cropping as a Figma gap if needed.',
    'Do not use decorative background-image behavior here; content images belong to Figure.',
  ],
  icon: [
    'Use the registered icon font or approved icon component source; keep size/color/fill properties token-bound and swappable.',
    'Imported Vector internals are acceptable only when their visible fills are variable-bound.',
  ],
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function guidelineBullets(sectionTitle, limit = 4) {
  const match = figmaComponentGuidelines.match(new RegExp(`^## ${escapeRegex(sectionTitle)}\\n([\\s\\S]*?)(?=\\n## |$)`, 'm'))
  if (!match) return []
  return match[1]
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2))
    .slice(0, limit)
}

const CORE_GUIDELINES = guidelineBullets('Core validation checklist', 10)
const COMPOSITION_GUIDELINES = guidelineBullets('Split repeated children into components', 2)
const SLOT_GUIDELINES = guidelineBullets('Use slots for compositional parents', 2)
const PROPERTY_GUIDELINES = guidelineBullets('Use component properties', 2)
const TOKEN_GUIDELINES = guidelineBullets('Bind tokens and styles', 2)

function componentGuidance(component) {
  const guidance = [...(COMPONENT_SPECIFIC_GUIDANCE[component.id] ?? [])]

  if (FIELD_COMPONENTS.has(component.id)) {
    guidance.push('Expose editable label/value/message text and boolean properties for optional content that React can show or hide.')
    guidance.push('Validate field typography, required markers, focus rings, disabled/read-only styling, and error colors against the React component.')
  }

  if (TEXT_COMPONENTS.has(component.id)) {
    guidance.push('Bind text styles to the matching typography tokens and preserve semantic sizing instead of drawing custom text styles.')
  }

  if (COMPOSITIONAL_COMPONENTS.has(component.id)) {
    guidance.push(...COMPOSITION_GUIDELINES, ...SLOT_GUIDELINES)
  }

  if (ICON_COMPONENTS.has(component.id)) {
    guidance.push('Use icon component properties or instance swaps for configurable icons, and verify nested icon fills use the current foreground variable.')
  }

  if (STATUS_COMPONENTS.has(component.id)) {
    guidance.push('Bind status colors to semantic status variables and verify light/dark behavior without component-local dark-mode overrides.')
  }

  if (LAYOUT_COMPONENTS.has(component.id)) {
    guidance.push('Use auto layout, Hug/Fill/Fixed resizing, and slots to make the layout contract editable instead of drawing a static mockup.')
  }

  if (OVERLAY_COMPONENTS.has(component.id)) {
    guidance.push('Represent surface, trigger/content/action slots, and visible states; document runtime positioning, focus, portal, and dismissal behavior as Figma gaps.')
  }

  guidance.push(...PROPERTY_GUIDELINES, ...TOKEN_GUIDELINES)

  return [...new Set(guidance)].slice(0, 7)
}

function componentPriority(component) {
  return PRIORITY_BY_COMPONENT[component.id] ?? 'p2'
}

function ticketDescription(component) {
  const visibleInA1Web = allComponents.some((item) => item.id === component.id)
  const priority = PRIORITY_LABEL[componentPriority(component)] ?? 'P2'
  const guidance = componentGuidance(component).map((item) => `- ${item}`).join('\n')
  const coreChecklist = CORE_GUIDELINES.map((item) => `- ${item}`).join('\n')
  return `## Objective
Create the ${component.title} component in the A1 Figma design system file and update coverage only after the asset is usable.

## Why
Figma coverage should match the component inventory so designers can use the same component contract as React.

## Priority rationale
Initial priority: ${priority}. Priorities are based on how often the component blocks real screen design in Figma: P0 for foundational primitives and core controls, P1 for common app structure/forms/feedback, P2 for specialized components, and P3 for experimental or niche component rows.

## Read first
- apps/a1-web/FIGMA_COMPONENT_GUIDELINES.md
- packages/react/ai/figma-workflow.md
- The ${component.title} React component API, Storybook stories, and a1-web configurator.

## Component-specific guidance
${guidance}

## Core checklist from FIGMA_COMPONENT_GUIDELINES.md
${coreChecklist}

## Acceptance criteria
- The Figma component inserts successfully from asset search.
- The default inserted variant matches the documented Figma default for this component.
- Meaningful React props are represented as component properties, variants, child components, or documented Figma gaps.
- Tokens/variables drive color, spacing, radius, typography, focus rings, effects, disabled states, and interactive states.
- Light and dark mode are verified against the shared Color collection variables.
- Code Connect is added under packages/figma/code-connect/ when supported; otherwise the blocker is documented.
- packages/react/ai/figma-workflow.md, packages/react/ai/components.md, the affected changelog, and the maintenance log are updated.
- ${visibleInA1Web ? `The /components package filter shows ${component.title} under Figma after the registry update.` : `The component registry marks ${component.title} as available in Figma after the registry update.`}`
}

export function figmaComponentTicketSpecs() {
  const components = [...allComponents, ...REGISTRY_ONLY_COMPONENTS]
  return components
    .filter((component) => !(component.packages ?? []).includes('Figma'))
    .map((component) => ({
      title: `Create Figma component: ${component.title}`,
      description: ticketDescription(component),
      type: 'feature',
      priority: componentPriority(component),
      complexity: 'm',
      scope: {
        kind: 'component',
        ref: `${FIGMA_SCOPE_PREFIX}${component.id}`,
        label: component.title,
      },
    }))
}

export async function ensureFigmaComponentTickets(existingItems, createItem, updateItem) {
  const existingByRef = new Map(
    existingItems
      .filter((item) => item.scopeKind === 'component' && item.scopeRef?.startsWith(FIGMA_SCOPE_PREFIX))
      .map((item) => [item.scopeRef, item]),
  )
  let changed = 0
  for (const spec of figmaComponentTicketSpecs()) {
    const existing = existingByRef.get(spec.scope.ref)
    if (existing) {
      const patch = {}
      if (existing.priority !== spec.priority) patch.priority = spec.priority
      if (existing.complexity !== spec.complexity) patch.complexity = spec.complexity
      if (updateItem && Object.keys(patch).length > 0) {
        await updateItem(existing, patch)
        changed += 1
      }
      continue
    }
    await createItem(spec)
    changed += 1
  }
  return changed
}
