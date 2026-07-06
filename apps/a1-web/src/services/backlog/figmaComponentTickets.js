import { allComponents } from '../../pages/components/utils.js'

const FIGMA_SCOPE_PREFIX = 'figma:'
const REGISTRY_ONLY_COMPONENTS = [
  { id: 'split-button', title: 'Split Button', packages: ['React'] },
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

function componentPriority(component) {
  return PRIORITY_BY_COMPONENT[component.id] ?? 'p2'
}

function ticketDescription(component) {
  const visibleInA1Web = allComponents.some((item) => item.id === component.id)
  const priority = componentPriority(component).toUpperCase()
  return `## Objective
Create the ${component.title} component in the A1 Figma design system file and update coverage so Figma is marked implemented only after the asset is usable.

## Why
Figma coverage should match the component inventory so designers can use the same component contract as React.

## Priority rationale
Initial priority: ${priority}. Priorities are based on how often the component blocks real screen design in Figma: P0 for foundational primitives and core controls, P1 for common app structure/forms/feedback, P2 for specialized components, and P3 for experimental or niche component rows.

## First-pass requirements
- Read packages/react/ai/figma-workflow.md and the ${component.title} React API before creating the Figma asset.
- Mirror React props that can be represented in Figma as component properties or variants, using exact prop names and values where possible.
- Bind colors, spacing, radius, typography, focus rings, and state styling to A1 Figma variables or text styles; do not hardcode values.
- Cover the required sizes, variants, and states shown by the React component, Storybook stories, and a1-web configurator.
- Confirm light and dark modes work through shared Color collection variables, not duplicate dark-mode overrides inside the component.
- Add docs or example frames showing the default, core variants, disabled/focus/hover/pressed where applicable, and realistic content.
- Add or update a repo-side Code Connect template under packages/figma/code-connect/ when supported; otherwise document the publishing blocker.
- Update packages/react/ai/figma-workflow.md with the component mapping and any Figma-only gaps.
- Update packages/react/ai/components.md and a1-web package coverage so Figma is marked implemented.
- Update the affected changelog and maintenance log.

## Acceptance criteria
- The Figma component inserts successfully from asset search.
- The default inserted variant matches the documented Figma default for this component.
- Typography matches the React component's tokenized styles and weights.
- Icons, focus rings, disabled states, and interactive states use the correct variables.
- Light and dark mode are verified.
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
      if (updateItem && (existing.priority !== spec.priority || existing.complexity !== spec.complexity)) {
        await updateItem(existing, { priority: spec.priority, complexity: spec.complexity })
        changed += 1
      }
      continue
    }
    await createItem(spec)
    changed += 1
  }
  return changed
}
