import {
  Card,
  Code,
  Inset,
  Paragraph,
} from '@gtivr4/a1-design-system-react'
import { Choice } from './configKit.jsx'

const SPACE_OPTIONS = [4, 8, 12, 16, 24, 32, 40]

function optionLabel(value) {
  return String(value)
}

function buildInsetSnippet(config, utilityClass = '') {
  const className = utilityClass ? ` className="${utilityClass.replaceAll('"', '&quot;')}"` : ''
  const spaceStr = config.space !== 16 ? ` space={${config.space}}` : ''
  return `<Inset${className}${spaceStr}>\n  {/* children */}\n</Inset>`
}

export function getDefaultConfig() {
  return { space: 16 }
}

export function Preview({ config, utilityClass = '' }) {
  return (
    <Card>
      {/* The inset content sits on a contrasting surface (like the Bleed demo) so
          the uniform padding reads as a visible gap to the card edge. */}
      <Inset className={utilityClass || undefined} space={config.space}>
        <div
          style={{
            background: 'var(--semantic-color-action-background)',
            padding: 'var(--base-spacing-12)',
            color: 'var(--semantic-color-text-inverse)',
          }}
        >
          <Paragraph size="sm">
            Inset content — padded uniformly on all sides. The gap to the card edge is the inset.
          </Paragraph>
        </div>
      </Inset>
    </Card>
  )
}

export function Controls({ config, setConfig }) {
  return (
    <Choice prop="space"
      label="Space"
      hint="Uniform padding applied to all sides."
      size="compact"
      hideIndicator
      columns={4}
      value={config.space}
      onChange={(space) => setConfig((current) => ({ ...current, space }))}
      options={SPACE_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
    />
  )
}

export function Snippet({ config, utilityClass = '' }) {
  return <Code variant="block" wrapping copyCode>{buildInsetSnippet(config, utilityClass)}</Code>
}
