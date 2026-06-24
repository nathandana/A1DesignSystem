import { useMemo, useState } from 'react'
import {
  Breadcrumb,
  Canvas,
  Heading,
  Icon,
  Node,
  NodeConnector,
  Paragraph,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { getFoundationBreadcrumbItems } from './utils.js'

/**
 * System map — a Canvas/Node visualization of how A1 fits together: tokens are the
 * root, themes / icons / labels / rules contribute to the component library, and
 * components compose into the pages, patterns, and projects of the a1-web editor.
 *
 * The graph is authored as explicit node + edge data (below) so every relationship
 * traces to something real in the repo — nothing is decorative.
 */

// Layer → node color. Roles, not arbitrary hues: sources (accent/info), built
// packages (success), the component hub (warn), everything downstream (neutral).
const LAYER = {
  tokens:     { x: 120,  color: 'accent'  },
  system:     { x: 400,  color: 'info'    },
  packages:   { x: 700,  color: 'success' },
  components: { x: 1000, color: 'warn'    },
  compose:    { x: 1290, color: 'neutral' },
  app:        { x: 1580, color: 'neutral' },
}

// Every node: id, its layer, label, a one-line role, and the repo path (shown on hover).
const NODES = [
  // Token tiers — the root. base → semantic → component.
  { id: 'base',      layer: 'tokens', label: 'Base',      sublabel: 'Raw values',          path: 'system/tokens (base.*)',            x: 120,  y: 250 },
  { id: 'semantic',  layer: 'tokens', label: 'Semantic',  sublabel: 'Intent aliases',      path: 'system/tokens (semantic.*)',        x: 120,  y: 380 },
  { id: 'comp-tok',  layer: 'tokens', label: 'Component', sublabel: 'Per-component tokens', path: 'system/tokens/component (component.*)', x: 120, y: 510 },

  // System authoring — everything else under system/.
  { id: 'themes',  layer: 'system', label: 'Themes', sublabel: '8 theme overrides',    path: 'system/themes',  x: 400, y: 150 },
  { id: 'icons',   layer: 'system', label: 'Icons',  sublabel: 'Material Symbols',     path: 'system/icons',   x: 400, y: 300 },
  { id: 'labels',  layer: 'system', label: 'Labels', sublabel: 'Localized strings',    path: 'system/labels',  x: 400, y: 430 },
  { id: 'rules',   layer: 'system', label: 'Rules',  sublabel: 'Design rules (YAML)',  path: 'system/rules',   x: 400, y: 560 },

  // Packages — the build targets. React is the source of truth; the rest replicate it.
  { id: 'react',  layer: 'packages', label: 'React',          sublabel: 'Source of truth',  path: 'packages/react',           x: 700, y: 100 },
  { id: 'pure',   layer: 'packages', label: 'Pure',           sublabel: 'HTML / CSS (BEM)', path: 'packages/pure',            x: 700, y: 210 },
  { id: 'rn',     layer: 'packages', label: 'React Native',   sublabel: 'Native components', path: 'packages/react-native',   x: 700, y: 320 },
  { id: 'wc',     layer: 'packages', label: 'Web Components',  sublabel: 'Lit-based',        path: 'packages/web-components',  x: 700, y: 430 },
  { id: 'figma',  layer: 'packages', label: 'Figma',          sublabel: 'Code Connect',     path: 'packages/figma',           x: 700, y: 540 },
  { id: 'eslint', layer: 'packages', label: 'ESLint plugin',  sublabel: 'Enforces rules',   path: 'packages/eslint-plugin-a1', x: 700, y: 650 },

  // The component library — the hub everything converges on.
  { id: 'components', layer: 'components', label: 'Components', sublabel: '59 components', path: 'packages/react/src/components', x: 1000, y: 375, size: 'lg' },

  // Compositions — the a1-web editor's content model.
  { id: 'patterns', layer: 'compose', label: 'Patterns', sublabel: 'Governed compositions', path: 'apps/a1-web/src/patterns', x: 1290, y: 300 },
  { id: 'pages',    layer: 'compose', label: 'Pages',    sublabel: 'Page definitions',      path: 'apps/a1-web/src/editor',  x: 1290, y: 450 },

  // App & consumers.
  { id: 'datasets', layer: 'app', label: 'Datasets', sublabel: 'Data-driven content',         path: 'apps/a1-web/src/data',     x: 1580, y: 160 },
  { id: 'projects', layer: 'app', label: 'Projects', sublabel: 'Pages + patterns + themes',   path: 'apps/a1-web/src/projects', x: 1580, y: 320 },
  { id: 'a1-web',   layer: 'app', label: 'a1-web',   sublabel: 'The editor app',              path: 'apps/a1-web',              x: 1580, y: 470, size: 'lg' },
  { id: 'examples', layer: 'app', label: 'Examples', sublabel: 'Demo sites',                  path: 'examples/',                x: 1580, y: 630 },
]

// Edges. 'spine' = builds into (solid). 'feeds' = contributes to / governs / maps (dashed).
const EDGES = [
  // Token tier chain
  { from: 'base', to: 'semantic', kind: 'spine' },
  { from: 'semantic', to: 'comp-tok', kind: 'spine' },

  // Tokens are consumed by every package (via the Style Dictionary build)
  { from: 'comp-tok', to: 'react', kind: 'spine' },
  { from: 'comp-tok', to: 'pure', kind: 'feeds' },
  { from: 'comp-tok', to: 'rn', kind: 'feeds' },
  { from: 'comp-tok', to: 'wc', kind: 'feeds' },

  // Themes derive from the base ramps and ship as theme CSS in the packages
  { from: 'base', to: 'themes', kind: 'feeds' },
  { from: 'themes', to: 'react', kind: 'feeds' },
  { from: 'themes', to: 'pure', kind: 'feeds' },

  // Rules generate the ESLint plugin and govern the components
  { from: 'rules', to: 'eslint', kind: 'feeds' },
  { from: 'rules', to: 'components', kind: 'feeds' },

  // The component library lives in React; labels + icons feed it; Figma maps it
  { from: 'react', to: 'components', kind: 'spine' },
  { from: 'labels', to: 'components', kind: 'feeds' },
  { from: 'icons', to: 'components', kind: 'feeds' },
  { from: 'components', to: 'figma', kind: 'feeds' },

  // Components compose into patterns and pages; patterns nest into pages
  { from: 'components', to: 'patterns', kind: 'spine' },
  { from: 'components', to: 'pages', kind: 'spine' },
  { from: 'patterns', to: 'pages', kind: 'feeds' },

  // Datasets bind data into pages
  { from: 'datasets', to: 'pages', kind: 'feeds' },

  // Pages + patterns roll up into projects, which the editor app manages
  { from: 'pages', to: 'projects', kind: 'spine' },
  { from: 'patterns', to: 'projects', kind: 'spine' },
  { from: 'themes', to: 'projects', kind: 'feeds' },
  { from: 'projects', to: 'a1-web', kind: 'spine' },

  // Packages also power the standalone example sites
  { from: 'react', to: 'examples', kind: 'feeds' },
  { from: 'pure', to: 'examples', kind: 'feeds' },
]

const LEGEND = [
  { color: 'accent', label: 'Token tiers (the root)' },
  { color: 'info',   label: 'System authoring' },
  { color: 'success', label: 'Packages' },
  { color: 'warn',   label: 'Component library' },
  { color: 'muted',  label: 'Compositions & app' },
]

export function SystemMapFoundationPage({ onNavigate }) {
  const initialNodes = useMemo(
    () => NODES.map((n) => ({ ...n, color: LAYER[n.layer].color })),
    [],
  )

  const [positions, setPositions] = useState(() =>
    Object.fromEntries(initialNodes.map((n) => [n.id, { x: n.x, y: n.y }])),
  )

  const nodes = initialNodes.map((n) => ({ ...n, ...(positions[n.id] ?? {}) }))

  return (
    <>
      <Section
        padding="xs"
        contentWidth="xl"
        surface="panel"
        borderSize="sm"
        borderVariant="accent"
        borderSides="bottom"
      >
        <Stack direction="column" gap="xs">
          <Breadcrumb items={getFoundationBreadcrumbItems('System map', onNavigate)} />
          <Heading as="h1" id="system-map-heading" size={{ xs: 'lg', md: 'xxl' }}>
            System map
          </Heading>
          <Paragraph size="sm" color="muted">
            How A1 fits together, end to end. Design tokens are the root — base values
            alias up to semantic roles and then component tokens. Themes, icons, labels,
            and rules contribute to the component library, which composes into the pages,
            patterns, and projects of the a1-web editor. Token-to-package edges run through
            the Style Dictionary build. Click any node to trace what it connects to; drag
            to rearrange; right-click the canvas to fit or reset.
          </Paragraph>
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="xl" aria-labelledby="system-map-heading">
        <Stack gap="md">
          {/* Legend */}
          <Stack direction="row" gap="md" wrap align="center">
            {LEGEND.map((item) => (
              <Stack key={item.label} direction="row" gap="xs" align="center">
                <Icon name="square" fill color={item.color} size="sm" aria-hidden="true" />
                <Paragraph as="span" size="sm" color="muted">{item.label}</Paragraph>
              </Stack>
            ))}
            <Stack direction="row" gap="xs" align="center">
              <Icon name="trending_flat" color="muted" size="sm" aria-hidden="true" />
              <Paragraph as="span" size="sm" color="muted">Builds into</Paragraph>
            </Stack>
            <Stack direction="row" gap="xs" align="center">
              <Icon name="more_horiz" color="muted" size="sm" aria-hidden="true" />
              <Paragraph as="span" size="sm" color="muted">Contributes to / maps</Paragraph>
            </Stack>
          </Stack>

          <div style={{ height: 680 }}>
            <Canvas
              showGrid
              showControls
              traceConnections
              draggableNodes
              onNodeMove={(id, x, y) => setPositions((prev) => ({ ...prev, [id]: { x, y } }))}
              defaultZoom={0.62}
              defaultPan={{ x: 24, y: 24 }}
              aria-label="A1 system architecture graph"
            >
              {nodes.map((n) => (
                <Node
                  key={n.id}
                  id={n.id}
                  x={n.x}
                  y={n.y}
                  label={n.label}
                  sublabel={n.sublabel}
                  title={n.path}
                  shape="rectangle"
                  size={n.size ?? 'md'}
                  color={n.color}
                />
              ))}
              {EDGES.map((e) => (
                <NodeConnector
                  key={`${e.from}-${e.to}`}
                  id={`${e.from}-${e.to}`}
                  from={e.from}
                  to={e.to}
                  direction="to"
                  variant={e.kind === 'spine' ? 'solid' : 'dashed'}
                />
              ))}
            </Canvas>
          </div>
        </Stack>
      </Section>
    </>
  )
}
