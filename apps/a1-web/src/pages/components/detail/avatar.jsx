import {
  Avatar,
  Code,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { Choice, WithHelp } from './configKit.jsx'
import { ImageSourceField } from './ImageSourceField.jsx'
import { useT } from '../../../labels/useT.js'
import { resolveSrc } from '../../../lib/imageLibrary.ts'
import { useImageLibraryVersion } from '../../../editor/ImageLibraryContext.jsx'

const SIZE_OPTIONS = [
  { value: 'xs', label: 'XS' },
  { value: 'sm', label: 'SM' },
  { value: 'md', label: 'MD' },
  { value: 'lg', label: 'LG' },
  { value: 'xl', label: 'XL' },
]

function quote(value) {
  return String(value ?? '').replaceAll('"', '&quot;')
}

function buildSnippet(config, utilityClass = '') {
  const props = [
    utilityClass ? `className="${quote(utilityClass)}"` : null,
    `name="${quote(config.name || 'Morgan Lee')}"`,
    config.src ? `src="${quote(config.src)}"` : null,
    config.alt !== config.name ? `alt="${quote(config.alt)}"` : null,
    config.initials ? `initials="${quote(config.initials)}"` : null,
    config.size !== 'md' ? `size="${config.size}"` : null,
  ].filter(Boolean).join(' ')
  return `<Avatar ${props} />`
}

export function getDefaultConfig() {
  return {
    name: 'Morgan Lee',
    src: '',
    alt: 'Morgan Lee',
    initials: '',
    size: 'md',
  }
}

export function Preview({ config, utilityClass = '' }) {
  useImageLibraryVersion()
  return (
    <Avatar
      className={utilityClass || undefined}
      name={config.name || 'Morgan Lee'}
      src={config.src ? resolveSrc(config.src) : undefined}
      alt={config.alt}
      initials={config.initials || undefined}
      size={config.size || 'md'}
    />
  )
}

export function Controls({ config, setConfig, projectId }) {
  const t = useT()
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))
  return (
    <Stack gap="lg">
      <WithHelp helper={t('app.configurator.avatarNameHelp', 'Used for the fallback initials and default accessible name.')}>
        <TextField
          label={t('app.configurator.avatarName', 'Name')}
          size="compact"
          value={config.name}
          onChange={(event) => set({ name: event.target.value, alt: config.alt === config.name ? event.target.value : config.alt })}
        />
      </WithHelp>
      <ImageSourceField
        value={config.src}
        onChange={(src) => set({ src })}
        alt={config.alt}
        onAltChange={(alt) => set({ alt })}
        projectId={projectId}
      />
      <WithHelp helper={t('app.configurator.avatarAltTextHelp', 'Use an empty value when an adjacent label already names the person.')}>
        <TextField
          label={t('app.configurator.avatarAltText', 'Alternative text')}
          size="compact"
          value={config.alt}
          onChange={(event) => set({ alt: event.target.value })}
        />
      </WithHelp>
      <WithHelp helper={t('app.configurator.avatarInitialsHelp', 'Leave empty to derive initials from the name.')}>
        <TextField
          label={t('app.configurator.avatarInitials', 'Initials override')}
          size="compact"
          value={config.initials}
          onChange={(event) => set({ initials: event.target.value })}
        />
      </WithHelp>
      <Choice
        prop="size"
        label={t('app.configurator.avatarSize', 'Size')}
        helper={t('app.configurator.avatarSizeHelp', 'Choose an A1 size from extra small through extra large.')}
        value={config.size}
        onChange={(size) => set({ size })}
        options={SIZE_OPTIONS}
      />
    </Stack>
  )
}

export function Snippet({ config, utilityClass = '' }) {
  return <Code variant="block" wrapping copyCode>{buildSnippet(config, utilityClass)}</Code>
}

export const jsonType = 'Avatar'

export function toJson(config) {
  return {
    type: 'Avatar',
    props: {
      name: config.name || 'Morgan Lee',
      src: config.src || undefined,
      alt: config.alt,
      initials: config.initials || undefined,
      size: config.size !== 'md' ? config.size : undefined,
    },
  }
}

export function fromJson(node) {
  const props = node?.props ?? {}
  const name = props.name || 'Morgan Lee'
  return {
    name,
    src: props.src || '',
    alt: props.alt === undefined ? name : props.alt,
    initials: props.initials || '',
    size: props.size || 'md',
  }
}
