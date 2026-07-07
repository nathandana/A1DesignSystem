import { useMemo, useState } from 'react'
import {
  Canvas,
  Heading,
  Icon,
  Node,
  NodeConnector,
  Paragraph,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { PageTitleArea } from '../PageTitleArea.jsx'
import { getFoundationBreadcrumbItems } from './utils.js'

/**
 * System map — a Canvas/Node visualization of how A1 fits together: authored
 * foundations flow through build tools into runtime CSS and packages, then
 * components compose into the pages, patterns, and projects of a1-web.
 *
 * The graph is authored as explicit node + edge data (below) so every relationship
 * traces to something real in the repo — nothing is decorative.
 */

// Layer → node color. Roles, not arbitrary hues: authored sources (accent/info),
// generated outputs/packages (success), runtime/component hubs (warn), and
// downstream compositions (neutral).
const LAYER = {
  tokens:     { color: 'accent'  },
  system:     { color: 'info'    },
  build:      { color: 'success' },
  runtime:    { color: 'warn'    },
  packages:   { color: 'success' },
  components: { color: 'warn'    },
  compose:    { color: 'neutral' },
  app:        { color: 'neutral' },
}

// Every node: id, its layer, label, a one-line role, and the repo path (shown on hover).
const NODES = [
  // Authored token tiers.
  { id: 'base',      layer: 'tokens', label: 'Base',      sublabel: 'Raw ramps & values',   path: 'system/tokens (base.*)',               x: 100, y: 120 },
  { id: 'semantic',  layer: 'tokens', label: 'Semantic',  sublabel: 'Intent aliases',       path: 'system/tokens (semantic.*)',           x: 100, y: 250 },
  { id: 'comp-tok',  layer: 'tokens', label: 'Component', sublabel: 'Optional API aliases', path: 'system/tokens/component (component.*)', x: 100, y: 380 },

  // Theme metadata is separate from structured token overrides. Shared mode
  // values drive the generated selector topology for each runtime target.
  { id: 'theme-overrides', layer: 'system', label: 'Theme overrides', sublabel: 'Structured token values', path: 'system/themes/*/overrides', x: 380, y: 80 },
  { id: 'theme-config', layer: 'system', label: 'Theme config', sublabel: 'Metadata + selectors', path: 'system/themes/*/theme.json', x: 380, y: 210 },
  { id: 'color-scheme', layer: 'system', label: 'Mode contract', sublabel: 'Shared light & dark roles', path: 'system/color-modes.mjs', x: 380, y: 340 },
  { id: 'icons',   layer: 'system', label: 'Icons',  sublabel: 'Material + project fonts', path: 'system/icons', x: 380, y: 470 },
  { id: 'labels',  layer: 'system', label: 'Labels', sublabel: 'Localized strings',   path: 'system/labels', x: 380, y: 580 },
  { id: 'rules',   layer: 'system', label: 'Rules',  sublabel: 'Design rules (YAML)', path: 'system/rules',  x: 380, y: 690 },

  // Build pipeline. Style Dictionary resolves only canonical tokens. The
  // custom theme loader validates metadata and structured override files.
  { id: 'style-dictionary', layer: 'build', label: 'Style Dictionary', sublabel: 'Resolve & transform DTCG', path: 'sd.config.js', x: 680, y: 130, size: 'lg' },
  { id: 'theme-builder', layer: 'build', label: 'Theme builder', sublabel: 'Validate + emit selectors', path: 'system/theme-config.mjs → system/build-themes.mjs', x: 680, y: 300 },
  { id: 'html-build', layer: 'build', label: 'HTML/CSS build', sublabel: 'Generate Pure themes', path: 'scripts/build-html-css.mjs', x: 680, y: 470 },
  { id: 'rules-build', layer: 'build', label: 'Rules build', sublabel: 'Generate lint rules', path: 'scripts/build-eslint-rules.mjs', x: 680, y: 640 },

  // Runtime artifacts and cascade. Import order is tokens → themes → color scheme.
  { id: 'tokens-css', layer: 'runtime', label: 'tokens.css', sublabel: ':root defaults', path: 'build/css/tokens.css → packages/react/src/tokens.css', x: 980, y: 80 },
  { id: 'tokens-json', layer: 'runtime', label: 'tokens.json', sublabel: 'Resolved data', path: 'build/json/tokens.json', x: 980, y: 200 },
  { id: 'themes-css', layer: 'runtime', label: 'themes.css', sublabel: 'Theme class overrides', path: 'packages/react/src/themes.css', x: 980, y: 320 },
  { id: 'scheme-css', layer: 'runtime', label: 'Color scheme CSS', sublabel: 'Generated modes + static rules', path: 'packages/react/src/color-scheme-{modes,static}.css', x: 980, y: 440 },
  { id: 'runtime-classes', layer: 'runtime', label: 'Runtime classes', sublabel: 'Theme + mode on html', path: 'apps/a1-web/src/main.jsx', x: 980, y: 560 },
  { id: 'inverse', layer: 'runtime', label: 'Inverse islands', sublabel: 'Opposite document mode', path: '.a1-inverse / [data-a1-color-scope="inverse"]', x: 980, y: 680 },

  // Packages — the build targets. React is the behavioral source of truth.
  { id: 'react',  layer: 'packages', label: 'React',          sublabel: 'Source of truth',   path: 'packages/react',            x: 1280, y: 80 },
  { id: 'pure',   layer: 'packages', label: 'Pure',           sublabel: 'HTML / CSS (BEM)',  path: 'packages/pure',             x: 1280, y: 200 },
  { id: 'rn',     layer: 'packages', label: 'React Native',   sublabel: 'Generated colors',  path: 'packages/react-native',     x: 1280, y: 320 },
  { id: 'wc',     layer: 'packages', label: 'Web Components', sublabel: 'Lit-based',         path: 'packages/web-components',   x: 1280, y: 440 },
  { id: 'figma',  layer: 'packages', label: 'Figma',          sublabel: 'Code Connect',      path: 'packages/figma',            x: 1280, y: 560 },
  { id: 'eslint', layer: 'packages', label: 'ESLint plugin',  sublabel: 'Enforces rules',    path: 'packages/eslint-plugin-a1', x: 1280, y: 680 },

  // The component library — the hub everything converges on.
  { id: 'components', layer: 'components', label: 'Components', sublabel: 'Semantic + optional component tokens', path: 'packages/react/src/components', x: 1570, y: 360, size: 'lg' },

  // Compositions — the a1-web editor's content model.
  { id: 'patterns', layer: 'compose', label: 'Patterns', sublabel: 'Governed compositions', path: 'apps/a1-web/src/patterns', x: 1850, y: 280 },
  { id: 'pages',    layer: 'compose', label: 'Pages',    sublabel: 'Page definitions',      path: 'apps/a1-web/src/editor',  x: 1850, y: 440 },

  // App & consumers.
  { id: 'datasets', layer: 'app', label: 'Datasets', sublabel: 'Data-driven content',       path: 'apps/a1-web/src/data',     x: 2130, y: 150 },
  { id: 'projects', layer: 'app', label: 'Projects', sublabel: 'Pages + patterns + themes', path: 'apps/a1-web/src/projects', x: 2130, y: 310 },
  { id: 'a1-web',   layer: 'app', label: 'a1-web',   sublabel: 'Runtime class switching',   path: 'apps/a1-web',              x: 2130, y: 470, size: 'lg' },
  { id: 'examples', layer: 'app', label: 'Examples', sublabel: 'Demo sites',                path: 'examples/',                x: 2130, y: 650 },
]

// Edges. 'spine' = builds into (solid). 'feeds' = contributes to / governs / maps (dashed).
const EDGES = [
  // Token tier chain
  { from: 'base', to: 'semantic', kind: 'spine' },
  { from: 'semantic', to: 'comp-tok', kind: 'spine' },

  // DTCG sources flow through Style Dictionary.
  { from: 'base', to: 'style-dictionary', kind: 'spine' },
  { from: 'semantic', to: 'style-dictionary', kind: 'spine' },
  { from: 'comp-tok', to: 'style-dictionary', kind: 'spine' },
  { from: 'style-dictionary', to: 'tokens-css', kind: 'spine' },
  { from: 'style-dictionary', to: 'tokens-json', kind: 'spine' },

  // Structured theme values bypass Style Dictionary and are emitted by the
  // shared validated theme loader.
  { from: 'theme-overrides', to: 'theme-builder', kind: 'spine' },
  { from: 'theme-config', to: 'theme-builder', kind: 'feeds' },
  { from: 'tokens-json', to: 'theme-builder', kind: 'feeds' },
  { from: 'color-scheme', to: 'theme-builder', kind: 'spine' },
  { from: 'theme-builder', to: 'themes-css', kind: 'spine' },
  { from: 'theme-builder', to: 'scheme-css', kind: 'spine' },

  // Pure and Native have additional generated paths from the same resolved data.
  { from: 'tokens-json', to: 'html-build', kind: 'feeds' },
  { from: 'theme-overrides', to: 'html-build', kind: 'feeds' },
  { from: 'theme-config', to: 'html-build', kind: 'feeds' },
  { from: 'html-build', to: 'pure', kind: 'spine' },
  { from: 'tokens-json', to: 'rn', kind: 'feeds' },
  { from: 'theme-builder', to: 'rn', kind: 'feeds' },

  // Runtime cascade and class activation.
  { from: 'tokens-css', to: 'react', kind: 'spine' },
  { from: 'themes-css', to: 'react', kind: 'feeds' },
  { from: 'scheme-css', to: 'react', kind: 'feeds' },
  { from: 'runtime-classes', to: 'themes-css', kind: 'feeds' },
  { from: 'runtime-classes', to: 'scheme-css', kind: 'feeds' },
  { from: 'scheme-css', to: 'inverse', kind: 'spine' },
  { from: 'inverse', to: 'components', kind: 'feeds' },
  { from: 'runtime-classes', to: 'a1-web', kind: 'feeds' },
  { from: 'tokens-css', to: 'wc', kind: 'feeds' },

  // Rules generate the ESLint plugin and govern the components
  { from: 'rules', to: 'rules-build', kind: 'spine' },
  { from: 'rules-build', to: 'eslint', kind: 'spine' },
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
  { from: 'runtime-classes', to: 'projects', kind: 'feeds' },
  { from: 'projects', to: 'a1-web', kind: 'spine' },

  // Packages also power the standalone example sites
  { from: 'react', to: 'examples', kind: 'feeds' },
  { from: 'pure', to: 'examples', kind: 'feeds' },
]

const LEGEND = [
  { color: 'accent', label: 'Authored token tiers' },
  { color: 'info',   label: 'Other authored foundations' },
  { color: 'success', label: 'Build outputs & packages' },
  { color: 'warn',   label: 'Runtime cascade & components' },
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
      <PageTitleArea
        headingId="system-map-heading"
        breadcrumbItems={getFoundationBreadcrumbItems('System map', onNavigate)}
        title="System map"
        description="How A1 fits together, end to end. Authored DTCG tokens pass through Style Dictionary into root CSS variables and resolved JSON. Structured theme overrides and selector metadata pass through a shared validator before React, Pure, and Native outputs are generated. Light, dark, system-preference, and inverse selectors are generated from one mode contract; static color-scheme CSS contains only the remaining resets and exceptional rules. At runtime, document classes and local inverse islands change the inherited variable set consumed by components. Click any node to trace its path; drag to rearrange; right-click to fit or reset."
      />

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

          <div style={{ height: 760 }}>
            <Canvas
              showGrid
              showControls
              traceConnections
              draggableNodes
              onNodeMove={(id, x, y) => setPositions((prev) => ({ ...prev, [id]: { x, y } }))}
              defaultZoom={0.48}
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
