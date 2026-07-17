import {
  BottomSheet,
  Code,
  Paragraph,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { Choice } from './configKit.jsx'
import { useInResponsivePreview } from './responsivePreview.js'

const DETENTS = [0.5, 0.92]

export function getDefaultConfig() {
  return { title: 'Filters', defaultDetent: 1 }
}

export function Preview({ config, utilityClass = '' }) {
  const inResponsivePreview = useInResponsivePreview()

  const sheet = (
    <BottomSheet
      key={config.defaultDetent}
      className={utilityClass || undefined}
      title={config.title || undefined}
      detents={DETENTS}
      defaultDetent={config.defaultDetent}
    >
      <Stack gap="sm">
        {Array.from({ length: 8 }).map((_, i) => (
          <Paragraph key={i}>Scrollable content line {i + 1}</Paragraph>
        ))}
      </Stack>
    </BottomSheet>
  )

  // In the responsive-preview iframe the BottomSheet can use its native
  // position:fixed and pin naturally to the device viewport bottom. The
  // bounded preview container is only needed in the "Fit" (non-iframe) view
  // to stop the fixed sheet from escaping to the browser-window bottom.
  if (inResponsivePreview) {
    return (
      <Stack gap="sm" style={{ padding: 'var(--base-spacing-16)' }}>
        <Paragraph size="sm" color="muted">
          Page content behind the sheet — no scrim, separated by a shadow. (xs and sm only.)
        </Paragraph>
        {sheet}
      </Stack>
    )
  }

  return (
    <div className="a1-web-bottomsheet-preview">
      <Stack gap="sm" style={{ padding: 'var(--base-spacing-16)' }}>
        <Paragraph size="sm" color="muted">
          Page content behind the sheet — no scrim, separated by a shadow. Drag the handle to resize. (xs and sm only.)
        </Paragraph>
      </Stack>
      {sheet}
    </div>
  )
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))
  return (
    <Stack gap="lg">
      <TextField label="Title" size="compact" value={config.title} onChange={(e) => set({ title: e.target.value })} hint="The only line shown when collapsed" />
      <Choice
        label="Open state"
        prop="defaultDetent"
        value={config.defaultDetent}
        onChange={(v) => set({ defaultDetent: v })}
        options={[
          { value: 0, label: 'Collapsed', icon: 'expand_more' },
          { value: 1, label: 'Half', icon: 'height' },
          { value: 2, label: 'Full', icon: 'expand_less' },
        ]}
      />
    </Stack>
  )
}

function buildSnippet(config, utilityClass = '') {
  const props = [
    utilityClass ? `className="${utilityClass.replaceAll('"', '&quot;')}"` : null,
    config.title ? `title="${config.title.replaceAll('"', '&quot;')}"` : null,
    'detents={[0.5, 0.92]}',
    config.defaultDetent !== 1 ? `defaultDetent={${config.defaultDetent}}` : null,
  ].filter(Boolean).join('\n  ')
  return `<BottomSheet\n  ${props}\n>\n  {/* scrollable content */}\n</BottomSheet>`
}

export function Snippet({ config, utilityClass = '' }) {
  return <Code variant="block" wrapping copyCode>{buildSnippet(config, utilityClass)}</Code>
}

export const jsonType = 'BottomSheet'

export function toJson(config) {
  const props = {}
  if (config.title) props.title = config.title
  if (config.defaultDetent !== 1) props.defaultDetent = config.defaultDetent
  const node = { id: 'bottom-sheet-1', type: 'BottomSheet', props }
  return { node, note: 'BottomSheet children are page content; add child nodes in the page JSON when you need real sheet content.' }
}

export function fromJson(node) {
  const props = node?.props && typeof node.props === 'object' ? node.props : {}
  return {
    title: typeof props.title === 'string' ? props.title : 'Filters',
    defaultDetent: typeof props.defaultDetent === 'number' ? props.defaultDetent : 1,
  }
}
