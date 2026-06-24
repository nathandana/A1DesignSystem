import { useEffect, useState } from 'react'
import {
  Code,
  NumberField,
  Pagination,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { Choice } from './configKit.jsx'

const SIZE_OPTIONS = ['sm', 'md']
const SIBLINGS_OPTIONS = [0, 1, 2]

function optionLabel(value) {
  if (typeof value === 'number') return String(value)
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function buildPaginationSnippet(config, utilityClass = '') {
  const props = [
    utilityClass ? `className="${utilityClass.replaceAll('"', '&quot;')}"` : null,
    `page={page}`,
    `totalPages={${config.totalPages}}`,
    config.siblings !== 1 ? `siblings={${config.siblings}}` : null,
    config.size !== 'md' ? `size="${config.size}"` : null,
    `onChange={setPage}`,
  ].filter(Boolean).join('\n  ')

  return `const [page, setPage] = useState(1)\n\n<Pagination\n  ${props}\n/>`
}

export function getDefaultConfig() {
  return {
    totalPages: 10,
    siblings: 1,
    size: 'md',
  }
}

export function Preview({ config, utilityClass = '' }) {
  const [page, setPage] = useState(3)

  useEffect(() => {
    setPage(Math.min(3, config.totalPages))
  }, [config.totalPages])

  return (
    <Pagination
      className={utilityClass || undefined}
      page={page}
      totalPages={config.totalPages}
      siblings={config.siblings}
      size={config.size}
      onChange={setPage}
    />
  )
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))

  return (
    <Stack gap="lg">
      <NumberField
        label="Total pages"
        size="compact"
        value={config.totalPages}
        onChange={(event) => {
          const n = Math.max(2, Math.min(50, parseInt(event.target.value, 10) || 10))
          set({ totalPages: n })
        }}
      />
      <Choice prop="siblings"
        label="Siblings"
        hint="Page buttons shown on each side of the current page."
        size="compact"
        hideIndicator
        columns={3}
        value={config.siblings}
        onChange={(siblings) => set({ siblings })}
        options={SIBLINGS_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <Choice prop="size"
        label="Size"
        size="compact"
        hideIndicator
        columns={2}
        value={config.size}
        onChange={(size) => set({ size })}
        options={SIZE_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
    </Stack>
  )
}

export function Snippet({ config, utilityClass = '' }) {
  return <Code variant="block" wrapping copyCode>{buildPaginationSnippet(config, utilityClass)}</Code>
}
