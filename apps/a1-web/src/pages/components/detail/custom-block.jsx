import { Code, CustomBlock, Stack, TextField, TextareaField } from '@gtivr4/a1-design-system-react'
import { useT } from '../../../labels/useT.js'
import { Choice, Lockable, WithHelp } from './configKit.jsx'

export const jsonType = 'CustomBlock'
export function getDefaultConfig() {
  return { title: '', markup: '', css: '', js: '', height: 'md' }
}

export function fromJson(node) {
  const props = node?.props ?? {}
  const config = getDefaultConfig()
  for (const key of ['title', 'markup', 'css', 'js']) {
    if (typeof props[key] === 'string') config[key] = props[key]
  }
  if (['sm', 'md', 'lg'].includes(props.height)) config.height = props.height
  return config
}

export function toJson(config) {
  return { node: { id: 'custom-block-1', type: jsonType, props: fromJson({ props: config }) }, note: null }
}

export function Preview({ config, utilityClass = '' }) {
  return <CustomBlock {...fromJson({ props: config })} className={utilityClass} />
}

export function Controls({ config, setConfig }) {
  const t = useT()
  const set = (key, value) => setConfig((current) => ({ ...current, [key]: value }))
  return (
    <Stack gap="md">
      {['title', 'markup', 'css', 'js'].map((key) => {
        const Field = key === 'title' ? TextField : TextareaField
        return (
          <WithHelp key={key} helper={t(`customBlock.${key}Help`)}>
            <Lockable prop={key}>
              <Field
                label={t(`customBlock.${key}`)}
                size="compact"
                {...(key === 'title' ? {} : { rows: 8, spellCheck: false })}
                value={config[key] ?? ''}
                onChange={(event) => set(key, event.target.value)}
              />
            </Lockable>
          </WithHelp>
        )
      })}
      <Choice
        prop="height"
        label={t('customBlock.height')}
        helper={t('customBlock.heightHelp')}
        value={config.height}
        onChange={(value) => set('height', value)}
        options={['sm', 'md', 'lg'].map((value) => ({ value, label: t(`customBlock.${value}`) }))}
      />
    </Stack>
  )
}

export function Snippet({ config, utilityClass = '' }) {
  const props = { ...fromJson({ props: config }), ...(utilityClass ? { className: utilityClass } : {}) }
  return <Code variant="block" wrapping copyCode>{`<CustomBlock\n${Object.entries(props).map(([key, value]) => `  ${key}={${JSON.stringify(value)}}`).join('\n')}\n/>`}</Code>
}
