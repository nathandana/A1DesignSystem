import {
  BottomSheet,
  Code,
  Paragraph,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { Choice } from './configKit.jsx'

const DETENTS = [0.5, 0.92]

export function getDefaultConfig() {
  return { title: 'Filters', defaultDetent: 1 }
}

export function Preview({ config }) {
  return (
    <div className="a1-web-bottomsheet-preview">
      <Stack gap="sm" style={{ padding: 'var(--base-spacing-16)' }}>
        <Paragraph size="sm" color="muted">
          Page content behind the sheet — no scrim, separated by a shadow. Drag the handle to resize. (xs and sm only.)
        </Paragraph>
      </Stack>
      <BottomSheet
        key={config.defaultDetent}
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

function buildSnippet(config) {
  const props = [
    config.title ? `title="${config.title.replaceAll('"', '&quot;')}"` : null,
    'detents={[0.5, 0.92]}',
    config.defaultDetent !== 1 ? `defaultDetent={${config.defaultDetent}}` : null,
  ].filter(Boolean).join('\n  ')
  return `<BottomSheet\n  ${props}\n>\n  {/* scrollable content */}\n</BottomSheet>`
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildSnippet(config)}</Code>
}
