import {
  Code,
  MessageBadge,
  Spacer,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { ConfigSlider, ResponsiveControl, responsiveProp } from './configKit.jsx'

const SIZE_OPTIONS = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl']

function buildSpacerSnippet(config) {
  const size = responsiveProp('size', config.size, 'md')
  return `<Spacer${size ? ` ${size}` : ''} />`
}

export function getDefaultConfig() {
  return { size: 'md' }
}

export function Preview({ config }) {
  return (
    <Stack direction="column" style={{ width: '100%' }}>
      <MessageBadge subtle>Block A</MessageBadge>
      <Spacer size={config.size} />
      <MessageBadge subtle>Block B</MessageBadge>
    </Stack>
  )
}

export function Controls({ config, setConfig }) {
  return (
    <ResponsiveControl prop="size" label="Size" value={config.size} onChange={(size) => setConfig((current) => ({ ...current, size }))} defaultValue="md">
      {(val, setVal) => <ConfigSlider values={SIZE_OPTIONS} value={val} onChange={setVal} />}
    </ResponsiveControl>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildSpacerSnippet(config)}</Code>
}
